"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Save, Trash2, Upload } from "lucide-react";
import AssetPicker from "./AssetPicker";
import type { EditorAsset } from "@/lib/catalog-editor";
import type { AboutImageKey, AboutPageImages } from "@/lib/about-page-images";
import styles from "./about-images-editor.module.css";

type Field = { key: AboutImageKey; label: string; canRemove?: boolean };
type Group = { title: string; fields: Field[] };

const groups: Group[] = [
  { title: "Hero / Fábrica", fields: [{ key: "heroFactory", label: "Imagem da fábrica" }] },
  { title: "Fabricação / Solda", fields: [{ key: "manufacturing", label: "Imagem da fabricação" }] },
  { title: "Detalhe estrutural / Alumínio", fields: [
    { key: "detailsBackdrop", label: "Fundo / textura", canRemove: true },
    { key: "detailsStructure", label: "Estrutura em primeiro plano" },
  ] },
  { title: "Equipe", fields: [{ key: "team", label: "Imagem da equipe" }] },
  { title: "Presença América Latina", fields: [{ key: "presence", label: "Imagem / textura do mapa", canRemove: true }] },
  { title: "CTA final", fields: [{ key: "cta", label: "Imagem decorativa", canRemove: true }] },
];

export default function AboutImagesEditor({
  initialImages,
  initialAssets,
  onBack,
}: {
  initialImages: AboutPageImages;
  initialAssets: EditorAsset[];
  onBack: () => void;
}) {
  const [images, setImages] = useState(initialImages);
  const [savedImages, setSavedImages] = useState(initialImages);
  const [assets, setAssets] = useState(initialAssets);
  const [loaded, setLoaded] = useState(false);
  const [target, setTarget] = useState<AboutImageKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = useMemo(() => JSON.stringify(images) !== JSON.stringify(savedImages), [images, savedImages]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled([
      fetch("/api/catalog-editor/about-images", { cache: "no-store", signal: controller.signal }).then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Não foi possível carregar as configurações.");
        return result.images as AboutPageImages;
      }),
      fetch("/api/catalog-editor/about-images/assets", { cache: "no-store", signal: controller.signal }).then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Não foi possível carregar imagens do Storage.");
        return result.assets as EditorAsset[];
      }),
    ]).then(([configResult, assetsResult]) => {
      if (controller.signal.aborted) return;
      if (configResult.status === "fulfilled") {
        setImages(configResult.value);
        setSavedImages(configResult.value);
      } else setNotice(configResult.reason instanceof Error ? configResult.reason.message : "Não foi possível carregar as configurações.");
      if (assetsResult.status === "fulfilled") setAssets((current) => [...current, ...assetsResult.value]);
      else setNotice(assetsResult.reason instanceof Error ? assetsResult.reason.message : "Não foi possível carregar imagens do Storage.");
      setLoaded(true);
    });
    return () => controller.abort();
  }, []);

  function chooseImage(path: string) {
    if (!target) return;
    setImages((current) => ({ ...current, [target]: path }));
    setTarget(null);
    setNotice("Imagem selecionada. Salve para atualizar a página pública.");
  }

  async function uploadImage(file: File | undefined) {
    if (!file || !target) return;
    setBusy(true);
    setNotice("");
    try {
      const body = new FormData();
      body.set("file", file);
      const response = await fetch("/api/catalog-editor/about-images/assets", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível enviar a imagem.");
      const asset: EditorAsset = { path: result.path, name: result.name, folder: result.folder, type: "image" };
      setAssets((current) => [...current, asset]);
      setImages((current) => ({ ...current, [target]: result.path }));
      setNotice("Upload concluído. Salve para atualizar a página pública.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível enviar a imagem.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save() {
    setBusy(true);
    setNotice("");
    try {
      const response = await fetch("/api/catalog-editor/about-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível salvar as imagens.");
      setImages(result.images);
      setSavedImages(result.images);
      setNotice("Imagens salvas. A página Quem Somos já usa as novas referências.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar as imagens.");
    } finally { setBusy(false); }
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <button type="button" className={styles.backButton} onClick={onBack}><ArrowLeft size={16} />Conteúdo</button>
      <div><span className={styles.eyebrow}>CONTEÚDO / QUEM SOMOS</span><h1>Imagens da página</h1><p>Altere somente as imagens. Os textos e a apresentação pública permanecem iguais.</p></div>
      <button type="button" className={styles.saveButton} onClick={() => void save()} disabled={!loaded || !dirty || busy}><Save size={16} />{!loaded ? "Carregando..." : busy ? "Salvando..." : "Salvar imagens"}</button>
    </header>
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    <div className={styles.groups}>
      {groups.map((group) => <section className={styles.group} key={group.title}>
        <h2>{group.title}</h2>
        <div className={styles.fields}>
          {group.fields.map((field) => <article className={styles.field} key={field.key}>
            <div className={styles.preview}>
              {images[field.key] ? <Image src={images[field.key]} alt={field.label} fill sizes="(max-width: 700px) 90vw, 280px" /> : <span><ImagePlus size={24} />Sem imagem</span>}
            </div>
            <div className={styles.fieldBody}>
              <h3>{field.label}</h3>
              <p className={styles.path} title={images[field.key] || "Sem imagem"}>{images[field.key] || "Sem imagem"}</p>
              <div className={styles.actions}>
                <button type="button" onClick={() => setTarget(field.key)}>{images[field.key] ? "Trocar" : "Selecionar imagem existente"}</button>
                <button type="button" onClick={() => { setTarget(field.key); fileRef.current?.click(); }}><Upload size={14} />Enviar nova imagem</button>
                {field.canRemove && images[field.key] && <button type="button" className={styles.removeButton} onClick={() => { setImages((current) => ({ ...current, [field.key]: "" })); setNotice("Imagem removida da configuração. Salve para aplicar."); }}><Trash2 size={14} />Remover</button>}
              </div>
            </div>
          </article>)}
        </div>
      </section>)}
    </div>
    <input ref={fileRef} className={styles.fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => void uploadImage(event.target.files?.[0])} />
    {target && <AssetPicker assets={assets.filter((asset) => asset.type === "image")} title="Selecionar imagem existente" type="image" description="Imagens de public e do Supabase Storage" onSelect={chooseImage} onClose={() => setTarget(null)} />}
  </main>;
}
