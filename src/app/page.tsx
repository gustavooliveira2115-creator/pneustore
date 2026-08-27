"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  WhatsAppIcon,
  HamburgerIcon,
  WrenchIcon,
  Stars,
} from "@/components/icons";
import { PRODUCT_SLUG } from "@/lib/slug";

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

const heroSlides = [
  { mobile: "b9e70e93a47b74dcb59f.webp", desktop: "09a9d3da3c2695bf066a.webp", tablet: "d62b0a74db6a9d86b117.webp", alt: "Pangea Inter" },
  { mobile: "07781405c13fa20255c8.webp", desktop: "331a42bc32f9fe915463.webp", tablet: "f73eee7f376272beb325.webp", alt: "PIX 10 E 10X" },
  { mobile: "49f67d43a3cd22049ea7.webp", desktop: "44049c8776f5ae4d429c.webp", tablet: "c999858ea34ecd2e29ef.webp", alt: "PAGALEVE" },
  { mobile: "74ab501bd3312d6262a3.webp", desktop: "172d7dd86976dafeca24.webp", tablet: "b6538c4a348841a8f3f3.webp", alt: "ITARO" },
  { mobile: "d6e5cf27f3c2813992ae.webp", desktop: "13ac61d37400c39268d9.webp", tablet: "83e0075c29163e5c25fa.webp", alt: "Promoção até 2000OFF" },
  { mobile: "a000a15ad265b2c78bfc.webp", desktop: "3fed4529f62400125267.webp", tablet: "23e31b9e9aaaf2d1cfc8.webp", alt: "Frete Grátis" },
  { mobile: "1af452f6c3aa480d29fa.webp", desktop: "fa46cbdf5731e51aef7e.webp", tablet: "150f47529723c6032b0a.webp", alt: "FRETE GRÁTIS MOTO" },
  { mobile: "ad04df6f72bbc180cd9b.webp", desktop: "b745b7fa40885bd9cb6c.webp", tablet: "da5b4721a1ccbbe368d0.webp", alt: "FRETE GRÁTIS CARGA" },
  { mobile: "477b1e0c9192ddb92f59.webp", desktop: "f21b67dc323845d36db9.webp", tablet: "143e68714e5aeb6ba1f0.webp", alt: "INSTITUTO AYRTON SENNA" },
  { mobile: "b65b2c3f22cd8360a8bf.webp", desktop: "289e6c5dc1402044c925.webp", tablet: "edb4eeba6ca4c3097ace.webp", alt: "GALVÃO" },
  { mobile: "20f7e6e5e96daa13d4cd.webp", desktop: "09a9d3da3c2695bf066a.webp", tablet: "c17ef5d3a6cb04b5ece5.webp", alt: "BANNER Speedmax" },
  { mobile: "199cbc19850f94f018cc.webp", desktop: "d063c4be97eb7228b5d7.webp", tablet: "ab57a3c9cd3c42c17c35.webp", alt: "Michelin" },
  { mobile: "574edae5eb9302cd4ccb.webp", desktop: "cd4afe1cbdaf949aa5ac.webp", tablet: "ab7b4782fde99df6af73.webp", alt: "Garantia Speedmax Infinity" },
  { mobile: "ca5e4b59731ea4c51b37.webp", desktop: "08a068d10b8178bad281.webp", tablet: "75e7b701f5b1588df785.webp", alt: "Pneus Kumho" },
  { mobile: "72626b2df1162174c985.webp", desktop: "e5c6e0064d90f901141f.webp", tablet: "d28aa2d12adf79431e82.webp", alt: "Banner oficinas" },
];

