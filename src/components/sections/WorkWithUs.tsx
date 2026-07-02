"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WorkWithUs() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section
      style={{
        background: "#071E38",
        padding: isMobile ? "24px 20px" : "28px 64px",
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
        gap: isMobile ? 16 : 24,
        borderTop: "1px solid rgba(33,150,243,0.12)",
        borderBottom: "1px solid rgba(33,150,243,0.12)",
      }}
    >
      {/* SELUM marca d'água */}
      {!isMobile && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          fontSize: 100, fontWeight: 900,
          color: "rgba(33,150,243,0.03)",
          letterSpacing: 20, pointerEvents: "none",
          whiteSpace: "nowrap",
          fontFamily: "var(--font-orbitron), sans-serif",
        }}>
          SELUM
        </div>
      )}

      {/* Left */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ display: "flex", alignItems: "center", gap: 16, position: "relative", zIndex: 1 }}
      >
        <div style={{ flexShrink: 0 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: "#00B4D8",
            animation: "wwu-pulse 2s infinite",
          }} />
          <style>{`
            @keyframes wwu-pulse {
              0% { box-shadow: 0 0 0 0 rgba(0,180,216,0.4); }
              70% { box-shadow: 0 0 0 8px rgba(0,180,216,0); }
              100% { box-shadow: 0 0 0 0 rgba(0,180,216,0); }
            }
          `}</style>
        </div>
        <div>
          <div style={{
            fontSize: isMobile ? 16 : 20,
            fontWeight: 900, color: "#fff",
            fontFamily: "var(--font-orbitron), sans-serif",
          }}>
            Faça parte da nossa{" "}
            <span style={{ color: "#2196F3" }}>equipe</span>
          </div>
          <div style={{
            fontSize: 11, color: "rgba(176,190,197,0.5)",
            marginTop: 3, letterSpacing: "1px",
            fontFamily: "var(--font-space), sans-serif",
          }}>
            Vagas abertas · Joinville, SC · Venha crescer conosco
          </div>
        </div>
      </motion.div>

      {/* Button */}
      <motion.a
        href="mailto:rh@selum.com.br?subject=Currículo - Quero fazer parte da equipe Selum"
        initial={{ opacity: 0, x: isMobile ? 0 : 24, y: isMobile ? 8 : 0 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        style={{
          padding: "12px 24px",
          background: "#1565C0", color: "#fff",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "1.5px", textTransform: "uppercase",
          textDecoration: "none", transition: "background 0.2s",
          whiteSpace: "nowrap", flexShrink: 0,
          position: "relative", zIndex: 1,
          fontFamily: "var(--font-orbitron), sans-serif",
          width: isMobile ? "100%" : "auto",
          textAlign: "center",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "#2196F3")}
        onMouseLeave={e => (e.currentTarget.style.background = "#1565C0")}
      >
        Cadastre seu Currículo →
      </motion.a>
    </section>
  );
}
