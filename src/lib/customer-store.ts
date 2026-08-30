import fs from "fs";
import path from "path";
import { encrypt, decrypt } from "./crypto";

export type CustomerRecord = {
  id: string;
  email: string; // plain for lookup, lowercased
  emailHash: string;
  nome: string;
  cpfCnpj: string; // encrypted
  telefone: string; // encrypted
  cep: string;
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia?: string;
  nomeLocal?: string;
  destinatario?: string;
  tipo: "PF" | "PJ";
  promoEmail: boolean;
  promoWhatsapp: boolean;
  lgpdConsent: boolean;
  lgpdConsentAt?: string;
  createdAt: string;
  updatedAt: string;
  lastCartAbandonedAt?: string;
  source?: string; // utm, etc
  cartSnapshot?: { items: { slug: string; name: string; quantity: number; priceCents: number }[]; totalCents: number } | null;
};

const DATA_FILE = path.join(process.cwd(), "data", "customers.json");

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}
function readAll(): Record<string, CustomerRecord> {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8") || "{}");
  } catch {
    return {};
  }
}
function writeAll(data: Record<string, CustomerRecord>) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function listCustomers(): CustomerRecord[] {
  return Object.values(readAll()).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
export function getCustomerByEmail(email: string): CustomerRecord | null {
  const normalized = email.trim().toLowerCase();
  const all = readAll();
  return Object.values(all).find((c) => c.email.toLowerCase() === normalized) || null;
}
export function getCustomerById(id: string): CustomerRecord | null {
  return readAll()[id] || null;
}
export function upsertCustomer(input: Partial<CustomerRecord> & { email: string }): CustomerRecord {
  const all = readAll();
  const normalizedEmail = input.email.trim().toLowerCase();
  let existing = Object.values(all).find((c) => c.email.toLowerCase() === normalizedEmail);
  const now = new Date().toISOString();
  const id = existing?.id || `cus_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  // encrypt sensitive
  const cpfEncrypted = input.cpfCnpj ? encrypt(input.cpfCnpj) : existing?.cpfCnpj || "";
  const telEncrypted = input.telefone ? encrypt(input.telefone) : existing?.telefone || "";
  const record: CustomerRecord = {
    id,
    email: normalizedEmail,
    emailHash: existing?.emailHash || input.emailHash || "",
    nome: input.nome ?? existing?.nome ?? "",
    cpfCnpj: cpfEncrypted,
    telefone: telEncrypted,
    cep: input.cep ?? existing?.cep ?? "",
    rua: input.rua ?? existing?.rua ?? "",
    numero: input.numero ?? existing?.numero ?? "",
    complemento: input.complemento ?? existing?.complemento ?? "",
    bairro: input.bairro ?? existing?.bairro ?? "",
    cidade: input.cidade ?? existing?.cidade ?? "",
    estado: input.estado ?? existing?.estado ?? "",
    referencia: input.referencia ?? existing?.referencia ?? "",
    nomeLocal: input.nomeLocal ?? existing?.nomeLocal ?? "",
    destinatario: input.destinatario ?? existing?.destinatario ?? "",
    tipo: (input.tipo as any) ?? existing?.tipo ?? "PF",
    promoEmail: input.promoEmail ?? existing?.promoEmail ?? false,
    promoWhatsapp: input.promoWhatsapp ?? existing?.promoWhatsapp ?? false,
    lgpdConsent: input.lgpdConsent ?? existing?.lgpdConsent ?? false,
    lgpdConsentAt: input.lgpdConsent ? now : existing?.lgpdConsentAt,
    createdAt: existing?.createdAt || now,
    updatedAt: now,
    lastCartAbandonedAt: input.lastCartAbandonedAt ?? existing?.lastCartAbandonedAt,
    source: input.source ?? existing?.source,
    cartSnapshot: input.cartSnapshot !== undefined ? input.cartSnapshot : existing?.cartSnapshot ?? null,
  };
  all[id] = record;
  writeAll(all);
  return record;
}
export function decryptCustomer(c: CustomerRecord): CustomerRecord & { cpfPlain: string; telefonePlain: string } {
  return {
    ...c,
    cpfPlain: c.cpfCnpj ? decrypt(c.cpfCnpj) : "",
    telefonePlain: c.telefone ? decrypt(c.telefone) : "",
  };
}
