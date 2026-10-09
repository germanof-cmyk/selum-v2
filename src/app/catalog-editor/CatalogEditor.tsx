"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Download, FileUp, FolderKanban, GripVertical, Images, Mail, Menu, Package, Plus, Search, Trash2, X } from "lucide-react";
import AssetPicker from "./AssetPicker";
import AboutImagesEditor from "./AboutImagesEditor";
import ContactImagesEditor from "./ContactImagesEditor";
import CategoriesManager from "./CategoriesManager";
import ProductForm, { type AssetTarget } from "./ProductForm";
import ProjectsEditor from "./ProjectsEditor";
import { useManagedCategories } from "./useManagedCategories";
import type { CategoryRegistry, ContentCategory } from "@/lib/content-categories";
import type { EditorProject } from "@/lib/projects";
import type { AboutPageImages } from "@/lib/about-page-images";
import type { ContactPageImages } from "@/lib/contact-page-images";
import {
  emptyProduct,
  exportCatalog,
  importCatalog,
  newId,
  uniqueSlug,
  type EditorAsset,
  type EditorProduct,
} from "@/lib/catalog-editor";
import styles from "./catalog-editor.module.css";

const statusLabel = { draft: "Rascunho", review: "Revisar", approved: "Publicado" };

function migratePublishedStatuses(products: EditorProduct[], published: EditorProduct[]) {
  const visible = new Set(published.filter((item) => item.active).map((item) => item.slug));
  return products.map((item) => visible.has(item.slug) && item.status !== "approved" ? { ...item, status: "approved" as const } : item);
}

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
    case "heroMain":
      return { ...product, heroImages: product.heroImages.length ? [assetPath, ...product.heroImages.slice(1)] : [assetPath] };
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
  initialCategories,
  initialAboutImages,
  initialContactImages,
  assets,
}: {
  initialProducts: EditorProduct[];
  initialProjects: EditorProject[];
  initialCategories: CategoryRegistry;
  initialAboutImages: AboutPageImages;
  initialContactImages: ContactPageImages;
  assets: EditorAsset[];
}) {
  const categoryManager = useManagedCategories("products", initialCategories.products);
  const { categories: productCategories, setCategories: setProductCategories, publishCategories: publishProductCategories } = categoryManager;
  const [productCategoriesOpen, setProductCategoriesOpen] = useState(false);
  const [area, setArea] = useState<"home" | "products" | "projects" | "about" | "contact">("home");
  const [products, setProducts] = useState<EditorProduct[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [loadError, setLoadError] = useState("");
  const [notice, setNotice] = useState("");
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [publishedSnapshot, setPublishedSnapshot] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [assetTarget, setAssetTarget] = useState<AssetTarget | null>(null);
  const [uploadedAssets, setUploadedAssets] = useState<EditorAsset[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggedId = useRef<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/catalog-editor", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.products)) throw new Error(result.error || "NÃ£o foi possÃ­vel carregar os produtos do Supabase.");
        const authoritative = migratePublishedStatuses(result.products, result.products);
        setProducts(authoritative);
        setSelectedId(authoritative[0]?.id ?? null);
        setLoaded(true);
      })
      .catch((error) => { if (error.name !== "AbortError") setLoadError(error.message || "NÃ£o foi possÃ­vel carregar os produtos do Supabase."); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!loaded || storageError) return;
    const snapshot = JSON.stringify(products);
    const timeout = setTimeout(() => {
      saveTimer.current = null;
      pendingSave.current = pendingSave.current.catch(() => {}).then(async () => {
        const response = await fetch("/api/catalog-editor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", products }) });
        if (!response.ok) throw new Error((await response.json()).error);
        setSavedSnapshot(snapshot); setStorageError("");
      }).catch((error) => setStorageError(error instanceof Error ? error.message : "Não foi possível salvar o rascunho."));
    }, 700);
    saveTimer.current = timeout;
    return () => clearTimeout(timeout);
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
  try { currentCatalogSnapshot = JSON.stringify(exportCatalog(products.filter((item) => item.status === "approved" && item.active))); } catch { /* Campos incompletos serão mostrados ao publicar. */ }
  const unpublished = publishedSnapshot !== null && currentCatalogSnapshot !== publishedSnapshot;
  const saved = loaded && !storageError && savedSnapshot === JSON.stringify(products);
  const productCategoryUsage = (category: ContentCategory) => products.filter((product) => product.category === category.slug).length;

  async function publish(productToApprove: EditorProduct) {
    setPublishing(true);
    setNotice("");
    try {
      await pendingSave.current;
      if (!productCategories.some((category) => category.slug === productToApprove.category && category.name.pt.trim())) {
        throw new Error("Escolha uma categoria antes de publicar o produto.");
      }
      await publishProductCategories();
      const nextProducts = products.map((item) => item.id === productToApprove.id ? { ...item, status: "approved" as const, active: true } : item);
      const response = await fetch("/api/catalog-editor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", products: nextProducts, targetId: productToApprove.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível publicar.");
      setProducts(nextProducts);
      setPublishedSnapshot(JSON.stringify(result.catalog));
      setNotice("✓ Produto publicado e catálogo atualizado.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível publicar.");
    } finally { setPublishing(false); }
  }

  async function preview() {
    if (!selected?.slug.trim()) { setNotice("Dê um nome ao produto para visualizar."); return; }
    const tab = window.open("", "_blank");
    setPreviewing(true);
    setNotice("");
    try {
      const response = await fetch("/api/catalog-editor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "preview", products, categories: productCategories }),
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
    product.category = productCategories.find((category) => category.active && category.name.pt.trim())?.slug || "";
    product.slug = uniqueSlug("", products.map((item) => item.slug), "novo-produto");
    setProducts((current) => [...current, product]);
    setSelectedId(product.id);
    setQuery("");
    setArea("products");
    setSidebarOpen(false);
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
    setSidebarOpen(false);
  }

  async function deleteProduct(product: EditorProduct) {
    if (!window.confirm(`Excluir "${product.name.pt || product.slug}" do Supabase e do site?`)) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = null;
    setNotice("");
    try {
      await pendingSave.current;
      const response = await fetch("/api/catalog-editor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", targetId: product.id, slug: product.slug }),
      });
      const result = await response.json();
      if (!response.ok || result.deleted !== true || result.deletedRows !== 1 || result.deletedId !== product.id || result.deletedSlug !== product.slug) {
        throw new Error(result.error || "O Supabase não confirmou a exclusão deste produto.");
      }
      const remaining = products.filter((item) => item.id !== product.id).map((item) => ({
        ...item,
        relatedProducts: item.relatedProducts.filter((slug) => slug !== product.slug),
      }));
      const refreshed = Array.isArray(result.products) ? result.products as EditorProduct[] : remaining;
      setProducts(refreshed);
      setPublishedSnapshot(JSON.stringify(result.catalog));
      if (selectedId === product.id) setSelectedId(refreshed.find((item) => item.id !== product.id)?.id ?? null);
      setNotice("Produto excluído do Supabase.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível excluir o produto.");
    }
  }

  function reorderProducts(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    setProducts((current) => {
      const from = current.findIndex((item) => item.id === sourceId);
      const to = current.findIndex((item) => item.id === targetId);
      if (from < 0 || to < 0) return current;
      const ordered = [...current];
      const [moved] = ordered.splice(from, 1);
      ordered.splice(to, 0, moved);
      let home = 0, catalog = 0, hero = 0;
      return ordered.map((item) => ({ ...item,
        home: { ...item.home, order: item.home.featured ? ++home : item.home.order },
        catalog: { ...item.catalog, order: item.catalog.visible ? ++catalog : item.catalog.order, heroOrder: item.catalog.heroFeatured ? ++hero : item.catalog.heroOrder },
      }));
    });
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
      const imported = migratePublishedStatuses(preservePublishedPlacement(raw, importCatalog(raw), initialProducts), initialProducts);
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
    if (!window.confirm("Remover todos os produtos do editor? Exporte um backup antes se precisar.")) return;
    setProducts([]);
    setSelectedId(null);
    setStorageError("");
    setNotice("Produtos removidos do editor. Os itens publicados continuam visíveis até uma ação de publicação.");
  }

  function chooseAsset(assetPath: string) {
    if (!assetTarget || !selectedId) return;
    setProducts((current) => current.map((product) =>
      product.id === selectedId ? assignAsset(product, assetTarget, assetPath) : product
    ));
    setAssetTarget(null);
  }

  async function uploadProductAsset(file: File | undefined) {
    if (!file || !assetTarget) return;
    const form = new FormData(); form.set("file", file);
    try {
      const response = await fetch("/api/catalog-editor/assets", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setUploadedAssets((current) => [...current, { path: result.path, name: result.name, folder: "products", type: "image" }]);
      chooseAsset(result.path);
      setNotice("✓ Imagem enviada.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível enviar a imagem."); }
    finally { if (uploadRef.current) uploadRef.current.value = ""; }
  }

  if (area === "about") return <AboutImagesEditor initialImages={initialAboutImages} initialAssets={assets} onBack={() => setArea("home")} />;
  if (area === "contact") return <ContactImagesEditor initialImages={initialContactImages} initialAssets={assets} onBack={() => setArea("home")} />;

  if (area === "projects") return <ProjectsEditor initialProjects={initialProjects} initialCategories={initialCategories.projects} assets={assets} onSwitch={() => setArea("products")} />;

  if (!loaded) return <main className={styles.editor}><p role="status">{loadError || "Carregando produtos..."}</p></main>;

  if (area === "home") return <main className={`${styles.editor} ${styles.dashboard}`}>
    <header className={styles.dashboardHeader}><span className={styles.brand}>SELUM / INTERNO</span><h1>Conteúdo do site</h1><p>Escolha o que deseja cadastrar ou atualizar.</p></header>
    <div className={styles.dashboardGrid}>
      <section className={styles.dashboardChoice}><Package size={28} strokeWidth={1.6} /><h2>Produtos</h2><p>Cadastre produtos, modelos, imagens e informações técnicas.</p><div><button type="button" className={styles.toolbarButton} onClick={() => setArea("products")}>Ver produtos</button><button type="button" className={styles.primaryButton} onClick={addProduct}><Plus size={16} />Novo produto</button></div></section>
      <section className={styles.dashboardChoice}><FolderKanban size={28} strokeWidth={1.6} /><h2>Projetos / Eventos</h2><p>Cadastre projetos onde componentes Selum estiveram presentes.</p><div><button type="button" className={styles.toolbarButton} onClick={() => setArea("projects")}>Ver projetos</button><button type="button" className={styles.primaryButton} onClick={() => { setArea("projects"); sessionStorage.setItem("selum.new-project", "1"); }}><Plus size={16} />Novo projeto</button></div></section>
      <section className={styles.dashboardChoice}><Images size={28} strokeWidth={1.6} /><h2>Quem Somos</h2><p>Atualize as imagens usadas na página institucional.</p><div><button type="button" className={styles.primaryButton} onClick={() => setArea("about")}>Gerenciar imagens</button></div></section>
      <section className={styles.dashboardChoice}><Mail size={28} strokeWidth={1.6} /><h2>Contato</h2><p>Atualize as imagens usadas na página de contato.</p><div><button type="button" className={styles.primaryButton} onClick={() => setArea("contact")}>Gerenciar imagens</button></div></section>
    </div>
  </main>;

  return (
    <main className={styles.editor}>
      <header className={styles.topbar}>
        <div className={styles.topbarTitle}><button type="button" className={styles.mobileListButton} onClick={() => setSidebarOpen(true)}><Menu size={17} />Produtos</button><span className={styles.brand}>PRODUTOS / {productCategoriesOpen ? "CATEGORIAS" : "EDIÇÃO"}</span><h1>{productCategoriesOpen ? "Categorias" : selected?.name.pt || "Novo produto"}</h1></div>
        <div className={styles.toolbar}><span className={(productCategoriesOpen ? categoryManager.saved : saved) ? styles.notice : styles.warning}>{productCategoriesOpen ? categoryManager.saved ? "✓ Salvo automaticamente" : "Salvando..." : storageError || (saved ? "✓ Salvo automaticamente" : loaded ? "Salvando..." : "Carregando...")}</span>{productCategoriesOpen ? <button type="button" className={styles.publishButton} disabled={categoryManager.publishing} onClick={() => void publishProductCategories().catch(() => {})}>Publicar categorias</button> : <><button type="button" className={styles.toolbarButton} disabled={!selected || previewing} onClick={() => void preview()}>{previewing ? "Abrindo..." : "Visualizar"}</button><button type="button" className={styles.publishButton} disabled={!selected?.name.pt.trim() || !selected.heroImages[0] || publishing} onClick={() => selected && void publish(selected)}>{publishing ? "Publicando..." : "Publicar"}</button></>}</div>
      </header>
      <div className={styles.statusBar}>
        <span className={(productCategoriesOpen ? categoryManager.saved : saved) ? styles.notice : undefined}>{productCategoriesOpen ? categoryManager.saved ? "✓ Salvo automaticamente" : "Salvando..." : storageError || (saved ? "✓ Salvo automaticamente" : loaded ? "Salvando..." : "Carregando...")}</span>
        {productCategoriesOpen && <span className={categoryManager.unpublished ? styles.warning : styles.notice}>{categoryManager.unpublished ? "Alterações não publicadas" : "✓ Categorias atualizadas"}</span>}
        {!productCategoriesOpen && <>
        {publishedSnapshot !== null && <span className={unpublished ? styles.warning : styles.notice}>{unpublished ? "Alterações não publicadas" : "✓ Catálogo atualizado"}</span>}
        {selected && !selected.name.pt.trim() && <span className={styles.warning}>⚠ Falta o nome do produto.</span>}
        {selected && selected.name.pt.trim() && !selected.heroImages[0] && <span className={styles.warning}>⚠ Falta imagem principal.</span>}
        {hasDuplicateSlugs && <span className={styles.warning}>Há nomes de página repetidos. Confira as opções avançadas.</span>}
        {notice && <span className={styles.notice}>{notice}</span>}
        </>}
      </div>
      <div className={styles.workspace}>
        {sidebarOpen && <button type="button" className={styles.sidebarBackdrop} aria-label="Fechar lista" onClick={() => setSidebarOpen(false)} />}
        <aside className={styles.sidebar + (sidebarOpen ? " " + styles.sidebarOpen : "")}>
          <div className={styles.sidebarBrand}><span>SELUM <small>/ INTERNO</small></span><button type="button" className={styles.sidebarClose} aria-label="Fechar menu" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
          <nav className={styles.sidebarNav} aria-label="Conteúdo"><span>CONTEÚDO</span><button type="button" className={!productCategoriesOpen ? styles.sidebarNavActive : ""} onClick={() => { setProductCategoriesOpen(false); setSidebarOpen(false); }}><Package size={17} />Produtos</button><button type="button" className={productCategoriesOpen ? styles.sidebarNavActive : styles.sidebarSubnav} onClick={() => { setProductCategoriesOpen(true); setSidebarOpen(false); }}>Categorias</button><button type="button" onClick={() => { setArea("projects"); setSidebarOpen(false); }}><FolderKanban size={17} />Projetos / Eventos</button></nav>
          {!productCategoriesOpen && <>
          <div className={styles.sidebarHeader}><h2>Produtos <span>{products.length}</span></h2><button type="button" className={styles.sidebarClose} aria-label="Fechar lista" onClick={() => setSidebarOpen(false)}><X size={18} /></button><button type="button" className={styles.addButton} onClick={addProduct}><Plus size={15} />Novo produto</button></div>
          <label className={styles.search}><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar produtos..." /></label>
          <p className={styles.reorderHint}>Arraste para mudar a ordem de exibição.</p>
          <div className={styles.productList}>
            {filtered.map((product) => <div className={styles.productListItem + (selectedId === product.id ? " " + styles.productListItemActive : "")} key={product.id} draggable onDragStart={() => { draggedId.current = product.id; }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (draggedId.current) reorderProducts(draggedId.current, product.id); draggedId.current = null; }}>
              <GripVertical className={styles.listGrip} size={15} aria-hidden="true" />
              <button type="button" className={styles.productSelect} onClick={() => { setSelectedId(product.id); setSidebarOpen(false); }}><strong>{product.name.pt || "Novo produto"}</strong><span className={product.status === "approved" ? styles.badgePublished : styles.badgeDraft}>{!product.name.pt || !product.heroImages[0] ? "Incompleto" : statusLabel[product.status]}</span></button>
              <div className={styles.productActions}><button type="button" title="Duplicar" aria-label={"Duplicar " + (product.name.pt || "produto")} onClick={() => duplicateProduct(product)}><Copy size={13} /></button><button type="button" title="Excluir" aria-label={"Excluir " + (product.name.pt || "produto")} onClick={() => deleteProduct(product)}><Trash2 size={13} /></button></div>
            </div>)}
            {filtered.length === 0 && <p className={styles.emptySidebar}>Nenhum produto encontrado.</p>}
          </div>
          </>}
        </aside>
        <div className={styles.content}>
          {productCategoriesOpen ? <CategoriesManager scope="products" categories={productCategories} onChange={setProductCategories} onPublish={() => void publishProductCategories().catch(() => {})} onBack={() => setProductCategoriesOpen(false)} usageCount={productCategoryUsage} saved={categoryManager.saved} publishing={categoryManager.publishing} notice={categoryManager.notice} /> : selected ? <ProductForm key={selected.id} product={selected} products={products} categories={productCategories} onChange={updateProduct} onPickAsset={setAssetTarget} onPublish={(product) => void publish(product)} onPreview={() => void preview()} onSaveDraft={() => setNotice("✓ O rascunho é salvo automaticamente.")} onManageCategories={() => setProductCategoriesOpen(true)} publishing={publishing} previewing={previewing} />
            : <div className={styles.emptyContent}><h2>Selecione ou crie um produto</h2><p>Você poderá preencher tudo em etapas.</p><button type="button" className={styles.primaryButton} onClick={addProduct}><Plus size={15} />Novo produto</button></div>}
          {!productCategoriesOpen && <details className={styles.adminTools}><summary>Ferramentas avançadas de backup</summary><p>Use estas opções apenas para migração ou recuperação de dados.</p><div className={styles.toolbar}><button type="button" className={styles.toolbarButton} onClick={() => importRef.current?.click()}><FileUp size={15} />Importar backup</button><input ref={importRef} type="file" accept=".json,application/json" hidden onChange={(event) => void readImport(event.target.files?.[0])} /><button type="button" className={styles.toolbarButton} onClick={downloadCatalog}><Download size={15} />Baixar backup</button><button type="button" className={styles.dangerButton} onClick={clearDraft}><Trash2 size={14} />Remover do editor</button></div></details>}
        </div>
      </div>
      {assetTarget && <><AssetPicker assets={[...assets, ...uploadedAssets]} title={assetTarget.kind === "file" ? "Selecionar PDF" : "Selecionar imagem"} type={assetTarget.kind === "file" ? "pdf" : "image"} onSelect={chooseAsset} onUpload={assetTarget.kind !== "file" ? () => uploadRef.current?.click() : undefined} onClose={() => setAssetTarget(null)} /><input ref={uploadRef} hidden type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => void uploadProductAsset(event.target.files?.[0])} /></>}
    </main>
  );
}
