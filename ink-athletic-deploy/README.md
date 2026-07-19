# Ink Athletic Ltd. — Website

The full site: orb cinematic, storefront, quote system, and admin CMS
(products + all site text), backed by Supabase.

The site works immediately even before Supabase is connected — the CMS
just saves to your own browser only until then. Connect Supabase (Part 1)
to make admin edits live for every visitor, with a real admin login.

---

## Part 1 — Supabase (free) — the CMS database + admin login

1. Go to **supabase.com** → **Start your project** → sign up (email or GitHub).
2. Click **New project**:
   - Name: `ink-athletic`
   - Database password: make one up and **save it somewhere** (you rarely need it again)
   - Region: **West US** (closest to BC)
   - Click **Create new project** and wait ~2 minutes.
3. Create the database table:
   - Left sidebar → **SQL Editor** → **New query**
   - Open the file `supabase-setup.sql` (in this folder), copy ALL of it, paste, click **Run**.
   - You should see "Success. No rows returned".
4. Create your admin login:
   - Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**
   - Enter the email + password you want to use to sign in to the site's Admin panel.
   - Check "Auto Confirm User" if shown, then create.
5. Get your two keys:
   - Left sidebar → **Settings** (gear) → **API**
   - Copy **Project URL** and the **anon public** key.
6. Open `src/config.js` in this folder and paste both values where marked.
   (The anon key is designed to be public — it's safe to have in the site code.
   The database rules you ran in step 3 are what protect your data.)

That's it. Admin panel now uses the email + password from step 4.

---

## Part 2 — Vercel (free) — hosting

**Option A — no code tools (recommended):**
1. Put this folder on GitHub:
   - Sign up at **github.com** → **New repository** → name it `ink-athletic-site` → create.
   - On the empty repo page, click **uploading an existing file**, drag this whole
     folder's contents in, and commit.
2. Sign up at **vercel.com** (choose "Continue with GitHub").
3. Click **Add New… → Project** → import `ink-athletic-site`.
   Vercel auto-detects Vite. Click **Deploy**.
4. ~1 minute later your site is live at `ink-athletic-site.vercel.app`.

**Option B — command line (if you have Node.js installed):**
```
npm install
npm run dev        # preview locally at localhost:5173
npx vercel         # sign in, accept defaults
npx vercel --prod  # live deployment
```

Any time you change code later: commit to GitHub (Option A) and Vercel
redeploys automatically.

---

## Part 3 — Connect your Wix domains

You keep the domains registered at Wix — you're only pointing them at Vercel.

1. In Vercel: your project → **Settings → Domains** → add `inkathletic.com`,
   then add `www.inkathletic.com`, then add `inkathletic.ca`
   (set `.ca` and `www` to **Redirect to inkathletic.com** when asked).
   Vercel will now show you the DNS records it wants — they match below.
2. In Wix: **Domains** → `inkathletic.com` → **⋯ menu → Manage DNS Records**:
   - Find the **A record** for the bare domain (Host: `@`) → change its value to:
     `76.76.21.21`
   - Find (or add) the **CNAME** record for Host `www` → value:
     `cname.vercel-dns.com`
   - Delete any other A records on `@` that point elsewhere (Wix's defaults).
3. Repeat step 2 for `inkathletic.ca`.
4. Wait 10–60 minutes for DNS to propagate. Vercel's Domains page will show
   green checkmarks when each domain is verified, and it issues the HTTPS
   certificate automatically.

Done: `inkathletic.com` is your live site, `inkathletic.ca` redirects to it.

---

## Changing things later

- **Products & site text:** bottom of the site → **Admin** → sign in with your
  Supabase admin email + password.
- **Admin password:** Supabase → Authentication → Users → your user → reset.
- **Code changes:** ask Claude, then commit the updated files to GitHub.

## File map

```
index.html            page shell + fonts
src/main.jsx          entry point
src/App.jsx           the entire site (orb engine, storefront, CMS)
src/config.js         YOUR Supabase keys go here
src/store.js          storage adapter (Supabase, or localStorage fallback)
supabase-setup.sql    run once in Supabase SQL Editor
```
