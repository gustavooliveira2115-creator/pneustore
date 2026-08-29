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
  "pneu-itaro-aro-13-mh01-175-70r13-82t-16004776",
  "pneu-itaro-aro-14-mh01-175-70r14-84t-16004777",
  "pneu-itaro-aro-15-comformax-185-60r15-84h-16005020",
  "pneu-itaro-aro-15-it203-195-55r15-85v-16000053",
  "pneu-ceat-aro-14-ecodrive-175-70r14-88t-xl-10010939",
  "pneu-itaro-aro-17-it301-225-45r17-94w-xl-16000043",
  "pneu-itaro-aro-14-mh01-175-65r14-86t-xl-16004779",
  "pneu-barum-by-continental-aro-14-bravuris-5hm-175-65r14-82t-10120226",
  "pneu-ceat-aro-14-ecodrive-175-65r14-82t-10010938",
  "pneu-itaro-aro-15-comformax-195-60r15-88v-16004992",
  "pneu-itaro-aro-17-it301-205-50r17-93w-xl-16000039",
  "pneu-itaro-aro-16-comformax-205-55r16-91v-16004998",
  "pneu-itaro-aro-18-it101-225-55r18-98v-16000066",
  "pneu-itaro-aro-15-it203-185-65r15-88h-16000051",
  "pneu-itaro-aro-17-it301-215-50r17-95w-xl-16000041",
  "pneu-itaro-aro-14-it108-175-70r14c-95-93t-16003202",
  "pneu-itaro-aro-17-it101-215-60r17-96h-16000064",
  "pneu-barum-by-continental-aro-14-bravuris-5hm-175-70r14-88t-xl-10120242",
  "pneu-ceat-aro-14-ecodrive-185-70r14-88h-10010943",
  "pneu-michelin-aro-17-primacy-4-205-55r17-95v-xl-16003626",
];

// helper to normalize slug
export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/\s+/g, "-");
}
