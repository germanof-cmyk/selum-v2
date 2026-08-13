import { supabase, type Produto } from "@/lib/supabase";

/* ─── STATIC FALLBACK ────────────────────────────────────────────────────── */
// Used when Supabase is not configured or the table is empty.

export const STATIC_PRODUCTS: Produto[] = [
  {
    id: "box-truss",
    slug: "box-truss",
    name: "Box Truss",
    category: "Box Truss",
    tag: "Q-15 · Q-30 · Q-50",
    description:
      "Linhas Q-15, Q-30 e Q-50. Leveza e resistência para qualquer escala de evento.",
  },
  {
    id: "praticaveis",
    slug: "praticaveis",
    name: "Praticáveis",
    category: "Praticáveis",
    tag: "Palcos & Pisos",
    description:
      "Palcos e pisos elevados com resistência estrutural e montagem ágil.",
  },
  {
    id: "bases-cubos",
    slug: "bases-cubos",
    name: "Bases & Cubos",
    category: "Bases & Cubos",
    tag: "Estrutural",
    description:
      "Fundação sólida para todas as configurações de estrutura.",
  },
  {
    id: "escadas",
    slug: "escadas",
    name: "Escadas",
    category: "Escadas",
    tag: "Acesso & Segurança",
    description:
      "Escadas modulares em alumínio para acesso seguro a palcos e estruturas elevadas.",
  },
];

/* ─── LOCAL IMAGE MAP ────────────────────────────────────────────────────── */
// Maps slug → static image path for cards on the listing page.

export const PRODUCT_IMAGES: Record<string, string> = {
  "box-truss":   "/images/products/box-truss.png",
  "praticaveis": "/images/products/praticaveis.png",
  "bases-cubos": "/images/products/base-cubos.png",
  "escadas":     "/images/products/escadas.png",
};

/* ─── getProducts ────────────────────────────────────────────────────────── */

export async function getProducts(): Promise<{
  products: Produto[];
  fromDb: boolean;
}> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return { products: STATIC_PRODUCTS, fromDb: false };
  }

  const { data, error } = await supabase
    .from("products")
    .select("id, slug, name, category, tag, description")
    .eq("published", true)
    .order("ordem", { ascending: true });

  if (error || !data || data.length === 0) {
    return { products: STATIC_PRODUCTS, fromDb: false };
  }

  return { products: data as Produto[], fromDb: true };
}
