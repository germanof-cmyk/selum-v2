export type EditorLocale = "pt" | "es" | "en";
export type LocalizedText = Record<EditorLocale, string>;
export type EditorStatus = "draft" | "review" | "approved";

export type EditorModel = {
  code: string;
  name: string;
  dimensions: string;
  image: string;
  note: string;
};
export type EditorModelGroup = { id: string; name: LocalizedText; models: EditorModel[] };

export type EditorSpecification = { label: string; value: string; unit: string };
export type EditorBenefit = { text: LocalizedText; icon: string };
export type EditorHomePlacement = { featured: boolean; order: number | null; image: string };
export type EditorCatalogPlacement = {
  visible: boolean; order: number | null; cardImage: string;
  heroFeatured: boolean; heroOrder: number | null; heroImage: string;
  tag: string; cardSpecs: string[]; featured: boolean;
};

export type EditorProduct = {
  id: string;
  slug: string;
  category: string;
  name: LocalizedText;
  description: LocalizedText;
  status: EditorStatus;
  active: boolean;
  home: EditorHomePlacement;
  catalog: EditorCatalogPlacement;
  relatedImage: string;
  modelGroups: EditorModelGroup[];
  heroImages: string[];
  modelIllustration: string;
  specifications: EditorSpecification[];
  benefits: EditorBenefit[];
  images: { details: string[] };
  application: { image: string; title: LocalizedText; text: LocalizedText };
  technicalDrawing: string;
  technicalFile: string;
  relatedProducts: string[];
};

export type EditorAsset = { path: string; name: string; folder: string; type: "image" | "pdf" };

export const STORAGE_KEY = "selum.catalog-editor.v1";
export const emptyText = (): LocalizedText => ({ pt: "", es: "", en: "" });
export const newId = () => globalThis.crypto?.randomUUID?.() ?? `editor-${Date.now()}-${Math.random()}`;

export function emptyProduct(): EditorProduct {
  return {
    id: newId(), slug: "", category: "estrutural", name: emptyText(),
    description: emptyText(), status: "draft", active: true,
    home: { featured: false, order: null, image: "" },
    catalog: { visible: false, order: null, cardImage: "", heroFeatured: false, heroOrder: null, heroImage: "", tag: "", cardSpecs: [], featured: false },
    relatedImage: "",
    modelGroups: [], heroImages: [], modelIllustration: "",
    specifications: [], benefits: [],
    images: { details: [] },
    application: { image: "", title: emptyText(), text: emptyText() },
    technicalDrawing: "", technicalFile: "", relatedProducts: [],
  };
}

const string = (value: unknown) => typeof value === "string" ? value : "";
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const numberOrNull = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : null;
const fixAssetPath = (value: unknown) => {
  const image = string(value);
  if (image === "/images/products/icons/Ilustração Técnica de Painel Treliçado.png") {
    return "/images/products/base-tubular/Ilustração Técnica de Painel Treliçado.png";
  }
  if (image === "/images/products/Base tubular padrao p30.jpeg") {
    return "/images/products/base-tubular/Base tubular padrao p30.jpeg";
  }
  return image;
};
const record = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const localized = (value: unknown): LocalizedText => {
  const source = record(value);
  return { pt: string(source.pt), es: string(source.es), en: string(source.en) };
};
const parseModel = (item: unknown): EditorModel => {
  const model = record(item);
  return {
    code: string(model.code), name: string(model.name),
    dimensions: string(model.dimensions), image: fixAssetPath(model.image),
    note: string(model.note) || string(model.description),
  };
};

export function importCatalog(value: unknown, { draft = false }: { draft?: boolean } = {}): EditorProduct[] {
  const root = record(value);
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(root);
  if (entries.length === 0) return [];
  const products = entries.map(([key, raw]) => {
    const source = record(raw);
    const images = record(source.images);
    const application = record(source.application);
    const home = record(source.home);
    const catalog = record(source.catalog);
    const status = source.status;
    const product = emptyProduct();
    product.id = draft && typeof source.id === "string" ? source.id : product.id;
    product.slug = typeof source.slug === "string" ? source.slug : key;
    product.category = string(source.category) || "estrutural";
    product.name = localized(source.name);
    product.description = localized(source.description);
    product.status = status === "review" || status === "approved" ? status : "draft";
    product.active = typeof source.active === "boolean" ? source.active : true;
    product.home = {
      featured: typeof home.featured === "boolean" ? home.featured : source.showOnHome === true,
      order: numberOrNull(home.order ?? source.homeOrder),
      image: fixAssetPath(home.image ?? source.homeImage),
    };
    product.catalog = {
      visible: catalog.visible === true,
      order: numberOrNull(catalog.order),
      cardImage: fixAssetPath(catalog.cardImage),
      heroFeatured: catalog.heroFeatured === true,
      heroOrder: numberOrNull(catalog.heroOrder),
      heroImage: fixAssetPath(catalog.heroImage),
      tag: string(catalog.tag),
      cardSpecs: strings(catalog.cardSpecs),
      featured: catalog.featured === true,
    };
    product.relatedImage = fixAssetPath(source.relatedImage);
    const legacyModels = (Array.isArray(source.models) ? source.models : []).map(parseModel);
    product.modelGroups = Array.isArray(source.modelGroups) && source.modelGroups.length > 0
      ? source.modelGroups.map((item, index) => {
          const group = record(item);
          return {
            id: string(group.id) || `group-${index + 1}`,
            name: localized(group.name),
            models: (Array.isArray(group.models) ? group.models : []).map(parseModel),
          };
        })
      : legacyModels.length ? [{ id: "legacy-models", name: emptyText(), models: legacyModels }] : [];
    product.heroImages = Array.isArray(source.heroImages)
      ? strings(source.heroImages)
      : [string(images.main), ...strings(images.gallery)].filter(Boolean);
    product.modelIllustration = fixAssetPath(source.modelIllustration);
    product.specifications = (Array.isArray(source.specifications) ? source.specifications : []).map((item) => {
      const spec = record(item);
      return { label: string(spec.label), value: string(spec.value), unit: string(spec.unit) };
    });
    product.benefits = (Array.isArray(source.benefits) ? source.benefits : []).map((item) => {
      const benefit = record(item);
      return { text: localized(benefit.text), icon: string(benefit.icon) };
    });
    product.images = { details: strings(images.details).map(fixAssetPath) };
    product.application = {
      image: fixAssetPath(application.image),
      title: localized(application.title),
      text: localized(application.text),
    };
    product.technicalDrawing = fixAssetPath(source.technicalDrawing);
    product.technicalFile = string(source.technicalFile);
    product.relatedProducts = strings(source.relatedProducts).filter((slug) => slug !== product.slug);
    return product;
  });
  const slugs = products.map((product) => product.slug);
  if (!draft && (slugs.some((slug) => !slug.trim()) || new Set(slugs).size !== slugs.length)) {
    throw new Error("O JSON contém slugs vazios ou repetidos.");
  }
  return products;
}

