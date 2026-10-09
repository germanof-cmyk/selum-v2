import { NextResponse } from "next/server";
import { exportCatalog, importCatalog } from "@/lib/catalog-editor";
import { saveCatalogPreview } from "@/lib/catalog-preview";
import { validatePublication } from "@/lib/catalog-publication";
import { readCategories } from "@/lib/published-categories";
import { importCategories } from "@/lib/content-categories";
import { requireEditor } from "@/lib/content-backend";
import { loadEditorProducts, loadRows, saveProductDrafts, uuidOrStable } from "@/lib/supabase-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await requireEditor();
    const products = await loadEditorProducts(db);
    const published = await loadRows("products", false, db);
    return NextResponse.json({ products, catalog: Object.fromEntries(published.map((row) => [row.slug, row.data])) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
}

export async function POST(request: Request) {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const payload = await request.json();
    if (payload.action === "delete") {
      if (typeof payload.targetId !== "string" || !payload.targetId) throw new Error("Selecione o produto para excluir.");
      if (typeof payload.slug !== "string" || !payload.slug) throw new Error("O slug do produto é obrigatório para confirmar a exclusão.");
      const { data: authData } = await db.auth.getUser();
      console.info("[catalog-editor] DELETE requested", { productId: payload.targetId, productSlug: payload.slug, userId: authData.user?.id ?? null });
      const { data: deletedRows, error } = await db.from("products")
        .delete()
        .eq("id", payload.targetId)
        .eq("slug", payload.slug)
        .select("id,slug");
      if (error) {
        console.error("[catalog-editor] DELETE failed", { productId: payload.targetId, productSlug: payload.slug, message: error.message });
        throw error;
      }
      const deleted = deletedRows ?? [];
      console.info("[catalog-editor] DELETE rows affected", { productId: payload.targetId, productSlug: payload.slug, rowsDeleted: deleted.length, deletedRows: deleted });
      if (deleted.length !== 1 || deleted[0].id !== payload.targetId || deleted[0].slug !== payload.slug) {
        return NextResponse.json({ error: "O Supabase não confirmou a exclusão de exatamente um produto.", requestedId: payload.targetId, requestedSlug: payload.slug, rowsDeleted: deleted.length }, { status: 409 });
      }
      const { data: remaining, error: verifyError } = await db.from("products").select("id").eq("id", payload.targetId).maybeSingle();
      if (verifyError) throw verifyError;
      if (remaining) {
        console.error("[catalog-editor] DELETE verification failed", { productId: payload.targetId, productSlug: payload.slug });
        return NextResponse.json({ error: "O produto ainda existe no Supabase após a exclusão.", requestedId: payload.targetId, requestedSlug: payload.slug, rowsDeleted: deleted.length }, { status: 500 });
      }
      const rows = await loadRows("products", false, db);
      console.info("[catalog-editor] DELETE verified", { productId: payload.targetId, productSlug: payload.slug, rowsDeleted: deleted.length, remainingMatches: 0 });
      const products = await loadEditorProducts(db);
      return NextResponse.json({ deleted: true, deletedRows: deleted.length, deletedId: deleted[0].id, deletedSlug: deleted[0].slug, products, catalog: Object.fromEntries(rows.map((row) => [row.slug, row.data])) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
    }
    if (!Array.isArray(payload.products) || !["save", "publish", "preview"].includes(payload.action)) throw new Error("Requisição inválida.");
    const products = importCatalog(payload.products, { draft: true });
    if (payload.action === "preview") {
      validatePublication(products);
      return NextResponse.json({ token: saveCatalogPreview(exportCatalog(products), importCategories(payload.categories)) });
    }
    if (payload.action === "save") {
      await saveProductDrafts(db, products);
      return NextResponse.json({ saved: true });
    }
    const product = products.find((item) => item.id === payload.targetId);
    if (!product) throw new Error("Selecione o produto para publicar.");
    const categories = (await readCategories()).products;
    if (!categories.some((category) => category.slug === product.category && category.name.pt.trim())) throw new Error("Escolha uma categoria cadastrada.");
    const published = { ...product, id: uuidOrStable(product.id, "product", product.slug), status: "approved" as const, active: true };
    validatePublication([published]);
    const data = exportCatalog([published])[published.slug];
    const { error } = await db.from("products").upsert({
      id: published.id, slug: published.slug, status: "published", active: true,
      sort_order: products.findIndex((item) => item.id === product.id) + 1,
      show_on_home: published.home.featured, data, draft_data: published,
    }, { onConflict: "id" });
    if (error) throw error;
    const rows = await loadRows("products", false, db);
    return NextResponse.json({ published: true, product: published, catalog: Object.fromEntries(rows.map((row) => [row.slug, row.data])) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível salvar o produto." }, { status: 400 });
  }
}
