// Serverless checkout — runs on Vercel, never in the browser. Creates a Stripe
// Checkout Session for the cart and returns its hosted-payment URL. Prices come
// from the server-side catalog (Supabase, falling back to code defaults), so a
// tampered browser can't change what the customer is charged.
//
// Requires the STRIPE_SECRET_KEY environment variable (set in Vercel → Settings
// → Environment Variables). Use the TEST key (sk_test_…) until you go live.

import Stripe from "stripe";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../src/config.js";
import { DEFAULT_PRODUCTS } from "../src/catalog.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

async function loadCatalog() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/site_data?key=eq.products&select=value`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (res.ok) {
      const rows = await res.json();
      const value = rows && rows[0] && rows[0].value;
      if (Array.isArray(value) && value.length) return value;
    }
  } catch (e) { /* fall through to code defaults */ }
  return DEFAULT_PRODUCTS;
}

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

    const catalog = await loadCatalog();
    const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));

    const line_items = [];
    for (const [id, qtyRaw] of Object.entries(cart)) {
      const p = byId[id];
      const qty = Math.max(1, Math.min(99, parseInt(qtyRaw, 10) || 0));
      if (!p || !p.buy) continue;
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

    const origin = req.headers.origin || `https://${req.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: { allowed_countries: ["CA"] },
      phone_number_collection: { enabled: true },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: 1500, currency: "cad" },
            display_name: "Canada Post (flat rate — live rates coming soon)",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 3 },
              maximum: { unit: "business_day", value: 9 }
            }
          }
        }
      ],
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/?checkout=cancel`
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("checkout error", err);
    // TEMP (preview debugging): surface the real reason so we can diagnose fast.
    return res.status(500).json({
      error: "Checkout error: " + (err && err.message ? err.message : "unknown"),
      type: err && err.type,
      code: err && err.code,
      where: err && err.stack ? String(err.stack).split("\n").slice(0, 5).join(" | ") : null,
      bodyType: typeof req.body
    });
  }
}
