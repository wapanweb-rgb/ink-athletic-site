// Shared server-side shipping helpers (used by api/shipping-rates.js and
// api/create-checkout-session.js). Lives in src/ so it is NOT treated as its
// own Vercel function, but it is never imported by the browser bundle.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";
import { DEFAULT_PRODUCTS } from "./catalog.js";

// Ship-from: Ink Athletic's office. Postal code drives the rate.
export const SHIP_FROM = {
  name: "Ink Athletic Ltd",
  street1: "9711 100th Ave, Unit 208",
  city: "Fort St. John",
  state: "BC",
  zip: "V1J 1Y2",
  country: "CA",
  email: "brandon@inkathletic.ca"
};

// Authoritative catalog: prefer the CMS copy in Supabase, fall back to code.
export async function loadCatalog() {
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

// Combine the buyable cart items into one parcel. Simple heuristic: sum the
// weights, stack heights, and take the largest footprint. Good enough for small
// parcels where weight drives the price; refine later if needed.
export function buildParcel(cart, catalog) {
  const byId = Object.fromEntries(catalog.map((p) => [p.id, p]));
  let weight = 0, maxL = 0, maxW = 0, sumH = 0;
  for (const [id, qtyRaw] of Object.entries(cart || {})) {
    const p = byId[id];
    const qty = Math.max(1, Math.min(99, parseInt(qtyRaw, 10) || 0));
    if (!p || !p.buy) continue;
    weight += (Number(p.weightG) || 0) * qty;
    maxL = Math.max(maxL, Number(p.boxL) || 0);
    maxW = Math.max(maxW, Number(p.boxW) || 0);
    sumH += (Number(p.boxH) || 0) * qty;
  }
  return {
    length: String(maxL || 20),
    width: String(maxW || 15),
    height: String(sumH || 10),
    distance_unit: "cm",
    weight: String(weight || 500),
    mass_unit: "g"
  };
}

// Call Shippo for live rates. Returns a normalized, cheapest-first list.
export async function getShippoRates({ token, addressTo, parcel }) {
  const res = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers: { Authorization: "ShippoToken " + token.trim(), "Content-Type": "application/json" },
    body: JSON.stringify({ address_from: SHIP_FROM, address_to: addressTo, parcels: [parcel], async: false })
  });
  const raw = await res.text();
  let data = {};
  try { data = JSON.parse(raw); } catch (e) { /* non-JSON body */ }
  if (!res.ok) {
    throw new Error("Shippo " + res.status + ": " + raw.slice(0, 260));
  }
  const rates = Array.isArray(data.rates) ? data.rates : [];
  const norm = rates
    .map((r) => ({
      serviceToken: r.servicelevel && r.servicelevel.token,
      carrier: r.provider,
      service: r.servicelevel && r.servicelevel.name,
      amount: Number(r.amount),
      currency: r.currency,
      days: r.estimated_days != null ? r.estimated_days : null
    }))
    .filter((r) => r.amount > 0 && r.serviceToken)
    .sort((a, b) => a.amount - b.amount);
  return { rates: norm, messages: data.messages || [] };
}
