import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, ClipboardCheck, Cog, Package, PencilRuler, Scissors, Wrench } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { readAboutPageImages } from "@/lib/published-about-images";
import styles from "./quem-somos.module.css";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const processKeys = [
  "stepEngineering",
  "stepCutting",
  "stepWelding",
  "stepFinishing",
  "stepQuality",
  "stepShipping",
] as const;
const processIcons = [PencilRuler, Scissors, Wrench, Cog, ClipboardCheck, Package] as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return { title: `${t("eyebrow")} | Selum`, description: t("heroIntro") };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  const images = await readAboutPageImages();

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="about-title">
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <span className={styles.eyebrow}>{t("eyebrow")}</span>
              <h1 id="about-title"><span>{t("heroLine1")}</span><span>{t("heroLine2")}</span><span>{t("heroLine3")}</span></h1>
              <p>{t("heroIntro")}</p>
            </div>
            <div className={styles.heroVisual}>
              <Image src={images.heroFactory} alt={t("factoryAlt")} fill priority sizes="(max-width: 760px) 100vw, 58vw" />
            </div>
          </div>
        </section>

        <div className={styles.story}>
          <section className={styles.manufacturing} aria-labelledby="manufacturing-title">
            <div className={styles.manufacturingVisual}>
              <Image src={images.manufacturing} alt={t("manufacturingAlt")} fill sizes="(max-width: 760px) 80vw, 42vw" />
            </div>
            <div className={styles.manufacturingCopy}>
              <span className={styles.eyebrow}>{t("manufacturingEyebrow")}</span>
              <h2 id="manufacturing-title"><span>{t("manufacturingLine1")}</span><span>{t("manufacturingLine2")}</span><span>{t("manufacturingLine3")}</span></h2>
              <p>{t("manufacturingIntro")}</p>
            </div>
          </section>

          <section id="processo" className={styles.process} aria-labelledby="process-title">
            <div className={styles.processHeading}>
              <div><span className={styles.eyebrow}>{t("processEyebrow")}</span><h2 id="process-title">{t("processTitle")}</h2></div>
              <p>{t("processIntro")}</p>
            </div>
            <ol className={styles.processList}>
              {processKeys.map((key, index) => {
                const Icon = processIcons[index];
                return <li key={key}><Icon className={styles.processIcon} size={32} strokeWidth={1.45} aria-hidden="true" /><span className={styles.processNumber}>{String(index + 1).padStart(2, "0")}</span><strong>{t(key)}</strong></li>;
              })}
            </ol>
          </section>

          <section id="qualidade" className={styles.details} aria-labelledby="details-title">
            <div className={styles.detailsBackdrop} aria-hidden="true">{images.detailsBackdrop && <Image src={images.detailsBackdrop} alt="" fill sizes="100vw" />}</div>
            <div className={styles.detailsStructure} aria-hidden="true"><Image src={images.detailsStructure} alt="" fill sizes="(max-width: 760px) 100vw, 70vw" /></div>
            <div className={styles.detailsHeading}>
              <span className={styles.eyebrow}>{t("detailsEyebrow")}</span>
              <h2 id="details-title">{t("detailsTitle")}</h2>
              <p>{t("manufacturingNote")}</p>
            </div>
          </section>
        </div>

        <section className={styles.team} aria-labelledby="team-title">
          <div className={styles.teamCopy}>
            <span className={styles.eyebrow}>{t("teamEyebrow")}</span>
            <h2 id="team-title"><span>{t("teamLine1")}</span><span>{t("teamLine2")}</span></h2>
            <p>{t("teamIntro")}</p>
          </div>
          <div className={styles.teamVisual}><Image src={images.team} alt={t("teamAlt")} fill sizes="(max-width: 760px) 100vw, 94vw" /></div>
        </section>

        <section className={styles.presence} aria-labelledby="presence-title">
          <div className={styles.presenceMap} aria-hidden="true">{images.presence && <Image src={images.presence} alt="" fill sizes="(max-width: 760px) 100vw, 60vw" />}</div>
          <div className={styles.presenceInner}>
            <span className={styles.eyebrow}>{t("presenceEyebrow")}</span>
            <h2 id="presence-title"><span>{t("presenceLine1")}</span><span>{t("presenceLine2")}</span></h2>
            <p>{t("presenceIntro")}</p>
            <span className={styles.presenceLocation}>{t("presenceLocation")}</span>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="about-cta-title">
          <div className={styles.ctaVisual} aria-hidden="true">{images.cta && <Image src={images.cta} alt="" fill sizes="(max-width: 760px) 100vw, 50vw" />}</div>
          <div className={styles.ctaInner}>
            <span className={styles.eyebrow}>{t("ctaEyebrow")}</span>
            <h2 id="about-cta-title"><span>{t("ctaLine1")}</span><span>{t("ctaLine2")}</span></h2>
            <p>{t("ctaIntro")}</p>
            <a href="https://api.whatsapp.com/send?phone=554734401445" target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>{t("ctaButton")}<ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
