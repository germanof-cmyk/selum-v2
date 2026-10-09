import type { CatalogProduct } from "@/lib/catalog";
import type { ProductPageLocale } from "@/lib/product-page-data";
import type { LocalizedText } from "@/lib/catalog-editor";

export type HomeProduct = {
  slug: string;
  category: string;
  categoryNames?: LocalizedText;
  names: Record<ProductPageLocale, string>;
  image: string | null;
  order: number | null;
};

export function selectHomeProducts(catalog: CatalogProduct[]): HomeProduct[] {
  return catalog
    .filter((product) => product.home?.featured === true)
    .sort((a, b) => (a.home?.order ?? Infinity) - (b.home?.order ?? Infinity) || a.slug.localeCompare(b.slug))
    .slice(0, 6)
    .map((product) => ({
      slug: product.slug,
      category: product.category,
      categoryNames: product.categoryNames,
      names: {
        pt: product.page.text.pt.name,
        es: product.page.text.es.name,
        en: product.page.text.en.name,
      },
      image: product.home?.image || product.page.gallery[0] || null,
      order: product.home?.order ?? null,
    }));
}
