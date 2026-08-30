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
import { useCart } from "@/components/CartContext";
import { useRouter } from "next/navigation";

/** Converte "398,93" ou "1.220,65" -> centavos (39893, 122065) */
function brlToCents(v: string): number {
  const digits = v.replace(/\./g, "").replace(",", "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

const heroSlides = [
  { mobile: "b9e70e93a47b74dcb59f.webp", desktop: "09a9d3da3c2695bf066a.webp", tablet: "d62b0a74db6a9d86b117.webp", alt: "Pangea Inter" },
  { mobile: "desconto-pix-galvao.png", desktop: "desconto-pix-galvao.png", tablet: "desconto-pix-galvao.png", alt: "PIX 40% OFF Galvão" },
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
  { id: 1, slug: "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl", img: "ad3934dd692d3fc98e39.webp", img2x: "ad3934dd692d3fc98e39-1.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17.5 IT01 215/75R17.5 135/133J 16 Lonas TL", origPrice: "443,26", curPrice: "398,93", installment: "44,32", stars: 4.5, reviews: 13, freteGratis: false, badge: null },
  { id: 2, slug: "pneu-continental-aro-16-powercontact-2-195-55r16-87h-10120084", img: "9b5df45b1454befcdc9a.webp", img2x: "9b5df45b1454befcdc9a-1.webp", brand: "Continental_banner_teste.webp", title: "Pneu Continental Aro 16 PowerContact 2 195/55R16 87H", origPrice: "435,48", curPrice: "391,93", installment: "43,55", stars: 4.5, reviews: 24, freteGratis: false, badge: "SELO_DESCONTO NO CARRINHO (1).gif" },
  { id: 3, slug: "pneu-moto-maggion-aro-18-winner-90-90-18-57p-tt-traseiro-16001288", img: "410e0c51717b0e53b244.webp", img2x: "410e0c51717b0e53b244-1.webp", brand: "mini-banner-pneustore-maggion.png", title: "Pneu Moto Maggion Aro 18 Winner 90/90-18 57P TT - Traseiro", origPrice: "128,26", curPrice: "115,43", installment: "12,82", stars: 4.5, reviews: 207, freteGratis: false, badge: null },
  { id: 4, slug: "pneu-bfgoodrich-aro-17-all-terrain-ko3-265-65r17-116-113s-letras-brancas-16012686", img: "a323d9adb006c0471594.webp", img2x: "a323d9adb006c0471594-1.webp", brand: "Bfgoodrich_banner.webp", title: "Pneu BFGoodrich Aro 17 All Terrain KO3 265/65R17 116/113S - Letras Brancas", origPrice: "1.220,65", curPrice: "1.000,93", installment: "122,07", stars: 5, reviews: 4, freteGratis: false, badge: "SELO 7 - 18_ OFF.gif" },
  { id: 5, slug: "pneu-michelin-aro-18-primacy-5-225-55r18-102v-xl-16017629", img: "4962a99b1d28118b3811.webp", img2x: "4962a99b1d28118b3811-1.webp", brand: null, title: "Pneu Michelin Aro 18 Primacy 5 225/55R18 102V XL", origPrice: "684,37", curPrice: "615,93", installment: "68,43", stars: 5, reviews: 1, freteGratis: false, badge: null },
  { id: 6, slug: "pneu-gripmaster-aro-15-g-push-195-65r15-91v-16014557", img: "807960ca69075c347ee9.webp", img2x: "807960ca69075c347ee9-1.webp", brand: null, title: "Pneu Gripmaster Aro 15 G-Push 195/65R15 91V", origPrice: "221,59", curPrice: "199,43", installment: "22,15", stars: 0, reviews: 0, freteGratis: false, badge: null },
  { id: 7, slug: "pneu-hankook-aro-17-kinergy-gt-h436-205-55r17-91h-10031209", img: "4466aa4454665032a0dd.webp", img2x: "4466aa4454665032a0dd-1.webp", brand: null, title: "Pneu Hankook Aro 17 Kinergy GT H436 205/55R17 91H", origPrice: "419,92", curPrice: "377,93", installment: "41,99", stars: 4.8, reviews: 6, freteGratis: false, badge: null },
  { id: 8, slug: "pneu-kumho-aro-19-crugen-hp71-235-45r19-95h-16015402", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9-1.webp", brand: null, title: "Pneu Kumho Aro 19 Crugen HP71 235/45R19 95H", origPrice: "622,15", curPrice: "559,93", installment: "62,21", stars: 4.8, reviews: 4, freteGratis: true, badge: null },
  { id: 9, slug: "pneu-moto-metzeler-aro-18-enduro-3-120-80-18-62s-tt-traseiro-16004122", img: "5c8cc860d24a73327390.webp", img2x: "5c8cc860d24a73327390-1.webp", brand: null, title: "Pneu Moto Metzeler Aro 18 Enduro 3 120/80-18 62S TT - Traseiro", origPrice: "427,70", curPrice: "384,93", installment: "42,77", stars: 4.7, reviews: 46, freteGratis: false, badge: null },
  { id: 10, slug: "pneu-speedmax-aro-18-controlmax-plus-cp12-165-40r18-73v-xl-16009170", img: "f6b0914fb381764d034c.webp", img2x: "f6b0914fb381764d034c-1.webp", brand: null, title: "Pneu Speedmax Aro 18 Controlmax Plus CP12 165/40R18 73V XL", origPrice: "287,70", curPrice: "258,93", installment: "28,77", stars: 5, reviews: 3, freteGratis: true, badge: null },
  { id: 11, slug: "pneu-moto-pirelli-aro-17-diablo-120-70r17-58w-tl-dianteiro-16016646", img: "5da2ff075e45d0873282.webp", img2x: "5da2ff075e45d0873282-1.webp", brand: null, title: "Pneu Moto Pirelli Aro 17 Diablo 120/70R17 58W TL - Dianteiro", origPrice: "513,26", curPrice: "461,93", installment: "51,32", stars: 0, reviews: 0, freteGratis: false, badge: null },
  { id: 12, slug: "pneu-bicicleta-continental-aro-700-gator-skin-700x25-10360008", img: "7eacb04f-f6d5-4609-8567-dc1dc21d6f45.jpg", img2x: "7eacb04f-f6d5-4609-8567-dc1dc21d6f45-1.jpg", brand: null, title: "Pneu Bicicleta Continental Aro 700 Gator Skin 700X25", origPrice: "407,14", curPrice: "358,28", installment: "40,71", stars: 5, reviews: 1, freteGratis: false, badge: null },
  { id: 13, slug: "pneu-goodyear-aro-15-efficientgrip-performance-205-60r15-91h-16008675", img: "aa95c5118e5a0c14fe97.webp", img2x: "aa95c5118e5a0c14fe97-1.webp", brand: null, title: "Pneu Goodyear Aro 15 EfficientGrip Performance 205/60R15 91H", origPrice: "435,48", curPrice: "391,93", installment: "43,55", stars: 3, reviews: 2, freteGratis: false, badge: null },
  { id: 14, slug: "pneu-michelin-aro-16-energy-xm2-205-55r16-91v-16037362", img: "1dad6eb44f33ce2cbbb1.webp", img2x: "1dad6eb44f33ce2cbbb1-1.webp", brand: null, title: "Pneu Michelin Aro 16 Energy XM2+ 205/55R16 91V", origPrice: "388,82", curPrice: "349,93", installment: "38,88", stars: 0, reviews: 0, freteGratis: false, badge: null },
  { id: 15, slug: "pneu-hankook-aro-19-dynapro-hp2-ra33-235-55r19-101v-10040638", img: "f19c1d1141a1e8a39bdb.webp", img2x: "f19c1d1141a1e8a39bdb-1.webp", brand: null, title: "Pneu Hankook Aro 19 Dynapro HP2 RA33 235/55R19 101V", origPrice: "808,82", curPrice: "727,93", installment: "80,88", stars: 0, reviews: 0, freteGratis: true, badge: null },
  { id: 16, slug: "pneu-moto-pirelli-aro-17-scorpion-trail-120-70r17-58w-tl-dianteiro-10200046", img: "43a06cb751105d2bd59b.webp", img2x: "43a06cb751105d2bd59b-1.webp", brand: null, title: "Pneu Moto Pirelli Aro 17 Scorpion Trail 120/70R17 58W TL - Dianteiro", origPrice: "326,59", curPrice: "293,93", installment: "32,65", stars: 0, reviews: 0, freteGratis: false, badge: null },
  { id: 17, slug: "pneu-itaro-aro-13-mh01-175-70r13-82t-16004776", img: "a1bf6d6206b7323eb5da.webp", img2x: "a1bf6d6206b7323eb5da.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 13 MH01 175/70R13 82T", origPrice: "209,92", curPrice: "188,93", installment: "20,99", stars: 4.6, reviews: 441, freteGratis: false, badge: null },
  { id: 18, slug: "pneu-itaro-aro-14-mh01-175-70r14-84t-16004777", img: "fd3716aeb4ed63d2acb4.webp", img2x: "fd3716aeb4ed63d2acb4.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 14 MH01 175/70R14 84T", origPrice: "217,70", curPrice: "191,58", installment: "21,77", stars: 4.6, reviews: 423, freteGratis: false, badge: null },
  { id: 19, slug: "pneu-itaro-aro-15-comformax-185-60r15-84h-16005020", img: "8aeea17b0ed3e1910587.webp", img2x: "8aeea17b0ed3e1910587.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 Comformax 185/60R15 84H", origPrice: "194,37", curPrice: "174,93", installment: "19,43", stars: 4.7, reviews: 67, freteGratis: false, badge: null },
  { id: 20, slug: "pneu-itaro-aro-15-it203-195-55r15-85v-16000053", img: "fcb80e3152b94780bbeb.webp", img2x: "fcb80e3152b94780bbeb.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 IT203 195/55R15 85V", origPrice: "206,04", curPrice: "185,43", installment: "20,60", stars: 4.6, reviews: 115, freteGratis: false, badge: null },
  { id: 21, slug: "pneu-ceat-aro-14-ecodrive-175-70r14-88t-xl-10010939", img: "322a497c5f3341d57e1c.webp", img2x: "322a497c5f3341d57e1c.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 14 EcoDrive 175/70R14 88T XL", origPrice: "256,59", curPrice: "230,93", installment: "25,65", stars: 5, reviews: 10, freteGratis: false, badge: null },
  { id: 22, slug: "pneu-itaro-aro-17-it301-225-45r17-94w-xl-16000043", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT301 225/45R17 94W XL", origPrice: "244,30", curPrice: "219,87", installment: "24,43", stars: 4.5, reviews: 42, freteGratis: false, badge: null },
  { id: 23, slug: "pneu-itaro-aro-14-mh01-175-65r14-86t-xl-16004779", img: "6e6db0c0a1f1b280f66d.webp", img2x: "6e6db0c0a1f1b280f66d.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 14 MH01 175/65R14 86T XL", origPrice: "206,03", curPrice: "185,42", installment: "20,60", stars: 4.4, reviews: 14, freteGratis: false, badge: null },
  { id: 24, slug: "pneu-barum-by-continental-aro-14-bravuris-5hm-175-65r14-82t-10120226", img: "070febce2c758e97a18f.webp", img2x: "070febce2c758e97a18f.webp", brand: "Barum_banner.webp", title: "Pneu Barum by Continental Aro 14 Bravuris 5HM 175/65R14 82T", origPrice: "246,48", curPrice: "202,92", installment: "24,65", stars: 4.8, reviews: 28, freteGratis: false, badge: null },
  { id: 25, slug: "pneu-ceat-aro-14-ecodrive-175-65r14-82t-10010938", img: "25a75661f761a2ee5321.webp", img2x: "25a75661f761a2ee5321.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 14 EcoDrive 175/65R14 82T", origPrice: "244,92", curPrice: "220,43", installment: "22,04", stars: 4.6, reviews: 115, freteGratis: false, badge: null },
  { id: 26, slug: "pneu-itaro-aro-15-comformax-195-60r15-88v-16004992", img: "4e60be3494072c35a598.webp", img2x: "4e60be3494072c35a598.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 Comformax 195/60R15 88V", origPrice: "215,37", curPrice: "174,93", installment: "21,53", stars: 4.7, reviews: 180, freteGratis: false, badge: null },
  { id: 27, slug: "pneu-itaro-aro-17-it301-205-50r17-93w-xl-16000039", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT301 205/50R17 93W XL", origPrice: "272,15", curPrice: "244,93", installment: "27,21", stars: 4.6, reviews: 74, freteGratis: false, badge: null },
  { id: 28, slug: "pneu-itaro-aro-16-comformax-205-55r16-91v-16004998", img: "dc29fa0a6db82f204e2e.webp", img2x: "dc29fa0a6db82f204e2e.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 Comformax 205/55R16 91V", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.4, reviews: 52, freteGratis: false, badge: null },
  { id: 29, slug: "pneu-itaro-aro-18-it101-225-55r18-98v-16000066", img: "32bc3321f5e8a761d4f3.webp", img2x: "32bc3321f5e8a761d4f3.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 18 IT101 225/55R18 98V", origPrice: "365,48", curPrice: "328,93", installment: "36,55", stars: 4.7, reviews: 45, freteGratis: false, badge: null },
  { id: 30, slug: "pneu-itaro-aro-15-it203-185-65r15-88h-16000051", img: "c29df567d397218bacbd.webp", img2x: "c29df567d397218bacbd.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 IT203 185/65R15 88H", origPrice: "217,70", curPrice: "195,93", installment: "21,77", stars: 4.6, reviews: 69, freteGratis: false, badge: null },
  { id: 31, slug: "pneu-itaro-aro-17-it301-215-50r17-95w-xl-16000041", img: "50f7c0197789d0af305d.webp", img2x: "50f7c0197789d0af305d.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT301 215/50R17 95W XL", origPrice: "307,15", curPrice: "276,43", installment: "30,71", stars: 4.6, reviews: 65, freteGratis: false, badge: null },
  { id: 32, slug: "pneu-itaro-aro-14-it108-175-70r14c-95-93t-16003202", img: "6e7df31d0117b02007ae.webp", img2x: "6e7df31d0117b02007ae.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 14 IT108 175/70R14C 95/93T", origPrice: "217,70", curPrice: "195,93", installment: "21,77", stars: 4.6, reviews: 206, freteGratis: false, badge: null },
  { id: 33, slug: "pneu-itaro-aro-17-it101-215-60r17-96h-16000064", img: "0d21503bfdb7b1601669.webp", img2x: "0d21503bfdb7b1601669.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT101 215/60R17 96H", origPrice: "349,92", curPrice: "314,93", installment: "34,99", stars: 4.6, reviews: 425, freteGratis: false, badge: null },
  { id: 34, slug: "pneu-barum-by-continental-aro-14-bravuris-5hm-175-70r14-88t-xl-10120242", img: "69996e50ccd42d33de09.webp", img2x: "69996e50ccd42d33de09.webp", brand: "Barum_banner.webp", title: "Pneu Barum by Continental  Aro 14 Bravuris 5HM 175/70R14 88T XL", origPrice: "269,81", curPrice: "218,95", installment: "26,98", stars: 4.6, reviews: 286, freteGratis: false, badge: null },
  { id: 35, slug: "pneu-ceat-aro-14-ecodrive-185-70r14-88h-10010943", img: "244cb3da7e4b265f0440.webp", img2x: "244cb3da7e4b265f0440.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 14 EcoDrive 185/70R14 88H", origPrice: "272,15", curPrice: "244,93", installment: "27,21", stars: 4.8, reviews: 473, freteGratis: false, badge: null },
  { id: 36, slug: "pneu-michelin-aro-17-primacy-4-205-55r17-95v-xl-16003626", img: "46b89b5f7ebcc90c1760.webp", img2x: "46b89b5f7ebcc90c1760.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 17 Primacy 4+ 205/55R17 95V XL", origPrice: "603,48", curPrice: "517,92", installment: "60,35", stars: 4.7, reviews: 221, freteGratis: false, badge: null },
  { id: 37, slug: "pneu-itaro-aro-16-it203-205-60r16-92h-16000721", img: "aafe895cdd4666246d9c.webp", img2x: "aafe895cdd4666246d9c.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 IT203 205/60R16 92H", origPrice: "264,37", curPrice: "232,64", installment: "26,43", stars: 4.5, reviews: 283, freteGratis: false, badge: null },
  { id: 38, slug: "pneu-itaro-aro-14-mh01-185-70r14-88h-16004778", img: "cc4aa7d43ca35acb0d2c.webp", img2x: "cc4aa7d43ca35acb0d2c.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 14 MH01 185/70R14 88H", origPrice: "241,04", curPrice: "216,93", installment: "24,10", stars: 4.7, reviews: 48, freteGratis: false, badge: null },
  { id: 39, slug: "pneu-firestone-aro-14-f-600-175-70r14-84t-10100089", img: "69154527576b745dce20.webp", img2x: "69154527576b745dce20.webp", brand: "Firestone_banner.webp", title: "Pneu Firestone Aro 14 F-600 175/70R14 84T", origPrice: "281,48", curPrice: "234,42", installment: "28,15", stars: 4.8, reviews: 5, freteGratis: false, badge: null },
  { id: 40, slug: "pneu-dynamo-aro-14-street-h-mh01-175-65r14-86t-16002588", img: "12f794a7807000a45cfe.webp", img2x: "12f794a7807000a45cfe.webp", brand: "Dynamo_banner.webp", title: "Pneu Dynamo Aro 14 Street-H MH01 175/65R14 86T", origPrice: "225,48", curPrice: "202,93", installment: "22,55", stars: 4.7, reviews: 411, freteGratis: false, badge: null },
  { id: 41, slug: "pneu-itaro-aro-16-it203-205-55r16-91v-16000060", img: "42dad6c44e4b6883c0da.webp", img2x: "42dad6c44e4b6883c0da.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 IT203 205/55R16 91V", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.9, reviews: 38, freteGratis: false, badge: null },
  { id: 42, slug: "pneu-pirelli-aro-17-scorpion-k1-205-55r17-91v-16011127", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 17 Scorpion K1 205/55R17 91V", origPrice: "528,81", curPrice: "475,92", installment: "52,88", stars: 4.8, reviews: 102, freteGratis: false, badge: null },
  { id: 43, slug: "pneu-continental-aro-14-powercontact-2-175-65r14-82t-10120200", img: "9b5df45b1454befcdc9a.webp", img2x: "9b5df45b1454befcdc9a.webp", brand: "Continental_banner_teste.webp", title: "Pneu Continental Aro 14 PowerContact 2 175/65R14 82T", origPrice: "269,81", curPrice: "248,43", installment: "26,98", stars: 4.7, reviews: 156, freteGratis: false, badge: null },
  { id: 44, slug: "pneu-kumho-aro-15-ecowing-es31-185-60r15-84t-10010849", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9.webp", brand: "KUMHO.webp", title: "Pneu Kumho Aro 15 Ecowing ES31 185/60R15 84T", origPrice: "295,48", curPrice: "265,93", installment: "29,55", stars: 4.6, reviews: 58, freteGratis: false, badge: null },
  { id: 45, slug: "pneu-itaro-aro-17-it301-195-40r17-81w-xl-16001758", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT301 195/40R17 81W XL", origPrice: "272,15", curPrice: "244,93", installment: "27,21", stars: 4.6, reviews: 34, freteGratis: false, badge: null },
  { id: 46, slug: "pneu-itaro-aro-15-comformax-195-65r15-91v-16004994", img: "4e60be3494072c35a598.webp", img2x: "4e60be3494072c35a598.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 Comformax 195/65R15 91V", origPrice: "217,70", curPrice: "195,93", installment: "21,77", stars: 4.6, reviews: 78, freteGratis: false, badge: null },
  { id: 47, slug: "pneu-michelin-aro-17-primacy-4-225-45r17-94w-xl-16003189", img: "bbb1e4cd-51a8-412d-9543-7abbe6216c3e.jpg", img2x: "bbb1e4cd-51a8-412d-9543-7abbe6216c3e.jpg", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 17 Primacy 4+ 225/45R17 94W XL", origPrice: "480,59", curPrice: "419,93", installment: "48,06", stars: 4.8, reviews: 205, freteGratis: false, badge: null },
  { id: 48, slug: "pneu-itaro-aro-15-it203-195-65r15-91v-16000055", img: "c29df567d397218bacbd.webp", img2x: "c29df567d397218bacbd.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 IT203 195/65R15 91V", origPrice: "217,70", curPrice: "195,93", installment: "21,77", stars: 4.6, reviews: 58, freteGratis: false, badge: null },
  { id: 49, slug: "pneu-michelin-aro-16-agilis-3-205-75r16c-110-108r-16003084", img: "a1bf6d6206b7323eb5da.webp", img2x: "a1bf6d6206b7323eb5da.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 16 Agilis 3 205/75R16C 110/108R", origPrice: "505,48", curPrice: "454,93", installment: "50,55", stars: 4.8, reviews: 34, freteGratis: false, badge: null },
  { id: 50, slug: "pneu-kumho-aro-15-ecowing-es31-195-65r15-91t-16003140", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9.webp", brand: "KUMHO.webp", title: "Pneu Kumho Aro 15 Ecowing ES31 195/65R15 91T", origPrice: "295,48", curPrice: "265,93", installment: "29,55", stars: 4.6, reviews: 42, freteGratis: false, badge: null },
  { id: 51, slug: "pneu-firestone-aro-14-f-600-175-65r14-82t-10100082", img: "69154527576b745dce20.webp", img2x: "69154527576b745dce20.webp", brand: "Firestone_banner.webp", title: "Pneu Firestone Aro 14 F-600 175/65R14 82T", origPrice: "241,04", curPrice: "216,93", installment: "24,10", stars: 4.7, reviews: 89, freteGratis: false, badge: null },
  { id: 52, slug: "pneu-itaro-aro-17-it301-225-50r17-98w-xl-16000044", img: "50f7c0197789d0af305d.webp", img2x: "50f7c0197789d0af305d.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT301 225/50R17 98W XL", origPrice: "311,04", curPrice: "279,93", installment: "31,10", stars: 4.6, reviews: 58, freteGratis: false, badge: null },
  { id: 53, slug: "pneu-itaro-aro-16-comformax-215-65r16-98h-16007031", img: "4e60be3494072c35a598.webp", img2x: "4e60be3494072c35a598.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 Comformax 215/65R16 98H", origPrice: "299,37", curPrice: "263,44", installment: "29,93", stars: 4.6, reviews: 25, freteGratis: false, badge: null },
  { id: 54, slug: "pneu-barum-by-continental-aro-13-bravuris-5hm-175-70r13-82t-10120225", img: "070febce2c758e97a18f.webp", img2x: "070febce2c758e97a18f.webp", brand: "Barum_banner.webp", title: "Pneu Barum by Continental Aro 13 Bravuris 5HM 175/70R13 82T", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.7, reviews: 34, freteGratis: false, badge: null },
  { id: 55, slug: "pneu-michelin-aro-17-primacy-4-215-60r17-96h-10110148", img: "46b89b5f7ebcc90c1760.webp", img2x: "46b89b5f7ebcc90c1760.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 17 Primacy 4 215/60R17 96H", origPrice: "642,27", curPrice: "545,93", installment: "64,22", stars: 4.8, reviews: 112, freteGratis: false, badge: null },
  { id: 56, slug: "pneu-itaro-aro-17-it101-225-65r17-102t-16000065", img: "0d21503bfdb7b1601669.webp", img2x: "0d21503bfdb7b1601669.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT101 225/65R17 102T", origPrice: "365,48", curPrice: "328,93", installment: "36,55", stars: 4.7, reviews: 24, freteGratis: false, badge: null },
  { id: 57, slug: "pneu-kumho-aro-14-ecowing-es31-175-70r14-84t-16007345", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9.webp", brand: "KUMHO.webp", title: "Pneu Kumho Aro 14 Ecowing ES31 175/70R14 84T", origPrice: "241,12", curPrice: "216,93", installment: "24,11", stars: 4.7, reviews: 36, freteGratis: false, badge: null },
  { id: 58, slug: "pneu-itaro-aro-17-it301-205-45r17-88w-xl-16000038", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT301 205/45R17 88W XL", origPrice: "272,15", curPrice: "244,93", installment: "27,21", stars: 4.6, reviews: 47, freteGratis: false, badge: null },
  { id: 59, slug: "pneu-firestone-aro-16-f-600-205-55r16-91v-10100079", img: "69154527576b745dce20.webp", img2x: "69154527576b745dce20.webp", brand: "Firestone_banner.webp", title: "Pneu Firestone Aro 16 F-600 205/55R16 91V", origPrice: "311,04", curPrice: "279,93", installment: "31,10", stars: 4.7, reviews: 52, freteGratis: false, badge: null },
  { id: 60, slug: "pneu-kumho-aro-15-ecowing-es31-195-60r15-88h-10010776", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9.webp", brand: "KUMHO.webp", title: "Pneu Kumho Aro 15 Ecowing ES31 195/60R15 88H", origPrice: "303,33", curPrice: "272,93", installment: "30,33", stars: 4.6, reviews: 28, freteGratis: false, badge: null },
  { id: 61, slug: "pneu-kumho-aro-14-ecowing-es31-185-70r14-88t-16009356", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9.webp", brand: "KUMHO.webp", title: "Pneu Kumho Aro 14 Ecowing ES31 185/70R14 88T", origPrice: "264,37", curPrice: "237,93", installment: "26,43", stars: 4.6, reviews: 31, freteGratis: false, badge: null },
  { id: 62, slug: "pneu-ceat-aro-13-ecodrive-175-70r13-82t-10010941", img: "25a75661f761a2ee5321.webp", img2x: "25a75661f761a2ee5321.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 13 EcoDrive 175/70R13 82T", origPrice: "217,70", curPrice: "195,93", installment: "21,77", stars: 4.6, reviews: 98, freteGratis: false, badge: null },
  { id: 63, slug: "pneu-kumho-aro-15-ecowing-es31-185-65r15-88h-10010775", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9.webp", brand: "KUMHO.webp", title: "Pneu Kumho Aro 15 Ecowing ES31 185/65R15 88H", origPrice: "303,33", curPrice: "272,93", installment: "30,33", stars: 4.7, reviews: 22, freteGratis: false, badge: null },
  { id: 64, slug: "pneu-ceat-aro-15-ecodrive-185-65r15-88h-10011093", img: "25a75661f761a2ee5321.webp", img2x: "25a75661f761a2ee5321.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 15 EcoDrive 185/65R15 88H", origPrice: "287,78", curPrice: "258,93", installment: "28,78", stars: 4.6, reviews: 64, freteGratis: false, badge: null },
  { id: 65, slug: "pneu-pirelli-aro-17-scorpion-seal-inside-215-55r17-94v-16001560", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 17 Scorpion Seal Inside 215/55R17 94V", origPrice: "622,15", curPrice: "559,93", installment: "62,21", stars: 4.8, reviews: 19, freteGratis: false, badge: null },
  { id: 66, slug: "pneu-michelin-aro-18-ltx-trail-265-60r18-114h-xl-16007618", img: "a1bf6d6206b7323eb5da.webp", img2x: "a1bf6d6206b7323eb5da.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 18 LTX Trail 265/60R18 114H XL", origPrice: "933,26", curPrice: "839,93", installment: "93,32", stars: 4.9, reviews: 12, freteGratis: false, badge: null },
  { id: 67, slug: "pneu-itaro-aro-15-it203-205-60r15-91v-16000056", img: "c29df567d397218bacbd.webp", img2x: "c29df567d397218bacbd.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 IT203 205/60R15 91V", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.6, reviews: 41, freteGratis: false, badge: null },
  { id: 68, slug: "pneu-itaro-aro-13-it203-175-75r13-84t-16001196", img: "fcb80e3152b94780bbeb.webp", img2x: "fcb80e3152b94780bbeb.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 13 IT203 175/75R13 84T", origPrice: "209,92", curPrice: "188,93", installment: "20,99", stars: 4.6, reviews: 29, freteGratis: false, badge: null },
  { id: 69, slug: "pneu-firestone-aro-15-f-600-185-60r15-84h-10100137", img: "69154527576b745dce20.webp", img2x: "69154527576b745dce20.webp", brand: "Firestone_banner.webp", title: "Pneu Firestone Aro 15 F-600 185/60R15 84H", origPrice: "295,48", curPrice: "265,93", installment: "29,55", stars: 4.7, reviews: 44, freteGratis: false, badge: null },
  { id: 70, slug: "pneu-speedmax-aro-16-hh301-205-55r16-91v-10010955", img: "f6b0914fb381764d034c.webp", img2x: "f6b0914fb381764d034c.webp", brand: "marca_SpeedmaxBanner.png", title: "Pneu Speedmax Aro 16 HH301 205/55R16 91V", origPrice: "272,15", curPrice: "244,93", installment: "27,21", stars: 4.7, reviews: 38, freteGratis: false, badge: null },
  { id: 71, slug: "pneu-bridgestone-aro-18-dueler-h-t-684-ii-ecopia-265-60r18-110t-10100049", img: "b008510702b224d2c3f3.webp", img2x: "b008510702b224d2c3f3.webp", brand: "marca_BridgeStoneBanner.png", title: "Pneu Bridgestone Aro 18 Dueler H/T 684 II Ecopia 265/60R18 110T", origPrice: "808,82", curPrice: "727,93", installment: "80,88", stars: 4.8, reviews: 27, freteGratis: false, badge: null },
  { id: 72, slug: "pneu-ceat-aro-15-ecodrive-195-55r15-85v-10011094", img: "25a75661f761a2ee5321.webp", img2x: "25a75661f761a2ee5321.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 15 EcoDrive 195/55R15 85V", origPrice: "256,59", curPrice: "230,93", installment: "25,65", stars: 4.6, reviews: 39, freteGratis: false, badge: null },
  { id: 73, slug: "pneu-firestone-aro-15-f-600-195-55r15-85h-10100120", img: "69154527576b745dce20.webp", img2x: "69154527576b745dce20.webp", brand: "Firestone_banner.webp", title: "Pneu Firestone Aro 15 F-600 195/55R15 85H", origPrice: "279,92", curPrice: "251,93", installment: "27,99", stars: 4.7, reviews: 33, freteGratis: false, badge: null },
  { id: 74, slug: "pneu-itaro-aro-16-it106-205-75r16c-113-111r-10-lonas-16003852", img: "6e7df31d0117b02007ae.webp", img2x: "6e7df31d0117b02007ae.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 IT106 205/75R16C 113/111R 10 Lonas", origPrice: "373,26", curPrice: "335,93", installment: "37,32", stars: 4.7, reviews: 18, freteGratis: false, badge: null },
  { id: 75, slug: "pneu-ceat-aro-15-ecodrive-195-65r15-91h-10011090", img: "25a75661f761a2ee5321.webp", img2x: "25a75661f761a2ee5321.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 15 EcoDrive 195/65R15 91H", origPrice: "287,78", curPrice: "258,93", installment: "28,78", stars: 4.7, reviews: 57, freteGratis: false, badge: null },
  { id: 76, slug: "pneu-barum-by-continental-aro-14-bravuris-5hm-185-70r14-88h-16000599", img: "070febce2c758e97a18f.webp", img2x: "070febce2c758e97a18f.webp", brand: "Barum_banner.webp", title: "Pneu Barum by Continental Aro 14 Bravuris 5HM 185/70R14 88H", origPrice: "269,81", curPrice: "242,82", installment: "26,98", stars: 4.7, reviews: 41, freteGratis: false, badge: null },
  { id: 77, slug: "pneu-pirelli-aro-17-cinturato-p7-new-k1-215-50r17-91v-16008480", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 17 Cinturato P7 New K1 215/50R17 91V", origPrice: "629,92", curPrice: "566,93", installment: "62,99", stars: 4.7, reviews: 89, freteGratis: false, badge: null },
  { id: 78, slug: "pneu-michelin-aro-15-primacy-4-185-60r15-88h-xl-10110146", img: "46b89b5f7ebcc90c1760.webp", img2x: "46b89b5f7ebcc90c1760.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 15 Primacy 4 185/60R15 88H XL", origPrice: "435,48", curPrice: "391,93", installment: "43,55", stars: 4.8, reviews: 67, freteGratis: false, badge: null },
  { id: 79, slug: "pneu-itaro-aro-14-mh01-185-65r14-86h-16009463", img: "cc4aa7d43ca35acb0d2c.webp", img2x: "cc4aa7d43ca35acb0d2c.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 14 MH01 185/65R14 86H", origPrice: "241,04", curPrice: "216,93", installment: "24,10", stars: 4.6, reviews: 33, freteGratis: false, badge: null },
  { id: 80, slug: "pneu-pirelli-aro-16-scorpion-verde-all-season-215-65r16-102h-xl-10070211", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 16 Scorpion Verde All Season 215/65R16 102H XL", origPrice: "699,92", curPrice: "629,93", installment: "69,99", stars: 4.8, reviews: 24, freteGratis: false, badge: null },
  { id: 81, slug: "pneu-pirelli-aro-15-scorpion-atr-205-60r15-91h-16002646", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 15 Scorpion ATR 205/60R15 91H", origPrice: "474,37", curPrice: "426,93", installment: "47,43", stars: 4.7, reviews: 31, freteGratis: false, badge: null },
  { id: 82, slug: "pneu-itaro-aro-17-it301-205-40r17-84w-xl-16000037", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT301 205/40R17 84W XL", origPrice: "272,15", curPrice: "244,93", installment: "27,21", stars: 4.6, reviews: 38, freteGratis: false, badge: null },
  { id: 83, slug: "pneu-itaro-aro-16-it101-235-60r16-100v-16000062", img: "0d21503bfdb7b1601669.webp", img2x: "0d21503bfdb7b1601669.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 IT101 235/60R16 100V", origPrice: "357,70", curPrice: "321,93", installment: "35,77", stars: 4.6, reviews: 27, freteGratis: false, badge: null },
  { id: 84, slug: "pneu-itaro-aro-15-it108-205-70r15c-106-104r-16001045", img: "6e7df31d0117b02007ae.webp", img2x: "6e7df31d0117b02007ae.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 IT108 205/70R15C 106/104R", origPrice: "326,59", curPrice: "293,93", installment: "32,65", stars: 4.7, reviews: 22, freteGratis: false, badge: null },
  { id: 85, slug: "pneu-speedmax-aro-16-energrip-spm022-ev-175-55r16-80h-16009464", img: "f6b0914fb381764d034c.webp", img2x: "f6b0914fb381764d034c.webp", brand: "marca_SpeedmaxBanner.png", title: "Pneu Speedmax Aro 16 Energrip SPM022 EV 175/55R16 80H", origPrice: "303,33", curPrice: "272,93", installment: "30,33", stars: 4.7, reviews: 19, freteGratis: false, badge: null },
  { id: 86, slug: "pneu-bridgestone-aro-15-ecopia-ep150-185-60r15-84h-10100138", img: "b008510702b224d2c3f3.webp", img2x: "b008510702b224d2c3f3.webp", brand: "marca_BridgeStoneBanner.png", title: "Pneu Bridgestone Aro 15 Ecopia EP150 185/60R15 84H", origPrice: "303,33", curPrice: "272,93", installment: "30,33", stars: 4.7, reviews: 56, freteGratis: false, badge: null },
  { id: 87, slug: "pneu-itaro-aro-16-hiscend-h-mc02-225-75r16c-121-120r-16010532", img: "6e7df31d0117b02007ae.webp", img2x: "6e7df31d0117b02007ae.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 Hiscend H MC02 225/75R16C 121/120R", origPrice: "419,92", curPrice: "377,93", installment: "41,99", stars: 4.7, reviews: 16, freteGratis: false, badge: null },
  { id: 88, slug: "pneu-itaro-aro-16-it203-195-55r16-91v-xl-16000059", img: "fcb80e3152b94780bbeb.webp", img2x: "fcb80e3152b94780bbeb.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 IT203 195/55R16 91V XL", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.6, reviews: 39, freteGratis: false, badge: null },
  { id: 89, slug: "pneu-itaro-aro-17-it305-205-55r17-95w-xl-16001537", img: "50f7c0197789d0af305d.webp", img2x: "50f7c0197789d0af305d.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT305 205/55R17 95W XL", origPrice: "311,04", curPrice: "279,93", installment: "31,10", stars: 4.6, reviews: 34, freteGratis: false, badge: null },
  { id: 90, slug: "pneu-itaro-aro-15-mh01-185-65r15-92h-xl-16009242", img: "c29df567d397218bacbd.webp", img2x: "c29df567d397218bacbd.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 MH01 185/65R15 92H XL", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.6, reviews: 26, freteGratis: false, badge: null },
  { id: 91, slug: "pneu-pirelli-aro-18-scorpion-jp-225-55r18-98v-16010716", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 18 Scorpion JP 225/55R18 98V", origPrice: "661,04", curPrice: "594,93", installment: "66,10", stars: 4.8, reviews: 18, freteGratis: false, badge: null },
  { id: 92, slug: "pneu-itaro-aro-15-it108-195-70r15c-104-102r-16001048", img: "6e7df31d0117b02007ae.webp", img2x: "6e7df31d0117b02007ae.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 IT108 195/70R15C 104/102R", origPrice: "311,04", curPrice: "279,93", installment: "31,10", stars: 4.6, reviews: 21, freteGratis: false, badge: null },
  { id: 93, slug: "pneu-pirelli-aro-17-powergy-225-45r17-91w-16004515", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 17 Powergy 225/45R17 91W", origPrice: "474,37", curPrice: "426,93", installment: "47,43", stars: 4.8, reviews: 44, freteGratis: false, badge: null },
  { id: 94, slug: "pneu-itaro-aro-17-powermax-215-55r17-98w-xl-16005001", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 Powermax 215/55R17 98W XL", origPrice: "279,92", curPrice: "251,93", installment: "27,99", stars: 4.6, reviews: 29, freteGratis: false, badge: null },
  { id: 95, slug: "pneu-firestone-aro-15-f-600-195-65r15-91h-10100119", img: "69154527576b745dce20.webp", img2x: "69154527576b745dce20.webp", brand: "Firestone_banner.webp", title: "Pneu Firestone Aro 15 F-600 195/65R15 91H", origPrice: "303,33", curPrice: "272,93", installment: "30,33", stars: 4.7, reviews: 39, freteGratis: false, badge: null },
  { id: 96, slug: "pneu-bridgestone-aro-15-ecopia-ep150-185-65r15-88h-16001233", img: "b008510702b224d2c3f3.webp", img2x: "b008510702b224d2c3f3.webp", brand: "marca_BridgeStoneBanner.png", title: "Pneu Bridgestone Aro 15 Ecopia EP150 185/65R15 88H", origPrice: "334,37", curPrice: "300,93", installment: "33,43", stars: 4.8, reviews: 48, freteGratis: false, badge: null },
  { id: 97, slug: "pneu-itaro-aro-16-it203-215-65r16-98h-16000061", img: "aafe895cdd4666246d9c.webp", img2x: "aafe895cdd4666246d9c.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 IT203 215/65R16 98H", origPrice: "264,37", curPrice: "237,93", installment: "26,43", stars: 4.6, reviews: 32, freteGratis: false, badge: null },
  { id: 98, slug: "pneu-itaro-aro-18-powermax-225-45r18-95w-16008371", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 18 Powermax 225/45R18 95W", origPrice: "342,15", curPrice: "307,93", installment: "34,21", stars: 4.6, reviews: 23, freteGratis: false, badge: null },
  { id: 99, slug: "pneu-bridgestone-aro-17-turanza-t005-225-45r17-91w-10100170", img: "b008510702b224d2c3f3.webp", img2x: "b008510702b224d2c3f3.webp", brand: "marca_BridgeStoneBanner.png", title: "Pneu Bridgestone Aro 17 Turanza T005 225/45R17 91W", origPrice: "544,37", curPrice: "489,93", installment: "54,43", stars: 4.8, reviews: 52, freteGratis: false, badge: null },
  { id: 100, slug: "pneu-michelin-aro-15-primacy-4-195-65r15-91h-10110161", img: "46b89b5f7ebcc90c1760.webp", img2x: "46b89b5f7ebcc90c1760.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 15 Primacy 4 195/65R15 91H", origPrice: "419,92", curPrice: "377,93", installment: "41,99", stars: 4.8, reviews: 89, freteGratis: false, badge: null },
  { id: 101, slug: "pneu-michelin-aro-15-energy-xm2-195-60r15-88v-10110158", img: "1dad6eb44f33ce2cbbb1.webp", img2x: "1dad6eb44f33ce2cbbb1.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 15 Energy XM2 195/60R15 88V", origPrice: "388,82", curPrice: "349,93", installment: "38,88", stars: 4.7, reviews: 41, freteGratis: false, badge: null },
  { id: 102, slug: "pneu-goodyear-aro-14-assurance-maxlife-175-65r14-86h-xl-10130199", img: "aa95c5118e5a0c14fe97.webp", img2x: "aa95c5118e5a0c14fe97.webp", brand: "marca_GoodYearBanner.png", title: "Pneu Goodyear Aro 14 Assurance MaxLife 175/65R14 86H XL", origPrice: "279,92", curPrice: "251,93", installment: "27,99", stars: 4.7, reviews: 36, freteGratis: false, badge: null },
  { id: 103, slug: "pneu-pirelli-aro-17-scorpion-atr-225-65r17-102h-16002512", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 17 Scorpion ATR 225/65R17 102H", origPrice: "583,26", curPrice: "524,93", installment: "58,32", stars: 4.8, reviews: 29, freteGratis: false, badge: null },
  { id: 104, slug: "pneu-itaro-aro-15-it203-195-50r15-82v-16000052", img: "fcb80e3152b94780bbeb.webp", img2x: "fcb80e3152b94780bbeb.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 IT203 195/50R15 82V", origPrice: "217,70", curPrice: "195,93", installment: "21,77", stars: 4.6, reviews: 28, freteGratis: false, badge: null },
  { id: 105, slug: "pneu-ceat-aro-15-ecodrive-185-60r15-88h-xl-16010986", img: "25a75661f761a2ee5321.webp", img2x: "25a75661f761a2ee5321.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 15 EcoDrive 185/60R15 88H XL", origPrice: "248,81", curPrice: "223,93", installment: "24,88", stars: 4.6, reviews: 31, freteGratis: false, badge: null },
  { id: 106, slug: "pneu-itaro-aro-18-it301-225-40r18-92w-xl-16000047", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 18 IT301 225/40R18 92W XL", origPrice: "295,48", curPrice: "265,93", installment: "29,55", stars: 4.6, reviews: 26, freteGratis: false, badge: null },
  { id: 107, slug: "pneu-farroad-aro-14-frd18-175-70r14c-95-93s-12010174", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9.webp", brand: "FARROAD.webp", title: "Pneu Farroad Aro 14 FRD18 175/70R14C 95/93S", origPrice: "241,04", curPrice: "216,93", installment: "24,10", stars: 4.5, reviews: 14, freteGratis: false, badge: null },
  { id: 108, slug: "pneu-ceat-aro-14-ecodrive-185-65r14-86h-10010940", img: "25a75661f761a2ee5321.webp", img2x: "25a75661f761a2ee5321.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 14 EcoDrive 185/65R14 86H", origPrice: "241,04", curPrice: "216,93", installment: "24,10", stars: 4.6, reviews: 73, freteGratis: false, badge: null },
  { id: 109, slug: "pneu-itaro-aro-15-it203-195-60r15-88v-16000054", img: "c29df567d397218bacbd.webp", img2x: "c29df567d397218bacbd.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 15 IT203 195/60R15 88V", origPrice: "229,37", curPrice: "206,43", installment: "22,93", stars: 4.6, reviews: 37, freteGratis: false, badge: null },
  { id: 110, slug: "pneu-ceat-aro-13-ecodrive-165-70r13-83t-xl-10010942", img: "25a75661f761a2ee5321.webp", img2x: "25a75661f761a2ee5321.webp", brand: "Ceat_banner.webp", title: "Pneu Ceat Aro 13 EcoDrive 165/70R13 83T XL", origPrice: "209,92", curPrice: "188,93", installment: "20,99", stars: 4.6, reviews: 52, freteGratis: false, badge: null },
  { id: 111, slug: "pneu-speedmax-aro-15-spm226-185-60r15-88v-16004787", img: "f6b0914fb381764d034c.webp", img2x: "f6b0914fb381764d034c.webp", brand: "marca_SpeedmaxBanner.png", title: "Pneu Speedmax Aro 15 SPM226 185/60R15 88V", origPrice: "225,48", curPrice: "202,93", installment: "22,55", stars: 4.6, reviews: 27, freteGratis: false, badge: null },
  { id: 112, slug: "pneu-bridgestone-aro-16-dueler-h-t-684-ii-215-65r16-102h-10100116", img: "b008510702b224d2c3f3.webp", img2x: "b008510702b224d2c3f3.webp", brand: "marca_BridgeStoneBanner.png", title: "Pneu Bridgestone Aro 16 Dueler H/T 684 II 215/65R16 102H", origPrice: "622,15", curPrice: "559,93", installment: "62,21", stars: 4.8, reviews: 19, freteGratis: false, badge: null },
  { id: 113, slug: "pneu-speedmax-aro-15-hh301-185-65r15-88h-10010957", img: "f6b0914fb381764d034c.webp", img2x: "f6b0914fb381764d034c.webp", brand: "marca_SpeedmaxBanner.png", title: "Pneu Speedmax Aro 15 HH301 185/65R15 88H", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.6, reviews: 31, freteGratis: false, badge: null },
  { id: 114, slug: "pneu-michelin-aro-17-primacy-4-225-50r17-98y-xl-16007614", img: "46b89b5f7ebcc90c1760.webp", img2x: "46b89b5f7ebcc90c1760.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 17 Primacy 4 225/50R17 98Y XL", origPrice: "692,15", curPrice: "622,93", installment: "69,21", stars: 4.8, reviews: 33, freteGratis: false, badge: null },
  { id: 115, slug: "pneu-continental-aro-15-powercontact-2-195-55r15-85h-10120123", img: "9b5df45b1454befcdc9a.webp", img2x: "9b5df45b1454befcdc9a.webp", brand: "Continental_banner_teste.webp", title: "Pneu Continental Aro 15 PowerContact 2 195/55R15 85H", origPrice: "334,37", curPrice: "300,93", installment: "33,43", stars: 4.7, reviews: 44, freteGratis: false, badge: null },
  { id: 116, slug: "pneu-itaro-aro-16-comformax-195-60r16-89h-16004993", img: "4e60be3494072c35a598.webp", img2x: "4e60be3494072c35a598.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 Comformax 195/60R16 89H", origPrice: "248,81", curPrice: "223,93", installment: "24,88", stars: 4.6, reviews: 38, freteGratis: false, badge: null },
  { id: 117, slug: "pneu-dynamo-aro-14-mh01-175-70r14-84t-16002589", img: "12f794a7807000a45cfe.webp", img2x: "12f794a7807000a45cfe.webp", brand: "Dynamo_banner.webp", title: "Pneu Dynamo Aro 14 MH01 175/70R14 84T", origPrice: "241,04", curPrice: "216,93", installment: "24,10", stars: 4.6, reviews: 87, freteGratis: false, badge: null },
  { id: 118, slug: "pneu-bridgestone-aro-16-ecopia-ep150-205-55r16-91v-10100184", img: "b008510702b224d2c3f3.webp", img2x: "b008510702b224d2c3f3.webp", brand: "marca_BridgeStoneBanner.png", title: "Pneu Bridgestone Aro 16 Ecopia EP150 205/55R16 91V", origPrice: "357,70", curPrice: "321,93", installment: "35,77", stars: 4.7, reviews: 47, freteGratis: false, badge: null },
  { id: 119, slug: "pneu-kumho-aro-14-es31-175-65r14-82t-16007344", img: "92dee4d520be27c658a9.webp", img2x: "92dee4d520be27c658a9.webp", brand: "KUMHO.webp", title: "Pneu Kumho Aro 14 ES31 175/65R14 82T", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.6, reviews: 29, freteGratis: false, badge: null },
  { id: 120, slug: "pneu-itaro-aro-17-rxmotion-u11-205-55r17-95y-xl-16010542", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 Rxmotion U11 205/55R17 95Y XL", origPrice: "311,04", curPrice: "279,93", installment: "31,10", stars: 4.7, reviews: 21, freteGratis: false, badge: null },
  { id: 121, slug: "pneu-michelin-aro-17-primacy-5-215-50r17-95w-xl-16017631", img: "4962a99b1d28118b3811.webp", img2x: "4962a99b1d28118b3811.webp", brand: "MICHELIN.webp", title: "Pneu Michelin Aro 17 Primacy 5 215/50R17 95W XL", origPrice: "629,92", curPrice: "566,93", installment: "62,99", stars: 4.9, reviews: 16, freteGratis: false, badge: null },
  { id: 122, slug: "pneu-itaro-aro-16-hiscend-h-mc02-205-75r16c-110-108r-16010527", img: "6e7df31d0117b02007ae.webp", img2x: "6e7df31d0117b02007ae.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 Hiscend H MC02 205/75R16C 110/108R", origPrice: "373,26", curPrice: "335,93", installment: "37,32", stars: 4.7, reviews: 19, freteGratis: false, badge: null },
  { id: 123, slug: "pneu-itaro-aro-19-it306-235-45r19-99w-xl-16004881", img: "e7034e03a351beec5dbc.webp", img2x: "e7034e03a351beec5dbc.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 19 IT306 235/45R19 99W XL", origPrice: "349,92", curPrice: "314,93", installment: "34,99", stars: 4.6, reviews: 24, freteGratis: false, badge: null },
  { id: 124, slug: "pneu-speedmax-prime-aro-15-frd16-195-65r15-91v-16005731", img: "f6b0914fb381764d034c.webp", img2x: "f6b0914fb381764d034c.webp", brand: "marca_SpeedmaxBanner.png", title: "Pneu Speedmax Prime Aro 15 FRD16 195/65R15 91V", origPrice: "225,48", curPrice: "202,93", installment: "22,55", stars: 4.6, reviews: 22, freteGratis: false, badge: null },
  { id: 125, slug: "pneu-itaro-aro-14-it203-175-75r14-86t-16001187", img: "fcb80e3152b94780bbeb.webp", img2x: "fcb80e3152b94780bbeb.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 14 IT203 175/75R14 86T", origPrice: "209,92", curPrice: "188,93", installment: "20,99", stars: 4.6, reviews: 26, freteGratis: false, badge: null },
  { id: 126, slug: "pneu-barum-by-continental-aro-15-bravuris-5hm-195-65r15-91h-16001323", img: "070febce2c758e97a18f.webp", img2x: "070febce2c758e97a18f.webp", brand: "Barum_banner.webp", title: "Pneu Barum by Continental Aro 15 Bravuris 5HM 195/65R15 91H", origPrice: "241,04", curPrice: "216,93", installment: "24,10", stars: 4.7, reviews: 31, freteGratis: false, badge: null },
  { id: 127, slug: "pneu-speedmax-aro-22-5-easymax-s-275-80r22-5-149-146l-18-lonas-tl-16004525", img: "f6b0914fb381764d034c.webp", img2x: "f6b0914fb381764d034c.webp", brand: "marca_SpeedmaxBanner.png", title: "Pneu Speedmax Aro 22.5 Easymax S 275/80R22.5 149/146L 18 Lonas TL", origPrice: "1.322,15", curPrice: "1.189,93", installment: "132,21", stars: 4.8, reviews: 9, freteGratis: false, badge: null },
  { id: 128, slug: "pneu-goodyear-aro-16-eagle-sport-2-205-55r16-91v-16001418", img: "aa95c5118e5a0c14fe97.webp", img2x: "aa95c5118e5a0c14fe97.webp", brand: "marca_GoodYearBanner.png", title: "Pneu Goodyear Aro 16 Eagle Sport 2 205/55R16 91V", origPrice: "388,82", curPrice: "349,93", installment: "38,88", stars: 4.7, reviews: 28, freteGratis: false, badge: null },
  { id: 129, slug: "pneu-continental-aro-15-ultracontact-195-55r15-85h-16010587", img: "9b5df45b1454befcdc9a.webp", img2x: "9b5df45b1454befcdc9a.webp", brand: "Continental_banner_teste.webp", title: "Pneu Continental Aro 15 UltraContact 195/55R15 85H", origPrice: "419,92", curPrice: "377,93", installment: "41,99", stars: 4.8, reviews: 22, freteGratis: false, badge: null },
  { id: 130, slug: "pneu-itaro-aro-14-comformax-175-75r14-86t-16007030", img: "4e60be3494072c35a598.webp", img2x: "4e60be3494072c35a598.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 14 Comformax 175/75R14 86T", origPrice: "225,48", curPrice: "202,93", installment: "22,55", stars: 4.6, reviews: 24, freteGratis: false, badge: null },
  { id: 131, slug: "pneu-pirelli-aro-16-scorpion-ks-205-65r16-95h-16010646", img: "5622fb235c7386285214.webp", img2x: "5622fb235c7386285214.webp", brand: "PirelliBanner.webp", title: "Pneu Pirelli Aro 16 Scorpion KS 205/65R16 95H", origPrice: "544,37", curPrice: "489,93", installment: "54,43", stars: 4.7, reviews: 18, freteGratis: false, badge: null },
  { id: 132, slug: "pneu-itaro-aro-18-it101-235-55r18-104v-xl-16001567", img: "32bc3321f5e8a761d4f3.webp", img2x: "32bc3321f5e8a761d4f3.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 18 IT101 235/55R18 104V XL", origPrice: "396,59", curPrice: "356,93", installment: "39,65", stars: 4.7, reviews: 19, freteGratis: false, badge: null },
  { id: 133, slug: "pneu-itaro-aro-17-it101-225-60r17-99h-16001051", img: "0d21503bfdb7b1601669.webp", img2x: "0d21503bfdb7b1601669.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 17 IT101 225/60R17 99H", origPrice: "349,92", curPrice: "314,93", installment: "34,99", stars: 4.6, reviews: 31, freteGratis: false, badge: null },
  { id: 134, slug: "pneu-speedmax-aro-14-street-h-mh01-185-70r14-88h-16004774", img: "12f794a7807000a45cfe.webp", img2x: "12f794a7807000a45cfe.webp", brand: "marca_SpeedmaxBanner.png", title: "Pneu Speedmax Aro 14 Street-H MH01 185/70R14 88H", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.6, reviews: 23, freteGratis: false, badge: null },
  { id: 135, slug: "pneu-itaro-aro-16-it203-195-50r16-88v-xl-16000058", img: "fcb80e3152b94780bbeb.webp", img2x: "fcb80e3152b94780bbeb.webp", brand: "ITARO-2-1-.png", title: "Pneu Itaro Aro 16 IT203 195/50R16 88V XL", origPrice: "233,26", curPrice: "209,93", installment: "23,32", stars: 4.6, reviews: 34, freteGratis: false, badge: null },
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
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);
  const [productScrollPos, setProductScrollPos] = useState(0);
  const [activeTab, setActiveTab] = useState(1);
  const [vehicleType, setVehicleType] = useState("carros");
  const productScrollRef = useRef<HTMLDivElement>(null);
  const heroTouchStartX = useRef<number | null>(null);
  const { addItem } = useCart();

  // ─── Busca por Medida — extração dinâmica dos títulos ───
  const [largura, setLargura] = useState("");
  const [perfil, setPerfil] = useState("");
  const [aro, setAro] = useState("");

  function parseMedida(title: string): { largura: string; perfil: string; aro: string } | null {
    // Padrão carro/caminhão: 195/55R16, 215/75R17.5, 265/65R17
    const m1 = title.match(/(\d{3})\/(\d{2,3})R(\d+(?:\.\d+)?)/i);
    if (m1) return { largura: m1[1], perfil: m1[2], aro: m1[3] };
    // Moto: 90/90-18, 120/70R17
    const m2 = title.match(/(\d{2,3})\/(\d{2,3})-(\d+(?:\.\d+)?)/);
    if (m2) return { largura: m2[1], perfil: m2[2], aro: m2[3] };
    // Bicicleta: 700X25
    const m3 = title.match(/(\d{3})X(\d{2,3})/i);
    if (m3) return { largura: m3[1], perfil: m3[2], aro: "700" };
    return null;
  }

  const medidas = products.map((p) => parseMedida(p.title)).filter(Boolean) as { largura: string; perfil: string; aro: string }[];

  const largurasUnicas = Array.from(new Set(medidas.map((m) => m.largura))).sort((a, b) => Number(a) - Number(b));
  // Perfil e Aro filtrados em cadeia pela Largura (e Perfil para Aro)
  const perfisDisponiveis = (() => {
    let filtered = medidas;
    if (largura) filtered = filtered.filter((m) => m.largura === largura);
    return Array.from(new Set(filtered.map((m) => m.perfil))).sort((a, b) => Number(a) - Number(b));
  })();
  const arosDisponiveis = (() => {
    let filtered = medidas;
    if (largura) filtered = filtered.filter((m) => m.largura === largura);
    if (perfil) filtered = filtered.filter((m) => m.perfil === perfil);
    return Array.from(new Set(filtered.map((m) => m.aro))).sort((a, b) => Number(a) - Number(b));
  })();

  // Reseta dependentes quando pai muda e valor atual não existe mais
  useEffect(() => {
    if (largura && !medidas.some((m) => m.largura === largura && m.perfil === perfil)) {
      // se perfil atual não pertence à nova largura, limpa perfil e aro
      if (perfil && !perfisDisponiveis.includes(perfil)) {
        setPerfil("");
        setAro("");
      }
    }
  }, [largura]);
  useEffect(() => {
    if (perfil && largura && !arosDisponiveis.includes(aro) && aro) {
      setAro("");
    }
  }, [perfil, largura]);

  const handleBuscarPneus = () => {
    if (!largura && !perfil && !aro) return;
    const params = new URLSearchParams();
    if (largura) params.set("largura", largura);
    if (perfil) params.set("perfil", perfil);
    if (aro) params.set("aro", aro);
    if (largura && perfil && aro) {
      // medida combinada para busca textual fallback
      params.set("medida", `${largura}/${perfil}R${aro}`);
      params.set("q", `${largura}/${perfil}R${aro}`);
    } else if (largura && perfil) {
      params.set("q", `${largura}/${perfil}`);
    } else if (largura) {
      params.set("q", largura);
    }
    router.push(`/todos?${params.toString()}`);
  };

  /* Hero auto-play */
  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleHeroTouchStart = useCallback((e: React.TouchEvent) => {
    heroTouchStartX.current = e.touches[0].clientX;
  }, []);
  const handleHeroTouchEnd = useCallback((e: React.TouchEvent) => {
    if (heroTouchStartX.current === null) return;
    const diff = heroTouchStartX.current - e.changedTouches[0].clientX;
    const threshold = 50;
    if (diff > threshold) setHeroIndex((prev) => (prev + 1) % heroSlides.length);
    else if (diff < -threshold) setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    heroTouchStartX.current = null;
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
        <section className="hero-carousel" style={{ position: "relative", width: "100%", overflow: "hidden", background: "#f5f5f5" }}>
          <div
            className="hero-track"
            onTouchStart={handleHeroTouchStart}
            onTouchEnd={handleHeroTouchEnd}
            style={{ display: "flex", transition: "transform 0.45s cubic-bezier(0.4,0,0.2,1)", transform: `translateX(-${heroIndex * 100}%)`, willChange: "transform" }}
          >
            {heroSlides.map((slide, i) => (
              <div key={i} style={{ minWidth: "100%", flexShrink: 0, display: "flex" }}>
                <picture style={{ display: "block", width: "100%" }}>
                  <source media="(max-width: 640px)" srcSet={`/${slide.mobile}`} />
                  <source media="(max-width: 1024px)" srcSet={`/${slide.tablet}`} />
                  <img
                    src={`/${slide.desktop}`}
                    alt={slide.alt}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="hero-slide-img"
                    style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
                  />
                </picture>
              </div>
            ))}
          </div>
          {/* Arrows */}
          <button
            type="button"
            className="carousel-arrow carousel-arrow-left"
            onClick={() => setHeroIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            aria-label="Slide anterior"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
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
                type="button"
                className={`carousel-dot ${i === heroIndex ? "active" : ""}`}
                onClick={() => setHeroIndex(i)}
                aria-label={`Ir para slide ${i + 1}`}
                aria-current={i === heroIndex ? "true" : undefined}
              />
            ))}
          </div>
        </section>

        {/* ─── VEHICLE SEARCH PANEL ─── */}
        <section style={{ width: "100%", display: "flex", justifyContent: "center", padding: "24px 10%", background: "var(--color-neutralBgLayout)" }}>
          <div style={{ maxWidth: 1240, width: "100%", background: "white", borderRadius: 12, overflow: "hidden", boxShadow: "0 4px 16px rgba(0,0,0,0.07)", border: "1px solid #ececec" }}>
            {/* Tabs — abas superiores estilizadas idêntica referência */}
            <div style={{ display: "flex", gap: 0, background: "#f7f5ff", padding: "6px 6px 0 6px", borderBottom: "1px solid #f0f0f0" }}>
              {[
                { id: 1, label: "Medida do pneu" },
                { id: 2, label: "Veículo" },
                { id: 3, label: "Placa" },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-selected={isActive}
                    role="tab"
                    style={{
                      flex: 1,
                      padding: "12px 16px",
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "none",
                      borderRadius: "8px 8px 0 0",
                      background: isActive ? "#4c0082" : "transparent",
                      color: isActive ? "white" : "#4c0082",
                      transition: "all 0.2s",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
            {/* Tab Content */}
            <div style={{ padding: "18px 16px", background: "white" }}>
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
                          border: `1px solid ${vehicleType === vt.key ? "#4c0082" : "#d9d9d9"}`,
                          background: vehicleType === vt.key ? "#4c0082" : "white",
                          color: vehicleType === vt.key ? "white" : "var(--color-textBase)",
                          transition: "all 0.15s",
                        }}
                      >
                        {vt.label}
                      </button>
                    ))}
                  </div>
                  {/* Selects — Largura / Perfil / Aro dinâmicos + botão */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
                    {/* Largura */}
                    <div style={{ flex: 1, minWidth: 130 }}>
                      <label htmlFor="sel-largura" style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b6b6b", marginBottom: 6, letterSpacing: 0.3, textTransform: "uppercase" }}>
                        Largura
                      </label>
                      <select
                        id="sel-largura"
                        value={largura}
                        onChange={(e) => setLargura(e.target.value)}
                        style={{ width: "100%", height: 42, border: "1px solid #e0e0e0", borderRadius: 6, padding: "0 12px", fontSize: 14, background: "white", color: largura ? "#1a1a1a" : "#8c8c8c", outline: "none", cursor: "pointer" }}
                      >
                        <option value="">Largura</option>
                        {largurasUnicas.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Perfil */}
                    <div style={{ flex: 1, minWidth: 130 }}>
                      <label htmlFor="sel-perfil" style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b6b6b", marginBottom: 6, letterSpacing: 0.3, textTransform: "uppercase" }}>
                        Perfil
                      </label>
                      <select
                        id="sel-perfil"
                        value={perfil}
                        onChange={(e) => setPerfil(e.target.value)}
                        disabled={!largura && perfisDisponiveis.length === 0}
                        style={{
                          width: "100%",
                          height: 42,
                          border: "1px solid #e0e0e0",
                          borderRadius: 6,
                          padding: "0 12px",
                          fontSize: 14,
                          background: !largura ? "#fafafa" : "white",
                          color: perfil ? "#1a1a1a" : "#8c8c8c",
                          outline: "none",
                          cursor: perfisDisponiveis.length ? "pointer" : "not-allowed",
                          opacity: !largura && perfisDisponiveis.length === 0 ? 0.6 : 1,
                        }}
                      >
                        <option value="">Perfil</option>
                        {perfisDisponiveis.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Aro */}
                    <div style={{ flex: 1, minWidth: 130 }}>
                      <label htmlFor="sel-aro" style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#6b6b6b", marginBottom: 6, letterSpacing: 0.3, textTransform: "uppercase" }}>
                        Aro
                      </label>
                      <select
                        id="sel-aro"
                        value={aro}
                        onChange={(e) => setAro(e.target.value)}
                        disabled={arosDisponiveis.length === 0}
                        style={{
                          width: "100%",
                          height: 42,
                          border: "1px solid #e0e0e0",
                          borderRadius: 6,
                          padding: "0 12px",
                          fontSize: 14,
                          background: arosDisponiveis.length ? "white" : "#fafafa",
                          color: aro ? "#1a1a1a" : "#8c8c8c",
                          outline: "none",
                          cursor: arosDisponiveis.length ? "pointer" : "not-allowed",
                        }}
                      >
                        <option value="">Aro</option>
                        {arosDisponiveis.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Botão Buscar pneus — roxo padrão, alinhado na mesma linha */}
                    <button
                      onClick={handleBuscarPneus}
                      disabled={!largura && !perfil && !aro}
                      title={!largura && !perfil && !aro ? "Selecione ao menos uma medida" : `Buscar ${largura || ""}${perfil ? `/${perfil}` : ""}${aro ? `R${aro}` : ""}`.trim() || "Buscar pneus"}
                      style={{
                        height: 42,
                        padding: "0 28px",
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: 800,
                        whiteSpace: "nowrap",
                        background: !largura && !perfil && !aro ? "#d9d9d9" : "#4c0082",
                        color: "white",
                        border: "none",
                        cursor: !largura && !perfil && !aro ? "not-allowed" : "pointer",
                        minWidth: 160,
                        letterSpacing: 0.2,
                        opacity: !largura && !perfil && !aro ? 0.7 : 1,
                      }}
                    >
                      Buscar pneus
                    </button>
                  </div>
                  {largura || perfil || aro ? (
                    <div style={{ marginTop: 10, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", fontSize: 12 }}>
                      <span style={{ color: "#8c8c8c" }}>Filtro:</span>
                      {largura && <span style={{ background: "#f6f5ff", border: "1px solid #e8e0ff", color: "#4c0082", padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>{largura}</span>}
                      {perfil && <span style={{ background: "#f6f5ff", border: "1px solid #e8e0ff", color: "#4c0082", padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>{perfil}</span>}
                      {aro && <span style={{ background: "#f6f5ff", border: "1px solid #e8e0ff", color: "#4c0082", padding: "3px 8px", borderRadius: 999, fontWeight: 700 }}>R{aro}</span>}
                      <button onClick={() => { setLargura(""); setPerfil(""); setAro(""); }} style={{ background: "none", border: "none", color: "#4c0082", fontSize: 12, cursor: "pointer", textDecoration: "underline", marginLeft: 4 }}>
                        Limpar
                      </button>
                    </div>
                  ) : null}
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
                    <input style={{ width: "100%", height: 40, border: "1px solid #e0e0e0", borderRadius: 6, padding: "0 12px", fontSize: 14, textTransform: "uppercase" }} placeholder="ABC1D23" maxLength={7} />
                  </div>
                  <button className="btn btn-primary" style={{ height: 40, padding: "0 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, background: "#4c0082", color: "white" }}>Buscar</button>
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
                      <Link href={`/produto/${(p as any).slug || PRODUCT_SLUG}`} style={{ textDecoration: "none", color: "inherit" }}>
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
                      <Link href={`/produto/${(p as any).slug || PRODUCT_SLUG}`} style={{ textDecoration: "none", color: "inherit" }}>
                     <p style={{ fontSize: 13, fontWeight: 600, color: "#4b4b4b", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 54, cursor: "pointer" }}>
                       {p.title}
                     </p>
                   </Link>
                  {/* Prices - PIX only */}
                  <div>
                    <p style={{ fontSize: 12, color: "#8c8c8c", textDecoration: "line-through" }}>R$ {p.origPrice}</p>
                    <p style={{ fontSize: 18, fontWeight: 700, color: "var(--color-primary)" }}>R$ {p.curPrice}</p>
                    <p style={{ fontSize: 11, color: "#2e7d32", fontWeight: 700 }}>PIX com até 40% OFF</p>
                  </div>
                  {/* CEP input */}
                  <input style={{ width: "100%", height: 32, border: "1px solid #d9d9d9", borderRadius: 6, padding: "0 10px", fontSize: 12 }} placeholder="Insira seu CEP" />
                  {/* Buttons — Adiciona ao carrinho lateral */}
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button
                      onClick={() =>
                        addItem(
                          {
                            slug: (p as any).slug || PRODUCT_SLUG,
                            name: p.title,
                            id: String(p.id),
                            brand: p.brand,
                            brandLogo: p.brand,
                            image: p.img2x || p.img,
                            curPrice: p.curPrice,
                            origPrice: p.origPrice,
                            priceCents: brlToCents(p.curPrice),
                            origCents: brlToCents(p.origPrice),
                          },
                          1
                        )
                      }
                      className="btn btn-primary"
                      style={{ flex: 1, height: 36, fontSize: 13, fontWeight: 600, borderRadius: 8 }}
                    >
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
        href="https://wa.me/5511947710544"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        aria-label="WhatsApp (11) 94771-0544"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
