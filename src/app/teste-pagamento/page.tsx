"use client";

import Link from "next/link";
import { useBravoCheckout } from "@/components/BravoPayCheckout";

const TEST_PRODUCT = {
  name: "Produto Teste — Pagamento R$ 5,00",
  amount_cents: 500, // R$ 5,00
  id: "TESTE-5-REAIS",
  slug: "produto-teste-5-reais",
};

export default function TestePagamentoPage() {
  const { openCheckout } = useBravoCheckout();

  const handlePay = () => {
    openCheckout({
      product: {
        name: TEST_PRODUCT.name,
        amount_cents: TEST_PRODUCT.amount_cents,
        id: TEST_PRODUCT.id,
        slug: TEST_PRODUCT.slug,
      },
      quantity: 1,
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
      <header style={{ background: "white", borderBottom: "1px solid #e5e5e5", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.png" alt="PneuStore" style={{ height: 28, width: "auto", objectFit: "contain" }} />
          </Link>
          <span style={{ fontSize: 12, color: "#2e7d32", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>🔒 Pagamento teste • BravoPay • R$ 5,00</span>
        </div>
      </header>

      <main style={{ maxWidth: 720, margin: "0 auto", padding: "32px 16px" }}>
        <nav style={{ fontSize: 13, color: "#888", marginBottom: 16 }}>
          <Link href="/" style={{ color: "#4e008e", textDecoration: "underline" }}>Home</Link> / Teste de pagamento
        </nav>

        <div style={{ background: "white", borderRadius: 16, border: "1px solid #eee", overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ padding: 24, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ width: 140, height: 140, background: "#fafafa", borderRadius: 12, border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 48 }}>🧪</div>
            <div style={{ flex: 1, minWidth: 240 }}>
              <span style={{ display: "inline-block", background: "#FFF7E6", border: "1px solid #FFD666", color: "#614700", borderRadius: 999, padding: "4px 10px", fontSize: 11, fontWeight: 700, marginBottom: 8 }}>🧪 PRODUTO DE TESTE</span>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", lineHeight: 1.3, margin: 0 }}>{TEST_PRODUCT.name}</h1>
              <p style={{ fontSize: 13, color: "#666", marginTop: 6, lineHeight: 1.5 }}>
                Valor real cobrado via BravoPay. Use para validar PIX e Cartão sem estornar valor alto. Também disponível em <Link href="/produto/produto-teste-5-reais" style={{ color: "#4e008e", textDecoration: "underline" }}>/produto/produto-teste-5-reais</Link>.
              </p>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 12 }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#4e008e" }}>R$ 5,00</span>
                <span style={{ fontSize: 13, color: "#888" }}>no PIX • 1x de R$ 5,00 sem juros</span>
              </div>
              <p style={{ fontSize: 11, color: "#999", marginTop: 4 }}>ID: {TEST_PRODUCT.id} • 500 centavos • BravoPay {process.env.NEXT_PUBLIC_BASE_URL ? "" : ""}</p>
            </div>
          </div>

          <div style={{ padding: "16px 24px", background: "#fafafa", borderTop: "1px solid #eee", display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={handlePay}
              style={{
                width: "100%",
                height: 52,
                borderRadius: 12,
                border: "none",
                background: "#4e008e",
                color: "white",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 8px 20px rgba(78,0,142,0.25)",
              }}
            >
              Pagar R$ 5,00 agora →
            </button>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Link href="/produto/produto-teste-5-reais" style={{ height: 40, borderRadius: 999, border: "1px solid #4e008e", background: "white", color: "#4e008e", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                Ver como PDP
              </Link>
              <Link href="/checkout" style={{ height: 40, borderRadius: 999, border: "1px solid #d9d9d9", background: "white", color: "#333", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                Ir ao carrinho
              </Link>
            </div>
            <p style={{ fontSize: 11, color: "#888", textAlign: "center", lineHeight: 1.5, margin: 0 }}>
              Ao clicar, abre o modal BravoPay (PIX • Cartão). O QR Code/pagamento é <b>real</b> e cai na conta da <code>BRAVOPAY_API_KEY</code>. Após pagar, você verá confirmação em <code>/pagamento</code> → <code>/obrigado</code>.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 16, background: "white", borderRadius: 12, border: "1px solid #eee", padding: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Como testar em 30s</h3>
          <ol style={{ fontSize: 13, color: "#444", lineHeight: 1.7, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
            <li>Clique em <b>Pagar R$ 5,00 agora</b></li>
            <li>Preencha <b>Nome e E-mail</b> (sem CPF/telefone)</li>
            <li>Escolha <b>PIX</b> (10% OFF) ou <b>Cartão</b> e confirme - o backend chama <code>POST /api/bravopay/create-transaction</code> com <code>amount_cents: 500</code></li>
            <li>Se PIX: escaneie o QR Code ou copie o Copia e Cola no app do banco. O app faz polling em <code>/api/bravopay/status/[id]</code> a cada 3s até <code>PAID</code>.</li>
            <li>Após <code>PAID</code>, vai para <code>/obrigado?tx=...</code> e salva em <code>Meus Pedidos</code>.</li>
          </ol>
          <div style={{ marginTop: 12, background: "#f6f5ff", border: "1px solid #e8e0ff", borderRadius: 8, padding: 10, fontSize: 11, color: "#555" }}>
            💡 Dica: use o Network do DevTools para ver o <code>201</code> com <code>pix.copy_paste</code>. Se ver erro <code>BRAVOPAY_API_KEY não configurada</code>, adicione a key em <b>Vercel → Settings → Environment Variables (Production + Preview + Development) + Redeploy</b>.
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/" style={{ fontSize: 13, color: "#4e008e", textDecoration: "underline" }}>← Voltar para a loja</Link>
        </div>
      </main>
    </div>
  );
}
