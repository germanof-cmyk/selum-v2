import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getPublicProjects } from "@/lib/published-projects";
import { readCategories } from "@/lib/published-categories";
import ProjectsPageClient from "./ProjectsPageClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const title = { pt: "Projetos", en: "Projects", es: "Proyectos" }[locale] || "Projetos";
  return { title: `${title} | Selum` };
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [projects, registry] = await Promise.all([getPublicProjects(), readCategories()]);
  return (
    <>
      <Navbar />
      <ProjectsPageClient locale={locale} projects={projects} categories={registry.projects} />
      <Footer />
    </>
  );
}
