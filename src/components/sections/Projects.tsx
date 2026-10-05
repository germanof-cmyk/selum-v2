"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import { projectLocation, projectText, type EditorProject } from "@/lib/projects";
import styles from "./Projects.module.css";

const copy = {
  pt: { eyebrow: "Portfólio", title: "Projetos com produtos Selum", viewAll: "Ver todos os projetos" },
  en: { eyebrow: "Portfolio", title: "Projects using Selum products", viewAll: "View all projects" },
  es: { eyebrow: "Portafolio", title: "Proyectos con productos Selum", viewAll: "Ver todos los proyectos" },
};

export default function Projects({ projects }: { projects: EditorProject[] }) {
  const locale = useLocale();
  const t = copy[locale as keyof typeof copy] || copy.pt;
  const selected = projects.filter((project) => project.showOnHome)
    .sort((a, b) => (a.homeOrder ?? Number.MAX_SAFE_INTEGER) - (b.homeOrder ?? Number.MAX_SAFE_INTEGER) || a.slug.localeCompare(b.slug));
  if (selected.length === 0) return null;

  return <section id="projects" className={styles.section}>
    <div className={styles.shell}>
      <div className={styles.heading}>
        <div><span className={styles.eyebrow}>{t.eyebrow}</span><h2>{t.title}</h2></div>
        <Link href={`/${locale}/projetos`} className={styles.all}>{t.viewAll}<ArrowRight size={15} /></Link>
      </div>
      <div className={styles.grid}>
        {selected.map((project) => <article key={project.id} className={styles.card}>
          <div className={styles.cardVisual}>
            <span className={styles.image}><Image src={project.coverImage} alt={projectText(project.name, locale)} fill sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 33vw" /></span>
            <span className={styles.category}>{projectText(project.category, locale)}</span>
            <strong>{projectText(project.name, locale)}</strong>
            {projectLocation(project, locale) && <span className={styles.location}>{projectLocation(project, locale)}</span>}
          </div>
        </article>)}
      </div>
    </div>
  </section>;
}
