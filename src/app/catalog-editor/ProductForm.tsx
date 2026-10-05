"use client";

import Image from "next/image";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Trash2 } from "lucide-react";
import type {
  EditorBenefit,
  EditorModel,
  EditorModelGroup,
  EditorProduct,
  EditorSpecification,
  LocalizedText,
} from "@/lib/catalog-editor";
import { emptyText, newId } from "@/lib/catalog-editor";
import styles from "./catalog-editor.module.css";

export type AssetTarget = {
  kind: "hero" | "home" | "catalogCard" | "catalogHero" | "modelIllustration" | "application" | "detail" | "model" | "drawing" | "file";
  index?: number;
  groupIndex?: number;
};

function moveItem<T>(items: T[], index: number, offset: number) {
  const next = [...items];
  const target = index + offset;
  if (target < 0 || target >= items.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function SectionTitle({ title, onAdd, addLabel }: { title: string; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className={styles.sectionTitle}>
      <h2>{title}</h2>
      {onAdd && <button type="button" className={styles.smallButton} onClick={onAdd}><Plus size={14} />{addLabel}</button>}
    </div>
  );
}

function LocalizedFields({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
}) {
  return (
    <div className={styles.localizedGroup}>
      <span className={styles.fieldLegend}>{label}</span>
      <div className={styles.languageGrid}>
        {(["pt", "es", "en"] as const).map((locale) => (
          <label className={styles.field} key={locale}>
            <span>{locale.toUpperCase()}</span>
            {multiline
              ? <textarea rows={3} value={value[locale]} onChange={(event) => onChange({ ...value, [locale]: event.target.value })} />
              : <input value={value[locale]} onChange={(event) => onChange({ ...value, [locale]: event.target.value })} />}
          </label>
        ))}
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  onPick,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onPick: () => void;
}) {
  return (
    <div className={styles.field}>
      <span>{label}</span>
      <div className={styles.pathControl}>
        {value.startsWith("/") && <span className={styles.pathThumb}><Image src={value} alt="" fill sizes="38px" /></span>}
        <input aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} placeholder="/images/products/..." />
        <button type="button" className={styles.smallButton} onClick={onPick}><ImagePlus size={14} />Escolher</button>
      </div>
      {value && <small className={styles.assetPath}>{value.split("/").pop()} ? {value}</small>}
    </div>
  );
}

function RowActions({ index, length, move, remove }: {
  index: number;
  length: number;
  move: (offset: number) => void;
  remove: () => void;
}) {
  return (
    <div className={styles.rowActions}>
      <button type="button" title="Subir" aria-label="Subir" disabled={index === 0} onClick={() => move(-1)}><ArrowUp size={14} /></button>
      <button type="button" title="Descer" aria-label="Descer" disabled={index === length - 1} onClick={() => move(1)}><ArrowDown size={14} /></button>
      <button type="button" title="Remover" aria-label="Remover" onClick={remove}><Trash2 size={14} /></button>
    </div>
  );
}

export default function ProductForm({
  product,
  products,
  onChange,
  onPickAsset,
}: {
  product: EditorProduct;
  products: EditorProduct[];
  onChange: (product: EditorProduct) => void;
  onPickAsset: (target: AssetTarget) => void;
}) {
  function changeGroup(index: number, patch: Partial<EditorModelGroup>) {
    onChange({ ...product, modelGroups: product.modelGroups.map((group, position) => position === index ? { ...group, ...patch } : group) });
  }
  function changeModel(groupIndex: number, index: number, patch: Partial<EditorModel>) {
    const group = product.modelGroups[groupIndex];
    changeGroup(groupIndex, { models: group.models.map((model, position) => position === index ? { ...model, ...patch } : model) });
  }
  function changeSpec(index: number, patch: Partial<EditorSpecification>) {
    onChange({ ...product, specifications: product.specifications.map((spec, position) => position === index ? { ...spec, ...patch } : spec) });
  }
  function changeBenefit(index: number, patch: Partial<EditorBenefit>) {
    onChange({ ...product, benefits: product.benefits.map((benefit, position) => position === index ? { ...benefit, ...patch } : benefit) });
  }
  function changeImageList(index: number, value: string) {
    onChange({ ...product, images: { ...product.images, details: product.images.details.map((image, position) => position === index ? value : image) } });
  }

  return (
    <div className={styles.form}>
      <section className={styles.section}>
        <SectionTitle title="Informações do produto" />
        <div className={styles.fieldGrid}>
          <label className={styles.field}><span>Slug</span><input value={product.slug} placeholder="ex.: torre-box-truss" onChange={(event) => onChange({ ...product, slug: event.target.value.toLowerCase().replace(/\s+/g, "-") })} /></label>
          <label className={styles.field}><span>Categoria</span><input list="selum-categories" value={product.category} onChange={(event) => onChange({ ...product, category: event.target.value })} /><datalist id="selum-categories"><option value="estrutural" /><option value="acessorios" /><option value="acesso" /></datalist></label>
          <label className={styles.field}><span>Status</span><select value={product.status} onChange={(event) => onChange({ ...product, status: event.target.value as EditorProduct["status"] })}><option value="draft">Rascunho</option><option value="review">Revisar</option><option value="approved">Aprovado</option></select></label>
          <label className={styles.field}><span>Ativo</span><select value={product.active ? "yes" : "no"} onChange={(event) => onChange({ ...product, active: event.target.value === "yes" })}><option value="yes">Sim</option><option value="no">Não</option></select></label>
        </div>
        <LocalizedFields label="Nome" value={product.name} onChange={(name) => onChange({ ...product, name })} />
        <LocalizedFields label="Descrição" value={product.description} onChange={(description) => onChange({ ...product, description })} multiline />
      </section>

      <section className={styles.section}>
        <SectionTitle title="Destaque na Home" />
        <div className={styles.fieldGrid}>
          <label className={styles.field}><span>Exibir este produto na Home</span><select value={product.home.featured ? "yes" : "no"} onChange={(event) => onChange({ ...product, home: { ...product.home, featured: event.target.value === "yes" } })}><option value="no">Não</option><option value="yes">Sim</option></select></label>
          <label className={styles.field}><span>Ordem na Home</span><input type="number" min="1" step="1" value={product.home.order ?? ""} placeholder="1" onChange={(event) => onChange({ ...product, home: { ...product.home, order: event.target.value === "" ? null : Number(event.target.value) } })} /></label>
        </div>
        <div className={styles.homeImageField}>
          <ImageField label="Imagem para Home" value={product.home.image} onChange={(image) => onChange({ ...product, home: { ...product.home, image } })} onPick={() => onPickAsset({ kind: "home" })} />
          <p className={styles.emptyHint}>Sem imagem própria, será usada a primeira imagem de destaque.</p>
        </div>
        <div className={styles.homePreview}>
          <span className={styles.fieldLegend}>Prévia do card</span>
          <div className={styles.homePreviewCard}>
            <div className={styles.homePreviewImage}>
              {(product.home.image || product.heroImages[0]) && <Image src={product.home.image || product.heroImages[0]} alt="" fill sizes="180px" />}
            </div>
            <div><small>{product.category}</small><strong>{product.name.pt || product.slug || "Produto"}</strong><span>Ver produto →</span></div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <SectionTitle title="P?gina de Produtos" />
        <div className={styles.fieldGrid}>
          <label className={styles.field}><span>Exibir no cat?logo</span><select value={product.catalog.visible ? "yes" : "no"} onChange={(event) => onChange({ ...product, catalog: { ...product.catalog, visible: event.target.value === "yes" } })}><option value="no">N?o</option><option value="yes">Sim</option></select></label>
          <label className={styles.field}><span>Ordem no cat?logo</span><input type="number" min="1" step="1" value={product.catalog.order ?? ""} onChange={(event) => onChange({ ...product, catalog: { ...product.catalog, order: event.target.value === "" ? null : Number(event.target.value) } })} /></label>
        </div>
        <div className={styles.homeImageField}><ImageField label="Imagem do card" value={product.catalog.cardImage} onChange={(cardImage) => onChange({ ...product, catalog: { ...product.catalog, cardImage } })} onPick={() => onPickAsset({ kind: "catalogCard" })} /><p className={styles.emptyHint}>Sem imagem própria, será usada a primeira imagem de destaque da página individual.</p></div>
        <div className={styles.homePreview}><span className={styles.fieldLegend}>Pr?via do card</span><div className={styles.homePreviewCard}><div className={styles.homePreviewImage}>{(product.catalog.cardImage || product.heroImages[0]) && <Image src={product.catalog.cardImage || product.heroImages[0]} alt="" fill sizes="180px" />}</div><div><small>{product.category}</small><strong>{product.name.pt || product.slug || "Produto"}</strong><span>Ver produto ?</span></div></div></div>
      </section>

      <section className={styles.section}>
        <SectionTitle title="Hero da P?gina de Produtos" />
        <div className={styles.fieldGrid}>
          <label className={styles.field}><span>Exibir no hero</span><select value={product.catalog.heroFeatured ? "yes" : "no"} onChange={(event) => onChange({ ...product, catalog: { ...product.catalog, heroFeatured: event.target.value === "yes" } })}><option value="no">N?o</option><option value="yes">Sim</option></select></label>
          <label className={styles.field}><span>Ordem no hero</span><input type="number" min="1" step="1" value={product.catalog.heroOrder ?? ""} onChange={(event) => onChange({ ...product, catalog: { ...product.catalog, heroOrder: event.target.value === "" ? null : Number(event.target.value) } })} /></label>
        </div>
        <div className={styles.homeImageField}><ImageField label="Imagem do hero" value={product.catalog.heroImage} onChange={(heroImage) => onChange({ ...product, catalog: { ...product.catalog, heroImage } })} onPick={() => onPickAsset({ kind: "catalogHero" })} /><p className={styles.emptyHint}>O hero usa apenas esta imagem. Sem imagem, o produto não entra no carrossel.</p></div>
        <div className={styles.homePreview}><span className={styles.fieldLegend}>Pr?via do hero</span><div className={styles.catalogHeroPreview}>{product.catalog.heroImage && <Image src={product.catalog.heroImage} alt="" fill sizes="320px" />}</div></div>
      </section>

      <section className={styles.section}>
        <SectionTitle title="Modelos disponíveis" addLabel="Nova linha" onAdd={() => onChange({ ...product, modelGroups: [...product.modelGroups, { id: newId(), name: emptyText(), models: [] }] })} />
        {product.modelGroups.length === 0 && <p className={styles.emptyHint}>Nenhuma linha ou modelo cadastrado.</p>}
        {product.modelGroups.map((group, groupIndex) => (
          <div className={styles.modelGroupEditor} key={group.id}>
            <div className={styles.repeatHeader}>
              <strong>{group.name.pt || `Linha ${groupIndex + 1}`}</strong>
              <RowActions index={groupIndex} length={product.modelGroups.length} move={(offset) => onChange({ ...product, modelGroups: moveItem(product.modelGroups, groupIndex, offset) })} remove={() => onChange({ ...product, modelGroups: product.modelGroups.filter((_, position) => position !== groupIndex) })} />
            </div>
            <LocalizedFields label="Nome da linha (opcional)" value={group.name} onChange={(name) => changeGroup(groupIndex, { name })} />
            <div className={styles.subsectionHeader}><h3>Modelos desta linha</h3><button type="button" className={styles.smallButton} onClick={() => changeGroup(groupIndex, { models: [...group.models, { code: "", name: "", dimensions: "", image: "", note: "" }] })}><Plus size={14} />Adicionar modelo</button></div>
            {group.models.map((model, index) => (
              <div className={styles.repeatRow} key={index}>
                <div className={styles.repeatHeader}><strong>Modelo {index + 1}</strong><RowActions index={index} length={group.models.length} move={(offset) => changeGroup(groupIndex, { models: moveItem(group.models, index, offset) })} remove={() => changeGroup(groupIndex, { models: group.models.filter((_, position) => position !== index) })} /></div>
                <div className={styles.fieldGrid}>
                  <label className={styles.field}><span>Código</span><input value={model.code} onChange={(event) => changeModel(groupIndex, index, { code: event.target.value })} /></label>
                  <label className={styles.field}><span>Nome (opcional)</span><input value={model.name} onChange={(event) => changeModel(groupIndex, index, { name: event.target.value })} /></label>
                  <label className={styles.field}><span>Dimensão (opcional)</span><input value={model.dimensions} onChange={(event) => changeModel(groupIndex, index, { dimensions: event.target.value })} /></label>
                  <label className={styles.field}><span>Observação (opcional)</span><input value={model.note} onChange={(event) => changeModel(groupIndex, index, { note: event.target.value })} /></label>
                </div>
                <ImageField label="Imagem própria do modelo (opcional)" value={model.image} onChange={(image) => changeModel(groupIndex, index, { image })} onPick={() => onPickAsset({ kind: "model", groupIndex, index })} />
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <SectionTitle title="Especificações" addLabel="Adicionar especificação" onAdd={() => onChange({ ...product, specifications: [...product.specifications, { label: "", value: "", unit: "" }] })} />
        {product.specifications.length === 0 && <p className={styles.emptyHint}>Adicione apenas dados confirmados.</p>}
        {product.specifications.map((spec, index) => (
          <div className={styles.repeatRow} key={index}>
            <div className={styles.repeatHeader}><strong>Especificação {index + 1}</strong><RowActions index={index} length={product.specifications.length} move={(offset) => onChange({ ...product, specifications: moveItem(product.specifications, index, offset) })} remove={() => onChange({ ...product, specifications: product.specifications.filter((_, position) => position !== index) })} /></div>
            <div className={styles.specGrid}>
              <label className={styles.field}><span>Label</span><input value={spec.label} onChange={(event) => changeSpec(index, { label: event.target.value })} /></label>
              <label className={styles.field}><span>Valor</span><input value={spec.value} onChange={(event) => changeSpec(index, { value: event.target.value })} /></label>
              <label className={styles.field}><span>Unidade</span><input value={spec.unit} onChange={(event) => changeSpec(index, { unit: event.target.value })} /></label>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <SectionTitle title="Benefícios" addLabel="Adicionar benefício" onAdd={() => onChange({ ...product, benefits: [...product.benefits, { text: { pt: "", es: "", en: "" }, icon: "" }] })} />
        {product.benefits.map((benefit, index) => (
          <div className={styles.repeatRow} key={index}>
            <div className={styles.repeatHeader}><strong>Benefício {index + 1}</strong><RowActions index={index} length={product.benefits.length} move={(offset) => onChange({ ...product, benefits: moveItem(product.benefits, index, offset) })} remove={() => onChange({ ...product, benefits: product.benefits.filter((_, position) => position !== index) })} /></div>
            <LocalizedFields label="Texto" value={benefit.text} onChange={(text) => changeBenefit(index, { text })} />
            <label className={styles.field}><span>Ícone (opcional)</span><input list="benefit-icons" value={benefit.icon} onChange={(event) => changeBenefit(index, { icon: event.target.value })} /><datalist id="benefit-icons"><option value="Layers" /><option value="Lightbulb" /><option value="Box" /><option value="Factory" /></datalist></label>
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <SectionTitle title="P?gina Individual ? Imagens" />
        <div className={styles.subsectionHeader}><h3>Imagens de destaque</h3><button type="button" className={styles.smallButton} onClick={() => onPickAsset({ kind: "hero" })}><ImagePlus size={14} />Adicionar imagem</button></div>
        <p className={styles.emptyHint}>A primeira imagem será a principal do hero. Apenas estas imagens aparecem na galeria.</p>
        {product.heroImages.map((image, index) => (
          <div className={styles.imageRow} key={index}>
            <span className={styles.imageRowThumb}>{image.startsWith("/") && <Image src={image} alt="" fill sizes="48px" />}</span>
            <input aria-label={`Imagem de destaque ${index + 1}`} value={image} onChange={(event) => onChange({ ...product, heroImages: product.heroImages.map((item, position) => position === index ? event.target.value : item) })} />
            <RowActions index={index} length={product.heroImages.length} move={(offset) => onChange({ ...product, heroImages: moveItem(product.heroImages, index, offset) })} remove={() => onChange({ ...product, heroImages: product.heroImages.filter((_, position) => position !== index) })} />
          </div>
        ))}
        <div className={styles.subsectionHeader}><h3>Ilustração dos modelos</h3></div>
        <ImageField label="Imagem compartilhada pelos modelos sem imagem própria" value={product.modelIllustration} onChange={(modelIllustration) => onChange({ ...product, modelIllustration })} onPick={() => onPickAsset({ kind: "modelIllustration" })} />
        <div className={styles.subsectionHeader}><h3>Detalhes construtivos</h3><button type="button" className={styles.smallButton} onClick={() => onPickAsset({ kind: "detail" })}><ImagePlus size={14} />Adicionar imagem</button></div>
        {product.images.details.map((image, index) => (
          <div className={styles.imageRow} key={index}>
            <span className={styles.imageRowThumb}>{image.startsWith("/") && <Image src={image} alt="" fill sizes="48px" />}</span>
            <input aria-label={`Imagem ${index + 1} dos detalhes`} value={image} onChange={(event) => changeImageList(index, event.target.value)} />
            <RowActions index={index} length={product.images.details.length} move={(offset) => onChange({ ...product, images: { ...product.images, details: moveItem(product.images.details, index, offset) } })} remove={() => onChange({ ...product, images: { ...product.images, details: product.images.details.filter((_, position) => position !== index) } })} />
          </div>
        ))}
      </section>

      <section className={styles.section}>
        <SectionTitle title="Aplicação" />
        <ImageField label="Imagem de aplicação" value={product.application.image} onChange={(image) => onChange({ ...product, application: { ...product.application, image } })} onPick={() => onPickAsset({ kind: "application" })} />
        <LocalizedFields label="Título" value={product.application.title} onChange={(title) => onChange({ ...product, application: { ...product.application, title } })} />
        <LocalizedFields label="Texto" value={product.application.text} onChange={(text) => onChange({ ...product, application: { ...product.application, text } })} multiline />
      </section>

      <section className={styles.section}>
        <SectionTitle title="Desenho e ficha técnica" />
        <ImageField label="Desenho técnico" value={product.technicalDrawing} onChange={(technicalDrawing) => onChange({ ...product, technicalDrawing })} onPick={() => onPickAsset({ kind: "drawing" })} />
        <label className={styles.field}><span>Arquivo PDF (opcional)</span><div className={styles.pathControl}><input value={product.technicalFile} onChange={(event) => onChange({ ...product, technicalFile: event.target.value })} placeholder="/fichas/produto.pdf" /><button type="button" className={styles.smallButton} onClick={() => onPickAsset({ kind: "file" })}>Escolher</button></div></label>
      </section>

      <section className={styles.section}>
        <SectionTitle title="Produtos relacionados" />
        <div className={styles.relatedGrid}>
          {products.filter((other) => other.id !== product.id).map((other) => (
            <label key={other.id} className={styles.checkRow}>
              <input type="checkbox" checked={product.relatedProducts.includes(other.slug)} disabled={!other.slug} onChange={(event) => onChange({ ...product, relatedProducts: event.target.checked ? [...product.relatedProducts, other.slug] : product.relatedProducts.filter((slug) => slug !== other.slug) })} />
              <span>{other.name.pt || other.slug || "Sem nome"}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
