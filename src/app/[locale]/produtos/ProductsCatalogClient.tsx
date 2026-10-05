"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { MessageCircle, Mail } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { CatalogProduct } from "@/lib/catalog";

const filters = [
  { key: "todos", label: "Todos" },
  { key: "estrutural", label: "Estrutural" },
  { key: "acessorios", label: "Acessórios" },
  { key: "acesso", label: "Acesso" },
];

export default function ProductsCatalogClient({ products }: { products: CatalogProduct[] }) {
  const heroProducts = products.filter(p => p.catalog?.heroFeatured && p.catalog.heroImage).sort((a, b) => (a.catalog?.heroOrder ?? Number.MAX_SAFE_INTEGER) - (b.catalog?.heroOrder ?? Number.MAX_SAFE_INTEGER));
  const listingProducts = products.filter(p => p.catalog?.visible).sort((a, b) => (a.catalog?.order ?? Number.MAX_SAFE_INTEGER) - (b.catalog?.order ?? Number.MAX_SAFE_INTEGER));
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState("todos");
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    if (heroProducts.length < 2) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroProducts.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [heroProducts.length]);
  const filtered = activeFilter === "todos"
    ? listingProducts
    : listingProducts.filter(p => p.category === activeFilter);

  return (
    <>
      <style>{`
        .prods-page { background: #03080F; min-height: 100vh; padding-top: 72px; }

        /* ── HERO ── */
        .prods-hero {
          position: relative; height: 340px; overflow: hidden;
          display: flex; align-items: center;
          background: linear-gradient(135deg, #03080F 0%, #071E38 40%, #0A2540 70%, #03080F 100%);
        }
        .prods-hero::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,transparent,#1565C0 25%,#00B4D8 50%,#1565C0 75%,transparent); z-index:2; }
        .prods-hero-grid { position:absolute; inset:0; background-image:linear-gradient(rgba(33,150,243,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(33,150,243,0.03) 1px,transparent 1px); background-size:48px 48px; }
        .prods-hero-glow { position:absolute; left:30%; top:50%; transform:translate(-50%,-50%); width:600px; height:400px; background:radial-gradient(ellipse,rgba(21,101,192,0.15) 0%,transparent 70%); pointer-events:none; }

        /* Floating products */
        .floating-prod {
          position: absolute;
          pointer-events: none;
          z-index: 1;
        }
        .floating-prod img {
          object-fit: contain;
          filter: brightness(0.6) saturate(0.7) drop-shadow(0 8px 24px rgba(0,0,0,0.5));
          opacity: 0.35;
        }

        /* Hero content */
        .prods-hero-content { position:relative; z-index:3; padding:0 64px; max-width:600px; }
        .prods-eyebrow { font-size:9px; color:#00B4D8; letter-spacing:4px; text-transform:uppercase; margin-bottom:12px; display:flex; align-items:center; gap:8px; font-family:var(--font-space),sans-serif; }
        .prods-eyebrow::before { content:''; width:20px; height:1px; background:#00B4D8; }
        .prods-title { font-size:clamp(40px,6vw,64px); font-weight:900; color:#fff; line-height:0.95; letter-spacing:-2px; margin-bottom:14px; font-family:var(--font-orbitron),sans-serif; }
        .prods-title span { color:#2196F3; }
        .prods-sub { font-size:13px; color:rgba(176,190,197,0.55); line-height:1.6; max-width:440px; font-family:var(--font-space),sans-serif; }

        /* Número decorativo */
        .prods-deco { position:absolute; right:64px; top:50%; transform:translateY(-50%); font-size:200px; font-weight:900; color:rgba(33,150,243,0.03); letter-spacing:-10px; line-height:1; pointer-events:none; font-family:var(--font-orbitron),sans-serif; z-index:0; }

        /* ── FILTER BAR ── */
        .filter-bar { padding:18px 64px; background:rgba(3,8,15,0.7); border-bottom:1px solid rgba(33,150,243,0.1); display:flex; align-items:center; gap:8px; position:sticky; top:72px; z-index:10; backdrop-filter:blur(12px); }
        .filter-btn { padding:7px 20px; border:1px solid rgba(33,150,243,0.2); font-size:10px; font-weight:600; letter-spacing:2px; text-transform:uppercase; color:rgba(176,190,197,0.5); cursor:pointer; transition:all 0.2s; background:transparent; font-family:var(--font-orbitron),sans-serif; }
        .filter-btn:hover { border-color:rgba(33,150,243,0.5); color:#fff; }
        .filter-btn.active { background:#1565C0; border-color:#1565C0; color:#fff; }

        /* ── GRID ── */
        .prods-grid { padding:48px 64px; display:grid; grid-template-columns:repeat(3,1fr); gap:2px; background:rgba(33,150,243,0.04); }

        .prod-card {
          position:relative; overflow:hidden;
          background:rgba(4,12,24,0.9);
          cursor:pointer; transition:background 0.3s;
          border:1px solid rgba(33,150,243,0.08);
          text-decoration:none; display:block;
        }
        .prod-card:hover { background:rgba(6,18,38,0.98); border-color:rgba(33,150,243,0.25); }
        .prod-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#1565C0,#00B4D8); transform:scaleX(0); transform-origin:left; transition:transform 0.4s; z-index:2; }
        .prod-card:hover::before { transform:scaleX(1); }
        .prod-card.featured { grid-column:1/3; }

        /* Imagem */
        .prod-img-wrap { position:relative; height:220px; overflow:hidden; }
        .prod-card.featured .prod-img-wrap { height:320px; }
        .prod-img { width:100%; height:100%; object-fit:cover; transition:transform 0.6s ease; filter:brightness(0.65) saturate(0.8); }
        .prod-card:hover .prod-img { transform:scale(1.06); filter:brightness(0.85) saturate(1); }
        .prod-img-overlay { position:absolute; inset:0; background:linear-gradient(180deg,transparent 30%,rgba(4,12,24,0.97) 100%); }

        /* Número */
        .prod-num { position:absolute; top:16px; right:20px; font-size:64px; font-weight:900; color:rgba(255,255,255,0.05); line-height:1; z-index:1; transition:color 0.3s; font-family:var(--font-orbitron),sans-serif; }
        .prod-card:hover .prod-num { color:rgba(33,150,243,0.1); }

        /* Specs pills */
        .prod-specs { position:absolute; top:16px; left:16px; display:flex; gap:6px; flex-wrap:wrap; z-index:2; }
        .prod-spec { padding:3px 8px; background:rgba(3,8,15,0.7); border:1px solid rgba(33,150,243,0.2); font-size:8px; color:rgba(176,190,197,0.6); letter-spacing:1px; text-transform:uppercase; font-family:var(--font-space),sans-serif; }

        /* Info */
        .prod-info { padding:24px 28px 28px; position:relative; z-index:1; }
        .prod-tag { font-size:8.5px; color:#00B4D8; letter-spacing:2.5px; text-transform:uppercase; margin-bottom:8px; font-family:var(--font-space),sans-serif; }
        .prod-name { font-size:22px; font-weight:900; color:#fff; margin-bottom:8px; letter-spacing:-0.5px; font-family:var(--font-orbitron),sans-serif; }
        .prod-card.featured .prod-name { font-size:30px; }
        .prod-desc { font-size:12px; color:rgba(176,190,197,0.55); line-height:1.6; margin-bottom:20px; font-family:var(--font-space),sans-serif; }
        .prod-link { display:inline-flex; align-items:center; gap:8px; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:rgba(33,150,243,0.5); transition:color 0.2s; font-family:var(--font-orbitron),sans-serif; }
        .prod-card:hover .prod-link { color:#2196F3; }
        .prod-arrow { display:inline-block; transition:transform 0.2s; }
        .prod-card:hover .prod-arrow { transform:translateX(5px); }

        /* Glow */
        .prod-glow { position:absolute; inset:0; background:radial-gradient(ellipse 60% 40% at 50% 100%,rgba(21,101,192,0.1) 0%,transparent 70%); opacity:0; transition:opacity 0.4s; pointer-events:none; }
        .prod-card:hover .prod-glow { opacity:1; }

        /* ── CTA ── */
        .prods-cta { padding:40px 64px; background:rgba(4,12,24,0.9); border-top:1px solid rgba(33,150,243,0.1); display:flex; align-items:center; justify-content:space-between; gap:24px; flex-wrap:wrap; }
        .cta-title { font-size:22px; font-weight:900; color:#fff; margin-bottom:4px; font-family:var(--font-orbitron),sans-serif; }
        .cta-title span { color:#2196F3; }
        .cta-sub { font-size:11px; color:rgba(176,190,197,0.45); letter-spacing:1px; font-family:var(--font-space),sans-serif; }
        .cta-btns { display:flex; gap:10px; flex-shrink:0; }
        .btn-wpp { display:flex; align-items:center; gap:8px; padding:13px 24px; background:#25D366; color:#fff; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; text-decoration:none; transition:background 0.2s; font-family:var(--font-orbitron),sans-serif; }
        .btn-wpp:hover { background:#1da851; }
        .btn-orc { display:flex; align-items:center; gap:8px; padding:13px 24px; background:#1565C0; color:#fff; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; text-decoration:none; transition:background 0.2s; font-family:var(--font-orbitron),sans-serif; }
        .btn-orc:hover { background:#2196F3; }

        @media (max-width:1024px) {
          .prods-hero-content { padding:0 32px; }
          .prods-grid { padding:32px; grid-template-columns:1fr 1fr; }
          .prod-card.featured { grid-column:1/3; }
          .filter-bar { padding:16px 32px; }
          .prods-cta { padding:32px; }
        }
        @media (max-width:640px) {
          .prods-hero { height:280px; }
          .prods-hero-content { padding:0 20px; }
          .prods-title { font-size:36px; }
          .prods-grid { padding:20px; grid-template-columns:1fr; }
          .prod-card.featured { grid-column:auto; }
          .filter-bar { padding:14px 20px; overflow-x:auto; flex-wrap:nowrap; }
          .prods-deco { display:none; }
          .prods-cta { padding:24px 20px; flex-direction:column; }
          .cta-btns { width:100%; flex-direction:column; }
        }
      `}</style>

      <Navbar />

      <div className="prods-page">

        {/* HERO */}
        <div className="prods-hero">
          <div className="prods-hero-grid" />
          <div className="prods-hero-glow" />
          {/* deco removido */}

          {/* Produto carrossel hero */}
          {heroProducts.length > 0 && <div
            style={{
              position: "absolute",
              right: "8%",
              top: "50%",
              transform: "translateY(-55%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <motion.img
              key={heroIndex}
              src={heroProducts[heroIndex % heroProducts.length].catalog?.heroImage || ""}
              alt={heroProducts[heroIndex % heroProducts.length].page.text[locale as "pt" | "es" | "en"].name}
              style={{
                width: 320,
                height: 320,
                objectFit: "contain",
                filter: "drop-shadow(0 0 60px rgba(33,150,243,0.35)) drop-shadow(0 24px 48px rgba(0,0,0,0.6)) brightness(0.9)",
                transform: "perspective(1000px) rotateY(-8deg) rotateX(3deg)",
              }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Nome do produto */}
            <motion.div
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                textAlign: "center",
                marginTop: 8,
                fontSize: 10,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "rgba(100,181,246,0.5)",
                fontFamily: "var(--font-space), sans-serif",
              }}
            >
              {heroProducts[heroIndex % heroProducts.length].page.text[locale as "pt" | "es" | "en"].name}
            </motion.div>
          </div>}

          {/* Dots indicadores */}
          <div style={{
            position: "absolute",
            bottom: 24,
            right: "5%",
            display: "flex",
            gap: 6,
            zIndex: 2,
          }}>
            {heroProducts.map((_, i) => (
              <div
                key={i}
                onClick={() => setHeroIndex(i)}
                style={{
                  width: i === heroIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === heroIndex ? "#2196F3" : "rgba(255,255,255,0.2)",
                  transition: "all 0.3s",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          <div className="prods-hero-content">
            <div className="prods-eyebrow">Catálogo completo</div>
            <div className="prods-title">
              Linha de<br /><span>Produtos</span>
            </div>
            <div className="prods-sub">
              Estruturas de alumínio fabricadas com precisão industrial para eventos de qualquer escala na América Latina.
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="filter-bar">
          {filters.map(f => (
            <button
              key={f.key}
              className={`filter-btn ${activeFilter === f.key ? "active" : ""}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        <motion.div
          className="prods-grid"
          layout
        >
          {filtered.map((p, i) => (
            <motion.a
              key={p.slug}
              href={`/${locale}/produtos/${p.slug}`}
              className={`prod-card ${p.catalog?.featured && activeFilter === "todos" ? "featured" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              layout
            >
              <div className="prod-glow" />
              <div className="prod-num">{String(listingProducts.indexOf(p) + 1).padStart(2, "0")}</div>
              <div className="prod-img-wrap">
                {(p.catalog?.cardImage || p.page.gallery[0]) && <img className="prod-img" src={p.catalog?.cardImage || p.page.gallery[0]} alt={p.page.text[locale as "pt" | "es" | "en"].name} />}
                <div className="prod-img-overlay" />
                <div className="prod-specs">
                  {p.cardSpecs.map(s => (
                    <span key={s} className="prod-spec">{s}</span>
                  ))}
                </div>
              </div>
              <div className="prod-info">
                <div className="prod-tag">{p.tag}</div>
                <div className="prod-name">{p.page.text[locale as "pt" | "es" | "en"].name}</div>
                <div className="prod-desc">{p.page.text[locale as "pt" | "es" | "en"].description}</div>
                <div className="prod-link">
                  Ver produto <span className="prod-arrow">→</span>
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="prods-cta">
          <div>
            <div className="cta-title">Não encontrou o que precisa? <span>Fale conosco.</span></div>
            <div className="cta-sub">Fabricamos sob medida · Joinville, SC · Resposta em até 2h</div>
          </div>
          <div className="cta-btns">
            <a href="https://api.whatsapp.com/send?phone=554734401445" target="_blank" rel="noopener noreferrer" className="btn-wpp">
              <MessageCircle size={14} /> WhatsApp
            </a>
            <a href="mailto:contato@selum.com.br" className="btn-orc">
              <Mail size={14} /> Solicitar Orçamento
            </a>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
