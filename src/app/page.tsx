"use client";

import { useState, useEffect, useCallback, useRef } from "react";

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

const ChevronRight = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeft = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round" />
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
        <span style={{ color: "#ddd" }}>★</span>
        <span style={{ position: "absolute", left: 0, overflow: "hidden", width: "50%", color: "#f5a623" }}>★</span>
      </>
    ) : (
      "★"
    )}
  </span>
);

const WhatsAppIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M3.33398 10H16.6673M3.33398 5H16.6673M3.33398 15H16.6673" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const WrenchIcon = () => (
  <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

export default function HomePage() {
  const [cookieOpen, setCookieOpen] = useState(true);
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
                <button type="button" style={{ display: "flex", alignItems: "center", height: "100%", padding: "0 12px", cursor: "pointer", background: "none", border: "none", color: "inherit", fontSize: 12, transition: "text-decoration 0.15s" }}>Quero revender</button>
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
              <img src="/0e22de206c8bff4b6700ad14924492a518cca03a.png" alt="logo" style={{ height: 30, cursor: "pointer" }} />
              {/* Search */}
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
              {/* User + Cart */}
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
                      <button style={{ display: "flex", gap: 8, alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap", transition: "background 0.15s" }}>
                        {item}
                        <span style={{ transition: "transform 0.2s" }}><ChevronDown /></span>
                      </button>
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button style={{ display: "flex", gap: 8, alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap" }}>
                      Marcas
                      <span><ChevronDown /></span>
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button style={{ display: "flex", gap: 8, alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap" }}>
                      Promoções
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button style={{ display: "flex", gap: 8, alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap" }}>
                      Revenda
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button style={{ display: "flex", gap: 8, alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap" }}>
                      Seja um parceiro
                    </button>
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <button style={{ display: "flex", gap: 8, alignItems: "center", height: 32, padding: "0 15px", fontSize: 14, cursor: "pointer", background: "none", border: "none", color: "white", borderRadius: 6, margin: "10px 0", whiteSpace: "nowrap" }}>
                      Nossas lojas
                    </button>
                  </div>
                </div>
                {/* CEP Button */}
                <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "var(--color-primaryPurpleDarkest)", padding: "0 15px", height: 32, borderRadius: 8, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", color: "white", border: "none" }}>
                  <LocationPin />
                  <span style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title="Insira seu CEP">Insira seu CEP</span>
                </button>
              </div>
            </div>
          </nav>

          {/* Mobile Header */}
          <div className="desktop:hidden" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
            <img src="/a9c181e7594016ab63d3.webp" alt="Compre pneus com 5 anos de garantia" style={{ width: "100%" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--color-primaryPurpleBase)" }}>
              <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }} aria-label="Abrir menu">
                <HamburgerIcon />
              </button>
              <img src="/0e22de206c8bff4b6700ad14924492a518cca03a.png" alt="logo" style={{ height: 14 }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer" }} aria-label="Usuário"><UserIcon /></button>
                <button style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", gap: 4, alignItems: "center" }} aria-label="Carrinho">
                  <CartIcon />
                  <span style={{ background: "var(--color-primaryBlueSecondaryBase)", borderRadius: "50%", padding: "2px 6px", fontSize: 11, color: "var(--color-primaryPurpleBase)" }}>0</span>
                </button>
              </div>
            </div>
            {/* Mobile Search */}
            <div style={{ width: "100%", position: "relative" }}>
              <div style={{ display: "flex", width: "100%", alignItems: "center", overflow: "hidden", borderRadius: 10 }}>
                <input style={{ width: "100%", background: "#f4f4f4", outline: "none", border: "none", height: 50, borderRadius: "10px 0 0 10px", padding: "0 20px", fontSize: 14 }} placeholder="O que estou buscando hoje?" aria-label="campo de busca" />
                <button style={{ background: "#f4f4f4", display: "flex", justifyContent: "center", alignItems: "center", border: "none", borderRadius: "0 10px 10px 0", height: 50, width: 60, cursor: "pointer" }} aria-label="buscar">
                  <SearchIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 8, background: "#fafafa" }}>
                    <img src={`/${p.img2x}`} alt={p.title} style={{ maxWidth: "85%", maxHeight: "85%", objectFit: "contain" }} />
                    {p.badge && (
                      <img src={`/${p.badge}`} alt="" style={{ position: "absolute", top: 0, left: 0, maxWidth: 80, maxHeight: 80, objectFit: "contain" }} />
                    )}
                  </div>
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
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#4b4b4b", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 54 }}>
                    {p.title}
                  </p>
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

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════ */}
      <footer style={{ display: "flex", flexDirection: "column", color: "white" }}>
        {/* Main Footer - Purple */}
        <div style={{ background: "var(--color-footerBackground)", padding: "32px 50px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 32 }}>
            {/* Logo */}
            <img src="/reverseLogo.png" alt="Pneustore Logo footer" style={{ height: 29, width: 213, objectFit: "contain" }} />

            {/* Institucional */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Institucional</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Garantia", "Política de privacidade", "Marcas"].map((item) => (
                  <li key={item}><span style={{ fontSize: 14, opacity: 0.9, cursor: "pointer" }}>{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Ajuda */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Ajuda</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Perguntas frequentes", "Entrega", "Informações técnicas de pneus", "Trocas e devoluções"].map((item) => (
                  <li key={item}><span style={{ fontSize: 14, opacity: 0.9, cursor: "pointer" }}>{item}</span></li>
                ))}
              </ul>
            </div>

            {/* Serviço */}
            <div>
              <h4 style={{ fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Serviço</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {["Montagem em nossos parceiros", "Proteção para seus pneus"].map((item) => (
                  <li key={item}><span style={{ fontSize: 14, opacity: 0.9, cursor: "pointer" }}>{item}</span></li>
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
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 24 }}>
            {/* Avaliações */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <img src="/logoConfi.png" alt="Confi" style={{ height: 48, objectFit: "contain" }} />
              <img src="/reclameAwardlogo.png" alt="Reclame Aqui" style={{ height: 48, objectFit: "contain" }} />
              <img src="/complainHerelogo.png" alt="Reclame Aqui Bom" style={{ height: 48, objectFit: "contain" }} />
              <img src="/logoBsi.png" alt="BSI" style={{ height: 48, objectFit: "contain" }} />
              <img src="/clinteRecommendsLogo.png" alt="O Cliente Recomenda" style={{ height: 48, objectFit: "contain" }} />
              <img src="/resetLogo.png" alt="Reset Descarte" style={{ height: 48, objectFit: "contain" }} />
            </div>
            {/* Social Media */}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="16" height="16" fill="var(--color-primaryPurpleBase)" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="16" height="16" fill="var(--color-primaryPurpleBase)" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="var(--color-primaryPurpleBase)" strokeWidth="2" /><circle cx="12" cy="12" r="5" fill="none" stroke="var(--color-primaryPurpleBase)" strokeWidth="2" /><circle cx="17.5" cy="6.5" r="1.5" fill="var(--color-primaryPurpleBase)" /></svg>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <svg width="16" height="16" fill="var(--color-primaryPurpleBase)" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="white" /></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Projetos que apoiamos */}
        <div style={{ background: "var(--color-primaryPurpleBase)", padding: "24px 50px" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
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
        <div style={{ background: "var(--color-footerBottomBg)", padding: "24px 50px", color: "var(--color-footerBottomText)" }}>
          <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14 }}>Formas de pagamento</h3>
            <img src="/paymentMethodsLogos.png" alt="Formas de Pagamento" style={{ height: 40, width: "auto", objectFit: "contain" }} />
            <p style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>Parcele suas compras usando seu cartão de crédito e pague em até 10x sem juros</p>
            <p style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>© 2022 PneuStore. CPX Distribuidora S/A. Rodovia SC 486 - Antonio Heil, 800 - Bairro Itaipava - CEP 88316001 - Itajaí/SC. CNPJ: 10.158.356/0001-01.</p>
          </div>
        </div>
      </footer>

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
