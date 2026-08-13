"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { LayoutGrid, Shield, Feather, Factory, ArrowRight, FileText } from "lucide-react";
import type { Produto } from "@/lib/supabase";

/* ─── DATA ────────────────────────────────────────────────────────────────── */

const LENGTH_DATA = [
  { value: "0,5m", weight: "3,2 kg" },
  { value: "1,5m", weight: "9,5 kg" },
  { value: "2,0m", weight: "12,8 kg" },
  { value: "2,5m", weight: "15,9 kg" },
  { value: "3,5m", weight: "22,4 kg" },
  { value: "4,0m", weight: "25,6 kg" },
  { value: "4,5m", weight: "28,8 kg" },
  { value: "5,0m", weight: "32,0 kg" },
  { value: "5,5m", weight: "35,2 kg" },
  { value: "6,0m", weight: "38,4 kg" },
];

const SPECS_STATIC = [
  { label: "Seção", value: "40 × 40 cm" },
  { label: "Diâmetro tubo", value: "Ø 50 mm" },
  { label: "Espessura", value: "2 mm" },
  { label: "Liga", value: "6061-T6" },
  { label: "Carga máx.", value: "1.200 kg/m" },
  { label: "Norma", value: "EN 74-1" },
];

const FEATURES = [
  {
    icon: <LayoutGrid size={20} />,
    name: "Modular",
    desc: "Múltiplas configurações",
  },
  {
    icon: <Shield size={20} />,
    name: "Resistência",
    desc: "Projetado para cargas elevadas",
  },
  {
    icon: <Feather size={20} />,
    name: "Leveza",
    desc: "Alumínio de alta performance",
  },
  {
    icon: <Factory size={20} />,
    name: "Fabricação própria",
    desc: "Controle total de qualidade",
  },
];

/* ─── TRUSS SVG ───────────────────────────────────────────────────────────── */

