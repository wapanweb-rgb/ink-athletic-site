import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, FALLBACK_ADMIN_PASSWORD } from "./config.js";

export const configured =
  SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("PASTE");

export const supabase = configured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Load a value ("products" or "site"). Falls back to localStorage when
// Supabase isn't configured yet, so the site works out of the box.
export async function loadData(key, fallback) {
  if (configured) {
    try {
      const { data, error } = await supabase
        .from("site_data").select("value").eq("key", key).maybeSingle();
      if (!error && data) return data.value;
    } catch (e) { /* fall through */ }
    return fallback;
  }
  try {
    const raw = localStorage.getItem("ia_" + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) { return fallback; }
}

export async function saveData(key, value) {
  if (configured) {
    try {
      const { error } = await supabase
        .from("site_data")
        .upsert({ key, value, updated_at: new Date().toISOString() });
      return !error;
    } catch (e) { return false; }
  }
  try { localStorage.setItem("ia_" + key, JSON.stringify(value)); return true; }
  catch (e) { return false; }
}

export async function adminSignIn(email, password) {
  if (configured) {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return !error;
    } catch (e) { return false; }
  }
  return password === FALLBACK_ADMIN_PASSWORD;
}
