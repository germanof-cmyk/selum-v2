import { createPublicClient, type Produto } from "@/lib/supabase";

/* ─── LOCAL IMAGE MAP ────────────────────────────────────────────────────── */
// Maps slug → static image path for cards on the listing page.

export const PRODUCT_IMAGES: Record<string, string> = {
  "box-truss":   "/images/products/box-truss.png",
  "bases-cubos": "/images/products/base-cubos.png",
  "escadas":     "/images/products/escadas.png",
};

export async function getProducts(): Promise<{
  products: Produto[];
  fromDb: boolean;
}> {
  const { data, error } = await createPublicClient()
    .from("products")
    .select("id,slug,status,active,data,sort_order")
    .eq("status", "published")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return {
    products: (data ?? []).map((row) => {
      const content = row.data as { name?: { pt?: string }; category?: string; catalog?: { tag?: string }; description?: { pt?: string } };
      return {
        id: row.id,
        slug: row.slug,
        name: content.name?.pt || row.slug,
        category: content.category || "",
        tag: content.catalog?.tag || content.category || "",
        description: content.description?.pt || "",
      };
    }),
    fromDb: true,
  };
}
