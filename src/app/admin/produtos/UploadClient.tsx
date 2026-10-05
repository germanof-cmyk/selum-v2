"use client";

import { useState, useRef, useTransition, useCallback } from "react";
import Image from "next/image";
import { Upload, Trash2, ImageIcon, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { actionUploadImage, actionDeleteImage, actionFetchImages } from "./actions";
import { getImagePublicUrl } from "@/lib/supabase";
import type { ProdutoImagem } from "@/lib/supabase";

/* ─── KNOWN SLUGS ─────────────────────────────────────────────────────────── */
const KNOWN_SLUGS = ["box-truss", "praticaveis", "bases-cubos", "escadas"];

/* ─── UPLOAD ZONE ─────────────────────────────────────────────────────────── */

function UploadZone({
  slug,
  tipo,
  label,
  onSuccess,
}: {
  slug: string;
  tipo: "hero" | "gallery";
  label: string;
  onSuccess: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    setStatus("idle");
    setMsg("");

    const formData = new FormData();
    formData.append("slug", slug);
    formData.append("tipo", tipo);
    formData.append("file", file);

    startTransition(async () => {
      const result = await actionUploadImage(formData);
      if ("error" in result && result.error) {
        setStatus("err");
        setMsg(result.error);
      } else {
        setStatus("ok");
        setMsg("Enviado com sucesso.");
        onSuccess();
        setTimeout(() => setStatus("idle"), 3000);
      }
    });
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          border: `1.5px dashed ${dragging ? "#C9A84C" : "rgba(255,255,255,0.12)"}`,
          borderRadius: 4,
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          cursor: isPending ? "wait" : "pointer",
          background: dragging ? "rgba(201,168,76,0.04)" : "rgba(255,255,255,0.02)",
          transition: "all 0.2s",
        }}
      >
        {isPending ? (
          <RefreshCw size={20} color="#C9A84C" style={{ animation: "spin 1s linear infinite" }} />
        ) : (
          <Upload size={20} color="#555" />
        )}
        <span style={{ fontSize: 11, color: "#555", letterSpacing: 1 }}>
          {isPending ? "Enviando…" : label}
        </span>
        <span style={{ fontSize: 10, color: "#333" }}>
          JPG · PNG · WebP · AVIF · máx 8MB
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {status !== "idle" && (
        <div
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: status === "ok" ? "#5cb85c" : "#e05c5c",
          }}
        >
          {status === "ok" ? <CheckCircle size={13} /> : <AlertCircle size={13} />}
          {msg}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ─── IMAGE ROW ───────────────────────────────────────────────────────────── */

function ImageRow({
  img,
  onDelete,
}: {
  img: ProdutoImagem;
  onDelete: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const publicUrl = getImagePublicUrl(img.storage_path);

  function handleDelete() {
    if (!confirm("Remover esta imagem?")) return;
    startTransition(async () => {
      await actionDeleteImage(img.id, img.storage_path);
      onDelete();
    });
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px 16px",
        background: "#111",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 4,
      }}
    >
      <div
        style={{
          width: 64,
          height: 40,
          position: "relative",
          flexShrink: 0,
          background: "#1a1a1a",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Image
          src={publicUrl}
          alt={img.storage_path}
          fill
          sizes="64px"
          style={{ objectFit: "cover" }}
        />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: img.tipo === "hero" ? "#C9A84C" : "#555",
            marginBottom: 2,
          }}
        >
          {img.tipo}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#444",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {img.storage_path}
        </div>
      </div>

      <button
        onClick={handleDelete}
        disabled={isPending}
        style={{
          background: "none",
          border: "1px solid rgba(224,92,92,0.25)",
          color: "#e05c5c",
          cursor: isPending ? "wait" : "pointer",
          padding: "6px 10px",
          borderRadius: 3,
          display: "flex",
          alignItems: "center",
          gap: 4,
          fontSize: 10,
          letterSpacing: 1,
          opacity: isPending ? 0.5 : 1,
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(224,92,92,0.08)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
      >
        <Trash2 size={12} />
        Remover
      </button>
    </div>
  );
}

/* ─── PRODUCT PANEL ───────────────────────────────────────────────────────── */

function ProductPanel({ slug }: { slug: string }) {
  const [images, setImages] = useState<ProdutoImagem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const result = await actionFetchImages(slug);
    setImages((result.rows as ProdutoImagem[]) ?? []);
    setLoading(false);
    setLoaded(true);
  }, [slug]);

  const hero = images.find((i) => i.tipo === "hero");
  const gallery = images.filter((i) => i.tipo === "gallery");

  return (
    <div
      style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 6,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 24px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <ImageIcon size={15} color="#C9A84C" />
          <span style={{ fontSize: 12, fontWeight: 600, color: "#F2F0EC" }}>
            {slug}
          </span>
        </div>
        <button
          onClick={load}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#555",
            cursor: loading ? "wait" : "pointer",
            padding: "6px 14px",
            fontSize: 10,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            borderRadius: 3,
            fontFamily: "var(--font-space), sans-serif",
          }}
        >
          <RefreshCw
            size={11}
            style={{ animation: loading ? "spin 1s linear infinite" : "none" }}
          />
          {loaded ? "Recarregar" : "Carregar imagens"}
        </button>
      </div>

      {loaded && (
        <div style={{ padding: 24 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 24,
            }}
          >
            {/* Hero upload */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#C9A84C",
                  marginBottom: 12,
                }}
              >
                Imagem Hero
              </div>
              {hero ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <ImageRow img={hero} onDelete={load} />
                  <UploadZone
                    slug={slug}
                    tipo="hero"
                    label="Substituir hero"
                    onSuccess={load}
                  />
                </div>
              ) : (
                <UploadZone
                  slug={slug}
                  tipo="hero"
                  label="Arraste ou clique para enviar o hero"
                  onSuccess={load}
                />
              )}
            </div>

            {/* Gallery upload */}
            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#555",
                  marginBottom: 12,
                }}
              >
                Galeria ({gallery.length} imagens)
              </div>
              <UploadZone
                slug={slug}
                tipo="gallery"
                label="Adicionar à galeria"
                onSuccess={load}
              />
              {gallery.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 12,
                  }}
                >
                  {gallery.map((img) => (
                    <ImageRow key={img.id} img={img} onDelete={load} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── MAIN ────────────────────────────────────────────────────────────────── */

export default function UploadClient() {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 40px" }}>
      {/* Page title */}
      <div style={{ marginBottom: 48 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#C9A84C",
            marginBottom: 10,
          }}
        >
          Produtos
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#F2F0EC",
            margin: 0,
            letterSpacing: -0.5,
          }}
        >
          Gestão de imagens
        </h1>
        <p style={{ fontSize: 13, color: "#444", marginTop: 8, lineHeight: 1.6 }}>
          Clique em &quot;Carregar imagens&quot; em cada produto para ver e gerenciar hero + galeria.
          As imagens são armazenadas no Supabase Storage (bucket{" "}
          <code
            style={{
              background: "#1a1a1a",
              padding: "1px 6px",
              borderRadius: 3,
              fontSize: 11,
              color: "#C9A84C",
            }}
          >
            produto-imagens
          </code>
          ).
        </p>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(255,255,255,0.07)",
          marginBottom: 32,
        }}
      />

      {/* Product panels */}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {KNOWN_SLUGS.map((slug) => (
          <ProductPanel key={slug} slug={slug} />
        ))}
      </div>

      {/* Static images notice */}
      <div
        style={{
          marginTop: 48,
          padding: "20px 24px",
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 4,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#333",
            marginBottom: 10,
          }}
        >
          Imagens estáticas (não gerenciadas aqui)
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 8,
          }}
        >
          {[
            { path: "public/videos/hero.mp4", label: "Hero — vídeo background" },
            { path: "public/images/about-bg.png", label: "Empresa — fundo" },
            { path: "public/images/products/*.png", label: "Produtos accordion (4x)" },
            { path: "public/images/projects/*.png", label: "Projetos grid (3x)" },
          ].map((item) => (
            <div
              key={item.path}
              style={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              <code
                style={{ fontSize: 10, color: "#444", letterSpacing: 0.5 }}
              >
                {item.path}
              </code>
              <span style={{ fontSize: 11, color: "#333" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
