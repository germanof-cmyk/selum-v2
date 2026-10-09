export const aboutImageKeys = [
  "heroFactory",
  "manufacturing",
  "detailsBackdrop",
  "detailsStructure",
  "team",
  "presence",
  "cta",
] as const;

export type AboutImageKey = (typeof aboutImageKeys)[number];
export type AboutPageImages = Record<AboutImageKey, string>;

export const defaultAboutPageImages: AboutPageImages = {
  heroFactory: "/images/teste.png",
  manufacturing: "/images/products/base-tubular/Base tubular padrao p30.jpeg",
  detailsBackdrop: "/images/teste.png",
  detailsStructure: "/images/products/box-truss.png",
  team: "/images/selum-equipe-fabrica-v2.png",
  presence: "/images/about-bg.png",
  cta: "/images/products/box-truss.png",
};

export function normalizeAboutPageImages(value: unknown): AboutPageImages {
  const input = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return Object.fromEntries(aboutImageKeys.map((key) => [
    key,
    typeof input[key] === "string" ? input[key] : defaultAboutPageImages[key],
  ])) as AboutPageImages;
}
