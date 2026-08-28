"use client";

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { BRAVOPAY_PRODUCT_ID } from "@/lib/bravopay-config";
import { getUtmForApi, captureUtmOnLoad } from "@/lib/utm";
import { onlyDigits, isValidEmail } from "@/lib/validators";

// ── Tipos ────────────────────────────────────────────────────────────────
export type CheckoutProduct = {
  name: string;
  amount_cents: number;
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
  pix?: { copy_paste: string; expires_at?: string };
  amount_cents?: number;
};

type CheckoutState =
  | { step: "form" }
  | { step: "loading"; method: "pix" | "card" }
  | { step: "pix"; tx: TxResponse; copyPaste: string; expiresAt?: string }
  | { step: "card_success"; tx: TxResponse }
  | { step: "success"; txId: string };

type PaymentMethod = "pix" | "card";

// ── Helpers cartão ──────────────────────────────────────────────────────
function luhnValid(num: string): boolean {
  const d = onlyDigits(num);
  if (d.length < 13 || d.length > 19) return false;
  let sum = 0;
  let dbl = false;
  for (let i = d.length - 1; i >= 0; i--) {
    let v = parseInt(d[i], 10);
    if (dbl) {
      v *= 2;
      if (v > 9) v -= 9;
    }
    sum += v;
    dbl = !dbl;
  }
  return sum % 10 === 0;
}

