import type { CatalogProduct } from "@/lib/catalog";
import { importCatalog, type EditorProduct } from "@/lib/catalog-editor";
import type { BenefitIcon, ProductPageData, ProductPageLocale } from "@/lib/product-page-data";

export type PublishedCatalog = Record<string, unknown>;

const locales: ProductPageLocale[] = ["pt", "es", "en"];
const icons: BenefitIcon[] = ["Layers", "Lightbulb", "Box", "Factory"];
const firstText = (values: Record<ProductPageLocale, string>, locale: ProductPageLocale) =>
  values[locale]?.trim() || values.pt?.trim() || values.en?.trim() || values.es?.trim() || "";

export function publishedProducts(raw: PublishedCatalog, { includeInactive = false }: { includeInactive?: boolean } = {}): CatalogProduct[] {
  const products = importCatalog(raw);
  return products.filter((product) => includeInactive || product.active).map((product) => toCatalogProduct(product));
}

function toCatalogProduct(product: EditorProduct): CatalogProduct {
  const gallery = Array.from(new Set(product.heroImages.filter(Boolean)));
  const benefits = product.benefits.filter((item) => Object.values(item.text).some(Boolean));
  const page: ProductPageData = {
    gallery,
    benefitIcons: benefits.map((benefit) => icons.includes(benefit.icon as BenefitIcon) ? benefit.icon as BenefitIcon : "Box"),
    ...(product.specifications.length && {
      specifications: product.specifications
        .filter((spec) => spec.label && spec.value)
        .map((spec) => ({ label: spec.label, value: [spec.value, spec.unit].filter(Boolean).join(" ") })),
    }),
    ...(product.modelGroups.length && {
      modelGroups: product.modelGroups.map((group) => ({
        id: group.id,
        name: group.name,
        models: group.models.filter((model) => model.code || model.name).map((model) => ({
          ...(model.code && { code: model.code }),
          ...(model.name && { name: model.name }),
          ...(model.dimensions && { dimensions: model.dimensions }),
          ...(model.image && { image: model.image }),
          ...(model.note && { description: model.note }),
        })),
      })),
    }),
    ...(product.modelIllustration && { modelIllustration: product.modelIllustration }),
    ...(product.application.image && { applicationImage: product.application.image }),
    ...(product.images.details.length && { constructionImages: product.images.details }),
    ...(product.technicalDrawing && { technicalDrawing: product.technicalDrawing }),
    ...(product.technicalFile && { technicalFile: product.technicalFile }),
    relatedSlugs: product.relatedProducts.filter((slug) => slug !== product.slug),
    text: Object.fromEntries(locales.map((locale) => [locale, {
      name: firstText(product.name, locale) || product.slug,
      description: firstText(product.description, locale),
      benefits: benefits.map((benefit) => firstText(benefit.text, locale)).filter(Boolean),
      ...(product.application.image && {
        applicationTitle: firstText(product.application.title, locale),
        applicationDescription: firstText(product.application.text, locale),
      }),
    }])) as ProductPageData["text"],
  };

  return {
    slug: product.slug,
    name: page.text.pt.name,
    description: page.text.pt.description,
    tag: product.catalog.tag || product.category,
    category: product.category,
    categoryLabel: product.category,
    cardSpecs: product.catalog.cardSpecs,
    featured: product.catalog.featured,
    home: { featured: product.home.featured, order: product.home.order, image: product.home.image || null },
    catalog: {
      visible: product.catalog.visible,
      order: product.catalog.order,
      cardImage: product.catalog.cardImage || null,
      heroFeatured: product.catalog.heroFeatured,
      heroOrder: product.catalog.heroOrder,
      heroImage: product.catalog.heroImage || null,
      tag: product.catalog.tag,
      cardSpecs: product.catalog.cardSpecs,
      featured: product.catalog.featured,
    },
    relatedImage: product.relatedImage || null,
    page,
  };
}

export function validatePublication(products: EditorProduct[]) {
  for (const product of products) {
    if (!product.slug.trim()) throw new Error("Todos os produtos precisam de slug para publicação.");
    for (const group of product.modelGroups) {
      for (const [index, model] of group.models.entries()) {
        if (!model.code.trim() && !model.name.trim() && Object.values(model).some((value) => value.trim())) {
          throw new Error(`${product.slug}: modelo ${index + 1} precisa de código ou nome.`);
        }
      }
    }
  }
}