const products = [
  { id: 1, img: "ad3934dd692d3fc98e39.webp", img2x: "ad3934dd692d3fc98e39-1.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17.5 IT01 215/75R17.5 135/133J 16 Lonas TL", origPrice: "633,23", curPrice: "569,90", installment: "63,32", stars: 4.5, reviews: 13, freteGratis: false, badge: null },
  { id: 2, img: "9b5df45b1454befcdc9a.webp", img2x: "9b5df45b1454befcdc9a-1.webp", brand: "Continental_banner_teste.webp", title: "Pneu Continental Aro 16 PowerContact 2 195/55R16 87H", origPrice: "622,12", curPrice: "559,90", installment: "62,21", stars: 4.5, reviews: 24, freteGratis: false, badge: "SELO_DESCONTO NO CARRINHO (1).gif" },
  { id: 3, img: "410e0c51717b0e53b244.webp", img2x: "410e0c51717b0e53b244-1.webp", brand: "mini-banner-pneustore-maggion.png", title: "Pneu Moto Maggion Aro 18 Winner 90/90-18 57P TT - Traseiro", origPrice: "183,23", curPrice: "164,90", installment: "18,32", stars: 4.5, reviews: 207, freteGratis: false, badge: null },
  { id: 4, img: "a323d9adb006c0471594.webp", img2x: "a323d9adb006c0471594-1.webp", brand: "Bfgoodrich_banner.webp", title: "Pneu BFGoodrich Aro 17 All Terrain KO3 265/65R17 116/113S", origPrice: "1.743,79", curPrice: "1.429,90", installment: "174,38", stars: 5, reviews: 6, freteGratis: false, badge: "SELO 7 - 18_ OFF.gif" },
  { id: 5, img: "4962a99b1d28118b3811.webp", img2x: "4962a99b1d28118b3811-1.webp", brand: null, title: "Pneu Michelin Aro 18 Primacy 5 225/55R18 102V XL", origPrice: "966,56", curPrice: "869,90", installment: "96,66", stars: 4.5, reviews: 14, freteGratis: false, badge: null },
  { id: 6, img: "807960ca69075c347ee9.webp", img2x: "807960ca69075c347ee9-1.webp", brand: null, title: "Pneu Gripmaster Aro 15 G-Push 195/65R15 91V", origPrice: "316,56", curPrice: "284,90", installment: "31,66", stars: 4.5, reviews: 4, freteGratis: false, badge: null },
  { id: 7, img: "4466aa4454665032a0dd.webp", img2x: "4466aa4454665032a0dd-1.webp", brand: null, title: "Pneu Hankook Aro 17 Kinergy GT H436 205/55R17 91H", origPrice: "599,89", curPrice: "539,90", installment: "59,99", stars: 4.5, reviews: 13, freteGratis: false, badge: null },
  { id: 8, img: "92dee4d520be27c658a9-1.webp", img2x: "92dee4d520be27c658a9.webp", brand: null, title: "Pneu Kumho Aro 19 Crugen HP71 235/45R19 95H", origPrice: "888,78", curPrice: "799,90", installment: "88,88", stars: 4.5, reviews: 8, freteGratis: true, badge: null },
  { id: 9, img: "5c8cc860d24a73327390.webp", img2x: "5c8cc860d24a73327390-1.webp", brand: null, title: "Pneu Moto Metzeler Aro 18 Enduro 3 120/80-18 62S TT - Traseiro", origPrice: "611,00", curPrice: "549,90", installment: "61,10", stars: 4.5, reviews: 46, freteGratis: false, badge: null },
  { id: 10, img: "f6b0914fb381764d034c-1.webp", img2x: "f6b0914fb381764d034c.webp", brand: null, title: "Pneu Speedmax Aro 18 Controlmax Plus CP12 165/40R18 73V XL", origPrice: "411,00", curPrice: "369,90", installment: "41,10", stars: 5, reviews: 3, freteGratis: true, badge: null },
  { id: 11, img: "5da2ff075e45d0873282-1.webp", img2x: "5da2ff075e45d0873282.webp", brand: null, title: "Pneu Moto Pirelli Aro 17 Diablo 120/70R17 58W TL - Dianteiro", origPrice: "733,23", curPrice: "659,90", installment: "73,32", stars: 5, reviews: 1, freteGratis: false, badge: null },
  { id: 12, img: "7eacb04f-f6d5-4609-8567-dc1dc21d6f45-1.jpg", img2x: "7eacb04f-f6d5-4609-8567-dc1dc21d6f45.jpg", brand: null, title: "Pneu Bicicleta Continental Aro 700 Gator Skin 700X25", origPrice: "511,83", curPrice: "450,41", installment: "51,18", stars: 5, reviews: 1, freteGratis: false, badge: null },
  { id: 13, img: "aa95c5118e5a0c14fe97.webp", img2x: "aa95c5118e5a0c14fe97-1.webp", brand: null, title: "Pneu Goodyear Aro 15 EfficientGrip Performance 205/60R15 91H", origPrice: "622,12", curPrice: "559,90", installment: "62,21", stars: 3, reviews: 7, freteGratis: false, badge: null },
  { id: 14, img: "1dad6eb44f33ce2cbbb1-1.webp", img2x: "1dad6eb44f33ce2cbbb1.webp", brand: null, title: "Pneu Michelin Aro 16 Energy XM2+ 205/55R16 91V", origPrice: "556,70", curPrice: "489,89", installment: "55,67", stars: 2.5, reviews: 2, freteGratis: false, badge: null },
  { id: 15, img: "f19c1d1141a1e8a39bdb-1.webp", img2x: "f19c1d1141a1e8a39bdb.webp", brand: null, title: "Pneu Hankook Aro 19 Dynapro HP2 RA33 235/55R19 101V", origPrice: "1.039,90", curPrice: "935,91", installment: "103,99", stars: 0, reviews: 0, freteGratis: true, badge: null },
  { id: 16, img: "43a06cb751105d2bd59b-1.webp", img2x: "43a06cb751105d2bd59b.webp", brand: null, title: "Pneu Moto Pirelli Aro 17 Scorpion Trail 120/70R17 58W TL - Dianteiro", origPrice: "466,56", curPrice: "419,90", installment: "46,66", stars: 0, reviews: 0, freteGratis: false, badge: null },
];

