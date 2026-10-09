"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, FolderKanban, GripVertical, ImagePlus, Menu, Package, Plus, Search, Trash2, Upload, X } from "lucide-react";
import AssetPicker from "./AssetPicker";
import CategoriesManager from "./CategoriesManager";
import { useManagedCategories } from "./useManagedCategories";
import type { EditorAsset, LocalizedText } from "@/lib/catalog-editor";
import type { ContentCategory } from "@/lib/content-categories";
import { slugify, uniqueSlug } from "@/lib/catalog-editor";
import { emptyProject, exportProjects, UNVERIFIED_PROJECT_IMAGES, type EditorProject } from "@/lib/projects";
import styles from "./catalog-editor.module.css";

function moveItem<T>(items: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || to >= items.length) return items;
  const copy = [...items];
  const [moved] = copy.splice(from, 1);
  copy.splice(to, 0, moved);
  return copy;
}

function TranslationFields({ label, value, onChange }: { label: string; value: LocalizedText; onChange: (next: LocalizedText) => void }) {
  return <div className={styles.translationGroup}><label className={styles.field}><span>{label}</span><input value={value.pt} onChange={(event) => onChange({ ...value, pt: event.target.value })} /></label><details className={styles.translationDetails}><summary>Adicionar traduções <ChevronDown size={14} /></summary><div className={styles.fieldGrid}><label className={styles.field}><span>Inglês</span><input value={value.en} onChange={(event) => onChange({ ...value, en: event.target.value })} /></label><label className={styles.field}><span>Espanhol</span><input value={value.es} onChange={(event) => onChange({ ...value, es: event.target.value })} /></label></div></details></div>;
}

