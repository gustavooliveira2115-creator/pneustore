"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA
   ═══════════════════════════════════════════════════════════════════ */

const product = {
  name: "Pneu Itaro Aro 17.5 IT01 215/75R17.5 135/133J 16 Lonas TL",
  id: "16000356",
  brand: "Itaro",
  brandLogo: "ITARO-2-1--1.png",
  brandLogo2x: "ITARO-2-1--2.png",
  pixPrice: "569,90",
  installmentTotal: "633,23",
  installmentValue: "63,32",
  installmentCount: 10,
  stars: 4.5,
  reviews: 13,
  images: [
    { src: "ad3934dd692d3fc98e39.webp", srcset: "ad3934dd692d3fc98e39-9.webp 384w, ad3934dd692d3fc98e39-1.webp 640w, ad3934dd692d3fc98e39-8.webp 750w, ad3934dd692d3fc98e39-3.webp 828w, ad3934dd692d3fc98e39-2.webp 1080w, ad3934dd692d3fc98e39-4.webp 1200w, ad3934dd692d3fc98e39-5.webp 1920w, ad3934dd692d3fc98e39-6.webp 2048w, ad3934dd692d3fc98e39-7.webp 3840w" },
    { src: "7511f693be07e9958cae.webp", srcset: "7511f693be07e9958cae-9.webp 384w, 7511f693be07e9958cae-4.webp 640w, 7511f693be07e9958cae-10.webp 750w, 7511f693be07e9958cae-7.webp 828w, 7511f693be07e9958cae.webp 1080w, 7511f693be07e9958cae-3.webp 1200w, 7511f693be07e9958cae-2.webp 1920w, 7511f693be07e9958cae-8.webp 2048w, 7511f693be07e9958cae-5.webp 3840w" },
    { src: "ac18ab0ab5a16a74a0b9.webp", srcset: "ac18ab0ab5a16a74a0b9-1.webp 384w, ac18ab0ab5a16a74a0b9-2.webp 640w, ac18ab0ab5a16a74a0b9-3.webp 750w, ac18ab0ab5a16a74a0b9-4.webp 828w, ac18ab0ab5a16a74a0b9-5.webp 1080w, ac18ab0ab5a16a74a0b9-6.webp 1200w, ac18ab0ab5a16a74a0b9-7.webp 1920w, ac18ab0ab5a16a74a0b9-8.webp 2048w, ac18ab0ab5a16a74a0b9-9.webp 3840w" },
  ],
  thumbnails: [
    "ad3934dd692d3fc98e39-10.webp",
    "7511f693be07e9958cae-1.webp",
    "ac18ab0ab5a16a74a0b9-8.webp",
  ],
  inmetro: {
    rollingResistance: "C",
    wetGrip: "C",
    noise: "71 db",
  },
};

