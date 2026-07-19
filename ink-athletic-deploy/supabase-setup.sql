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
