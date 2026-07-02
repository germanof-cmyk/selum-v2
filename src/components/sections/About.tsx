"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function About() {
  const t = useTranslations("about");

  const stats = [
    { num: "+50", suffix: "t",   label: "Toneladas mensais" },
    { num: "4.500", suffix: "m²", label: "Parque fabril" },
    { num: "+50", suffix: "",    label: "Colaboradores" },
    { num: "+8 ", suffix: "Países",   label: "Fornecendo soluções" },
  ];

  const features = [
    { num: "01", icon: "⚙", title: t("item1_title"), desc: t("item1_desc") },
    { num: "02", icon: "◎", title: t("item2_title"), desc: t("item2_desc") },
    { num: "03", icon: "⬡", title: t("item3_title"), desc: t("item3_desc") },
    { num: "04", icon: "◈", title: "Certificações",  desc: "NR-1 · NR-14 · NR-18 — segurança comprovada em cada estrutura." },
  ];

  return (
    <>
      <style>{`
        .about-section {
          background: #071E38;
          position: relative;
          overflow: hidden;
        }
        .about-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(33,150,243,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(33,150,243,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* HEADER */
        .about-hdr {
          padding: 48px 64px 32px;
          position: relative; z-index: 1;
        }
        .about-lbl {
          font-size: 9px; color: #00B4D8; letter-spacing: 4px;
          text-transform: uppercase; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-space), sans-serif;
        }
        .about-lbl::before { content: ''; width: 20px; height: 1px; background: #00B4D8; }
        .about-ttl {
          font-size: 42px; font-weight: 900; color: #fff; line-height: 1.05;
          font-family: var(--font-orbitron), sans-serif;
        }
        .about-ttl span { color: #2196F3; }

        /* IMAGE CARD */
        .about-img-card {
          position: relative; height: 340px; overflow: hidden;
          margin: 0 64px;
          border: 1px solid rgba(33,150,243,0.1);
        }
        .about-img-bg {
          position: absolute; inset: 0;
          background-image: url('/images/about-bg.png');
          background-size: cover;
          background-position: center right;
          transition: transform 0.6s ease;
        }
        .about-img-card:hover .about-img-bg { transform: scale(1.03); }
        .about-img-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            90deg,
            rgba(4,12,24,0.92) 0%,
            rgba(4,12,24,0.6) 45%,
            rgba(4,12,24,0.2) 70%,
            transparent 100%
          );
        }
        /* Top accent */
        .about-img-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #1565C0, #00B4D8);
          z-index: 3;
        }
        /* Deco rings */
        .about-rings {
          position: absolute; right: 80px; top: 50%;
          transform: translateY(-50%);
          pointer-events: none; z-index: 1;
        }
        .about-ring {
          border-radius: 50%;
          border: 1px solid rgba(33,150,243,0.15);
          position: absolute;
        }
        .about-ring-1 {
          width: 200px; height: 200px;
          top: -100px; right: -100px;
          animation: spin-ring 18s linear infinite;
        }
        .about-ring-2 {
          width: 130px; height: 130px;
          top: -65px; right: -65px;
          border-color: rgba(33,150,243,0.25);
          animation: spin-ring 12s linear infinite reverse;
        }
        .about-ring-3 {
          width: 70px; height: 70px;
          top: -35px; right: -35px;
          border-color: rgba(0,180,216,0.4);
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; color: #2196F3;
          filter: drop-shadow(0 0 8px rgba(33,150,243,0.5));
        }
        @keyframes spin-ring { to { transform: rotate(360deg); } }

        /* Image content */
        .about-img-content {
          position: absolute; left: 48px; bottom: 40px; z-index: 2;
        }
        .about-img-badge {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 12px; margin-bottom: 14px;
          border: 1px solid rgba(0,180,216,0.4);
          background: rgba(0,180,216,0.08);
          font-size: 9px; color: #00B4D8; letter-spacing: 2px; text-transform: uppercase;
          font-family: var(--font-space), sans-serif;
        }
        .about-img-badge-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #00B4D8;
          animation: badge-pulse 2s infinite;
        }
        @keyframes badge-pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .about-img-title {
          font-size: 30px; font-weight: 900; color: #fff;
          line-height: 1.1; margin-bottom: 8px;
          font-family: var(--font-orbitron), sans-serif;
        }
        .about-img-title span { color: #2196F3; }
        .about-img-desc {
          font-size: 13px; color: rgba(176,190,197,0.7);
          line-height: 1.6; max-width: 380px; margin-bottom: 20px;
          font-family: var(--font-space), sans-serif;
        }
        .about-img-link {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 24px; background: #1565C0; color: #fff;
          font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          text-decoration: none; transition: background 0.2s;
          font-family: var(--font-orbitron), sans-serif;
        }
        .about-img-link:hover { background: #2196F3; }

        /* FEATURES GRID */
        .about-features {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2px; margin: 2px 64px 0;
          background: rgba(33,150,243,0.06);
          border: 1px solid rgba(33,150,243,0.1);
          border-top: none;
        }
        .feat {
          background: rgba(4,12,24,0.8); padding: 28px 22px;
          position: relative; overflow: hidden; transition: background 0.3s;
        }
        .feat:hover { background: rgba(6,18,38,0.95); }
        .feat::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #1565C0, #00B4D8);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.35s;
        }
        .feat:hover::before { transform: scaleX(1); }
        .feat-num {
          position: absolute; top: 10px; right: 14px;
          font-size: 48px; font-weight: 900;
          color: rgba(33,150,243,0.04); line-height: 1;
          pointer-events: none;
          transition: color 0.3s;
        }
        .feat:hover .feat-num { color: rgba(33,150,243,0.08); }
        .feat-icon {
          font-size: 26px; color: #2196F3; margin-bottom: 12px;
          filter: drop-shadow(0 0 8px rgba(33,150,243,0.4));
          transition: transform 0.3s; position: relative; z-index: 1;
        }
        .feat:hover .feat-icon { transform: scale(1.1); }
        .feat-title {
          font-size: 11px; font-weight: 800; color: #E0E8EE;
          text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;
          position: relative; z-index: 1;
          font-family: var(--font-orbitron), sans-serif;
        }
        .feat-desc {
          font-size: 11px; color: rgba(176,190,197,0.5); line-height: 1.6;
          position: relative; z-index: 1;
          font-family: var(--font-space), sans-serif;
        }

        /* STATS */
        .about-stats {
          display: flex;
          margin: 2px 64px 0;
          border: 1px solid rgba(33,150,243,0.08);
          border-top: none;
        }
        .about-stat {
          flex: 1; padding: 24px 28px;
          border-right: 1px solid rgba(33,150,243,0.08);
          transition: background 0.3s; position: relative;
        }
        .about-stat:last-child { border-right: none; }
        .about-stat:hover { background: rgba(33,150,243,0.03); }
        .about-stat::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #1565C0, #00B4D8);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s;
        }
        .about-stat:hover::before { transform: scaleX(1); }
        .about-stat-num {
          font-size: 34px; font-weight: 900; color: #fff; line-height: 1; margin-bottom: 4px;
          font-family: var(--font-orbitron), sans-serif;
        }
        .about-stat-num em { font-style: normal; font-size: 18px; color: #2196F3; }
        .about-stat-lbl {
          font-size: 9px; color: rgba(176,190,197,0.4);
          letter-spacing: 1.5px; text-transform: uppercase;
          font-family: var(--font-space), sans-serif;
        }

        .about-bottom { height: 0; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .about-hdr { padding: 56px 32px 36px; }
          .about-img-card { margin: 0 32px; height: 280px; }
          .about-features { grid-template-columns: 1fr 1fr; margin: 2px 32px 0; }
          .about-stats { margin: 2px 32px 0; }
          .about-ttl { font-size: 32px; }
        }
        @media (max-width: 640px) {
          .about-hdr { padding: 48px 20px 28px; }
          .about-img-card { margin: 0 20px; height: 240px; }
          .about-img-content { left: 24px; bottom: 24px; }
          .about-img-title { font-size: 22px; }
          .about-features { grid-template-columns: 1fr; margin: 2px 20px 0; }
          .about-stats { flex-wrap: wrap; margin: 2px 20px 0; }
          .about-stat { flex: 1 1 48%; }
          .about-ttl { font-size: 26px; }
          .about-rings { display: none; }
        }
      `}</style>

      <section id="about" className="about-section">

        {/* Header */}
        {/* Header removido a pedido do cliente */}

        {/* Image Card */}
        <motion.div
          className="about-img-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="about-img-bg" />
          <div className="about-img-overlay" />
          <div className="about-rings">
            <div className="about-ring about-ring-1" />
            <div className="about-ring about-ring-2" />
            <div className="about-ring about-ring-3">⬡</div>
          </div>
          <div className="about-img-content">
            <div className="about-img-badge">
              <div className="about-img-badge-dot" />
              Fabricado no Brasil · Presente na América Latina
            </div>
            <div className="about-img-title">
              Da nossa fábrica para os maiores<br /><span>eventos da América Latina</span>
            </div>
            <div className="about-img-desc">
              Projetamos, fabricamos e fornecemos estruturas em alumínio para clientes em mais de 8 países, mantendo o mesmo padrão de qualidade em cada entrega.
            </div>
            <a href="#contact" className="about-img-link">
              Conheça a Selum <ArrowRight size={12} />
            </a>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="about-features"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {features.map((f) => (
            <div key={f.num} className="feat">
              <div className="feat-num">{f.num}</div>
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="about-stats"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {stats.map((s, i) => (
            <div key={i} className="about-stat">
              <div className="about-stat-num">
                {s.num}{s.suffix && <em>{s.suffix}</em>}
              </div>
              <div className="about-stat-lbl">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="about-bottom" />
      </section>
    </>
  );
}
