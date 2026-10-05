import type { PublishedCatalog } from "@/lib/catalog-publication";

type PreviewStore = Map<string, { catalog: PublishedCatalog; created: number }>;
const globalStore = globalThis as typeof globalThis & { selumCatalogPreview?: PreviewStore };
const previews = globalStore.selumCatalogPreview ??= new Map();

export function saveCatalogPreview(catalog: PublishedCatalog) {
  const now = Date.now();
  for (const [key, value] of previews) if (now - value.created > 60 * 60 * 1000) previews.delete(key);
  const token = crypto.randomUUID();
  previews.set(token, { catalog, created: now });
  return token;
}

export function getCatalogPreview(token: string) {
  return previews.get(token)?.catalog ?? null;
}
