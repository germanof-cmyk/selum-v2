import { access } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { exportProjects, importProjects, UNVERIFIED_PROJECT_IMAGES } from "@/lib/projects";
import { getPublicProjects, readProjects, writeProjects } from "@/lib/published-projects";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });
  return NextResponse.json({ projects: exportProjects(await readProjects()) });
}

async function validLocalImage(image: string) {
  if (!image.startsWith("/images/") || image.includes("..") || !/\.(png|jpe?g|webp|avif)$/i.test(image)) return false;
  try {
    await access(path.join(process.cwd(), "public", image.slice(1)));
    return true;
  } catch { return false; }
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") return new NextResponse(null, { status: 404 });
  try {
    const payload = await request.json();
    if (!payload || !Array.isArray(payload.projects)) throw new Error("Requisição inválida.");
    const projects = importProjects(payload.projects, { draft: true });
    for (const project of projects) {
      if (project.status === "approved") {
        if (!Object.values(project.name).some((value) => value.trim()) || !Object.values(project.category).some((value) => value.trim())) {
          throw new Error(`${project.slug}: informe ao menos um nome e uma categoria antes de aprovar.`);
        }
      }
      if (project.coverImageValidated && !project.coverImage) {
        throw new Error(`${project.slug}: selecione uma capa antes de validá-la.`);
      }
      if (project.coverImageValidated && UNVERIFIED_PROJECT_IMAGES.has(project.coverImage)) {
        throw new Error(`${project.slug}: os três arquivos antigos de projetos são idênticos e não podem ser validados como capa.`);
      }
      if (project.coverImageValidated && !(await validLocalImage(project.coverImage))) {
        throw new Error(`${project.slug}: a capa validada precisa existir em public/images.`);
      }
    }
    const exported = exportProjects(projects);
    await writeProjects(exported);
    const visible = await getPublicProjects();
    return NextResponse.json({ projects: exported, visibleCount: visible.length, homeCount: visible.filter((project) => project.showOnHome).length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Falha ao publicar projetos." }, { status: 400 });
  }
}
