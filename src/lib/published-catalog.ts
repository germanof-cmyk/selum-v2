import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import path from "node:path";
import type { CatalogProduct } from "@/lib/catalog";
import { publishedProducts, type PublishedCatalog } from "@/lib/catalog-publication";

const catalogPath = path.join(process.cwd(), "data", "catalog.json");

export async function readPublishedCatalog(): Promise<PublishedCatalog | null> {
  try {
    const data = JSON.parse(await readFile(catalogPath, "utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Catálogo publicado inválido.");
    return data as PublishedCatalog;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function getPublicProducts(): Promise<CatalogProduct[]> {
  const published = await readPublishedCatalog();
  return published === null ? [] : publishedProducts(published);
}

export async function writePublishedCatalog(catalog: PublishedCatalog) {
  await mkdir(path.dirname(catalogPath), { recursive: true });
  const temporary = `${catalogPath}.${crypto.randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
  await rename(temporary, catalogPath);
}
