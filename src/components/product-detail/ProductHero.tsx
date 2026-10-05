"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, ChevronLeft, ChevronRight, Factory, Layers, Lightbulb, Mail } from "lucide-react";
import type { ProductPageCopy, ProductPageData, ProductPageLocale } from "@/lib/product-page-data";
import styles from "./ProductPage.module.css";

const benefitIcons = { Layers, Lightbulb, Box, Factory };

function ProductGallery({
  images, name, copy, selected, onSelect,
}: {
  images: string[];
  name: string;
  copy: ProductPageCopy;
  selected: number;
  onSelect: (index: number) => void;
}) {
  const current = images[selected] ?? images[0];

  function move(direction: number) {
    onSelect((selected + direction + images.length) % images.length);
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryStage}>
        {current && <Image
          key={current}
          src={current}
          alt={name}
          fill
          sizes="(max-width: 760px) 100vw, 58vw"
          className={styles.galleryMainImage}
          priority
        />}
        {images.length > 1 && (
          <div className={styles.galleryControls}>
            <span>{String(selected + 1).padStart(2, "0")}/{String(images.length).padStart(2, "0")}</span>
            <button type="button" onClick={() => move(-1)} aria-label={copy.previousImage}><ChevronLeft size={15} /></button>
            <button type="button" onClick={() => move(1)} aria-label={copy.nextImage}><ChevronRight size={15} /></button>
          </div>
        )}
      </div>
      {images.length > 1 && <div className={styles.thumbnails} aria-label={`${copy.galleryLabel} ${name}`}>
        {images.map((image, index) => (
          <button
            type="button"
            key={image}
            className={`${styles.thumbnail} ${selected === index ? styles.thumbnailActive : ""}`}
            onClick={() => onSelect(index)}
            aria-label={`${copy.showImage} ${index + 1}: ${name}`}
            aria-pressed={selected === index}
          >
            <Image src={image} alt="" fill sizes="110px" />
          </button>
        ))}
      </div>}
    </div>
  );
}

export default function ProductHero({
  data,
  copy,
  locale,
  images,
  selectedImageIndex,
  onSelectImage,
}: {
  data: ProductPageData;
  copy: ProductPageCopy;
  locale: ProductPageLocale;
  images: string[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
}) {
  return (
    <section className={styles.heroArea}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumb} aria-label={copy.breadcrumbLabel}>
          <Link href={`/${locale}`}>{copy.home}</Link><span>›</span>
          <Link href={`/${locale}/produtos`}>{copy.products}</Link><span>›</span>
          <span>{copy.category}</span><span>›</span>
          <span aria-current="page">{copy.name}</span>
        </nav>
        <div className={styles.heroGrid}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>{copy.category}</span>
            <h1>{copy.name}</h1>
            <p className={styles.heroDescription}>{copy.description}</p>
            <div className={styles.heroActions}>
              <a href="https://api.whatsapp.com/send?phone=554734401445" target="_blank" rel="noopener noreferrer" className={styles.primaryButton}>
                {copy.quote}<ArrowRight size={15} />
              </a>
              <a href="mailto:contato@selum.com.br" className={styles.secondaryButton}>
                <Mail size={15} />{copy.specialist}
              </a>
            </div>
            {copy.benefits.length > 0 && <div className={styles.benefits} aria-label={copy.benefitsLabel}>
              {copy.benefits.map((benefit, index) => {
                const Icon = benefitIcons[data.benefitIcons[index]];
                return (
                  <div className={styles.benefit} key={benefit}>
                    {Icon && <Icon size={27} strokeWidth={1.35} aria-hidden="true" />}
                    <span>{benefit}</span>
                  </div>
                );
              })}
            </div>}
          </div>
          <ProductGallery images={images} name={copy.name} copy={copy} selected={selectedImageIndex} onSelect={onSelectImage} />
        </div>
      </div>
    </section>
  );
}
