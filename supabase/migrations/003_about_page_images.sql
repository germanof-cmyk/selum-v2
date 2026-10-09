-- Apply after 002_content_cms.sql in the Supabase SQL Editor.
create table if not exists public.about_page_images (
  id text primary key default 'default' check (id = 'default'),
  images jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.about_page_images (id, images)
values (
  'default',
  '{
    "heroFactory": "/images/teste.png",
    "manufacturing": "/images/products/base-tubular/Base tubular padrao p30.jpeg",
    "detailsBackdrop": "/images/teste.png",
    "detailsStructure": "/images/products/box-truss.png",
    "team": "/images/selum-equipe-fabrica-v2.png",
    "presence": "/images/about-bg.png",
    "cta": "/images/products/box-truss.png"
  }'::jsonb
)
on conflict (id) do nothing;

alter table public.about_page_images enable row level security;
revoke all on public.about_page_images from anon;
grant select on public.about_page_images to anon;
grant select, insert, update, delete on public.about_page_images to authenticated;

create policy "Public about page images" on public.about_page_images
for select to anon using (true);

create policy "Editors manage about page images" on public.about_page_images
for all to authenticated
using (exists (select 1 from public.content_admins where user_id = (select auth.uid())))
with check (exists (select 1 from public.content_admins where user_id = (select auth.uid())));
