"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const products = [
  {
    num: "01",
    icon: "⬡",
    tag: "Q-15 · Q-30 · Q-50",
    nameKey: "boxtruss_name",
    descKey: "boxtruss_desc",
    image: "/images/products/box-truss.png",
  },
  {
    num: "02",
    icon: "▦",
    tag: "Palcos & Pisos",
    nameKey: "praticaveis_name",
    descKey: "praticaveis_desc",
    image: "/images/products/praticaveis.png",
  },
  {
    num: "03",
    icon: "◰",
    tag: "Estrutural",
    nameKey: "bases_name",
    descKey: "bases_desc",
    image: "/images/products/base-cubos.png",
  },
  {
    num: "04",
    icon: "⊿",
    tag: "Acesso & Segurança",
    nameKey: "escadas_name",
    descKey: "escadas_desc",
    image: "/images/products/escadas.png",
  },
];

export default function Products() {
  const t = useTranslations("products");

  return (
    <>
      <style>{`
        .products-section {
          background: #071E38;
          padding: 48px 64px 0;
          margin-bottom: 0;
          position: relative;
          overflow: hidden;
        }
        .products-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(33,150,243,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(33,150,243,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .products-header {
          position: relative; z-index: 1;
          display: flex; align-items: flex-end; justify-content: space-between;
          margin-bottom: 48px; gap: 24px;
        }
        .products-label {
          font-size: 10px; color: #00B4D8; letter-spacing: 4px;
          text-transform: uppercase; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
        }
        .products-label::before {
          content: ''; width: 24px; height: 1px; background: #00B4D8;
        }
        .products-title { font-size: 38px; font-weight: 900; color: #fff; line-height: 1.1; }
        .products-title span { color: #2196F3; }
        .products-subtitle {
          font-size: 12px; color: rgba(176,190,197,0.55);
          max-width: 260px; text-align: right; line-height: 1.7;
        }

        /* ACCORDION */
        .accordion {
          display: flex;
          gap: 2px;
          height: 420px;
          position: relative; z-index: 1;
          border: 1px solid rgba(33,150,243,0.1);
        }
        .acc-card {
          flex: 1;
          min-width: 72px;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          transition: flex 0.55s cubic-bezier(0.4,0,0.2,1);
          background: rgba(5,15,30,0.75);
          border-right: 1px solid rgba(33,150,243,0.08);
        }
        .acc-card:last-child { border-right: none; }
        .accordion:hover .acc-card { flex: 0.35; }
        .accordion:hover .acc-card:hover { flex: 3.5; }

        /* Imagem de fundo */
        .acc-bg {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.55s ease, opacity 0.4s;
          opacity: 0.6;
        }
        .acc-card:hover .acc-bg {
          opacity: 0.85;
          transform: scale(1.04);
        }

        /* Overlay */
        .acc-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, rgba(4,8,15,0.3) 0%, rgba(4,8,15,0.7) 50%, rgba(4,8,15,0.95) 100%);
          transition: background 0.4s;
        }
        .acc-card:hover .acc-overlay {
          background: linear-gradient(180deg, rgba(4,8,15,0.1) 0%, rgba(4,8,15,0.5) 50%, rgba(4,8,15,0.92) 100%);
        }

        /* Linha topo */
        .acc-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #1565C0, #00B4D8);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s; z-index: 3;
        }
        .acc-card:hover::before { transform: scaleX(1); }

        /* Número decorativo */
        .acc-num {
          position: absolute; top: 12px; right: 14px;
          font-size: 64px; font-weight: 900;
          color: rgba(255,255,255,0.04);
          line-height: 1; user-select: none;
          transition: color 0.3s; z-index: 2;
        }
        .acc-card:hover .acc-num { color: rgba(255,255,255,0.07); }

        /* Estado recolhido */
        .acc-collapsed {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 20px 16px;
          display: flex; flex-direction: column; align-items: center; gap: 14px;
          z-index: 2; transition: opacity 0.25s;
        }
        .acc-card:hover .acc-collapsed { opacity: 0; pointer-events: none; }
        .acc-icon-sm {
          font-size: 26px; color: #2196F3;
          filter: drop-shadow(0 0 12px rgba(33,150,243,0.7));
        }
        .acc-name-vert {
          font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.9);
          text-transform: uppercase; letter-spacing: 2px;
          writing-mode: vertical-rl; transform: rotate(180deg);
          white-space: nowrap;
          text-shadow: 0 0 12px rgba(0,0,0,0.8);
        }

        /* Estado expandido */
        .acc-expanded {
          position: absolute; inset: 0;
          padding: 32px 28px;
          display: flex; flex-direction: column; justify-content: flex-end;
          opacity: 0; transition: opacity 0.3s 0.15s;
          pointer-events: none; z-index: 2;
        }
        .acc-card:hover .acc-expanded { opacity: 1; pointer-events: all; }

        .acc-tag {
          font-size: 9px; color: #00B4D8; letter-spacing: 2.5px;
          text-transform: uppercase; margin-bottom: 8px;
        }
        .acc-name {
          font-size: 24px; font-weight: 900; color: #fff;
          margin-bottom: 10px; line-height: 1.1;
        }
        .acc-desc {
          font-size: 12px; color: rgba(176,190,197,0.75);
          line-height: 1.65; margin-bottom: 24px; max-width: 340px;
        }
        .acc-link {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 22px;
          border: 1px solid rgba(33,150,243,0.4);
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #64B5F6;
          transition: background 0.2s, border-color 0.2s;
          width: fit-content; text-decoration: none;
        }
        .acc-link:hover {
          background: rgba(33,150,243,0.12);
          border-color: rgba(33,150,243,0.7);
          color: #fff;
        }
        .acc-arr { display: inline-block; transition: transform 0.2s; }
        .acc-link:hover .acc-arr { transform: translateX(4px); }

        /* Responsivo */
        @media (max-width: 1024px) {
          .products-section { padding: 64px 32px; }
          .accordion { height: 360px; }
          .products-subtitle { display: none; }
        }
        @media (max-width: 768px) {
          .products-section { padding: 48px 20px; }
          .accordion {
            flex-direction: column;
            height: auto;
          }
          .acc-card {
            flex: none !important;
            height: 200px;
            border-right: none;
            border-bottom: 1px solid rgba(33,150,243,0.08);
          }
          .acc-card:last-child { border-bottom: none; }
          .accordion:hover .acc-card { flex: none !important; }
          .accordion:hover .acc-card:hover { flex: none !important; }
          .acc-collapsed { opacity: 0; }
          .acc-expanded { opacity: 1; pointer-events: all; }
          .products-title { font-size: 28px; }
        }
      `}</style>

      <section id="products" className="products-section">
        <div className="products-header">
          <div>
            <div className="products-label">{t("label")}</div>
            <div className="products-title">
              {t("title")} <span>{t("title_highlight")}</span>
            </div>
          </div>
          <div className="products-subtitle">
            Estruturas fabricadas com precisão industrial para eventos de qualquer escala.
          </div>
        </div>

        <motion.div
          className="accordion"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {products.map((p) => (
            <div key={p.num} className="acc-card">
              {/* Imagem de fundo */}
              <div
                className="acc-bg"
                style={{ backgroundImage: `url(${p.image})` }}
              />
              {/* Overlay */}
              <div className="acc-overlay" />
              {/* Número */}
              <div className="acc-num">{p.num}</div>

              {/* Recolhido */}
              <div className="acc-collapsed">
                <div className="acc-icon-sm">{p.icon}</div>
                <div className="acc-name-vert">{t(p.nameKey as any)}</div>
              </div>

              {/* Expandido */}
              <div className="acc-expanded">
                <div className="acc-tag">{p.tag}</div>
                <div className="acc-name">{t(p.nameKey as any)}</div>
                <div className="acc-desc">{t(p.descKey as any)}</div>
                <a href="#contact" className="acc-link">
                  {t("see_line")} <span className="acc-arr">→</span>
                </a>
              </div>
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
}
