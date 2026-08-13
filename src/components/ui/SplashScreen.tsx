"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "linear-gradient(135deg, #071E38 0%, #0A2540 50%, #071E38 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <style>{`
            @keyframes ring-expand {
              0% { transform: scale(0); opacity: 0; }
              50% { opacity: 0.4; }
              100% { transform: scale(1); opacity: 0.15; }
            }
            @keyframes glow-pulse {
              0%,100% { transform: scale(1); opacity: 0.5; }
              50% { transform: scale(1.15); opacity: 0.9; }
            }
            @keyframes bar-load {
              from { width: 0%; }
              to { width: 100%; }
            }
            .splash-ring-1 { animation: ring-expand 1.5s ease 0.2s both; }
            .splash-ring-2 { animation: ring-expand 1.5s ease 0.5s both; }
            .splash-ring-3 { animation: ring-expand 1.5s ease 0.8s both; }
            .splash-glow-anim { animation: glow-pulse 2s ease-in-out infinite; }
            .splash-bar-fill { animation: bar-load 1.8s ease 1s both; }
          `}</style>

          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(33,150,243,0.04) 1px,transparent 1px), linear-gradient(90deg,rgba(33,150,243,0.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }} />

          <div className="splash-glow-anim" style={{
            position: "absolute",
            width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(21,101,192,0.2) 0%, transparent 70%)",
          }} />

          {[160, 280, 400].map((size, i) => (
            <div
              key={i}
              className={"splash-ring-" + (i + 1)}
              style={{
                position: "absolute",
                width: size, height: size, borderRadius: "50%",
                border: "1px solid rgba(33,150,243,0.2)",
              }}
            />
          ))}

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, #1565C0 25%, #00B4D8 50%, #1565C0 75%, transparent)",
              transformOrigin: "left",
            }}
          />

          <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ filter: "drop-shadow(0 0 40px rgba(33,150,243,0.6)) drop-shadow(0 0 80px rgba(33,150,243,0.3))" }}
            >
              <Image
                src="/images/selum-logo-full.png"
                alt="Selum"
                width={200}
                height={200}
                priority
                style={{ objectFit: "contain", width: 180, height: "auto" }}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              style={{
                fontSize: 10, letterSpacing: "4px", textTransform: "uppercase",
                color: "rgba(176,190,197,0.6)",
                fontFamily: "var(--font-space), sans-serif",
              }}
            >
              Excelência em Alumínio
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 1 }}
              style={{
                width: 180, height: 2,
                background: "rgba(255,255,255,0.08)",
                borderRadius: 2, overflow: "hidden",
                marginTop: 8,
              }}
            >
              <div
                className="splash-bar-fill"
                style={{
                  height: "100%",
                  background: "linear-gradient(90deg, #1565C0, #00B4D8)",
                  borderRadius: 2,
                  width: 0,
                }}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, #1565C0 25%, #00B4D8 50%, #1565C0 75%, transparent)",
              transformOrigin: "right",
            }}
          />

        </motion.div>
      )}
    </AnimatePresence>
  );
}