function formatCardNumber(v: string): string {
  const d = onlyDigits(v).slice(0, 19);
  return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

function formatExpiry(v: string): string {
  const d = onlyDigits(v).slice(0, 4);
  if (d.length <= 2) return d;
  return d.slice(0, 2) + "/" + d.slice(2);
}

function isValidExpiry(v: string): boolean {
  const d = onlyDigits(v);
  if (d.length !== 4) return false;
  const mm = parseInt(d.slice(0, 2), 10);
  const yy = parseInt(d.slice(2), 10);
  if (mm < 1 || mm > 12) return false;
  const now = new Date();
  const curYY = now.getFullYear() % 100;
  const curMM = now.getMonth() + 1;
  // ano 2 dígitos -> 2000+yy
  if (yy < curYY) return false;
  if (yy === curYY && mm < curMM) return false;
  return true;
}

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
  const [method, setMethod] = useState<PaymentMethod>("pix");

  // form fields comuns - apenas nome e e-mail (telefone e CPF removidos a pedido)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // cartão
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [installments, setInstallments] = useState(1);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const pollingRef = useRef<number | null>(null);

  useEffect(() => {
    captureUtmOnLoad();
  }, []);

  const amountTotal = useMemo(() => {
    if (!current) return 0;
    const qty = current.quantity ?? current.product.quantity ?? 1;
    return current.product.amount_cents * qty;
  }, [current]);

  const amountBRL = useMemo(() => (amountTotal / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), [amountTotal]);
  const installmentValue = useMemo(() => (amountTotal / installments / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }), [amountTotal, installments]);

  function openCheckout(args: OpenArgs) {
    setCurrent(args);
    setState({ step: "form" });
    setMethod("pix");
    setApiError(null);
    setErrors({});
    setIsOpen(true);
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

  // polling PIX
  useEffect(() => {
    if (state.step !== "pix") return;
    const txId = state.tx.id;
    const tick = async () => {
      try {
        const r = await fetch(`/api/bravopay/status/${txId}`, { cache: "no-store" });
        const j = await r.json();
        const status: string = j?.status ?? j?.transaction?.status ?? "";
        if (status === "PAID" || status === "APPROVED") {
          if (pollingRef.current) window.clearInterval(pollingRef.current);
          pollingRef.current = null;
          setState({ step: "success", txId });
          setTimeout(() => {
            closeCheckout();
            window.location.href = `/obrigado?tx=${encodeURIComponent(txId)}&method=pix`;
          }, 800);
        }
        if (["EXPIRED", "FAILED", "CANCELED", "REFUNDED", "DECLINED"].includes(status)) {
          if (pollingRef.current) window.clearInterval(pollingRef.current);
          setApiError(`Transação ${status}. Tente novamente ou use outro método.`);
        }
      } catch {}
    };
    pollingRef.current = window.setInterval(tick, 3000);
    const t = window.setTimeout(tick, 2000);
    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current);
      pollingRef.current = null;
      window.clearTimeout(t);
    };
  }, [state]);

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

    const errs: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 3) errs.name = "Informe nome completo";
    if (!isValidEmail(email)) errs.email = "E-mail inválido";

    if (method === "card") {
      if (!luhnValid(cardNumber)) errs.cardNumber = "Número do cartão inválido";
      if (!isValidExpiry(cardExpiry)) errs.cardExpiry = "Validade inválida (MM/AA)";
      const cvvDigits = onlyDigits(cardCvv);
      if (cvvDigits.length < 3 || cvvDigits.length > 4) errs.cardCvv = "CVV inválido";
      if (!cardHolder.trim() || cardHolder.trim().length < 3) errs.cardHolder = "Nome impresso no cartão";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setState({ step: "loading", method });

    try {
      const utm = getUtmForApi();
      const baseCustomer: Record<string, string> = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      };

      // payload comum
      const payload: Record<string, unknown> = {
        amount_cents: amountTotal,
        customer: baseCustomer,
        external_reference: `pneustore_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        ...(utm ? { utm } : {}),
        ...(BRAVOPAY_PRODUCT_ID ? { product_id: BRAVOPAY_PRODUCT_ID } : {}),
      };

      if (method === "pix") {
        payload.method = "pix";
      } else {
        // CARTÃO: envia no formato que a BravoPay aceita. O gateway cai na mesma conta da API key.
        const expDigits = onlyDigits(cardExpiry); // MMYY
        payload.method = "card"; // também aceita "credit_card" em algumas contas — backend normaliza
        payload.installments = installments;
        // Envia objeto card completo — backend repassa 1:1 para BravoPay. Não logamos no frontend.
        payload.card = {
          number: onlyDigits(cardNumber),
          holder_name: cardHolder.trim(),
          exp_month: expDigits.slice(0, 2),
          exp_year: "20" + expDigits.slice(2),
          cvv: onlyDigits(cardCvv),
          // alguns gateways usam cvc em vez de cvv — enviamos ambos para compatibilidade
          cvc: onlyDigits(cardCvv),
        };
        // fallback top-level para gateways que esperam campos soltos
        payload.card_number = onlyDigits(cardNumber);
        payload.card_holder_name = cardHolder.trim();
        payload.card_exp_month = expDigits.slice(0, 2);
        payload.card_exp_year = "20" + expDigits.slice(2);
        payload.card_cvv = onlyDigits(cardCvv);
      }

      const r = await fetch("/api/bravopay/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();

      if (!r.ok) {
        const msg = j?.error || j?.message || j?.details?.message || `Erro ${r.status}`;
        throw new Error(typeof msg === "string" ? msg : JSON.stringify(msg));
      }

      if (method === "pix") {
        const tx: TxResponse = j;
        const copyPaste: string = j?.pix?.copy_paste || j?.copy_paste || j?.pix?.copyPaste || "";
        if (!copyPaste) throw new Error("PIX copy_paste não retornou. Verifique a API key.");
        setState({ step: "pix", tx, copyPaste, expiresAt: j?.pix?.expires_at });
      } else {
        // CARTÃO: resposta pode já vir PAID/APPROVED ou PENDING
        const status: string = j?.status ?? j?.transaction?.status ?? "PAID";
        if (["PAID", "APPROVED", "CONFIRMED"].includes(status)) {
          setState({ step: "card_success", tx: j as TxResponse });
          setTimeout(() => {
            closeCheckout();
            window.location.href = `/obrigado?tx=${encodeURIComponent((j as TxResponse).id)}&method=card`;
          }, 1200);
        } else if (["PENDING", "PROCESSING", "AUTHORIZED"].includes(status)) {
          // aguarda webhook + polling
          setState({ step: "card_success", tx: j as TxResponse });
          setTimeout(() => {
            closeCheckout();
            window.location.href = `/obrigado?tx=${encodeURIComponent((j as TxResponse).id)}&method=card&status=${status}`;
          }, 1200);
        } else {
          throw new Error(`Cartão retornou status ${status}. Verifique os dados ou tente outro cartão.`);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao criar transação";
      setApiError(msg);
      setState({ step: "form" });
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      const el = document.getElementById("bp-copy-feedback");
      if (el) {
        el.textContent = "Copiado!";
        setTimeout(() => (el.textContent = ""), 2000);
      }
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
  };

  const maxInstallments = 12;

  return (
    <CheckoutCtx.Provider value={{ openCheckout, closeCheckout, isOpen }}>
      {children}

      {isOpen && (
        <div
          aria-modal="true"
          role="dialog"
          aria-label="Checkout BravoPay"
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
              maxWidth: 580,
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
                padding: "14px 20px",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: "16px 16px 0 0",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--color-primary)" }}>
                  {state.step === "pix" ? "Pague com PIX" : state.step === "card_success" ? "Pagamento aprovado!" : state.step === "success" ? "Pagamento confirmado!" : "Finalizar compra"}
                </div>
                {current && !["success", "card_success"].includes(state.step) && (
                  <div style={{ fontSize: 12, color: "#666", marginTop: 2, lineHeight: 1.4 }}>
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
                <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
                      ⚠️ <b>UTMify:</b> sem <code>BRAVOPAY_PRODUCT_ID</code> a venda pode cair no produto fantasma. Configure em <code>src/lib/bravopay-config.ts</code>.
                    </div>
                  )}

                  {/* Abas método */}
                  <div style={{ display: "flex", gap: 8, background: "#f5f5f5", padding: 4, borderRadius: 12 }}>
                    <button
                      type="button"
                      onClick={() => setMethod("pix")}
                      style={{
                        flex: 1,
                        height: 40,
                        borderRadius: 8,
                        border: method === "pix" ? "1px solid var(--color-primary)" : "1px solid transparent",
                        background: method === "pix" ? "white" : "transparent",
                        color: method === "pix" ? "var(--color-primary)" : "#666",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <span style={{ fontSize: 16 }}>◈</span> PIX (10% OFF)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMethod("card")}
                      style={{
                        flex: 1,
                        height: 40,
                        borderRadius: 8,
                        border: method === "card" ? "1px solid var(--color-primary)" : "1px solid transparent",
                        background: method === "card" ? "white" : "transparent",
                        color: method === "card" ? "var(--color-primary)" : "#666",
                        fontWeight: 700,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      💳 Cartão de Crédito
                    </button>
                  </div>

                  {/* Campos cliente (comum) */}
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

                  {/* Campos cartão - só quando card */}
                  {method === "card" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, background: "#fafafa", border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--color-primary)" }}>Dados do cartão</div>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Número do cartão *</span>
                        <input
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          placeholder="0000 0000 0000 0000"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          style={{
                            height: 44,
                            borderRadius: 10,
                            border: `1px solid ${errors.cardNumber ? "#ff4d4f" : "#d9d9d9"}`,
                            padding: "0 12px",
                            fontSize: 14,
                            outline: "none",
                            background: "white",
                          }}
                        />
                        {errors.cardNumber && <span style={{ color: "#ff4d4f", fontSize: 12 }}>{errors.cardNumber}</span>}
                      </label>

                      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>Nome impresso no cartão *</span>
                        <input
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                          placeholder="JOAO SILVA"
                          autoComplete="cc-name"
                          style={{
                            height: 44,
                            borderRadius: 10,
                            border: `1px solid ${errors.cardHolder ? "#ff4d4f" : "#d9d9d9"}`,
                            padding: "0 12px",
                            fontSize: 14,
                            outline: "none",
                            background: "white",
                          }}
                        />
                        {errors.cardHolder && <span style={{ color: "#ff4d4f", fontSize: 12 }}>{errors.cardHolder}</span>}
                      </label>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1.2fr", gap: 10 }}>
                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>Validade *</span>
                          <input
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            placeholder="MM/AA"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            style={{
                              height: 44,
                              borderRadius: 10,
                              border: `1px solid ${errors.cardExpiry ? "#ff4d4f" : "#d9d9d9"}`,
                              padding: "0 12px",
                              fontSize: 14,
                              outline: "none",
                              background: "white",
                            }}
                          />
                          {errors.cardExpiry && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{errors.cardExpiry}</span>}
                        </label>

                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>CVV *</span>
                          <input
                            value={cardCvv}
                            onChange={(e) => setCardCvv(onlyDigits(e.target.value).slice(0, 4))}
                            placeholder="123"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            style={{
                              height: 44,
                              borderRadius: 10,
                              border: `1px solid ${errors.cardCvv ? "#ff4d4f" : "#d9d9d9"}`,
                              padding: "0 12px",
                              fontSize: 14,
                              outline: "none",
                              background: "white",
                            }}
                          />
                          {errors.cardCvv && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{errors.cardCvv}</span>}
                        </label>

                        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600 }}>Parcelas</span>
                          <select
                            value={installments}
                            onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                            style={{
                              height: 44,
                              borderRadius: 10,
                              border: "1px solid #d9d9d9",
                              padding: "0 10px",
                              fontSize: 13,
                              background: "white",
                              outline: "none",
                            }}
                          >
                            {Array.from({ length: maxInstallments }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n}>
                                {n}x de {(amountTotal / n / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                                {n === 1 ? " à vista" : ""}
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      <div style={{ fontSize: 11, color: "#888", background: "white", border: "1px dashed #ddd", borderRadius: 8, padding: "8px 10px" }}>
                        🔒 Dados criptografados. O valor cai direto no saldo da sua conta BravoPay (mesma API key). Valor total: <b>{amountBRL}</b> em {installments}x de {installmentValue}.
                      </div>
                    </div>
                  )}

                  <div style={{ background: "#F6F5FF", border: "1px solid #E8E0FF", borderRadius: 12, padding: 12, display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                    <span style={{ fontSize: 13, color: "#555" }}>{method === "pix" ? "Total no PIX" : `Total no cartão (${installments}x)`}</span>
                    <span style={{ fontWeight: 800, fontSize: 18, color: "var(--color-primary)" }}>{amountBRL}</span>
                  </div>

                  {apiError && (
                    <div style={{ background: "#FFF1F0", border: "1px solid #FFA39E", color: "#A8071A", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}>{apiError}</div>
                  )}

                  <button
                    type="submit"
                    style={{
                      marginTop: 2,
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
                    {method === "pix" ? "Gerar PIX agora →" : `Pagar ${amountBRL} no cartão →`}
                  </button>

                  <p style={{ fontSize: 11, color: "#888", textAlign: "center", lineHeight: 1.5, margin: 0 }}>
                    Pagamento 100% seguro via BravoPay • Valor cai no gateway da API cadastrada.<br />
                    {method === "pix" ? "Ao pagar você confirma o pedido automaticamente." : "Seu cartão não é armazenado."}
                  </p>
                </form>
              )}

              {state.step === "loading" && (
                <div style={{ padding: "32px 0", textAlign: "center" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #eee", borderTopColor: "var(--color-primary)", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
                  <div style={{ fontWeight: 700, color: "var(--color-primary)" }}>{state.method === "pix" ? "Gerando seu PIX..." : "Processando pagamento..."}</div>
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

              {state.step === "card_success" && (
                <div style={{ textAlign: "center", padding: "12px 0" }}>
                  <div style={{ fontSize: 48 }}>✅</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: "#0B7A0B", marginTop: 8 }}>Pagamento aprovado!</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>ID: {state.tx.id} • {amountBRL} em {installments}x</div>
                  <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Redirecionando para o obrigado...</div>
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

export function BravoUtmInit() {
  useEffect(() => {
    captureUtmOnLoad();
  }, []);
  return null;
}
