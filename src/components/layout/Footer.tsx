import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const products = ["Box Truss", "Praticáveis", "Bases & Cubos", "Escadas", "Projetos Sob Medida"];
  const company = ["Quem Somos", "Nosso Processo", "Projetos", "Certificações", "Contato"];

  return (
    <>
      <style>{`
        .footer {
          background: linear-gradient(135deg, #E8EDF2 0%, #F0F4F8 50%, #E8EDF2 100%);
          border-top: 1px solid rgba(33,150,243,0.12);
          font-family: var(--font-space), 'Helvetica Neue', Arial, sans-serif;
        }
        .footer-accent {
          height: 2px;
          background: linear-gradient(90deg, transparent, #1565C0 25%, #00B4D8 50%, #1565C0 75%, transparent);
          background-color: #E8EDF2;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr 1fr;
          gap: 48px;
          padding: 52px 64px 48px;
          border-bottom: 1px solid rgba(33,150,243,0.08);
        }
        .ft-logo { margin-bottom: 16px; }
        .ft-logo img {
          height: 90px;
          width: auto;
          object-fit: contain;
          filter: drop-shadow(0 0 16px rgba(33,150,243,0.5)) brightness(1.15);
        }
        .ft-desc {
          font-size: 12px;
          color: rgba(10,30,60,0.5);
          line-height: 1.7;
          max-width: 220px;
          margin-bottom: 20px;
        }
        .ft-social { display: flex; gap: 8px; }
        .ft-social-btn {
          width: 36px; height: 36px;
          border: 1px solid rgba(33,150,243,0.2);
          display: flex; align-items: center; justify-content: center;
          color: rgba(176,190,197,0.4);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          cursor: pointer; text-decoration: none;
        }
        .ft-social-btn:hover { border-color: #2196F3; color: #2196F3; background: rgba(33,150,243,0.08); }
        .ft-col-title {
          font-family: var(--font-orbitron), 'Helvetica Neue', Arial, sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: rgba(10,30,60,0.7);
          margin-bottom: 18px; padding-bottom: 10px;
          border-bottom: 1px solid rgba(33,150,243,0.1);
        }
        .ft-links { display: flex; flex-direction: column; gap: 10px; }
        .ft-link {
          font-size: 12px; color: rgba(10,30,60,0.5);
          text-decoration: none; transition: color 0.2s;
          display: flex; align-items: center; gap: 6px;
        }
        .ft-link::before { content: '›'; color: rgba(33,150,243,0.3); font-size: 14px; }
        .ft-link:hover { color: #1565C0; }
        .ft-link:hover::before { color: #2196F3; }
        .ft-contact-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 12px; }
        .ft-contact-icon { font-size: 13px; color: #2196F3; margin-top: 1px; flex-shrink: 0; }
        .ft-contact-text { font-size: 12px; color: rgba(10,30,60,0.5); line-height: 1.55; }
        .footer-bottom {
          padding: 20px 64px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; flex-wrap: wrap;
        }
        .ft-copy { font-size: 11px; color: rgba(10,30,60,0.4); }
        .ft-copy span { color: #1565C0; }
        .ft-bottom-links { display: flex; gap: 20px; }
        .ft-bottom-link {
          font-size: 10px; color: rgba(10,30,60,0.35);
          text-decoration: none; letter-spacing: 1px; transition: color 0.2s;
        }
        .ft-bottom-link:hover { color: rgba(176,190,197,0.5); }

        @media (max-width: 1024px) {
          .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; padding: 40px 40px 36px; }
          .footer-bottom { padding: 18px 40px; }
        }
        @media (max-width: 640px) {
          .footer-top { grid-template-columns: 1fr; padding: 32px 24px; }
          .footer-bottom { padding: 16px 24px; flex-direction: column; align-items: flex-start; }
        }
      `}</style>

      <div className="footer-accent" />
      <footer className="footer">
        <div className="footer-top">

          {/* Logo col */}
          <div>
            <div className="ft-logo">
              <Image
                src="/images/selum-logo-full.png"
                alt="Selum — Excelência em Alumínio"
                width={240}
                height={90}
                style={{ height: 90, width: "auto" }}
              />
            </div>
            <div className="ft-desc">
              Fabricação própria de estruturas de alumínio para os maiores eventos da América Latina.
            </div>
            <div className="ft-social">
              {/* Instagram */}
              <a href="https://www.instagram.com/selumaluminiooficial/" target="_blank" rel="noopener noreferrer" className="ft-social-btn" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://api.whatsapp.com/send?phone=554734401445" target="_blank" rel="noopener noreferrer" className="ft-social-btn" aria-label="WhatsApp">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              {/* YouTube */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="ft-social-btn" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" target="_blank" rel="noopener noreferrer" className="ft-social-btn" aria-label="LinkedIn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Produtos */}
          <div>
            <div className="ft-col-title">Produtos</div>
            <div className="ft-links">
              {products.map((p) => (
                <a key={p} href="#products" className="ft-link">{p}</a>
              ))}
            </div>
          </div>

          {/* Empresa */}
          <div>
            <div className="ft-col-title">Empresa</div>
            <div className="ft-links">
              {company.map((c) => (
                <a key={c} href="#about" className="ft-link">{c}</a>
              ))}
            </div>
          </div>

          {/* Contato */}
          <div>
            <div className="ft-col-title">Contato</div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon">📍</div>
              <div className="ft-contact-text">Rua Tuiuti, 5.300<br />Aventureiro · Joinville · SC</div>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon">📱</div>
              <div className="ft-contact-text">+55 (47) 3440-1445</div>
            </div>
            <div className="ft-contact-item">
              <div className="ft-contact-icon">✉</div>
              <div className="ft-contact-text">contato@selum.com.br</div>
            </div>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="ft-copy">© {year} <span>Selum Estruturas</span>. {t("rights")}</div>
          <div className="ft-bottom-links">
            <a href="#" className="ft-bottom-link">Política de Privacidade</a>
            <a href="#" className="ft-bottom-link">Termos de Uso</a>
          </div>
        </div>
      </footer>
    </>
  );
}
