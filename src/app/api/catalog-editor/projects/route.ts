import { access } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { exportProjects, importProjects, publicProjects, UNVERIFIED_PROJECT_IMAGES } from "@/lib/projects";
import { requireEditor, isRemoteAsset } from "@/lib/content-backend";
import { loadEditorProjects, loadRows, saveProjectDrafts, uuidOrStable } from "@/lib/supabase-content";
import { loadEditorCategories } from "@/lib/supabase-content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await requireEditor();
    const [editor, published] = await Promise.all([loadEditorProjects(db), loadRows("projects", false, db)]);
    return NextResponse.json({ projects: editor, published: Object.fromEntries(published.map((row) => [row.slug, row.data])) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
  }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
}

async function validImage(image: string) {
  if (isRemoteAsset(image)) return true;
  if (!image.startsWith("/images/") || image.includes("..") || !/\.(png|jpe?g|webp|avif)$/i.test(image)) return false;
  try { await access(path.join(process.cwd(), "public", image.slice(1))); return true; }
  catch { return false; }
}

export async function POST(request: Request) {
  let db;
  try { db = await requireEditor(); }
  catch { return NextResponse.json({ error: "Entre no painel para continuar." }, { status: 401 }); }
  try {
    const payload = await request.json();
    if (payload.action === "delete") {
      if (typeof payload.targetId !== "string" || !payload.targetId) throw new Error("Selecione o projeto para excluir.");
      const { data: deleted, error } = await db.from("projects").delete().eq("id", payload.targetId).select("id");
      if (error) throw error;
      if (deleted?.length !== 1 || deleted[0].id !== payload.targetId) {
        return NextResponse.json({ error: "O Supabase nÃ£o confirmou a exclusÃ£o do projeto." }, { status: 409 });
      }
      const [rows, projects] = await Promise.all([loadRows("projects", false, db), loadEditorProjects(db)]);
      return NextResponse.json({ deleted: true, projects, published: Object.fromEntries(rows.map((row) => [row.slug, row.data])) }, { headers: { "Cache-Control": "no-store, max-age=0" } });
    }
    if (!Array.isArray(payload.projects) || !["save", "publish"].includes(payload.action)) throw new Error("Requisição inválida.");
    const projects = importProjects(payload.projects, { draft: true });
    if (payload.action === "save") {
      await saveProjectDrafts(db, projects);
      return NextResponse.json({ saved: true });
    }
    const project = projects.find((item) => item.id === payload.targetId);
    if (!project) throw new Error("Selecione o projeto para publicar.");
    const categories = (await loadEditorCategories(db)).projects;
    if (!categories.some((item) => item.id === project.categoryId)) throw new Error("Escolha uma categoria cadastrada.");
    if (!project.name.pt.trim()) throw new Error("Informe o nome do projeto.");
    if (!project.coverImageValidated || UNVERIFIED_PROJECT_IMAGES.has(project.coverImage) || !(await validImage(project.coverImage))) throw new Error("Escolha e confirme uma imagem válida para o projeto.");
    const published = { ...project, id: uuidOrStable(project.id, "project", project.slug), status: "approved" as const };
    const data = exportProjects([published])[published.slug];
    const { error } = await db.from("projects").upsert({
      id: published.id, slug: published.slug, status: "published", active: published.active,
      sort_order: projects.findIndex((item) => item.id === project.id) + 1,
      show_on_home: published.showOnHome, home_order: published.homeOrder,
      category: published.categoryId || "", name: published.name, location: published.location,
      cover_image: published.coverImage, data, draft_data: published,
    }, { onConflict: "id" });
    if (error) throw error;
    const rows = await loadRows("projects", false, db);
    const publishedProjects = Object.fromEntries(rows.map((row) => [row.slug, row.data]));
    const visible = publicProjects(importProjects(publishedProjects));
    return NextResponse.json({ project: published, published: publishedProjects, visibleCount: visible.length, homeCount: visible.filter((item) => item.showOnHome).length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Não foi possível salvar projetos." }, { status: 400 });
  }
}
