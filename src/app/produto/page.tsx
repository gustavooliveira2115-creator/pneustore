"use client";

import { useState, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════════
   PRODUCT DATA
   ═══════════════════════════════════════════════════════════════════ */

const product = {
  name: "Pneu Itaro Aro 17.5 IT01 215/75R17.5 135/133J 16 Lonas TL",
  id: "16000356",
  brand: "Itaro",
  brandLogo: "ITARO-2-1--1.png",
  brandLogo2x: "ITARO-2-1--2.png",
  origPrice: "633,23",
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
    noise: "71 dB",
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

const qaQuestions = [
  {
    question: "O pneu de voces tem garantia",
    author: "ANDRE FRANCISCO PESSANHA",
    date: "11/08/2026",
    answer: "Ola! Bom dia. Agradecemos o contato. Sim, os pneus possuem cinco anos de garantia contra defeitos de fabricacao, contados a partir da emissao da nota fiscal.",
    answerBy: "PneuStore",
    answerDate: "11/08/2026",
  },
  {
    question: "Preciso de pneus para caminhao Ford F 4000. Seria 7-50-16 ?",
    author: "Diac. Jose Maria Pinheiro Furtado",
    date: "10/06/2026",
    answer: "Ola, tudo bem? Espero que sim!\n\nSugerimos que confira no manual do seu veiculo ou nos pneus ja existentes nele se essas medidas correspondem aos mesmos.\n\nInformacoes importantes que podem ser analisadas: largura, perfil, aro, indice de peso e indice de velocidade; todas essas informacoes podem ser encontradas na lateral externa do pneu.\n\nCaso o pneu desejado siga as mesmas caracteristicas pode ficar tranquilo que o pneu sera otimo para voce!\n\nSe precisar de algo mais e so chamar!",
    answerBy: "PneuStore",
    answerDate: "12/06/2026",
  },
];

const bannerSlides = [
  { img: "a9c181e7594016ab63d3.webp", alt: "Compre pneus com 5 anos de garantia de fabrica | 10% OFF pagando no PIX" },
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

const CartIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <path d="M2.73303 2.7334H5.3997L8.94637 19.2934C9.07647 19.8999 9.41393 20.442 9.90065 20.8265C10.3874 21.2111 10.9929 21.4139 11.613 21.4H22.2797C22.8864 21.4083 23.4791 21.2064 23.9613 20.8301C24.4435 20.4538 24.7879 19.9258 24.9364 19.3334L27.4697 9.3334H7.13303M13.0664 28.0667C13.0664 28.7931 12.4794 29.3801 11.753 29.3801C11.0266 29.3801 10.4397 28.7931 10.4397 28.0667C10.4397 27.3403 11.0266 26.7534 11.753 26.7534C12.4794 26.7534 13.0664 27.3403 13.0664 28.0667ZM25.4397 28.0667C25.4397 28.7931 24.8527 29.3801 24.1264 29.3801C23.4 29.3801 22.813 28.7931 22.813 28.0667C22.813 27.3403 23.4 26.7534 24.1264 26.7534C24.8527 26.7534 25.4397 27.3403 25.4397 28.0667Z" stroke="currentColor" strokeWidth="2.13333" strokeLinecap="round" strokeLinejoin="round" />
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

const ChevronLeft = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const ChevronRight = () => (
  <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" /></svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" /></svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor"><path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z" /><path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z" /></svg>
);

const WhatsAppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="white">
    <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.054 9.374L1.054 31.25l6.114-1.988A15.91 15.91 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.33 22.608c-.39 1.096-1.932 2.006-3.158 2.27-.836.18-1.93.322-5.626-1.21-4.734-1.962-7.778-6.79-8.012-7.104-.226-.314-1.896-2.52-1.896-4.808s1.2-3.41 1.628-3.874c.39-.42.92-.56 1.226-.56.302 0 .606.002.87.016.28.012.654-.106 1.014.774.39.96 1.336 3.25 1.452 3.486.116.236.194.51.038.824-.158.314-.236.51-.47.786-.236.276-.494.616-.706.826-.236.236-.48.49-.204.962.276.472 1.224 2.02 2.626 3.274 1.804 1.614 3.324 2.114 3.796 2.35.472.236.748.196 1.024-.118.276-.314 1.178-1.374 1.49-1.844.314-.472.628-.39 1.064-.234.436.156 2.772 1.308 3.246 1.544.472.236.788.354.906.55.118.196.118 1.14-.272 2.238z" />
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
      <span>&#9733;</span>
    )}
  </span>
);

const Stars = ({ count }: { count: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(count)) stars.push(<StarIcon key={i} filled />);
    else if (i - 0.5 <= count) stars.push(<StarIcon key={i} filled half />);
    else stars.push(<StarIcon key={i} filled={false} />);
  }
  return <span style={{ display: "inline-flex", gap: 1 }}>{stars}</span>;
};

const MenuIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
);

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function ProductPage() {
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [cookieOpen, setCookieOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const [qaPage, setQaPage] = useState(0);

  const scrollRelated = (dir: "left" | "right") => {
    if (!relatedScrollRef.current) return;
    const amount = dir === "left" ? -280 : 280;
    relatedScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const navItems = [
    { label: "Pneus", hasChevron: true },
    { label: "Acessorios", hasChevron: true },
    { label: "Rodas", hasChevron: true },
    { label: "Marcas", hasChevron: false },
    { label: "Promocoes", hasChevron: false },
    { label: "Revenda", hasChevron: false },
    { label: "Seja um parceiro", hasChevron: false },
    { label: "Nossas lojas", hasChevron: false },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-background)" }}>
      {/* ═══════════════════════════════════════════════════════════
          SKIP LINK
          ═══════════════════════════════════════════════════════════ */}
      <a href="#main-content" className="skip-link">Pular para o conteudo principal</a>

      {/* ═══════════════════════════════════════════════════════════
          COOKIE BANNER
          ═══════════════════════════════════════════════════════════ */}
      {cookieOpen && (
        <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#333", color: "white", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 100, flexWrap: "wrap", gap: 12 }}>
          <p style={{ margin: 0, fontSize: 13, flex: 1 }}>
            Utilizamos cookies para melhorar sua experiencia. Ao continuar navegando, voce concorda com nossaPolitica de Privacidade.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setCookieOpen(false)} style={{ padding: "6px 16px", borderRadius: 6, border: "none", background: "var(--color-primary)", color: "white", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>Aceitar todos</button>
            <button onClick={() => setCookieOpen(false)} style={{ padding: "6px 16px", borderRadius: 6, border: "1px solid rgba(255,255,255,0.3)", background: "transparent", color: "white", cursor: "pointer", fontSize: 13 }}>Rejeitar</button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          HEADER - DESKTOP
          ═══════════════════════════════════════════════════════════ */}
      <div id="header-items" className="pneustore_header_header_container__ioqCn">
        <div className="text-[14px]">
          {/* Desktop Header */}
          <div className="hidden desktop:flex flex-col">
            {/* Tier 1: Top utility bar */}
            <div className="flex justify-between items-center w-full !px-[20px] !py-[8px] h-[30px] text-[var(--color-primary)] bg-neutralBgLayout whitespace-nowrap text-xs" style={{ fontFamily: "Arial, sans-serif" }}>
              <div className="flex h-full gap-[7px]">
                <button type="button" className="flex items-center h-full px-[12px] cursor-pointer transition-colors hover:opacity-70">Quero revender</button>
                <div className="flex !mx-[8px] border-l border-[var(--color-primary)] opacity-30 h-full"></div>
                <button type="button" className="flex items-center h-full px-[12px] cursor-pointer transition-colors hover:opacity-70">Blog</button>
              </div>
              <div className="flex h-full gap-[7px] items-center">
                <button type="button" className="flex items-center h-full px-[12px] cursor-pointer transition-colors hover:opacity-70">Whatsapp (16) 99764-8401</button>
                <span className="px-[12px]">Televendas (47) 3046-2551</span>
              </div>
            </div>

            {/* Tier 2: Promo banner */}
            <div className="w-full flex justify-center">
              <button type="button" className="block w-full max-w-[1240px] h-[58px] bg-transparent p-0 border-0 cursor-pointer">
                <img src={`/${bannerSlides[0].img}`} alt={bannerSlides[0].alt} style={{ width: "100%", height: 58, objectFit: "cover" }} />
              </button>
            </div>

            {/* Tier 3: Logo + Search + Icons */}
            <div className="w-full flex justify-center">
              <div className="flex items-center justify-between w-full max-w-[1240px] !px-[50px] !py-[16px]">
                <Link href="/">
                  <img className="h-[30px] cursor-pointer" src="/reverseLogo.png" alt="Pneustore" style={{ height: 30, filter: "brightness(0) invert(1)" }} />
                </Link>
                <div className="w-[40%] !mx-[25px] relative">
                  <div className="relative flex w-full items-center overflow-hidden rounded-md">
                    <input className="w-full bg-[#f4f4f4] focus:outline-none border border-none placeholder:text-[14px] placeholder:opacity-50 h-[50px] rounded-l-[50px] pl-5! pr-4! py-2!" placeholder="O que esta buscando hoje?" style={{ fontFamily: "Arial, sans-serif" }} />
                    <button className="btn btn-ghost flex !bg-[#f4f4f4] justify-center items-center border-none rounded-none rounded-r-[50px] h-[50px] w-[60px]" aria-label="buscar">
                      <SearchIcon />
                    </button>
                  </div>
                </div>
                <div className="flex gap-[16px] text-[var(--color-primary)] whitespace-nowrap">
                  <button className="btn btn-ghost h-auto flex gap-[8px] cursor-pointer items-center" style={{ color: "var(--color-primary)" }}>
                    <UserIcon />
                    <span className="text-[14px] font-semibold hidden lg:inline">Entrar</span>
                  </button>
                  <button className="btn btn-ghost flex cursor-pointer h-auto gap-[8px] items-center relative" style={{ color: "var(--color-primary)" }}>
                    <CartIcon />
                    <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">0</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ─── NAVIGATION BAR ─── */}
          <div className="flex flex-col" style={{ background: "var(--color-primary)" }}>
            <nav className="relative z-30 w-full" style={{ background: "var(--color-primary)", color: "white" }}>
              <div className="w-full flex justify-center">
                <div className="hidden desktop:flex h-[48px] w-full max-w-[1240px] items-center justify-between !px-[50px] gap-[32px]">
                  <div className="flex gap-[16px]">
                    {navItems.map((item) => (
                      <div key={item.label} className="flex items-center">
                        <button className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:opacity-80 rounded-[6px] !my-[10px] whitespace-nowrap text-white" style={{ background: "transparent", border: "none" }}>
                          {item.label}
                          {item.hasChevron && (
                            <span className="transition-transform duration-200 ease-in-out"><ChevronDown /></span>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className="flex items-center justify-center text-white gap-[8px] !px-[15px] h-[32px] rounded-[8px] text-[14px]" style={{ background: "rgba(0,0,0,0.2)", border: "none", cursor: "pointer" }}>
                    <LocationPin />
                    <span className="max-w-[150px] truncate">Insira seu CEP</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* ─── MOBILE HEADER ─── */}
        <div className="flex desktop:hidden flex-col !p-[16px] !gap-[16px]">
          <button type="button" className="block w-full h-[50px] bg-transparent p-0 border-0 cursor-pointer">
            <img src={`/${bannerSlides[0].img}`} alt={bannerSlides[0].alt} style={{ width: "100%", height: 50, objectFit: "cover", borderRadius: 8 }} />
          </button>
          <div className="flex items-center justify-between" style={{ color: "var(--color-primary)" }}>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)" }}><MenuIcon /></button>
            <Link href="/"><img className="h-[14px]" src="/reverseLogo.png" alt="Pneustore" style={{ height: 14, filter: "brightness(0) invert(1)" }} /></Link>
            <div className="flex gap-[8px]" style={{ color: "var(--color-primary)" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)" }}><UserIcon /></button>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", position: "relative" }}>
                <CartIcon />
                <span className="absolute -top-2 -right-2 bg-[var(--color-primary)] text-white text-[10px] font-bold rounded-full w-[18px] h-[18px] flex items-center justify-center">0</span>
              </button>
            </div>
          </div>
          <div className="w-[100%] relative">
            <div className="relative flex w-full items-center overflow-hidden rounded-md">
              <input className="w-full bg-[#f4f4f4] focus:outline-none border border-none placeholder:text-[14px] placeholder:opacity-50 h-[50px] rounded-l-[50px] pl-5! pr-4! py-2!" placeholder="O que esta buscando hoje?" style={{ fontFamily: "Arial, sans-serif" }} />
              <button className="flex !bg-[#f4f4f4] justify-center items-center border-none rounded-none rounded-r-[50px] h-[50px] w-[60px]" aria-label="buscar"><SearchIcon /></button>
            </div>
          </div>
          <div className="flex" style={{ background: "var(--color-primary)" }}>
            <div className="flex gap-[8px] z-30 !px-[15px] h-[32px] items-center text-white text-[14px] w-full" style={{ background: "var(--color-primary)", opacity: 0.9 }}>
              <LocationPin />
              <span>Insira seu CEP</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          BREADCRUMB
          ═══════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 50px", width: "100%" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "var(--color-textSecondary)", fontFamily: "Arial, sans-serif" }}>
          <ol style={{ display: "flex", gap: 8, listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
            <li><button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13 }}>Pneus</button></li>
            <li style={{ color: "#999" }}>/</li>
            <li><button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13 }}>Pneus de caminhao e onibus</button></li>
            <li style={{ color: "#999" }}>/</li>
            <li><button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13 }}>Regional</button></li>
            <li style={{ color: "#999" }}>/</li>
            <li style={{ color: "#666" }}>{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MAIN PRODUCT SECTION (2-column layout)
          ═══════════════════════════════════════════════════════════ */}
      <main id="main-content" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 50px 40px", width: "100%" }}>
        <div className="product_container_product__Yi9Lf" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          {/* ─── LEFT COLUMN: Gallery ─── */}
          <div className="product_product_left_column__BRpbr" style={{ flex: "1 1 480px", minWidth: 320, maxWidth: 560 }}>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 12 }}>
                {/* Vertical Thumbnails */}
                <div className="product_thumbnails__SHRvn" style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                  {product.thumbnails.map((thumb, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`product_thumbnails_img__z1Dr2 ${currentImage === i ? "product_active_thumbnail__icgqh" : ""}`}
                      style={{
                        width: 80, height: 80,
                        border: currentImage === i ? "2px solid var(--color-primary)" : "2px solid #e0e0e0",
                        borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "white", padding: 2, flexShrink: 0,
                      }}
                      aria-label={`Imagem ${i + 1}`}
                    >
                      <img src={`/${thumb}`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </button>
                  ))}

                  {/* INMETRO Stamps */}
                  <div className="product_selo_inmetro____W_B" style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                    <div className="product_all_stamps__onSMZ" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: 22, height: 22, background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>
                            <img src="/resistencia-ao-rolamento.svg" alt="" width={14} height={14} />
                          </div>
                          <div style={{ width: 22, height: 22, background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0", fontSize: 11, fontWeight: 700 }}>
                            {product.inmetro.rollingResistance}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: 22, height: 22, background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>
                            <img src="/aderencia-pista-molhada.svg" alt="" width={14} height={14} />
                          </div>
                          <div style={{ width: 22, height: 22, background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0", fontSize: 11, fontWeight: 700 }}>
                            {product.inmetro.wetGrip}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: 22, height: 22, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>
                            <img src="/ruido-externo-2.png" alt="" width={14} height={14} />
                          </div>
                          <div style={{ width: 22, height: 22, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0", fontSize: 9, fontWeight: 700, color: "white" }}>
                            {product.inmetro.noise}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 12, textDecoration: "underline", padding: 0, marginTop: 4 }}>Inmetro</button>
                  </div>
                </div>

                {/* Main Image Carousel */}
                <div className="product_main_carousel__zKHVJ" style={{ flex: 1, position: "relative" }}>
                  <div style={{ position: "relative", aspectRatio: "1/1", background: "#fafafa", borderRadius: 12, overflow: "hidden" }}>
                    <img
                      src={`/${product.images[currentImage].src}`}
                      srcSet={product.images[currentImage].srcset}
                      alt={product.name}
                      fetchPriority="high"
                      style={{ position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, objectFit: "contain" }}
                    />
                  </div>

                  {/* Prev/Next arrows */}
                  <button
                    onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
                    disabled={currentImage === 0}
                    className="product_buttonBack__0KLTL"
                    style={{
                      position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                      width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
                      border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: currentImage === 0 ? "not-allowed" : "pointer", opacity: currentImage === 0 ? 0.4 : 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)",
                    }}
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => setCurrentImage(Math.min(product.images.length - 1, currentImage + 1))}
                    disabled={currentImage === product.images.length - 1}
                    className="product_buttonNext__bXWuP"
                    style={{
                      position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                      width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
                      border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: currentImage === product.images.length - 1 ? "not-allowed" : "pointer",
                      opacity: currentImage === product.images.length - 1 ? 0.4 : 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)",
                    }}
                    aria-label="Proxima imagem"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="product_dotGroup__m7O1k" style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12, height: 50, alignItems: "center" }}>
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`dot___3c3SI ${currentImage === i ? "carousel__dot--selected" : ""}`}
                    style={{
                      width: currentImage === i ? 24 : 8, height: 8, borderRadius: 4, border: "none",
                      background: currentImage === i ? "var(--color-primary)" : "#d0d0d0", cursor: "pointer",
                      transition: "all 0.2s", padding: 0,
                    }}
                    aria-label={`Imagem ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: Product Info ─── */}
          <div className="product_container_info__o42_9" style={{ flex: "1 1 480px", minWidth: 320 }}>
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
            <div className="product_title_and_subtitle__KY7xd">
              <h1 style={{ fontSize: 22, fontWeight: 400, color: "var(--color-textBase)", margin: "0 0 12px", lineHeight: 1.4, fontFamily: "Arial, sans-serif" }}>
                {product.name}
              </h1>
            </div>

            {/* ID + Rating */}
            <div className="product_id_and_rating__i6LqA" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, color: "var(--color-textSecondary)" }}>ID: {product.id}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stars count={product.stars} />
                <span style={{ fontSize: 14, color: "var(--color-textSecondary)" }}>({product.reviews})</span>
              </div>
            </div>

            {/* Informacoes button */}
            <div className="product_buttons_info__7aTna" style={{ marginBottom: 16 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", border: "1px solid var(--color-primary)", borderRadius: 6, background: "transparent", color: "var(--color-primary)", cursor: "pointer", fontSize: 14 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                Informacoes
              </button>
            </div>

            {/* Price Section — matching original exactly */}
            <div className="product_prices__sV_aS" style={{ marginBottom: 20 }}>
              {/* Original price strikethrough */}
              <p style={{ margin: "0 0 4px", fontSize: 14, color: "var(--color-textSecondary)" }}>
                <s>R$&nbsp;{product.origPrice}</s>
              </p>

              {/* PIX Price — big + badge inline */}
              <div className="product_in_cash__FuouE" style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 36, fontWeight: 700, color: "var(--color-pdp-price, var(--color-primary))", lineHeight: 1.1 }}>
                  R$ {product.pixPrice.split(",")[0]}<span style={{ fontSize: 22 }}>,{product.pixPrice.split(",")[1]}</span>
                </h2>
                <span style={{ display: "inline-block", background: "var(--color-primary)", color: "white", padding: "3px 12px", borderRadius: 4, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  no PIX
                </span>
              </div>

              {/* Installments */}
              <div className="product_in_installments__mpOM0">
                <p style={{ margin: "4px 0", fontSize: 14, color: "var(--color-textSecondary)" }}>
                  ou R$&nbsp;{product.installmentTotal} em ate {product.installmentCount}x de R$&nbsp;{product.installmentValue} sem juros.
                </p>
                <button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13, textDecoration: "underline", padding: 0 }}>
                  <span>Veja mais formas de pagamento</span>
                </button>
              </div>
            </div>

            {/* Quantity + Buy Button — matching original */}
            <div className="product_btn_buy_and_shipping__Dv8_J" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              {/* Quantity Selector — Ant Design style */}
              <div className="counter_counter_container__jFi8Q" style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "white", border: "1px solid #d9d9d9", borderRadius: "6px 0 0 6px",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer",
                    color: quantity <= 1 ? "#ccc" : "var(--color-primary)", fontSize: 16,
                  }}
                  aria-label="Diminuir quantidade"
                >
                  <MinusIcon />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  style={{
                    width: 50, height: 40, textAlign: "center", border: "1px solid #d9d9d9",
                    borderLeft: "none", borderRight: "none", outline: "none", fontSize: 14,
                  }}
                  aria-label="Quantidade"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "white", border: "1px solid #d9d9d9", borderRadius: "0 6px 6px 0",
                    cursor: "pointer", color: "var(--color-primary)", fontSize: 16,
                  }}
                  aria-label="Aumentar quantidade"
                >
                  <PlusIcon />
                </button>
              </div>

              {/* Buy Button — ghost/outlined, full width up to 300px */}
              <button
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", maxWidth: 300, height: 48,
                  border: "1px solid #d9d9d9", borderRadius: 8,
                  background: "transparent", color: "var(--color-textBase)",
                  fontSize: 16, fontWeight: 500, cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-primary)"; e.currentTarget.style.color = "var(--color-primary)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d9d9d9"; e.currentTarget.style.color = "var(--color-textBase)"; }}
              >
                <CartIcon size={20} />
                <span>Comprar</span>
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
            TABS: Sobre o produto + Informacoes tecnicas
            ═══════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 48 }}>
          <div className="ant-tabs ant-tabs-top ant-tabs-centered" style={{ position: "relative" }}>
            <div role="tablist" className="ant-tabs-nav" style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #e8e8e8" }}>
              <div className="ant-tabs-nav-wrap">
                <div className="ant-tabs-nav-list" style={{ display: "flex", position: "relative" }}>
                  <button
                    role="tab"
                    onClick={() => setActiveTab(0)}
                    className={`ant-tabs-tab ${activeTab === 0 ? "ant-tabs-tab-active" : ""}`}
                    style={{
                      padding: "16px 24px", fontSize: 15, fontWeight: activeTab === 0 ? 600 : 400,
                      color: activeTab === 0 ? "var(--color-primary)" : "var(--color-textSecondary)",
                      background: "none", border: "none", cursor: "pointer",
                      borderBottom: activeTab === 0 ? "2px solid var(--color-primary)" : "2px solid transparent",
                      transition: "all 0.2s", position: "relative",
                    }}
                  >
                    Sobre o produto
                  </button>
                  <button
                    role="tab"
                    onClick={() => setActiveTab(1)}
                    className={`ant-tabs-tab ${activeTab === 1 ? "ant-tabs-tab-active" : ""}`}
                    style={{
                      padding: "16px 24px", fontSize: 15, fontWeight: activeTab === 1 ? 600 : 400,
                      color: activeTab === 1 ? "var(--color-primary)" : "var(--color-textSecondary)",
                      background: "none", border: "none", cursor: "pointer",
                      borderBottom: activeTab === 1 ? "2px solid var(--color-primary)" : "2px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    Informacoes tecnicas
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Panels */}
            <div className="ant-tabs-content-holder">
              <div className="ant-tabs-content ant-tabs-content-top">
                {/* Tab 0: Sobre o produto */}
                {activeTab === 0 && (
                  <div role="tabpanel" className="ant-tabs-tabpane ant-tabs-tabpane-active">
                    <div className="tabs-product_about_tire__RmDXf" style={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: 860, margin: "70px auto", padding: "0 20px" }}>
                      <div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: 20 }}>{product.name}</h3>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)", marginBottom: 20 }}>
                          *Nossas vendas sao realizadas apenas para consumidor final, sendo vetada a comercializacao para CNPJ de revendedores.
                        </p>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)", marginBottom: 8, fontWeight: 600 }}>
                          Sobre a marca Itaro
                        </p>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)", marginBottom: 16 }}>
                          A Itaro nasceu para motoristas viverem novas historias - em duas ou quatro rodas. Desenvolvida nas grandes fabricas asiaticas, a marca e homologada nos principais mercados da Europa e America, como o Brasil. Seus pneus foram pensados em centros de pesquisa e desenvolvimento de paises como China, Paquista e Tailandia, que estao entre os maiores do mundo.
                        </p>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)" }}>
                          Com presenca exclusiva na PneuStore, a Itaro oferece solucoes para carros de passeio, SUVs, caminhonetes, motos e caminhoes, com excelente qualidade e custo que ajudam motoristas a viverem novos capitulos todos os dias.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 1: Informacoes tecnicas */}
                {activeTab === 1 && (
                  <div role="tabpanel" className="ant-tabs-tabpane ant-tabs-tabpane-active">
                    <div style={{ maxWidth: 860, margin: "40px auto", padding: "0 20px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, fontFamily: "Arial, sans-serif" }}>
                        <tbody>
                          {[
                            ["Medida", "215/75R17.5"],
                            ["Aro", '17.5"'],
                            ["Indice de carga", "135/133"],
                            ["Indice de velocidade", "J (100 km/h)"],
                            ["Lonas", "16"],
                            ["Tipo", "TL (Tubeless)"],
                            ["Resistencia a rolamento", product.inmetro.rollingResistance],
                            ["Aderencia em pista molhada", product.inmetro.wetGrip],
                            ["Ruido externo", product.inmetro.noise],
                          ].map(([label, value], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e8e8e8" }}>
                              <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--color-textBase)", background: i % 2 === 0 ? "#fafafa" : "white", width: "40%" }}>{label}</td>
                              <td style={{ padding: "12px 16px", color: "var(--color-textSecondary)", background: i % 2 === 0 ? "#fafafa" : "white" }}>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            Q&A SECTION (Perguntas e Respostas)
            ═══════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 48, borderTop: "1px solid #e8e8e8", paddingTop: 32 }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            {/* Header */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "var(--color-primary)", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Perguntas e Respostas</p>
              <p style={{ color: "var(--color-primary)", fontSize: 14, margin: 0 }}>Tem alguma duvida sobre esse produto? Envie-nos.</p>
            </div>

            {/* Form */}
            <div style={{ marginBottom: 24 }}>
              <textarea
                placeholder="Digite sua pergunta"
                style={{
                  width: "100%", minHeight: 80, padding: 12, borderRadius: 8,
                  border: "2px solid #dfe1e6", fontSize: 14, fontFamily: "Arial, sans-serif",
                  resize: "vertical", outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#4c9aff"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#dfe1e6"; }}
              />
              <button style={{
                marginTop: 8, padding: "8px 24px", borderRadius: 8,
                background: "var(--color-primary)", color: "white", border: "none",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
                Enviar pergunta
              </button>
            </div>

            {/* Questions */}
            {qaQuestions.map((qa, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ borderRadius: 10, padding: 16, background: "#f9f9f9" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 500, color: "var(--color-textBase)" }}>{qa.question}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-textSecondary)" }}>
                    por <b>{qa.author}</b> em {qa.date}
                  </p>
                </div>
                <div style={{ marginLeft: 24, marginTop: 8, padding: "12px 16px", borderLeft: "3px solid var(--color-primary)", background: "#fafafa", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 14, color: "var(--color-textBase)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{qa.answer}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-textSecondary)" }}>
                    por <b>{qa.answerBy}</b> em {qa.answerDate}
                  </p>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16, alignItems: "center" }}>
              <button disabled style={{ color: "var(--color-primary)", opacity: 0.3, background: "none", border: "none", fontSize: 16, cursor: "not-allowed" }}>&lt;</button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setQaPage(page - 1)}
                  style={{
                    width: 32, height: 32, borderRadius: "50%", border: "none",
                    background: qaPage === page - 1 ? "var(--color-primary)" : "transparent",
                    color: qaPage === page - 1 ? "white" : "var(--color-primary)",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                  }}
                >
                  {page}
                </button>
              ))}
              <button style={{ color: "var(--color-primary)", background: "none", border: "none", fontSize: 16, cursor: "pointer" }}>&gt;</button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            RELATED PRODUCTS
            ═══════════════════════════════════════════════════════════ */}
        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20, color: "var(--color-textBase)" }}>
            Confira outros produtos
          </h2>

          <div style={{ position: "relative" }}>
            <button onClick={() => scrollRelated("left")} style={{ position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "white", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)" }} aria-label="Anterior">
              <ChevronLeft />
            </button>

            <div ref={relatedScrollRef} style={{ display: "flex", gap: 16, overflowX: "auto", scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none", padding: "4px 0" }} className="hide-scrollbar">
              {relatedProducts.map((p, i) => (
                <Link href="/produto" key={i} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ minWidth: 260, maxWidth: 260, border: "1px solid #e8e8e8", borderRadius: 12, overflow: "hidden", background: "white", cursor: "pointer", transition: "box-shadow 0.2s", flexShrink: 0 }}
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
                          <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{p.rr}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 700 }}>
                          <div style={{ width: 18, height: 18, borderRadius: "4px 0 0 4px", background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src="/92cd0612962d6caef7b755437547b544970a915c.png" alt="" width={12} height={12} />
                          </div>
                          <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{p.wg}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 700 }}>
                          <div style={{ width: 18, height: 18, borderRadius: "4px 0 0 4px", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src="/a9c67ec6b08617feea202bddb77ebc4ae147d1ff.png" alt="" width={12} height={12} />
                          </div>
                          <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 9 }}>{p.noise}</div>
                        </div>
                      </div>

                      <div style={{ width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <img src={`/${p.img}`} alt={p.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>

                      {p.brand && (
                        <div style={{ width: "100%", height: 24, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                          <img src={`/${p.brand}`} alt="" style={{ maxHeight: 24, objectFit: "contain" }} />
                        </div>
                      )}

                      <p style={{ fontSize: 13, color: "var(--color-textBase)", lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.title}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                        <Stars count={p.stars} />
                        <span style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>({p.reviews})</span>
                      </div>

                      <div>
                        <span style={{ fontSize: 12, color: "var(--color-textSecondary)", textDecoration: "line-through" }}>R$ {p.origPrice}</span>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-primary)" }}>R$ {p.curPrice}</div>
                        <span style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>ou 10x de R$ {p.installment}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button onClick={() => scrollRelated("right")} style={{ position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "white", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)" }} aria-label="Proximo">
              <ChevronRight />
            </button>
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════
          NEWSLETTER
          ═══════════════════════════════════════════════════════════ */}
      <section className="product_container_newsletter__ZmXX_" style={{ background: "var(--color-secondary)" }}>
        <section className="newsletter_newsletter_container_home__4T9VZ">
          <form className="flex flex-col desktop:flex-row h-full">
            <div className="flex flex-col w-full h-full font-arial gap-[24px] items-center !bg-[var(--color-secondary)] !px-[16px] !py-[24px] desktop:!px-[100px] desktop:!py-[48px]">
              <div className="flex flex-col gap-[4px]">
                <h2 className="font-bold text-center !text-[24px] desktop:!text-[30px] leading-[32px] desktop:leading-[38px] !text-[var(--color-primary)]">
                  Fique por dentro das acoes que acontecem na PNEUSTORE
                </h2>
              </div>
              <div className="flex flex-col desktop:flex-row gap-[16px] w-full justify-center">
                <div className="w-full flex flex-col">
                  <input className="!border-inputGlobalBorder w-full bg-white border-[1px] !py-[4px] !px-[11px] rounded-md !text-[14px] placeholder-inputGlobalTextPlaceholder !h-[40px]" aria-label="Seu nome" placeholder="Seu nome" name="name" />
                </div>
                <div className="w-full flex flex-col">
                  <input className="!border-inputGlobalBorder w-full bg-white border-[1px] !py-[4px] !px-[11px] rounded-md !text-[14px] placeholder-inputGlobalTextPlaceholder !h-[40px]" type="email" aria-label="Seu email" placeholder="E-mail" name="email" />
                </div>
                <button type="submit" className="!bg-[var(--color-primary)] !border-[var(--color-primary)] text-white !h-[40px] rounded-md !px-[32px] font-bold cursor-pointer border-none" style={{ minWidth: 140 }}>
                  Me inscrever
                </button>
              </div>
            </div>
          </form>
        </section>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer id="footer-items">
        <div className="flex flex-col text-white PSFooterWrapper_pneuStoreFooter__u2BfR">
          {/* Footer Main */}
          <div className="flex desktop:flex-wrap flex-col desktop:flex-row justify-between gap-[16px] !px-[16px] !py-[24px] desktop:!px-[100px] desktop:!py-[48px]" style={{ background: "var(--color-primary)" }}>
            <img className="h-[29px] w-[213px]" alt="Pneustore Logo footer" src="/reverseLogo.png" style={{ filter: "brightness(0) invert(1)" }} />

            <div className="flex flex-col gap-[16px]">
              <span className="font-bold text-left text-[16px]">Institucional</span>
              <div className="flex flex-col items-start gap-[8px]">
                {["Garantia", "Politica de privacidade", "Trabalhe conosco", "Marcas", "Portal Renegocie"].map((item) => (
                  <button key={item} className="text-[14px] text-left hover:underline cursor-pointer text-white" style={{ background: "none", border: "none", padding: 0 }}>{item}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <span className="font-bold text-left text-[16px]">Ajuda</span>
              <div className="flex flex-col items-start gap-[8px]">
                {["Suporte PneuStore", "Perguntas frequentes", "Entrega", "Meus pedidos", "Informacoes tecnicas de pneus", "Trocas e devolucoes"].map((item) => (
                  <button key={item} className="text-[14px] text-left hover:underline cursor-pointer text-white" style={{ background: "none", border: "none", padding: 0 }}>{item}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <span className="font-bold text-left text-[16px]">Servico</span>
              <div className="flex flex-col items-start gap-[8px]">
                {["Seja um parceiro de servicos", "Montagem em nossos parceiros", "Protecao para seus pneus"].map((item) => (
                  <button key={item} className="text-[14px] text-left hover:underline cursor-pointer text-white" style={{ background: "none", border: "none", padding: 0 }}>{item}</button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[16px]">
              <span className="font-bold text-left text-[16px]">Central de relacionamento</span>
              <div className="flex flex-col items-start gap-[8px]">
                <p className="text-[14px] text-left m-0">(47) 3046-2551</p>
                <p className="text-[12px] text-left opacity-60 m-0">(Ligacoes de qualquer origem)</p>
                <p className="text-[14px] text-left m-0">4000-2313</p>
                <p className="text-[12px] text-left opacity-60 m-0">Para capitais e regioes metropolitanas</p>
              </div>
            </div>
          </div>

          {/* Footer Bottom: Trust Badges */}
          <div className="flex gap-[16px] desktop:gap-[64px] flex-wrap !px-[16px] desktop:!px-[100px] !py-[24px]" style={{ background: "var(--color-primaryPurpleDark, #3e0075)" }}>
            <div className="hidden desktop:flex flex-col gap-[16px]">
              <p className="text-[11px] opacity-70 uppercase tracking-wider m-0">Seguranca</p>
              <img src="/logoConfi.png" alt="Confi.eco" style={{ height: 48 }} />
            </div>
            <div className="flex gap-[20px] items-center flex-wrap justify-center">
              <img src="/reclameAwardlogo.png" alt="Reclame AQUI" style={{ height: 48 }} />
              <img src="/complainHerelogo.png" alt="Bom" style={{ height: 48 }} />
              <img src="/clinteRecommendsLogo.png" alt="O Cliente Recomenda" style={{ height: 48 }} />
              <img src="/logoBsi.png" alt="BSI ISO 27001" style={{ height: 48 }} />
            </div>
            <div className="flex flex-col gap-[16px]">
              <p className="text-[11px] opacity-70 uppercase tracking-wider m-0">Certificado de Destinacao Final</p>
              <img src="/resetLogo.png" alt="Reset Descarte" style={{ height: 40 }} />
            </div>
          </div>

          {/* Footer Payment */}
          <div className="flex flex-col items-center gap-[8px] !px-[16px] !py-[24px] desktop:!px-[100px]" style={{ background: "var(--color-footerBottomBg, white)" }}>
            <div className="flex gap-[24px] mb-[12px]">
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
            <img src="/paymentMethodsLogos.png" alt="Formas de Pagamento" style={{ height: 22 }} />
            <p className="text-[12px] text-center m-0" style={{ color: "var(--color-textSecondary)" }}>
              Parcele suas compras usando seu cartao de credito e pague em ate 10x sem juros
            </p>
            <p className="text-[10px] text-center m-0 mt-[8px] pt-[8px]" style={{ color: "var(--color-textSecondary)", borderTop: "1px solid #e8e8e8", width: "100%" }}>
              2022 PneuStore. CPX Distribuidora S/A. Rodovia SC 486 - Antonio Heil, 800 - Bairro Itaipava - CEP 88316001 - Itajai/SC. CNPJ: 10.158.356/0001-01.
            </p>
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
