import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { readContactPageImages } from "@/lib/published-contact-images";
import ContactForm from "./ContactForm";
import styles from "./contato.module.css";

type PageProps = { params: Promise<{ locale: string }> };

export const dynamic = "force-dynamic";

const whatsapp = "https://api.whatsapp.com/send?phone=554734401445";
const maps = "https://www.google.com/maps/search/?api=1&query=Rua%20Tuiuti%2C%205300%2C%20Aventureiro%2C%20Joinville%2C%20SC";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: `${t("eyebrow")} | Selum`, description: t("heroIntro") };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const images = await readContactPageImages();

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section className={styles.hero} aria-labelledby="contact-title">
          <div className={styles.heroImage} aria-hidden="true">
            {images.hero && <Image src={images.hero} alt="" fill priority sizes="(max-width: 760px) 100vw, 70vw" />}
          </div>
          <div className={styles.heroInner}>
            <span className={styles.eyebrow}>{t("eyebrow")}</span>
            <h1 id="contact-title"><span>{t("heroLine1")}</span><span>{t("heroLine2")}</span><span>{t("heroLine3")}</span></h1>
            <p>{t("heroIntro")}</p>
          </div>
        </section>

        <section className={styles.contactSection} aria-label={t("contactSectionLabel")}>
          <div className={styles.contactGrid}>
            <div className={styles.direct}>
              <h2 className={styles.sectionLabel}>{t("directLabel")}</h2>
              <div className={styles.channels}>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.channel}>
                  <span className={styles.channelIcon}><MessageCircle size={25} strokeWidth={1.65} /></span>
                  <span className={styles.channelText}><span>{t("whatsappLabel")}</span><strong>+55 (47) 3440-1445</strong></span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <a href="tel:+554734401445" className={styles.channel}>
                  <span className={styles.channelIcon}><Phone size={24} strokeWidth={1.65} /></span>
                  <span className={styles.channelText}><span>{t("phoneLabel")}</span><strong>+55 (47) 3440-1445</strong></span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
                <a href="mailto:contato@selum.com.br" className={styles.channel}>
                  <span className={styles.channelIcon}><Mail size={24} strokeWidth={1.65} /></span>
                  <span className={styles.channelText}><span>{t("emailLabel")}</span><strong>contato@selum.com.br</strong></span>
                  <ArrowUpRight size={17} aria-hidden="true" />
                </a>
              </div>
              <div className={styles.directLocation}>
                <MapPin size={30} strokeWidth={1.5} aria-hidden="true" />
                <div><strong>{t("locationLabel")}</strong><span>Rua Tuiuti, 5.300 · Aventureiro<br />Joinville · SC</span><a href={maps} target="_blank" rel="noopener noreferrer">{t("viewMap")} <ArrowUpRight size={14} /></a></div>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>

        <section className={styles.location} aria-labelledby="location-title">
          <div className={styles.locationMap} aria-hidden="true">
            <iframe title="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=Rua%20Tuiuti%2C%205300%2C%20Aventureiro%2C%20Joinville%2C%20SC&t=&z=14&ie=UTF8&iwloc=&output=embed" tabIndex={-1} />
          </div>
          <div className={styles.locationPhoto} aria-hidden="true">{images.location && <Image src={images.location} alt="" fill sizes="(max-width: 760px) 100vw, 60vw" />}</div>
          <div className={styles.locationInner}>
            <span className={styles.eyebrow}>{t("whereLabel")}</span>
            <h2 id="location-title"><span>{t("factoryLine1")}</span><span>{t("factoryLine2")}</span></h2>
            <p>{t("factoryIntro")}</p>
            <a href={maps} target="_blank" rel="noopener noreferrer" className={styles.textLink}>{t("directions")} <ArrowUpRight size={17} /></a>
          </div>
        </section>

        <section className={styles.cta} aria-labelledby="contact-cta-title">
          <div className={styles.ctaImage} aria-hidden="true">{images.cta && <Image src={images.cta} alt="" fill sizes="(max-width: 760px) 100vw, 65vw" />}</div>
          <div className={styles.ctaInner}>
            <span className={styles.eyebrow}>{t("ctaEyebrow")}</span>
            <h2 id="contact-cta-title"><span>{t("ctaLine1")}</span><span>{t("ctaLine2")}</span></h2>
            <p>{t("ctaIntro")}</p>
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={styles.ctaButton}>{t("ctaButton")} <ArrowUpRight size={17} /></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
