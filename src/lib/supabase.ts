import { createClient } from "@supabase/supabase-js";

export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  return createClient(url, key);
}

// Server-side client with service role (for admin Server Actions)
export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !serviceKey) throw new Error("Supabase is not configured.");
  return createClient(url, serviceKey);
}

/* ─── TYPES ──────────────────────────────────────────────────────────────── */

export type Produto = {
  id: string;
  slug: string;
  name: string;
  category: string;
  tag: string;
  description: string;
};

export type ProdutoImagem = {
  id: string;
  produto_slug: string;
  tipo: "hero" | "gallery";
  storage_path: string;
  ordem: number;
  created_at: string;
};

/* ─── STORAGE HELPERS ────────────────────────────────────────────────────── */

const BUCKET = "produto-imagens";

export function getImagePublicUrl(storagePath: string): string {
  const { data } = createPublicClient().storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function fetchProductImages(slug: string): Promise<{
  hero: string | null;
  gallery: string[];
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { hero: null, gallery: [] };
  }

  const { data } = await createPublicClient()
    .from("produto_imagens")
    .select("*")
    .eq("produto_slug", slug)
    .order("ordem", { ascending: true });

  if (!data || data.length === 0) return { hero: null, gallery: [] };

  const heroRow = (data as ProdutoImagem[]).find((r) => r.tipo === "hero");
  const galleryRows = (data as ProdutoImagem[]).filter((r) => r.tipo === "gallery");

  return {
    hero: heroRow ? getImagePublicUrl(heroRow.storage_path) : null,
    gallery: galleryRows.map((r) => getImagePublicUrl(r.storage_path)),
  };
}

export async function uploadProductImage(
  slug: string,
  tipo: "hero" | "gallery",
  file: File,
  serviceClient: ReturnType<typeof createServiceClient>
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path =
    tipo === "hero"
      ? `${slug}/hero.${ext}`
      : `${slug}/gallery-${Date.now()}.${ext}`;

  const { error: uploadError } = await serviceClient.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (uploadError) throw new Error(uploadError.message);

  const { error: dbError } = await serviceClient
    .from("produto_imagens")
    .upsert(
      { produto_slug: slug, tipo, storage_path: path, ordem: 0 },
      { onConflict: tipo === "hero" ? "produto_slug,tipo" : undefined }
    );

  if (dbError) throw new Error(dbError.message);

  return path;
}

export async function deleteProductImage(
  id: string,
  storagePath: string,
  serviceClient: ReturnType<typeof createServiceClient>
): Promise<void> {
  await serviceClient.storage.from(BUCKET).remove([storagePath]);
  await serviceClient.from("produto_imagens").delete().eq("id", id);
}
