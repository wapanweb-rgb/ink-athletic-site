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

// Downscale an image file in the browser (max 1400px, JPEG) so uploads are
// small and pages load fast, then push it to Supabase Storage and return a
// public URL. Requires the signed-in admin (storage RLS allows authenticated
// writes only; reads are public).
export async function uploadImage(file) {
  if (!configured || !supabase) throw new Error("Connect Supabase to upload images.");
  const img = await new Promise((ok, err) => {
    const el = new Image();
    el.onload = () => ok(el);
    el.onerror = () => err(new Error("That file doesn't look like an image."));
    el.src = URL.createObjectURL(file);
  });
  const MAX = 1400;
  const scale = Math.min(1, MAX / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  URL.revokeObjectURL(img.src);
  const blob = await new Promise(ok => canvas.toBlob(ok, "image/jpeg", 0.85));
  if (!blob) throw new Error("Could not process that image.");
  const path = Date.now() + "-" + file.name.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/\.[a-z0-9]+$/, "") + ".jpg";
  const { error } = await supabase.storage.from("site-images").upload(path, blob, {
    contentType: "image/jpeg", upsert: false
  });
  if (error) throw new Error(error.message || "Upload failed.");
  const { data } = supabase.storage.from("site-images").getPublicUrl(path);
  return data.publicUrl;
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
