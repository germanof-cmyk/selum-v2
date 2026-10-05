export type ProductPageLocale = "pt" | "en" | "es";
export type BenefitIcon = "Layers" | "Lightbulb" | "Box" | "Factory";

export type ProductPageText = {
  name: string;
  description: string;
  benefits: string[];
  applicationTitle?: string;
  applicationDescription?: string;
  constructionTitle?: string;
  constructionDescription?: string;
  constructionCaptions?: string[];
};

export type ProductPageCopy = ProductPageText & {
  home: string;
  products: string;
  category: string;
  quote: string;
  specialist: string;
  galleryLabel: string;
  previousImage: string;
  nextImage: string;
  showImage: string;
  breadcrumbLabel: string;
  benefitsLabel: string;
  informationLabel: string;
  specsTitle: string;
  modelsTitle: string;
  applicationLabel: string;
  applicationCta: string;
  constructionLabel: string;
  technicalLabel: string;
  technicalTitle: string;
  downloadTechnical: string;
  relatedLabel: string;
  relatedTitle: string;
};

export type ProductSpecification = { label: string; value: string };
export type ProductModel = {
  code?: string;
  name?: string;
  description?: string;
  localizedName?: Partial<Record<ProductPageLocale, string>>;
  dimensions?: string;
  image?: string;
  specifications?: ProductSpecification[];
};
export type ProductModelGroup = {
  id: string;
  name: Partial<Record<ProductPageLocale, string>>;
  models: ProductModel[];
};

export type ProductPageData = {
  gallery: string[];
  benefitIcons: BenefitIcon[];
  specifications?: ProductSpecification[];
  models?: ProductModel[];
  modelGroups?: ProductModelGroup[];
  modelIllustration?: string;
  applicationImage?: string;
  constructionImages?: string[];
  technicalDrawing?: string;
  technicalFile?: string;
  relatedSlugs: string[];
  text: Record<ProductPageLocale, ProductPageText>;
};

