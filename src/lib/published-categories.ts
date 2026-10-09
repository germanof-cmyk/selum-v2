import { importCategories, type CategoryRegistry } from "@/lib/content-categories";
import { hasSupabase, publicContentClient } from "@/lib/content-backend";

export async function readCategories(): Promise<CategoryRegistry> {
  if (!hasSupabase()) throw new Error("Supabase precisa estar configurado para exibir categorias públicas.");
  const { data, error } = await publicContentClient()
    .from("categories")
    .select("id,type,slug,name,active,sort_order")
    .eq("active", true)
    .order("sort_order");
  if (error) throw error;
  return {
    projects: importCategories(data.filter((row) => row.type === "project").map((row) => ({ ...row, order: row.sort_order }))),
    products: importCategories(data.filter((row) => row.type === "product").map((row) => ({ ...row, order: row.sort_order }))),
  };
}
