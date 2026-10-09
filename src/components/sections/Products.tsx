"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { HomeProduct } from "@/lib/home-products";
import type { ProductPageLocale } from "@/lib/product-page-data";
import styles from "./Products.module.css";

export default function Products({ products }: { products: HomeProduct[] }) {
  const t = useTranslations("products");
  const locale = useLocale() as ProductPageLocale;
  const [filter, setFilter] = useState("all");
  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean)));
  const visible = filter === "all" ? products : products.filter((product) => product.category === filter);
  const countStyle = { "--card-count": Math.max(1, visible.length) } as CSSProperties;

  function categoryName(category: string) {
    const names = products.find((product) => product.category === category)?.categoryNames;
    return names?.[locale] || names?.pt || category;
  }

  return (
    <section id="products" className={styles.section}>
      <div className={styles.shell}>
        <div className={styles.header}>
          <div>
            <span className={styles.eyebrow}>{t("label")}</span>
            <h2>{t("title")} <span>{t("title_highlight")}</span></h2>
          </div>
          {categories.length > 1 && (
            <div className={styles.filters} aria-label={t("filter_label")}>
              <button type="button" className={filter === "all" ? styles.filterActive : ""} onClick={() => setFilter("all")}>{t("all")}</button>
              {categories.map((category) => (
                <button type="button" key={category} className={filter === category ? styles.filterActive : ""} onClick={() => setFilter(category)}>{categoryName(category)}</button>
              ))}
            </div>
          )}
        </div>

        {products.length === 0 ? (
          <p className={styles.empty}>{t("empty")}</p>
        ) : (
          <div className={`${styles.cards} ${visible.length > 5 ? styles.cardsScroll : ""}`} style={countStyle}>
            {visible.map((product) => (
              <Link className={styles.card} href={`/${locale}/produtos/${product.slug}`} key={product.slug}>
                <div className={styles.imageArea}>
                  {product.image && <Image src={product.image} alt="" fill sizes="(max-width: 600px) 82vw, (max-width: 1100px) 33vw, 20vw" />}
                  <span className={styles.imageRule} aria-hidden="true" />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.category}>{categoryName(product.category)}</span>
                  <h3>{product.names[locale] || product.names.pt}</h3>
                  <span className={styles.cardLink}>{t("view_product")} <ArrowRight size={14} aria-hidden="true" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Link className={styles.allLink} href={`/${locale}/produtos`}>{t("view_all")} <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </section>
  );
}
