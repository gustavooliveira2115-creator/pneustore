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
    // método fixo pix
    const method = body.method === "pix" ? "pix" : "pix";

    const customer = body.customer;
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.cpf) {
      return NextResponse.json({ error: "customer {name,email,phone,cpf} obrigatório" }, { status: 400 });
    }

    // Monta payload para BravoPay — só campos permitidos
    const payload: Record<string, unknown> = {
      amount_cents,
      method,
      customer: {
        name: String(customer.name).trim(),
        email: String(customer.email).trim().toLowerCase(),
        phone: String(customer.phone).replace(/\D/g, ""),
        cpf: String(customer.cpf).replace(/\D/g, ""),
      },
    };

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
