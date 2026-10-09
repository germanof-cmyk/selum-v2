"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, Save, Trash2, Upload } from "lucide-react";
import AssetPicker from "./AssetPicker";
import type { EditorAsset } from "@/lib/catalog-editor";
import type { ContactImageKey, ContactPageImages } from "@/lib/contact-page-images";
import styles from "./contact-images-editor.module.css";

const fields: { key: ContactImageKey; label: string; description: string }[] = [
  { key: "hero", label: "Imagem principal", description: "Fotografia decorativa na abertura da página." },
  { key: "location", label: "Imagem da localização", description: "Fotografia decorativa na seção de localização, ao lado do mapa." },
  { key: "cta", label: "Imagem do CTA final", description: "Imagem decorativa de fundo no CTA final." },
];

export default function ContactImagesEditor({
  initialImages,
  initialAssets,
  onBack,
}: {
  initialImages: ContactPageImages;
  initialAssets: EditorAsset[];
  onBack: () => void;
}) {
  const [images, setImages] = useState(initialImages);
  const [savedImages, setSavedImages] = useState(initialImages);
  const [assets, setAssets] = useState(initialAssets);
  const [loaded, setLoaded] = useState(false);
  const [target, setTarget] = useState<ContactImageKey | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dirty = useMemo(() => JSON.stringify(images) !== JSON.stringify(savedImages), [images, savedImages]);

  useEffect(() => {
    const controller = new AbortController();
    Promise.allSettled([
      fetch("/api/catalog-editor/contact-images", { cache: "no-store", signal: controller.signal }).then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Não foi possível carregar as configurações.");
        return result.images as ContactPageImages;
      }),
      fetch("/api/catalog-editor/contact-images/assets", { cache: "no-store", signal: controller.signal }).then(async (response) => {
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
      body.set("slot", target);
      const response = await fetch("/api/catalog-editor/contact-images/assets", { method: "POST", body });
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
      const response = await fetch("/api/catalog-editor/contact-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível salvar as imagens.");
      setImages(result.images);
      setSavedImages(result.images);
      setNotice("Imagens salvas. A página Contato já usa as novas referências.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Não foi possível salvar as imagens.");
    } finally { setBusy(false); }
  }

  return <main className={styles.page}>
    <header className={styles.header}>
      <button type="button" className={styles.backButton} onClick={onBack}><ArrowLeft size={16} />Conteúdo</button>
      <div><span className={styles.eyebrow}>CONTEÚDO / CONTATO</span><h1>Imagens da página de contato</h1><p>Altere somente as imagens; textos, formulário e localização permanecem iguais.</p></div>
      <button type="button" className={styles.saveButton} onClick={() => void save()} disabled={!loaded || !dirty || busy}><Save size={16} />{!loaded ? "Carregando..." : busy ? "Salvando..." : "Salvar imagens"}</button>
    </header>
    {notice && <p className={styles.notice} role="status">{notice}</p>}
    <div className={styles.fields}>
      {fields.map((field) => <article className={styles.field} key={field.key}>
        <div className={styles.preview}>
          {images[field.key] ? <Image src={images[field.key]} alt={field.label} fill sizes="(max-width: 700px) 90vw, 300px" /> : <span>Sem imagem</span>}
        </div>
        <div className={styles.fieldBody}>
          <h2>{field.label}</h2>
          <p>{field.description}</p>
          <small className={styles.path} title={images[field.key] || "Sem imagem"}>{images[field.key] || "Sem imagem"}</small>
          <div className={styles.actions}>
            <button type="button" onClick={() => setTarget(field.key)}>{images[field.key] ? "Trocar" : "Selecionar imagem existente"}</button>
            <button type="button" onClick={() => { setTarget(field.key); fileRef.current?.click(); }}><Upload size={14} />Enviar nova imagem</button>
            {images[field.key] && <button type="button" className={styles.removeButton} onClick={() => { setImages((current) => ({ ...current, [field.key]: "" })); setNotice("Imagem removida da configuração. Salve para aplicar."); }}><Trash2 size={14} />Remover</button>}
          </div>
        </div>
      </article>)}
    </div>
    <input ref={fileRef} className={styles.fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/avif" onChange={(event) => void uploadImage(event.target.files?.[0])} />
    {target && <AssetPicker assets={assets.filter((asset) => asset.type === "image")} title="Selecionar imagem existente" type="image" description="Imagens de public e do Supabase Storage" onSelect={chooseImage} onClose={() => setTarget(null)} />}
  </main>;
}
