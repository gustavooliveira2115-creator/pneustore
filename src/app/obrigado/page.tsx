"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { onlyDigits, isValidCPF, isValidEmail, formatCPF } from "@/lib/validators";

function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

function ObrigadoInner() {
  const params = useSearchParams();
  const tx = params.get("tx");
  const method = params.get("method") || "pix";

  const [hasIdent, setHasIdent] = useState<boolean | null>(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const cRaw = localStorage.getItem("checkout_cliente");
      if (cRaw) {
        const c = JSON.parse(cRaw);
        // considera identificação válida se tem nome+cpf+telefone+email reais (não placeholder)
        const isPlaceholder = c.email?.includes("placeholder.pneustore");
        if (c.nome && c.cpf && c.email && !isPlaceholder && c.telefone) {
          setHasIdent(true);
          return;
        }
        // preenche form com o que tiver
        setNome(c.nome || "");
        setEmail(isPlaceholder ? "" : c.email || "");
        setCpf(c.cpf || "");
        setTelefone(c.telefone || "");
      }
      setHasIdent(false);
    } catch {
      setHasIdent(false);
    }
  }, []);

  const handleSave = () => {
    const errs: Record<string, string> = {};
    if (!nome.trim() || nome.trim().length < 3) errs.nome = "Informe nome completo";
    if (!isValidEmail(email)) errs.email = "E-mail inválido";
    if (!isValidCPF(cpf)) errs.cpf = "CPF inválido";
    const phoneDigits = onlyDigits(telefone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11) errs.telefone = "Telefone inválido";
    if (!lgpd) errs.lgpd = "Aceite a Política de Privacidade";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSaving(true);
    const c = {
      tipo: "PF",
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      cpf: maskCPF(cpf),
      telefone: maskPhone(telefone),
      promoEmail: true,
      promoWhatsapp: true,
      lgpdConsent: true,
      lgpdConsentAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem("checkout_cliente", JSON.stringify(c));
      // atualiza backend para vincular ao pedido
      fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: c.nome,
          email: c.email,
          telefone: onlyDigits(c.telefone),
          cpf: onlyDigits(c.cpf),
          tipo: c.tipo,
          lgpdConsent: true,
        }),
      }).catch(() => {});
      // se tem endereço, atualiza abandoned também
      try {
        const eRaw = localStorage.getItem("checkout_endereco");
        const endereco = eRaw ? JSON.parse(eRaw) : null;
        const utm = (() => { try { return JSON.parse(localStorage.getItem("utm_params") || "null"); } catch { return null; } })();
        fetch("/api/customers/abandoned", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cliente: c, endereco, cart: null, lgpdConsent: true, utm }),
        }).catch(() => {});
      } catch {}
    } catch {}
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setHasIdent(true);
    }, 600);
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F9F7FF", padding: 16 }}>
      <div style={{ maxWidth: 560, width: "100%", background: "white", borderRadius: 16, padding: 32, textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}>
        <div style={{ fontSize: 56 }}>🎉</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a7f37", margin: "12px 0 8px" }}>Pagamento confirmado!</h1>
        <p style={{ color: "#555", fontSize: 14, lineHeight: 1.6 }}>
          Seu pedido foi pago com sucesso via {method === "card" ? "Cartão de Crédito" : "PIX"} BravoPay. Você receberá a confirmação no e-mail informado.
          <br />
          Obrigado por comprar na <b>PneuStore</b>!
        </p>

        {tx && (
          <div style={{ marginTop: 16, background: "#FAFAFA", border: "1px solid #eee", borderRadius: 10, padding: 12, fontSize: 12, color: "#666" }}>
            ID da transação: <code style={{ fontWeight: 700 }}>{tx}</code>
          </div>
        )}

        {/* Identificação pós-compra - só aparece se ainda não preenchida */}
        {hasIdent === false && (
          <div style={{ marginTop: 20, textAlign: "left", background: "#fffbe6", border: "1px solid #ffe58f", borderRadius: 12, padding: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "#8c6d00", marginBottom: 4 }}>Complete sua identificação</h3>
            <p style={{ fontSize: 12, color: "#8c6d00", lineHeight: 1.5, marginBottom: 12 }}>
              Como solicitado, a identificação ficou para <b>após a compra ser finalizada</b>. Preencha agora para emitirmos a nota fiscal e liberarmos o envio. Antes de finalizar, apenas o endereço foi solicitado.
            </p>

            {!saved ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>Nome completo *</span>
                  <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" style={{ height: 40, borderRadius: 8, border: `1px solid ${errors.nome ? "#ff4d4f" : "#d9d9d9"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
                  {errors.nome && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{errors.nome}</span>}
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>E-mail *</span>
                  <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" style={{ height: 40, borderRadius: 8, border: `1px solid ${errors.email ? "#ff4d4f" : "#d9d9d9"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
                  {errors.email && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{errors.email}</span>}
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>CPF *</span>
                  <input value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00" inputMode="numeric" style={{ height: 40, borderRadius: 8, border: `1px solid ${errors.cpf ? "#ff4d4f" : "#d9d9d9"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
                  {errors.cpf && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{errors.cpf}</span>}
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700 }}>Telefone *</span>
                  <input value={telefone} onChange={(e) => setTelefone(maskPhone(e.target.value))} placeholder="(00) 00000-0000" inputMode="numeric" style={{ height: 40, borderRadius: 8, border: `1px solid ${errors.telefone ? "#ff4d4f" : "#d9d9d9"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
                  {errors.telefone && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{errors.telefone}</span>}
                </label>
                <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11, cursor: "pointer", lineHeight: 1.4 }}>
                  <input type="checkbox" checked={lgpd} onChange={(e) => setLgpd(e.target.checked)} style={{ marginTop: 2, accentColor: "#4e008e" }} />
                  <span>Li e aceito a <a href="/politica-de-privacidade" target="_blank" style={{ color: "#4e008e", textDecoration: "underline", fontWeight: 700 }}>Política de Privacidade</a> *</span>
                </label>
                {errors.lgpd && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{errors.lgpd}</span>}
                <button
                  onClick={handleSave}
                  disabled={saving}
                  style={{ height: 44, borderRadius: 999, background: "#4e008e", color: "white", border: "none", fontWeight: 800, fontSize: 13, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}
                >
                  {saving ? "Salvando..." : "Salvar identificação e liberar envio"}
                </button>
              </div>
            ) : (
              <div style={{ background: "#e8f5e9", border: "1px solid #b7eb8f", borderRadius: 8, padding: 12, textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#2e7d32" }}>✓ Identificação salva com sucesso!</p>
                <p style={{ fontSize: 11, color: "#555", marginTop: 4 }}>Seu pedido será enviado para o endereço cadastrado. Você receberá a nota fiscal no e-mail informado.</p>
              </div>
            )}
          </div>
        )}

        {hasIdent === true && (
          <div style={{ marginTop: 16, background: "#e8f5e9", border: "1px solid #b7eb8f", borderRadius: 10, padding: 12, fontSize: 12, color: "#2e7d32" }}>
            ✓ Identificação já registrada — seu pedido seguirá para separação e envio.
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
            href="/meus-pedidos"
            style={{ height: 44, padding: "0 20px", borderRadius: 10, border: "1px solid #ddd", color: "#333", display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontWeight: 600 }}
          >
            Meus pedidos
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
