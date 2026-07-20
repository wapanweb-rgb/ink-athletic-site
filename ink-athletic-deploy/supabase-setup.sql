-- Ink Athletic site data — run this once in Supabase: SQL Editor -> New query -> paste -> Run

create table if not exists public.site_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

alter table public.site_data enable row level security;

-- Anyone can read the catalog and site content (it's a public website)
create policy "public read"
  on public.site_data for select
  using (true);

-- Only a signed-in admin can create or change content
create policy "admin insert"
  on public.site_data for insert
  with check (auth.role() = 'authenticated');

create policy "admin update"
  on public.site_data for update
  using (auth.role() = 'authenticated');


-- ============================================================
-- PART 2 (added later): image uploads from the Admin CMS.
-- Run this once in the SQL Editor. Creates a public-read storage
-- bucket; only the signed-in admin can upload/change images.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('site-images', 'site-images', true)
on conflict (id) do nothing;

create policy "public read site-images"
  on storage.objects for select
  using (bucket_id = 'site-images');

create policy "admin upload site-images"
  on storage.objects for insert
  with check (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "admin update site-images"
  on storage.objects for update
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');

create policy "admin delete site-images"
  on storage.objects for delete
  using (bucket_id = 'site-images' and auth.role() = 'authenticated');
