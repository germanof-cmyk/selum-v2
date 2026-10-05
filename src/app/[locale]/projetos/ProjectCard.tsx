"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { projectLocation, projectText, type EditorProject } from "@/lib/projects";
import styles from "./projects.module.css";

export default function ProjectCard({ project, locale, variant }: {
  project: EditorProject;
  locale: string;
  variant: "featured" | "standard";
}) {
  const name = projectText(project.name, locale);
  const location = projectLocation(project, locale);

  return <article className={`${styles.card} ${variant === "featured" ? styles.featured : ""}`}>
    <div className={styles.cardVisual}>
      <Image className={styles.cardImage} src={project.coverImage} alt={name} fill sizes={variant === "featured" ? "(max-width: 760px) 100vw, 67vw" : "(max-width: 760px) 100vw, (max-width: 1050px) 50vw, 33vw"} />
      <span className={styles.cardContent}>
        {projectText(project.category, locale) && <span className={styles.cardMeta}>{projectText(project.category, locale)}</span>}
        <strong className={styles.cardTitle}>{name}</strong>
        {location && <span className={styles.location}><MapPin size={14} aria-hidden="true" />{location}</span>}
      </span>
    </div>
  </article>;
}
