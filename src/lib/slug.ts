export const PRODUCT_SLUG =
  "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl";

export const PRODUCT_SLUGS = [
  "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl",
  "pneu-continental-aro-16-powercontact-2-195-55r16-87h-10120084",
  "pneu-continental-aro-16-powercontact-2-195-55r16-87h",
  "pneu-moto-maggion-aro-18-winner-90-90-18-57p-tt-traseiro-16001288",
  "pneu-moto-maggion-aro-18-winner-90-90-18-57p-tt-traseiro",
  "pneu-bfgoodrich-aro-17-all-terrain-ko3-265-65r17-116-113s-letras-brancas-16012686",
  "pneu-michelin-aro-18-primacy-5-225-55r18-102v-xl-16017629",
  "pneu-gripmaster-aro-15-g-push-195-65r15-91v-16014557",
  "pneu-hankook-aro-17-kinergy-gt-h436-205-55r17-91h-10031209",
  "pneu-kumho-aro-19-crugen-hp71-235-45r19-95h-16015402",
  "pneu-moto-metzeler-aro-18-enduro-3-120-80-18-62s-tt-traseiro-16004122",
  "pneu-speedmax-aro-18-controlmax-plus-cp12-165-40r18-73v-xl-16009170",
  "pneu-moto-pirelli-aro-17-diablo-120-70r17-58w-tl-dianteiro-16016646",
  "pneu-bicicleta-continental-aro-700-gator-skin-700x25-10360008",
  "pneu-goodyear-aro-15-efficientgrip-performance-205-60r15-91h-16008675",
  "pneu-michelin-aro-16-energy-xm2-205-55r16-91v-16037362",
  "pneu-hankook-aro-19-dynapro-hp2-ra33-235-55r19-101v-10040638",
  "pneu-moto-pirelli-aro-17-scorpion-trail-120-70r17-58w-tl-dianteiro-10200046",
];

// helper to normalize slug
export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/\s+/g, "-");
}
