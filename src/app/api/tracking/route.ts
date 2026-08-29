import { NextRequest, NextResponse } from "next/server";
import { createTracking, generateInitialCode, buildInitialEvents, listTrackings, getTracking } from "@/lib/tracking-store";

export async function GET() {
  return NextResponse.json({ trackings: listTrackings() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, customerEmail, orderId, productName, qty = 1, origin = "CD São Paulo — SP", destination = "Destino" } = body;
    if (!customerEmail || !orderId) return NextResponse.json({ error: "customerEmail e orderId são obrigatórios" }, { status: 400 });

    const code = body.code?.toUpperCase() || generateInitialCode(orderId);
    if (getTracking(code)) return NextResponse.json({ error: "Código já existe" }, { status: 409 });

    const now = new Date().toISOString();
    const record = createTracking({
      code,
      stage: "pedido_confirmado",
      eta: "em até 2 dias",
      etaLabel: "Pedido confirmado",
      origin,
      destination,
      lastUpdate: "agora",
      customerName: customerName || "Cliente",
      customerEmail: customerEmail.toLowerCase(),
      orderId,
      product: { name: productName || "Produto PneuStore", qty },
      events: buildInitialEvents(productName || "Produto PneuStore", origin, destination),
      createdAt: now,
      updatedAt: now,
    });

    const baseUrl = req.headers.get("origin") || "http://localhost:3000";
    const link = `${baseUrl}/rastreio?code=${encodeURIComponent(code)}`;
    return NextResponse.json({ tracking: record, link }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Erro" }, { status: 500 });
  }
}
