const items = [
  "Box Truss", "Palcos Profissionais", "Praticáveis",
  "Sleeves & Conectores", "Gradil", "Bases & Cubos",
  "Dobradiças", "Excelência em Alumínio",
];

export default function MarqueeStrip() {
  const doubled = [...items, ...items];
  return (
    <div style={{
      overflow: "hidden",
      background: "linear-gradient(90deg, #1565C0, #1976D2, #1565C0)",
      borderTop: "1px solid rgba(255,255,255,0.15)",
      borderBottom: "1px solid rgba(255,255,255,0.15)",
      padding: "14px 0",
    }}>
      <div style={{
        display: "flex",
        animation: "marquee 22s linear infinite",
        whiteSpace: "nowrap",
        width: "max-content",
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.9)",
              padding: "0 28px",
              fontFamily: "var(--font-barlow), sans-serif",
            }}>
              {item}
            </span>
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 8 }}>◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
