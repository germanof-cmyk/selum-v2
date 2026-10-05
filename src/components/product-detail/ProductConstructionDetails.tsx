import Image from "next/image";
import type { ProductPageCopy, ProductPageData } from "@/lib/product-page-data";
import styles from "./ProductPage.module.css";

export default function ProductConstructionDetails({ data, copy }: { data: ProductPageData; copy: ProductPageCopy }) {
  const images = data.constructionImages ?? [];
  if (images.length === 0 || !copy.constructionTitle) return null;

  return (
    <section className={styles.constructionSection}>
      <div className={`${styles.shell} ${styles.constructionGrid}`}>
        <div className={styles.constructionIntro}>
          <span className={styles.eyebrow}>{copy.constructionLabel}</span>
          <h2>{copy.constructionTitle}</h2>
          {copy.constructionDescription && <p>{copy.constructionDescription}</p>}
        </div>
        <div className={`${styles.constructionImages} ${images.length === 1 ? styles.constructionSingle : ""}`}>
          {images.map((image, index) => (
            <figure key={`${image}-${index}`}>
              <div className={styles.constructionImage}>
                <Image src={image} alt={copy.constructionCaptions?.[index] ?? ""} fill sizes="(max-width: 760px) 70vw, 25vw" />
              </div>
              {copy.constructionCaptions?.[index] && <figcaption>{copy.constructionCaptions[index]}</figcaption>}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
