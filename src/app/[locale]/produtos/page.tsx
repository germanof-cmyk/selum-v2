import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getProducts, PRODUCT_IMAGES } from "@/lib/db/products";

export const metadata: Metadata = {
  title: "Produtos — Selum",
  description:
    "Catálogo completo de estruturas de alumínio Selum: Box Truss, Praticáveis, Bases & Cubos e Escadas.",
};

const NUMS = ["01", "02", "03", "04", "05", "06", "07", "08"];

export default async function ProdutosPage() {
  const locale = await getLocale();
  const { products } = await getProducts();

  return (
    <>
      <style>{`
        .pl-page {
          min-height: 100vh;
          background: #080808;
          font-family: var(--font-space), sans-serif;
          color: #F2F0EC;
        }
        .pl-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 64px;
        }

        /* BREADCRUMB */
        .pl-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 112px 0 0;
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #444;
        }
        .pl-breadcrumb a { color: #444; text-decoration: none; transition: color 0.2s; }
        .pl-breadcrumb a:hover { color: #C9A84C; }
        .pl-breadcrumb-sep { color: #2a2a2a; }
        .pl-breadcrumb-current { color: #F2F0EC; }

        /* HEADER */
        .pl-header {
          padding: 40px 0 56px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 40px;
        }
        .pl-eyebrow {
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #C9A84C;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .pl-eyebrow::before {
          content: '';
          width: 20px;
          height: 1px;
          background: #C9A84C;
        }
        .pl-title {
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 700;
          color: #F2F0EC;
          line-height: 1.05;
          letter-spacing: -0.5px;
          margin: 0;
        }
        .pl-count {
          font-size: 11px;
          color: #333;
          letter-spacing: 1px;
          white-space: nowrap;
          padding-bottom: 6px;
        }
        .pl-count span { color: #C9A84C; }

        /* GRID */
        .pl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          border-left: 1px solid rgba(255,255,255,0.07);
          border-top: 1px solid rgba(255,255,255,0.07);
          margin-top: 0;
        }

        /* CARD */
        .pl-card {
          position: relative;
          display: block;
          text-decoration: none;
          color: inherit;
          border-right: 1px solid rgba(255,255,255,0.07);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: #080808;
          overflow: hidden;
          transition: background 0.3s;
          min-height: 380px;
        }
        .pl-card:hover { background: #0d0d0d; }

        /* Card image */
        .pl-card-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0.15;
          transition: opacity 0.4s, transform 0.5s;
        }
        .pl-card:hover .pl-card-img {
          opacity: 0.28;
          transform: scale(1.03);
        }

        /* Top accent line */
        .pl-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #C9A84C, transparent);
          transform: scaleX(0);
          transition: transform 0.35s;
          z-index: 2;
        }
        .pl-card:hover::before { transform: scaleX(1); }

        /* Card content */
        .pl-card-inner {
          position: relative;
          z-index: 1;
          padding: 36px 40px;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 380px;
          box-sizing: border-box;
        }

        .pl-card-num {
          font-size: 11px;
          letter-spacing: 3px;
          color: #2a2a2a;
          font-weight: 700;
          margin-bottom: auto;
        }

        .pl-card-body {
          margin-top: auto;
          padding-top: 120px;
        }

        .pl-card-tag {
          font-size: 9px;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          color: #555;
          margin-bottom: 10px;
        }
        .pl-card:hover .pl-card-tag { color: #C9A84C; transition: color 0.2s; }

        .pl-card-name {
          font-size: clamp(22px, 2.5vw, 30px);
          font-weight: 700;
          color: #F2F0EC;
          line-height: 1.1;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }

        .pl-card-desc {
          font-size: 12px;
          color: #444;
          line-height: 1.7;
          max-width: 380px;
          margin-bottom: 28px;
        }

        .pl-card-cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #333;
          transition: color 0.2s;
        }
        .pl-card:hover .pl-card-cta { color: #C9A84C; }
        .pl-card-cta-arrow {
          display: inline-block;
          transition: transform 0.2s;
        }
        .pl-card:hover .pl-card-cta-arrow { transform: translateX(5px); }

        /* Corner brackets */
        .pl-bracket {
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: rgba(201,168,76,0);
          border-style: solid;
          transition: border-color 0.3s;
          z-index: 2;
        }
        .pl-bracket--tl { top: 14px; left: 14px; border-width: 1px 0 0 1px; }
        .pl-bracket--br { bottom: 14px; right: 14px; border-width: 0 1px 1px 0; }
        .pl-card:hover .pl-bracket { border-color: rgba(201,168,76,0.4); }

        /* EMPTY STATE */
        .pl-empty {
          padding: 80px 0;
          text-align: center;
          color: #333;
          font-size: 13px;
          letter-spacing: 1px;
        }

        /* RESPONSIVE */
        @media (max-width: 900px) {
          .pl-container { padding: 0 32px; }
          .pl-grid { grid-template-columns: 1fr; }
          .pl-header { flex-direction: column; align-items: flex-start; gap: 16px; }
        }
        @media (max-width: 560px) {
          .pl-container { padding: 0 20px; }
          .pl-card-inner { padding: 28px 24px; min-height: 300px; }
          .pl-card { min-height: 300px; }
          .pl-card-body { padding-top: 80px; }
        }
      `}</style>

      <div className="pl-page">
        <Navbar />
        <div className="pl-container">

          {/* BREADCRUMB */}
          <nav className="pl-breadcrumb" aria-label="Breadcrumb">
            <Link href={`/${locale}`}>Início</Link>
            <span className="pl-breadcrumb-sep">/</span>
            <span className="pl-breadcrumb-current">Produtos</span>
          </nav>

          {/* HEADER */}
          <div className="pl-header">
            <div>
              <div className="pl-eyebrow">Catálogo</div>
              <h1 className="pl-title">Linha de Produtos</h1>
            </div>
            <div className="pl-count">
              <span>{products.length}</span> produto{products.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* GRID */}
          {products.length === 0 ? (
            <div className="pl-empty">Nenhum produto disponível.</div>
          ) : (
            <div className="pl-grid">
              {products.map((product, i) => {
                const imgSrc = PRODUCT_IMAGES[product.slug] ?? null;
                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/produtos/${product.slug}`}
                    className="pl-card"
                  >
                    {/* Background image */}
                    {imgSrc && (
                      <div
                        className="pl-card-img"
                        style={{ backgroundImage: `url(${imgSrc})` }}
                        aria-hidden
                      />
                    )}

                    {/* Corner brackets */}
                    <span className="pl-bracket pl-bracket--tl" aria-hidden />
                    <span className="pl-bracket pl-bracket--br" aria-hidden />

                    <div className="pl-card-inner">
                      <div className="pl-card-num">{NUMS[i] ?? String(i + 1).padStart(2, "0")}</div>

                      <div className="pl-card-body">
                        <div className="pl-card-tag">{product.tag}</div>
                        <div className="pl-card-name">{product.name}</div>
                        <p className="pl-card-desc">{product.description}</p>
                        <span className="pl-card-cta">
                          Ver linha <span className="pl-card-cta-arrow">→</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div style={{ paddingBottom: 80 }} />
        </div>
        <Footer />
      </div>
    </>
  );
}
