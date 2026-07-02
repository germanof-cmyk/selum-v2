import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

const locales = ["pt", "en", "es"];

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale;

  if (!locale || !locales.includes(locale)) {
    notFound();
  }

  const messages = {
    pt: (await import("./messages/pt.json")).default,
    en: (await import("./messages/en.json")).default,
    es: (await import("./messages/es.json")).default,
  }[locale as "pt" | "en" | "es"];

  return { locale, messages };
});
