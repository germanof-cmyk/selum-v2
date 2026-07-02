import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Selum — Excelência em Alumínio",
  description: "Estruturas de alumínio para palcos, shows e grandes eventos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
