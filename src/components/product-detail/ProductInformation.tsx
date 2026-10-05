import Image from "next/image";
import type { ProductPageCopy, ProductPageData, ProductPageLocale } from "@/lib/product-page-data";
import styles from "./ProductPage.module.css";

export default function ProductInformation({
  data,
  copy,
  locale,
}: {
  data: ProductPageData;
  copy: ProductPageCopy;
  locale: ProductPageLocale;
}) {
  const specifications = data.specifications ?? [];
  const groups = (data.modelGroups ?? (data.models?.length ? [{ id: "legacy", name: {}, models: data.models }] : []))
    .filter((group) => group.models.length > 0);
  if (specifications.length === 0 && groups.length === 0) return null;

  return (
    <section className={styles.informationSection} aria-label={copy.informationLabel}>
      <div className={`${styles.shell} ${styles.informationPanel} ${specifications.length === 0 || groups.length === 0 ? styles.informationSingle : ""}`}>
        {specifications.length > 0 && <div className={styles.specifications}>
          <h2>{copy.specsTitle}</h2>
            <dl className={styles.specificationList}>
              {specifications.map((item) => (
                <div key={item.label} className={styles.specificationRow}>
                  <dt>{item.label}</dt><dd>{item.value}</dd>
                </div>
              ))}
            </dl>
        </div>}
        {groups.length > 0 && <div className={styles.models}>
          <h2>{copy.modelsTitle}</h2>
          {groups.map((group) => (
            <div className={styles.modelGroup} key={group.id}>
              {(group.name[locale] || group.name.pt || group.name.en || group.name.es) && <h3>{group.name[locale] || group.name.pt || group.name.en || group.name.es}</h3>}
              <div className={styles.modelGrid}>
                {group.models.map((model, index) => {
                  const illustration = model.image || data.modelIllustration;
                  return (
                    <div className={styles.modelButton} key={`${model.code ?? model.name ?? "modelo"}-${index}`}>
                      {illustration && <span className={styles.modelImage}><Image src={illustration} alt="" fill sizes="46px" /></span>}
                      <span className={styles.modelText}>
                        <strong>{model.code || model.localizedName?.[locale] || model.name}</strong>
                        {model.code && model.name && model.code !== model.name && <small>{model.localizedName?.[locale] || model.name}</small>}
                        {model.dimensions && <small>{model.dimensions}</small>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>}
      </div>
    </section>
  );
}
