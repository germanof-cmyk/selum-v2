import ProductsCatalogClient from "./ProductsCatalogClient";
import { getPublicProducts } from "@/lib/published-catalog";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await getPublicProducts();
  return <ProductsCatalogClient products={products} />;
}
