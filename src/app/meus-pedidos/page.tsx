"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type OrderItem = { name: string; quantity: number; amount_cents: number };
type Order = {
  id: string;
  created_at: string;
  amount_cents: number;
  status: string; // PENDING | PAID | EXPIRED | etc
  method: string; // pix | card
  items: OrderItem[];
  external_reference?: string;
  instalacao?: boolean;
};

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function formatDate(iso: string) {
  try { return new Date(iso).toLocaleString("pt-BR"); } catch { return iso; }
}

export default function MeusPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const rawOrders = localStorage.getItem("pneustore_orders");
      const rawLast = localStorage.getItem("last_tx");
      let list: Order[] = [];
      if (rawOrders) {
        const parsed = JSON.parse(rawOrders);
        if (Array.isArray(parsed)) list = parsed;
      }
      // Fallback: inclui last_tx se não estiver na lista
      if (rawLast) {
        const j = JSON.parse(rawLast);
        const tx = j?.transaction ?? j?.data ?? j;
        const id = tx?.id || j?.id;
        if (id && !list.some((o) => o.id === id)) {
          const amount = Number(tx?.amount_cents ?? j?.amount_cents ?? 0);
          const items: OrderItem[] = (() => {
            try {
              const meta = tx?.metadata;
              if (meta?.items_summary) return JSON.parse(meta.items_summary);
            } catch {}
            if (Array.isArray(tx?.items)) return tx.items;
            if (Array.isArray(j?.items)) return j.items;
            return [{ name: "Pedido PneuStore", quantity: 1, amount_cents: amount }];
          })();
          const instalacao = tx?.metadata?.instalacao === "sim" || !!localStorage.getItem("checkout_instalacao");
          list.unshift({
            id,
            created_at: tx?.created_at || j?.created_at || new Date().toISOString(),
            amount_cents: amount,
            status: (tx?.status || j?.status || "PENDING").toString(),
            method: (tx?.method || j?.method || "pix").toString(),
            items,
            external_reference: tx?.external_reference || j?.external_reference,
            instalacao,
          });
        }
      }
      // Poll status para cada pedido pendente (enriquecer)
      setOrders(list);
      // Opcional: buscar status atualizado via API para pendentes
      list.filter((o) => o.status === "PENDING").slice(0, 3).forEach(async (o) => {
        try {
          const r = await fetch(`/api/bravopay/status/${encodeURIComponent(o.id)}`, { cache: "no-store" });
          const j = await r.json();
          if (r.ok) {
            const tx = j?.transaction ?? j?.data ?? j;
            setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status: tx.status ?? x.status, amount_cents: tx.amount_cents ?? x.amount_cents } : x)));
          }
        } catch {}
      });
    } catch {}
    setLoading(false);
  }, []);

  const hasOrders = orders.length > 0;

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>
      <Header />
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 20px", fontSize: 13, color: "var(--color-textSecondary)" }}>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#999" }}>/</span>
          <span style={{ color: "#666" }}>Meus pedidos</span>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 48px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>Meus Pedidos</h1>
        <p style={{ fontSize: 13, color: "#8c8c8c", margin: "0 0 24px" }}>Histórico dinâmico das compras finalizadas nesta loja (dados locais + status BravoPay).</p>

        {loading ? (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", padding: 32, textAlign: "center", color: "#8c8c8c" }}>Carregando pedidos...</div>
        ) : !hasOrders ? (
          <div style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", padding: 32, textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#f6f5ff", border: "1px solid #e8e0ff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 28 }}>📦</div>
            <p style={{ fontSize: 16, fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>Você ainda não tem pedidos</p>
            <p style={{ fontSize: 13, color: "#666", margin: "0 0 16px" }}>Finalize uma compra no checkout (PIX) e ela aparecerá aqui com status, itens, valor e meio de pagamento.</p>
            <Link href="/todos" style={{ display: "inline-flex", height: 40, padding: "0 20px", borderRadius: 999, background: "#4c0082", color: "white", alignItems: "center", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>Ver produtos</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {orders.map((o) => {
              const isPaid = o.status?.toUpperCase() === "PAID";
              const isExpired = o.status?.toUpperCase() === "EXPIRED";
              return (
                <div key={o.id} style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", overflow: "hidden" }}>
                  <div style={{ padding: "14px 20px", display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between", alignItems: "center", background: isPaid ? "#f6ffed" : isExpired ? "#fff1f0" : "#fafafa", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontSize: 12, color: "#8c8c8c" }}>Pedido <strong style={{ color: "#1a1a1a" }}>{o.id.slice(0, 12)}…</strong> • {formatDate(o.created_at)}</span>
                      <span style={{ fontSize: 11, color: "#999" }}>{o.external_reference || "sem referência externa"}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 8px", borderRadius: 999, background: isPaid ? "#52c41a" : isExpired ? "#ff4d4f" : "#faad14", color: "white" }}>{o.status}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "4px 8px", borderRadius: 999, background: "white", border: "1px solid #e8e0ff", color: "#4c0082" }}>{o.method?.toUpperCase()}</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "#4c0082" }}>{formatBRL(o.amount_cents)}</span>
                    </div>
                  </div>
                  <div style={{ padding: "12px 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {o.items.map((it, idx) => (
                        <div key={idx} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 13, padding: "6px 0", borderBottom: idx === o.items.length - 1 ? "none" : "1px dashed #f0f0f0" }}>
                          <span style={{ color: "#333", flex: 1 }}>{it.quantity}x {it.name}</span>
                          <span style={{ fontWeight: 700, color: "#1a1a1a" }}>{formatBRL(it.amount_cents * it.quantity)}</span>
                        </div>
                      ))}
                      {o.instalacao && <div style={{ fontSize: 11, color: "#4c0082", background: "#f6f5ff", border: "1px solid #e8e0ff", borderRadius: 6, padding: "6px 8px", marginTop: 4 }}>🔧 Serviço de instalação (R$ 50,00) incluído</div>}
                    </div>
                    <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <Link href={`/pagamento?tx=${encodeURIComponent(o.id)}`} style={{ height: 36, padding: "0 14px", borderRadius: 8, background: isPaid ? "#f6ffed" : "#4c0082", color: isPaid ? "#389e0d" : "white", border: isPaid ? "1px solid #b7eb8f" : "none", display: "inline-flex", alignItems: "center", textDecoration: "none", fontSize: 12, fontWeight: 700 }}>
                        {isPaid ? "Ver comprovante" : "Ver pagamento / QR Code"}
                      </Link>
                      <Link href={`/obrigado?tx=${encodeURIComponent(o.id)}&method=${o.method}`} style={{ height: 36, padding: "0 14px", borderRadius: 8, background: "white", color: "#4c0082", border: "1px solid #e8e0ff", display: "inline-flex", alignItems: "center", textDecoration: "none", fontSize: 12, fontWeight: 700 }}>
                        Detalhes
                      </Link>
                      <span style={{ marginLeft: "auto", fontSize: 11, color: "#999", alignSelf: "center" }}>Total: {formatBRL(o.amount_cents)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            <div style={{ textAlign: "center", marginTop: 8 }}>
              <button
                onClick={() => {
                  if (confirm("Limpar histórico local de pedidos?")) {
                    localStorage.removeItem("pneustore_orders");
                    localStorage.removeItem("last_tx");
                    location.reload();
                  }
                }}
                style={{ fontSize: 12, color: "#ff4d4f", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Limpar histórico local
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/" style={{ fontSize: 13, color: "#4c0082", textDecoration: "underline", fontWeight: 600 }}>← Voltar para a loja</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
