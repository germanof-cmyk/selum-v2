# Publicação com Supabase

1. Confirme as cópias em `data/backup-pre-supabase-2026-10-08/`. Os JSON originais continuam em `data/` como backup de leitura em caso de falha de conexão.
2. Crie ou reative um projeto Supabase. No SQL Editor, execute `supabase/migrations/002_content_cms.sql`. A migração cria `products`, `projects`, `categories`, RLS e o bucket público `site-content`.
3. Em Authentication, desative cadastro público e crie manualmente o usuário administrativo. Depois, no SQL Editor, execute `insert into public.content_admins (user_id) values ('UUID_DO_USUARIO');` com o UUID exibido em Authentication > Users. Apenas IDs nessa tabela podem editar conteúdo ou enviar imagens.
4. Defina `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `.env.local` e na Vercel. Defina `SUPABASE_SERVICE_ROLE_KEY` apenas no ambiente local onde executar o seed; o novo `/interno` usa a sessão autenticada e RLS, sem chave de serviço. A área `/admin/produtos` legada redireciona para `/interno` e não faz parte do fluxo de publicação. Nunca use `NEXT_PUBLIC_` para a chave de serviço.
5. Execute `node --env-file=.env.local scripts/seed-supabase.mjs`. O script imprime contagens antes/depois e confere o JSON integral de cada produto e projeto. Se os mesmos registros já estiverem no banco, ele encerra sem alterar nada. Se encontrar dados diferentes, interrompe; `--force` só deve ser usado depois de inspecionar backup e dados atuais.
6. Execute `npm run build` e `npm run lint`. Configure o mesmo ambiente na Vercel e implante. Acesse `/interno/login` com o usuário criado.
7. Faça um teste real: edite e publique um projeto, confira `/pt/projetos`; envie nova imagem, publique e confira; repita com um produto em `/pt/produtos`. Como as páginas consultam o Supabase com `no-store`, não é necessário novo deploy para conteúdo.

O painel usa a coluna `draft_data` para autosave. O conteúdo público usa `data`, atualizado somente no clique em **Publicar**. Imagens antigas em `/public` continuam válidas. Novas imagens vão para `site-content`.

Na migração inicial, os cinco produtos ativos do JSON permanecem publicados, inclusive os quatro que tinham status legado `review` mas já apareciam no site público. O status original permanece em `data`; o editor recebe `approved` em `draft_data` para refletir a visibilidade real.
