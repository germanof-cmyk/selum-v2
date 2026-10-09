"use server";

import {
  createServiceClient,
  uploadProductImage,
  deleteProductImage,
} from "@/lib/supabase";
import { requireEditor } from "@/lib/content-backend";

export async function actionUploadImage(formData: FormData) {
  await requireEditor();
  const slug = formData.get("slug") as string;
  const tipo = formData.get("tipo") as "hero" | "gallery";
  const file = formData.get("file") as File;

  if (!slug || !tipo || !file || file.size === 0) {
    return { error: "Dados incompletos." };
  }

  const MAX_MB = 8;
  if (file.size > MAX_MB * 1024 * 1024) {
    return { error: `Arquivo muito grande. Máximo: ${MAX_MB}MB.` };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!allowed.includes(file.type)) {
    return { error: "Formato não suportado. Use JPG, PNG, WebP ou AVIF." };
  }

  try {
    const client = createServiceClient();
    const path = await uploadProductImage(slug, tipo, file, client);
    return { path };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro desconhecido.";
    return { error: msg };
  }
}

export async function actionDeleteImage(id: string, storagePath: string) {
  await requireEditor();
  try {
    const client = createServiceClient();
    await deleteProductImage(id, storagePath, client);
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao deletar.";
    return { error: msg };
  }
}

export async function actionFetchImages(slug: string) {
  await requireEditor();
  try {
    const client = createServiceClient();
    const { data, error } = await client
      .from("produto_imagens")
      .select("*")
      .eq("produto_slug", slug)
      .order("tipo")
      .order("ordem");

    if (error) return { error: error.message, rows: [] };
    return { rows: data ?? [] };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erro ao buscar.";
    return { error: msg, rows: [] };
  }
}
