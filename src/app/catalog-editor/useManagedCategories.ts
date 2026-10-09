"use client";

import { useEffect, useRef, useState } from "react";
import { type CategoryScope, type ContentCategory } from "@/lib/content-categories";

export function useManagedCategories(scope: CategoryScope, initial: ContentCategory[]) {
  const [categories, setCategories] = useState(initial);
  const [loaded, setLoaded] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [publishedSnapshot, setPublishedSnapshot] = useState(JSON.stringify(initial));
  const [publishing, setPublishing] = useState(false);
  const [notice, setNotice] = useState("");
  const pendingSave = useRef<Promise<void>>(Promise.resolve());

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setLoaded(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [scope]);

  useEffect(() => {
    if (!loaded) return;
    const snapshot = JSON.stringify(categories);
    const timeout = setTimeout(() => {
      pendingSave.current = pendingSave.current.catch(() => {}).then(async () => {
        const response = await fetch("/api/catalog-editor/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "save", scope, categories }) });
        if (!response.ok) throw new Error((await response.json()).error);
        setSavedSnapshot(snapshot);
      }).catch((error) => setNotice(error instanceof Error ? error.message : "Não foi possível salvar categorias."));
    }, 700);
    return () => clearTimeout(timeout);
  }, [categories, loaded, scope]);

  async function publishCategories() {
    setPublishing(true);
    setNotice("");
    try {
      await pendingSave.current;
      const publishable = categories.filter((category) => category.name.pt.trim());
      const response = await fetch("/api/catalog-editor/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publish", scope, categories: publishable }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível publicar categorias.");
      setPublishedSnapshot(JSON.stringify(result.categories));
      setNotice("✓ Categorias publicadas.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível publicar categorias.";
      setNotice(message);
      throw error;
    } finally { setPublishing(false); }
  }

  return {
    categories, setCategories, loaded,
    saved: loaded && savedSnapshot === JSON.stringify(categories),
    unpublished: JSON.stringify(categories) !== publishedSnapshot,
    publishing, notice, publishCategories,
  };
}
