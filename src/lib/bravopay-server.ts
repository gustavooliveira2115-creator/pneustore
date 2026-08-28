/**
 * Helpers server-only para BravoPay.
 * NÃO importe este arquivo no client — ele lê process.env.BRAVOPAY_API_KEY
 */
import "server-only";
import { BRAVOPAY_BASE_URL } from "./bravopay-config";

export function getApiKeyOrThrow(): string {
  const key = process.env.BRAVOPAY_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "BRAVOPAY_API_KEY não configurada. Defina em .env.local: BRAVOPAY_API_KEY=bp_live_xxx"
    );
  }
  return key;
}

export async function bravoFetch(
  path: string,
  init: RequestInit & { apiKey?: string } = {}
) {
  const apiKey = init.apiKey ?? getApiKeyOrThrow();
  const url = `${BRAVOPAY_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    ...(init.headers as Record<string, string>),
  };
  // só adiciona Content-Type se tiver body
  if (init.body) headers["Content-Type"] = "application/json";

  const res = await fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }

  return { res, json, ok: res.ok, status: res.status };
}
