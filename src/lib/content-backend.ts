import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const hasSupabase = () => Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export function publicContentClient() {
  if (!hasSupabase()) throw new Error("Configure o Supabase para publicar conteúdo.");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false }, global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}

export async function editorContentClient() {
  if (!hasSupabase()) throw new Error("Configure o Supabase para acessar o painel.");
  const jar = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
    cookies: {
      getAll: () => jar.getAll(),
      setAll: (entries) => {
        try { entries.forEach(({ name, value, options }) => jar.set(name, value, options)); }
        catch { /* Server Components cannot refresh cookies; route handlers can. */ }
      },
    },
  });
}

export async function requireEditor() {
  const client = await editorContentClient();
  const { data, error } = await client.auth.getUser();
  if (error || !data.user) throw new Error("Entre no painel para continuar.");
  const { data: admin, error: accessError } = await client.from("content_admins").select("user_id").eq("user_id", data.user.id).maybeSingle();
  if (accessError || !admin) throw new Error("Este usuário não tem acesso ao painel.");
  return client;
}

export function isRemoteAsset(value: string) {
  if (!hasSupabase()) return false;
  try {
    const base = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL!);
    const url = new URL(value);
    return url.origin === base.origin && url.pathname.startsWith("/storage/v1/object/public/site-content/");
  } catch { return false; }
}