function TrussIllustration({ length }: { length: string }) {
  const G = "#C9A84C";
  const Gd = "rgba(201,168,76,0.35)";
  const Gdd = "rgba(201,168,76,0.12)";
  const Wdd = "rgba(242,240,236,0.18)";

  const frontPanelX = [55, 101, 147, 193, 239, 285];
  const backPanelX = [73, 119, 165, 211, 257, 303];

  return (
    <svg
      viewBox="0 0 400 230"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", maxHeight: 220 }}
      aria-label={`Ilustração do Box Truss com comprimento ${length}`}
    >
      {/* ── BACK FACE ── */}
      <line x1="73" y1="76" x2="303" y2="76" stroke={Wdd} strokeWidth="1.5" />
      <line x1="73" y1="131" x2="303" y2="131" stroke={Wdd} strokeWidth="1.5" />
      <line x1="73" y1="76" x2="73" y2="131" stroke={Wdd} strokeWidth="1.5" />
      <line x1="303" y1="76" x2="303" y2="131" stroke={Wdd} strokeWidth="1.5" />
      {/* Back lacings */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line
            x1={backPanelX[i]} y1="76" x2={backPanelX[i + 1]} y2="131"
            stroke={Gdd} strokeWidth="0.75"
          />
          <line
            x1={backPanelX[i]} y1="131" x2={backPanelX[i + 1]} y2="76"
            stroke={Gdd} strokeWidth="0.75"
          />
        </g>
      ))}
      {/* Back joints */}
      {backPanelX.map((x) => (
        <g key={x}>
          <circle cx={x} cy={76} r="2" fill="#0a0a0a" stroke={Gdd} strokeWidth="1" />
          <circle cx={x} cy={131} r="2" fill="#0a0a0a" stroke={Gdd} strokeWidth="1" />
        </g>
      ))}

      {/* ── TOP FACE ── */}
      <polygon
        points="55,90 73,76 303,76 285,90"
        fill="rgba(201,168,76,0.03)"
        stroke={Gdd} strokeWidth="1"
      />
      {/* Top face diagonals */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={i}
          x1={frontPanelX[i + 1]} y1="90"
          x2={backPanelX[i]} y2="76"
          stroke={Gdd} strokeWidth="0.75"
        />
      ))}

      {/* ── RIGHT SIDE FACE ── */}
      <polygon
        points="285,90 303,76 303,131 285,145"
        fill="rgba(201,168,76,0.05)"
        stroke={Gd} strokeWidth="1"
      />
      <line x1="285" y1="90" x2="303" y2="131" stroke={Gdd} strokeWidth="0.75" />
      <line x1="285" y1="145" x2="303" y2="76" stroke={Gdd} strokeWidth="0.75" />

      {/* ── LEFT CONNECTORS ── */}
      <line x1="55" y1="90" x2="73" y2="76" stroke={Gd} strokeWidth="1.5" />
      <line x1="55" y1="145" x2="73" y2="131" stroke={Gd} strokeWidth="1.5" />

      {/* ── FRONT FACE LACINGS ── */}
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <line
            x1={frontPanelX[i]} y1="90" x2={frontPanelX[i + 1]} y2="145"
            stroke={Gd} strokeWidth="1"
          />
          <line
            x1={frontPanelX[i]} y1="145" x2={frontPanelX[i + 1]} y2="90"
            stroke={Gd} strokeWidth="1"
          />
        </g>
      ))}

      {/* ── FRONT PANEL DIVIDERS ── */}
      {frontPanelX.slice(1, -1).map((x) => (
        <line key={x} x1={x} y1="90" x2={x} y2="145" stroke="rgba(201,168,76,0.18)" strokeWidth="0.75" />
      ))}

      {/* ── FRONT MAIN CHORDS ── */}
      <line x1="55" y1="90" x2="285" y2="90" stroke={G} strokeWidth="2.5" />
      <line x1="55" y1="145" x2="285" y2="145" stroke={G} strokeWidth="2.5" />
      <line x1="55" y1="90" x2="55" y2="145" stroke={G} strokeWidth="2.5" />
      <line x1="285" y1="90" x2="285" y2="145" stroke={G} strokeWidth="2.5" />

      {/* ── FRONT JOINTS ── */}
      {frontPanelX.map((x) => (
        <g key={x}>
          <circle cx={x} cy={90} r="3.5" fill="#080808" stroke={G} strokeWidth="1.5" />
          <circle cx={x} cy={145} r="3.5" fill="#080808" stroke={G} strokeWidth="1.5" />
        </g>
      ))}

      {/* ── DIMENSION ANNOTATION ── */}
      <line x1="55" y1="170" x2="285" y2="170" stroke={G} strokeWidth="1" strokeDasharray="4,3" />
      <line x1="55" y1="153" x2="55" y2="174" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
      <line x1="285" y1="153" x2="285" y2="174" stroke="rgba(201,168,76,0.5)" strokeWidth="1" />
      <polygon points="55,170 64,166 64,174" fill={G} />
      <polygon points="285,170 276,166 276,174" fill={G} />
      <text
        x="170" y="200"
        textAnchor="middle"
        fill={G}
        fontSize="17"
        fontFamily="var(--font-space), sans-serif"
        fontWeight="600"
        letterSpacing="1"
      >
        {length}
      </text>
    </svg>
  );
}

/* ─── PAGE ────────────────────────────────────────────────────────────────── */

