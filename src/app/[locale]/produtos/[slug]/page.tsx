import type { Metadata } from "next";
import { supabase, fetchProductImages, type Produto } from "@/lib/supabase";
import { STATIC_PRODUCTS } from "@/lib/db/products";
import ProductDetailPage from "./ProductDetailPage";

function getFallback(slug: string): Produto | null {
  return STATIC_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getFallback(slug);
  return {
    title: `${product?.name ?? slug} — Selum`,
    description:
      product?.description ?? "Estruturas de alumínio para grandes eventos.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  // Fetch product data from Supabase (table: products)
  let product: Produto | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await supabase
      .from("products")
      .select("id, slug, name, category, tag, description")
      .eq("slug", slug)
      .single();
    product = data ?? null;
  }
  if (!product) product = getFallback(slug);

  // Fetch images from Supabase Storage
  const { hero, gallery } = await fetchProductImages(slug);

  return (
    <ProductDetailPage
      slug={slug}
      product={product}
      heroUrl={hero}
      galleryUrls={gallery}
    />
  );
}
