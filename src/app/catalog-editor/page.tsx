import { readdir } from "node:fs/promises";
import path from "node:path";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import CatalogEditor from "./CatalogEditor";
import { type EditorAsset } from "@/lib/catalog-editor";
import { requireEditor } from "@/lib/content-backend";
import { loadEditorCategories, loadEditorProducts, loadEditorProjects } from "@/lib/supabase-content";
import { readAboutPageImages } from "@/lib/published-about-images";
import { readContactPageImages } from "@/lib/published-contact-images";

export const metadata: Metadata = {
  title: "Catalog Editor — Selum",
  robots: { index: false, follow: false },
};

async function listAssets(directory: string, publicRoot: string): Promise<EditorAsset[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return listAssets(absolute, publicRoot);
    if (!entry.isFile()) return [];
    const type = /\.(png|jpe?g|webp|avif|svg)$/i.test(entry.name)
      ? "image"
      : /\.pdf$/i.test(entry.name) ? "pdf" : null;
    if (!type) return [];
    const relative = path.relative(publicRoot, absolute).split(path.sep).join("/");
    return [{
      path: `/${relative}`,
      name: entry.name,
      folder: path.dirname(relative).split(path.sep).join("/"),
      type,
    } satisfies EditorAsset];
  }));
  return nested.flat();
}

export async function EditorContent() {
  let db;
  try { db = await requireEditor(); }
  catch { redirect("/interno/login"); }
  const publicRoot = path.join(process.cwd(), "public");
  const assets = (await listAssets(publicRoot, publicRoot))
    .filter((asset) => asset.folder.startsWith("images/") || asset.type === "pdf")
    .sort((a, b) => a.path.localeCompare(b.path, "pt"));
  const [initialProducts, initialProjects, initialCategories, initialAboutImages, initialContactImages] = await Promise.all([
    loadEditorProducts(db), loadEditorProjects(db), loadEditorCategories(db), readAboutPageImages(), readContactPageImages(),
  ]);
  for (const folder of ["products", "projects"]) {
    const { data } = await db.storage.from("site-content").list(folder, { limit: 1000 });
    for (const item of data ?? []) {
      if (!/\.(png|jpe?g|webp|avif)$/i.test(item.name)) continue;
      const { data: url } = db.storage.from("site-content").getPublicUrl(`${folder}/${item.name}`);
      assets.push({ path: url.publicUrl, name: item.name, folder, type: "image" });
    }
  }
  return <CatalogEditor initialProducts={initialProducts} initialProjects={initialProjects} initialCategories={initialCategories} initialAboutImages={initialAboutImages} initialContactImages={initialContactImages} assets={assets} />;
}

export default function CatalogEditorPage() { redirect("/interno"); }