export default function ProductDetailPage({
  slug,
  product,
  heroUrl,
  galleryUrls,
}: {
  slug: string;
  product: Produto | null;
  heroUrl?: string | null;
  galleryUrls?: string[];
}) {
  const locale = useLocale();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = LENGTH_DATA[selectedIndex];

  const productName = product?.name ?? "Box Truss";
  const productCategory = product?.category ?? "Box Truss";
  const productTag = product?.tag ?? "Q40";
  const productDescription =
    product?.description ??
    "Estrutura treliçada de alumínio com seção quadrada, projetada para suportar cargas elevadas em eventos e instalações de grande porte. Alta rigidez e leveza são os diferenciais desta linha.";

  return (
    <>
      <style>{`
        .pd-page {
          min-height: 100vh;
          background: #080808;
          padding-top: 96px;
          font-family: var(--font-space), sans-serif;
          color: #F2F0EC;
        }
        .pd-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 64px;
        }

        /* BREADCRUMB */
        .pd-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 28px 0 0;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #444;
        }
        .pd-breadcrumb a { color: #444; text-decoration: none; transition: color 0.2s; }
        .pd-breadcrumb a:hover { color: #C9A84C; }
        .pd-breadcrumb-sep { color: #333; }
        .pd-breadcrumb-current { color: #F2F0EC; }

        /* HEADER */
        .pd-header {
          padding: 48px 0 40px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .pd-eyebrow {
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pd-eyebrow::before {
          content: '';
          width: 20px;
          height: 1px;
          background: #C9A84C;
          display: block;
        }
        .pd-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 700;
          color: #F2F0EC;
          line-height: 1.1;
          margin-bottom: 14px;
          letter-spacing: -0.5px;
        }
        .pd-subtitle {
          font-size: 13px;
          color: #666;
          max-width: 560px;
          line-height: 1.7;
        }

        /* LENGTH SELECTOR */
        .pd-selector-wrap {
          padding: 32px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .pd-tabs {
          display: flex;
          gap: 2px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .pd-tabs::-webkit-scrollbar { display: none; }
        .pd-tab {
          flex-shrink: 0;
          padding: 10px 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          color: #555;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          font-family: var(--font-space), sans-serif;
        }
        .pd-tab:hover:not(.pd-tab--active) {
          color: #F2F0EC;
          background: rgba(255,255,255,0.03);
          border-color: rgba(255,255,255,0.07);
        }
        .pd-tab--active {
          color: #F2F0EC;
          background: rgba(201,168,76,0.06);
          border-color: rgba(201,168,76,0.2);
        }
        .pd-tab--active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #C9A84C;
        }

        /* MAIN PANEL */
        .pd-main {
          margin: 1px 0;
          display: grid;
          grid-template-columns: 1fr 1fr 300px;
          border: 1px solid rgba(255,255,255,0.07);
        }
        .pd-img-col {
          background: #0a0a0a;
          position: relative;
          min-height: 380px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          border-right: 1px solid rgba(255,255,255,0.07);
          overflow: hidden;
        }
        /* Dot grid decoration */
        .pd-img-col::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }
        .pd-img-inner {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 360px;
        }
        /* Corner brackets */
        .pd-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          border-color: rgba(201,168,76,0.3);
          border-style: solid;
        }
        .pd-corner--tl { top: 16px; left: 16px; border-width: 1px 0 0 1px; }
        .pd-corner--tr { top: 16px; right: 16px; border-width: 1px 1px 0 0; }
        .pd-corner--bl { bottom: 16px; left: 16px; border-width: 0 0 1px 1px; }
        .pd-corner--br { bottom: 16px; right: 16px; border-width: 0 1px 1px 0; }

        /* INFO COLUMN */
        .pd-info-col {
          background: #0f0f0f;
          padding: 44px 40px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border-right: 1px solid rgba(255,255,255,0.07);
          gap: 32px;
        }
        .pd-info-cat {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 16px;
        }
        .pd-info-label {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #444;
          margin-bottom: 6px;
        }
        .pd-info-value {
          font-size: clamp(56px, 6vw, 80px);
          font-weight: 700;
          color: #F2F0EC;
          line-height: 1;
          letter-spacing: -2px;
        }
        .pd-info-divider {
          height: 1px;
          background: rgba(255,255,255,0.07);
          margin: 24px 0;
        }
        .pd-info-desc {
          font-size: 13px;
          color: #555;
          line-height: 1.75;
          flex: 1;
        }
        .pd-info-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: transparent;
          border: 1px solid rgba(201,168,76,0.35);
          color: #C9A84C;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          font-family: var(--font-space), sans-serif;
          transition: all 0.2s;
          width: fit-content;
        }
        .pd-info-btn:hover {
          background: rgba(201,168,76,0.08);
          border-color: rgba(201,168,76,0.6);
          color: #E8C96A;
        }
        .pd-info-btn svg { transition: transform 0.2s; }
        .pd-info-btn:hover svg { transform: translateX(3px); }

        /* SIDEBAR */
        .pd-sidebar {
          background: #0f0f0f;
          padding: 36px 32px;
          display: flex;
          flex-direction: column;
        }
        .pd-sidebar-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #F2F0EC;
          margin-bottom: 6px;
          padding-bottom: 14px;
          position: relative;
        }
        .pd-sidebar-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 28px;
          height: 2px;
          background: #C9A84C;
        }
        .pd-spec-list {
          margin-top: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .pd-spec-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          padding: 11px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .pd-spec-row:last-child { border-bottom: none; }
        .pd-spec-label {
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #444;
          white-space: nowrap;
        }
        .pd-spec-value {
          font-size: 12px;
          font-weight: 600;
          color: #F2F0EC;
          text-align: right;
        }
        .pd-spec-value--gold { color: #C9A84C; }
        .pd-sidebar-link {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 28px;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #444;
          text-decoration: none;
          transition: color 0.2s;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .pd-sidebar-link:hover { color: #C9A84C; }
        .pd-sidebar-link svg { transition: transform 0.2s; }
        .pd-sidebar-link:hover svg { transform: translateX(3px); }

        /* FEATURES */
        .pd-features {
          margin-top: 1px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: none;
        }
        .pd-feature {
          padding: 32px 28px;
          border-right: 1px solid rgba(255,255,255,0.07);
          transition: background 0.2s;
        }
        .pd-feature:last-child { border-right: none; }
        .pd-feature:hover { background: rgba(255,255,255,0.02); }
        .pd-feature-icon {
          color: #C9A84C;
          margin-bottom: 16px;
          opacity: 0.85;
        }
        .pd-feature-name {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #F2F0EC;
          margin-bottom: 6px;
        }
        .pd-feature-desc {
          font-size: 11px;
          color: #555;
          line-height: 1.6;
        }

        /* NOTICE BAR */
        .pd-notice {
          margin: 1px 0 0;
          padding: 20px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          border: 1px solid rgba(255,255,255,0.07);
          border-top: none;
          background: #0a0a0a;
        }
        .pd-notice-text {
          font-size: 12px;
          color: #444;
          letter-spacing: 0.5px;
        }
        .pd-notice-text span { color: #C9A84C; }
        .pd-notice-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.1);
          color: #666;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          font-family: var(--font-space), sans-serif;
          transition: all 0.2s;
          white-space: nowrap;
        }
        .pd-notice-btn:hover {
          border-color: rgba(201,168,76,0.3);
          color: #C9A84C;
        }

        /* BOTTOM PADDING */
        .pd-bottom { padding-bottom: 80px; }

        /* RESPONSIVE */
        @media (max-width: 1100px) {
          .pd-container { padding: 0 32px; }
          .pd-main { grid-template-columns: 1fr 1fr; }
          .pd-sidebar {
            grid-column: 1 / -1;
            border-top: 1px solid rgba(255,255,255,0.07);
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0 40px;
          }
          .pd-sidebar-title { grid-column: 1 / -1; }
          .pd-spec-list { grid-column: 1; margin-top: 0; }
          .pd-sidebar-link { grid-column: 2; align-self: end; }
        }
        @media (max-width: 768px) {
          .pd-container { padding: 0 20px; }
          .pd-main { grid-template-columns: 1fr; }
          .pd-img-col { min-height: 260px; }
          .pd-info-col { padding: 32px 24px; }
          .pd-sidebar { grid-template-columns: 1fr; }
          .pd-sidebar-link { grid-column: 1; }
          .pd-features { grid-template-columns: repeat(2, 1fr); }
          .pd-feature { border-bottom: 1px solid rgba(255,255,255,0.07); }
          .pd-notice { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
        @media (max-width: 480px) {
          .pd-features { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="pd-page">
        <div className="pd-container">

          {/* ── BREADCRUMB ── */}
          <nav className="pd-breadcrumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>Início</Link>
            <span className="pd-breadcrumb-sep">/</span>
            <Link href={`/${locale}/#products`}>Produtos</Link>
            <span className="pd-breadcrumb-sep">/</span>
            <span className="pd-breadcrumb-current">{productName}</span>
          </nav>

          {/* ── HEADER ── */}
          <div className="pd-header">
            <div className="pd-eyebrow">Configurações</div>
            <h1 className="pd-title">Escolha a dimensão.</h1>
            <p className="pd-subtitle">
              Selecione o comprimento desejado para visualizar as especificações disponíveis.
            </p>
          </div>

          {/* ── LENGTH SELECTOR ── */}
          <div className="pd-selector-wrap">
            <div className="pd-tabs" role="tablist" aria-label="Comprimentos disponíveis">
              {LENGTH_DATA.map((item, i) => (
                <button
                  key={item.value}
                  role="tab"
                  aria-selected={selectedIndex === i}
                  className={`pd-tab${selectedIndex === i ? " pd-tab--active" : ""}`}
                  onClick={() => setSelectedIndex(i)}
                >
                  {item.value}
                </button>
              ))}
            </div>
          </div>

          {/* ── MAIN PANEL ── */}
          <div className="pd-main" role="tabpanel">

            {/* Image column */}
            <div className="pd-img-col">
              <div className="pd-corner pd-corner--tl" />
              <div className="pd-corner pd-corner--tr" />
              <div className="pd-corner pd-corner--bl" />
              <div className="pd-corner pd-corner--br" />
              {heroUrl ? (
                <Image
                  src={heroUrl}
                  alt={`${productName} — imagem hero`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit: "contain", zIndex: 1 }}
                  priority
                />
              ) : (
                <div className="pd-img-inner">
                  <TrussIllustration length={current.value} />
                </div>
              )}
            </div>

            {/* Info column */}
            <div className="pd-info-col">
              <div>
                <div className="pd-info-cat">
                  {productCategory} · {productTag}
                </div>
                <div className="pd-info-label">Comprimento</div>
                <div className="pd-info-value">{current.value}</div>
                <div className="pd-info-divider" />
                <p className="pd-info-desc">{productDescription}</p>
              </div>
              <a href="#contact" className="pd-info-btn">
                Consultar especificações <ArrowRight size={12} />
              </a>
            </div>

            {/* Sidebar */}
            <div className="pd-sidebar">
              <div className="pd-sidebar-title">Especificações</div>
              <div className="pd-spec-list">
                {/* Dynamic: Comprimento */}
                <div className="pd-spec-row">
                  <span className="pd-spec-label">Comprimento</span>
                  <span className="pd-spec-value pd-spec-value--gold">{current.value}</span>
                </div>
                {/* Static specs */}
                {SPECS_STATIC.map((s) => (
                  <div key={s.label} className="pd-spec-row">
                    <span className="pd-spec-label">{s.label}</span>
                    <span className="pd-spec-value">{s.value}</span>
                  </div>
                ))}
                {/* Dynamic: Peso */}
                <div className="pd-spec-row">
                  <span className="pd-spec-label">Peso</span>
                  <span className="pd-spec-value pd-spec-value--gold">{current.weight}</span>
                </div>
              </div>
              <a href="#contact" className="pd-sidebar-link">
                <FileText size={12} />
                Ver ficha técnica completa <ArrowRight size={11} />
              </a>
            </div>
          </div>

          {/* ── FEATURES ── */}
          <div className="pd-features">
            {FEATURES.map((f) => (
              <div key={f.name} className="pd-feature">
                <div className="pd-feature-icon">{f.icon}</div>
                <div className="pd-feature-name">{f.name}</div>
                <div className="pd-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>

          {/* ── GALLERY ── */}
          {galleryUrls && galleryUrls.length > 0 && (
            <div
              style={{
                marginTop: 1,
                border: "1px solid rgba(255,255,255,0.07)",
                borderTop: "none",
                padding: "36px 32px",
                background: "#0a0a0a",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#444",
                  marginBottom: 20,
                  paddingBottom: 14,
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  position: "relative",
                }}
              >
                Galeria
                <span
                  style={{
                    position: "absolute",
                    bottom: -1,
                    left: 0,
                    width: 24,
                    height: 1,
                    background: "#C9A84C",
                  }}
                />
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 8,
                }}
              >
                {galleryUrls.map((url, i) => (
                  <div
                    key={url}
                    style={{
                      position: "relative",
                      aspectRatio: "4/3",
                      background: "#111",
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <Image
                      src={url}
                      alt={`${productName} — galeria ${i + 1}`}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NOTICE BAR ── */}
          <div className="pd-notice">
            <p className="pd-notice-text">
              <span>Especificações técnicas completas</span> em breve.
            </p>
            <a href="#contact" className="pd-notice-btn">
              Falar com a Selum <ArrowRight size={11} />
            </a>
          </div>

          <div className="pd-bottom" />
        </div>
      </div>
    </>
  );
}
