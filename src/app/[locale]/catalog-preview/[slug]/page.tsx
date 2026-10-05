import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductPageTemplate from "@/components/product-detail/ProductPageTemplate";
import { getCatalogPreview } from "@/lib/catalog-preview";
import { publishedProducts } from "@/lib/catalog-publication";
import type { ProductPageLocale } from "@/lib/product-page-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function CatalogPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  if (process.env.NODE_ENV !== "development") notFound();
  const [{ locale, slug }, { token }] = await Promise.all([params, searchParams]);
  const catalog = token ? getCatalogPreview(token) : null;
  if (!catalog) notFound();
  const products = publishedProducts(catalog, { includeInactive: true });
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const pageLocale: ProductPageLocale = locale === "en" || locale === "es" ? locale : "pt";
  return <ProductPageTemplate product={product} data={product.page} locale={pageLocale} catalog={products} />;
}
