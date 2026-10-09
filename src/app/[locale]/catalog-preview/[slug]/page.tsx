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
  const preview = token ? getCatalogPreview(token) : null;
  if (!preview) notFound();
  const products = publishedProducts(preview.catalog, { includeInactive: true }).map((product) => {
    const category = preview.categories.find((item) => item.slug === product.category);
    return category ? { ...product, categoryLabel: category.name.pt, categoryNames: category.name } : product;
  });
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();
  const pageLocale: ProductPageLocale = locale === "en" || locale === "es" ? locale : "pt";
  return <ProductPageTemplate product={product} data={product.page} locale={pageLocale} catalog={products} />;
}
