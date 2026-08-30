import { NextRequest, NextResponse } from "next/server";
import { upsertCustomer, getCustomerByEmail } from "@/lib/customer-store";
import { upsertAbandonedOrder } from "@/lib/order-store";
import { dispatchWebhook } from "@/lib/webhook";
import { hashEmail } from "@/lib/crypto";
import { isValidEmail, onlyDigits } from "@/lib/validators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cliente, endereco, cart, coupon, lgpdConsent } = body;
    if (!cliente?.email || !isValidEmail(cliente.email)) return NextResponse.json({ error: "e-mail inválido" }, { status: 400 });
    if (lgpdConsent === false && body.requireLgpd) return NextResponse.json({ error: "LGPD consent required" }, { status: 400 });

    const email = cliente.email.trim().toLowerCase();
    const existing = getCustomerByEmail(email);

    const customer = upsertCustomer({
      email,
      emailHash: hashEmail(email),
      nome: cliente.nome || "",
      cpfCnpj: cliente.cpf ? onlyDigits(cliente.cpf) : undefined,
      telefone: cliente.telefone ? onlyDigits(cliente.telefone) : undefined,
      cep: endereco?.cep ? onlyDigits(endereco.cep) : undefined,
      rua: endereco?.rua,
      numero: endereco?.numero,
      complemento: endereco?.complemento,
      bairro: endereco?.bairro,
      cidade: endereco?.cidade,
      estado: endereco?.estado,
      referencia: endereco?.referencia,
      nomeLocal: endereco?.nomeLocal,
      destinatario: endereco?.destinatario,
      tipo: cliente.tipo || "PF",
      promoEmail: !!cliente.promoEmail,
      promoWhatsapp: !!cliente.promoWhatsapp,
      lgpdConsent: lgpdConsent ?? cliente.lgpdConsent ?? false,
      cartSnapshot: cart ? { items: cart.items, totalCents: cart.totalCents } : null,
      lastCartAbandonedAt: new Date().toISOString(),
      source: body.source || null,
    });

    let order = null;
    if (cart?.items?.length) {
      order = upsertAbandonedOrder(email, {
        customerId: customer.id,
        customerEmail: email,
        customerName: cliente.nome || customer.nome,
        items: cart.items.map((it: any) => ({ name: it.name, quantity: it.quantity, amount_cents: it.priceCents, slug: it.slug, id: it.id })),
        amountCents: cart.totalCents,
        coupon: coupon || null,
        status: "abandoned",
        method: "pix",
        shipping: endereco ? {
          street: endereco.rua,
          number: endereco.numero,
          complement: endereco.complemento,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: endereco.estado,
          zipcode: onlyDigits(endereco.cep || ""),
        } : undefined,
        utm: body.utm || null,
      });
    }

    const eventCustomer = existing ? "customer.updated" : "customer.created";
    const eventAbandoned = "customer.abandoned" as const;

    // webhooks
    dispatchWebhook(eventCustomer, { customer, isNew: !existing }).catch(() => {});
    if (order) dispatchWebhook("order.abandoned", { customer, order, cart, coupon }).catch(() => {});
    dispatchWebhook(eventAbandoned, { customer, order, cart }).catch(() => {});

    return NextResponse.json({ ok: true, customer, order });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "erro" }, { status: 500 });
  }
}
