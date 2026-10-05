import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import type { CatalogProduct } from "@/lib/catalog";
import type { ProductPageCopy, ProductPageData, ProductPageLocale } from "@/lib/product-page-data";
import styles from "./ProductPage.module.css";

export default function ProductTechnicalAndRelated({
  data,
  copy,
  locale,
  slug,
  catalog,
}: {
  data: ProductPageData;
  copy: ProductPageCopy;
  locale: ProductPageLocale;
  slug: string;
  catalog: CatalogProduct[];
}) {
  const related = data.relatedSlugs
    .filter((relatedSlug) => relatedSlug !== slug)
    .map((relatedSlug) => catalog.find((product) => product.slug === relatedSlug))
    .filter((product): product is CatalogProduct => product != null && Boolean(product.relatedImage || product.page.gallery[0]));
  const hasTechnical = Boolean(data.technicalDrawing || data.technicalFile);
  if (!hasTechnical && related.length === 0) return null;

  return (
    <section className={styles.finalSection}>
      <div className={`${styles.shell} ${hasTechnical ? styles.finalGrid : styles.relatedOnly}`}>
        {hasTechnical && (
          <div className={styles.technicalArea}>
            <div>
              <span className={styles.eyebrow}>{copy.technicalLabel}</span>
              <h2>{copy.technicalTitle}</h2>
              {data.technicalFile && (
                <a href={data.technicalFile} download className={styles.downloadLink}>
                  <Download size={15} />{copy.downloadTechnical}
                </a>
              )}
            </div>
            {data.technicalDrawing && (
              <div className={styles.technicalImage}>
                <Image src={data.technicalDrawing} alt={copy.technicalTitle} fill sizes="50vw" />
              </div>
            )}
          </div>
        )}
        {related.length > 0 && (
          <div className={styles.relatedArea}>
            <span className={styles.eyebrow}>{copy.relatedLabel}</span>
            <h2>{copy.relatedTitle}</h2>
            <div className={styles.relatedList}>
              {related.map((product) => (
                <Link href={`/${locale}/produtos/${product.slug}`} key={product.slug} className={styles.relatedProduct}>
                  <span className={styles.relatedImage}><Image src={product.relatedImage || product.page.gallery[0]} alt="" fill sizes="220px" /></span>
                  <span className={styles.relatedName}>{product.page.text[locale].name}<ArrowRight size={14} /></span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
