export type ProductDetail = {
  tags: string[];
  stats: { label: string; value: string; unit: string }[];
  specs: { key: string; val: string; unit: string }[];
  variants: { name: string; sub: string; size: string }[];
  features: { icon: string; title: string; desc: string }[];
};

export const productDetails: Record<string, ProductDetail> = {
  "torre-box-truss": {
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
  "praticaveis": {
    tags: ["Liga 6061-T6", "NR-18", "Anti-derrapante", "Modular"],
    stats: [
      { label: "Carga máxima", value: "750", unit: "kg/m²" },
      { label: "Altura", value: "20", unit: "a 200cm" },
      { label: "Módulo padrão", value: "1×1", unit: "m" },
      { label: "Peso", value: "12", unit: "kg/m²" },
    ],
    specs: [
      { key: "Liga do alumínio", val: "6061-T6", unit: "Premium" },
      { key: "Carga máxima", val: "750", unit: "kg/m²" },
      { key: "Superfície", val: "Anti-derrapante", unit: "" },
      { key: "Módulo padrão", val: "1×1m", unit: "" },
      { key: "Acabamento", val: "Anodizado natural", unit: "" },
      { key: "Norma", val: "NR-18", unit: "· ABNT" },
    ],
    variants: [
      { name: "40cm", sub: "Baixo", size: "Altura 40cm" },
      { name: "80cm", sub: "Médio", size: "Altura 80cm" },
      { name: "120cm", sub: "Alto", size: "Altura 120cm" },
      { name: "Custom", sub: "Sob medida", size: "Altura especial" },
    ],
    features: [
      { icon: "⬡", title: "Alta resistência", desc: "Suporta até 750kg/m² com total segurança." },
      { icon: "◈", title: "Modular", desc: "Módulos de 1×1m combináveis em qualquer configuração." },
      { icon: "◎", title: "Anti-derrapante", desc: "Superfície tratada para máxima segurança." },
      { icon: "◉", title: "Certificado", desc: "Atende NR-18 e normas ABNT para eventos." },
    ],
  },
  "escadas": {
    tags: ["Liga 6061-T6", "NR-18", "Anti-derrapante", "Modular"],
    stats: [
      { label: "Carga máxima", value: "200", unit: "kg" },
      { label: "Largura", value: "80", unit: "cm" },
      { label: "Degraus", value: "3", unit: "a 12" },
      { label: "Peso", value: "8", unit: "kg/m" },
    ],
    specs: [
      { key: "Liga do alumínio", val: "6061-T6", unit: "Premium" },
      { key: "Carga máxima", val: "200", unit: "kg" },
      { key: "Largura padrão", val: "80cm", unit: "" },
      { key: "Degraus", val: "3 a 12", unit: "unidades" },
      { key: "Acabamento", val: "Antiderrapante", unit: "" },
      { key: "Norma", val: "NR-18", unit: "· ABNT" },
    ],
    variants: [
      { name: "3 degraus", sub: "Compacta", size: "Altura ~60cm" },
      { name: "6 degraus", sub: "Média", size: "Altura ~120cm" },
      { name: "9 degraus", sub: "Alta", size: "Altura ~180cm" },
      { name: "Custom", sub: "Sob medida", size: "Altura especial" },
    ],
    features: [
      { icon: "⬡", title: "Alta resistência", desc: "Suporta até 200kg com total segurança estrutural." },
      { icon: "◈", title: "Modular", desc: "Configurável em diferentes alturas conforme necessidade." },
      { icon: "◎", title: "Anti-derrapante", desc: "Degraus tratados para máxima segurança em eventos." },
      { icon: "◉", title: "Certificado", desc: "Atende NR-18 e normas ABNT para eventos." },
    ],
  },
};


