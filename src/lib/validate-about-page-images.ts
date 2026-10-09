import { isRemoteAsset } from "@/lib/content-backend";
import { aboutImageKeys, normalizeAboutPageImages, type AboutImageKey, type AboutPageImages } from "@/lib/about-page-images";

const optionalAboutImageKeys = new Set<AboutImageKey>(["detailsBackdrop", "presence", "cta"]);

export function validateAboutPageImages(value: unknown): AboutPageImages {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Envie as referências das imagens.");
  const images = normalizeAboutPageImages(value);
  for (const key of aboutImageKeys) {
    const path = images[key];
    if (!path && optionalAboutImageKeys.has(key)) continue;
    const localImage = path.startsWith("/images/") && !path.includes("..") && /\.(png|jpe?g|webp|avif)$/i.test(path);
    if (!localImage && !isRemoteAsset(path)) throw new Error("Selecione uma imagem válida para cada seção obrigatória.");
  }
  return images;
}
