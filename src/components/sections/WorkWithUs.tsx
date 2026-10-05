import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./WorkWithUs.module.css";

const teamImage = "/images/selum-equipe-fabrica-v2.png";

export default function WorkWithUs() {
  const t = useTranslations("workWithUs");

  return (
    <section className={styles.section} aria-labelledby="work-with-us-title">
      <Image src={teamImage} alt="" fill sizes="100vw" className={styles.teamPhoto} aria-hidden="true" />
      <Image src={teamImage} alt="" fill sizes="100vw" className={styles.facadePhoto} aria-hidden="true" />
      <div className={styles.overlay} aria-hidden="true" />

      <div className={styles.content}>
        <div className={styles.copy}>
          <h2 id="work-with-us-title">{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>
        <a
          className={styles.button}
          href="mailto:rh@selum.com.br?subject=Curr%C3%ADculo%20-%20Quero%20fazer%20parte%20da%20equipe%20Selum"
        >
          {t("button")} <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
