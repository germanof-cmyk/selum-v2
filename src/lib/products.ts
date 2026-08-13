export const products = {
  "torre-box-truss": {
    slug: "torre-box-truss",
    name: "Torre Box Truss",
    category: "Linha Estrutural Premium",
    image: "/images/products/box-truss.png",
    tagline: "Estrutura modular de alumínio de alta resistência para suporte de iluminação, som e cenografia. Fabricado em Joinville, SC.",
    tags: ["Liga 6061-T6", "NR-18", "Fabricação própria", "Q-15 ao Q-50"],
    stats: [
      { label: "Peso por metro", value: "3,2", unit: "kg/m" },
      { label: "Carga máxima", value: "800", unit: "kg" },
      { label: "Tubo principal", value: "48", unit: "mm Ø" },
      { label: "Comprimentos", value: "0,5", unit: "a 3m" },
    ],
    specs: [
      { key: "Liga do alumínio", val: "6061-T6", unit: "Premium" },
      { key: "Tubo principal", val: "48mm", unit: "Ø" },
      { key: "Peso por metro", val: "3,2", unit: "kg/m" },
      { key: "Carga máxima", val: "800", unit: "kg" },
      { key: "Acabamento", val: "Anodizado natural", unit: "" },
      { key: "Norma", val: "NR-18", unit: "· ABNT" },
    ],
    variants: [
      { name: "Q-15", sub: "Linha leve", size: "15 × 15cm" },
      { name: "Q-20", sub: "Linha média", size: "20 × 20cm" },
      { name: "Q-30", sub: "Linha pesada", size: "30 × 30cm" },
      { name: "Q-50", sub: "Heavy duty", size: "50 × 50cm" },
    ],
    features: [
      { icon: "⬡", title: "Alta resistência", desc: "Liga 6061-T6 para máxima resistência com leveza incomparável." },
      { icon: "◈", title: "Modular", desc: "Peças intercambiáveis que permitem infinitas configurações." },
      { icon: "◎", title: "Fácil montagem", desc: "Sistema de encaixe rápido sem ferramentas especiais." },
      { icon: "◉", title: "Certificado", desc: "Atende NR-18 e normas ABNT para eventos." },
    ],
  },
  "cubos": {
    slug: "cubos",
    name: "Cubos",
    category: "Linha Estrutural",
    image: "/images/products/cubo.png",
    tagline: "Cubos de alumínio modulares para composição de cenografia e suporte estrutural em eventos de todos os portes.",
    tags: ["Liga 6061-T6", "NR-18", "Modular", "Sob medida"],
    stats: [
      { label: "Peso unitário", value: "4,8", unit: "kg" },
      { label: "Carga máxima", value: "500", unit: "kg" },
      { label: "Espessura", value: "2,5", unit: "mm" },
      { label: "Tamanhos", value: "50", unit: "a 100cm" },
    ],
    specs: [
      { key: "Liga do alumínio", val: "6061-T6", unit: "Premium" },
      { key: "Espessura da parede", val: "2,5mm", unit: "" },
      { key: "Peso unitário", val: "4,8", unit: "kg" },
      { key: "Carga máxima", val: "500", unit: "kg" },
      { key: "Acabamento", val: "Anodizado natural", unit: "" },
      { key: "Norma", val: "NR-18", unit: "· ABNT" },
    ],
    variants: [
      { name: "50cm", sub: "Compacto", size: "50 × 50 × 50cm" },
      { name: "75cm", sub: "Médio", size: "75 × 75 × 75cm" },
      { name: "100cm", sub: "Grande", size: "100 × 100 × 100cm" },
      { name: "Custom", sub: "Sob medida", size: "Dimensões especiais" },
    ],
    features: [
      { icon: "⬡", title: "Alta resistência", desc: "Liga 6061-T6 para máxima resistência com leveza incomparável." },
      { icon: "◈", title: "Versátil", desc: "Combina com Box Truss e outros acessórios da linha Selum." },
      { icon: "◎", title: "Empilhável", desc: "Design que permite empilhamento seguro e transporte eficiente." },
      { icon: "◉", title: "Certificado", desc: "Atende NR-18 e normas ABNT para eventos." },
    ],
  },
};

export type ProductSlug = keyof typeof products;