"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { MessageCircle, Mail, ArrowLeft } from "lucide-react";
import { products } from "@/lib/products";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const product = products[slug as keyof typeof products];
  const [selectedVariant, setSelectedVariant] = useState(0);

  if (!product) {
    return (
      <div style={{ background: "#071E38", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 18 }}>
        Produto não encontrado.
      </div>
    ) as React.ReactNode;
  }

  return (
    <>
      <style>{`
        .prod-page { background: #071E38; min-height: 100vh; padding-top: 72px; }

        /* HERO */
        .prod-hero {
          position: relative; height: 420px; overflow: hidden;
          display: flex; align-items: flex-end;
        }
        .prod-hero-bg {
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #03080F 0%, #071828 30%, #1565C0 60%, #0A2540 80%, #03080F 100%);
        }
        .prod-hero-img {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: flex-end;
          padding-right: 80px;
        }
        .prod-hero-img img {
          height: 320px; width: auto; object-fit: contain;
          filter: drop-shadow(0 0 60px rgba(33,150,243,0.4)) drop-shadow(0 20px 40px rgba(0,0,0,0.6));
          animation: float-prod 4s ease-in-out infinite;
        }
        @keyframes float-prod {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        .prod-hero-geo {
          position: absolute; right: -40px; top: -40px;
          width: 500px; height: 500px; pointer-events: none;
        }
        .geo-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(33,150,243,0.1); }
        .prod-hero::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; z-index:10; background:linear-gradient(90deg,transparent,#1565C0 20%,#00B4D8 50%,#1565C0 80%,transparent); }
        .prod-hero-overlay { position:absolute; inset:0; background:linear-gradient(90deg,rgba(3,8,15,0.97) 0%,rgba(3,8,15,0.7) 45%,rgba(3,8,15,0.1) 75%,transparent 100%); }
        .prod-hero-overlay-b { position:absolute; inset:0; background:linear-gradient(180deg,transparent 40%,rgba(3,8,15,0.7) 100%); }

        .prod-hero-content { position:relative; z-index:5; padding:0 64px 48px; max-width:580px; }
        .prod-back { display:inline-flex; align-items:center; gap:6px; font-size:10px; color:rgba(176,190,197,0.45); letter-spacing:2px; text-transform:uppercase; text-decoration:none; margin-bottom:20px; transition:color 0.2s; }
        .prod-back:hover { color:#64B5F6; }
        .prod-eyebrow { display:inline-flex; align-items:center; gap:6px; padding:4px 12px; margin-bottom:14px; border:1px solid rgba(0,180,216,0.35); background:rgba(0,180,216,0.07); font-size:9px; color:#00B4D8; letter-spacing:2.5px; text-transform:uppercase; }
        .prod-eyebrow-dot { width:5px; height:5px; border-radius:50%; background:#00B4D8; }
        .prod-name { font-size: clamp(32px,5vw,52px); font-weight:900; color:#fff; line-height:1.0; margin-bottom:14px; letter-spacing:-1px; }
        .prod-name span { color:#2196F3; }
        .prod-tagline { font-size:13px; color:rgba(176,190,197,0.65); line-height:1.65; margin-bottom:20px; max-width:420px; }
        .prod-tags { display:flex; gap:8px; flex-wrap:wrap; }
        .prod-tag { padding:4px 12px; border:1px solid rgba(33,150,243,0.2); font-size:9px; color:rgba(176,190,197,0.55); letter-spacing:1.5px; text-transform:uppercase; }

        /* STATS STRIP */
        .stats-strip { display:grid; grid-template-columns:repeat(4,1fr); background:rgba(3,8,15,0.8); border-top:1px solid rgba(33,150,243,0.12); border-bottom:1px solid rgba(33,150,243,0.12); }
        .stat-item { padding:20px 28px; border-right:1px solid rgba(33,150,243,0.08); position:relative; transition:background 0.3s; }
        .stat-item:last-child { border-right:none; }
        .stat-item:hover { background:rgba(33,150,243,0.05); }
        .stat-item::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#1565C0,#00B4D8); transform:scaleX(0); transform-origin:left; transition:transform 0.3s; }
        .stat-item:hover::before { transform:scaleX(1); }
        .stat-lbl { font-size:8px; color:rgba(176,190,197,0.4); letter-spacing:2px; text-transform:uppercase; margin-bottom:6px; }
        .stat-val { font-size:24px; font-weight:900; color:#fff; line-height:1; }
        .stat-val em { font-style:normal; font-size:12px; color:#2196F3; margin-left:3px; }

        /* MAIN GRID */
        .main-grid { display:grid; grid-template-columns:1.2fr 1fr; gap:2px; background:rgba(33,150,243,0.05); }

        /* SPECS */
        .specs-block { background:rgba(4,12,24,0.9); padding:48px 56px; }
        .block-title { font-size:9px; color:#00B4D8; letter-spacing:3px; text-transform:uppercase; margin-bottom:28px; display:flex; align-items:center; gap:8px; }
        .block-title::before { content:''; width:20px; height:1px; background:#00B4D8; }
        .spec-row { display:flex; align-items:center; justify-content:space-between; padding:14px 0; border-bottom:1px solid rgba(33,150,243,0.07); }
        .spec-row:last-child { border-bottom:none; }
        .spec-key { font-size:11px; color:rgba(176,190,197,0.45); letter-spacing:0.5px; }
        .spec-val { font-size:14px; font-weight:700; color:#fff; }
        .spec-val em { font-style:normal; font-size:10px; color:#2196F3; margin-left:3px; }

        /* VARIANTS */
        .variants-block { background:rgba(6,18,38,0.9); padding:48px 40px; }
        .variants-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-top:20px; }
        .variant { padding:16px; border:1px solid rgba(33,150,243,0.12); background:rgba(33,150,243,0.03); cursor:pointer; transition:all 0.2s; position:relative; overflow:hidden; }
        .variant::before { content:''; position:absolute; top:0; left:0; right:0; height:1.5px; background:linear-gradient(90deg,#1565C0,#00B4D8); transform:scaleX(0); transform-origin:left; transition:transform 0.3s; }
        .variant:hover::before, .variant.active::before { transform:scaleX(1); }
        .variant:hover, .variant.active { border-color:rgba(33,150,243,0.4); background:rgba(33,150,243,0.1); }
        .variant-name { font-size:15px; font-weight:900; color:#fff; margin-bottom:2px; }
        .variant-sub { font-size:9px; color:rgba(176,190,197,0.45); letter-spacing:1px; }
        .variant-size { font-size:10px; color:#64B5F6; margin-top:5px; font-weight:600; }

        /* FEATURES */
        .features-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:2px; background:rgba(33,150,243,0.05); }
        .feat { background:rgba(4,12,24,0.85); padding:28px 24px; position:relative; overflow:hidden; transition:background 0.3s; }
        .feat:hover { background:rgba(6,18,38,0.95); }
        .feat::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; background:linear-gradient(90deg,#1565C0,#00B4D8); transform:scaleX(0); transform-origin:left; transition:transform 0.35s; }
        .feat:hover::before { transform:scaleX(1); }
        .feat-num { position:absolute; top:10px; right:14px; font-size:48px; font-weight:900; color:rgba(33,150,243,0.04); line-height:1; }
        .feat-icon { font-size:26px; color:#2196F3; margin-bottom:12px; filter:drop-shadow(0 0 8px rgba(33,150,243,0.4)); transition:transform 0.3s; }
        .feat:hover .feat-icon { transform:scale(1.1); }
        .feat-title { font-size:11px; font-weight:800; color:#E0E8EE; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px; }
        .feat-desc { font-size:11px; color:rgba(176,190,197,0.5); line-height:1.55; }

        /* CTA */
        .prod-cta { padding:40px 64px; display:flex; align-items:center; justify-content:space-between; background:linear-gradient(90deg,#071E38,#0A2540 50%,#071E38); border-top:1px solid rgba(33,150,243,0.15); gap:24px; flex-wrap:wrap; }
        .cta-title { font-size:24px; font-weight:900; color:#fff; margin-bottom:4px; }
        .cta-title span { color:#2196F3; }
        .cta-sub { font-size:11px; color:rgba(176,190,197,0.45); letter-spacing:1px; }
        .cta-btns { display:flex; gap:10px; flex-shrink:0; }
        .btn-wpp { display:flex; align-items:center; gap:8px; padding:13px 24px; background:#25D366; color:#fff; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; text-decoration:none; transition:background 0.2s; }
        .btn-wpp:hover { background:#1da851; }
        .btn-orc { display:flex; align-items:center; gap:8px; padding:13px 24px; background:#1565C0; color:#fff; font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase; text-decoration:none; transition:background 0.2s; }
        .btn-orc:hover { background:#2196F3; }

        @media (max-width:1024px) {
          .prod-hero-content { padding:0 32px 40px; }
          .main-grid { grid-template-columns:1fr; }
          .features-grid { grid-template-columns:1fr 1fr; }
          .stats-strip { grid-template-columns:1fr 1fr; }
          .prod-cta { padding:32px; }
        }
        @media (max-width:640px) {
          .prod-hero { height:auto; padding-top:80px; }
          .prod-hero-img { display:none; }
          .prod-hero-content { padding:80px 20px 40px; max-width:100%; }
          .features-grid { grid-template-columns:1fr; }
          .stats-strip { grid-template-columns:1fr 1fr; }
          .variants-grid { grid-template-columns:1fr 1fr; }
          .cta-btns { flex-direction:column; width:100%; }
        }
      `}</style>

      <Navbar />

      <div className="prod-page">

        {/* HERO */}
        <motion.div
          className="prod-hero"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="prod-hero-bg" />
          <div className="prod-hero-geo">
            <div className="geo-ring" style={{ width:400,height:400,top:0,right:0 }} />
            <div className="geo-ring" style={{ width:260,height:260,top:70,right:70 }} />
            <div className="geo-ring" style={{ width:140,height:140,top:130,right:130,borderColor:"rgba(0,180,216,0.15)" }} />
          </div>
          <div className="prod-hero-overlay" />
          <div className="prod-hero-overlay-b" />

          {/* Foto do produto */}
          <div className="prod-hero-img">
            <img src={product.image} alt={product.name} />
          </div>

          <div className="prod-hero-content">
            <a href={`/pt#products`} className="prod-back">
              <ArrowLeft size={12} /> Voltar para produtos
            </a>
            <div className="prod-eyebrow">
              <div className="prod-eyebrow-dot" />
              {product.category}
            </div>
            <div className="prod-name">
              {product.name.split(" ").map((word, i) =>
                i === product.name.split(" ").length - 1
                  ? <span key={i}>{word}</span>
                  : word + " "
              )}
            </div>
            <div className="prod-tagline">{product.tagline}</div>
            <div className="prod-tags">
              {product.tags.map(tag => (
                <span key={tag} className="prod-tag">{tag}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* STATS STRIP */}
        <motion.div
          className="stats-strip"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {product.stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-lbl">{s.label}</div>
              <div className="stat-val">{s.value}<em>{s.unit}</em></div>
            </div>
          ))}
        </motion.div>

        {/* MAIN GRID */}
        <motion.div
          className="main-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Specs */}
          <div className="specs-block">
            <div className="block-title">Especificações Técnicas</div>
            {product.specs.map((s, i) => (
              <div key={i} className="spec-row">
                <span className="spec-key">{s.key}</span>
                <span className="spec-val">{s.val}{s.unit && <em>{s.unit}</em>}</span>
              </div>
            ))}
          </div>

          {/* Variants */}
          <div className="variants-block">
            <div className="block-title">Modelos Disponíveis</div>
            <div className="variants-grid">
              {product.variants.map((v, i) => (
                <div
                  key={i}
                  className={`variant ${selectedVariant === i ? "active" : ""}`}
                  onClick={() => setSelectedVariant(i)}
                >
                  <div className="variant-name">{v.name}</div>
                  <div className="variant-sub">{v.sub}</div>
                  <div className="variant-size">{v.size}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FEATURES */}
        <motion.div
          className="features-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {product.features.map((f, i) => (
            <div key={i} className="feat">
              <div className="feat-num">0{i + 1}</div>
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.title}</div>
              <div className="feat-desc">{f.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <div className="prod-cta">
          <div>
            <div className="cta-title">Solicite um <span>orçamento</span></div>
            <div className="cta-sub">Resposta em até 2h · Sem compromisso · Joinville, SC</div>
          </div>
          <div className="cta-btns">
            
              href="https://api.whatsapp.com/send?phone=554734401445"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wpp"
            >
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