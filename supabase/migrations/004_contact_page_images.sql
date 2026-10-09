-- Apply after 003_about_page_images.sql in the Supabase SQL Editor.
create table if not exists public.contact_page_images (
  id text primary key default 'default' check (id = 'default'),
  images jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.contact_page_images (id, images)
values (
  'default',
  '{
    "hero": "/images/products/base-tubular/Base tubular padrao p30.jpeg",
    "location": "/images/teste.png",
    "cta": "/images/products/box-truss.png"
  }'::jsonb
)
on conflict (id) do nothing;

alter table public.contact_page_images enable row level security;
revoke all on public.contact_page_images from anon;
grant select on public.contact_page_images to anon;
grant select, insert, update, delete on public.contact_page_images to authenticated;

drop policy if exists "Public contact page images" on public.contact_page_images;
create policy "Public contact page images" on public.contact_page_images
for select to anon using (true);

drop policy if exists "Editors manage contact page images" on public.contact_page_images;
create policy "Editors manage contact page images" on public.contact_page_images
for all to authenticated
using (exists (select 1 from public.content_admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.content_admins where user_id = (select auth.uid())));
