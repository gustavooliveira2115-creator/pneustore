export const PRODUCT_SLUG =
  "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl";

export const PRODUCT_SLUGS = [
  "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl",
  "pneu-continental-aro-16-powercontact-2-195-55r16-87h-10120084",
  "pneu-continental-aro-16-powercontact-2-195-55r16-87h",
];

// helper to normalize slug
export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/\s+/g, "-");
}