const cleanText = (value: LocalizedText) =>
  Object.fromEntries(Object.entries(value).filter(([, text]) => text.trim())) as Partial<LocalizedText>;

export function exportCatalog(products: EditorProduct[]) {
  const slugs = products.map((product) => product.slug.trim());
  if (slugs.some((slug) => !slug) || new Set(slugs).size !== slugs.length) {
    throw new Error("Preencha slugs únicos antes de exportar.");
  }

  return Object.fromEntries(products.map((product) => {
    const exportModels = (items: EditorModel[]) => items
      .filter((model) => model.code.trim() || model.name.trim())
      .map((model) => ({
        ...(model.code.trim() && { code: model.code.trim() }),
        ...(model.name.trim() && { name: model.name.trim() }),
        ...(model.dimensions.trim() && { dimensions: model.dimensions.trim() }),
        ...(model.image.trim() && { image: model.image.trim() }),
        ...(model.note.trim() && { note: model.note.trim() }),
      }));
    const modelGroups = product.modelGroups.map((group) => ({
      id: group.id,
      ...(Object.values(group.name).some((name) => name.trim()) && { name: cleanText(group.name) }),
      models: exportModels(group.models),
    }));
    const models = modelGroups.flatMap((group) => group.models);
    const heroImages = product.heroImages.map((image) => image.trim()).filter(Boolean);
    const specifications = product.specifications
      .filter((spec) => spec.label.trim() && spec.value.trim())
      .map((spec) => ({
        label: spec.label.trim(), value: spec.value.trim(),
        ...(spec.unit.trim() && { unit: spec.unit.trim() }),
      }));
    const benefits = product.benefits
      .filter((benefit) => Object.values(benefit.text).some((text) => text.trim()))
      .map((benefit) => ({
        text: cleanText(benefit.text),
        ...(benefit.icon.trim() && { icon: benefit.icon.trim() }),
      }));
    const application = {
      ...(product.application.image.trim() && { image: product.application.image.trim() }),
      ...(Object.values(product.application.title).some((text) => text.trim()) && { title: cleanText(product.application.title) }),
      ...(Object.values(product.application.text).some((text) => text.trim()) && { text: cleanText(product.application.text) }),
    };
    return [product.slug.trim(), {
      slug: product.slug.trim(),
      category: product.category.trim(),
      name: cleanText(product.name),
      description: cleanText(product.description),
      status: product.status,
      active: product.active,
      home: {
        featured: product.home.featured,
        order: product.home.order,
        image: product.home.image.trim() || null,
      },
      catalog: {
        visible: product.catalog.visible,
        order: product.catalog.order,
        cardImage: product.catalog.cardImage.trim() || null,
        heroFeatured: product.catalog.heroFeatured,
        heroOrder: product.catalog.heroOrder,
        heroImage: product.catalog.heroImage.trim() || null,
        ...(product.catalog.tag.trim() && { tag: product.catalog.tag.trim() }),
        ...(product.catalog.cardSpecs.length && { cardSpecs: product.catalog.cardSpecs }),
        ...(product.catalog.featured && { featured: true }),
      },
      ...(product.relatedImage.trim() && { relatedImage: product.relatedImage.trim() }),
      ...(models.length && { models }),
      ...(modelGroups.length && { modelGroups }),
      heroImages,
      ...(product.modelIllustration.trim() && { modelIllustration: product.modelIllustration.trim() }),
      ...(specifications.length && { specifications }),
      ...(benefits.length && { benefits }),
      images: {
        ...(heroImages[0] && { main: heroImages[0] }),
        ...(heroImages.length > 1 && { gallery: heroImages.slice(1) }),
        ...(product.images.details.length && { details: product.images.details }),
      },
      ...(Object.keys(application).length && { application }),
      ...(product.technicalDrawing.trim() && { technicalDrawing: product.technicalDrawing.trim() }),
      ...(product.technicalFile.trim() && { technicalFile: product.technicalFile.trim() }),
      ...(product.relatedProducts.length && { relatedProducts: product.relatedProducts.filter((slug) => slug !== product.slug) }),
    }];
  }));
}
