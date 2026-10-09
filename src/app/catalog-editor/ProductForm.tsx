"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ChevronDown, GripVertical, ImagePlus, Plus, Trash2 } from "lucide-react";
import { emptyText, newId, slugify, uniqueSlug, type EditorModel, type EditorModelGroup, type EditorProduct, type EditorSpecification, type LocalizedText } from "@/lib/catalog-editor";
import type { ContentCategory } from "@/lib/content-categories";
import styles from "./catalog-editor.module.css";

export type AssetTarget = {
  kind: "heroMain" | "hero" | "home" | "catalogCard" | "catalogHero" | "modelIllustration" | "application" | "detail" | "model" | "drawing" | "file";
  index?: number;
  groupIndex?: number;
};

const steps = ["Informações", "Fotos", "Modelos", "Especificações", "Exibição", "Revisão"];
const specSuggestions = ["Material", "Dimensão", "Peso", "Acabamento", "Norma", "Carga", "Comprimento", "Largura", "Altura"];

function moveItem<T>(items: T[], from: number, to: number) {
  if (from === to || to < 0 || to >= items.length) return items;
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function ImageChoice({ label, value, onPick, onRemove, hint }: { label: string; value: string; onPick: () => void; onRemove: () => void; hint?: string }) {
  return <div className={styles.visualField}>
    <div className={styles.visualFieldHeader}><strong>{label}</strong>{hint && <span>{hint}</span>}</div>
    <div className={styles.visualPicker}>
      <div className={styles.visualThumb}>{value ? value.toLowerCase().endsWith(".pdf") ? <span>PDF</span> : <Image src={value} alt="" fill sizes="180px" /> : <ImagePlus size={30} strokeWidth={1.4} />}</div>
      <div className={styles.visualActions}>
        <span>{value ? decodeURIComponent(value.split("/").pop() || "") : "Nenhuma imagem selecionada"}</span>
        <button type="button" className={styles.smallButton} onClick={onPick}><ImagePlus size={15} />{value ? "Trocar imagem" : "Selecionar imagem"}</button>
        {value && <button type="button" className={styles.textDanger} onClick={onRemove}>Remover</button>}
      </div>
    </div>
  </div>;
}

function TranslatedText({ label, value, onChange, multiline = false }: { label: string; value: LocalizedText; onChange: (next: LocalizedText) => void; multiline?: boolean }) {
  return <div className={styles.translationGroup}>
    <label className={styles.field}><span>{label}</span>{multiline ? <textarea rows={3} value={value.pt} onChange={(event) => onChange({ ...value, pt: event.target.value })} /> : <input value={value.pt} onChange={(event) => onChange({ ...value, pt: event.target.value })} />}</label>
    <details className={styles.translationDetails}><summary>Adicionar traduções <ChevronDown size={14} /></summary>
      <div className={styles.fieldGrid}>
        {(["en", "es"] as const).map((locale) => <label className={styles.field} key={locale}><span>{locale === "en" ? "Inglês" : "Espanhol"}</span>{multiline ? <textarea rows={3} value={value[locale]} onChange={(event) => onChange({ ...value, [locale]: event.target.value })} /> : <input value={value[locale]} onChange={(event) => onChange({ ...value, [locale]: event.target.value })} />}</label>)}
      </div>
    </details>
  </div>;
}

export default function ProductForm({ product, products, categories, onChange, onPickAsset, onPublish, onPreview, onSaveDraft, onManageCategories, publishing, previewing }: {
  product: EditorProduct;
  products: EditorProduct[];
  categories: ContentCategory[];
  onChange: (next: EditorProduct) => void;
  onPickAsset: (target: AssetTarget) => void;
  onPublish: (product: EditorProduct) => void;
  onPreview: () => void;
  onSaveDraft: () => void;
  onManageCategories: () => void;
  publishing: boolean;
  previewing: boolean;
}) {
  const [step, setStep] = useState(0);
  const categoryNames = Object.fromEntries(categories.map((category) => [category.slug, category.name.pt]));
  const dragged = useRef<{ group: number; model?: number } | null>(null);
  const modelCount = product.modelGroups.reduce((count, group) => count + group.models.length, 0);
  const mainImage = product.heroImages[0] || "";
  const issues = [
    !product.name.pt.trim() ? "Falta o nome do produto." : "",
    !categories.some((category) => category.slug === product.category && category.name.pt.trim()) ? "Escolha uma categoria." : "",
    !mainImage ? "Falta uma imagem principal." : "",
    !modelCount ? "Este produto ainda não possui modelos." : "",
    !product.catalog.visible ? "Produto não está marcado para aparecer no catálogo." : "",
  ].filter(Boolean);
  const canPublish = Boolean(product.name.pt.trim() && mainImage && product.slug.trim() && categories.some((category) => category.slug === product.category && category.name.pt.trim()));

  function updateName(value: LocalizedText) {
    const used = products.filter((item) => item.id !== product.id).map((item) => item.slug);
    const autoSlug = !product.name.pt || product.slug === slugify(product.name.pt) || product.slug.startsWith("novo-produto");
    onChange({ ...product, name: value, slug: autoSlug ? uniqueSlug(value.pt, used, "novo-produto") : product.slug });
  }
  function updateMainImage(value: string) {
    const images = [...product.heroImages];
    if (images.length) images[0] = value;
    else images.push(value);
    onChange({ ...product, heroImages: images.filter(Boolean) });
  }
  function updateGroup(index: number, patch: Partial<EditorModelGroup>) {
    onChange({ ...product, modelGroups: product.modelGroups.map((group, position) => position === index ? { ...group, ...patch } : group) });
  }
  function updateModel(groupIndex: number, index: number, patch: Partial<EditorModel>) {
    const group = product.modelGroups[groupIndex];
    updateGroup(groupIndex, { models: group.models.map((model, position) => position === index ? { ...model, ...patch } : model) });
  }
  function updateSpec(index: number, patch: Partial<EditorSpecification>) {
    onChange({ ...product, specifications: product.specifications.map((item, position) => position === index ? { ...item, ...patch } : item) });
  }
  function dropGroup(target: number) {
    if (dragged.current?.model !== undefined || dragged.current === null) return;
    onChange({ ...product, modelGroups: moveItem(product.modelGroups, dragged.current.group, target) });
    dragged.current = null;
  }
  function dropModel(groupIndex: number, target: number) {
    if (dragged.current?.group !== groupIndex || dragged.current.model === undefined) return;
    const group = product.modelGroups[groupIndex];
    updateGroup(groupIndex, { models: moveItem(group.models, dragged.current.model, target) });
    dragged.current = null;
  }

  return <div className={styles.wizard}>
    <div className={styles.wizardHeading}><div><span className={styles.brand}>CADASTRO DE PRODUTO</span><h2>{product.name.pt || "Novo produto"}</h2></div><span className={styles.stepCount}>Etapa {step + 1} de 6</span></div>
    <nav className={styles.stepBar} aria-label="Etapas do cadastro">{steps.map((label, index) => <button type="button" key={label} className={index === step ? styles.stepActive : index < step ? styles.stepDone : ""} onClick={() => setStep(index)}><span>{index + 1}</span>{label}</button>)}</nav>

    {step === 0 && <section className={styles.wizardPanel}>
      <h3>Informações básicas</h3><p className={styles.stepIntro}>Comece pelo que o cliente verá. Português é o idioma principal.</p>
      <TranslatedText label="Nome do produto" value={product.name} onChange={updateName} />
      <div className={styles.fieldGrid}>
        <div className={styles.categorySelectRow}><label className={styles.field}><span>Categoria</span><select value={product.category} onChange={(event) => onChange({ ...product, category: event.target.value })}>{!product.category && <option value="">Selecione uma categoria</option>}{categories.filter((category) => category.name.pt.trim() && (category.active || category.slug === product.category)).map((category) => <option key={category.id} value={category.slug}>{category.name.pt}{!category.active ? " (inativa)" : ""}</option>)}{product.category && !categoryNames[product.category] && <option value={product.category}>{product.category}</option>}</select></label><button type="button" className={styles.toolbarButton} onClick={onManageCategories}>Gerenciar</button></div>
        <label className={styles.field}><span>Linha / família</span><input value={product.catalog.tag} placeholder="Ex.: Linha Leve" onChange={(event) => onChange({ ...product, catalog: { ...product.catalog, tag: event.target.value } })} /></label>
      </div>
      <TranslatedText label="Descrição curta" value={product.description} onChange={(description) => onChange({ ...product, description })} multiline />
      <details className={styles.advanced}><summary>Opções avançadas <ChevronDown size={14} /></summary><div className={styles.fieldGrid}><label className={styles.field}><span>Identificador da página (slug)</span><input value={product.slug} onChange={(event) => onChange({ ...product, slug: slugify(event.target.value) })} /></label><label className={styles.field}><span>ID interno</span><input value={product.id} readOnly /></label></div></details>
    </section>}

    {step === 1 && <section className={styles.wizardPanel}>
      <h3>Fotos</h3><p className={styles.stepIntro}>Escolha as imagens na biblioteca. A foto principal abre a página do produto.</p>
      <ImageChoice label="Foto principal" value={mainImage} onPick={() => onPickAsset({ kind: "heroMain" })} onRemove={() => updateMainImage("")} />
      <div className={styles.inlineHeading}><h4>Outras fotos</h4><button type="button" className={styles.smallButton} onClick={() => onPickAsset({ kind: "hero" })}><Plus size={14} />Adicionar foto</button></div>
      <div className={styles.miniGallery}>{product.heroImages.slice(1).map((image, index) => <div className={styles.miniImage} key={image + index}><Image src={image} alt="" fill sizes="130px" /><button type="button" aria-label={"Remover foto " + (index + 2)} onClick={() => onChange({ ...product, heroImages: product.heroImages.filter((_, position) => position !== index + 1) })}><Trash2 size={14} /></button></div>)}</div>
      <div className={styles.imageChoices}>
        <ImageChoice label="Imagem da página inicial" value={product.home.image} onPick={() => onPickAsset({ kind: "home" })} onRemove={() => onChange({ ...product, home: { ...product.home, image: "" } })} hint="Opcional: usa a foto principal se vazia" />
        <ImageChoice label="Imagem do catálogo" value={product.catalog.cardImage} onPick={() => onPickAsset({ kind: "catalogCard" })} onRemove={() => onChange({ ...product, catalog: { ...product.catalog, cardImage: "" } })} hint="Opcional: usa a foto principal se vazia" />
        <ImageChoice label="Imagem de destaque do catálogo" value={product.catalog.heroImage} onPick={() => onPickAsset({ kind: "catalogHero" })} onRemove={() => onChange({ ...product, catalog: { ...product.catalog, heroImage: "" } })} />
        <ImageChoice label="Ilustração dos modelos" value={product.modelIllustration} onPick={() => onPickAsset({ kind: "modelIllustration" })} onRemove={() => onChange({ ...product, modelIllustration: "" })} />
      </div>
      <details className={styles.advanced}><summary>Fotos complementares <ChevronDown size={14} /></summary><p className={styles.stepIntro}>Imagens de detalhes técnicos e aplicação, se existirem.</p><div className={styles.inlineHeading}><h4>Detalhes construtivos</h4><button type="button" className={styles.smallButton} onClick={() => onPickAsset({ kind: "detail" })}><Plus size={14} />Adicionar</button></div><div className={styles.miniGallery}>{product.images.details.map((image, index) => <div className={styles.miniImage} key={image + index}><Image src={image} alt="" fill sizes="130px" /><button type="button" aria-label={"Remover detalhe " + (index + 1)} onClick={() => onChange({ ...product, images: { ...product.images, details: product.images.details.filter((_, position) => position !== index) } })}><Trash2 size={14} /></button></div>)}</div><ImageChoice label="Imagem de aplicação" value={product.application.image} onPick={() => onPickAsset({ kind: "application" })} onRemove={() => onChange({ ...product, application: { ...product.application, image: "" } })} /></details>
    </section>}

    {step === 2 && <section className={styles.wizardPanel}>
      <div className={styles.inlineHeading}><div><h3>Modelos disponíveis</h3><p className={styles.stepIntro}>Crie linhas e adicione os códigos dos modelos. Arraste pelo ícone para mudar a ordem.</p></div><button type="button" className={styles.smallButton} onClick={() => onChange({ ...product, modelGroups: [...product.modelGroups, { id: newId(), name: emptyText(), models: [] }] })}><Plus size={14} />Nova linha</button></div>
      {product.modelGroups.length === 0 && <p className={styles.friendlyEmpty}>Nenhuma linha cadastrada. Clique em “Nova linha” para começar.</p>}
      {product.modelGroups.map((group, groupIndex) => <div className={styles.modelLine} key={group.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); dropGroup(groupIndex); }}>
        <div className={styles.modelLineHeader}><button type="button" className={styles.dragHandle} draggable aria-label="Arrastar linha" onDragStart={() => { dragged.current = { group: groupIndex }; }}><GripVertical size={18} /></button><input aria-label="Nome da linha" value={group.name.pt} placeholder={"Linha " + (groupIndex + 1)} onChange={(event) => updateGroup(groupIndex, { name: { ...group.name, pt: event.target.value } })} /><button type="button" className={styles.iconButton} aria-label="Subir linha" disabled={groupIndex === 0} onClick={() => onChange({ ...product, modelGroups: moveItem(product.modelGroups, groupIndex, groupIndex - 1) })}>↑</button><button type="button" className={styles.iconButton} aria-label="Descer linha" disabled={groupIndex === product.modelGroups.length - 1} onClick={() => onChange({ ...product, modelGroups: moveItem(product.modelGroups, groupIndex, groupIndex + 1) })}>↓</button><button type="button" className={styles.iconButton} aria-label="Excluir linha" onClick={() => onChange({ ...product, modelGroups: product.modelGroups.filter((_, position) => position !== groupIndex) })}><Trash2 size={15} /></button></div>
        {group.models.map((model, index) => <div className={styles.modelRow} key={index} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); event.stopPropagation(); dropModel(groupIndex, index); }}><button type="button" className={styles.dragHandle} draggable aria-label="Arrastar modelo" onDragStart={(event) => { event.stopPropagation(); dragged.current = { group: groupIndex, model: index }; }}><GripVertical size={17} /></button><label className={styles.field}><span>Código</span><input value={model.code} placeholder="P30" onChange={(event) => updateModel(groupIndex, index, { code: event.target.value })} /></label><label className={styles.field}><span>Nome opcional</span><input value={model.name} onChange={(event) => updateModel(groupIndex, index, { name: event.target.value })} /></label><label className={styles.field}><span>Dimensão opcional</span><input value={model.dimensions} onChange={(event) => updateModel(groupIndex, index, { dimensions: event.target.value })} /></label><button type="button" className={styles.iconButton} aria-label="Subir modelo" disabled={index === 0} onClick={() => updateGroup(groupIndex, { models: moveItem(group.models, index, index - 1) })}>↑</button><button type="button" className={styles.iconButton} aria-label="Descer modelo" disabled={index === group.models.length - 1} onClick={() => updateGroup(groupIndex, { models: moveItem(group.models, index, index + 1) })}>↓</button><button type="button" className={styles.iconButton} aria-label="Excluir modelo" onClick={() => updateGroup(groupIndex, { models: group.models.filter((_, position) => position !== index) })}><Trash2 size={15} /></button></div>)}
        <button type="button" className={styles.smallButton} onClick={() => updateGroup(groupIndex, { models: [...group.models, { code: "", name: "", dimensions: "", image: "", note: "" }] })}><Plus size={14} />Adicionar modelo</button>
      </div>)}
    </section>}

    {step === 3 && <section className={styles.wizardPanel}>
      <div className={styles.inlineHeading}><div><h3>Informações técnicas</h3><p className={styles.stepIntro}>Adicione apenas os dados confirmados. Esta etapa é opcional.</p></div><button type="button" className={styles.smallButton} onClick={() => onChange({ ...product, specifications: [...product.specifications, { label: "", value: "", unit: "" }] })}><Plus size={14} />Adicionar informação</button></div>
      <datalist id="spec-suggestions">{specSuggestions.map((value) => <option key={value} value={value} />)}</datalist>
      {product.specifications.length === 0 && <p className={styles.friendlyEmpty}>Nenhuma informação técnica adicionada.</p>}
      {product.specifications.map((spec, index) => <div className={styles.specRow} key={index}><label className={styles.field}><span>Campo</span><input list="spec-suggestions" value={spec.label} placeholder="Material" onChange={(event) => updateSpec(index, { label: event.target.value })} /></label><label className={styles.field}><span>Valor</span><input value={spec.value} placeholder="Alumínio" onChange={(event) => updateSpec(index, { value: event.target.value })} /></label><label className={styles.field}><span>Unidade opcional</span><input value={spec.unit} onChange={(event) => updateSpec(index, { unit: event.target.value })} /></label><button type="button" className={styles.iconButton} aria-label="Remover informação" onClick={() => onChange({ ...product, specifications: product.specifications.filter((_, position) => position !== index) })}><Trash2 size={16} /></button></div>)}
      <details className={styles.advanced}><summary>Outros dados técnicos <ChevronDown size={14} /></summary><div className={styles.imageChoices}><ImageChoice label="Desenho técnico" value={product.technicalDrawing} onPick={() => onPickAsset({ kind: "drawing" })} onRemove={() => onChange({ ...product, technicalDrawing: "" })} /><ImageChoice label="Ficha técnica em PDF" value={product.technicalFile} onPick={() => onPickAsset({ kind: "file" })} onRemove={() => onChange({ ...product, technicalFile: "" })} /></div></details>
    </section>}

    {step === 4 && <section className={styles.wizardPanel}>
      <h3>Onde aparece no site</h3><p className={styles.stepIntro}>Escolha os lugares em que este produto deve aparecer. A ordem é ajustada arrastando os produtos na lista à esquerda.</p>
      <div className={styles.visibilityOptions}><label><input type="checkbox" checked={product.home.featured} onChange={(event) => onChange({ ...product, home: { ...product.home, featured: event.target.checked } })} /><span><strong>Mostrar na página inicial</strong><small>Uma seleção de produtos da Selum na Home.</small></span></label><label><input type="checkbox" checked={product.catalog.visible} onChange={(event) => onChange({ ...product, catalog: { ...product.catalog, visible: event.target.checked } })} /><span><strong>Mostrar na página Produtos</strong><small>O produto entra na listagem do catálogo.</small></span></label><label><input type="checkbox" checked={product.catalog.heroFeatured} onChange={(event) => onChange({ ...product, catalog: { ...product.catalog, heroFeatured: event.target.checked } })} /><span><strong>Mostrar no destaque principal da página Produtos</strong><small>Use uma imagem própria de destaque para este espaço.</small></span></label></div>
      {product.catalog.heroFeatured && <ImageChoice label="Imagem de destaque do catálogo" value={product.catalog.heroImage} onPick={() => onPickAsset({ kind: "catalogHero" })} onRemove={() => onChange({ ...product, catalog: { ...product.catalog, heroImage: "" } })} />}
      <div className={styles.previewStrip}><div className={styles.previewImage}>{(product.catalog.cardImage || mainImage) && <Image src={product.catalog.cardImage || mainImage} alt="" fill sizes="180px" />}</div><div><small>PRÉVIA NO SITE</small><strong>{product.name.pt || "Nome do produto"}</strong><span>{categoryNames[product.category] || product.category}</span></div></div>
    </section>}

    {step === 5 && <section className={styles.wizardPanel}>
      <h3>Revisar e publicar</h3><p className={styles.stepIntro}>Confira o resumo antes de disponibilizar o produto no site.</p>
      <div className={styles.reviewSummary}><div className={styles.reviewImage}>{mainImage && <Image src={mainImage} alt="" fill sizes="220px" />}</div><div><h4>{product.name.pt || "Produto sem nome"}</h4><p>{categoryNames[product.category] || product.category}</p><p>{product.heroImages.length} foto(s) · {modelCount} modelo(s)</p><ul><li>{product.home.featured ? "✓ Página inicial" : "— Página inicial"}</li><li>{product.catalog.visible ? "✓ Catálogo" : "— Catálogo"}</li><li>{product.catalog.heroFeatured ? "✓ Destaque do catálogo" : "— Destaque do catálogo"}</li></ul></div></div>
      {issues.length > 0 && <div className={styles.reviewIssues}><strong>Antes de publicar, confira:</strong><ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div>}
      <div className={styles.reviewActions}><button type="button" className={styles.toolbarButton} onClick={onSaveDraft}>Salvar rascunho</button><button type="button" className={styles.toolbarButton} disabled={previewing} onClick={onPreview}>{previewing ? "Abrindo..." : "Visualizar página"}</button><button type="button" className={styles.publishButton} disabled={publishing || !canPublish} onClick={() => onPublish(product)}>{publishing ? "Publicando..." : "Publicar"}</button></div>
      <details className={styles.advanced}><summary>Opções avançadas <ChevronDown size={14} /></summary><div className={styles.fieldGrid}><label className={styles.field}><span>Identificador da página (slug)</span><input value={product.slug} onChange={(event) => onChange({ ...product, slug: slugify(event.target.value) })} /></label><label className={styles.field}><span>ID interno</span><input value={product.id} readOnly /></label></div><p className={styles.stepIntro}>Caminhos dos arquivos são gerenciados pela biblioteca visual e preservados no cadastro.</p></details>
    </section>}

    <div className={styles.wizardFooter}><button type="button" className={styles.toolbarButton} disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={15} />Voltar</button><span>As alterações são salvas automaticamente neste navegador.</span><button type="button" className={styles.primaryButton} disabled={step === steps.length - 1} onClick={() => setStep(step + 1)}>Próxima etapa <ArrowRight size={15} /></button></div>
  </div>;
}
