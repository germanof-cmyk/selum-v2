import { isRemoteAsset } from "@/lib/content-backend";
import { contactImageKeys, normalizeContactPageImages, type ContactPageImages } from "@/lib/contact-page-images";

export function validateContactPageImages(value: unknown): ContactPageImages {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Envie as referências das imagens.");
  const images = normalizeContactPageImages(value);
  for (const key of contactImageKeys) {
    const path = images[key];
    if (!path) continue;
    const localImage = path.startsWith("/images/") && !path.includes("..") && /\.(png|jpe?g|webp|avif)$/i.test(path);
    if (!localImage && !isRemoteAsset(path)) throw new Error("Selecione uma imagem válida.");
  }
  return images;
}
