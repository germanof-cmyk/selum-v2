import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "../globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Admin — Selum",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={spaceGrotesk.variable}>
      <body
        style={{
          background: "#080808",
          color: "#F2F0EC",
          fontFamily: "var(--font-space), sans-serif",
          margin: 0,
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            padding: "16px 40px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#0a0a0a",
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#C9A84C",
            }}
          >
            Selum
          </span>
          <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "2px",
              textTransform: "uppercase",
              color: "#444",
            }}
          >
            Painel Admin
          </span>
        </div>
        {children}
      </body>
    </html>
  );
}
