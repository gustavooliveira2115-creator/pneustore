import { NextRequest, NextResponse } from "next/server";
import { listOrders, getOrder, createOrder, updateOrder } from "@/lib/order-store";
import { upsertCustomer, getCustomerByEmail } from "@/lib/customer-store";
import { dispatchWebhook } from "@/lib/webhook";
import { createTracking, generateInitialCode, buildInitialEvents } from "@/lib/tracking-store";
import { hashEmail } from "@/lib/crypto";
import { isValidEmail, onlyDigits } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("x-admin-password") || req.nextUrl.searchParams.get("admin");
  if (auth !== process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD) {
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const id = req.nextUrl.searchParams.get("id");
  if (id) return NextResponse.json({ order: getOrder(id) });
  const email = req.nextUrl.searchParams.get("email");
  let orders = listOrders();
  if (email) orders = orders.filter((o) => o.customerEmail.toLowerCase() === email.toLowerCase());
  return NextResponse.json({ orders });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, shipping, items, amountCents, coupon, discountCents, instalacao, externalReference, bravopayTxId, utm, method } = body;
    if (!customer?.email || !isValidEmail(customer.email)) return NextResponse.json({ error: "customer.email inválido" }, { status: 400 });
    if (!Array.isArray(items) || items.length === 0) return NextResponse.json({ error: "items vazio" }, { status: 400 });

    const email = customer.email.trim().toLowerCase();
    // garante cliente existe
    let cust = getCustomerByEmail(email);
    if (!cust) {
      cust = upsertCustomer({
        email,
        emailHash: hashEmail(email),
        nome: customer.name || customer.nome || "",
        cpfCnpj: customer.document ? onlyDigits(customer.document) : undefined,
        telefone: customer.phone ? onlyDigits(customer.phone) : undefined,
        cep: shipping?.zipcode ? onlyDigits(shipping.zipcode) : undefined,
        rua: shipping?.street,
        numero: shipping?.number,
        complemento: shipping?.complement,
        bairro: shipping?.neighborhood,
        cidade: shipping?.city,
        estado: shipping?.state,
        promoEmail: customer.promoEmail,
        promoWhatsapp: customer.promoWhatsapp,
        lgpdConsent: customer.lgpdConsent ?? true,
      });
    }

    const id = `ord_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const order = createOrder({
      id,
      externalReference: externalReference || `pneustore_${Date.now()}`,
      customerId: cust.id,
      customerEmail: email,
      customerName: customer.name || cust.nome,
      items,
      amountCents: amountCents || items.reduce((a: number, b: any) => a + (b.amount_cents || 0) * (b.quantity || 1), 0),
      discountCents: discountCents || 0,
      coupon: coupon || null,
      status: "pending",
      method: method || "pix",
      instalacao: !!instalacao,
      shipping: shipping ? {
        street: shipping.street,
        number: shipping.number,
        complement: shipping.complement,
        neighborhood: shipping.neighborhood,
        city: shipping.city,
        state: shipping.state,
        zipcode: onlyDigits(shipping.zipcode || ""),
      } : undefined,
      bravopayTxId: bravopayTxId || undefined,
      utm: utm || null,
    });

    // cria tracking inicial
    try {
      const origin = "Itajaí/SC - CD PneuStore";
      const dest = shipping ? `${shipping.city}/${shipping.state} - CEP ${shipping.zipcode}` : email;
      const code = generateInitialCode(id);
      const productName = items[0]?.name || "Pedido PneuStore";
      createTracking({
        code,
        stage: "pedido_confirmado",
        eta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR"),
        etaLabel: "Previsão de entrega",
        origin,
        destination: dest,
        lastUpdate: new Date().toISOString(),
        customerName: order.customerName,
        customerEmail: email,
        orderId: id,
        product: { name: productName, qty: items.reduce((a: number, b: any) => a + (b.quantity || 1), 0) },
        events: buildInitialEvents(productName, origin, dest),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      order.trackingCode = code;
      updateOrder(id, { trackingCode: code } as any);
    } catch (e) {
      console.warn("[orders] tracking create failed", e);
    }

    // webhooks - rastreio manual pela empresa, não envia e-mail automático (solicitado pelo cliente)
    dispatchWebhook("order.created", { order, customer: cust }).catch(() => {});

    return NextResponse.json({ ok: true, order });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "erro" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, trackingCode, carrierCode, carrierEvents } = body;
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });
    const order = getOrder(id);
    if (!order) return NextResponse.json({ error: "pedido não encontrado" }, { status: 404 });
    const patch: any = {};
    if (status) patch.status = status;
    if (trackingCode) patch.trackingCode = trackingCode;
    if (carrierCode) patch.carrierCode = carrierCode;
    const updated = updateOrder(id, patch);
    if (!updated) return NextResponse.json({ error: "falha ao atualizar" }, { status: 500 });

    // se mudou para shipped/paid, dispara webhook apenas (sem e-mail automático - rastreio manual)
    if (status === "shipped" || status === "paid") {
      dispatchWebhook(status === "paid" ? "order.paid" : "order.updated", { order: updated }).catch(() => {});
    } else {
      dispatchWebhook("order.updated", { order: updated }).catch(() => {});
    }

    // se comunicou código da transportadora, também atualiza tracking-store
    if (carrierCode) {
      try {
        const { getTracking, updateTracking, buildCarrierEvents } = await import("@/lib/tracking-store");
        const t = getTracking(updated.trackingCode || "");
        if (t) {
          updateTracking(t.code, { carrierCode, events: buildCarrierEvents(t, carrierCode) });
        }
        dispatchWebhook("tracking.updated", { order: updated, carrierCode }).catch(() => {});
      } catch {}
    }

    return NextResponse.json({ ok: true, order: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "erro" }, { status: 500 });
  }
}
