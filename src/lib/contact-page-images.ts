export const contactImageKeys = ["hero", "location", "cta"] as const;

export type ContactImageKey = (typeof contactImageKeys)[number];
export type ContactPageImages = Record<ContactImageKey, string>;

export const defaultContactPageImages: ContactPageImages = {
  hero: "/images/products/base-tubular/Base tubular padrao p30.jpeg",
  location: "/images/teste.png",
  cta: "/images/products/box-truss.png",
};

export function normalizeContactPageImages(value: unknown): ContactPageImages {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(contactImageKeys.map((key) => [
    key,
    typeof input[key] === "string" ? input[key] : defaultContactPageImages[key],
  ])) as ContactPageImages;
}
