-- ============================================================
-- 1. TABELA produto_imagens
-- ============================================================
create table if not exists produto_imagens (
  id           uuid        default gen_random_uuid() primary key,
  produto_slug text        not null,
  tipo         text        not null check (tipo in ('hero', 'gallery')),
  storage_path text        not null,   -- caminho no bucket, ex: "box-truss/hero.jpg"
  ordem        integer     not null default 0,
  created_at   timestamptz default now()
);

create index if not exists idx_produto_imagens_slug_tipo
  on produto_imagens (produto_slug, tipo);

-- RLS: leitura pública, escrita apenas service role
alter table produto_imagens enable row level security;

create policy "Public select"
  on produto_imagens for select using (true);

-- Para o admin (anon key + painel interno sem auth),
-- descomente a linha abaixo SOMENTE em desenvolvimento:
-- create policy "Anon insert" on produto_imagens for insert with check (true);
-- create policy "Anon delete" on produto_imagens for delete using (true);

-- Em produção, use service role key nas Server Actions do admin.

-- ============================================================
-- 2. STORAGE BUCKET  (executar via Supabase Dashboard ou CLI)
-- ============================================================
-- Via Dashboard → Storage → New bucket:
--   Name:   produto-imagens
--   Public: true   (URLs públicas sem token)
--
-- Ou via SQL (requer extensão storage habilitada):
-- insert into storage.buckets (id, name, public)
--   values ('produto-imagens', 'produto-imagens', true)
--   on conflict do nothing;
--
-- Políticas de storage para o admin (anon key):
-- create policy "Public read storage"
--   on storage.objects for select using (bucket_id = 'produto-imagens');
--
-- create policy "Anon upload storage"
--   on storage.objects for insert
--   with check (bucket_id = 'produto-imagens');
--
-- create policy "Anon delete storage"
--   on storage.objects for delete
--   using (bucket_id = 'produto-imagens');