const brands = [
  { name: "Itaro", logo: "ItaroBanner-1.webp", logo1x: "ItaroBanner.webp" },
  { name: "Speedmax", logo: "marca_SpeedmaxBanner.png", logo1x: "marca_SpeedmaxBanner-1.png" },
  { name: "Continental", logo: "Continental_banner_teste-1.webp", logo1x: "Continental_banner_teste-2.webp" },
  { name: "Suzuka", logo: "SUZUKA 150.webp", logo1x: "SUZUKA 150.webp" },
  { name: "Easymax", logo: "EASYMAX 150.webp", logo1x: "EASYMAX 150.webp" },
  { name: "Pirelli", logo: "PirelliBanner-1.webp", logo1x: "PirelliBanner.webp" },
  { name: "Michelin", logo: "MICHELIN-1.webp", logo1x: "MICHELIN.webp" },
  { name: "Firestone", logo: "Firestone_banner.webp", logo1x: "Firestone_banner-1.webp" },
  { name: "Bridgestone", logo: "marca_BridgeStoneBanner-1.png", logo1x: "marca_BridgeStoneBanner.png" },
  { name: "Barum", logo: "Barum_banner-1.webp", logo1x: "Barum_banner.webp" },
  { name: "Goodyear", logo: "marca_GoodYearBanner-1.png", logo1x: "marca_GoodYearBanner.png" },
  { name: "Ceat", logo: "Ceat_banner-1.webp", logo1x: "Ceat_banner.webp" },
  { name: "Onyx", logo: "Onyx_banner-1.webp", logo1x: "Onyx_banner.webp" },
  { name: "Kumho", logo: "KUMHO.webp", logo1x: "KUMHO-1.webp" },
  { name: "Gripmaster", logo: "Gripmaster_banner_01-1.webp", logo1x: "Gripmaster_banner_01.webp" },
  { name: "General Tire", logo: "General Tyre_banner.webp", logo1x: "General Tyre_banner.webp" },
  { name: "Dynamo", logo: "Dynamo_banner-1.webp", logo1x: "Dynamo_banner.webp" },
  { name: "Aeolus", logo: "AEOLUS.webp", logo1x: "AEOLUS-1.webp" },
  { name: "BFGoodrich", logo: "BFG.webp", logo1x: "BFG-1.webp" },
  { name: "Evergreen", logo: "Evergreen_banner-1.webp", logo1x: "Evergreen_banner.webp" },
  { name: "Hankook", logo: "HANKOOK.webp", logo1x: "HANKOOK-1.webp" },
  { name: "Maggion", logo: "MAGGION.webp", logo1x: "MAGGION-1.webp" },
  { name: "Metzeler", logo: "METZELER.webp", logo1x: "METZELER-1.webp" },
  { name: "Ni-Pon", logo: "Nipon_banner-1.webp", logo1x: "Nipon_banner.webp" },
];

const categoryCards = [
  { label: "Carros", img: "0f7f0c7cb1fe801980c6.webp", img2x: "0f7f0c7cb1fe801980c6-1.webp" },
  { label: "Caminhão e ônibus", img: "2e98db7e0cd9df548df5.webp", img2x: "2e98db7e0cd9df548df5-1.webp" },
  { label: "Motos", img: "c9df565892fdbfa4e61b.webp", img2x: "c9df565892fdbfa4e61b-1.webp" },
];

