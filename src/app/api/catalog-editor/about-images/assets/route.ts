import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/content-backend";
import { validateImageUpload } from "@/lib/upload-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  const { data, error } = await db.storage.from("site-content").list("about", { limit: 1000 });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  const assets = (data ?? []).filter((item) => /\.(png|jpe?g|webp|avif)$/i.test(item.name)).map((item) => {
    const { data: url } = db.storage.from("site-content").getPublicUrl(`about/${item.name}`);
    return { path: url.publicUrl, name: item.name, folder: "site-content/about", type: "image" as const };
  });
  return NextResponse.json({ assets }, { headers: { "Cache-Control": "no-store, max-age=0" } });
}

export async function POST(request: Request) {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const file = (await request.formData()).get("file");
    if (!(file instanceof File)) throw new Error("Selecione uma imagem.");
    const { bytes, extension } = await validateImageUpload(file);
    const path = `about/${crypto.randomUUID()}.${extension}`;
    const { error } = await db.storage.from("site-content").upload(path, bytes, { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = db.storage.from("site-content").getPublicUrl(path);
    return NextResponse.json({ path: data.publicUrl, name: file.name, folder: "site-content/about", type: "image" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível enviar a imagem." }, { status: 400 });
  }
}
