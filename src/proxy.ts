import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["pt", "en", "es"],
  defaultLocale: "pt",
});

export const config = {
  matcher: ["/((?!api|catalog-editor(?:/|$)|_next|_vercel|.*\\..*).*)"],
};
