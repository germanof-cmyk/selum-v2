import { NextResponse } from "next/server";
import { normalizeContactPageImages } from "@/lib/contact-page-images";
import { requireEditor } from "@/lib/content-backend";
import { validateContactPageImages } from "@/lib/validate-contact-page-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const { data, error } = await db.from("contact_page_images").select("images").eq("id", "default").maybeSingle();
    if (error) throw error;
    return NextResponse.json({ images: normalizeContactPageImages(data?.images) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível carregar as imagens." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const images = validateContactPageImages((await request.json()).images);
    const { data, error } = await db.from("contact_page_images")
      .upsert({ id: "default", images, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select("images")
      .single();
    if (error) throw error;
    return NextResponse.json({ saved: true, images: normalizeContactPageImages(data.images) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível salvar as imagens." }, { status: 400 });
  }
}
