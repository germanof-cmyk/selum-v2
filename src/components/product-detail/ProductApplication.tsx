import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ProductPageCopy, ProductPageData, ProductPageLocale } from "@/lib/product-page-data";
import styles from "./ProductPage.module.css";

export default function ProductApplication({
  data,
  copy,
  locale,
}: {
  data: ProductPageData;
  copy: ProductPageCopy;
  locale: ProductPageLocale;
}) {
  if (!data.applicationImage || !copy.applicationTitle) return null;

  return (
    <section className={styles.application}>
      <Image src={data.applicationImage} alt="" fill sizes="100vw" className={styles.applicationImage} />
      <div className={styles.applicationShade} />
      <div className={`${styles.shell} ${styles.applicationContent}`}>
        <span className={styles.applicationEyebrow}>{copy.applicationLabel}</span>
        <h2>{copy.applicationTitle}</h2>
        {copy.applicationDescription && <p>{copy.applicationDescription}</p>}
        <Link href={`/${locale}#projects`} className={styles.applicationLink}>
          {copy.applicationCta}<ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}
