import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductPageTemplate from "@/components/product-detail/ProductPageTemplate";
import { getPublicProducts } from "@/lib/published-catalog";
import type { ProductPageLocale } from "@/lib/product-page-data";

type ProductRouteParams = { params: Promise<{ locale: string; slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductRouteParams): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = (await getPublicProducts()).find((item) => item.slug === slug);
  if (!product) return {};
  const pageLocale: ProductPageLocale = locale === "en" || locale === "es" ? locale : "pt";
  const text = product.page.text[pageLocale];
  return { title: `${text.name} — Selum`, description: text.description };
}

export default async function ProductPage({
  params,
}: ProductRouteParams) {
  const { locale, slug } = await params;
  const catalog = await getPublicProducts();
  const product = catalog.find((item) => item.slug === slug);
  if (!product) notFound();

  const pageLocale: ProductPageLocale = locale === "en" || locale === "es" ? locale : "pt";
  return <ProductPageTemplate product={product} data={product.page} locale={pageLocale} catalog={catalog} />;
}
