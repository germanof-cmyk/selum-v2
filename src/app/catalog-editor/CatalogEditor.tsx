"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, ExternalLink, FileUp, Plus, Search, Trash2, Upload } from "lucide-react";
import AssetPicker from "./AssetPicker";
import ProductForm, { type AssetTarget } from "./ProductForm";
import ProjectsEditor from "./ProjectsEditor";
import type { EditorProject } from "@/lib/projects";
import {
  STORAGE_KEY,
  emptyProduct,
  exportCatalog,
  importCatalog,
  newId,
  type EditorAsset,
  type EditorProduct,
} from "@/lib/catalog-editor";
import styles from "./catalog-editor.module.css";

const statusLabel = { draft: "Rascunho", review: "Revisar", approved: "Aprovado" };

function preservePublishedPlacement(raw: unknown, imported: EditorProduct[], published: EditorProduct[]) {
  const sources = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  return imported.map((product) => {
    const source = Array.isArray(raw)
      ? raw.find((item: { slug?: string }) => item.slug === product.slug)
      : sources[product.slug];
    if (source && typeof source === "object" && Object.hasOwn(source, "catalog")) return product;
    const existing = published.find((item) => item.slug === product.slug);
    return existing ? { ...product, catalog: existing.catalog } : product;
  });
}

function assignAsset(product: EditorProduct, target: AssetTarget, assetPath: string): EditorProduct {
  switch (target.kind) {
    case "hero":
      return { ...product, heroImages: [...product.heroImages, assetPath] };
    case "home":
      return { ...product, home: { ...product.home, image: assetPath } };
    case "catalogCard":
      return { ...product, catalog: { ...product.catalog, cardImage: assetPath } };
    case "catalogHero":
      return { ...product, catalog: { ...product.catalog, heroImage: assetPath } };
    case "modelIllustration":
      return { ...product, modelIllustration: assetPath };
    case "detail":
      return { ...product, images: { ...product.images, details: [...product.images.details, assetPath] } };
    case "application":
      return { ...product, application: { ...product.application, image: assetPath } };
    case "drawing":
      return { ...product, technicalDrawing: assetPath };
    case "file":
      return { ...product, technicalFile: assetPath };
    case "model":
      return {
        ...product,
        modelGroups: product.modelGroups.map((group, groupIndex) => groupIndex === target.groupIndex ? {
          ...group,
          models: group.models.map((model, index) => index === target.index ? { ...model, image: assetPath } : model),
        } : group),
      };
  }
}

