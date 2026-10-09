import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/content-backend";
import { validateImageUpload } from "@/lib/upload-validation";

export const runtime = "nodejs";

export async function GET() {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  const folders = ["products", "projects"];
  const assets = [];
  for (const folder of folders) {
    const { data, error } = await db.storage.from("site-content").list(folder, { limit: 1000 });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    for (const item of data ?? []) {
      if (!/\.(png|jpe?g|webp|avif)$/i.test(item.name)) continue;
      const { data: url } = db.storage.from("site-content").getPublicUrl(`${folder}/${item.name}`);
      assets.push({ path: url.publicUrl, name: item.name, folder, type: "image" });
    }
  }
  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("Selecione uma imagem.");
    const { bytes, extension } = await validateImageUpload(file);
    const path = `products/${crypto.randomUUID()}.${extension}`;
    const { error } = await db.storage.from("site-content").upload(path, bytes, { contentType: file.type });
    if (error) throw error;
    const { data } = db.storage.from("site-content").getPublicUrl(path);
    return NextResponse.json({ path: data.publicUrl, name: file.name });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível enviar a imagem." }, { status: 400 }); }
}
