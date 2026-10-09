"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import type { EditorAsset } from "@/lib/catalog-editor";
import styles from "./catalog-editor.module.css";

export default function AssetPicker({
  assets,
  title,
  type,
  description,
  onSelect,
  onClose,
  onUpload,
}: {
  assets: EditorAsset[];
  title: string;
  type: "image" | "pdf";
  description?: string;
  onSelect: (path: string) => void;
  onClose: () => void;
  onUpload?: () => void;
}) {
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("");
  const folders = useMemo(
    () => [...new Set(assets.filter((asset) => asset.type === type).map((asset) => asset.folder))],
    [assets, type]
  );
  const filtered = assets.filter((asset) =>
    asset.type === type &&
    (!folder || asset.folder === folder) &&
    (!query || asset.path.toLocaleLowerCase("pt").includes(query.toLocaleLowerCase("pt")))
  );

  return (
    <div className={styles.modalBackdrop} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.modalHeader}>
          <div>
            <h2>{title}</h2>
            <p>{description ?? "Arquivos existentes em public"} · {filtered.length} resultado(s)</p>
          </div>
          <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </div>
        {onUpload && <button type="button" className={styles.smallButton} onClick={onUpload}><Upload size={15} />Enviar nova imagem</button>}
        <div className={styles.modalFilters}>
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar arquivo..." />
          <select value={folder} onChange={(event) => setFolder(event.target.value)} aria-label="Pasta">
            <option value="">Todas as pastas</option>
            {folders.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        {filtered.length > 0 ? (
          <div className={styles.assetGrid}>
            {filtered.map((asset) => (
              <button type="button" key={asset.path} className={styles.assetTile} onClick={() => onSelect(asset.path)}>
                <span className={styles.assetThumb}>
                  {asset.type === "image" ? <Image src={asset.path} alt="" fill sizes="140px" /> : <span>PDF</span>}
                </span>
                <span className={styles.assetName} title={asset.path}>{asset.name}</span>
                <span className={styles.assetFolder}>{asset.folder}</span>
              </button>
            ))}
          </div>
        ) : <p className={styles.emptyAssets}>Nenhum arquivo encontrado. Tente outra busca.</p>}
      </div>
    </div>
  );
}
