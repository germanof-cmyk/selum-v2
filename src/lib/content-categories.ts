import { slugify, type LocalizedText } from "@/lib/catalog-editor";

export type CategoryScope = "projects" | "products";
export type ContentCategory = {
  id: string;
  slug: string;
  name: LocalizedText;
  active: boolean;
  order: number;
};
export type CategoryRegistry = Record<CategoryScope, ContentCategory[]>;

export const categoryStorageKey = (scope: CategoryScope) => `selum.${scope}-categories.v1`;

export function categoryName(category: ContentCategory, locale: string): string {
  const name = category.name;
  return name[locale as keyof LocalizedText]?.trim() || name.pt.trim() || name.en.trim() || name.es.trim();
}

export function importCategories(value: unknown): ContentCategory[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((raw, index) => {
    if (!raw || typeof raw !== "object") return [];
    const source = raw as Record<string, unknown>;
    const name = source.name && typeof source.name === "object" ? source.name as Record<string, unknown> : {};
    const pt = typeof name.pt === "string" ? name.pt : "";
    const slug = typeof source.slug === "string" ? source.slug : slugify(pt);
    return [{
      id: typeof source.id === "string" && source.id ? source.id : slug || `category-${index}`,
      slug,
      name: {
        pt,
        es: typeof name.es === "string" ? name.es : "",
        en: typeof name.en === "string" ? name.en : "",
      },
      active: source.active !== false,
      order: typeof source.order === "number" && Number.isFinite(source.order) ? source.order : index + 1,
    }];
  }).sort((a, b) => a.order - b.order);
}

export function newCategory(order: number): ContentCategory {
  const id = globalThis.crypto?.randomUUID?.() ?? `category-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return {
    id,
    slug: `categoria-${slugify(id)}`,
    name: { pt: "", es: "", en: "" },
    active: true,
    order,
  };
}

export function validateCategories(categories: ContentCategory[]) {
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const category of categories) {
    if (!category.name.pt.trim()) throw new Error("Preencha o nome em português das categorias antes de publicar.");
    if (!category.id || !category.slug || !/^[a-z0-9-]+$/.test(category.slug)) throw new Error("Uma categoria precisa de identificador válido.");
    if (ids.has(category.id) || slugs.has(category.slug)) throw new Error("Há categorias repetidas. Confira os nomes antes de publicar.");
    ids.add(category.id);
    slugs.add(category.slug);
  }
}

export function orderedCategories(categories: ContentCategory[]): ContentCategory[] {
  return categories.map((category, index) => ({ ...category, order: index + 1 }));
}
