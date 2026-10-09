import { access } from "node:fs/promises";
import path from "node:path";
import { importProjects, publicProjects, type EditorProject } from "@/lib/projects";
import { readCategories } from "@/lib/published-categories";
import { hasSupabase, isRemoteAsset } from "@/lib/content-backend";
import { loadRows } from "@/lib/supabase-content";

export async function readProjects(): Promise<EditorProject[]> {
  if (!hasSupabase()) throw new Error("Supabase precisa estar configurado para exibir projetos públicos.");
  const rows = await loadRows("projects");
  return importProjects(rows.map((row) => row.data));
}

export async function getPublicProjects(): Promise<EditorProject[]> {
  const [projects, registry] = await Promise.all([readProjects(), readCategories()]);
  const candidates = publicProjects(projects);
  const checked = await Promise.all(candidates.map(async (project) => {
    if (isRemoteAsset(project.coverImage)) return project;
    if (!project.coverImage.startsWith("/images/") || project.coverImage.includes("..")) return null;
    try {
      await access(path.join(process.cwd(), "public", project.coverImage.slice(1)));
      return project;
    } catch { return null; }
  }));
  return checked.filter((project): project is EditorProject => project !== null).map((project) => {
    const category = registry.projects.find((item) => item.id === project.categoryId ||
      (!project.categoryId && item.name.pt.trim() === project.category.pt.trim()));
    return category ? { ...project, categoryId: category.id, category: category.name } : project;
  });
}
