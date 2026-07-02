"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Globe, Package, LayoutGrid, Building2, Mail, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const locales = [
  { code: "pt", label: "PT", flag: "🇧🇷" },
  { code: "en", label: "EN", flag: "🇺🇸" },
  { code: "es", label: "ES", flag: "🇪🇸" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function switchLocale(code: string) {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setLangOpen(false);
  }

  const links = [
    { href: "#products", label: t("products"), icon: <Package size={14} /> },
    { href: "#projects", label: t("projects"), icon: <LayoutGrid size={14} /> },
    { href: "#about",    label: t("about"),    icon: <Building2 size={14} /> },
    { href: "#contact",  label: t("contact"),  icon: <Mail size={14} /> },
  ];

  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "all 0.4s ease",
      background: "rgba(5,15,35,0.97)",
      borderBottom: "1px solid rgba(33,150,243,0.25)",
      backdropFilter: "blur(20px)",
      overflow: "visible",
    }}>
      {/* Linha acento topo */}
      <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#1565C0 25%,#00B4D8 50%,#1565C0 75%,transparent)" }} />

      <div style={{
        maxWidth: 1280, margin: "0 auto",
        padding: isMobile ? "0 16px" : (scrolled ? "0 32px" : "0 32px 0 180px"),
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: isMobile ? 64 : (scrolled ? 60 : 80),
        transition: "all 0.4s ease",
        position: "relative",
        overflow: "visible",
      }}>

        {/* ── LOGO ── */}
        {!isMobile && (
          <AnimatePresence mode="wait">
            {!scrolled ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ duration: 0.35 }}
                style={{ position: "absolute", left: 32, top: -8, zIndex: 60, cursor: "pointer" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <Image
                  src="/images/selum-logo-full.png"
                  alt="Selum"
                  width={130}
                  height={130}
                  priority
                  style={{ objectFit: "contain", height: 86, width: "auto" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="logo-lateral"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
                style={{ cursor: "pointer" }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <Image
                  src="/images/selum-logo-lateral.png"
                  alt="Selum"
                  width={160}
                  height={48}
                  style={{ objectFit: "contain", height: 40, width: "auto" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Mobile logo */}
        {isMobile && (
          <div onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ cursor: "pointer" }}>
            <Image
              src="/images/selum-logo-lateral.png"
              alt="Selum"
              width={120}
              height={36}
              priority
              style={{ objectFit: "contain", height: 36, width: "auto" }}
            />
          </div>
        )}

        {/* ── LINKS DESKTOP ── */}
        {!isMobile && (
          <nav style={{ display: "flex", alignItems: "center", gap: 2 }}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 16px", borderRadius: 3,
                  textDecoration: "none", position: "relative",
                  transition: "background 0.2s",
                  fontFamily: "var(--font-space), sans-serif",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(33,150,243,0.07)";
                  (e.currentTarget.querySelector(".ni") as HTMLElement).style.color = "#00B4D8";
                  (e.currentTarget.querySelector(".nl") as HTMLElement).style.color = "#fff";
                  (e.currentTarget.querySelector(".nln") as HTMLElement).style.transform = "scaleX(1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  (e.currentTarget.querySelector(".ni") as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                  (e.currentTarget.querySelector(".nl") as HTMLElement).style.color = "rgba(255,255,255,0.9)";
                  (e.currentTarget.querySelector(".nln") as HTMLElement).style.transform = "scaleX(0)";
                }}
              >
                <span className="ni" style={{ color: "rgba(255,255,255,0.7)", transition: "color 0.2s", display: "flex" }}>
                  {l.icon}
                </span>
                <span className="nl" style={{ fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.9)", transition: "color 0.2s", fontFamily: "var(--font-orbitron), sans-serif" }}>
                  {l.label}
                </span>
                <span className="nln" style={{ position: "absolute", bottom: 0, left: 16, right: 16, height: 1.5, background: "#00B4D8", transform: "scaleX(0)", transformOrigin: "left", transition: "transform 0.25s" }} />
              </a>
            ))}
          </nav>
        )}

        {/* ── RIGHT ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>

          {/* Lang — desktop only */}
          {!isMobile && (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", padding: "6px 8px", fontFamily: "var(--font-space), sans-serif" }}
              >
                <Globe size={12} />
                {locale.toUpperCase()}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    style={{ position: "absolute", right: 0, top: "100%", marginTop: 8, background: "#071C30", border: "1px solid rgba(21,101,192,0.3)", borderRadius: 4, overflow: "hidden", minWidth: 110 }}
                  >
                    {locales.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => switchLocale(l.code)}
                        style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", fontSize: 11, letterSpacing: "1.5px", textTransform: "uppercase", background: "none", border: "none", cursor: "pointer", color: l.code === locale ? "#2196F3" : "#B0BEC5", fontFamily: "var(--font-space), sans-serif" }}
                      >
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* CTA — desktop only */}
          {!isMobile && (
            <a
              href="#contact"
              style={{ display: "flex", alignItems: "center", gap: 7, padding: "10px 22px", background: "#1565C0", color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", transition: "background 0.2s", whiteSpace: "nowrap", fontFamily: "var(--font-orbitron), sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#2196F3")}
              onMouseLeave={e => (e.currentTarget.style.background = "#1565C0")}
            >
              <Send size={12} />
              {t("quote")}
            </a>
          )}

          {/* Mobile toggle */}
          {isMobile && (
            <button
              onClick={() => setOpen(!open)}
              style={{ background: "none", border: "1px solid rgba(33,150,243,0.3)", cursor: "pointer", color: "#B0BEC5", padding: 8, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: "hidden", background: "#04111F", borderTop: "1px solid rgba(21,101,192,0.15)" }}
          >
            <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.8)", textDecoration: "none", fontFamily: "var(--font-orbitron), sans-serif" }}
                >
                  <span style={{ color: "#2196F3", display: "flex" }}>{l.icon}</span>
                  {l.label}
                </a>
              ))}
              <div style={{ display: "flex", gap: 8, padding: "16px 0 8px", borderTop: "1px solid rgba(21,101,192,0.1)", marginTop: 4 }}>
                {locales.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => switchLocale(l.code)}
                    style={{ fontSize: 10, letterSpacing: "1.5px", textTransform: "uppercase", padding: "8px 14px", background: "none", cursor: "pointer", border: l.code === locale ? "1px solid #2196F3" : "1px solid rgba(21,101,192,0.25)", color: l.code === locale ? "#2196F3" : "#B0BEC5", fontFamily: "var(--font-space), sans-serif" }}
                  >
                    {l.flag} {l.label}
                  </button>
                ))}
              </div>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 12, padding: "14px 24px", background: "#1565C0", color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", textDecoration: "none", fontFamily: "var(--font-orbitron), sans-serif" }}
              >
                <Send size={13} />
                {t("quote")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
