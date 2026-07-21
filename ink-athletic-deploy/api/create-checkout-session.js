// Serverless checkout — runs on Vercel, never in the browser. Creates a Stripe
// Checkout Session for the cart and returns its hosted-payment URL. Product
// prices AND the shipping amount are resolved server-side (catalog + a fresh
// Shippo re-quote), so a tampered browser can't change what's charged.
//
// Env vars (Vercel → Settings → Environment Variables):
//   STRIPE_SECRET_KEY  — sk_test_… until launch, then sk_live_… on Production
//   SHIPPO_API_TOKEN   — shippo_test_… until launch

import Stripe from "stripe";
import { loadCatalog, buildParcel, getShippoRates } from "../src/shipping-lib.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: "Payments are not connected yet (missing STRIPE_SECRET_KEY)." });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const cart = body.cart || {};
    const address = body.address || {};
    const serviceToken = String(body.serviceToken || "");

    const catalog = await loadCatalog();
    const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));

    const line_items = [];
    for (const [id, qtyRaw] of Object.entries(cart)) {
      const p = byId[id];
      const qty = Math.max(1, Math.min(99, parseInt(qtyRaw, 10) || 0));
      if (!p || !p.buy || !p.inStock) continue; // out-of-stock items can never be purchased
      const unit_amount = Math.round((Number(p.price) || 0) * 100);
      if (unit_amount <= 0) continue;
      line_items.push({
        quantity: qty,
        price_data: {
          currency: "cad",
          unit_amount,
          product_data: { name: p.name, ...(p.line ? { description: p.line } : {}) }
        }
      });
    }
    if (!line_items.length) {
      return res.status(400).json({ error: "Your cart is empty or has no purchasable items." });
    }

    // Server-side shipping: re-quote Shippo fresh and use OUR amount for the
    // service the customer picked. Falls back to a flat rate if unavailable.
    let shippingOption = {
      shipping_rate_data: {
        type: "fixed_amount",
        fixed_amount: { amount: 1500, currency: "cad" },
        display_name: "Canada Post (flat rate)",
        delivery_estimate: {
          minimum: { unit: "business_day", value: 3 },
          maximum: { unit: "business_day", value: 9 }
        }
      }
    };
    if (process.env.SHIPPO_API_TOKEN && serviceToken && address.postalCode) {
      const addressTo = {
        zip: String(address.postalCode || "").trim(),
        state: String(address.province || "").trim(),
        city: String(address.city || "").trim(),
        country: "CA"
      };
      const parcel = buildParcel(cart, catalog);
      const { rates } = await getShippoRates({ token: process.env.SHIPPO_API_TOKEN, addressTo, parcel });
      const chosen = rates.find((r) => r.serviceToken === serviceToken);
      if (!chosen) {
        return res.status(400).json({ error: "That shipping option is no longer available — please re-check rates." });
      }
      shippingOption = {
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: Math.round(chosen.amount * 100), currency: "cad" },
          display_name: `${chosen.carrier} ${chosen.service}`,
          ...(chosen.days
            ? {
                delivery_estimate: {
                  minimum: { unit: "business_day", value: chosen.days },
                  maximum: { unit: "business_day", value: chosen.days + 2 }
                }
              }
            : {})
        }
      };
    }

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: { allowed_countries: ["CA"] },
      phone_number_collection: { enabled: true },
      shipping_options: [shippingOption],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("checkout error", err);
    return res.status(500).json({ error: "Could not start checkout. Please try again." });
  }
}
