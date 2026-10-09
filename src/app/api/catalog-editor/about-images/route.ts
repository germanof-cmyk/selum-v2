import { NextResponse } from "next/server";
import { requireEditor } from "@/lib/content-backend";
import { normalizeAboutPageImages } from "@/lib/about-page-images";
import { validateAboutPageImages } from "@/lib/validate-about-page-images";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const { data, error } = await db.from("about_page_images").select("images").eq("id", "default").maybeSingle();
    if (error) throw error;
    return NextResponse.json({ images: normalizeAboutPageImages(data?.images) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível carregar as imagens." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const images = validateAboutPageImages((await request.json()).images);
    const { data, error } = await db.from("about_page_images")
      .upsert({ id: "default", images, updated_at: new Date().toISOString() }, { onConflict: "id" })
      .select("images")
      .single();
    if (error) throw error;
    return NextResponse.json({ saved: true, images: normalizeAboutPageImages(data.images) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível salvar as imagens." }, { status: 400 });
  }
}
