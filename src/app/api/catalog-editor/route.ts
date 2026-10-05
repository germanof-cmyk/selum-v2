import { NextResponse } from "next/server";
import { exportCatalog, importCatalog } from "@/lib/catalog-editor";
import { saveCatalogPreview } from "@/lib/catalog-preview";
import { validatePublication } from "@/lib/catalog-publication";
import { readPublishedCatalog, writePublishedCatalog } from "@/lib/published-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });
  const catalog = await readPublishedCatalog();
  return NextResponse.json({ catalog: catalog ? exportCatalog(importCatalog(catalog)) : {}, published: catalog !== null });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });
  try {
    const payload = await request.json();
    if (!payload || !Array.isArray(payload.products) || (payload.action !== "publish" && payload.action !== "preview")) {
      return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
    }
    const products = importCatalog(payload.products, { draft: true });
    validatePublication(products);
    const catalog = exportCatalog(products);
    if (payload.action === "preview") {
      return NextResponse.json({ token: saveCatalogPreview(catalog) });
    }
    await writePublishedCatalog(catalog);
    return NextResponse.json({ catalog, published: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao processar catálogo." }, { status: 400 });
  }
}
