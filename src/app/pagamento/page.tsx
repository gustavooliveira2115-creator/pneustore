"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

type TxData = {
  id?: string;
  status?: string;
  amount_cents?: number;
  pix?: {
    copy_paste?: string;
    qr_code?: string;
    expires_at?: string;
  };
  // fallback nests
  transaction?: any;
  data?: any;
};

function extractTx(raw: any): TxData & { raw: any } {
  if (!raw) return { raw };
  // BravoPay returns Transaction directly or nested
  const base = raw.transaction ?? raw.data ?? raw;
  return {
    id: base.id ?? raw.id,
    status: base.status ?? raw.status,
    amount_cents: base.amount_cents ?? raw.amount_cents,
    pix: base.pix ?? raw.pix,
    raw,
    transaction: raw.transaction,
    data: raw.data,
  } as any;
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function PagamentoInner() {
  const params = useSearchParams();
  const router = useRouter();
  const txParam = params.get("tx");
  const [txId, setTxId] = useState<string | null>(txParam);
  const [tx, setTx] = useState<TxData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pollStatus, setPollStatus] = useState<string | null>(null);

  // hydrate from localStorage if no tx param
  useEffect(() => {
    if (txParam) {
      setTxId(txParam);
      return;
    }
    try {
      const last = localStorage.getItem("last_tx");
      if (last) {
        const j = JSON.parse(last);
        const ex = extractTx(j);
        if (ex.id) {
          setTxId(ex.id);
          setTx(ex as TxData);
          setLoading(false);
        }
      }
    } catch {}
  }, [txParam]);

  const fetchStatus = useCallback(async (id: string) => {
    try {
      const r = await fetch(`/api/bravopay/status/${encodeURIComponent(id)}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || `Erro ${r.status}`);
      const ex = extractTx(j);
      setTx(ex as TxData);
      setPollStatus(ex.status ?? null);
      setError(null);
      return ex;
    } catch (e: any) {
      setError(e?.message || "Erro ao consultar pagamento");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // initial fetch + polling
  useEffect(() => {
    if (!txId) {
      setLoading(false);
      return;
    }
    fetchStatus(txId);
    const interval = setInterval(async () => {
      const ex = await fetchStatus(txId);
      if (ex?.status === "PAID") {
        clearInterval(interval);
        // auto redirect after 1.2s
        setTimeout(() => router.push(`/obrigado?tx=${encodeURIComponent(txId)}&method=pix`), 1200);
      }
      if (ex?.status === "EXPIRED" || ex?.status === "REFUNDED" || ex?.status === "CHARGEBACK") {
        clearInterval(interval);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [txId, fetchStatus, router]);

  const copyPaste = tx?.pix?.copy_paste ?? (tx as any)?.raw?.pix?.copy_paste ?? (tx as any)?.raw?.copy_paste ?? "";
  const qrCodeImg = tx?.pix?.qr_code ?? (tx as any)?.raw?.pix?.qr_code ?? "";
  const amount = tx?.amount_cents ?? (tx as any)?.raw?.amount_cents ?? null;
  const status = (tx?.status ?? pollStatus ?? "").toUpperCase();
  const expiresAt = tx?.pix?.expires_at ? new Date(tx.pix.expires_at) : null;

  const handleCopy = async () => {
    if (!copyPaste) return;
    try {
      await navigator.clipboard.writeText(copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = copyPaste;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!txId && !loading) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F7FF", padding: 16 }}>
        <div style={{ maxWidth: 480, width: "100%", background: "white", borderRadius: 16, padding: 32, textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
          <p style={{ fontSize: 18, fontWeight: 800, color: "#1a1a1a" }}>Nenhum pagamento encontrado</p>
          <p style={{ fontSize: 13, color: "#666", marginTop: 8 }}>Volte ao checkout e gere um novo PIX.</p>
          <Link href="/checkout" style={{ marginTop: 20, display: "inline-flex", height: 44, padding: "0 24px", borderRadius: 999, background: "#4e008e", color: "white", alignItems: "center", justifyContent: "center", textDecoration: "none", fontWeight: 700 }}>
            Voltar ao checkout
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
      {/* header simples */}
      <header style={{ background: "white", borderBottom: "1px solid #e5e5e5", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <img src="/logo.png" alt="PneuStore" style={{ height: 28, width: "auto", objectFit: "contain" }} />
          </Link>
          <span style={{ fontSize: 12, color: "#2e7d32", fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>🔒 Pagamento seguro • BravoPay • PIX</span>
        </div>
      </header>

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "24px 16px", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start", justifyContent: "center" }}>
        {/* card PIX */}
        <div style={{ flex: "1 1 420px", maxWidth: 520, background: "white", borderRadius: 16, padding: 24, border: "1px solid #eee", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", marginBottom: 4, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 32, height: 32, borderRadius: 8, background: "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>◈</span>
            Pague com PIX
          </h1>
          <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>Escaneie o QR Code ou copie o código para pagar no seu banco. Pagamento vinculado à sua chave BravoPay.</p>

          {loading ? (
            <div style={{ padding: 40, textAlign: "center", color: "#888" }}>Carregando QR Code...</div>
          ) : error ? (
            <div style={{ background: "#fff1f0", border: "1px solid #ffa39e", color: "#a8071a", borderRadius: 10, padding: 12, fontSize: 13 }}>{error}</div>
          ) : (
            <>
              {/* status badge */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
                <span style={{ fontSize: 11, fontWeight: 800, padding: "6px 10px", borderRadius: 999, background: status === "PAID" ? "#e8f5e9" : status === "EXPIRED" ? "#fff1f0" : "#fff7e6", color: status === "PAID" ? "#2e7d32" : status === "EXPIRED" ? "#a8071a" : "#d48806", border: `1px solid ${status === "PAID" ? "#b7eb8f" : status === "EXPIRED" ? "#ffa39e" : "#ffe58f"}` }}>
                  {status === "PAID" ? "✓ PAGO" : status === "EXPIRED" ? "EXPIRADO" : status === "PENDING" ? "AGUARDANDO PAGAMENTO" : status || "PENDENTE"}
                </span>
                {amount !== null && <span style={{ fontSize: 12, fontWeight: 700, padding: "6px 10px", borderRadius: 999, background: "#f6f5ff", border: "1px solid #e8e0ff", color: "#4e008e" }}>{formatBRL(amount)}</span>}
                {txId && <span style={{ fontSize: 11, color: "#999", padding: "6px 10px" }}>ID: {txId.slice(0, 12)}…</span>}
              </div>

              {status === "PAID" ? (
                <div style={{ background: "#e8f5e9", border: "1px solid #b7eb8f", borderRadius: 12, padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 36 }}>✅</div>
                  <p style={{ fontWeight: 800, color: "#2e7d32", marginTop: 8 }}>Pagamento confirmado!</p>
                  <p style={{ fontSize: 13, color: "#555", marginTop: 4 }}>Redirecionando para confirmação...</p>
                  <Link href={`/obrigado?tx=${encodeURIComponent(txId || "")}&method=pix`} style={{ marginTop: 12, display: "inline-flex", height: 40, padding: "0 20px", borderRadius: 999, background: "#4e008e", color: "white", alignItems: "center", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                    Ver confirmação
                  </Link>
                </div>
              ) : (
                <>
                  {/* QR Code */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, background: "#fafafa", border: "1px solid #eee", borderRadius: 12, padding: 20 }}>
                    {qrCodeImg && (qrCodeImg.startsWith("data:image") || qrCodeImg.startsWith("http")) ? (
                      <img src={qrCodeImg} alt="QR Code PIX" style={{ width: 220, height: 220, objectFit: "contain", background: "white", padding: 12, borderRadius: 12, border: "1px solid #eee" }} />
                    ) : copyPaste ? (
                      <div style={{ background: "white", padding: 12, borderRadius: 12, border: "1px solid #eee" }}>
                        <QRCodeSVG value={copyPaste} size={200} level="M" includeMargin />
                      </div>
                    ) : (
                      <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", background: "white", borderRadius: 12, border: "1px dashed #ccc", color: "#999", fontSize: 12, textAlign: "center", padding: 16 }}>
                        QR Code não disponível. Use o copia e cola abaixo.
                      </div>
                    )}

                    {expiresAt && status !== "EXPIRED" && (
                      <p style={{ fontSize: 11, color: "#888" }}>Expira em: {expiresAt.toLocaleString("pt-BR")} </p>
                    )}
                  </div>

                  {/* copia e cola */}
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, marginBottom: 8, color: "#333" }}>PIX Copia e Cola</p>
                    <div style={{ background: "#fafafa", border: "1px solid #e5e5e5", borderRadius: 10, padding: 12, display: "flex", gap: 8, alignItems: "center" }}>
                      <input readOnly value={copyPaste} placeholder="Código PIX não gerado" style={{ flex: 1, border: "none", background: "transparent", fontSize: 11, color: "#333", outline: "none", wordBreak: "break-all" }} />
                    </div>
                    <button
                      onClick={handleCopy}
                      disabled={!copyPaste}
                      style={{
                        marginTop: 12,
                        width: "100%",
                        height: 48,
                        borderRadius: 999,
                        background: copied ? "#2e7d32" : "#4e008e",
                        color: "white",
                        border: "none",
                        fontWeight: 800,
                        fontSize: 14,
                        cursor: copyPaste ? "pointer" : "not-allowed",
                        opacity: copyPaste ? 1 : 0.6,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        transition: "background 0.2s",
                      }}
                    >
                      {copied ? "✓ Copiado!" : "⎘ Copiar código PIX"}
                    </button>
                    <p style={{ fontSize: 11, color: "#888", textAlign: "center", marginTop: 8 }}>Abra o app do seu banco → PIX → Colar código</p>
                  </div>

                  {/* verificar status */}
                  <button
                    onClick={() => txId && fetchStatus(txId)}
                    style={{ marginTop: 16, width: "100%", height: 40, borderRadius: 999, background: "white", border: "1px solid #d9d9d9", color: "#333", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                  >
                    Já paguei — verificar agora
                  </button>

                  <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 12, lineHeight: 1.4 }}>
                    Pagamento processado pela <b>BravoPay</b> (https://bravopay.club/api/v1) com sua chave <code>BRAVOPAY_API_KEY</code> da Vercel.<br />
                    Status atualiza automaticamente a cada 3 segundos.
                  </p>
                </>
              )}
            </>
          )}
        </div>

        {/* resumo lateral */}
        <div style={{ width: 340, maxWidth: "100%", flex: "0 0 340px", background: "white", borderRadius: 16, border: "1px solid #eee", padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Como pagar</h3>
          <ol style={{ fontSize: 13, color: "#444", lineHeight: 1.6, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
            <li>Abra o app do seu banco</li>
            <li>Escolha <b>PIX → QR Code</b> ou <b>PIX Copia e Cola</b></li>
            <li>Escaneie ou cole o código</li>
            <li>Confirme o pagamento de {amount !== null ? <b style={{ color: "#4e008e" }}>{formatBRL(amount)}</b> : "valor exibido"}</li>
          </ol>
          <div style={{ marginTop: 16, background: "#f6f5ff", border: "1px solid #e8e0ff", borderRadius: 10, padding: 12, fontSize: 12, color: "#555" }}>
            <b style={{ color: "#4e008e" }}>Dica:</b> Após pagar, o status muda para <b style={{ color: "#2e7d32" }}>PAGO</b> automaticamente. Você será levado para a página de confirmação.
          </div>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <Link href="/checkout" style={{ flex: 1, height: 40, borderRadius: 999, border: "1px solid #d9d9d9", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#333", fontWeight: 600, fontSize: 13, background: "white" }}>
              Voltar
            </Link>
            <Link href="/" style={{ flex: 1, height: 40, borderRadius: 999, background: "#f5f5f5", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", color: "#333", fontWeight: 600, fontSize: 13 }}>
              Loja
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function PagamentoPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Carregando pagamento...</div>}>
      <PagamentoInner />
    </Suspense>
  );
}
