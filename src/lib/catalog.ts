import type { ProductPageData } from "@/lib/product-page-data";

export type CatalogCategory = "estrutural" | "acessorios" | "acesso" | (string & {});

export type CatalogPlacement = {
  visible: boolean;
  order: number | null;
  cardImage: string | null;
  heroFeatured: boolean;
  heroOrder: number | null;
  heroImage: string | null;
  tag?: string;
  cardSpecs?: string[];
  featured?: boolean;
};

export type CatalogProduct = {
  slug: string;
  name: string;
  description: string;
  tag: string;
  category: CatalogCategory;
  categoryLabel: string;
  cardSpecs: string[];
  page: ProductPageData;
  featured?: boolean;
  home?: { featured: boolean; order: number | null; image: string | null };
  catalog?: CatalogPlacement;
  relatedImage?: string | null;
};
