import type { Metadata } from "next";
import { supabase, fetchProductImages, type Produto } from "@/lib/supabase";
import ProductDetailPage from "./ProductDetailPage";

const FALLBACK: Record<string, Produto> = {
  "box-truss": {
    id: "box-truss",
    slug: "box-truss",
    name: "Box Truss",
    category: "Box Truss",
    tag: "Q40",
    description:
      "Estrutura treliçada de alumínio com seção quadrada, projetada para suportar cargas elevadas em eventos e instalações de grande porte. Alta rigidez e leveza são os diferenciais desta linha.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = FALLBACK[slug];
  return {
    title: `${product?.name ?? slug} — Selum`,
    description:
      product?.description ??
      "Estruturas de alumínio para grandes eventos.",
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;

  // Fetch product data
  let product: Produto | null = null;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const { data } = await supabase
      .from("produtos")
      .select("*")
      .eq("slug", slug)
      .single();
    product = data ?? null;
  }
  if (!product) product = FALLBACK[slug] ?? null;

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
