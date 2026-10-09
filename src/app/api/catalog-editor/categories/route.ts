import { NextResponse } from "next/server";
import { importCategories, orderedCategories, validateCategories, type CategoryScope } from "@/lib/content-categories";
import { requireEditor } from "@/lib/content-backend";
import { loadEditorCategories, loadEditorProducts, loadEditorProjects } from "@/lib/supabase-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try { return NextResponse.json({ categories: await loadEditorCategories(await requireEditor()) }, { headers: { "Cache-Control": "no-store, max-age=0" } }); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
}

export async function POST(request: Request) {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const payload = await request.json();
    const scope = payload.scope as CategoryScope;
    if ((scope !== "projects" && scope !== "products") || !Array.isArray(payload.categories) || !["save", "publish"].includes(payload.action)) throw new Error("Selecione uma área e envie as categorias.");
    const categories = orderedCategories(importCategories(payload.categories));
    if (payload.action === "publish") validateCategories(categories);
    const current = await loadEditorCategories(db);
    const { data: publishedRows, error: publishedError } = await db.from("categories").select("id,type,slug,name,active,sort_order").eq("type", scope === "projects" ? "project" : "product");
    if (publishedError) throw publishedError;
    const publishedById = new Map((publishedRows ?? []).map((row) => [row.id, row]));
    const inUse = scope === "projects" ? await loadEditorProjects(db) : await loadEditorProducts(db);
    for (const before of current[scope]) {
      if (categories.some((item) => item.id === before.id)) continue;
      const count = scope === "projects"
        ? (inUse as Awaited<ReturnType<typeof loadEditorProjects>>).filter((item) => item.categoryId === before.id).length
        : (inUse as Awaited<ReturnType<typeof loadEditorProducts>>).filter((item) => item.category === before.slug).length;
      if (count) throw new Error(`Esta categoria está sendo utilizada por ${count} ${scope === "projects" ? "projeto(s)" : "produto(s)"}. Mova-os antes de excluir.`);
      const { error } = payload.action === "publish"
        ? await db.from("categories").delete().eq("id", before.id)
        : await db.from("categories").update({ draft_data: { deleted: true } }).eq("id", before.id);
      if (error) throw error;
    }
    if (payload.action === "publish") {
      for (const before of publishedRows ?? []) {
        if (categories.some((item) => item.id === before.id)) continue;
        const count = scope === "projects"
          ? (inUse as Awaited<ReturnType<typeof loadEditorProjects>>).filter((item) => item.categoryId === before.id).length
          : (inUse as Awaited<ReturnType<typeof loadEditorProducts>>).filter((item) => item.category === before.slug).length;
        if (count) throw new Error(`Esta categoria está sendo utilizada por ${count} item(ns). Mova-os antes de excluir.`);
        const { error } = await db.from("categories").delete().eq("id", before.id);
        if (error) throw error;
      }
    }
    for (const category of categories) {
      const before = publishedById.get(category.id);
      const effective = payload.action === "publish" ? category : before;
      const { error } = await db.from("categories").upsert({
        id: category.id, type: scope === "projects" ? "project" : "product",
        slug: effective?.slug ?? category.slug, name: effective?.name ?? category.name,
        active: effective?.active ?? false, sort_order: ("order" in (effective ?? {}) ? (effective as typeof category).order : before?.sort_order) ?? category.order,
        draft_data: payload.action === "save" ? category : null,
      }, { onConflict: "id" });
      if (error) throw error;
    }
    return NextResponse.json({ categories, saved: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível salvar categorias." }, { status: 400 });
  }
}
