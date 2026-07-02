"use client";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { MessageCircle, Mail } from "lucide-react";

export default function CTASection() {
  const t = useTranslations("cta");

  return (
    <>
      <style>{`
        .cta-section {
          position: relative;
          padding: 64px 48px;
          overflow: hidden;
          background: #071E38;
        }
        .cta-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(33,150,243,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(33,150,243,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .cta-glow {
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 700px; height: 350px;
          background: radial-gradient(ellipse, rgba(21,101,192,0.18) 0%, transparent 70%);
          pointer-events: none;
        }
        .cta-line-l {
          position: absolute; left: 0; top: 0; bottom: 0; width: 4px;
          background: linear-gradient(180deg, transparent, #1565C0 30%, #00B4D8 70%, transparent);
        }
        .cta-line-r {
          position: absolute; right: 0; top: 0; bottom: 0; width: 4px;
          background: linear-gradient(180deg, transparent, #1565C0 30%, #00B4D8 70%, transparent);
        }
        .cta-inner {
          position: relative; z-index: 1;
          text-align: center; max-width: 700px; margin: 0 auto;
        }
        .cta-badge {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 5px 16px; margin-bottom: 28px;
          border: 1px solid rgba(0,180,216,0.4);
          background: rgba(0,180,216,0.07);
          font-size: 9px; color: #00B4D8; letter-spacing: 3px; text-transform: uppercase;
        }
        .cta-badge-dot {
          width: 5px; height: 5px; border-radius: 50%; background: #00B4D8;
          animation: ctapulse 2s infinite;
        }
        @keyframes ctapulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .cta-title {
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 900; color: #fff;
          line-height: 1.05; margin-bottom: 16px;
          letter-spacing: -1px;
        }
        .cta-title span {
          background: linear-gradient(90deg, #2196F3, #00B4D8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .cta-sub {
          font-size: 14px; color: rgba(176,190,197,0.6);
          margin-bottom: 44px; line-height: 1.6;
        }
        .cta-btns {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; flex-wrap: wrap;
        }
        .cta-btn-wpp {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 36px; background: #25D366; color: #fff;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          border: none; cursor: pointer; transition: background 0.2s; text-decoration: none;
        }
        .cta-btn-wpp:hover { background: #1da851; }
        .cta-btn-quote {
          display: flex; align-items: center; gap: 10px;
          padding: 16px 36px; background: #1565C0; color: #fff;
          font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;
          border: none; cursor: pointer; transition: background 0.2s; text-decoration: none;
        }
        .cta-btn-quote:hover { background: #2196F3; }
        .cta-info {
          margin-top: 40px;
          display: flex; align-items: center; justify-content: center;
          gap: 32px; flex-wrap: wrap;
        }
        .cta-info-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; color: rgba(176,190,197,0.4); letter-spacing: 1px;
        }
        .cta-info-dot { width: 4px; height: 4px; border-radius: 50%; background: rgba(33,150,243,0.4); }

        @media (max-width: 640px) {
          .cta-section { padding: 64px 24px; }
          .cta-btns { flex-direction: column; width: 100%; }
          .cta-btn-wpp, .cta-btn-quote { width: 100%; justify-content: center; }
          .cta-info { gap: 16px; }
        }
      `}</style>

      <section id="contact" className="cta-section">
        <div className="cta-glow" />
        <div className="cta-line-l" />
        <div className="cta-line-r" />

        <motion.div
          className="cta-inner"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="cta-badge">
            <div className="cta-badge-dot" />
            Pronto para o seu evento?
          </div>

          <div className="cta-title">
            Vamos construir<br />
            algo <span>extraordinário</span>
          </div>

          <div className="cta-sub">
            Fale com nosso time e receba um orçamento personalizado para o seu evento.
          </div>

          <div className="cta-btns">
            <a
              href="https://api.whatsapp.com/send?phone=554734401445&text=Olá! Vim pelo site e quero um orçamento."
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn-wpp"
            >
              <MessageCircle size={16} />
              {t("whatsapp")}
            </a>
            <a
              href="mailto:contato@selum.com.br"
              className="cta-btn-quote"
            >
              <Mail size={16} />
              {t("quote")}
            </a>
          </div>

          <div className="cta-info">
            <div className="cta-info-item">
              <div className="cta-info-dot" />
              Resposta em até 2h
            </div>
            <div className="cta-info-item">
              <div className="cta-info-dot" />
              Orçamento sem compromisso
            </div>
            <div className="cta-info-item">
              <div className="cta-info-dot" />
              Atendimento especializado
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
