// Serverless: returns live Shippo shipping rates for the cart + destination.
// Requires the SHIPPO_API_TOKEN env var (set in Vercel). Use the test token
// (shippo_test_…) until launch.

import { loadCatalog, buildParcel, getShippoRates } from "../src/shipping-lib.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const token = process.env.SHIPPO_API_TOKEN;
  if (!token) {
    return res.status(500).json({ error: "Shipping is not configured yet (missing SHIPPO_API_TOKEN)." });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const cart = body.cart || {};
    const a = body.address || {};
    const addressTo = {
      zip: String(a.postalCode || "").trim(),
      state: String(a.province || "").trim(),
      city: String(a.city || "").trim(),
      country: "CA"
    };
    if (!addressTo.zip) return res.status(400).json({ error: "Please enter a postal code." });

    const catalog = await loadCatalog();
    const parcel = buildParcel(cart, catalog);
    const { rates } = await getShippoRates({ token, addressTo, parcel });

    if (!rates.length) {
      return res.status(200).json({ rates: [], note: "No shipping rates available for this address yet." });
    }
    return res.status(200).json({ rates });
  } catch (err) {
    console.error("shipping-rates error", err);
    // TEMP: surface the underlying reason while we wire the live carrier.
    return res.status(500).json({
      error: "Could not fetch shipping rates. Please try again.",
      detail: err && err.message ? err.message : String(err)
    });
  }
}
