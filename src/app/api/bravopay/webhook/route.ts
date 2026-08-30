import { NextRequest, NextResponse } from "next/server";
import { getOrderByExternalRef, updateOrder, listOrders } from "@/lib/order-store";
import { dispatchWebhook } from "@/lib/webhook";

/**
 * POST /api/bravopay/webhook
 *
 * Cadastre esta URL no dashboard BravoPay:
 *   https://SEU_DOMINIO/api/bravopay/webhook
 *
 * Eventos: transaction.created | transaction.paid | transaction.refunded | transaction.chargeback
 */

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json().catch(() => null);
    if (!payload) return NextResponse.json({ received: false, error: "JSON inválido" }, { status: 400 });

    const event: string = payload.event ?? payload.type ?? "unknown";
    const tx = payload.transaction ?? payload.data ?? payload;

    console.log("[BravoPay webhook]", JSON.stringify({ event, txId: tx?.id, external_reference: tx?.external_reference, amount_cents: tx?.amount_cents, status: tx?.status }));

    // Tenta vincular a um pedido nosso via external_reference ou bravopayTxId
    const ref = tx?.external_reference as string | undefined;
    const txId = tx?.id as string | undefined;
    const statusRaw = (tx?.status || "").toUpperCase();

    // Mapeia status BravoPay para nosso status
    const mapStatus: Record<string, string> = { PAID: "paid", APPROVED: "paid", CONFIRMED: "paid", PENDING: "pending", EXPIRED: "expired", FAILED: "canceled", CANCELED: "canceled", REFUNDED: "canceled", CHARGEBACK: "canceled" };
    const newStatus = mapStatus[statusRaw];

    if (ref || txId) {
      // procura por externalReference ou bravopayTxId
      let order = ref ? getOrderByExternalRef(ref) : null;
      if (!order && txId) {
        const all = listOrders();
        order = all.find((o) => o.bravopayTxId === txId || o.externalReference === ref) || null;
      }
      if (order && newStatus) {
        const updated = updateOrder(order.id, { status: newStatus as any, bravopayTxId: txId || order.bravopayTxId } as any);
        if (updated) {
          console.log(`[webhook] Pedido ${updated.id} atualizado para ${newStatus}`);
          // dispara webhooks para automações (ActiveCampaign, RD, Utmify, Z-API etc) - sem e-mail automático (rastreio manual)
          const hookEvent = newStatus === "paid" ? "order.paid" : "order.updated";
          dispatchWebhook(hookEvent as any, { order: updated, transaction: tx, event }).catch(() => {});
        }
      } else if (!order && (statusRaw === "PAID" || event === "transaction.paid")) {
        console.warn(`[webhook] Transação paga sem pedido vinculado: ref=${ref} tx=${txId}`);
      }
    }

    if (event === "transaction.paid" || statusRaw === "PAID") {
      // revalidação opcional via API quando houver chave
      const key = process.env.BRAVOPAY_API_KEY;
      if (key && txId) {
        try {
          const r = await fetch(`https://bravopay.club/api/v1/transactions/${txId}`, { headers: { Authorization: `Bearer ${key}` } });
          const fresh = await r.json().catch(() => null);
          if (fresh && fresh.status && String(fresh.status).toUpperCase() !== "PAID") console.warn("Divergência webhook vs API", fresh);
        } catch {}
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro webhook";
    console.error("[BravoPay webhook error]", msg);
    return NextResponse.json({ received: false, error: msg }, { status: 500 });
  }
}

// BravoPay pode enviar GET para validar URL (opcional)
export async function GET() {
  return NextResponse.json({ ok: true, message: "BravoPay webhook ativo em /api/bravopay/webhook" });
}
