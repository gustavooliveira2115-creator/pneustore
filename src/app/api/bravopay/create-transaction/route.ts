import { NextRequest, NextResponse } from "next/server";
import { bravoFetch } from "@/lib/bravopay-server";

/**
 * POST /api/bravopay/create-transaction
 *
 * Body esperado do front:
 * {
 *   amount_cents: number, // obrigatório (ex: 39893)
 *   method: "pix",
 *   customer: { name, email, phone, cpf },
 *   external_reference?: string,
 *   product_id?: string,         // opcional — recomendado se usa UTMify
 *   utm?: { source, medium, ...},
 *   split?: { recipient, percent | amount_cents }
 * }
 *
 * Segurança:
 *  - API key NUNCA vai pro client; só o server lê process.env.BRAVOPAY_API_KEY
 *  - Validação mínima de campos + sanitização
 *  - Repassa utm/product_id/split exatamente como recebido
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: "JSON inválido" }, { status: 400 });

    const amount_cents = Number(body.amount_cents);
    if (!Number.isInteger(amount_cents) || amount_cents <= 0) {
      return NextResponse.json({ error: "amount_cents obrigatório e > 0 (em centavos)" }, { status: 400 });
    }
    // PIX ou Cartão — ambos caem na mesma conta BravoPay da API key
    const rawMethod = String(body.method || "pix").toLowerCase();
    const method = rawMethod === "card" || rawMethod === "credit_card" || rawMethod === "credit" ? "card" : "pix";

    const customer = body.customer;
    if (!customer?.name || !customer?.email) {
      return NextResponse.json({ error: "customer {name,email} obrigatório (telefone e CPF foram removidos do checkout)" }, { status: 400 });
    }

    // Telefone e CPF são opcionais agora (removidos do checkout a pedido) — envia só se vier
    // Se a BravoPay exigir, o gateway usará fallback interno ou o e-mail como identificação
    const customerPayload: Record<string, string> = {
      name: String(customer.name).trim(),
      email: String(customer.email).trim().toLowerCase(),
    };
    if (customer.phone) customerPayload.phone = String(customer.phone).replace(/\D/g, "");
    if (customer.cpf) customerPayload.cpf = String(customer.cpf).replace(/\D/g, "");

    // Monta payload para BravoPay — só campos permitidos
    const payload: Record<string, unknown> = {
      amount_cents,
      method,
      customer: customerPayload,
    };

    // Cartão: valida e repassa dados (nunca logar CVV)
    if (method === "card") {
      const card = body.card as Record<string, unknown> | undefined;
      const installments = Number(body.installments) || 1;
      if (!card || !card.number || !card.exp_month || !card.exp_year || !card.cvv) {
        return NextResponse.json({ error: "Dados do cartão incompletos (number, exp_month, exp_year, cvv)" }, { status: 400 });
      }
      payload.card = {
        number: String(card.number).replace(/\D/g, ""),
        holder_name: String(card.holder_name || body.card_holder_name || customer.name),
        exp_month: String(card.exp_month).padStart(2, "0"),
        exp_year: String(card.exp_year),
        cvv: String(card.cvv || card.cvc).replace(/\D/g, ""),
        cvc: String(card.cvc || card.cvv).replace(/\D/g, ""),
      };
      payload.installments = Math.min(Math.max(1, installments), 12);
      // compat: alguns gateways esperam top-level
      payload.card_number = (payload.card as Record<string, string>).number;
      payload.card_holder_name = (payload.card as Record<string, string>).holder_name;
      payload.card_exp_month = (payload.card as Record<string, string>).exp_month;
      payload.card_exp_year = (payload.card as Record<string, string>).exp_year;
      payload.card_cvv = (payload.card as Record<string, string>).cvv;
    }

    if (body.external_reference) payload.external_reference = String(body.external_reference);
    if (body.product_id) payload.product_id = String(body.product_id);
    if (body.utm && typeof body.utm === "object") payload.utm = body.utm;
    if (body.split && typeof body.split === "object") payload.split = body.split;

    // Chama BravoPay
    const { res, json, status } = await bravoFetch("/transactions", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // repassa erro da BravoPay com status original
      return NextResponse.json(
        {
          error: (json as Record<string, unknown>)?.message ?? (json as Record<string, unknown>)?.error ?? "Erro BravoPay",
          details: json,
          status,
        },
        { status: status >= 400 ? status : 500 }
      );
    }

    // Sucesso — retorna objeto da transação (com pix.copy_paste)
    return NextResponse.json(json as object, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    const isKeyMissing = msg.includes("BRAVOPAY_API_KEY");
    return NextResponse.json({ error: msg, hint: isKeyMissing ? "Configure BRAVOPAY_API_KEY em .env.local" : undefined }, { status: 500 });
  }
}