const relatedProducts = [
  { img: "bc833bd47d1eb07f3a43.webp", img2x: "bc833bd47d1eb07f3a43-1.webp", title: "Pneu Westlake Aro 17.5 CM986 215/75R17.5 135/133J 16 Lonas TL", origPrice: "799,89", curPrice: "719,90", installment: "79,99", stars: 4.5, reviews: 8, brand: "Westlake_banner_1.webp", rr: "D", wg: "C", noise: "72" },
  { img: "ccdac76cd9248bd45280.webp", img2x: "ccdac76cd9248bd45280-1.webp", title: "Pneu Westlake Aro 17.5 CR960A 215/75R17.5 135/133J 16 Lonas TL", origPrice: "822,12", curPrice: "739,90", installment: "82,21", stars: 4, reviews: 5, brand: "Westlake_banner_1.webp", rr: "C", wg: "B", noise: "70" },
  { img: "cc3ef30f33ac7c28018d.webp", img2x: "cc3ef30f33ac7c28018d-1.webp", title: "Pneu Westlake Aro 17.5 CM986 215/75R17.5 136/134K 18 Lonas TL", origPrice: "955,45", curPrice: "859,90", installment: "95,55", stars: 4.5, reviews: 3, brand: "Westlake_banner_1.webp", rr: "D", wg: "C", noise: "72" },
  { img: "bfc10d0ef0e933bd9203.webp", img2x: "bfc10d0ef0e933bd9203-1.webp", title: "Pneu Westlake Aro 17.5 CR960A 215/75R17.5 136/134K 18 Lonas TL", origPrice: "933,23", curPrice: "839,90", installment: "93,32", stars: 4, reviews: 2, brand: "Westlake_banner_1.webp", rr: "C", wg: "B", noise: "70" },
  { img: "b008510702b224d2c3f3.webp", img2x: "b008510702b224d2c3f3-1.webp", title: "Pneu Speedmax Aro 17.5 FACTORMAX-MD 215/75R17.5 135/133J 16 Lonas TL", origPrice: "666,56", curPrice: "599,90", installment: "66,66", stars: 5, reviews: 11, brand: "MINI-BANNER-SPEEDMAX-NOVO.png", rr: "C", wg: "C", noise: "71" },
  { img: "d1a75f4fb5197084b466.webp", img2x: "d1a75f4fb5197084b466-1.webp", title: "Pneu Itaro Aro 17.5 IT01 215/75R17.5 136/134K 18 Lonas TL", origPrice: "622,12", curPrice: "559,90", installment: "62,21", stars: 4.5, reviews: 7, brand: "ITARO-2-1-.png", rr: "C", wg: "C", noise: "71" },
  { img: "d4cb2e20d0accbce337b.webp", img2x: "d4cb2e20d0accbce337b-1.webp", title: "Pneu Itaro Aro 17.5 IT01 225/75R17.5 140/138M 18 Lonas TL", origPrice: "711,00", curPrice: "639,90", installment: "71,10", stars: 4, reviews: 4, brand: "ITARO-2-1-.png", rr: "C", wg: "C", noise: "72" },
  { img: "e67f454502c229412897.webp", img2x: "e67f454502c229412897-1.webp", title: "Pneu Itaro Aro 17.5 IT01 225/75R17.5 135/133J 16 Lonas TL", origPrice: "688,78", curPrice: "619,90", installment: "68,88", stars: 4.5, reviews: 9, brand: "ITARO-2-1-.png", rr: "C", wg: "C", noise: "71" },
];

const bannerSlides = [
  { img: "a9c181e7594016ab63d3.webp", alt: "Compre pneus com 5 anos de garantia de fábrica | 10% OFF pagando no PIX" },
];

/* ═══════════════════════════════════════════════════════════════════
   SVG ICONS
   ═══════════════════════════════════════════════════════════════════ */

const SearchIcon = () => (
  <svg width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896">
    <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z" />
  </svg>
);

