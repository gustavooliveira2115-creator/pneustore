import { NextRequest, NextResponse } from "next/server";
import { upsertCustomer, listCustomers, getCustomerByEmail } from "@/lib/customer-store";
import { dispatchWebhook } from "@/lib/webhook";
import { isValidEmail, isValidCPF, onlyDigits } from "@/lib/validators";
import { hashEmail } from "@/lib/crypto";

export async function GET(req: NextRequest) {
  // simples proteção por ADMIN_PASSWORD header ou query
  const auth = req.headers.get("x-admin-password") || req.nextUrl.searchParams.get("admin");
  if (auth !== process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD) {
    // também permite sem senha em dev se não houver ADMIN_PASSWORD
    if (process.env.NODE_ENV === "production") return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const email = req.nextUrl.searchParams.get("email");
  if (email) {
    const c = getCustomerByEmail(email);
    return NextResponse.json({ customer: c });
  }
  return NextResponse.json({ customers: listCustomers() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, email, telefone, cpf, cpfCnpj, cep, rua, numero, bairro, cidade, estado, complemento, referencia, nomeLocal, destinatario, tipo, promoEmail, promoWhatsapp, lgpdConsent, cartSnapshot, source } = body;

    if (!nome || typeof nome !== "string" || nome.trim().length < 3) return NextResponse.json({ error: "Nome inválido" }, { status: 400 });
    if (!isValidEmail(email)) return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
    const doc = cpf || cpfCnpj || "";
    if (doc && !isValidCPF(doc) && onlyDigits(doc).length === 11) return NextResponse.json({ error: "CPF inválido" }, { status: 400 });
    // lgpd obrigatório se vier do checkout
    if (body.requireLgpd && !lgpdConsent) return NextResponse.json({ error: "É necessário aceitar a Política de Privacidade (LGPD)" }, { status: 400 });

    const existing = getCustomerByEmail(email);
    const event: any = existing ? "customer.updated" : "customer.created";

    const record = upsertCustomer({
      email,
      emailHash: hashEmail(email),
      nome: nome.trim(),
      cpfCnpj: doc ? onlyDigits(doc) : undefined,
      telefone: telefone ? onlyDigits(telefone) : undefined,
      cep: cep ? String(cep) : undefined,
      rua,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
      referencia,
      nomeLocal,
      destinatario,
      tipo: tipo || "PF",
      promoEmail: !!promoEmail,
      promoWhatsapp: !!promoWhatsapp,
      lgpdConsent: !!lgpdConsent,
      cartSnapshot: cartSnapshot || null,
      source: source || null,
    });

    // dispara webhook de forma não-bloqueante mas aguardando para log
    // não falha a requisição se webhook falhar
    dispatchWebhook(event, { customer: record, isNew: !existing }).catch(() => {});

    return NextResponse.json({ ok: true, customer: record, event });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "erro interno" }, { status: 500 });
  }
}
