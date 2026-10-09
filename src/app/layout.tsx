import type { Metadata } from "next";
import { headers } from "next/headers";
import { Orbitron, Space_Grotesk } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Selum — Excelência em Alumínio",
  description: "Estruturas de alumínio para palcos, shows e grandes eventos.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const requestHeaders = await headers();
  const requestedLocale = requestHeaders.get("x-next-intl-locale");
  const locale = requestedLocale && ["pt", "en", "es"].includes(requestedLocale) ? requestedLocale : "pt";

  return (
    <html lang={locale} className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
      <body className="text-white antialiased" style={{ background: "#071E38", fontFamily: "var(--font-space), sans-serif", overflowX: "hidden", maxWidth: "100vw" }}>
        {children}
      </body>
    </html>
  );
}
