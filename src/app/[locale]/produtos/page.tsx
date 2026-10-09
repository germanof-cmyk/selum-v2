import ProductsCatalogClient from "./ProductsCatalogClient";
import { getPublicProducts } from "@/lib/published-catalog";
import { readCategories } from "@/lib/published-categories";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, registry] = await Promise.all([getPublicProducts(), readCategories()]);
  return <ProductsCatalogClient products={products} categories={registry.products} />;
}
