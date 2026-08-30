import fs from "fs";
import path from "path";

export type OrderStatus = "abandoned" | "pending" | "paid" | "expired" | "canceled" | "shipped" | "delivered";
export type OrderRecord = {
  id: string;
  externalReference?: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  items: { slug?: string; name: string; quantity: number; amount_cents: number; id?: string }[];
  amountCents: number;
  discountCents?: number;
  coupon?: string | null;
  status: OrderStatus;
  method: string; // pix
  instalacao?: boolean;
  shipping?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
  trackingCode?: string;
  carrierCode?: string;
  bravopayTxId?: string;
  utm?: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
};

const DATA_FILE = path.join(process.cwd(), "data", "orders.json");

function ensureFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
}
function readAll(): Record<string, OrderRecord> {
  ensureFile();
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8") || "{}");
  } catch {
    return {};
  }
}
function writeAll(data: Record<string, OrderRecord>) {
  ensureFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function listOrders(): OrderRecord[] {
  return Object.values(readAll()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
export function getOrder(id: string): OrderRecord | null {
  return readAll()[id] || null;
}
export function getOrderByExternalRef(ref: string): OrderRecord | null {
  return Object.values(readAll()).find((o) => o.externalReference === ref) || null;
}
export function createOrder(data: Omit<OrderRecord, "createdAt" | "updatedAt">): OrderRecord {
  const all = readAll();
  const now = new Date().toISOString();
  const rec: OrderRecord = { ...data, createdAt: now, updatedAt: now };
  all[rec.id] = rec;
  writeAll(all);
  return rec;
}
export function updateOrder(id: string, patch: Partial<OrderRecord>): OrderRecord | null {
  const all = readAll();
  const existing = all[id];
  if (!existing) return null;
  const updated = { ...existing, ...patch, updatedAt: new Date().toISOString() };
  all[id] = updated;
  writeAll(all);
  return updated;
}
export function upsertAbandonedOrder(email: string, patch: Partial<OrderRecord>): OrderRecord {
  const all = readAll();
  // procura abandoned mais recente para esse email nas últimas 48h
  const recent = Object.values(all)
    .filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase() && o.status === "abandoned")
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0];
  if (recent && Date.now() - new Date(recent.updatedAt).getTime() < 48 * 60 * 60 * 1000) {
    const updated = { ...recent, ...patch, updatedAt: new Date().toISOString() };
    all[recent.id] = updated;
    writeAll(all);
    return updated;
  }
  const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();
  const rec: OrderRecord = {
    customerEmail: email,
    customerName: patch.customerName || "",
    items: patch.items || [],
    amountCents: patch.amountCents || 0,
    status: "abandoned",
    method: patch.method || "pix",
    createdAt: now,
    updatedAt: now,
    ...patch,
    id,
  } as OrderRecord;
  all[id] = rec;
  writeAll(all);
  return rec;
}
