-- Apply in Supabase SQL Editor before running scripts/seed-supabase.mjs.
create table if not exists public.products (
  id uuid primary key,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  active boolean not null default true,
  sort_order integer not null default 0,
  show_on_home boolean not null default false,
  data jsonb not null default '{}'::jsonb,
  draft_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key,
  slug text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  active boolean not null default true,
  sort_order integer not null default 0,
  show_on_home boolean not null default false,
  home_order integer,
  category text not null default '',
  name jsonb not null default '{}'::jsonb,
  location jsonb not null default '{}'::jsonb,
  cover_image text not null default '',
  data jsonb not null default '{}'::jsonb,
  draft_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.categories (
  id text primary key,
  type text not null check (type in ('product', 'project')),
  slug text not null,
  name jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  sort_order integer not null default 0,
  draft_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(type, slug)
);
create table if not exists public.content_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create index if not exists products_public_order on public.products (sort_order) where status = 'published' and active;
create index if not exists projects_public_order on public.projects (sort_order) where status = 'published' and active;
create or replace function public.content_set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute function public.content_set_updated_at();
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute function public.content_set_updated_at();
drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories for each row execute function public.content_set_updated_at();

alter table public.products enable row level security;
alter table public.projects enable row level security;
alter table public.categories enable row level security;
alter table public.content_admins enable row level security;
revoke all on public.products, public.projects, public.categories from anon;
grant select, insert, update, delete on public.products, public.projects, public.categories to authenticated;
grant select on public.content_admins to authenticated;
create policy "Editors see own access" on public.content_admins for select to authenticated
using (user_id = (select auth.uid()));
grant select (id, slug, status, active, sort_order, show_on_home, data, created_at, updated_at) on public.products to anon;
grant select (id, slug, status, active, sort_order, show_on_home, home_order, category, name, location, cover_image, data, created_at, updated_at) on public.projects to anon;
grant select (id, type, slug, name, active, sort_order, created_at, updated_at) on public.categories to anon;
create policy "Public products" on public.products for select to anon using (status = 'published' and active = true);
create policy "Public projects" on public.projects for select to anon using (status = 'published' and active = true and cover_image <> '');
create policy "Public categories" on public.categories for select to anon using (active = true);
create policy "Editors products" on public.products for all to authenticated
using (exists (select 1 from public.content_admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.content_admins where user_id = (select auth.uid())));
create policy "Editors projects" on public.projects for all to authenticated
using (exists (select 1 from public.content_admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.content_admins where user_id = (select auth.uid())));
create policy "Editors categories" on public.categories for all to authenticated
using (exists (select 1 from public.content_admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.content_admins where user_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-content', 'site-content', true, 15728640, array['image/png','image/jpeg','image/webp','image/avif'])
on conflict (id) do nothing;
create policy "Public site images" on storage.objects for select to anon, authenticated
using (bucket_id = 'site-content');
create policy "Editors upload site images" on storage.objects for insert to authenticated
with check (bucket_id = 'site-content' and exists (select 1 from public.content_admins where user_id = (select auth.uid())));
create policy "Editors update site images" on storage.objects for update to authenticated
using (bucket_id = 'site-content' and exists (select 1 from public.content_admins where user_id = (select auth.uid())))
with check (bucket_id = 'site-content' and exists (select 1 from public.content_admins where user_id = (select auth.uid())));
create policy "Editors delete site images" on storage.objects for delete to authenticated
using (bucket_id = 'site-content' and exists (select 1 from public.content_admins where user_id = (select auth.uid())));
