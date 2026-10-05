import { access, readFile, writeFile, rename } from "node:fs/promises";
import path from "node:path";
import { importProjects, publicProjects, type EditorProject, type Project } from "@/lib/projects";

const projectsPath = path.join(process.cwd(), "data", "projects.json");

export async function readProjects(): Promise<EditorProject[]> {
  const raw = JSON.parse(await readFile(projectsPath, "utf8"));
  return importProjects(raw);
}

export async function getPublicProjects(): Promise<EditorProject[]> {
  const candidates = publicProjects(await readProjects());
  const checked = await Promise.all(candidates.map(async (project) => {
    if (!project.coverImage.startsWith("/images/") || project.coverImage.includes("..")) return null;
    try {
      await access(path.join(process.cwd(), "public", project.coverImage.slice(1)));
      return project;
    } catch { return null; }
  }));
  return checked.filter((project): project is EditorProject => project !== null);
}

export async function writeProjects(projects: Record<string, Project>) {
  const temporary = `${projectsPath}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(projects, null, 2)}\n`, "utf8");
  await rename(temporary, projectsPath);
}
