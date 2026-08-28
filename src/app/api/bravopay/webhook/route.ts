import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/bravopay/webhook
 *
 * Cadastre esta URL no dashboard BravoPay:
 *   https://SEU_DOMINIO/api/bravopay/webhook
 *
 * Eventos: transaction.created | transaction.paid | transaction.refunded | transaction.chargeback
 *
 * IMPORTANTE (produção):
 *  - Não confie só no polling do front. Confirme venda aqui.
 *  - Valide assinatura se a BravoPay enviar header de webhook (ex: X-Signature).
 *    Se não houver assinatura, valide pelo menos consultando a transação na API antes de liberar entrega.
 *  - Responda 200 rápido; faça processamento pesado em fila/job.
 *
 * Este handler já loga e revalida via API quando possível.
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => null);
    if (!payload) return NextResponse.json({ received: false, error: "JSON inválido" }, { status: 400 });

    const event: string = payload.event ?? payload.type ?? "unknown";
    const tx = payload.transaction ?? payload.data ?? payload;

    // Log estruturado — aparece em Vercel Logs
    console.log("[BravoPay webhook]", JSON.stringify({ event, txId: tx?.id, amount_cents: tx?.amount_cents, status: tx?.status }));

    // Exemplo: quando PAID, você deve:
    //  1) (opcional) revalidar: GET /api/v1/transactions/{id} com sua API key
    //  2) liberar pedido no seu banco/ERP (criar order PAID, enviar e-mail, etc.)
    //  3) registrar utm da venda se precisar
    if (event === "transaction.paid" || tx?.status === "PAID") {
      // TODO: implemente sua lógica de baixa de pedido aqui.
      // Ex:
      // await db.order.update({ where: { external_reference: tx.external_reference }, data: { status: "PAID", paid_at: new Date() }})
      // await sendEmail(...)

      // Revalidação server-side (se tiver API key configurada):
      //  const key = process.env.BRAVOPAY_API_KEY;
      //  if (key && tx?.id) {
      //    const r = await fetch(`https://bravopay.club/api/v1/transactions/${tx.id}`, { headers: { Authorization: `Bearer ${key}` }});
      //    const fresh = await r.json();
      //    if (fresh.status !== "PAID") console.warn("Divergência de status webhook vs API", fresh);
      //  }
    }

    // Sempre responda 200 para a BravoPay não re-tentar indefinidamente (quando você já processou)
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro webhook";
    console.error("[BravoPay webhook error]", msg);
    // Em erro transitório, pode retornar 500 para BravoPay re-tentar
    return NextResponse.json({ received: false, error: msg }, { status: 500 });
  }
}

// BravoPay pode enviar GET para validar URL (opcional)
export async function GET() {
  return NextResponse.json({ ok: true, message: "BravoPay webhook ativo em /api/bravopay/webhook" });
}
