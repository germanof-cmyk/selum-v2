"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Box, FileText, Headphones, Settings2 } from "lucide-react";
import styles from "./contato.module.css";

const topics = [
  { key: "quote", Icon: FileText },
  { key: "products", Icon: Box },
  { key: "special", Icon: Settings2 },
  { key: "support", Icon: Headphones },
] as const;

export default function ContactForm() {
  const t = useTranslations("contactPage");
  const [subject, setSubject] = useState("");
  const [handoff, setHandoff] = useState(false);
  const subjectRef = useRef<HTMLSelectElement>(null);

  function selectTopic(topic: string) {
    setSubject(topic);
    setHandoff(false);
    subjectRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    subjectRef.current?.focus({ preventScroll: true });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const company = String(data.get("company") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !phone || !email || !subject || !message) return;

    const lines = [
      `${t("nameLabel")}: ${name}`,
      ...(company ? [`${t("companyLabel")}: ${company}`] : []),
      `${t("whatsappField")}: ${phone}`,
      `${t("emailField")}: ${email}`,
      `${t("subjectLabel")}: ${t(`topic${subject}`)}`,
      "",
      `${t("messageLabel")}:`,
      message,
    ];

    const emailSubject = `Selum | ${t(`topic${subject}`)}`;
    const mailto = `mailto:contato@selum.com.br?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    setHandoff(true);
    window.location.href = mailto;
  }

  return (
    <>
      <div className={styles.formArea} id="formulario">
        <span className={styles.eyebrow}>{t("formEyebrow")}</span>
        <h2>{t("formTitle")}</h2>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.formGrid}>
            <label>{t("nameLabel")}<span aria-hidden="true">*</span><input name="name" autoComplete="name" required maxLength={120} placeholder={t("namePlaceholder")} /></label>
            <label>{t("companyLabel")}<input name="company" autoComplete="organization" maxLength={120} placeholder={t("companyPlaceholder")} /></label>
            <label>{t("whatsappField")}<span aria-hidden="true">*</span><input name="phone" type="tel" autoComplete="tel" required maxLength={40} placeholder={t("phonePlaceholder")} /></label>
            <label>{t("emailField")}<span aria-hidden="true">*</span><input name="email" type="email" autoComplete="email" required maxLength={160} placeholder={t("emailPlaceholder")} /></label>
            <label className={styles.wide}>{t("subjectLabel")}<span aria-hidden="true">*</span><select ref={subjectRef} name="subject" required value={subject} onChange={(event) => { setSubject(event.target.value); setHandoff(false); }}><option value="">{t("subjectPlaceholder")}</option>{topics.map(({ key }) => <option key={key} value={key}>{t(`topic${key}`)}</option>)}</select></label>
            <label className={styles.wide}>{t("messageLabel")}<span aria-hidden="true">*</span><textarea name="message" required maxLength={3000} rows={4} placeholder={t("messagePlaceholder")} /></label>
          </div>
          <button type="submit" className={styles.submitButton}>{t("submitButton")} <ArrowRight size={17} aria-hidden="true" /></button>
          <p className={styles.formHelp}>{handoff ? t("handoffNote") : t("formNote")}</p>
        </form>
      </div>
      <div className={styles.reasons} aria-labelledby="reasons-title">
        <h2 id="reasons-title" className={styles.sectionLabel}>{t("reasonsTitle")}</h2>
        <div className={styles.reasonList}>
          {topics.map(({ key, Icon }) => <button type="button" key={key} onClick={() => selectTopic(key)} className={styles.reason}>
            <Icon size={29} strokeWidth={1.5} aria-hidden="true" /><span>{t(`topic${key}`)}</span><ArrowRight size={16} aria-hidden="true" />
          </button>)}
        </div>
      </div>
    </>
  );
}