/* ═══════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════ */

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [productScrollPos, setProductScrollPos] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [vehicleType, setVehicleType] = useState("carros");
  const productScrollRef = useRef<HTMLDivElement>(null);

  /* Hero auto-play */
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const scrollProducts = useCallback((dir: "left" | "right") => {
    if (!productScrollRef.current) return;
    const amount = 320;
    productScrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  }, []);

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>

      <Header />

      {/* ═══════════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════════ */}
      <main id="main-content" style={{ display: "flex", flexDirection: "column", minHeight: "100vh", paddingBottom: 55 }}>

        {/* ─── HERO CAROUSEL ─── */}
        <section style={{ position: "relative", width: "100%", overflow: "hidden" }}>
          <div style={{ display: "flex", transition: "transform 0.4s ease", transform: `translateX(-${heroIndex * 100}%)` }}>
            {heroSlides.map((slide, i) => (
              <div key={i} style={{ minWidth: "100%", flexShrink: 0 }}>
                <div style={{ position: "relative", width: "100%", height: "clamp(200px, 25vw, 400px)" }}>
                  <img
                    src={`/${slide.desktop}`}
                    alt={slide.alt}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </div>
            ))}
          </div>
          {/* Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            aria-label="Slide anterior"
          >
            <ChevronLeft />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={() => setHeroIndex((prev) => (prev + 1) % heroSlides.length)}
            aria-label="Próximo slide"
          >
            <ChevronRight />
          </button>
          {/* Dots */}
          <div className="carousel-dots">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === heroIndex ? "active" : ""}`}
                onClick={() => setHeroIndex(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ─── VEHICLE SEARCH PANEL ─── */}
        <section style={{ width: "100%", display: "flex", justifyContent: "center", padding: "24px 10%", background: "var(--color-neutralBgLayout)" }}>
          <div style={{ maxWidth: 1240, width: "100%", background: "white", borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #f0f0f0" }}>
              {[
                { id: 1, label: "Medida do pneu" },
                { id: 2, label: "Veículo" },
                { id: 3, label: "Placa" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: "12px 16px",
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "none",
                    background: activeTab === tab.id ? "var(--color-primaryPurpleBase)" : "transparent",
                    color: activeTab === tab.id ? "white" : "var(--color-primaryPurpleBase)",
                    transition: "all 0.2s",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Tab Content */}
            <div style={{ padding: 16 }}>
              {activeTab === 1 && (
                <div>
                  {/* Vehicle type radio */}
                  <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                    {[
                      { key: "carros", label: "Carros" },
                      { key: "vans", label: "Vans e utilitários" },
                      { key: "caminhao", label: "Caminhão e ônibus" },
                      { key: "moto", label: "Motos" },
                    ].map((vt) => (
                      <button
                        key={vt.key}
                        onClick={() => setVehicleType(vt.key)}
                        style={{
                          padding: "6px 16px",
                          borderRadius: 20,
                          fontSize: 13,
                          cursor: "pointer",
                          border: `1px solid ${vehicleType === vt.key ? "var(--color-primaryPurpleBase)" : "#d9d9d9"}`,
                          background: vehicleType === vt.key ? "var(--color-primaryPurpleBase)" : "white",
                          color: vehicleType === vt.key ? "white" : "var(--color-textBase)",
                          transition: "all 0.15s",
                        }}
                      >
                        {vt.label}
                      </button>
                    ))}
                  </div>
                  {/* Selects */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                    {["Largura", "Perfil", "Aro"].map((label) => (
                      <div key={label} style={{ flex: 1, minWidth: 150 }}>
                        <label style={{ display: "block", fontSize: 12, color: "var(--color-textSecondary)", marginBottom: 4 }}>{label}</label>
                        <select style={{ width: "100%", height: 40, border: "1px solid var(--color-inputGlobalBorder)", borderRadius: 6, padding: "0 12px", fontSize: 14, background: "white", color: "var(--color-textBase)" }}>
                          <option>Selecione</option>
                        </select>
                      </div>
                    ))}
                    <button className="btn btn-primary" style={{ height: 40, padding: "0 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>
                      Buscar pneus
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 2 && (
                <div style={{ padding: "16px 0", textAlign: "center", color: "var(--color-textSecondary)", fontSize: 14 }}>
                  Selecione a marca, modelo e ano do seu veículo.
                </div>
              )}
              {activeTab === 3 && (
                <div style={{ padding: "16px 0", display: "flex", gap: 12, alignItems: "flex-end" }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: "block", fontSize: 12, color: "var(--color-textSecondary)", marginBottom: 4 }}>Placa do veículo</label>
                    <input style={{ width: "100%", height: 40, border: "1px solid var(--color-inputGlobalBorder)", borderRadius: 6, padding: "0 12px", fontSize: 14, textTransform: "uppercase" }} placeholder="ABC1D23" maxLength={7} />
                  </div>
                  <button className="btn btn-primary" style={{ height: 40, padding: "0 24px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>Buscar</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ─── PRODUCT CAROUSEL ─── */}
        <section className="zebra-white" style={{ padding: "32px 10%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontSize: 24, fontWeight: 600 }}>Aproveite nossos descontos especiais</h2>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => scrollProducts("left")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #d9d9d9", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Anterior">
                  <ChevronLeft />
                </button>
                <button onClick={() => scrollProducts("right")} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid #d9d9d9", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} aria-label="Próximo">
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div ref={productScrollRef} style={{ display: "flex", gap: 16, overflowX: "auto", scrollBehavior: "smooth", paddingBottom: 8, scrollbarWidth: "thin" }}>
              {products.map((p) => (
                <div key={p.id} className="product-card" style={{ minWidth: 260, maxWidth: 280 }}>
                   {/* Image */}
                      <Link href={`/produto/${PRODUCT_SLUG}`} style={{ textDecoration: "none", color: "inherit" }}>
                     <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 8, background: "#fafafa", cursor: "pointer" }}>
                       <img src={`/${p.img2x}`} alt={p.title} style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }} />
                       {p.badge && (
                         <img src={`/${p.badge}`} alt="" style={{ position: "absolute", top: 0, left: 0, maxWidth: 80, maxHeight: 80, objectFit: "contain" }} />
                       )}
                     </div>
                   </Link>
                   {/* Frete grátis */}
                   {p.freteGratis && (
                     <span style={{ display: "inline-block", background: "var(--color-primaryYellowTertiaryBase)", color: "var(--color-primaryPurpleBase)", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, alignSelf: "flex-start" }}>
                       Frete grátis
                     </span>
                   )}
                   {/* Brand logo */}
                   {p.brand && (
                     <img src={`/${p.brand}`} alt="" style={{ height: 20, width: "auto", objectFit: "contain", alignSelf: "flex-start" }} />
                   )}
                   {/* Stars + Reviews */}
                   <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                     <Stars count={p.stars} />
                     <span style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>({p.reviews})</span>
                   </div>
                   {/* Title */}
                      <Link href={`/produto/${PRODUCT_SLUG}`} style={{ textDecoration: "none", color: "inherit" }}>
                     <p style={{ fontSize: 13, fontWeight: 600, color: "#4b4b4b", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 54, cursor: "pointer" }}>
                       {p.title}
                     </p>
                   </Link>
                  {/* Prices */}
                  <div>
                    <p style={{ fontSize: 12, color: "#8c8c8c", textDecoration: "line-through" }}>R$ {p.origPrice}</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-primary)" }}>R$ {p.curPrice}</p>
                    <p style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>ou 10x de R$ {p.installment}</p>
                  </div>
                  {/* CEP input */}
                  <input style={{ width: "100%", height: 32, border: "1px solid #d9d9d9", borderRadius: 6, padding: "0 10px", fontSize: 12 }} placeholder="Insira seu CEP" />
                  {/* Buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button className="btn btn-primary" style={{ flex: 1, height: 36, fontSize: 13, fontWeight: 600, borderRadius: 8 }}>
                      Comprar
                    </button>
                    <button className="btn btn-outline" style={{ height: 36, fontSize: 12, padding: "0 12px" }}>
                      Comparar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CATEGORY CARDS ─── */}
        <section className="zebra-gray" style={{ padding: "32px 10%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <p style={{ fontSize: 24, fontWeight: 600, marginBottom: 16, textAlign: "center" }}>Navegue por categoria</p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              {categoryCards.map((cat) => (
                <div key={cat.label} style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 100, maxWidth: 392, borderRadius: 6 }}>
                  <img src={`/${cat.img2x}`} alt={cat.label} width={392} height={192} style={{ width: "100%", height: "auto", objectFit: "cover" }} />
                  <span style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: 16, fontWeight: 600, height: 32, color: "white", background: "var(--color-primary)" }}>
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── BRAND STRIPS ─── */}
        <section className="zebra-gray" style={{ padding: "32px 10%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Nossas marcas</h3>
            <div className="brand-strip-scroll">
              {brands.map((b) => (
                <div key={b.name} style={{ display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 150, maxWidth: 150, borderRadius: 6, flexShrink: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 70, padding: 8, background: "white" }}>
                    <img src={`/${b.logo}`} alt={`Imagem de marca: ${b.name}`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                  </div>
                  <span style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: 16, fontWeight: 600, height: 32, color: "var(--color-primary)", background: "var(--color-secondary)" }}>
                    {b.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ABOUT / CONTINENTAL BANNER ─── */}
        <section className="zebra-white" style={{ padding: "16px 10%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            {/* Desktop */}
            <img src="/8159365589940d4262c6-1.webp" alt="Banner Continental" style={{ width: "100%", height: "auto", borderRadius: 8 }} />
          </div>
        </section>

        {/* ─── SERVICES SECTION ─── */}
        <section className="zebra-gray" style={{ padding: "32px 10%" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto" }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 8 }}>
                <p style={{ fontSize: 20, fontWeight: 700 }}>Montagem + Balanceamento + Alinhamento</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <WrenchIcon />
                <p>Mais de <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>5.000</span> parceiros de montagem em todo Brasil</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { img: "service_car.webp", title: "Carro", subtitle: "Profissionais especializados para cuidar do seu carro" },
                { img: "service_bike.webp", title: "Moto", subtitle: "Serviços completos com profissionais dedicados às duas rodas" },
                { img: "service_truck.webp", title: "Caminhão", subtitle: "Estrutura máxima com profissionais dedicados aos caminhões" },
              ].map((s) => (
                <div key={s.title} style={{ minWidth: 200, maxWidth: 480, minHeight: 320, display: "flex", flexDirection: "column", padding: 16, gap: 16, borderRadius: 8, border: "1px solid var(--color-inputGlobalBorder)", background: "white", flex: 1 }}>
                  <img src={`/${s.img}`} alt={s.title} style={{ borderRadius: 4, width: "100%", height: 160, objectFit: "cover" }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                    <h4 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-primary)" }}>{s.title}</h4>
                    <p style={{ color: "var(--color-neutralTextSecondary)", fontSize: 12, lineHeight: "20px" }}>{s.subtitle}</p>
                  </div>
                  <p style={{ color: "var(--color-neutralTextTertiary)", fontSize: 12, lineHeight: "20px" }}>Confira a disponibilidade dos serviços em sua região consultando o CEP.</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 32 }}>
              <button className="btn btn-primary" style={{ height: 48, padding: "0 32px", fontSize: 16, fontWeight: 700 }}>
                Contratar serviço
              </button>
            </div>
          </div>
        </section>

        {/* ─── NEWSLETTER ─── */}
        <section style={{ background: "var(--color-secondary)", padding: "24px 16px" }}>
          <form style={{ display: "flex", flexDirection: "column", maxWidth: 1240, margin: "0 auto", gap: 24, alignItems: "center" }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: "center", color: "var(--color-primary)", lineHeight: "32px" }}>
              Fique por dentro das ações que acontecem na PNEUSTORE
            </h2>
            <div style={{ display: "flex", gap: 16, width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
              <input
                style={{ flex: 1, minWidth: 200, maxWidth: 350, height: 40, border: "1px solid var(--color-inputGlobalBorder)", borderRadius: 6, padding: "0 12px", fontSize: 14, background: "white" }}
                placeholder="Seu nome"
                aria-label="Seu nome"
              />
              <input
                type="email"
                style={{ flex: 1, minWidth: 200, maxWidth: 350, height: 40, border: "1px solid var(--color-inputGlobalBorder)", borderRadius: 6, padding: "0 12px", fontSize: 14, background: "white" }}
                placeholder="E-mail"
                aria-label="Seu email"
              />
              <button className="btn btn-primary" style={{ height: 40, padding: "0 34px", fontSize: 16, whiteSpace: "nowrap", maxWidth: 264 }}>
                Me inscrever
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--color-textBase)", textAlign: "center" }}>
              Ao assinar, aceito receber emails com promoções e ofertas da PneuStore
            </p>
          </form>
        </section>
      </main>

      <Footer />

      {/* ─── WHATSAPP FLOAT ─── */}
      <a
        href="https://wa.me/5516997648401"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
