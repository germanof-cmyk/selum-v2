import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Orbitron, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "../globals.css";

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

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
      <body className="text-white antialiased" style={{ background: "#071E38", fontFamily: "var(--font-space), sans-serif", overflowX: "hidden", maxWidth: "100vw" }}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
