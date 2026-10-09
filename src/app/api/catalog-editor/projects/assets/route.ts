import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/content-backend";
import { validateImageUpload } from "@/lib/upload-validation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("Selecione uma imagem.");
    const { bytes, extension } = await validateImageUpload(file);
    const path = `projects/${crypto.randomUUID()}.${extension}`;
    const { error } = await db.storage.from("site-content").upload(path, bytes, { contentType: file.type, upsert: false });
    if (error) throw error;
    const { data } = db.storage.from("site-content").getPublicUrl(path);
    return NextResponse.json({ path: data.publicUrl, name: file.name });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível enviar a imagem." }, { status: 400 });
  }
}