export default function ProjectsEditor({ initialProjects, initialCategories, assets, onSwitch }: {
  initialProjects: EditorProject[]; initialCategories: ContentCategory[]; assets: EditorAsset[]; onSwitch: () => void;
}) {
  const categoryManager = useManagedCategories("projects", initialCategories);
  const { categories, setCategories, publishCategories } = categoryManager;
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState<string | null>(initialProjects[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [notice, setNotice] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishedSnapshot, setPublishedSnapshot] = useState("");
  const [assetTarget, setAssetTarget] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState<EditorAsset[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);
  const pendingSave = useRef<Promise<void>>(Promise.resolve());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draggedId = useRef<string | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let restored = initialProjects;
      restored = restored.map((project) => {
        if (project.categoryId) return project;
        const category = initialCategories.find((item) => item.name.pt.trim() === project.category.pt.trim());
        return category ? { ...project, categoryId: category.id } : project;
      });
      if (sessionStorage.getItem("selum.new-project") === "1") {
        sessionStorage.removeItem("selum.new-project");
        const next = emptyProject();
        next.slug = uniqueSlug("", restored.map((item) => item.slug), "novo-projeto");
        restored = [...restored, next];
        setSelectedId(next.id);
      } else setSelectedId(restored[0]?.id ?? null);
      setProjects(restored);
      setLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [initialProjects, initialCategories]);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/catalog-editor/projects", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível consultar os projetos publicados.");
        const result = await response.json();
        setPublishedSnapshot(JSON.stringify(result.published));
      })
      .catch((error) => { if (error.name !== "AbortError") setNotice(error.message); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const snapshot = JSON.stringify(projects);
    const timeout = setTimeout(() => {
      saveTimer.current = null;
      pendingSave.current = pendingSave.current.catch(() => {}).then(async () => {
        const response = await fetch("/api/catalog-editor/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", projects }) });
        if (!response.ok) throw new Error((await response.json()).error);
        setSavedSnapshot(snapshot);
      }).catch((error) => setNotice(error instanceof Error ? error.message : "Não foi possível salvar o rascunho."));
    }, 700);
    saveTimer.current = timeout;
    return () => clearTimeout(timeout);
  }, [projects, loaded]);

  const selected = projects.find((project) => project.id === selectedId) ?? null;
  const selectedCategory = selected ? categories.find((category) => category.id === selected.categoryId ||
    (!selected.categoryId && category.name.pt.trim() === selected.category.pt.trim())) : null;
  const filtered = projects.filter((project) => (project.name.pt + " " + project.slug).toLocaleLowerCase("pt").includes(query.toLocaleLowerCase("pt")));
  let currentSnapshot = "";
  try { currentSnapshot = JSON.stringify(exportProjects(projects.filter((item) => item.status === "approved" && item.active))); } catch { /* O editor mostra uma mensagem humana ao publicar. */ }
  const unpublished = currentSnapshot !== publishedSnapshot;
  const saved = loaded && savedSnapshot === JSON.stringify(projects);
  const issues = selected ? [
    !selected.name.pt.trim() ? "Falta o nome do evento." : "",
    !selectedCategory?.name.pt.trim() ? "Escolha uma categoria." : "",
    !selected.coverImage.trim() ? "Falta uma imagem principal." : "",
    selected.coverImage && !selected.coverImageValidated ? "Confirme que a imagem pertence a este evento." : "",
  ].filter(Boolean) : [];

  function update(next: EditorProject) { setProjects((current) => current.map((item) => item.id === next.id ? next : item)); setNotice(""); }
  function updateName(next: LocalizedText) {
    if (!selected) return;
    const used = projects.filter((item) => item.id !== selected.id).map((item) => item.slug);
    const auto = !selected.name.pt || selected.slug === slugify(selected.name.pt) || selected.slug.startsWith("novo-projeto");
    update({ ...selected, name: next, slug: auto ? uniqueSlug(next.pt, used, "novo-projeto") : selected.slug });
  }
  function changeCategory(categoryId: string) {
    if (!selected) return;
    const category = categories.find((item) => item.id === categoryId);
    update({ ...selected, categoryId, category: category?.name ?? { pt: "", es: "", en: "" } });
  }
  function categoryUsage(category: ContentCategory) {
    return projects.filter((project) => project.categoryId === category.id ||
      (!project.categoryId && project.category.pt.trim() === category.name.pt.trim())).length;
  }
  function add() {
    const next = emptyProject();
    next.slug = uniqueSlug("", projects.map((item) => item.slug), "novo-projeto");
    setProjects((current) => [...current, next]);
    setSelectedId(next.id); setQuery(""); setSidebarOpen(false);
  }
  async function remove(project: EditorProject) {
    if (!window.confirm("Excluir “" + (project.name.pt || "Novo projeto") + "” do Supabase e do site?")) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = null;
    setNotice("");
    try {
      await pendingSave.current;
      const response = await fetch("/api/catalog-editor/projects", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", targetId: project.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível excluir o projeto.");
      const remaining = projects.filter((item) => item.id !== project.id);
      const refreshed = Array.isArray(result.projects) ? result.projects as EditorProject[] : remaining;
      setProjects(refreshed);
      setPublishedSnapshot(JSON.stringify(result.published));
      if (selectedId === project.id) setSelectedId(refreshed.find((item) => item.id !== project.id)?.id ?? null);
      setNotice("Projeto excluído do Supabase.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível excluir o projeto.");
    }
  }
  function reorder(sourceId: string, targetId: string) {
    const from = projects.findIndex((item) => item.id === sourceId);
    const to = projects.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0 || from === to) return;
    const ordered = moveItem(projects, from, to);
    let home = 0;
    setProjects(ordered.map((item, index) => ({ ...item, projectsOrder: index + 1, homeOrder: item.showOnHome ? ++home : item.homeOrder })));
  }
  async function publish() {
    if (!selected || issues.length) { setNotice(issues[0] || "Selecione um projeto."); return; }
    setPublishing(true); setNotice("");
    try {
      await pendingSave.current;
      await publishCategories();
      const next = projects.map((item) => item.id === selected.id ? { ...item, status: "approved" as const } : item);
      const response = await fetch("/api/catalog-editor/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "publish", projects: next, targetId: selected.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível publicar projetos.");
      setProjects(next);
      setPublishedSnapshot(JSON.stringify(result.published));
      setNotice("✓ Projeto publicado. " + result.visibleCount + " projeto(s) visível(is) no site.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível publicar projetos."); }
    finally { setPublishing(false); }
  }
  function selectAsset(asset: string) {
    if (!selected) return;
    if (UNVERIFIED_PROJECT_IMAGES.has(asset)) { setNotice("Esta foto antiga não comprova o evento. Escolha outra imagem."); setAssetTarget(false); return; }
    update({ ...selected, coverImage: asset, coverImageValidated: false });
    setAssetTarget(false);
  }
  async function uploadImage(file: File | undefined) {
    if (!file || !selected) return;
    setUploading(true); setNotice("");
    try {
      const form = new FormData(); form.set("file", file);
      const response = await fetch("/api/catalog-editor/projects/assets", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar a foto.");
      const asset = { path: result.path, name: result.name, folder: "images/projects", type: "image" as const };
      setUploadedAssets((current) => [...current, asset]);
      update({ ...selected, coverImage: asset.path, coverImageValidated: false });
      setNotice("Foto enviada. Confirme que ela pertence ao evento antes de publicar.");
    } catch (error) { setNotice(error instanceof Error ? error.message : "Não foi possível enviar a foto."); }
    finally { setUploading(false); if (uploadRef.current) uploadRef.current.value = ""; }
  }

  return <main className={styles.editor}>
    <header className={styles.topbar}><div className={styles.topbarTitle}><button type="button" className={styles.mobileListButton} onClick={() => setSidebarOpen(true)}><Menu size={17} />Projetos</button><span className={styles.brand}>PROJETOS / {categoriesOpen ? "CATEGORIAS" : "EDIÇÃO"}</span><h1>{categoriesOpen ? "Categorias" : selected?.name.pt || "Novo projeto"}</h1></div><div className={styles.toolbar}><span className={(categoriesOpen ? categoryManager.saved : saved) ? styles.notice : styles.warning}>{categoriesOpen ? categoryManager.saved ? "✓ Salvo automaticamente" : "Salvando..." : loaded ? saved ? "✓ Salvo automaticamente" : "Salvando..." : "Carregando..."}</span>{categoriesOpen ? <button type="button" className={styles.publishButton} disabled={categoryManager.publishing} onClick={() => void publishCategories().catch(() => {})}>Publicar categorias</button> : <><button type="button" className={styles.toolbarButton} disabled={!selected} onClick={() => setPreviewOpen(true)}>Visualizar</button><button type="button" className={styles.publishButton} disabled={publishing || !selected || issues.length > 0} onClick={() => void publish()}>{publishing ? "Publicando..." : "Publicar"}</button></>}</div></header>
    <div className={styles.statusBar}>{categoriesOpen ? <><span className={categoryManager.saved ? styles.notice : styles.warning}>{categoryManager.saved ? "✓ Salvo automaticamente" : "Salvando..."}</span><span className={categoryManager.unpublished ? styles.warning : styles.notice}>{categoryManager.unpublished ? "Alterações não publicadas" : "✓ Categorias atualizadas"}</span></> : <><span className={saved ? styles.notice : undefined}>{loaded ? saved ? "✓ Salvo automaticamente" : "Salvando..." : "Carregando..."}</span><span className={unpublished ? styles.warning : styles.notice}>{unpublished ? "Alterações não publicadas" : "✓ Projetos atualizados"}</span>{issues.length > 0 && <span className={styles.warning}>⚠ {issues[0]}</span>}{notice && <span className={styles.warning}>{notice}</span>}</>}</div>
    <div className={styles.workspace}>
      {sidebarOpen && <button type="button" className={styles.sidebarBackdrop} aria-label="Fechar lista" onClick={() => setSidebarOpen(false)} />}
      <aside className={styles.sidebar + (sidebarOpen ? " " + styles.sidebarOpen : "")}>
        <div className={styles.sidebarBrand}><span>SELUM <small>/ INTERNO</small></span><button type="button" className={styles.sidebarClose} aria-label="Fechar menu" onClick={() => setSidebarOpen(false)}><X size={18} /></button></div>
        <nav className={styles.sidebarNav} aria-label="Conteúdo"><span>CONTEÚDO</span><button type="button" onClick={onSwitch}><Package size={17} />Produtos</button><button type="button" className={!categoriesOpen ? styles.sidebarNavActive : ""} onClick={() => { setCategoriesOpen(false); setSidebarOpen(false); }}><FolderKanban size={17} />Projetos / Eventos</button><button type="button" className={categoriesOpen ? styles.sidebarNavActive : styles.sidebarSubnav} onClick={() => { setCategoriesOpen(true); setSidebarOpen(false); }}>Categorias</button></nav>
        {!categoriesOpen && <><div className={styles.sidebarHeader}><h2>Projetos <span>{projects.length}</span></h2><button type="button" className={styles.sidebarClose} aria-label="Fechar lista" onClick={() => setSidebarOpen(false)}><X size={18} /></button><button className={styles.addButton} type="button" onClick={add}><Plus size={15} />Novo projeto</button></div>
        <label className={styles.search}><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar projetos..." /></label><p className={styles.reorderHint}>Arraste para mudar a ordem de exibição.</p>
        <div className={styles.productList}>{filtered.map((project) => <div className={styles.productListItem + (selectedId === project.id ? " " + styles.productListItemActive : "")} key={project.id} draggable onDragStart={() => { draggedId.current = project.id; }} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); if (draggedId.current) reorder(draggedId.current, project.id); draggedId.current = null; }}><GripVertical size={15} className={styles.listGrip} /><button type="button" className={styles.productSelect} onClick={() => { setSelectedId(project.id); setSidebarOpen(false); }}><strong>{project.name.pt || "Novo projeto"}</strong><span className={project.status === "approved" && project.active ? styles.badgePublished : styles.badgeDraft}>{!project.name.pt || !project.coverImageValidated ? "Incompleto" : project.status === "approved" ? project.active ? "Publicado" : "Oculto" : project.status === "review" ? "Revisar" : "Rascunho"}</span></button><div className={styles.productActions}><button type="button" title="Excluir" aria-label={"Excluir " + (project.name.pt || "projeto")} onClick={() => remove(project)}><Trash2 size={13} /></button></div></div>)}{filtered.length === 0 && <p className={styles.emptySidebar}>Nenhum projeto encontrado.</p>}</div></>}
      </aside>
      <div className={styles.content}>{categoriesOpen ? <CategoriesManager scope="projects" categories={categories} onChange={setCategories} onPublish={() => void publishCategories().catch(() => {})} onBack={() => setCategoriesOpen(false)} usageCount={categoryUsage} saved={categoryManager.saved} publishing={categoryManager.publishing} notice={categoryManager.notice} /> : selected ? <div className={styles.wizard} key={selected.id}>
        <div className={styles.wizardHeading}><div><span className={styles.brand}>CADASTRO DE PROJETO</span><h2>{selected.name.pt || "Novo projeto"}</h2></div></div>
        <section className={styles.wizardPanel}><h3>Informações do evento</h3><p className={styles.stepIntro}>Preencha as informações principais. Os outros idiomas podem ser adicionados depois.</p>
          <TranslationFields label="Nome do evento" value={selected.name} onChange={updateName} />
          <div className={styles.categorySelectRow}><label className={styles.field}><span>Categoria</span><select value={selectedCategory?.id || ""} onChange={(event) => changeCategory(event.target.value)}><option value="">Selecione uma categoria</option>{categories.filter((category) => category.name.pt.trim() && (category.active || category.id === selectedCategory?.id)).map((category) => <option key={category.id} value={category.id}>{category.name.pt || "Nova categoria"}{!category.active ? " (inativa)" : ""}</option>)}</select></label><button type="button" className={styles.toolbarButton} onClick={() => setCategoriesOpen(true)}>Gerenciar categorias</button></div>
          <div className={styles.fieldGrid}><label className={styles.field}><span>Cidade</span><input value={selected.location.city} onChange={(event) => update({ ...selected, location: { ...selected.location, city: event.target.value } })} /></label><label className={styles.field}><span>Estado</span><input value={selected.location.state} onChange={(event) => update({ ...selected, location: { ...selected.location, state: event.target.value } })} /></label><label className={styles.field}><span>País</span><input value={selected.location.country} placeholder="Brasil" onChange={(event) => update({ ...selected, location: { ...selected.location, country: event.target.value } })} /></label></div>
        </section>
        <section className={styles.wizardPanel}><h3>Foto do evento</h3><p className={styles.stepIntro}>Selecione uma foto que pertença a este evento.</p><div className={styles.projectPhoto}>{selected.coverImage ? <Image src={selected.coverImage} alt="Prévia do projeto" fill sizes="480px" /> : <ImagePlus size={36} strokeWidth={1.4} />}</div>{selected.coverImage && <p className={styles.fileName}>{decodeURIComponent(selected.coverImage.split("/").pop() || "")}</p>}<div className={styles.photoActions}><button type="button" className={styles.smallButton} onClick={() => setAssetTarget(true)}><ImagePlus size={15} />{selected.coverImage ? "Trocar imagem" : "Selecionar da biblioteca"}</button><button type="button" className={styles.smallButton} disabled={uploading} onClick={() => uploadRef.current?.click()}><Upload size={15} />{uploading ? "Enviando..." : "Enviar nova foto"}</button>{selected.coverImage && <button type="button" className={styles.textDanger} onClick={() => update({ ...selected, coverImage: "", coverImageValidated: false })}>Remover imagem</button>}</div><label className={styles.checkRow}><input type="checkbox" checked={selected.coverImageValidated} disabled={!selected.coverImage} onChange={(event) => update({ ...selected, coverImageValidated: event.target.checked })} />Confirmo que esta foto pertence a este evento</label></section>
        <section className={styles.wizardPanel}><h3>Exibição no site</h3><div className={styles.visibilityOptions}><label><input type="checkbox" checked={selected.active} onChange={(event) => update({ ...selected, active: event.target.checked })} /><span><strong>Mostrar na página Projetos</strong><small>Este projeto aparece no portfólio após a publicação.</small></span></label><label><input type="checkbox" checked={selected.showOnHome} onChange={(event) => update({ ...selected, showOnHome: event.target.checked })} /><span><strong>Mostrar na página inicial</strong><small>Este projeto aparecerá também na Home após a publicação.</small></span></label></div><p className={styles.stepIntro}>A posição na lista pode ser alterada arrastando os projetos na barra lateral.</p></section>
        <section className={styles.wizardPanel}><h3>Revisar e publicar</h3>{issues.length > 0 && <div className={styles.reviewIssues}><strong>Confira antes de publicar:</strong><ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}<div className={styles.reviewActions}><button type="button" className={styles.toolbarButton} onClick={() => { update({ ...selected, status: "draft" }); setNotice("✓ Rascunho salvo automaticamente neste navegador."); }}>Salvar rascunho</button><button type="button" className={styles.publishButton} disabled={publishing || issues.length > 0} onClick={() => void publish()}>{publishing ? "Publicando..." : "Publicar"}</button></div><details className={styles.advanced}><summary>Opções avançadas <ChevronDown size={14} /></summary><div className={styles.fieldGrid}><label className={styles.field}><span>Identificador da página (slug)</span><input value={selected.slug} onChange={(event) => update({ ...selected, slug: slugify(event.target.value) })} /></label><label className={styles.field}><span>ID interno</span><input value={selected.id} readOnly /></label></div><p className={styles.fileName}>{selected.coverImage}</p></details></section>
      </div> : <div className={styles.emptyContent}><h2>Selecione ou crie um projeto</h2><button type="button" className={styles.primaryButton} onClick={add}><Plus size={15} />Novo projeto</button></div>}</div>
    </div>
    <input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" hidden onChange={(event) => void uploadImage(event.target.files?.[0])} />
    {previewOpen && selected && <div className={styles.modalBackdrop} role="presentation" onClick={() => setPreviewOpen(false)}><div className={styles.projectPreviewModal} role="dialog" aria-modal="true" aria-label="Prévia do projeto" onClick={(event) => event.stopPropagation()}><div className={styles.modalHeader}><div><span className={styles.brand}>PRÉVIA DO PROJETO</span><h2>{selected.name.pt || "Novo projeto"}</h2><p>{selectedCategory?.name.pt || selected.category.pt}{selected.location.city ? " · " + selected.location.city : ""}</p></div><button type="button" className={styles.iconButton} aria-label="Fechar prévia" onClick={() => setPreviewOpen(false)}><X size={18} /></button></div><div className={styles.projectPhoto}>{selected.coverImage ? <Image src={selected.coverImage} alt={selected.name.pt || "Prévia do projeto"} fill sizes="720px" /> : <ImagePlus size={36} />}</div><p className={styles.previewHelp}>Esta é uma prévia do cadastro atual. A publicação controla o que aparece no site.</p></div></div>}
    {assetTarget && <AssetPicker assets={[...assets, ...uploadedAssets].filter((asset) => !UNVERIFIED_PROJECT_IMAGES.has(asset.path))} title="Selecionar imagem" type="image" onSelect={selectAsset} onClose={() => setAssetTarget(false)} />}
  </main>;
}
