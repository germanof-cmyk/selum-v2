"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Plus, Search, Trash2, Upload } from "lucide-react";
import AssetPicker from "./AssetPicker";
import type { EditorAsset, LocalizedText } from "@/lib/catalog-editor";
import { emptyProject, exportProjects, importProjects, PROJECTS_STORAGE_KEY, UNVERIFIED_PROJECT_IMAGES, type EditorProject } from "@/lib/projects";
import styles from "./catalog-editor.module.css";

const locales = ["pt", "es", "en"] as const;
const statusLabel = { draft: "Rascunho", review: "Revisar", approved: "Aprovado" };

function LocalizedInput({ label, value, onChange }: {
  label: string; value: LocalizedText; onChange: (value: LocalizedText) => void;
}) {
  return <div className={styles.localizedGroup}>
    <span className={styles.fieldLegend}>{label}</span>
    <div className={styles.languageGrid}>{locales.map((locale) => <label className={styles.field} key={locale}>
      <span>{locale.toUpperCase()}</span>
      <input value={value[locale]} onChange={(event) => onChange({ ...value, [locale]: event.target.value })} />
    </label>)}</div>
  </div>;
}

export default function ProjectsEditor({ initialProjects, assets, onSwitch }: {
  initialProjects: EditorProject[]; assets: EditorAsset[]; onSwitch: () => void;
}) {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState<string | null>(initialProjects[0]?.id ?? null);
  const [query, setQuery] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishedSnapshot, setPublishedSnapshot] = useState(JSON.stringify(exportProjects(initialProjects)));
  const [assetTarget, setAssetTarget] = useState<"cover" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedAssets, setUploadedAssets] = useState<EditorAsset[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
        if (raw) {
          const restored = importProjects(JSON.parse(raw), { draft: true });
          setProjects(restored);
          setSelectedId(restored[0]?.id ?? null);
        }
      } catch { setNotice("Não foi possível ler o rascunho local de projetos."); }
      setLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/catalog-editor/projects", { cache: "no-store", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Não foi possível consultar os projetos publicados.");
        const result = await response.json();
        setPublishedSnapshot(JSON.stringify(result.projects));
      })
      .catch((error) => { if (error.name !== "AbortError") setNotice(error.message); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
      const frame = requestAnimationFrame(() => setSaved(true));
      return () => cancelAnimationFrame(frame);
    } catch {
      const frame = requestAnimationFrame(() => setNotice("Não foi possível salvar o rascunho local de projetos."));
      return () => cancelAnimationFrame(frame);
    }
  }, [projects, loaded]);

  const selected = projects.find((project) => project.id === selectedId) ?? null;
  const filtered = projects.filter((project) => `${project.name.pt} ${project.slug}`.toLocaleLowerCase("pt").includes(query.toLocaleLowerCase("pt")));
  let currentSnapshot = "";
  try { currentSnapshot = JSON.stringify(exportProjects(projects)); } catch { /* Identificadores internos são validados ao publicar. */ }
  const unpublished = currentSnapshot !== publishedSnapshot;
  const visibilityIssues = selected ? [
    selected.status !== "approved" ? "Status deve ser Aprovado." : "",
    !selected.active ? "Marque Ativo." : "",
    !Object.values(selected.name).some((value) => value.trim()) ? "Informe o nome do projeto." : "",
    !Object.values(selected.category).some((value) => value.trim()) ? "Informe a categoria." : "",
    !selected.coverImage.trim() ? "Adicione uma foto de capa do projeto." : "",
    UNVERIFIED_PROJECT_IMAGES.has(selected.coverImage) ? "A capa selecionada é um dos arquivos antigos idênticos e não comprova este evento." : "",
    selected.coverImage.trim() && !selected.coverImageValidated ? "Confirme que a capa pertence a este projeto." : "",
  ].filter(Boolean) : [];

  function update(next: EditorProject) {
    setProjects((current) => current.map((project) => project.id === next.id ? next : project));
    setSaved(false);
    setNotice("");
  }

  function add() {
    const project = emptyProject();
    let candidate = "novo-projeto";
    let number = 2;
    while (projects.some((item) => item.slug === candidate)) candidate = `novo-projeto-${number++}`;
    project.slug = candidate;
    setProjects((current) => [...current, project]);
    setSelectedId(project.id);
    setQuery("");
    setSaved(false);
  }

  function remove(project: EditorProject) {
    if (!window.confirm(`Excluir "${project.name.pt || project.slug}" do rascunho de projetos?`)) return;
    const remaining = projects.filter((item) => item.id !== project.id);
    setProjects(remaining);
    if (selectedId === project.id) setSelectedId(remaining[0]?.id ?? null);
  }

  async function publish() {
    setPublishing(true);
    setNotice("");
    try {
      const response = await fetch("/api/catalog-editor/projects", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível publicar projetos.");
      setPublishedSnapshot(JSON.stringify(result.projects));
      setNotice(`Projetos publicados. ${result.visibleCount} visível(is) em Projetos; ${result.homeCount} na Home.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível publicar projetos.");
    } finally { setPublishing(false); }
  }

  function selectAsset(asset: string) {
    if (!selected) return;
    if (UNVERIFIED_PROJECT_IMAGES.has(asset)) {
      setNotice("Os três arquivos antigos são idênticos e não podem ser usados como imagem validada de um evento.");
      setAssetTarget(null);
      return;
    }
    update({ ...selected, coverImage: asset, coverImageValidated: false });
    setAssetTarget(null);
  }

  function startUpload() {
    uploadRef.current?.click();
  }

  async function uploadImage(file: File | undefined) {
    if (!file || !selected) return;
    setUploading(true);
    setNotice("");
    try {
      const form = new FormData();
      form.set("file", file);
      const response = await fetch("/api/catalog-editor/projects/assets", { method: "POST", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar a imagem.");
      const asset = { path: result.path, name: result.name, folder: "images/projects", type: "image" as const };
      setUploadedAssets((current) => [...current, asset]);
      update({ ...selected, coverImage: asset.path, coverImageValidated: false });
      setNotice("Imagem enviada. Confirme a associação da capa com o projeto antes de publicar.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
      if (uploadRef.current) uploadRef.current.value = "";
    }
  }

  return <main className={styles.editor}>
    <nav className={styles.areaTabs} aria-label="Áreas do editor"><button type="button" onClick={onSwitch}>Produtos</button><button className={styles.areaTabActive} type="button">Projetos</button></nav>
    <header className={styles.topbar}>
      <div><span className={styles.brand}>SELUM / INTERNO</span><h1>Projetos</h1><p>Rascunho local. A publicação é manual e só projetos aprovados com capa validada aparecem no site.</p></div>
      <div className={styles.toolbar}><button className={styles.publishButton} type="button" disabled={!loaded || publishing || !unpublished} onClick={() => void publish()}><Upload size={15} />{publishing ? "Publicando..." : "Publicar alterações"}</button></div>
    </header>
    <div className={styles.statusBar}><span className={saved ? styles.notice : undefined}>{loaded ? saved ? "● Rascunho salvo neste navegador" : "Salvando rascunho..." : "Carregando rascunho..."}</span><span className={unpublished ? styles.warning : styles.notice}>{unpublished ? "Ainda não publicado no site" : "✓ Dados de projetos publicados"}</span>{notice && <span className={notice.startsWith("Projetos publicados") ? styles.notice : styles.warning}>{notice}</span>}</div>
    <div className={styles.workspace}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}><h2>Projetos <span>{projects.length}</span></h2><button className={styles.addButton} type="button" onClick={add}><Plus size={15} />Novo projeto</button></div>
        <label className={styles.search}><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nome..." /></label>
        <div className={styles.productList}>{filtered.map((project) => <div className={`${styles.productListItem} ${selectedId === project.id ? styles.productListItemActive : ""}`} key={project.id}>
          <button type="button" className={styles.productSelect} onClick={() => setSelectedId(project.id)}><strong>{project.name.pt || project.slug}</strong><span>{statusLabel[project.status]}{!project.active ? " · Inativo" : ""}{!project.coverImageValidated ? " · Sem capa validada" : ""}</span></button>
          <div className={styles.productActions}><button type="button" title="Excluir" aria-label={`Excluir ${project.name.pt || project.slug}`} onClick={() => remove(project)}><Trash2 size={13} /></button></div>
        </div>)}{filtered.length === 0 && <p className={styles.emptySidebar}>Nenhum projeto encontrado.</p>}</div>
      </aside>
      <div className={styles.content}>{selected ? <div className={styles.form}>
        <div className={`${styles.visibilityPanel} ${visibilityIssues.length ? styles.visibilityBlocked : styles.visibilityReady}`}>
          <strong>{visibilityIssues.length ? "Este projeto não aparece no site" : unpublished ? "Pronto para publicar" : "Apto a aparecer em Projetos"}</strong>
          {visibilityIssues.length ? <ul>{visibilityIssues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : <p>{selected.showOnHome ? "Também aparecerá na Home após publicar." : "Para aparecer também na Home, marque Exibir na Home."}</p>}
          {unpublished && <p>Depois de concluir os campos, clique em Publicar alterações.</p>}
        </div>
        <section className={styles.section}><div className={styles.sectionTitle}><h2>Projeto</h2></div>
          <LocalizedInput label="Nome do projeto" value={selected.name} onChange={(name) => update({ ...selected, name })} />
          <LocalizedInput label="Categoria" value={selected.category} onChange={(category) => update({ ...selected, category })} />
          <p className={styles.emptyHint}>PT, ES e EN podem ser preenchidos gradualmente. Enquanto houver campos vazios, o site usa o texto disponível em outro idioma.</p>
        </section>
        <section className={styles.section}><div className={styles.sectionTitle}><h2>Localização</h2></div><div className={styles.languageGrid}>
          {(["city", "state", "country"] as const).map((field) => <label className={styles.field} key={field}><span>{{ city: "Cidade", state: "Estado", country: "País ou código ISO" }[field]}</span><input value={selected.location[field]} onChange={(event) => update({ ...selected, location: { ...selected.location, [field]: event.target.value } })} /></label>)}
        </div></section>
        <section className={styles.section}><div className={styles.sectionTitle}><h2>Imagem de capa</h2></div>
          <div className={styles.pathControl}><button type="button" className={styles.smallButton} onClick={() => setAssetTarget("cover")}>Selecionar imagem</button><button type="button" className={styles.smallButton} disabled={uploading} onClick={startUpload}>{uploading ? "Enviando..." : "Enviar foto"}</button></div>
          {selected.coverImage && <div className={styles.catalogHeroPreview}><Image src={selected.coverImage} alt="Prévia da capa" fill sizes="360px" /></div>}
          <label className={styles.checkRow}><input type="checkbox" checked={selected.coverImageValidated} disabled={!selected.coverImage} onChange={(event) => update({ ...selected, coverImageValidated: event.target.checked })} /> Confirmo que esta imagem pertence a este projeto</label>
          <p className={styles.emptyHint}>Use apenas imagens que pertençam ao projeto. Os três arquivos antigos idênticos não podem ser selecionados.</p>
        </section>
        <section className={styles.section}><div className={styles.sectionTitle}><h2>Publicação e ordem</h2></div>
          <div className={styles.fieldGrid}>
            <label className={styles.field}><span>Status</span><select value={selected.status} onChange={(event) => update({ ...selected, status: event.target.value as EditorProject["status"] })}><option value="draft">Rascunho</option><option value="review">Revisar</option><option value="approved">Aprovado</option></select></label>
            <label className={styles.checkRow}><input type="checkbox" checked={selected.active} onChange={(event) => update({ ...selected, active: event.target.checked })} /> Ativo</label>
            <label className={styles.field}><span>Ordem na página Projetos</span><input type="number" value={selected.projectsOrder ?? ""} onChange={(event) => update({ ...selected, projectsOrder: event.target.value === "" ? null : Number(event.target.value) })} /></label>
            <label className={styles.checkRow}><input type="checkbox" checked={selected.showOnHome} onChange={(event) => update({ ...selected, showOnHome: event.target.checked })} /> Exibir na Home</label>
            <label className={styles.field}><span>Ordem na Home</span><input type="number" value={selected.homeOrder ?? ""} onChange={(event) => update({ ...selected, homeOrder: event.target.value === "" ? null : Number(event.target.value) })} /></label>
          </div>
        </section>
      </div> : <div className={styles.emptyContent}><h2>Selecione ou crie um projeto</h2><p>Os dados serão salvos automaticamente neste navegador.</p><button type="button" className={styles.primaryButton} onClick={add}><Plus size={15} />Novo projeto</button></div>}</div>
    </div>
    <input ref={uploadRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" hidden onChange={(event) => void uploadImage(event.target.files?.[0])} />
    {assetTarget && <AssetPicker assets={[...assets, ...uploadedAssets].filter((asset) => !UNVERIFIED_PROJECT_IMAGES.has(asset.path))} title="Selecionar imagem" type="image" onSelect={selectAsset} onClose={() => setAssetTarget(null)} />}
  </main>;
}
