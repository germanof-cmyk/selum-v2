import type { EditorStatus, LocalizedText } from "@/lib/catalog-editor";

export type Project = {
  id: string;
  slug: string;
  status: EditorStatus;
  active: boolean;
  name: LocalizedText;
  category: LocalizedText;
  location: { city: string; state: string; country: string };
  coverImage: string;
  coverImageValidated: boolean;
  showOnHome: boolean;
  homeOrder: number | null;
  projectsOrder: number | null;
  // Legacy editor data is retained when a project is republished.
  description?: LocalizedText;
  gallery?: string[];
  productsUsed?: string[];
  featuredOnProjects?: boolean;
};

export type EditorProject = Project;
export const PROJECTS_STORAGE_KEY = "selum.projects-editor.v1";
export const UNVERIFIED_PROJECT_IMAGES = new Set([
  "/images/projects/luan-santana-1.png",
  "/images/projects/luan-santana-2.png",
  "/images/projects/gustavo-lima-1.png",
]);
const text = (value: unknown) => typeof value === "string" ? value : "";
const record = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const localized = (value: unknown): LocalizedText => {
  const item = record(value);
  return { pt: text(item.pt), es: text(item.es), en: text(item.en) };
};
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
const order = (value: unknown) => typeof value === "number" && Number.isFinite(value) ? value : null;
const newId = () => globalThis.crypto?.randomUUID?.() ?? `project-${Date.now()}-${Math.random()}`;

export function emptyProject(): EditorProject {
  return {
    id: newId(), slug: "", status: "draft", active: true,
    name: localized(null), category: localized(null),
    location: { city: "", state: "", country: "" },
    coverImage: "", coverImageValidated: false,
    showOnHome: false, homeOrder: null, projectsOrder: null,
  };
}

export function importProjects(value: unknown, { draft = false }: { draft?: boolean } = {}): EditorProject[] {
  void draft;
  const entries = Array.isArray(value)
    ? value.map((item, index) => [String(index), item] as const)
    : Object.entries(record(value));
  return entries.map(([key, raw]) => {
    const source = record(raw);
    const location = record(source.location);
    const status = source.status;
    return {
      id: text(source.id) || key,
      slug: text(source.slug) || key,
      status: status === "review" || status === "approved" ? status : "draft",
      active: source.active !== false,
      name: localized(source.name), category: localized(source.category),
      location: { city: text(location.city), state: text(location.state), country: text(location.country) },
      coverImage: text(source.coverImage),
      coverImageValidated: source.coverImageValidated === true,
      showOnHome: source.showOnHome === true,
      homeOrder: order(source.homeOrder),
      projectsOrder: order(source.projectsOrder),
      ...(source.description !== undefined ? { description: localized(source.description) } : {}),
      ...(source.gallery !== undefined ? { gallery: strings(source.gallery) } : {}),
      ...(source.productsUsed !== undefined ? { productsUsed: strings(source.productsUsed) } : {}),
      ...(source.featuredOnProjects !== undefined ? { featuredOnProjects: source.featuredOnProjects === true } : {}),
    };
  });
}

export function exportProjects(projects: EditorProject[]): Record<string, Project> {
  const slugs = projects.map((project) => project.slug.trim());
  if (slugs.some((slug) => !slug) || new Set(slugs).size !== slugs.length) {
    throw new Error("Preencha slugs únicos antes de publicar projetos.");
  }
  return Object.fromEntries(projects.map((project) => [project.slug.trim(), {
    ...project,
    slug: project.slug.trim(),
    coverImage: project.coverImage.trim(),
    coverImageValidated: Boolean(project.coverImage.trim() && project.coverImageValidated),
  }]));
}

export function publicProjects(projects: EditorProject[]): EditorProject[] {
  return projects.filter((project) =>
    project.status === "approved" && project.active &&
    project.coverImage.trim() && project.coverImageValidated &&
    !UNVERIFIED_PROJECT_IMAGES.has(project.coverImage)
  );
}

export function projectText(value: LocalizedText, locale: string): string {
  return value[locale as keyof LocalizedText]?.trim() || value.pt.trim() || value.en.trim() || value.es.trim();
}

export function projectLocation(project: Project, locale: string): string {
  const { city, state, country } = project.location;
  const display = new Intl.DisplayNames([locale], { type: "region" });
  let countryLabel = country.trim();
  if (/^[A-Za-z]{2}$/.test(countryLabel)) {
    countryLabel = display.of(countryLabel.toUpperCase()) || countryLabel;
  }
  return [city, state, countryLabel].map((part) => part.trim()).filter(Boolean).join(" · ");
}
