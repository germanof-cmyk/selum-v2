import { defaultAboutPageImages, normalizeAboutPageImages, type AboutPageImages } from "@/lib/about-page-images";
import { hasSupabase, publicContentClient } from "@/lib/content-backend";

export async function readAboutPageImages(): Promise<AboutPageImages> {
  if (!hasSupabase()) return defaultAboutPageImages;
  const { data, error } = await publicContentClient()
    .from("about_page_images")
    .select("images")
    .eq("id", "default")
    .maybeSingle();
  if (error) {
    // Keep the original page imagery in place if the settings table is not installed yet.
    if (error.code === "42P01" || error.code === "PGRST205") return defaultAboutPageImages;
    throw error;
  }
  return data ? normalizeAboutPageImages(data.images) : defaultAboutPageImages;
}