const UserIcon = () => (
  <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
    <path d="M11.0003 11.9167C13.5316 11.9167 15.5837 9.86464 15.5837 7.33333C15.5837 4.80203 13.5316 2.75 11.0003 2.75C8.46902 2.75 6.41699 4.80203 6.41699 7.33333C6.41699 9.86464 8.46902 11.9167 11.0003 11.9167ZM11.0003 11.9167C12.9452 11.9167 14.8105 12.6893 16.1858 14.0646C17.561 15.4398 18.3337 17.3051 18.3337 19.25M11.0003 11.9167C9.0554 11.9167 7.19014 12.6893 5.81488 14.0646C4.43961 15.4398 3.66699 17.3051 3.66699 19.25" stroke="currentColor" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CartIcon = () => (
  <svg width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
    <path d="M0.866577 1.36719H2.19991L3.97324 9.64719C4.0383 9.95043 4.20702 10.2215 4.45038 10.4138C4.69375 10.606 4.99651 10.7074 5.30658 10.7005H11.8266C12.13 10.7 12.4242 10.596 12.6606 10.4057C12.897 10.2154 13.0613 9.95021 13.1266 9.65385L14.2266 4.70052H2.91324M5.50004 14.0005C5.50004 14.3687 5.20156 14.6672 4.83337 14.6672C4.46518 14.6672 4.16671 14.3687 4.16671 14.0005C4.16671 13.6323 4.46518 13.3338 4.83337 13.3338C5.20156 13.3338 5.50004 13.6323 5.50004 14.0005ZM12.8334 14.0005C12.8334 14.3687 12.5349 14.6672 12.1667 14.6672C11.7985 14.6672 11.5 14.3687 11.5 14.0005C11.5 13.6323 11.7985 13.3338 12.1667 13.3338C12.5349 13.3338 12.8334 13.6323 12.8334 14.0005Z" stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDown = ({ color = "white" }: { color?: string }) => (
  <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
    <path d="M4 6L8 10L12 6" stroke={color} strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LocationPin = () => (
  <svg width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
    <path d="M15 7.5C15 12 9 16.5 9 16.5C9 16.5 3 12 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StarIcon = ({ filled, half }: { filled: boolean; half?: boolean }) => (
  <span style={{ color: filled || half ? "#f5a623" : "#ddd", fontSize: 14, position: "relative", display: "inline-block" }}>
    {half ? (
      <>
        <span style={{ color: "#ddd" }}>&#9733;</span>
        <span style={{ position: "absolute", left: 0, overflow: "hidden", width: "50%", color: "#f5a623" }}>&#9733;</span>
      </>
    ) : (
      <span>{filled ? "\u2605" : "\u2605"}</span>
    )}
  </span>
);

const WhatsAppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function Stars({ count }: { count: number }) {
  const full = Math.floor(count);
  const half = count % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span className="flex items-center gap-[1px]">
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`f${i}`} filled />
      ))}
      {half && <StarIcon filled half />}
      {Array.from({ length: empty }).map((_, i) => (
        <StarIcon key={`e${i}`} filled={false} />
      ))}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function ProductPage() {
  const [cookieOpen, setCookieOpen] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const relatedScrollRef = useRef<HTMLDivElement>(null);

  const scrollRelated = useCallback((dir: "left" | "right") => {
    if (!relatedScrollRef.current) return;
    relatedScrollRef.current.scrollBy({ left: dir === "right" ? 300 : -300, behavior: "smooth" });
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      {/* ─── SKIP LINK ─── */}
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>

      {/* ─── COOKIE DRAWER ─── */}
      {cookieOpen && (
        <div className="cookie-drawer" style={{ flexDirection: "column", height: "auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", gap: 16, flexWrap: "wrap" }}>
            <p style={{ fontSize: 14, color: "#333", margin: 0 }}>
              Usamos cookies para melhorar sua experiência em nosso site.
              Ao continuar navegando você concorda com a nossa <span style={{ color: "var(--color-primary)", textDecoration: "underline", cursor: "pointer" }}>política de privacidade.</span>
            </p>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button className="btn btn-outline" style={{ height: 32, fontSize: 12 }} onClick={() => setCookieOpen(false)}>Configurar cookies</button>
              <button className="btn btn-outline" style={{ height: 32, fontSize: 12 }} onClick={() => setCookieOpen(false)}>Rejeitar</button>
              <button className="btn btn-primary" style={{ height: 32, fontSize: 12 }} onClick={() => setCookieOpen(false)}>Aceitar</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════ */}
      <div id="header-items">
        <div style={{ fontFamily: "Arial, sans-serif" }}>
          {/* Desktop Top Bar */}
          <div className="hidden desktop:flex" style={{ flexDirection: "column" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "8px 20px", height: 30, color: "var(--color-primary)", background: "var(--color-neutralBgLayout)", fontSize: 12, whiteSpace: "nowrap" }}>
              <div style={{ display: "flex", height: "100%", gap: 7 }}>
                <button type="button" style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 12px", cursor: "pointer", background: "none", border: "none", color: "inherit", fontSize: 12 }}>Quero revender</button>
                <div style={{ display: "flex", margin: "0 8px", borderRight: "1px solid var(--color-dividerGlobalSplit)", height: "100%" }} />
                <button type="button" style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 12px", cursor: "pointer", background: "none", border: "none", color: "inherit", fontSize: 12 }}>Blog</button>
                <div style={{ display: "flex", margin: "0 8px", borderRight: "1px solid var(--color-dividerGlobalSplit)", height: "100%" }} />
              </div>
              <div style={{ display: "flex", height: "100%", gap: 7 }}>
                <div style={{ display: "flex", margin: "0 8px", borderRight: "1px solid var(--color-dividerGlobalSplit)", height: "100%" }} />
                <button type="button" style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 12px", cursor: "pointer", background: "none", border: "none", color: "inherit", fontSize: 12 }}>Whatsapp (16) 99764-8401</button>
                <div style={{ display: "flex", margin: "0 8px", borderRight: "1px solid var(--color-dividerGlobalSplit)", height: "100%" }} />
                <span style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 12px" }}>Televendas (47) 3046-2551</span>
              </div>
            </div>

            {/* Promo Banner */}
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <button type="button" style={{ display: "block", width: "100%", maxWidth: 1240, height: 58, background: "transparent", padding: 0, border: 0, cursor: "pointer" }}>
                <img src="/a9c181e7594016ab63d3.webp" alt="Compre pneus com 5 anos de garantia de fábrica | 10% OFF pagando no PIX" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </button>
            </div>

            {/* Main Header: Logo + Search + Cart */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", maxWidth: 1240, padding: "16px 50px", margin: "0 auto" }}>
              <Link href="/">
                <img src="/0e22de206c8bff4b6700ad14924492a518cca03a.png" alt="logo" style={{ height: 30, cursor: "pointer" }} />
              </Link>
              <div style={{ width: "40%", margin: "0 25px", position: "relative" }}>
                <div style={{ display: "flex", width: "100%", alignItems: "center", overflow: "hidden", borderRadius: "50px" }}>
                  <input
                    style={{ width: "100%", background: "#f4f4f4", outline: "none", border: "none", height: 50, borderRadius: "50px 0 0 50px", padding: "0 20px", fontSize: 14 }}
                    placeholder="O que estou buscando hoje?"
                    aria-label="campo de busca"
                  />
                  <button style={{ background: "#f4f4f4", display: "flex", justifyContent: "center", alignItems: "center", border: "none", borderRadius: "0 50px 50px 0", height: 50, width: 60, cursor: "pointer" }} aria-label="buscar">
                    <SearchIcon />
                  </button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 16, color: "var(--color-primaryPurpleBase)", whiteSpace: "nowrap" }}>
                <button style={{ display: "flex", gap: 8, cursor: "pointer", background: "none", border: "none", color: "inherit", alignItems: "center" }} aria-label="Entrar">
                  <UserIcon />
                  <span>Entrar</span>
                </button>
                <button style={{ display: "flex", gap: 8, cursor: "pointer", background: "none", border: "none", color: "inherit", alignItems: "center" }} aria-label="Carrinho">
                  <CartIcon />
                  <span style={{ background: "var(--color-primaryBlueSecondaryBase)", borderRadius: "full", padding: "2px 7px", fontSize: 12, color: "var(--color-primaryPurpleBase)" }}>0</span>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav style={{ position: "relative", zIndex: 30, width: "100%", background: "var(--color-primaryPurpleBase)", color: "white" }}>
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <div style={{ display: "flex", height: 48, width: "100%", maxWidth: 1240, alignItems: "center", justifyContent: "space-between", padding: "0 50px", gap: 32 }}>
                <div style={{ display: "flex", gap: 16 }}>
                  {["Pneus", "Acessórios", "Rodas"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center" }}>
                      <button style={{ display: "flex", gap: 8, alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap" }}>
                        {item}
                        <ChevronDown />
                      </button>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button style={{ display: "flex", gap: 8, alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap" }}>
                      Marcas
                      <ChevronDown />
                    </button>
                  </div>
                  {["Promoções", "Revenda", "Seja um parceiro", "Nossas lojas"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "center" }}>
                      <button style={{ display: "flex", alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap" }}>
                        {item}
                      </button>
                    </div>
                  ))}
                </div>
                <button style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--color-primaryPurpleDark, #3e0075)", color: "white", padding: "6px 16px", borderRadius: 20, border: "none", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
                  <LocationPin />
                  Insira seu CEP
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Header */}
          <div className="desktop:hidden" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", gap: 12 }}>
            <button style={{ background: "none", border: "none", color: "var(--color-primary)", padding: 4 }} aria-label="Menu">
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M3.33 10h13.34M3.33 5h13.34M3.33 15h13.34" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" /></svg>
            </button>
            <Link href="/" style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <img src="/0e22de206c8bff4b6700ad14924492a518cca03a.png" alt="logo" style={{ height: 24 }} />
            </Link>
            <div style={{ display: "flex", gap: 12, color: "var(--color-primary)" }}>
              <button style={{ background: "none", border: "none", color: "inherit", padding: 4 }} aria-label="Buscar">
                <SearchIcon />
              </button>
              <button style={{ background: "none", border: "none", color: "inherit", padding: 4, position: "relative" }} aria-label="Carrinho">
                <CartIcon />
                <span style={{ position: "absolute", top: -2, right: -4, background: "var(--color-primaryBlueSecondaryBase)", borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--color-primary)", fontWeight: 700 }}>0</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BREADCRUMB
          ═══════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 50px" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "var(--color-textSecondary)" }}>
          <ol style={{ display: "flex", gap: 8, listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
            <li><button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13 }}>Pneus</button></li>
            <li style={{ color: "#999" }}>/</li>
            <li><button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13 }}>Pneus de caminhão e ônibus</button></li>
            <li style={{ color: "#999" }}>/</li>
            <li><button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13 }}>Regional</button></li>
            <li style={{ color: "#999" }}>/</li>
            <li style={{ color: "#666" }}>{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAIN PRODUCT SECTION
          ═══════════════════════════════════════════════════════════ */}
      <main id="main-content" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 50px 40px" }}>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          {/* ─── LEFT COLUMN: Gallery ─── */}
          <div style={{ flex: "1 1 480px", minWidth: 320, maxWidth: 560 }}>
            {/* Inmetro Stamps */}
            <div style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#FFED00", borderRadius: 4, padding: "2px 6px" }}>
                  <img src="/resistencia-ao-rolamento.svg" alt="" width={16} height={16} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{product.inmetro.rollingResistance}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#C8D400", borderRadius: 4, padding: "2px 6px" }}>
                  <img src="/aderencia-pista-molhada.svg" alt="" width={16} height={16} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{product.inmetro.wetGrip}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.45)", borderRadius: 4, padding: "2px 6px", color: "white" }}>
                  <img src="/ruido-externo-2.png" alt="" width={16} height={16} />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{product.inmetro.noise}</span>
                </div>
              </div>
              <button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>Inmetro</button>
            </div>

            {/* Thumbnails + Main Image */}
            <div style={{ display: "flex", gap: 12 }}>
              {/* Vertical Thumbnails */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                {product.thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    style={{
                      width: 80, height: 80, border: currentImage === i ? "2px solid var(--color-primary)" : "2px solid #e0e0e0",
                      borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "white", padding: 2, flexShrink: 0,
                    }}
                    aria-label={`Imagem ${i + 1}`}
                  >
                    <img src={`/${thumb}`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div style={{ flex: 1, position: "relative", aspectRatio: "1/1", background: "#fafafa", borderRadius: 12, overflow: "hidden" }}>
                <img
                  src={`/${product.images[currentImage].src}`}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>

            {/* Dot Indicators */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
              {product.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  style={{
                    width: currentImage === i ? 24 : 8, height: 8, borderRadius: 4, border: "none",
                    background: currentImage === i ? "var(--color-primary)" : "#d0d0d0", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  aria-label={`Imagem ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Product Info ─── */}
          <div style={{ flex: "1 1 480px", minWidth: 320 }}>
            {/* Brand Logo */}
            <div style={{ marginBottom: 12 }}>
              <img
                src={`/${product.brandLogo}`}
                srcSet={`${product.brandLogo} 1x, ${product.brandLogo2x} 2x`}
                alt="icone marca"
                style={{ height: 40, objectFit: "contain" }}
              />
            </div>

            {/* Title */}
            <h1 style={{ fontSize: 22, fontWeight: 400, color: "var(--color-textBase)", margin: "0 0 12px", lineHeight: 1.4 }}>
              {product.name}
            </h1>

            {/* ID + Rating */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, color: "var(--color-textSecondary)" }}>ID: {product.id}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stars count={product.stars} />
                <span style={{ fontSize: 14, color: "var(--color-textSecondary)" }}>({product.reviews})</span>
              </div>
            </div>

            {/* Price Section */}
            <div style={{ background: "#f9f9f9", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
              {/* PIX Price */}
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 14, color: "var(--color-textSecondary)" }}>por</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 36, fontWeight: 700, color: "var(--color-pdp-price, var(--color-primary))" }}>
                    R$ {product.pixPrice}
                  </span>
                  <span style={{ display: "inline-block", background: "var(--color-primary)", color: "white", padding: "2px 10px", borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
                    no PIX
                  </span>
                </div>
              </div>

              {/* Installment */}
              <div style={{ fontSize: 14, color: "var(--color-textSecondary)", marginBottom: 4 }}>
                ou R$ {product.installmentTotal} em até {product.installmentCount}x de R$ {product.installmentValue} sem juros.
              </div>
              <button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13, textDecoration: "underline" }}>
                Veja mais formas de pagamento
              </button>
            </div>

            {/* Quantity + Buy */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              {/* Quantity Selector */}
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #d9d9d9", borderRadius: 8, overflow: "hidden" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "white", border: "none", cursor: quantity <= 1 ? "not-allowed" : "pointer",
                    color: quantity <= 1 ? "#ccc" : "var(--color-primary)", fontSize: 18,
                  }}
                  aria-label="Diminuir quantidade"
                >
                  &#8722;
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  style={{
                    width: 50, height: 40, textAlign: "center", border: "none", borderLeft: "1px solid #d9d9d9",
                    borderRight: "1px solid #d9d9d9", outline: "none", fontSize: 14,
                  }}
                  aria-label="Quantidade"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "white", border: "none", cursor: "pointer",
                    color: "var(--color-primary)", fontSize: 18,
                  }}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              {/* Buy Button */}
              <button
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  flex: 1, minWidth: 200, maxWidth: 300, height: 48,
                  border: "2px solid var(--color-primary)", borderRadius: 8,
                  background: "white", color: "var(--color-primary)",
                  fontSize: 16, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-primary)"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.color = "var(--color-primary)"; }}
              >
                <CartIcon />
                Comprar
              </button>
            </div>

            {/* Compare */}
            <button style={{ background: "none", border: "1px solid #d9d9d9", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "var(--color-textSecondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              Comparar produto
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            TABS: Sobre o produto
            ═══════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 48, borderTop: "1px solid #e8e8e8" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #e8e8e8" }}>
            <button
              onClick={() => setActiveTab(0)}
              style={{
                padding: "16px 24px", fontSize: 15, fontWeight: activeTab === 0 ? 600 : 400,
                color: activeTab === 0 ? "var(--color-primary)" : "var(--color-textSecondary)",
                background: "none", border: "none", borderBottom: activeTab === 0 ? "2px solid var(--color-primary)" : "2px solid transparent",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              Sobre o produto
            </button>
          </div>

          {activeTab === 0 && (
            <div style={{ padding: "24px 0", maxWidth: 800 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16, color: "var(--color-textBase)" }}>
                Informações técnicas
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-textSecondary)", marginBottom: 20 }}>
                {product.name}
              </p>
              <p style={{ fontSize: 13, color: "var(--color-textSecondary)", marginBottom: 24, fontStyle: "italic" }}>
                *Nossas vendas são realizadas apenas para consumidor final, sendo vetada a comercialização para CNPJ de revendedores.
              </p>

              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: "var(--color-textBase)" }}>
                Sobre a marca Itaro
              </h3>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)", marginBottom: 16 }}>
                A Itaro nasceu para motoristas viverem novas histórias - em duas ou quatro rodas. Desenvolvida nas grandes fábricas asiáticas, a marca é homologada nos principais mercados da Europa e América, como o Brasil. Seus pneus foram pensados em centros de pesquisa e desenvolvimento de países como China, Paquistão e Tailândia, que estão entre os maiores do mundo.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)" }}>
                Com presença exclusiva na PneuStore, a Itaro oferece soluções para carros de passeio, SUVs, caminhonetes, motos e caminhões, com excelente qualidade e custo que ajudam motoristas a viverem novos capítulos todos os dias.
              </p>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            RELATED PRODUCTS
            ═══════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20, color: "var(--color-textBase)" }}>
            Confira outros produtos
          </h2>

          <div style={{ position: "relative" }}>
            {/* Arrow Left */}
            <button
              onClick={() => scrollRelated("left")}
              style={{
                position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
                width: 36, height: 36, borderRadius: "50%", background: "white", border: "1px solid #e0e0e0",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)",
              }}
              aria-label="Anterior"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>

            {/* Products Scroll */}
            <div
              ref={relatedScrollRef}
              style={{
                display: "flex", gap: 16, overflowX: "auto", scrollBehavior: "smooth",
                scrollbarWidth: "none", msOverflowStyle: "none", padding: "4px 0",
              }}
              className="hide-scrollbar"
            >
              {relatedProducts.map((p, i) => (
                <div
                  key={i}
                  style={{
                    minWidth: 260, maxWidth: 260, border: "1px solid #e8e8e8", borderRadius: 12,
                    overflow: "hidden", background: "white", cursor: "pointer",
                    transition: "box-shadow 0.2s", flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ padding: 16 }}>
                    {/* Inmetro mini badges */}
                    <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 700 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "4px 0 0 4px", background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          <img src="/858188e454f29bd80bfe9090e2d077acc45f5ee7.png" alt="" width={12} height={12} />
                        </div>
                        <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10 }}>
                          {p.rr}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 700 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "4px 0 0 4px", background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          <img src="/92cd0612962d6caef7b755437547b544970a915c.png" alt="" width={12} height={12} />
                        </div>
                        <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 10 }}>
                          {p.wg}
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 700 }}>
                        <div style={{ width: 18, height: 18, borderRadius: "4px 0 0 4px", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                          <img src="/a9c67ec6b08617feea202bddb77ebc4ae147d1ff.png" alt="" width={12} height={12} />
                        </div>
                        <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 9 }}>
                          {p.noise}
                        </div>
                      </div>
                    </div>

                    {/* Product Image */}
                    <div style={{ width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                      <img src={`/${p.img}`} alt={p.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                    </div>

                    {/* Brand Banner */}
                    {p.brand && (
                      <div style={{ width: "100%", height: 24, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                        <img src={`/${p.brand}`} alt="" style={{ maxHeight: 24, objectFit: "contain" }} />
                      </div>
                    )}

                    {/* Title */}
                    <p style={{ fontSize: 13, color: "var(--color-textBase)", lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.title}
                    </p>

                    {/* Stars */}
                    <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                      <Stars count={p.stars} />
                      <span style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>({p.reviews})</span>
                    </div>

                    {/* Price */}
                    <div>
                      <span style={{ fontSize: 12, color: "var(--color-textSecondary)", textDecoration: "line-through" }}>R$ {p.origPrice}</span>
                      <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-primary)" }}>R$ {p.curPrice}</div>
                      <span style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>ou 10x de R$ {p.installment}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow Right */}
            <button
              onClick={() => scrollRelated("right")}
              style={{
                position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10,
                width: 36, height: 36, borderRadius: "50%", background: "white", border: "1px solid #e0e0e0",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)",
              }}
              aria-label="Próximo"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          NEWSLETTER
          ═══════════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--color-primaryBlueSecondaryBase)", padding: "32px 50px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-primaryPurpleBase)", margin: "0 0 4px" }}>
              Assine nossa newsletter
            </h3>
            <p style={{ fontSize: 14, color: "var(--color-primaryPurpleBase)", opacity: 0.8, margin: 0 }}>
              Receba ofertas exclusivas e novidades
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="Seu nome"
              style={{ padding: "10px 16px", borderRadius: 8, border: "none", fontSize: 14, minWidth: 180 }}
              aria-label="Nome"
            />
            <input
              placeholder="Seu e-mail"
              type="email"
              style={{ padding: "10px 16px", borderRadius: 8, border: "none", fontSize: 14, minWidth: 240 }}
              aria-label="E-mail"
            />
            <button className="btn btn-primary" style={{ height: 40 }}>
              Me inscrever
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer>
        {/* Footer Top */}
        <div style={{ background: "var(--color-primaryPurpleBase)", color: "white", padding: "40px 50px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ marginBottom: 24 }}>
              <img src="/reverseLogo.png" alt="PneuStore" style={{ height: 29, filter: "brightness(0) invert(1)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32 }}>
              {/* Col 1 */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "white" }}>Institucional</h4>
                {["Garantia", "Política de privacidade", "Trabalhe conosco", "Marcas"].map((item) => (
                  <button key={item} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 13, cursor: "pointer", padding: "4px 0", width: "100%", textAlign: "left" }}>{item}</button>
                ))}
              </div>
              {/* Col 2 */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "white" }}>Ajuda</h4>
                {["Suporte PneuStore", "Perguntas frequentes", "Entrega", "Meus pedidos", "Informações técnicas de pneus", "Trocas e devoluções"].map((item) => (
                  <button key={item} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 13, cursor: "pointer", padding: "4px 0", width: "100%", textAlign: "left" }}>{item}</button>
                ))}
              </div>
              {/* Col 3 */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "white" }}>Serviço</h4>
                {["Seja um parceiro de serviços", "Montagem em nossos parceiros", "Proteção para seus pneus"].map((item) => (
                  <button key={item} style={{ display: "block", background: "none", border: "none", color: "rgba(255,255,255,0.8)", fontSize: 13, cursor: "pointer", padding: "4px 0", width: "100%", textAlign: "left" }}>{item}</button>
                ))}
              </div>
              {/* Col 4 */}
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: "white" }}>Central de relacionamento</h4>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "0 0 8px" }}>(47) 3046-2551</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 12px" }}>(Ligações de qualquer origem)</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: "0 0 8px" }}>4000-2313</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0 }}>Para capitais e regiões metropolitanas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Middle: Trust Badges */}
        <div style={{ background: "var(--color-primaryPurpleDark, #3e0075)", padding: "24px 50px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", gap: 32, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>Segurança</p>
              <img src="/logoConfi.png" alt="Confi.eco" style={{ height: 48 }} />
            </div>
            <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
              <img src="/reclameAwardlogo.png" alt="Reclame AQUI" style={{ height: 48 }} />
              <img src="/complainHerelogo.png" alt="Bom" style={{ height: 48 }} />
              <img src="/clinteRecommendsLogo.png" alt="O Cliente Recomenda" style={{ height: 48 }} />
              <img src="/logoBsi.png" alt="BSI ISO 27001" style={{ height: 48 }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: 1 }}>Certificado de Destinação Final</p>
              <img src="/resetLogo.png" alt="Reset Descarte" style={{ height: 40 }} />
            </div>
          </div>
        </div>

        {/* Footer Social + Payment */}
        <div style={{ background: "white", padding: "24px 50px", borderTop: "1px solid #e8e8e8" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            {/* Social */}
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 20 }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)" }} aria-label="Facebook">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)" }} aria-label="Instagram">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" /><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" /></svg>
              </button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)" }} aria-label="YouTube">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" /><polygon points="9.75,15.02 15.5,11.75 9.75,8.48" fill="white" /></svg>
              </button>
            </div>

            {/* Payment Methods */}
            <div style={{ textAlign: "center" }}>
              <img src="/paymentMethodsLogos.png" alt="Formas de pagamento" style={{ height: 22, marginBottom: 8 }} />
              <p style={{ fontSize: 12, color: "var(--color-textSecondary)", margin: 0 }}>
                Parcele suas compras usando seu cartão de crédito e pague em até 10x sem juros
              </p>
            </div>

            {/* Copyright */}
            <div style={{ textAlign: "center", marginTop: 16, paddingTop: 16, borderTop: "1px solid #e8e8e8" }}>
              <p style={{ fontSize: 11, color: "var(--color-textSecondary)", margin: 0 }}>
                2022 PneuStore. CPX Distribuidora S/A. Rodovia SC 486 - Antonio Heil, 800 - Bairro Itaipava - CEP 88316001 - Itajaí/SC. CNPJ: 10.158.356/0001-01.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* ─── WHATSAPP FLOAT ─── */}
      <button
        style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: "50%", background: "#25D366", display: "flex",
          alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          cursor: "pointer", border: "none", zIndex: 50,
        }}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon />
      </button>
    </div>
  );
}
