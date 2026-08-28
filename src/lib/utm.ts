/**
 * UTM capture — lê utm_* + fbclid/ttclid/gclid da URL e persiste.
 *
 * Fluxo:
 *  1. No primeiro acesso com UTM na URL, salva em localStorage + cookie (7 dias)
 *  2. Em todo POST /api/bravopay/create-transaction, envia o objeto `utm` salvo
 *  3. Se o usuário voltar sem UTM, ainda enviamos o valor guardado (atribuição first-touch em 7 dias)
 *
 * Isso é OBRIGATÓRIO para a UTMify atribuir a venda ao anúncio.
 */

export type UtmPayload = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  fbclid?: string;
  ttclid?: string;
  gclid?: string;
};

const STORAGE_KEY = "bravopay_utm";
const COOKIE_KEY = "bravopay_utm";

// Mapeia query params -> chaves do objeto utm da API BravoPay
const PARAM_MAP: Record<string, keyof UtmPayload> = {
  utm_source: "source",
  utm_medium: "medium",
  utm_campaign: "campaign",
  utm_content: "content",
  utm_term: "term",
  fbclid: "fbclid",
  ttclid: "ttclid",
  gclid: "gclid",
  // alias comum
  fb_click_id: "fbclid",
};

function safeJsonParse(v: string | null): UtmPayload | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as UtmPayload;
  } catch {
    return null;
  }
}

/** Lê o UTM atual da URL (se houver) */
export function readUtmFromUrl(): UtmPayload {
  if (typeof window === "undefined") return {};
  const url = new URL(window.location.href);
  const out: UtmPayload = {};
  for (const [param, key] of Object.entries(PARAM_MAP)) {
    const val = url.searchParams.get(param);
    if (val) out[key] = val;
  }
  return out;
}

/** Persiste (merge) — só sobrescreve campos que vieram novos */
export function persistUtm(incoming: UtmPayload) {
  if (typeof window === "undefined") return;
  if (Object.keys(incoming).length === 0) return;

  const existing = getStoredUtm();
  const merged = { ...existing, ...incoming };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {}
  // cookie espelho para server-side se precisar (7 dias)
  try {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(merged))}; expires=${expires}; path=/; SameSite=Lax`;
  } catch {}
}

/** Recupera UTM guardado (localStorage > cookie) */
export function getStoredUtm(): UtmPayload {
  if (typeof window === "undefined") return {};
  try {
    const ls = localStorage.getItem(STORAGE_KEY);
    const parsed = safeJsonParse(ls);
    if (parsed && Object.keys(parsed).length > 0) return parsed;
  } catch {}

  // fallback cookie
  try {
    const m = document.cookie.match(new RegExp(`${COOKIE_KEY}=([^;]+)`));
    if (m) {
      const parsed = safeJsonParse(decodeURIComponent(m[1]));
      if (parsed) return parsed;
    }
  } catch {}
  return {};
}

/** Chame 1x no mount do layout para capturar */
export function captureUtmOnLoad() {
  const fromUrl = readUtmFromUrl();
  if (Object.keys(fromUrl).length > 0) persistUtm(fromUrl);
}

/** Retorna utm pronto para enviar no POST (ou undefined se vazio) */
export function getUtmForApi(): UtmPayload | undefined {
  const utm = getStoredUtm();
  // merge tardio: se ainda houver params na URL, prioriza
  const fromUrl = readUtmFromUrl();
  const merged = { ...utm, ...fromUrl };
  if (Object.values(merged).some(Boolean)) return merged;
  return undefined;
}
