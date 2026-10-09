import type { CatalogProduct } from "@/lib/catalog";
import { publishedProducts, type PublishedCatalog } from "@/lib/catalog-publication";
import { readCategories } from "@/lib/published-categories";
import { hasSupabase } from "@/lib/content-backend";
import { loadRows } from "@/lib/supabase-content";

export async function readPublishedCatalog(): Promise<PublishedCatalog> {
  if (!hasSupabase()) throw new Error("Supabase precisa estar configurado para exibir produtos públicos.");
  const rows = await loadRows("products");
  return Object.fromEntries(rows.map((row) => [row.slug, row.data]));
}

export async function getPublicProducts(): Promise<CatalogProduct[]> {
  const [published, registry] = await Promise.all([readPublishedCatalog(), readCategories()]);
  return publishedProducts(published).map((product) => {
    const category = registry.products.find((item) => item.slug === product.category);
    return category ? { ...product, categoryLabel: category.name.pt, categoryNames: category.name } : product;
  });
}
