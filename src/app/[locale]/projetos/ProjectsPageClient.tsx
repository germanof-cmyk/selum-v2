"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Box, Cog, Search, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { projectLocation, projectText, type EditorProject } from "@/lib/projects";
import { categoryName, type ContentCategory } from "@/lib/content-categories";
import ProjectCard from "./ProjectCard";
import styles from "./projects.module.css";

export default function ProjectsPageClient({ locale, projects, categories }: { locale: string; projects: EditorProject[]; categories: ContentCategory[] }) {
  const t = useTranslations("projectsPage");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");
  const sorted = [...projects].sort((a, b) =>
    (a.projectsOrder ?? Number.MAX_SAFE_INTEGER) - (b.projectsOrder ?? Number.MAX_SAFE_INTEGER) ||
    a.slug.localeCompare(b.slug)
  );
  const visibleCategories = categories.filter((item) => item.active && sorted.some((project) => project.categoryId === item.id)).sort((a, b) => a.order - b.order);
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const visible = sorted.filter((project) => {
    if (category && project.categoryId !== category) return false;
    if (!normalizedQuery) return true;
    return [projectText(project.name, locale), projectText(project.category, locale), projectLocation(project, locale)]
      .some((value) => value.toLocaleLowerCase(locale).includes(normalizedQuery));
  });
  const heroImage = sorted[0]?.coverImage;

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.shell}>
          <nav className={styles.breadcrumb} aria-label={t("breadcrumbLabel")}><Link href={`/${locale}`}>{t("home")}</Link><span>›</span><span>{t("eyebrow")}</span></nav>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>{t("eyebrow")}</span>
            <h1>{t("title")}</h1>
            <p>{t("intro")}</p>
          </div>
        </div>
        {heroImage && <div className={styles.heroVisual}><Image src={heroImage} alt="" fill priority sizes="(max-width: 760px) 100vw, 65vw" /></div>}
      </section>

      <section className={styles.collection} aria-label={t("eyebrow")}>
        <div className={styles.shell}>
          {projects.length > 0 ? <>
            <div className={styles.toolbar}>
              <div className={styles.filters} role="group" aria-label={t("filterLabel")}>
                <button type="button" aria-pressed={!category} className={!category ? styles.filterActive : ""} onClick={() => setCategory("")}>{t("all")}</button>
                {visibleCategories.map((item) => <button key={item.id} type="button" aria-pressed={category === item.id} className={category === item.id ? styles.filterActive : ""} onClick={() => setCategory(item.id)}>{categoryName(item, locale)}</button>)}
              </div>
              <label className={styles.search}><Search size={17} strokeWidth={1.8} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t("search")} aria-label={t("search")} /></label>
            </div>
            {visible.length > 0 ? <div className={`${styles.grid} ${visible.length === 1 ? styles.singleGrid : ""}`}>
              {visible.map((project, index) => <ProjectCard key={project.id} project={project} locale={locale} variant={index === 0 ? "featured" : "standard"} />)}
            </div> : <div className={styles.noResults}>{t("noResults")}</div>}
          </> : <div className={styles.empty}><span className={styles.eyebrow}>{t("eyebrow")}</span><h2>{t("empty")}</h2><p>{t("emptyDescription")}</p></div>}
        </div>
      </section>

      <section className={styles.cta}>
        {heroImage && <div className={styles.ctaVisual}><Image src={heroImage} alt="" fill sizes="(max-width: 760px) 100vw, 55vw" /></div>}
        <div className={`${styles.shell} ${styles.ctaInner}`}>
          <div className={styles.ctaCopy}>
            <span className={styles.eyebrow}>{t("ctaEyebrow")}</span>
            <h2>{t("ctaTitle")}</h2>
            <p>{t("ctaDescription")}</p>
            <Link className={styles.ctaButton} href={`/${locale}#contact`}>{t("quote")}<ArrowRight size={19} /></Link>
          </div>
          <div className={styles.benefits}>
            <div className={styles.benefit}><Box aria-hidden="true" /><strong>{t("benefitManufacturing")}</strong><span>{t("benefitManufacturingDescription")}</span></div>
            <div className={styles.benefit}><Cog aria-hidden="true" /><strong>{t("benefitCustom")}</strong><span>{t("benefitCustomDescription")}</span></div>
            <div className={styles.benefit}><Truck aria-hidden="true" /><strong>{t("benefitLatam")}</strong><span>{t("benefitLatamDescription")}</span></div>
          </div>
        </div>
      </section>

    </main>
  );
}
