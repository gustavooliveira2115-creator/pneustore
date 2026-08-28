"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { BRAVOPAY_PRODUCT_ID, type BravoSplit } from "@/lib/bravopay-config";
import { getUtmForApi, captureUtmOnLoad } from "@/lib/utm";
import { onlyDigits, isValidCPF, isValidEmail, isValidPhone, formatCPF, formatPhone } from "@/lib/validators";

// ── Tipos ────────────────────────────────────────────────────────────────
export type CheckoutProduct = {
  name: string;
  amount_cents: number; // valor unitário em centavos
  quantity?: number;
  slug?: string;
  id?: string;
};

type OpenArgs = {
  product: CheckoutProduct;
  quantity?: number;
};

type TxResponse = {
  id: string;
  status: string;
  pix?: { copy_paste: string; expires_at?: string; qr_code_base64?: string };
  amount_cents?: number;
};

type CheckoutState =
  | { step: "form" }
  | { step: "loading" }
  | { step: "pix"; tx: TxResponse; copyPaste: string; expiresAt?: string }
  | { step: "success"; txId: string };

// ── Context ──────────────────────────────────────────────────────────────
type Ctx = {
  openCheckout: (args: OpenArgs) => void;
  closeCheckout: () => void;
  isOpen: boolean;
};

const CheckoutCtx = createContext<Ctx | null>(null);
export function useBravoCheckout() {
  const ctx = useContext(CheckoutCtx);
  if (!ctx) throw new Error("useBravoCheckout deve estar dentro de BravoCheckoutProvider");
  return ctx;
}

