export type Product = {
  slug: string;
  aliases?: string[];
  name: string;
  id: string;
  brand: string;
  brandLogo: string;
  brandLogo2x: string;
  origPrice: string;
  pixPrice: string;
  installmentTotal: string;
  installmentValue: string;
  installmentCount: number;
  stars: number;
  reviews: number;
  images: string[];
  inmetro: {
    rollingResistance: string;
    wetGrip: string;
    noise: string;
  };
  technical: [string, string][];
  aboutBrandTitle: string;
  aboutBrandText: string;
  aboutProductText: string;
};

export const products: Record<string, Product> = {
  "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl": {
    slug: "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl",
    aliases: ["pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl-16000356"],
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
      "ad3934dd692d3fc98e39.webp",
      "7511f693be07e9958cae.webp",
      "ac18ab0ab5a16a74a0b9.webp",
    ],
    inmetro: { rollingResistance: "C", wetGrip: "C", noise: "71 dB" },
    technical: [
      ["Medida", "215/75R17.5"],
      ["Aro", '17.5"'],
      ["Indice de carga", "135/133"],
      ["Indice de velocidade", "J (100 km/h)"],
      ["Lonas", "16"],
      ["Tipo", "TL (Tubeless)"],
      ["Resistencia a rolamento", "C"],
      ["Aderencia em pista molhada", "C"],
      ["Ruido externo", "71 dB"],
    ],
    aboutBrandTitle: "Sobre a marca Itaro",
    aboutBrandText:
      "A Itaro nasceu para motoristas viverem novas historias - em duas ou quatro rodas. Desenvolvida nas grandes fabricas asiaticas, a marca e homologada nos principais mercados da Europa e America, como o Brasil. Seus pneus foram pensados em centros de pesquisa e desenvolvimento de paises como China, Paquista e Tailandia, que estao entre os maiores do mundo.",
    aboutProductText:
      "Com presenca exclusiva na PneuStore, a Itaro oferece solucoes para carros de passeio, SUVs, caminhonetes, motos e caminhoes, com excelente qualidade e custo que ajudam motoristas a viverem novos capitulos todos os dias.",
  },
  "pneu-continental-aro-16-powercontact-2-195-55r16-87h-10120084": {
    slug: "pneu-continental-aro-16-powercontact-2-195-55r16-87h-10120084",
    aliases: ["pneu-continental-aro-16-powercontact-2-195-55r16-87h"],
    name: "Pneu Continental Aro 16 PowerContact 2 195/55R16 87H",
    id: "10120084",
    brand: "Continental",
    brandLogo: "Continental_banner_teste.webp",
    brandLogo2x: "Continental_banner_teste-1.webp",
    origPrice: "622,12",
    pixPrice: "559,90",
    installmentTotal: "622,12",
    installmentValue: "62,21",
    installmentCount: 10,
    stars: 4.5,
    reviews: 24,
    images: [
      "9b5df45b1454befcdc9a.webp",
      "f86c2079f5ea7de31cd4.webp",
      "c67e730f1bd567c5e850.webp",
    ],
    inmetro: { rollingResistance: "C", wetGrip: "B", noise: "72 dB" },
    technical: [
      ["Medida", "195/55R16"],
      ["Aro", '16"'],
      ["Indice de carga", "87 (545 kg)"],
      ["Indice de velocidade", "H (210 km/h)"],
      ["Largura", "195"],
      ["Perfil", "55"],
      ["Tipo", "Radial"],
      ["Desenho", "Assimetrico"],
      ["Resistencia a rolamento", "C"],
      ["Aderencia em pista molhada", "B"],
      ["Ruido externo", "72 dB"],
    ],
    aboutBrandTitle: "Sobre a marca Continental",
    aboutBrandText:
      "Fundada em 1871 em Hanover, na Alemanha, a Continental e um dos maiores fabricantes de pneus do mundo. Tecnologia alema presente em 24 fabricas globais, a marca e referencia em seguranca, conforto e durabilidade, patrocinando a Copa do Brasil e equipando veiculos de passeio e comerciais leves na Europa.",
    aboutProductText:
      "O PowerContact 2 foi projetado para oferecer ate 20% mais quilometragem com a tecnologia Eco Plus+, excelente economia de combustivel e conforto acustico com Conti Noise Cancelling. Banda assimétrica, sulcos profundos e composto SmartCompound garantem aderencia superior no seco e molhado, ideal para uso urbano e rodoviario.",
  },
};

// helper to resolve slug or alias
export function getProductBySlug(slug: string): Product | undefined {
  if (products[slug]) return products[slug];
  for (const p of Object.values(products)) {
    if (p.aliases?.includes(slug)) return p;
  }
  // fallback: try without trailing id
  const base = slug.replace(/-\d+$/, "");
  if (products[base]) return products[base];
  for (const p of Object.values(products)) {
    if (p.aliases?.includes(base)) return p;
  }
  return undefined;
}

export function getAllProductSlugs(): string[] {
  return Object.keys(products);
}