export default function CatalogEditor({
  initialProducts,
  initialProjects,
  assets,
}: {
  initialProducts: EditorProduct[];
  initialProjects: EditorProject[];
  assets: EditorAsset[];
}) {
  const [area, setArea] = useState<"products" | "projects">("products");
  const [products, setProducts] = useState<EditorProduct[]>(initialProducts);
  const [selectedId, setSelectedId] = useState<string | null>(initialProducts[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [notice, setNotice] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [publishedSnapshot, setPublishedSnapshot] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [assetTarget, setAssetTarget] = useState<AssetTarget | null>(null);
  const importRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          const raw = JSON.parse(saved);
          const imported = preservePublishedPlacement(raw, importCatalog(raw, { draft: true }), initialProducts);
          setProducts(imported);
          setSelectedId(imported[0]?.id ?? null);
        }
      } catch {
        setStorageError("O rascunho local não pôde ser lido. Importe um backup ou limpe o rascunho.");
      }
      setLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [initialProducts]);

  useEffect(() => {
    if (!loaded || storageError) return;
    const snapshot = JSON.stringify(products);
    try {
      localStorage.setItem(STORAGE_KEY, snapshot);
      const timeout = setTimeout(() => setSavedSnapshot(snapshot), 0);
      return () => clearTimeout(timeout);
    } catch {
      const timeout = setTimeout(() =>
        setStorageError("Não foi possível salvar no navegador. Exporte um backup antes de continuar."), 0
      );
      return () => clearTimeout(timeout);
    }
  }, [products, loaded, storageError]);

  useEffect(() => {
    if (!loaded) return;
    const controller = new AbortController();
    fetch("/api/catalog-editor", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível consultar o catálogo publicado.");
        const result = await response.json();
        setPublishedSnapshot(JSON.stringify(result.catalog));
      })
      .catch((error) => {
        if (error.name !== "AbortError") setNotice(error.message);
      });
    return () => controller.abort();
  }, [loaded]);

  const selected = products.find((product) => product.id === selectedId) ?? null;
  const filtered = products.filter((product) =>
    `${product.name.pt} ${product.name.es} ${product.name.en} ${product.slug}`
      .toLocaleLowerCase("pt").includes(query.toLocaleLowerCase("pt"))
  );
  const hasDuplicateSlugs = new Set(products.map((product) => product.slug.trim())).size !== products.length;
  let currentCatalogSnapshot = "";
  try { currentCatalogSnapshot = JSON.stringify(exportCatalog(products)); } catch { /* Campos incompletos serão mostrados ao publicar. */ }
  const unpublished = publishedSnapshot !== null && currentCatalogSnapshot !== publishedSnapshot;
  const saved = loaded && !storageError && savedSnapshot === JSON.stringify(products);

  async function publish() {
    setPublishing(true);
    setNotice("");
    try {
      const response = await fetch("/api/catalog-editor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", products }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível publicar.");
      setPublishedSnapshot(JSON.stringify(result.catalog));
      setNotice("✓ Catálogo atualizado");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível publicar.");
    } finally { setPublishing(false); }
  }

  async function preview() {
    if (!selected?.slug.trim()) { setNotice("Selecione um produto com slug para visualizar."); return; }
    const tab = window.open("", "_blank");
    setPreviewing(true);
    setNotice("");
    try {
      const response = await fetch("/api/catalog-editor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview", products }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível visualizar.");
      const url = `/pt/catalog-preview/${encodeURIComponent(selected.slug)}?token=${encodeURIComponent(result.token)}`;
      if (tab) tab.location.href = url;
      else window.location.href = url;
    } catch (error) {
      tab?.close();
      setNotice(error instanceof Error ? error.message : "Não foi possível visualizar.");
    } finally { setPreviewing(false); }
  }

  function updateProduct(next: EditorProduct) {
    setProducts((current) => {
      const before = current.find((product) => product.id === next.id);
      return current.map((product) => {
        if (product.id === next.id) return next;
        if (before?.slug && before.slug !== next.slug) {
          return {
            ...product,
            relatedProducts: product.relatedProducts.map((slug) => slug === before.slug ? next.slug : slug),
          };
        }
        return product;
      });
    });
    setNotice("");
  }

  function addProduct() {
    const product = emptyProduct();
    let candidate = "novo-produto";
    let suffix = 2;
    while (products.some((item) => item.slug === candidate)) candidate = `novo-produto-${suffix++}`;
    product.slug = candidate;
    setProducts((current) => [...current, product]);
    setSelectedId(product.id);
    setQuery("");
  }

  function duplicateProduct(product: EditorProduct) {
    let candidate = `${product.slug || "produto"}-copia`;
    let suffix = 2;
    while (products.some((item) => item.slug === candidate)) candidate = `${product.slug || "produto"}-copia-${suffix++}`;
    const duplicate: EditorProduct = {
      ...structuredClone(product),
      id: newId(),
      slug: candidate,
      name: { ...product.name, pt: `${product.name.pt || "Produto"} (cópia)` },
      status: "draft",
      active: false,
      home: { featured: false, order: null, image: "" },
      catalog: { ...product.catalog, visible: false, order: null, heroFeatured: false, heroOrder: null },
    };
    setProducts((current) => [...current, duplicate]);
    setSelectedId(duplicate.id);
    setQuery("");
  }

  function deleteProduct(product: EditorProduct) {
    if (!window.confirm(`Excluir "${product.name.pt || product.slug}" do rascunho?`)) return;
    const remaining = products.filter((item) => item.id !== product.id).map((item) => ({
      ...item,
      relatedProducts: item.relatedProducts.filter((slug) => slug !== product.slug),
    }));
    setProducts(remaining);
    if (selectedId === product.id) setSelectedId(remaining[0]?.id ?? null);
  }

  function downloadCatalog() {
    try {
      const payload = exportCatalog(products);
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `selum-catalogo-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 0);
      setNotice("Catálogo exportado.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível exportar.");
    }
  }

  async function readImport(file: File | undefined) {
    if (!file) return;
    try {
      const raw = JSON.parse(await file.text());
      const imported = preservePublishedPlacement(raw, importCatalog(raw), initialProducts);
      if (!window.confirm(`Substituir o rascunho atual por ${imported.length} produto(s) do JSON?`)) return;
      setProducts(imported);
      setSelectedId(imported[0]?.id ?? null);
      setStorageError("");
      setNotice(`${imported.length} produto(s) importado(s).`);
      setQuery("");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "JSON inválido.");
    } finally {
      if (importRef.current) importRef.current.value = "";
    }
  }

  function clearDraft() {
    if (!window.confirm("Limpar todo o rascunho salvo neste navegador? Exporte um backup antes se precisar.")) return;
    setProducts([]);
    setSelectedId(null);
    setStorageError("");
    setNotice("Rascunho limpo.");
    localStorage.setItem(STORAGE_KEY, "[]");
  }

  function chooseAsset(assetPath: string) {
    if (!assetTarget || !selectedId) return;
    setProducts((current) => current.map((product) =>
      product.id === selectedId ? assignAsset(product, assetTarget, assetPath) : product
    ));
    setAssetTarget(null);
  }

  if (area === "projects") return <ProjectsEditor initialProjects={initialProjects} assets={assets} onSwitch={() => setArea("products")} />;

  return (
    <main className={styles.editor}>
      <nav className={styles.areaTabs} aria-label="Áreas do editor"><button className={styles.areaTabActive} type="button">Produtos</button><button type="button" onClick={() => setArea("projects")}>Projetos</button></nav>
      <header className={styles.topbar}>
        <div><span className={styles.brand}>SELUM / INTERNO</span><h1>Catalog Editor</h1><p>Rascunho local para organizar o catálogo. Nada é publicado automaticamente.</p></div>
        <div className={styles.toolbar}>
          <button type="button" className={styles.toolbarButton} disabled={!loaded || previewing || !selected} onClick={() => void preview()}><ExternalLink size={15} />{previewing ? "Abrindo..." : "Visualizar"}</button>
          <button type="button" className={styles.publishButton} disabled={!loaded || publishing || !unpublished} onClick={() => void publish()}><Upload size={15} />{publishing ? "Publicando..." : "Publicar alterações"}</button>
          <button type="button" className={styles.toolbarButton} onClick={() => importRef.current?.click()}><FileUp size={15} />Importar JSON</button>
          <input ref={importRef} type="file" accept=".json,application/json" hidden onChange={(event) => void readImport(event.target.files?.[0])} />
          <button type="button" className={styles.primaryButton} onClick={downloadCatalog}><Download size={15} />Exportar catálogo</button>
          <button type="button" className={styles.dangerButton} onClick={clearDraft}><Trash2 size={14} />Limpar rascunho</button>
        </div>
      </header>
      <div className={styles.statusBar}>
        <span className={saved ? styles.notice : undefined}>{storageError || (saved ? "● Salvo automaticamente" : loaded ? "Salvando rascunho..." : "Carregando rascunho...")}</span>
        {publishedSnapshot !== null && <span className={unpublished ? styles.warning : styles.notice}>{unpublished ? "Alterações não publicadas" : "✓ Catálogo atualizado"}</span>}
        {hasDuplicateSlugs && <span className={styles.warning}>Há slugs repetidos. Corrija antes de exportar.</span>}
        {notice && <span className={styles.notice}>{notice}</span>}
      </div>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}><h2>Produtos <span>{products.length}</span></h2><button type="button" className={styles.addButton} onClick={addProduct}><Plus size={15} />Novo produto</button></div>
          <label className={styles.search}><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome..." /></label>
          <div className={styles.productList}>
            {filtered.map((product) => (
              <div className={`${styles.productListItem} ${selectedId === product.id ? styles.productListItemActive : ""}`} key={product.id}>
                <button type="button" className={styles.productSelect} onClick={() => setSelectedId(product.id)}>
                  <strong>{product.name.pt || product.slug || "Sem nome"}</strong>
                  <span>{product.category || "Sem categoria"} · {statusLabel[product.status]}{!product.active ? " · Inativo" : ""}</span>
                </button>
                <div className={styles.productActions}>
                  <button type="button" title="Duplicar" aria-label={`Duplicar ${product.name.pt || product.slug}`} onClick={() => duplicateProduct(product)}><Copy size={13} /></button>
                  <button type="button" title="Excluir" aria-label={`Excluir ${product.name.pt || product.slug}`} onClick={() => deleteProduct(product)}><Trash2 size={13} /></button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <p className={styles.emptySidebar}>Nenhum produto encontrado.</p>}
          </div>
        </aside>
        <div className={styles.content}>
          {selected
            ? <ProductForm product={selected} products={products} onChange={updateProduct} onPickAsset={setAssetTarget} />
            : <div className={styles.emptyContent}><h2>Selecione ou crie um produto</h2><p>Os dados serão salvos automaticamente neste navegador.</p><button type="button" className={styles.primaryButton} onClick={addProduct}><Plus size={15} />Novo produto</button></div>}
        </div>
      </div>
      {assetTarget && (
        <AssetPicker
          assets={assets}
          title={assetTarget.kind === "file" ? "Selecionar PDF" : "Selecionar imagem"}
          type={assetTarget.kind === "file" ? "pdf" : "image"}
          onSelect={chooseAsset}
          onClose={() => setAssetTarget(null)}
        />
      )}
    </main>
  );
}
