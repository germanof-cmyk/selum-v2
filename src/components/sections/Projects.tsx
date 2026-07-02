"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    slug: "barretos",
    title: "Barretos",
    category: "Show Nacional",
    image: "/images/projects/luan-santana-1.png",
    desc: "Estruturas Box Truss para o maior rodeio do Brasil.",
  },
  {
    id: 2,
    slug: "festa-nacional-cebola",
    title: "Festa Nacional da Cebola",
    category: "Festa Nacional",
    image: "/images/projects/luan-santana-2.png",
    desc: "Estruturas de alumínio para suporte de iluminação e som.",
  },
  {
    id: 3,
    slug: "verao-mais-guaratuba",
    title: "Verão Mais Guaratuba",
    category: "Show — Guaratuba · PR",
    image: "/images/projects/gustavo-lima-1.png",
    desc: "Palco e praticáveis para grande show de verão no litoral paranaense.",
  },
];

export default function Projects() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <>
      <style>{`
        .projects-section {
          background: #071E38;
          padding: 48px 64px;
          position: relative;
          overflow: hidden;
        }
        .projects-section::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(33,150,243,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(33,150,243,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }
        .projects-header {
          position: relative; z-index: 1;
          display: flex; align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px; gap: 24px;
        }
        .projects-label {
          font-size: 10px; color: #00B4D8; letter-spacing: 4px;
          text-transform: uppercase; margin-bottom: 10px;
          display: flex; align-items: center; gap: 8px;
          font-family: var(--font-space), sans-serif;
        }
        .projects-label::before {
          content: ''; width: 24px; height: 1px; background: #00B4D8;
        }
        .projects-title {
          font-size: 38px; font-weight: 900; color: #fff; line-height: 1.1;
          font-family: var(--font-orbitron), sans-serif;
        }
        .projects-title span { color: #2196F3; }
        .projects-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #64B5F6;
          text-decoration: none; white-space: nowrap;
          transition: color 0.2s;
          font-family: var(--font-orbitron), sans-serif;
        }
        .projects-link:hover { color: #fff; }

        /* GRID */
        .projects-grid {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr;
          gap: 2px;
          position: relative; z-index: 1;
          background: rgba(33,150,243,0.06);
          border: 1px solid rgba(33,150,243,0.1);
        }
        .proj-card {
          position: relative; overflow: hidden;
          cursor: pointer;
          aspect-ratio: 4/3;
        }
        .proj-card:first-child {
          aspect-ratio: unset;
          grid-row: 1;
        }

        /* Imagem */
        .proj-img {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          transition: transform 0.6s ease;
        }
        .proj-card:hover .proj-img { transform: scale(1.06); }

        /* Overlay */
        .proj-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(180deg,
            rgba(4,12,24,0.1) 0%,
            rgba(4,12,24,0.4) 40%,
            rgba(4,12,24,0.85) 100%
          );
          transition: background 0.4s;
        }
        .proj-card:hover .proj-overlay {
          background: linear-gradient(180deg,
            rgba(4,12,24,0.2) 0%,
            rgba(4,12,24,0.5) 40%,
            rgba(4,12,24,0.92) 100%
          );
        }

        /* Linha topo */
        .proj-card::before {
          content: ''; position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, #1565C0, #00B4D8);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s; z-index: 3;
        }
        .proj-card:hover::before { transform: scaleX(1); }

        /* Conteúdo */
        .proj-content {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 24px; z-index: 2;
        }
        .proj-cat {
          font-size: 9px; color: #00B4D8; letter-spacing: 2.5px;
          text-transform: uppercase; margin-bottom: 6px;
          font-family: var(--font-space), sans-serif;
        }
        .proj-title {
          font-size: 20px; font-weight: 900; color: #fff;
          margin-bottom: 6px; line-height: 1.1;
          font-family: var(--font-orbitron), sans-serif;
        }
        .proj-card:first-child .proj-title { font-size: 28px; }
        .proj-desc {
          font-size: 12px; color: rgba(176,190,197,0.7);
          line-height: 1.5; margin-bottom: 16px;
          max-width: 320px;
          font-family: var(--font-space), sans-serif;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.3s, transform 0.3s;
        }
        .proj-card:hover .proj-desc { opacity: 1; transform: translateY(0); }
        .proj-arrow {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: #2196F3;
          font-family: var(--font-orbitron), sans-serif;
          opacity: 0; transform: translateY(8px);
          transition: opacity 0.3s 0.05s, transform 0.3s 0.05s;
        }
        .proj-card:hover .proj-arrow { opacity: 1; transform: translateY(0); }

        /* CTA bottom */
        .projects-cta {
          position: relative; z-index: 1;
          margin-top: 32px;
          display: flex; justify-content: center;
        }
        .projects-cta-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 36px;
          border: 1px solid rgba(33,150,243,0.3);
          color: #64B5F6; font-size: 11px; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          text-decoration: none; transition: all 0.2s;
          font-family: var(--font-orbitron), sans-serif;
        }
        .projects-cta-btn:hover {
          border-color: #2196F3; color: #fff;
          background: rgba(33,150,243,0.08);
        }

        @media (max-width: 1024px) {
          .projects-section { padding: 64px 32px; }
          .projects-grid { grid-template-columns: 1fr 1fr; }
          .proj-card:first-child { grid-column: 1 / 3; }
        }
        @media (max-width: 640px) {
          .projects-section { padding: 48px 20px; }
          .projects-grid { grid-template-columns: 1fr; }
          .proj-card:first-child { grid-column: auto; }
          .projects-title { font-size: 26px; }
        }
      `}</style>

      <section id="projects" className="projects-section">
        <div className="projects-header">
          <div>
            <div className="projects-label">Portfólio</div>
            <div className="projects-title">
              Nossos <span>Projetos</span>
            </div>
          </div>
          <a href="/projetos" className="projects-link">
            Ver todos <ArrowRight size={14} />
          </a>
        </div>

        <motion.div
          className="projects-grid"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {projects.map((p) => (
            <div
              key={p.id}
              className="proj-card"
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div
                className="proj-img"
                style={{ backgroundImage: `url(${p.image})` }}
              />
              <div className="proj-overlay" />
              <div className="proj-content">
                <div className="proj-cat">{p.category}</div>
                <div className="proj-title">{p.title}</div>
                <div className="proj-desc">{p.desc}</div>
                <div className="proj-arrow">
                  Ver projeto <ArrowRight size={12} />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="projects-cta">
          <a href="/projetos" className="projects-cta-btn">
            Ver todos os projetos <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
