import { readdir } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CatalogEditor from "./CatalogEditor";
import { importCatalog, type EditorAsset } from "@/lib/catalog-editor";
import { readPublishedCatalog } from "@/lib/published-catalog";
import { readProjects } from "@/lib/published-projects";

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

export default async function CatalogEditorPage() {
  if (process.env.NODE_ENV !== "development") notFound();
  const publicRoot = path.join(process.cwd(), "public");
  const assets = (await listAssets(publicRoot, publicRoot))
    .filter((asset) => asset.folder.startsWith("images/") || asset.type === "pdf")
    .sort((a, b) => a.path.localeCompare(b.path, "pt"));
  const published = await readPublishedCatalog();
  const initialProducts = published ? importCatalog(published) : [];
  const initialProjects = await readProjects();
  return <CatalogEditor initialProducts={initialProducts} initialProjects={initialProjects} assets={assets} />;
}
