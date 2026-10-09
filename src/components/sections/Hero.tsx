"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const barItems = [
  { icon: "⬡", num: "+50", unit: "ton", desc: "stat_tonnage" },
  { icon: "◈", num: "+4500", unit: "m²", desc: "stat_facility" },
  { icon: "◎", num: "+50", unit: "", desc: "stat_team" },
  { icon: "◉", num: "NR-1 · NR-14", unit: "", desc: "stat_certifications" },
];

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <>
      <style>{`
        .hero-section {
          font-family: var(--font-space), 'Helvetica Neue', Arial, sans-serif;
        }
        .hero-section strong,
        .hero-section .bar-title,
        .hero-section .btn-primary,
        .hero-section .btn-outline,
        .hero-section .btn-wpp {
          font-family: var(--font-orbitron), 'Helvetica Neue', Arial, sans-serif;
        }
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          overflow: visible;
        }
        .hero-content {
          position: relative;
          z-index: 10;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 100px 80px 120px 80px;
          max-width: 680px;
          width: 100%;
        }
        .hero-logo img {
          height: 220px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 24px rgba(33,150,243,0.8)) brightness(1.2);
        }
        .hero-desc {
          color: rgba(224,232,238,0.95);
          font-size: 16px;
          font-weight: 300;
          line-height: 1.8;
          margin-bottom: 36px;
          max-width: 520px;
          white-space: pre-line;
        }
        .hero-desc strong {
          display: block;
          font-size: 20px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 8px;
          letter-spacing: -0.3px;
        }
        .hero-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .btn-primary {
          padding: 16px 36px;
          background: #1565C0;
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.2s;
          white-space: nowrap;
          box-shadow: 0 0 24px rgba(21,101,192,0.4);
        }
        .btn-primary:hover {
          background: #2196F3;
          box-shadow: 0 0 32px rgba(33,150,243,0.6);
          transform: translateY(-1px);
        }
        .btn-outline {
          padding: 16px 32px;
          border: 1.5px solid rgba(21,101,192,0.6);
          color: #64B5F6;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2.5px;
          text-transform: uppercase;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
          white-space: nowrap;
        }
        .btn-outline:hover { border-color: #2196F3; color: #fff; }
        .btn-wpp {
          padding: 16px 28px;
          background: #25D366;
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .btn-wpp:hover { background: #1da851; }
        .hero-mobile-whatsapp { display: none; }

        /* Barra flutuante */
        .hero-bar {
          position: absolute;
          bottom: 0;
          left: 5%;
          right: 5%;
          width: auto;
          max-width: 1100px;
          z-index: 10;
          display: flex;
          flex-wrap: wrap;
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 0.5px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          overflow: hidden;
        }
        .bar-col {
          flex: 1;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          border-right: 0.5px solid rgba(255,255,255,0.06);
          transition: background 0.35s;
          cursor: default;
        }
        .bar-col:last-child { border-right: none; }
        .bar-col:hover { background: rgba(33,150,243,0.04); }
        .bar-col:hover .bar-divider { opacity: 1; }
        .bar-num {
          font-size: 28px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -1px;
          line-height: 1;
          text-shadow: 0 0 30px rgba(33,150,243,0.3);
        }
        .bar-unit {
          font-size: 14px;
          font-weight: 400;
          color: #64B5F6;
          letter-spacing: 0.5px;
        }
        .bar-desc {
          font-size: 9px;
          color: rgba(176,190,197,0.45);
          letter-spacing: 1.8px;
          text-transform: uppercase;
          line-height: 1.4;
        }
        .bar-icon {
          font-size: 22px;
          color: #2196F3;
          flex-shrink: 0;
          filter: drop-shadow(0 0 8px rgba(33,150,243,0.5));
          line-height: 1;
        }
        .bar-divider {
          width: 20px;
          height: 1px;
          background: linear-gradient(90deg, #1565C0, transparent);
          margin-top: 2px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        /* Responsivo */
        @media (max-width: 1024px) {
          .hero-content { padding: 110px 40px 200px; max-width: 100%; }
          .hero-logo img { height: 140px; }
          .bar-col { padding: 18px 14px; gap: 10px; }
          .bar-title { font-size: 8.5px; }
          .bar-desc { font-size: 10px; }
        }
        @media (max-width: 768px) {
          .hero-section {
            overflow: hidden;
            min-height: 0;
          }
          .hero-content { padding: 112px 20px 36px; max-width: 100%; }
          .hero-desktop-break { display: none; }
          .hero-logo img { height: 130px; }
          .hero-btns { flex-direction: column; gap: 10px; }
          .btn-primary, .btn-outline, .btn-wpp {
            display: flex;
            align-items: center;
            min-height: 48px;
            text-align: center;
            justify-content: center;
            width: 100%;
            padding: 14px 20px;
          }
          .hero-bar {
            position: relative;
            bottom: auto;
            left: auto;
            right: auto;
            width: calc(100% - 40px);
            margin: 0 20px 24px;
            border-radius: 12px;
            overflow: hidden;
            flex-wrap: wrap;
          }
          .bar-col {
            flex: 0 0 50%;
            min-width: 0;
            border-right: none;
            border-bottom: 1px solid rgba(255,255,255,0.07);
            padding: 14px 12px;
          }
          .bar-col > div:first-child { align-items: flex-start !important; gap: 8px !important; }
          .bar-num { font-size: clamp(16px, 5vw, 24px); }
          .bar-unit { font-size: 11px; }
          .bar-col:nth-child(odd) { border-right: 1px solid rgba(255,255,255,0.07); }
          .bar-col:nth-last-child(-n+2) { border-bottom: none; }
          .bar-title { font-size: 20px; }
          .bar-desc { font-size: 9px; }
        }
        @media (max-width: 370px) {
          .hero-content { padding-inline: 16px; }
          .hero-bar { width: calc(100% - 32px); margin-inline: 16px; }
          .bar-icon { display: none; }
          .bar-col { padding-inline: 9px; }
        }
        @media (max-width: 767px) {
          .hero-btns { align-items: flex-start; gap: 8px; }
          .hero-btns .btn-primary,
          .hero-btns .btn-outline {
            width: auto;
            max-width: 100%;
            min-height: 44px;
            padding: 0 22px;
            border-radius: 3px;
            font-size: 10px;
            letter-spacing: 1.5px;
            line-height: 1.25;
            text-align: left;
          }
          .hero-btns .btn-primary {
            gap: 10px;
            box-shadow: 0 6px 20px rgba(21,101,192,0.22);
          }
          .hero-btns .btn-primary::after { content: '→'; font-size: 16px; font-weight: 400; line-height: 1; }
          .hero-btns .btn-outline {
            min-height: 42px;
            padding-inline: 16px;
            border: 1px solid rgba(137,191,235,0.46);
            background: rgba(3,8,15,0.18);
            color: #c3e2fa;
            font-size: 9px;
            box-shadow: none;
          }
          .hero-btns .btn-wpp { display: none; }
          .hero-mobile-whatsapp {
            position: fixed;
            right: calc(16px + env(safe-area-inset-right, 0px));
            bottom: calc(20px + env(safe-area-inset-bottom, 0px));
            z-index: 40;
            display: grid;
            place-items: center;
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: #25D366;
            color: #fff;
            box-shadow: 0 5px 18px rgba(0,0,0,0.3);
            text-decoration: none;
            transition: background 0.2s, transform 0.2s;
          }
          .hero-mobile-whatsapp:hover { background: #1da851; transform: translateY(-2px); }
          .hero-mobile-whatsapp:focus-visible { outline: 2px solid #fff; outline-offset: 3px; }
        }
      `}</style>

      <section className="hero-section">

        {/* Fundo fallback */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "linear-gradient(180deg,#03080F 0%,#061525 30%,#081E38 55%,#04111F 80%,#03080F 100%)" }} />

        {/* Vídeo */}
        <video autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 1 }}>
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", background: "linear-gradient(180deg,rgba(3,8,15,0.2) 0%,rgba(3,8,15,0.05) 35%,rgba(3,8,15,0.3) 65%,rgba(3,8,15,0.88) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none", background: "linear-gradient(90deg,rgba(3,8,15,0.6) 0%,rgba(3,8,15,0.25) 40%,rgba(3,8,15,0.02) 65%,transparent 100%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, zIndex: 4, background: "linear-gradient(90deg,transparent 0%,#1565C0 20%,#00B4D8 50%,#1565C0 80%,transparent 100%)" }} />

        {/* Conteúdo */}
        <div className="hero-content">

          <motion.div {...fadeUp(0.1)} style={{ marginBottom: 20 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", border: "1px solid rgba(0,180,216,0.5)", background: "rgba(0,180,216,0.08)", color: "#00B4D8", fontSize: 10, letterSpacing: "2.5px", textTransform: "uppercase" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#00B4D8", flexShrink: 0 }} />
              {t("badge")}
            </span>
          </motion.div>

          {/* Logo removida da hero */}

          <motion.div {...fadeUp(0.3)} style={{ marginBottom: 40 }}>
            {/* Frase principal impacto */}
            <div style={{
              fontSize: "clamp(22px, 3.5vw, 38px)",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.3,
              marginBottom: 12,
              letterSpacing: "-0.3px",
            }}>
              {t("headlineLine")}<br className="hero-desktop-break" />
              <span style={{
                color: "transparent",
                backgroundImage: "linear-gradient(90deg, #2196F3, #00B4D8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                {t("headlineHighlight")}
              </span>
            </div>

            {/* Linha separadora */}
            <div style={{
              width: 48, height: 2,
              background: "linear-gradient(90deg, #1565C0, #00B4D8)",
              marginBottom: 12,
            }} />

            {/* Subtítulo */}
            <div style={{
              fontSize: 14,
              color: "rgba(176,190,197,0.85)",
              letterSpacing: "2px",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}>
              <span>{t("serviceTruss")}</span>
              <span style={{ color: "rgba(33,150,243,0.4)" }}>·</span>
              <span>{t("serviceMaintenance")}</span>
              <span style={{ color: "rgba(33,150,243,0.4)" }}>·</span>
              <span>{t("serviceCustom")}</span>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.4)} className="hero-btns">
            <a href="#products" className="btn-primary">{t("cta_products")}</a>
            <a href="#contact" className="btn-outline">{t("cta_quote")}</a>
            <a href="https://api.whatsapp.com/send?phone=554734401445" target="_blank" rel="noopener noreferrer" className="btn-wpp">{t("cta_whatsapp")}</a>
          </motion.div>

        </div>

        {/* Barra flutuante */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="hero-bar"
        >
          {barItems.map((item, i) => (
            <div key={i} className="bar-col">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="bar-icon">{item.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 3 }}>
                    <div className="bar-num">{item.num}</div>
                    {item.unit && <span className="bar-unit">{item.unit}</span>}
                    {item.desc === "stat_team" && <span className="bar-unit">{t("stat_team_unit")}</span>}
                  </div>
                  <div className="bar-desc">{t(item.desc)}</div>
                </div>
              </div>
              <div className="bar-divider" />
            </div>
          ))}
        </motion.div>

      </section>
      <a
        href="https://api.whatsapp.com/send?phone=554734401445"
        target="_blank"
        rel="noopener noreferrer"
        className="hero-mobile-whatsapp"
        aria-label={t("cta_whatsapp")}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  );
}
