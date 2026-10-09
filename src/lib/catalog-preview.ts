import type { PublishedCatalog } from "@/lib/catalog-publication";
import type { ContentCategory } from "@/lib/content-categories";

type PreviewEntry = { catalog: PublishedCatalog; categories: ContentCategory[]; created: number };
type PreviewStore = Map<string, PreviewEntry>;
const globalStore = globalThis as typeof globalThis & { selumCatalogPreview?: PreviewStore };
const previews: PreviewStore = globalStore.selumCatalogPreview ??= new Map<string, PreviewEntry>();

export function saveCatalogPreview(catalog: PublishedCatalog, categories: ContentCategory[] = []) {
  const now = Date.now();
  for (const [key, value] of previews) if (now - value.created > 60 * 60 * 1000) previews.delete(key);
  const token = crypto.randomUUID();
  previews.set(token, { catalog, categories, created: now });
  return token;
}

export function getCatalogPreview(token: string): PreviewEntry | null {
  return previews.get(token) ?? null;
}
