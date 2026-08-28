"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ObrigadoInner() {
  const params = useSearchParams();
  const tx = params.get("tx");
  const method = params.get("method") || "pix";

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F7FF", padding: 16 }}>
      <div style={{ maxWidth: 560, width: "100%", background: "white", borderRadius: 16, padding: 32, textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a7f37", margin: "12px 0 8px" }}>Pagamento confirmado!</h1>
        <p style={{ color: "#555", fontSize: 14, lineHeight: 1.6 }}>
          Seu pedido foi pago com sucesso via {method === "card" ? "Cartão de Crédito" : "PIX"} BravoPay. Você receberá a confirmação no e-mail informado.
          <br />
          Obrigado por comprar na <b>PneuStore</b>! Valor caiu no gateway da API cadastrada.
        </p>

        {tx && (
          <div style={{ marginTop: 16, background: "#FAFAFA", border: "1px solid #eee", borderRadius: 10, padding: 12, fontSize: 12, color: "#666" }}>
            ID da transação: <code style={{ fontWeight: 700 }}>{tx}</code>
          </div>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 24, flexWrap: "wrap" }}>
          <Link
            href="/"
            style={{ height: 44, padding: "0 20px", borderRadius: 10, background: "var(--color-primary)", color: "white", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontWeight: 700 }}
          >
            Voltar para a loja
          </Link>
          <Link
            href="/"
            style={{ height: 44, padding: "0 20px", borderRadius: 10, border: "1px solid #ddd", color: "#333", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontWeight: 600 }}
          >
            Continuar comprando
          </Link>
        </div>

        <p style={{ fontSize: 11, color: "#999", marginTop: 16 }}>Se você não recebeu o e-mail em 5 minutos, verifique a caixa de spam ou fale conosco no WhatsApp.</p>
      </div>
    </main>
  );
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Carregando...</div>}>
      <ObrigadoInner />
    </Suspense>
  );
}
