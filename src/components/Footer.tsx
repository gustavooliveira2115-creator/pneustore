"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ display: "flex", flexDirection: "column", color: "white" }}>
      {/* Main Footer - Purple */}
      <div style={{ background: "var(--color-footerBackground)", padding: "32px 50px" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          <img
            src="/reverseLogo.png"
            alt="Pneustore Logo footer"
            style={{ height: 29, width: 213, objectFit: "contain" }}
          />

          {/* Institucional */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Institucional</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              <li>
                <Link href="/politica-de-garantia" style={{ fontSize: 14, opacity: 0.9, cursor: "pointer", color: "inherit", textDecoration: "none" }}>
                  Garantia
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" style={{ fontSize: 14, opacity: 0.9, cursor: "pointer", color: "inherit", textDecoration: "none" }}>
                  Política de privacidade
                </Link>
              </li>
              <li>
                <span style={{ fontSize: 14, opacity: 0.9, cursor: "pointer" }}>Marcas</span>
              </li>
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Ajuda</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {["Perguntas frequentes", "Entrega", "Informações técnicas de pneus", "Trocas e devoluções"].map(
                (item) => (
                  <li key={item}>
                    <span style={{ fontSize: 14, opacity: 0.9, cursor: "pointer" }}>{item}</span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Serviço */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Serviço</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {["Montagem em nossos parceiros", "Proteção para seus pneus"].map((item) => (
                <li key={item}>
                  <span style={{ fontSize: 14, opacity: 0.9, cursor: "pointer" }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Central de relacionamento */}
          <div>
            <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Central de relacionamento</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 14 }}>
              <p>(47) 3046-2551</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>Ligações de qualquer origem</p>
              <p>4000-2313</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>Para capitais e regiões metropolitanas</p>
              <p>0800-602-2013</p>
              <p style={{ fontSize: 12, opacity: 0.7 }}>Demais regiões</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges Row */}
      <div style={{ background: "var(--color-primaryPurpleDarkest)", padding: "24px 50px" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 24,
          }}
        >
          {/* Avaliações */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <img src="/logoConfi.png" alt="Confi" style={{ height: 48, objectFit: "contain" }} />
            <img src="/reclameAwardlogo.png" alt="Reclame Aqui" style={{ height: 48, objectFit: "contain" }} />
            <img src="/complainHerelogo.png" alt="Reclame Aqui Bom" style={{ height: 48, objectFit: "contain" }} />
            <img src="/logoBsi.png" alt="BSI" style={{ height: 48, objectFit: "contain" }} />
            <img
              src="/clinteRecommendsLogo.png"
              alt="O Cliente Recomenda"
              style={{ height: 48, objectFit: "contain" }}
            />
            <img src="/resetLogo.png" alt="Reset Descarte" style={{ height: 48, objectFit: "contain" }} />
          </div>
          {/* Social Media */}
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" fill="var(--color-primaryPurpleBase)" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" fill="var(--color-primaryPurpleBase)" viewBox="0 0 24 24">
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="5"
                  ry="5"
                  fill="none"
                  stroke="var(--color-primaryPurpleBase)"
                  strokeWidth="2"
                />
                <circle cx="12" cy="12" r="5" fill="none" stroke="var(--color-primaryPurpleBase)" strokeWidth="2" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="var(--color-primaryPurpleBase)" />
              </svg>
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <svg width="16" height="16" fill="var(--color-primaryPurpleBase)" viewBox="0 0 24 24">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Projetos que apoiamos */}
      <div style={{ background: "var(--color-primaryPurpleBase)", padding: "24px 50px" }}>
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 24,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>Projetos que apoiamos:</span>
          {[
            { img: "criasLabLogo.webp", alt: "Cria Labs" },
            { img: "acsLogo.webp", alt: "ACS" },
            { img: "erastinhoLogo.webp", alt: "Erastinho" },
            { img: "erastoGaertnerLogo.webp", alt: "Erasto Gaertner" },
            { img: "ArytonSena2.webp", alt: "Instituto Ayrton Senna" },
          ].map((p) => (
            <img key={p.alt} src={`/${p.img}`} alt={p.alt} style={{ height: 36, objectFit: "contain" }} />
          ))}
        </div>
      </div>

      {/* Payment Methods + Copyright */}
      <div
        style={{
          background: "var(--color-footerBottomBg)",
          padding: "24px 50px",
          color: "var(--color-footerBottomText)",
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          <h3 style={{ fontWeight: 700, fontSize: 14 }}>Formas de pagamento</h3>
          <img
            src="/paymentMethodsLogos.png"
            alt="Formas de Pagamento"
            style={{ height: 40, width: "auto", objectFit: "contain" }}
          />
          <p style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>
            Parcele suas compras usando seu cartão de crédito e pague em até 10x sem juros
          </p>
          <p style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>
            © 2022 PneuStore. CPX Distribuidora S/A. Rodovia SC 486 - Antonio Heil, 800 - Bairro Itaipava - CEP
            88316001 - Itajaí/SC. CNPJ: 10.158.356/0001-01.
          </p>
        </div>
      </div>
    </footer>
  );
}
