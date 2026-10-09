"use client";

import { useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from "lucide-react";
import { newCategory, orderedCategories, type CategoryScope, type ContentCategory } from "@/lib/content-categories";
import styles from "./catalog-editor.module.css";

export default function CategoriesManager({ scope, categories, onChange, onPublish, onBack, usageCount, saved, publishing, notice }: {
  scope: CategoryScope;
  categories: ContentCategory[];
  onChange: (categories: ContentCategory[]) => void;
  onPublish: () => void;
  onBack: () => void;
  usageCount: (category: ContentCategory) => number;
  saved: boolean;
  publishing: boolean;
  notice: string;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(categories[0]?.id ?? null);
  const selected = categories.find((category) => category.id === selectedId) ?? categories[0] ?? null;
  const area = scope === "projects" ? "Projetos / Eventos" : "Produtos";

  function update(next: ContentCategory) {
    onChange(categories.map((category) => category.id === next.id ? next : category));
  }
  function add() {
    const next = newCategory(categories.length + 1);
    onChange([...categories, next]);
    setSelectedId(next.id);
  }
  function move(index: number, delta: number) {
    const destination = index + delta;
    if (destination < 0 || destination >= categories.length) return;
    const reordered = [...categories];
    [reordered[index], reordered[destination]] = [reordered[destination], reordered[index]];
    onChange(orderedCategories(reordered));
  }
  function remove(category: ContentCategory) {
    if (usageCount(category)) return;
    if (!window.confirm(`Excluir a categoria “${category.name.pt || "Nova categoria"}” do rascunho?`)) return;
    const remaining = categories.filter((item) => item.id !== category.id);
    onChange(orderedCategories(remaining));
    if (selectedId === category.id) setSelectedId(remaining[0]?.id ?? null);
  }

  return <div className={styles.categoriesManager}>
    <div className={styles.categoryHeading}><div><span className={styles.brand}>{area.toUpperCase()} / CATEGORIAS</span><h2>Categorias</h2><p>Organize as opções que aparecem no cadastro. As alterações são salvas neste navegador.</p></div><button type="button" className={styles.primaryButton} onClick={add}><Plus size={16} />Nova categoria</button></div>
    <div className={styles.categoriesWorkspace}>
      <div className={styles.categoryList} aria-label={`Categorias de ${area}`}>
        {categories.map((category, index) => <div className={styles.categoryListRow} key={category.id}><button type="button" className={selected?.id === category.id ? styles.categoryListActive : ""} onClick={() => setSelectedId(category.id)}><span>{category.name.pt || "Nova categoria"}</span><small>{!category.name.pt ? "Rascunho" : category.active ? "Ativa" : "Inativa"}</small><span className={styles.categoryUsage}>{usageCount(category)} em uso</span></button><div className={styles.categoryOrderActions}><button type="button" aria-label={`Subir ${category.name.pt}`} disabled={index === 0} onClick={() => move(index, -1)}><ArrowUp size={13} /></button><button type="button" aria-label={`Descer ${category.name.pt}`} disabled={index === categories.length - 1} onClick={() => move(index, 1)}><ArrowDown size={13} /></button></div></div>)}
        {categories.length === 0 && <p className={styles.emptyHint}>Nenhuma categoria cadastrada.</p>}
      </div>
      <div className={styles.categoryDetail}>{selected ? <>
        <h3>{selected.name.pt || "Nova categoria"}</h3><p className={styles.stepIntro}>Use nomes claros para quem está cadastrando conteúdo e para quem visita o site.</p>
        <div className={styles.categoryFields}>
          <label className={styles.field}><span>Nome PT</span><input value={selected.name.pt} onChange={(event) => update({ ...selected, name: { ...selected.name, pt: event.target.value } })} placeholder="Ex.: Feira" /></label>
          <label className={styles.field}><span>Nome ES</span><input value={selected.name.es} onChange={(event) => update({ ...selected, name: { ...selected.name, es: event.target.value } })} placeholder="Tradução em espanhol" /></label>
          <label className={styles.field}><span>Nome EN</span><input value={selected.name.en} onChange={(event) => update({ ...selected, name: { ...selected.name, en: event.target.value } })} placeholder="Tradução em inglês" /></label>
        </div>
        <label className={styles.categoryToggle}><input type="checkbox" checked={selected.active} onChange={(event) => update({ ...selected, active: event.target.checked })} /><span><strong>Categoria ativa</strong><small>Categorias inativas não aparecem nas opções de novos cadastros nem nos filtros do site.</small></span></label>
        {usageCount(selected) > 0 && <p className={styles.categoryWarning}>Esta categoria está sendo utilizada por {usageCount(selected)} {scope === "projects" ? usageCount(selected) === 1 ? "projeto" : "projetos" : usageCount(selected) === 1 ? "produto" : "produtos"}. Mova os itens para outra categoria antes de excluir.</p>}
        <button type="button" className={styles.textDanger} disabled={usageCount(selected) > 0} onClick={() => remove(selected)}><Trash2 size={15} />Excluir categoria</button>
      </> : <div className={styles.emptyContent}><h3>Selecione ou crie uma categoria</h3></div>}</div>
    </div>
    <div className={styles.categoryFooter}><button type="button" className={styles.toolbarButton} onClick={onBack}><ArrowLeft size={15} />Voltar para {scope === "projects" ? "projetos" : "produtos"}</button><span className={saved ? styles.notice : styles.warning}>{saved ? "✓ Salvo automaticamente" : "Salvando..."}</span><button type="button" className={styles.publishButton} disabled={publishing} onClick={onPublish}>{publishing ? "Publicando..." : "Publicar categorias"}</button></div>
    {notice && <p className={styles.categoryNotice} role="status">{notice}</p>}
  </div>;
}
