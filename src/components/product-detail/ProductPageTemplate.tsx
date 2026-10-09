import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useTranslations } from "next-intl";
import type { CatalogProduct } from "@/lib/catalog";
import type { ProductPageData, ProductPageLocale } from "@/lib/product-page-data";
import ProductInteractiveSections from "./ProductInteractiveSections";
import ProductApplication from "./ProductApplication";
import ProductConstructionDetails from "./ProductConstructionDetails";
import ProductTechnicalAndRelated from "./ProductTechnicalAndRelated";
import styles from "./ProductPage.module.css";

export default function ProductPageTemplate({
  product,
  data,
  locale,
  catalog,
}: {
  product: CatalogProduct;
  data: ProductPageData;
  locale: ProductPageLocale;
  catalog: CatalogProduct[];
}) {
  const t = useTranslations("productDetail");
  const copy = {
    ...data.text[locale],
    constructionTitle: data.text[locale].constructionTitle || (data.constructionImages?.length ? t("constructionLabel") : undefined),
    home: t("home"),
    products: t("products"),
    category: product.categoryNames?.[locale] || product.categoryNames?.pt || product.categoryLabel,
    quote: t("quote"),
    specialist: t("specialist"),
    galleryLabel: t("galleryLabel"),
    previousImage: t("previousImage"),
    nextImage: t("nextImage"),
    showImage: t("showImage"),
    breadcrumbLabel: t("breadcrumbLabel"),
    benefitsLabel: t("benefitsLabel"),
    informationLabel: t("informationLabel"),
    specsTitle: t("specsTitle"),
    modelsTitle: t("modelsTitle"),
    applicationLabel: t("applicationLabel"),
    applicationCta: t("applicationCta"),
    constructionLabel: t("constructionLabel"),
    technicalLabel: t("technicalLabel"),
    technicalTitle: t("technicalTitle"),
    downloadTechnical: t("downloadTechnical"),
    relatedLabel: t("relatedLabel"),
    relatedTitle: t("relatedTitle"),
  };

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <ProductInteractiveSections data={data} copy={copy} locale={locale} />
        <ProductApplication data={data} copy={copy} locale={locale} />
        <ProductConstructionDetails data={data} copy={copy} />
        <ProductTechnicalAndRelated data={data} copy={copy} locale={locale} slug={product.slug} catalog={catalog} />
      </main>
      <Footer />
    </>
  );
}