// ── Provider ─────────────────────────────────────────────────────────────
export function BravoCheckoutProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<OpenArgs | null>(null);
  const [state, setState] = useState<CheckoutState>({ step: "form" });

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  // captura UTM no primeiro load
  useEffect(() => {
    captureUtmOnLoad();
  }, []);

  const amountTotal = useMemo(() => {
    if (!current) return 0;
    const qty = current.quantity ?? current.product.quantity ?? 1;
    return current.product.amount_cents * qty;
  }, [current]);

  const amountBRL = useMemo(() => (amountTotal / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), [amountTotal]);

  function openCheckout(args: OpenArgs) {
    setCurrent(args);
    setState({ step: "form" });
    setApiError(null);
    setErrors({});
    setIsOpen(true);
    // trava scroll
    document.documentElement.style.overflow = "hidden";
  }
  function closeCheckout() {
    setIsOpen(false);
    setState({ step: "form" });
    setApiError(null);
    if (pollingRef.current) window.clearInterval(pollingRef.current);
    pollingRef.current = null;
    document.documentElement.style.overflow = "";
  }

  // polling quando estiver em step pix
  useEffect(() => {
    if (state.step !== "pix") return;
    const txId = state.tx.id;

    const tick = async () => {
      try {
        const r = await fetch(`/api/bravopay/status/${txId}`, { cache: "no-store" });
        const j = await r.json();
        const status: string = j?.status ?? j?.transaction?.status ?? "";
        if (status === "PAID") {
          if (pollingRef.current) window.clearInterval(pollingRef.current);
          pollingRef.current = null;
          // sucesso — redireciona
          setState({ step: "success", txId });
          setTimeout(() => {
            closeCheckout();
            window.location.href = `/obrigado?tx=${encodeURIComponent(txId)}`;
          }, 800);
        }
        if (["EXPIRED", "FAILED", "CANCELED", "REFUNDED"].includes(status)) {
          if (pollingRef.current) window.clearInterval(pollingRef.current);
          setApiError(`Transação ${status}. Gere um novo PIX.`);
        }
      } catch {
        // ignora erro de polling isolado
      }
    };

    pollingRef.current = window.setInterval(tick, 3000);
    // primeira checagem imediata em 2s
    const t = window.setTimeout(tick, 2000);
    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
      pollingRef.current = null;
      window.clearTimeout(t);
    };
  }, [state]);

  // ESC fecha
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCheckout();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);

    const qty = current?.quantity ?? current?.product.quantity ?? 1;
    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) errs.name = "Informe nome completo";
    if (!isValidEmail(email)) errs.email = "E-mail inválido";
    if (!isValidPhone(phone)) errs.phone = "Telefone inválido (DDD + número)";
    if (!isValidCPF(cpf)) errs.cpf = "CPF inválido";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setState({ step: "loading" });

    try {
      const utm = getUtmForApi();
      // monta payload exatamente como a doc pede
      const payload: Record<string, unknown> = {
        amount_cents: amountTotal,
        method: "pix",
        customer: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: onlyDigits(phone), // backend aceita com ou sem 55; enviamos só dígitos
          cpf: onlyDigits(cpf),
        },
        // referência externa útil pra conciliação
        external_reference: `pneustore_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        ...(utm ? { utm } : {}),
        // product_id opcional — OBRIGATÓRIO se usar UTMify para não cair no "ghost"
        ...(BRAVOPAY_PRODUCT_ID ? { product_id: BRAVOPAY_PRODUCT_ID } : {}),
      };

      // Se quiser split, descomente e preencha:
      // (ou passe via openCheckout no futuro)
      // const split: BravoSplit | null = null;
      // if (split) payload.split = split;

      const r = await fetch("/api/bravopay/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();

      if (!r.ok) {
        const msg = j?.error || j?.message || j?.raw || `Erro ${r.status}`;
        throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
      }

      const tx: TxResponse = j;
      const copyPaste: string = j?.pix?.copy_paste || j?.copy_paste || j?.pix?.copyPaste || "";
      if (!copyPaste) throw new Error("PIX copy_paste não retornou. Verifique a API key e tente novamente.");

      setState({
        step: "pix",
        tx,
        copyPaste,
        expiresAt: j?.pix?.expires_at,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar transação";
      setApiError(msg);
      setState({ step: "form" });
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // feedback simples
      setApiError(null);
      const el = document.getElementById("bp-copy-feedback");
      if (el) {
        el.textContent = "Copiado!";
        setTimeout(() => (el.textContent = ""), 2000);
      }
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  };

  return (
    <CheckoutCtx.Provider value={{ openCheckout, closeCheckout, isOpen }}>
      {children}

      {isOpen && (
        <div
          aria-modal="true"
          role="dialog"
          aria-label="Checkout PIX"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCheckout();
          }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 560,
              maxHeight: "92dvh",
              overflow: "auto",
              background: "white",
              borderRadius: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            {/* header */}
            <div
              style={{
                position: "sticky",
                top: 0,
                background: "white",
                zIndex: 1,
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "var(--color-primary)" }}>
                  {state.step === "pix" ? "Pague com PIX" : state.step === "success" ? "Pagamento confirmado!" : "Finalizar compra"}
                </div>
                {current && state.step !== "success" && (
                  <div style={{ fontSize: 13, color: "#666", marginTop: 2, lineHeight: 1.4 }}>
                    {current.product.name} {current.quantity && current.quantity > 1 ? `• ${current.quantity} un.` : ""} —{" "}
                    <b style={{ color: "var(--color-primary)" }}>{amountBRL}</b>
                  </div>
                )}
              </div>
              <button
                onClick={closeCheckout}
                aria-label="Fechar"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  border: "1px solid #e5e5e5",
                  background: "white",
                  cursor: "pointer",
                  fontSize: 18,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: 20 }}>
              {state.step === "form" && (
                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {/* aviso product_id */}
                  {!BRAVOPAY_PRODUCT_ID && (
                    <div
                      style={{
                        background: "#FFF7E6",
                        border: "1px solid #FFD666",
                        color: "#614700",
                        borderRadius: 10,
                        padding: "10px 12px",
                        fontSize: 12,
                        lineHeight: 1.5,
                      }}
                    >
                      ⚠️ <b>UTMify:</b> você não configurou <code>BRAVOPAY_PRODUCT_ID</code>. A cobrança funciona, mas pode cair no produto fantasma (“ghost”) e não atribuir ao anúncio. Cole seu ID em{" "}
                      <code>src/lib/bravopay-config.ts</code>.
                    </div>
                  )}

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Nome completo *</span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: João Silva"
                      autoComplete="name"
                      style={{
                        height: 44,
                        borderRadius: 10,
                        border: `1px solid ${errors.name ? "#ff4d4f" : "#d9d9d9"}`,
                        padding: "0 12px",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    {errors.name && <span style={{ color: "#ff4d4f", fontSize: 12 }}>{errors.name}</span>}
                  </label>

                  <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>E-mail *</span>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="cliente@email.com"
                      type="email"
                      autoComplete="email"
                      style={{
                        height: 44,
                        borderRadius: 10,
                        border: `1px solid ${errors.email ? "#ff4d4f" : "#d9d9d9"}`,
                        padding: "0 12px",
                        fontSize: 14,
                        outline: "none",
                      }}
                    />
                    {errors.email && <span style={{ color: "#ff4d4f", fontSize: 12 }}>{errors.email}</span>}
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Telefone (WhatsApp) *</span>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(formatPhone(e.target.value))}
                        placeholder="(11) 99999-9999"
                        inputMode="numeric"
                        autoComplete="tel"
                        style={{
                          height: 44,
                          borderRadius: 10,
                          border: `1px solid ${errors.phone ? "#ff4d4f" : "#d9d9d9"}`,
                          padding: "0 12px",
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                      {errors.phone && <span style={{ color: "#ff4d4f", fontSize: 12 }}>{errors.phone}</span>}
                    </label>

                    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>CPF *</span>
                      <input
                        value={cpf}
                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        inputMode="numeric"
                        style={{
                          height: 44,
                          borderRadius: 10,
                          border: `1px solid ${errors.cpf ? "#ff4d4f" : "#d9d9d9"}`,
                          padding: "0 12px",
                          fontSize: 14,
                          outline: "none",
                        }}
                      />
                      {errors.cpf && <span style={{ color: "#ff4d4f", fontSize: 12 }}>{errors.cpf}</span>}
                    </label>
                  </div>

                  <div style={{ background: "#F6F5FF", border: "1px solid #E8E0FF", borderRadius: 12, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                    <span style={{ fontSize: 13, color: "#555" }}>Total a pagar no PIX</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: "var(--color-primary)" }}>{amountBRL}</span>
                  </div>

                  {apiError && (
                    <div style={{ background: "#FFF1F0", border: "1px solid #FFA39E", color: "#A8071A", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>{apiError}</div>
                  )}

                  <button
                    type="submit"
                    style={{
                      marginTop: 4,
                      height: 48,
                      borderRadius: 12,
                      border: "none",
                      background: "var(--color-primary)",
                      color: "white",
                      fontWeight: 800,
                      fontSize: 15,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    Gerar PIX agora →
                  </button>

                  <p style={{ fontSize: 11, color: "#888", textAlign: "center", lineHeight: 1.5, margin: 0 }}>
                    Pagamento 100% seguro via BravoPay • Seus dados são usados só para gerar o PIX. <br />
                    Ao pagar você confirma o pedido automaticamente.
                  </p>
                </form>
              )}

              {state.step === "loading" && (
                <div style={{ padding: "32px 0", textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #eee", borderTopColor: "var(--color-primary)", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
                  <div style={{ fontWeight: 700, color: "var(--color-primary)" }}>Gerando seu PIX...</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>Aguarde 2 segundos</div>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                </div>
              )}

              {state.step === "pix" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "center" }}>
                  <div style={{ background: "white", border: "1px solid #eee", borderRadius: 16, padding: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <QRCodeSVG value={state.copyPaste} size={220} level="M" includeMargin />
                  </div>

                  <div style={{ fontSize: 13, color: "#444", textAlign: "center", lineHeight: 1.5 }}>
                    Abra o app do seu banco, escolha <b>PIX → QR Code</b> e aponte a câmera.
                    <br />
                    Ou copie o código abaixo e cole no app (PIX Copia e Cola).
                  </div>

                  <div style={{ width: "100%", background: "#FAFAFA", border: "1px solid #eee", borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.6, color: "#888", textTransform: "uppercase" }}>PIX Copia e Cola</div>
                    <div
                      style={{
                        fontFamily: "ui-monospace, SFMono-Regular, monospace",
                        fontSize: 12,
                        wordBreak: "break-all",
                        background: "white",
                        border: "1px dashed #ddd",
                        borderRadius: 8,
                        padding: 10,
                        maxHeight: 96,
                        overflow: "auto",
                      }}
                    >
                      {state.copyPaste}
                    </div>
                    <button
                      onClick={() => copyToClipboard(state.copyPaste)}
                      style={{
                        height: 40,
                        borderRadius: 10,
                        border: "1px solid var(--color-primary)",
                        background: "white",
                        color: "var(--color-primary)",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Copiar código PIX
                    </button>
                    <div id="bp-copy-feedback" style={{ fontSize: 12, color: "#52c41a", textAlign: "center", minHeight: 16 }} />
                  </div>

                  {state.expiresAt && (
                    <div style={{ fontSize: 12, color: "#888" }}>Expira em: {new Date(state.expiresAt).toLocaleString("pt-BR")}</div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-primary)", fontWeight: 600 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 999, background: "#52c41a", display: "inline-block", animation: "pulse 1.2s infinite" }} />
                    Aguardando pagamento… verificação automática a cada 3s
                  </div>
                  <style>{`@keyframes pulse{0%{opacity:1}50%{opacity:0.35}100%{opacity:1}}`}</style>

                  {apiError && <div style={{ width: "100%", background: "#FFF1F0", border: "1px solid #FFA39E", color: "#A8071A", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>{apiError}</div>}

                  <div style={{ fontSize: 11, color: "#999", textAlign: "center" }}>ID: {state.tx.id} • Valor: {amountBRL}</div>
                </div>
              )}

              {state.step === "success" && (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: 48 }}>✅</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#0B7A0B", marginTop: 8 }}>Pagamento confirmado!</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>Redirecionando para o obrigado...</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </CheckoutCtx.Provider>
  );
}

// Pequeno hook global para UTM — use no layout
export function BravoUtmInit() {
  useEffect(() => {
    captureUtmOnLoad();
  }, []);
  return null;
}
