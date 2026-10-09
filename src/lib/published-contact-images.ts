import { defaultContactPageImages, normalizeContactPageImages, type ContactPageImages } from "@/lib/contact-page-images";
import { hasSupabase, publicContentClient } from "@/lib/content-backend";

export async function readContactPageImages(): Promise<ContactPageImages> {
  if (!hasSupabase()) return defaultContactPageImages;
  const { data, error } = await publicContentClient()
    .from("contact_page_images")
    .select("images")
    .eq("id", "default")
    .maybeSingle();
  if (error) {
    // Keep the current page images in place while the settings table migration is being applied.
    if (error.code === "42P01" || error.code === "PGRST205") return defaultContactPageImages;
    throw error;
  }
  return data ? normalizeContactPageImages(data.images) : defaultContactPageImages;
}
