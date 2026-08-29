import fs from "fs";
import path from "path";

export type TrackingStage = "pedido_confirmado" | "processamento" | "transito" | "entrega";
export type TrackingEvent = {
  date: string;
  time: string;
  title: string;
  desc: string;
  location: string;
  done: boolean;
  current?: boolean;
};
export type TrackingRecord = {
  code: string;
  stage: TrackingStage;
  eta: string;
  etaLabel: string;
  origin: string;
  destination: string;
  lastUpdate: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  product: { name: string; qty: number };
  events: TrackingEvent[];
  createdAt: string;
  updatedAt: string;
  carrierCode?: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "tracking.json");

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}

function readAll(): Record<string, TrackingRecord> {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8") || "{}");
  } catch {
    return {};
  }
}

function writeAll(data: Record<string, TrackingRecord>) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function getTracking(code: string): TrackingRecord | null {
  return readAll()[code.toUpperCase()] || null;
}

export function listTrackings(): TrackingRecord[] {
  return Object.values(readAll()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function createTracking(record: TrackingRecord) {
  const all = readAll();
  const key = record.code.toUpperCase();
  if (all[key]) throw new Error("Código já existe");
  all[key] = record;
  if (record.carrierCode) all[record.carrierCode.toUpperCase()] = record;
  writeAll(all);
  return record;
}

export function updateTracking(code: string, patch: Partial<TrackingRecord>) {
  const all = readAll();
  const key = code.toUpperCase();
  const existing = all[key];
  if (!existing) return null;
  const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  all[key] = updated;
  if (patch.carrierCode && patch.carrierCode !== existing.carrierCode) all[patch.carrierCode.toUpperCase()] = updated;
  if (existing.carrierCode && all[existing.carrierCode.toUpperCase()]) all[existing.carrierCode.toUpperCase()] = updated;
  writeAll(all);
  return updated;
}

export function generateInitialCode(orderId: string): string {
  const suffix = orderId.slice(-6).toUpperCase().replace(/[^A-Z0-9]/g, "0");
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `PS-${suffix}${rand}`;
}

export function generateCarrierCode(): string {
  return `BR${Math.floor(100000000 + Math.random() * 900000000)}`;
}

export function buildInitialEvents(productName: string, origin: string, destination: string): TrackingEvent[] {
  const now = new Date();
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return [
    { date: fmt(now), time, title: "Pedido confirmado", desc: `Pedido aprovado • ${productName}`, location: origin, done: true, current: true },
    { date: "—", time: "—", title: "Em processamento", desc: "Separação no centro de distribuição", location: "—", done: false },
    { date: "—", time: "—", title: "Em trânsito", desc: "Aguardando coleta da transportadora", location: "—", done: false },
    { date: "—", time: "—", title: "Saiu para entrega", desc: "—", location: "—", done: false },
    { date: "—", time: "—", title: "Entregue", desc: "Assinatura ou portaria", location: "—", done: false },
  ];
}

export function buildCarrierEvents(existing: TrackingRecord, carrierCode: string): TrackingEvent[] {
  const now = new Date();
  const fmt = (d: Date) => d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }).replace(".", "");
  const time = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return [
    { ...existing.events[0], done: true, current: false },
    { date: fmt(now), time, title: "Em processamento", desc: `Nota fiscal emitida • Código ${carrierCode}`, location: existing.origin, done: true },
    { date: fmt(now), time, title: "Em trânsito", desc: "Em rota para centro de distribuição", location: `${existing.origin} → ${existing.destination}`, done: true, current: true },
    { date: "—", time: "—", title: "Saiu para entrega", desc: "Aguardando expedição final", location: existing.destination, done: false },
    { date: "—", time: "—", title: "Entregue", desc: "Assinatura ou portaria", location: "Destino", done: false },
  ];
}
