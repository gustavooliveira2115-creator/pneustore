import { NextRequest, NextResponse } from "next/server";
import { getTracking, updateTracking, buildCarrierEvents, generateCarrierCode } from "@/lib/tracking-store";

export async function GET(_: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const tracking = getTracking(code);
  if (!tracking) return NextResponse.json({ error: "Código não encontrado" }, { status: 404 });
  return NextResponse.json({ tracking });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const body = await req.json().catch(() => ({}));
    const existing = getTracking(code);
    if (!existing) return NextResponse.json({ error: "Código não encontrado" }, { status: 404 });

    let patch: any = {};
    if (body.generateCarrier) {
      const carrierCode = generateCarrierCode();
      patch = {
        carrierCode,
        stage: "transito" as const,
        eta: "qui, 05 set",
        etaLabel: "Em trânsito",
        lastUpdate: "há poucos minutos",
        events: buildCarrierEvents(existing, carrierCode),
      };
    } else {
      if (body.stage) patch.stage = body.stage;
      if (body.eta) patch.eta = body.eta;
      if (body.etaLabel) patch.etaLabel = body.etaLabel;
      if (body.origin) patch.origin = body.origin;
      if (body.destination) patch.destination = body.destination;
      if (body.events) patch.events = body.events;
      if (body.lastUpdate) patch.lastUpdate = body.lastUpdate;
      if (body.customerName) patch.customerName = body.customerName;
      if (body.customerEmail) patch.customerEmail = body.customerEmail;
    }

    const updated = updateTracking(code, patch);
    return NextResponse.json({ tracking: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const existing = getTracking(code);
  if (!existing) return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  // deleta do arquivo
  const fs = await import("fs");
  const path = await import("path");
  const file = path.join(process.cwd(), "data", "tracking.json");
  try {
    const raw = fs.readFileSync(file, "utf-8");
    const data = JSON.parse(raw);
    delete data[code.toUpperCase()];
    if (existing.carrierCode) delete data[existing.carrierCode.toUpperCase()];
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch {}
  return NextResponse.json({ ok: true });
}
