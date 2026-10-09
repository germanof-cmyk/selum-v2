import { createHash } from "node:crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { publicContentClient } from "@/lib/content-backend";
import { importCatalog, type EditorProduct } from "@/lib/catalog-editor";
import { importProjects, type EditorProject } from "@/lib/projects";
import { importCategories, type CategoryRegistry } from "@/lib/content-categories";

export function stableUuid(scope: string, key: string) {
  const hex = createHash("sha256").update(`selum:${scope}:${key}`).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20, 32)}`;
}
export function uuidOrStable(id: string, scope: string, slug: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id) ? id : stableUuid(scope, slug);
}

type Row = { id: string; slug: string; status: string; active: boolean; data: unknown; draft_data?: unknown };

export async function loadRows(table: "products" | "projects", editor = false, client?: SupabaseClient): Promise<Row[]> {
  const db = client ?? publicContentClient();
  const query = db.from(table).select(editor ? "id,slug,status,active,data,draft_data,sort_order" : "id,slug,status,active,data,sort_order").order("sort_order", { ascending: true });
  const { data, error } = await (editor ? query : query.eq("status", "published").eq("active", true));
  if (error) throw error;
  return data as unknown as Row[];
}

export async function loadEditorProducts(client: SupabaseClient): Promise<EditorProduct[]> {
  return importCatalog((await loadRows("products", true, client)).map((row) => ({ ...((row.draft_data ?? row.data) as object), id: row.id })), { draft: true });
}
export async function loadEditorProjects(client: SupabaseClient): Promise<EditorProject[]> {
  return importProjects((await loadRows("projects", true, client)).map((row) => ({ ...((row.draft_data ?? row.data) as object), id: row.id })), { draft: true });
}
export async function loadEditorCategories(client: SupabaseClient): Promise<CategoryRegistry> {
  const { data, error } = await client.from("categories").select("id,type,slug,name,active,sort_order,draft_data").order("sort_order");
  if (error) throw error;
  return {
    products: importCategories((data ?? []).filter((row) => row.type === "product" && !(row.draft_data as { deleted?: boolean } | null)?.deleted).map((row) => row.draft_data ?? { ...row, order: row.sort_order })),
    projects: importCategories((data ?? []).filter((row) => row.type === "project" && !(row.draft_data as { deleted?: boolean } | null)?.deleted).map((row) => row.draft_data ?? { ...row, order: row.sort_order })),
  };
}

export async function saveProductDrafts(client: SupabaseClient, products: EditorProduct[]) {
  const { data: existing, error: readError } = await client.from("products").select("id,slug,status,data,sort_order");
  if (readError) throw readError;
  const byId = new Map((existing ?? []).map((row) => [row.id, row]));
  for (const [index, product] of products.entries()) {
    const id = uuidOrStable(product.id, "product", product.slug);
    const before = byId.get(id);
    const draft = { ...product, id };
    const { error } = await client.from("products").upsert({
      id, slug: before?.status === "published" ? before.slug : product.slug, status: before?.status ?? "draft",
      active: before?.status === "published" ? (before.data as EditorProduct).active !== false : product.active,
      sort_order: before?.status === "published" ? before.sort_order : index + 1, show_on_home: before?.status === "published" ? Boolean((before.data as EditorProduct).home?.featured) : false,
      data: before?.data ?? {}, draft_data: draft,
    }, { onConflict: "id" });
    if (error) throw error;
  }
}

export async function saveProjectDrafts(client: SupabaseClient, projects: EditorProject[]) {
  const { data: existing, error: readError } = await client.from("projects").select("id,slug,status,data,sort_order");
  if (readError) throw readError;
  const byId = new Map((existing ?? []).map((row) => [row.id, row]));
  for (const [index, project] of projects.entries()) {
    const id = uuidOrStable(project.id, "project", project.slug);
    const before = byId.get(id);
    const published = before?.status === "published" ? before.data as EditorProject : null;
    const draft = { ...project, id };
    const { error } = await client.from("projects").upsert({
      id, slug: before?.status === "published" ? before.slug : project.slug, status: before?.status ?? "draft", active: published?.active ?? project.active,
      sort_order: before?.status === "published" ? before.sort_order : index + 1, show_on_home: published?.showOnHome ?? false,
      home_order: published?.homeOrder ?? null, category: published?.categoryId ?? "",
      name: published?.name ?? {}, location: published?.location ?? {}, cover_image: published?.coverImage ?? "",
      data: before?.data ?? {}, draft_data: draft,
    }, { onConflict: "id" });
    if (error) throw error;
  }
}
