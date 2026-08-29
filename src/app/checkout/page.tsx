"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { useCart } from "@/components/CartContext";
import { onlyDigits, isValidCPF, isValidEmail, formatCPF } from "@/lib/validators";
import { BRAVOPAY_PRODUCT_ID } from "@/lib/bravopay-config";
import { getUtmForApi } from "@/lib/utm";
import Link from "next/link";

// helpers masks
function maskCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}
function maskCEP(v: string) {
  const d = onlyDigits(v).slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

type Cliente = {
  tipo: "PF" | "PJ";
  email: string;
  promoEmail: boolean;
  nome: string;
  cpf: string;
  telefone: string;
  promoWhatsapp: boolean;
};

type Endereco = {
  nomeLocal: string;
  destinatario: string;
  cep: string;
  rua: string;
  numero: string;
  semNumero: boolean;
  complemento: string;
  referencia: string;
  bairro: string;
  estado: string;
  cidade: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalCents, origTotalCents, discountCents } = useCart();
  const [step, setStep] = useState<"identificacao" | "endereco" | "resumo">("identificacao");
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [endereco, setEndereco] = useState<Endereco | null>(null);
  const [cupom, setCupom] = useState("");
  const [cupomMsg, setCupomMsg] = useState<string | null>(null);
  const [identErrors, setIdentErrors] = useState<Record<string, string>>({});
  const [endErrors, setEndErrors] = useState<Record<string, string>>({});
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const INSTALACAO_CENTS = 5000;
  const [instalacao, setInstalacao] = useState(false);

  // form states for identification modal
  const [tipo, setTipo] = useState<"PF" | "PJ">("PF");
  const [email, setEmail] = useState("");
  const [promoEmail, setPromoEmail] = useState(true);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [promoWhatsapp, setPromoWhatsapp] = useState(true);

  // endereco form
  const [endNomeLocal, setEndNomeLocal] = useState("");
  const [endDestinatario, setEndDestinatario] = useState("");
  const [endCep, setEndCep] = useState("");
  const [endRua, setEndRua] = useState("");
  const [endNumero, setEndNumero] = useState("");
  const [endSemNumero, setEndSemNumero] = useState(false);
  const [endComplemento, setEndComplemento] = useState("");
  const [endReferencia, setEndReferencia] = useState("");
  const [endBairro, setEndBairro] = useState("");
  const [endEstado, setEndEstado] = useState("");
  const [endCidade, setEndCidade] = useState("");

  // hydrate cliente/endereco from localStorage + check cart
  useEffect(() => {
    try {
      const cRaw = localStorage.getItem("checkout_cliente");
      if (cRaw) {
        const c = JSON.parse(cRaw);
        setCliente(c);
        setEmail(c.email || "");
        setNome(c.nome || "");
        setCpf(c.cpf ? maskCPF(c.cpf) : "");
        setTelefone(c.telefone ? maskPhone(c.telefone) : "");
        setTipo(c.tipo || "PF");
      }
      const eRaw = localStorage.getItem("checkout_endereco");
      if (eRaw) {
        const e = JSON.parse(eRaw);
        setEndereco(e);
        setEndNomeLocal(e.nomeLocal || "");
        setEndDestinatario(e.destinatario || "");
        setEndCep(e.cep ? maskCEP(e.cep) : "");
        setEndRua(e.rua || "");
        setEndNumero(e.numero || "");
        setEndSemNumero(e.semNumero || false);
        setEndComplemento(e.complemento || "");
        setEndReferencia(e.referencia || "");
        setEndBairro(e.bairro || "");
        setEndEstado(e.estado || "");
        setEndCidade(e.cidade || "");
      }
      // if already have both, go to resumo
      if (cRaw && eRaw) setStep("resumo");
    } catch {}
  }, []);

  useEffect(() => {
    if (endSemNumero) setEndNumero("S/N");
    else if (endNumero === "S/N") setEndNumero("");
  }, [endSemNumero]);

  // consultar CEP via ViaCEP blur
  const consultarCEP = async (cepVal: string) => {
    const digits = onlyDigits(cepVal);
    if (digits.length !== 8) return;
    try {
      const r = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await r.json();
      if (!data.erro) {
        setEndRua(data.logradouro || "");
        setEndBairro(data.bairro || "");
        setEndCidade(data.localidade || "");
        setEndEstado(data.uf || "");
      }
    } catch {}
  };

  const handleIdentSubmit = () => {
    const errs: Record<string, string> = {};
    if (!isValidEmail(email)) errs.email = "E-mail inválido";
    if (!nome.trim() || nome.trim().length < 3) errs.nome = "Informe nome completo";
    if (!isValidCPF(cpf)) errs.cpf = "CPF inválido";
    const phoneDigits = onlyDigits(telefone);
    if (phoneDigits.length < 10 || phoneDigits.length > 11) errs.telefone = "Telefone inválido";
    if (Object.keys(errs).length) {
      setIdentErrors(errs);
      return;
    }
    setIdentErrors({});
    const c: Cliente = { tipo, email: email.trim().toLowerCase(), promoEmail, nome: nome.trim(), cpf: maskCPF(cpf), telefone: maskPhone(telefone), promoWhatsapp };
    setCliente(c);
    try {
      localStorage.setItem("checkout_cliente", JSON.stringify(c));
    } catch {}
    setStep("endereco");
  };

  const handleEnderecoConfirm = () => {
    const errs: Record<string, string> = {};
    if (!endNomeLocal.trim()) errs.nomeLocal = "Obrigatório";
    if (!endDestinatario.trim()) errs.destinatario = "Obrigatório";
    if (onlyDigits(endCep).length !== 8) errs.cep = "CEP inválido";
    if (!endRua.trim()) errs.rua = "Obrigatório";
    if (!endSemNumero && !endNumero.trim()) errs.numero = "Obrigatório";
    if (!endBairro.trim()) errs.bairro = "Obrigatório";
    if (!endEstado.trim()) errs.estado = "Obrigatório";
    if (!endCidade.trim()) errs.cidade = "Obrigatório";
    if (Object.keys(errs).length) {
      setEndErrors(errs);
      return;
    }
    setEndErrors({});
    const e: Endereco = {
      nomeLocal: endNomeLocal.trim(),
      destinatario: endDestinatario.trim(),
      cep: maskCEP(endCep),
      rua: endRua.trim(),
      numero: endSemNumero ? "S/N" : endNumero.trim(),
      semNumero: endSemNumero,
      complemento: endComplemento.trim(),
      referencia: endReferencia.trim(),
      bairro: endBairro.trim(),
      estado: endEstado.trim().toUpperCase(),
      cidade: endCidade.trim(),
    };
    setEndereco(e);
    try {
      localStorage.setItem("checkout_endereco", JSON.stringify(e));
      // também mantém compatibilidade com modal CEP anterior
      localStorage.setItem("pneustore_cep", e.cep);
      localStorage.setItem("pneustore_logradouro", e.rua);
    } catch {}
    setStep("resumo");
  };

  const handleCupom = () => {
    if (!cupom.trim()) {
      setCupomMsg("Digite um cupom");
      return;
    }
    setCupomMsg("Cupom inválido ou expirado");
  };

  const handleContinuarPagamento = async () => {
    if (!cliente) {
      setStep("identificacao");
      return;
    }
    if (!endereco) {
      setStep("endereco");
      return;
    }
    if (items.length === 0) {
      setPayError("Seu carrinho está vazio");
      return;
    }
    setPayLoading(true);
    setPayError(null);
    try {
      const utm = getUtmForApi();
      const amountToPay = totalCents + (instalacao ? INSTALACAO_CENTS : 0);
      const itemsPayload = [
        ...items.map((it) => ({ name: it.name, quantity: it.quantity, amount_cents: it.priceCents })),
        ...(instalacao ? [{ name: "Serviço de Instalação - Montagem + Balanceamento", quantity: 1, amount_cents: INSTALACAO_CENTS }] : []),
      ];
      const payload: any = {
        amount_cents: amountToPay,
        method: "pix",
        customer: {
          name: cliente.nome,
          email: cliente.email,
          document: onlyDigits(cliente.cpf),
          phone: "+55" + onlyDigits(cliente.telefone),
        },
        shipping: {
          street: endereco.rua,
          number: endereco.numero,
          complement: endereco.complemento,
          neighborhood: endereco.bairro,
          city: endereco.cidade,
          state: endereco.estado,
          zipcode: onlyDigits(endereco.cep),
        },
        external_reference: `pneustore_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        items: itemsPayload,
        metadata: {
          instalacao: instalacao ? "sim" : "nao",
          instalacao_valor_cents: instalacao ? String(INSTALACAO_CENTS) : "0",
        },
        ...(utm ? { utm } : {}),
        ...(BRAVOPAY_PRODUCT_ID ? { product_id: BRAVOPAY_PRODUCT_ID } : {}),
      };
      const r = await fetch("/api/bravopay/create-transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || j?.message || j?.details?.message || `Erro ${r.status}`);
      const txId = j?.id || j?.transaction?.id || j?.data?.id;
      try {
        localStorage.setItem("last_tx", JSON.stringify(j));
        if (instalacao) localStorage.setItem("checkout_instalacao", "1");
        else localStorage.removeItem("checkout_instalacao");
      } catch {}
      // Novo fluxo: sempre vai para /pagamento para exibir QR Code PIX
      if (txId) {
        window.location.href = `/pagamento?tx=${encodeURIComponent(txId)}`;
      } else {
        throw new Error("Resposta do gateway sem ID de transação");
      }
    } catch (e: any) {
      setPayError(e?.message || "Erro ao processar pagamento");
    } finally {
      setPayLoading(false);
    }
  };

  const isCartEmpty = items.length === 0;
  const frete = 0; // estimado grátis para resumo (pode ser dinâmico futuro)
  const totalComFrete = totalCents + frete + (instalacao ? INSTALACAO_CENTS : 0);

function CheckoutHeader({ step }: { step: string }) {
  const steps = [
    { id: "carrinho", label: "Carrinho", active: true, done: true },
    { id: "entrega", label: "Entrega", active: step !== "resumo", done: step === "resumo" },
    { id: "pagamento", label: "Pagamento", active: step === "resumo", done: false },
  ];
  // entrega = identificacao + endereco, pagamento = resumo
  const isEntrega = step === "identificacao" || step === "endereco";
  const isPagamento = step === "resumo";
  return (
    <header style={{ background: "white", borderBottom: "1px solid #e5e5e5", position: "sticky", top: 0, zIndex: 30 }}>
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center" }}>
          <img src="/logo.png" alt="PneuStore" style={{ height: 28, width: "auto", objectFit: "contain" }} />
        </Link>
        <nav aria-label="Progresso do checkout" style={{ display: "flex", alignItems: "center", gap: 0, flex: 1, justifyContent: "center", maxWidth: 480 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 700, color: "#4e008e" }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#4e008e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>
              Carrinho
            </span>
            <span style={{ color: "#ccc", margin: "0 4px" }}>—</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                color: isEntrega ? "#4e008e" : isPagamento ? "#4e008e" : "#888",
                background: isEntrega ? "#f6f5ff" : "transparent",
                padding: isEntrega ? "4px 10px" : "4px 6px",
                borderRadius: 999,
                border: isEntrega ? "1px solid #e8e0ff" : "1px solid transparent",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: isEntrega ? "#4e008e" : isPagamento ? "#4e008e" : "#e5e5e5",
                  color: isEntrega || isPagamento ? "white" : "#888",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                }}
              >
                {isPagamento ? "✓" : "2"}
              </span>
              Entrega
            </span>
            <span style={{ color: "#ccc", margin: "0 4px" }}>—</span>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontWeight: 700,
                color: isPagamento ? "#4e008e" : "#999",
                background: isPagamento ? "#f6f5ff" : "transparent",
                padding: isPagamento ? "4px 10px" : "4px 6px",
                borderRadius: 999,
                border: isPagamento ? "1px solid #e8e0ff" : "1px solid transparent",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: isPagamento ? "#4e008e" : "#e5e5e5",
                  color: isPagamento ? "white" : "#888",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                }}
              >
                3
              </span>
              Pagamento
            </span>
          </div>
        </nav>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#2e7d32", fontWeight: 600, whiteSpace: "nowrap" }}>
          <span style={{ fontSize: 14 }}>🔒</span> Compra segura
        </div>
      </div>
    </header>
  );
}

  return (
    <div style={{ minHeight: "100vh", background: "#f5f5f5", fontFamily: "Arial, sans-serif" }}>
      <CheckoutHeader step={step} />

      {/* Conteúdo */}
      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 16px", display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* Caso carrinho vazio */}
        {isCartEmpty ? (
          <div style={{ width: "100%", background: "white", borderRadius: 12, padding: 40, textAlign: "center" }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Seu carrinho está vazio</h1>
            <p style={{ color: "#666", marginBottom: 20 }}>Adicione produtos para continuar para o checkout.</p>
            <button onClick={() => router.push("/")} style={{ background: "#4e008e", color: "white", border: "none", borderRadius: 999, padding: "12px 28px", fontWeight: 700, cursor: "pointer" }}>
              Voltar para a loja
            </button>
          </div>
        ) : (
          <>
            {/* Coluna esquerda */}
            <div style={{ flex: "1 1 700px", minWidth: 320, display: "flex", flexDirection: "column", gap: 16 }}>
              {/* Bloco Endereço de entrega */}
              {endereco && cliente ? (
                <div style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #eee", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 260px" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#4e008e", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>✓</span>
                      Endereço de entrega
                    </h3>
                    <p style={{ fontSize: 13, color: "#222", lineHeight: 1.6 }}>
                      <b>{endereco.nomeLocal}</b> — {endereco.destinatario}
                      <br />
                      {endereco.rua}, {endereco.numero} {endereco.complemento ? `- ${endereco.complemento}` : ""}
                      <br />
                      {endereco.bairro} — {endereco.cidade}/{endereco.estado} — CEP {endereco.cep}
                      {endereco.referencia ? <><br />Ref: {endereco.referencia}</> : null}
                    </p>
                    <button onClick={() => setStep("endereco")} style={{ marginTop: 8, background: "none", border: "none", color: "#4e008e", fontSize: 12, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                      Alterar
                    </button>
                  </div>
                  <div style={{ flex: "1 1 220px", background: "#fafafa", borderRadius: 8, padding: 12, border: "1px solid #eee" }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>Olá, {cliente.nome.split(" ")[0]}</p>
                    <p style={{ fontSize: 12, color: "#555", marginTop: 4, lineHeight: 1.6 }}>
                      {cliente.telefone}
                      <br />
                      {cliente.email}
                      <br />
                      CPF: {cliente.cpf}
                    </p>
                    <button onClick={() => setStep("identificacao")} style={{ marginTop: 8, background: "none", border: "none", color: "#4e008e", fontSize: 12, cursor: "pointer", textDecoration: "underline" }}>
                      Alterar dados
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ background: "white", borderRadius: 12, padding: 16, border: "1px dashed #ccc", textAlign: "center", color: "#888", fontSize: 13 }}>
                  Complete identificação e endereço para ver o resumo
                </div>
              )}

              {/* Lista produtos */}
              <div style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #eee" }}>
                <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 12 }}>Produtos</h3>
                {items.map((it) => (
                  <div key={it.slug} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <div style={{ width: 64, height: 64, background: "#fafafa", borderRadius: 8, border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: 6 }}>
                      <img src={it.image.startsWith("http") ? it.image : `/${it.image}`} alt={it.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4 }}>{it.name}</p>
                      <p style={{ fontSize: 11, color: "#999" }}>ID: {it.id} • Qtd: {it.quantity}</p>
                      <p style={{ fontSize: 12, color: "#4e008e", marginTop: 4 }}>Frete estimado: <b style={{ color: "#2e7d32" }}>Grátis</b></p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 13, fontWeight: 800 }}>{(it.priceCents * it.quantity / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                      <p style={{ fontSize: 11, color: "#888" }}>{it.quantity} x {(it.priceCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</p>
                    </div>
                  </div>
                ))}

                {/* Card instalação - R$ 50,00 */}
                <div
                  onClick={() => setInstalacao((v) => !v)}
                  style={{
                    marginTop: 16,
                    background: instalacao ? "#eef6ff" : "#f6f5ff",
                    border: `1px solid ${instalacao ? "#4e008e" : "#e8e0ff"}`,
                    borderRadius: 10,
                    padding: 14,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: "white", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔧</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700 }}>Adicione serviços de instalação para seu pneu</p>
                    <p style={{ fontSize: 11, color: "#666" }}>Montagem + Balanceamento em até 5.000 parceiros — <b style={{ color: instalacao ? "#4e008e" : "#222" }}>R$ 50,00</b></p>
                    {instalacao && <p style={{ fontSize: 11, color: "#2e7d32", marginTop: 2, fontWeight: 700 }}>✓ Adicionado ao pedido</p>}
                  </div>
                  <label
                    onClick={(e) => e.stopPropagation()}
                    style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}
                  >
                    <input type="checkbox" checked={instalacao} onChange={(e) => setInstalacao(e.target.checked)} style={{ width: 18, height: 18, accentColor: "#4e008e", cursor: "pointer" }} />
                    <span
                      style={{
                        background: instalacao ? "#4e008e" : "white",
                        border: `1px solid ${instalacao ? "#4e008e" : "#4e008e"}`,
                        color: instalacao ? "white" : "#4e008e",
                        borderRadius: 999,
                        padding: "8px 16px",
                        fontSize: 12,
                        fontWeight: 700,
                        display: "inline-block",
                        textAlign: "center",
                        minWidth: 92,
                      }}
                    >
                      {instalacao ? "Remover" : "Adicionar"}
                    </span>
                  </label>
                </div>
                {/* REMOVIDO: PNEUSTORE Protect! — não renderiza */}
              </div>
            </div>

            {/* Painel lateral resumo */}
            <div style={{ width: 360, maxWidth: "100%", flex: "0 0 360px", background: "white", borderRadius: 12, border: "1px solid #eee", padding: 16, position: "sticky", top: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}>Resumo do pedido</h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} itens)</span>
                  <span style={{ fontWeight: 600 }}>{(origTotalCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                {discountCents > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#2e7d32" }}>
                    <span>Desconto Total</span>
                    <span style={{ fontWeight: 700 }}>- {(discountCents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#666" }}>Frete</span>
                  <span style={{ fontWeight: 600, color: "#2e7d32" }}>Grátis</span>
                </div>
                {instalacao && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#4e008e" }}>
                    <span>Instalação (montagem + balanceamento)</span>
                    <span style={{ fontWeight: 700 }}>+ {(INSTALACAO_CENTS / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                )}
                <div style={{ height: 1, background: "#eee", margin: "8px 0" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 15 }}>Total no PIX</span>
                  <span style={{ fontWeight: 800, fontSize: 20, color: "#4e008e" }}>{(totalComFrete / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
                <p style={{ fontSize: 11, color: "#888", textAlign: "right", marginTop: -4 }}>ou 10x de {(totalComFrete / 10 / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} sem juros</p>
              </div>

              {/* Cupom */}
              <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
                <input
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  placeholder="Cupom de desconto"
                  style={{ flex: 1, height: 40, border: "1px solid #d9d9d9", borderRadius: 8, padding: "0 12px", fontSize: 13, outline: "none" }}
                />
                <button
                  onClick={handleCupom}
                  style={{ height: 40, padding: "0 16px", borderRadius: 8, border: "1px solid #4e008e", background: "white", color: "#4e008e", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  Enviar
                </button>
              </div>
              {cupomMsg && <p style={{ fontSize: 11, color: "#a8071a", marginTop: 6 }}>{cupomMsg}</p>}

              {payError && <div style={{ marginTop: 12, background: "#fff1f0", border: "1px solid #ffa39e", color: "#a8071a", borderRadius: 8, padding: "8px 10px", fontSize: 12 }}>{payError}</div>}

              {/* Botão principal CONTINUAR - destaque */}
              <button
                onClick={handleContinuarPagamento}
                disabled={payLoading || isCartEmpty}
                style={{
                  marginTop: 16,
                  width: "100%",
                  height: 56,
                  borderRadius: 999,
                  background: "#4e008e",
                  color: "white",
                  border: "none",
                  fontWeight: 800,
                  fontSize: 16,
                  letterSpacing: 0.3,
                  cursor: payLoading ? "not-allowed" : "pointer",
                  opacity: payLoading ? 0.7 : 1,
                  boxShadow: "0 8px 24px rgba(78,0,142,0.28)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {payLoading ? "Processando..." : "CONTINUAR"}
              </button>
              <p style={{ fontSize: 11, color: "#888", textAlign: "center", marginTop: 8, lineHeight: 1.4 }}>Você verá o QR Code PIX na próxima tela para finalizar o pagamento.</p>
            </div>
          </>
        )}
      </main>

      <Footer />

      {/* MODAL IDENTIFICAÇÃO */}
      {step === "identificacao" && !isCartEmpty && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => router.push("/")} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 520, maxHeight: "90dvh", overflowY: "auto", background: "white", borderRadius: 12, padding: 20, boxShadow: "0 16px 40px rgba(0,0,0,0.22)" }}>
            <button onClick={() => router.push("/")} aria-label="Fechar" style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", border: "1px solid #e5e5e5", background: "white", cursor: "pointer" }}>✕</button>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Identificação</h3>

            <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input type="radio" name="tipo" checked={tipo === "PF"} onChange={() => setTipo("PF")} /> Pessoa Física
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input type="radio" name="tipo" checked={tipo === "PJ"} onChange={() => setTipo("PJ")} /> Pessoa Jurídica
              </label>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>E-mail *</span>
                <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seuemail@dominio.com" style={{ height: 42, borderRadius: 8, border: `1px solid ${identErrors.email ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 14, outline: "none" }} />
                {identErrors.email && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{identErrors.email}</span>}
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={promoEmail} onChange={(e) => setPromoEmail(e.target.checked)} /> Receber promoções e notificações via E-mail
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Nome *</span>
                <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Insira seu nome completo" style={{ height: 42, borderRadius: 8, border: `1px solid ${identErrors.nome ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 14, outline: "none" }} />
                {identErrors.nome && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{identErrors.nome}</span>}
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>CPF *</span>
                <input value={cpf} onChange={(e) => setCpf(maskCPF(e.target.value))} placeholder="000.000.000-00" inputMode="numeric" maxLength={14} style={{ height: 42, borderRadius: 8, border: `1px solid ${identErrors.cpf ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 14, outline: "none" }} />
                {identErrors.cpf && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{identErrors.cpf}</span>}
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 700 }}>Telefone *</span>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value="+55" readOnly style={{ width: 64, height: 42, borderRadius: 8, border: "1px solid #ccc", background: "#f8f8f8", textAlign: "center", fontSize: 13, flexShrink: 0 }} />
                  <input value={telefone} onChange={(e) => setTelefone(maskPhone(e.target.value))} placeholder="(00) 00000-0000" inputMode="numeric" maxLength={15} style={{ flex: 1, height: 42, borderRadius: 8, border: `1px solid ${identErrors.telefone ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 14, outline: "none" }} />
                </div>
                {identErrors.telefone && <span style={{ color: "#ff4d4f", fontSize: 11 }}>{identErrors.telefone}</span>}
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={promoWhatsapp} onChange={(e) => setPromoWhatsapp(e.target.checked)} /> Receber promoções e notificações via WhatsApp
              </label>

              <button onClick={handleIdentSubmit} style={{ width: "100%", height: 44, borderRadius: 8, background: "#4e008e", color: "white", border: "none", fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 4 }}>
                Continuar para o endereço
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ENDEREÇO */}
      {step === "endereco" && (
        <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div onClick={() => setStep("identificacao")} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }} />
          <div style={{ position: "relative", width: "100%", maxWidth: 560, maxHeight: "90dvh", overflowY: "auto", background: "white", borderRadius: 12, padding: 20, boxShadow: "0 16px 40px rgba(0,0,0,0.22)" }}>
            <button onClick={() => setStep("identificacao")} aria-label="Fechar" style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", border: "1px solid #e5e5e5", background: "white", cursor: "pointer" }}>✕</button>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Adicionar endereço</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: "#d93025" }}>*</span> Nome do endereço</span>
                <input value={endNomeLocal} onChange={(e) => setEndNomeLocal(e.target.value)} placeholder="Ex: Casa, Trabalho" style={{ height: 40, borderRadius: 8, border: `1px solid ${endErrors.nomeLocal ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: "#d93025" }}>*</span> Nome do destinatário</span>
                <input value={endDestinatario} onChange={(e) => setEndDestinatario(e.target.value)} placeholder="Nome do destinatário" style={{ height: 40, borderRadius: 8, border: `1px solid ${endErrors.destinatario ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
              </label>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12, position: "relative" }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: "#d93025" }}>*</span> CEP</span>
              <input
                value={endCep}
                onChange={(e) => setEndCep(maskCEP(e.target.value))}
                onBlur={(e) => consultarCEP(e.target.value)}
                placeholder="00000-000"
                inputMode="numeric"
                maxLength={9}
                style={{ height: 40, borderRadius: 8, border: `1px solid ${endErrors.cep ? "#ff4d4f" : "#ccc"}`, padding: "0 90px 0 12px", fontSize: 13, outline: "none" }}
              />
              <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noopener noreferrer" style={{ position: "absolute", right: 10, top: 30, fontSize: 11, color: "#4e008e", textDecoration: "underline" }}>
                Não sei meu CEP
              </a>
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: "#d93025" }}>*</span> Endereço</span>
              <input value={endRua} onChange={(e) => setEndRua(e.target.value)} placeholder="Nome da rua" style={{ height: 40, borderRadius: 8, border: `1px solid ${endErrors.rua ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, marginTop: 12, alignItems: "end" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: "#d93025" }}>*</span> Número</span>
                <input value={endNumero} onChange={(e) => setEndNumero(e.target.value)} disabled={endSemNumero} placeholder="000" style={{ height: 40, borderRadius: 8, border: `1px solid ${endErrors.numero ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 13, outline: "none", background: endSemNumero ? "#f5f5f5" : "white" }} />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}>
                <input type="checkbox" checked={endSemNumero} onChange={(e) => setEndSemNumero(e.target.checked)} style={{ accentColor: "#4e008e" }} /> Sem número
              </label>
            </div>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>Complemento</span>
              <input value={endComplemento} onChange={(e) => setEndComplemento(e.target.value)} placeholder="Apartamento, bloco, etc." style={{ height: 40, borderRadius: 8, border: "1px solid #ccc", padding: "0 12px", fontSize: 13, outline: "none" }} />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}>Ponto de referência</span>
              <input value={endReferencia} onChange={(e) => setEndReferencia(e.target.value)} placeholder="Próximo ao mercado, etc." style={{ height: 40, borderRadius: 8, border: "1px solid #ccc", padding: "0 12px", fontSize: 13, outline: "none" }} />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: "#d93025" }}>*</span> Bairro</span>
              <input value={endBairro} onChange={(e) => setEndBairro(e.target.value)} placeholder="Bairro" style={{ height: 40, borderRadius: 8, border: `1px solid ${endErrors.bairro ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: "#d93025" }}>*</span> Estado</span>
                <input value={endEstado} onChange={(e) => setEndEstado(e.target.value)} placeholder="UF" maxLength={2} style={{ height: 40, borderRadius: 8, border: `1px solid ${endErrors.estado ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 13, outline: "none", textTransform: "uppercase" }} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 700 }}><span style={{ color: "#d93025" }}>*</span> Cidade</span>
                <input value={endCidade} onChange={(e) => setEndCidade(e.target.value)} placeholder="Cidade" style={{ height: 40, borderRadius: 8, border: `1px solid ${endErrors.cidade ? "#ff4d4f" : "#ccc"}`, padding: "0 12px", fontSize: 13, outline: "none" }} />
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 20 }}>
              <button onClick={() => setStep("resumo")} style={{ height: 40, padding: "0 20px", borderRadius: 8, border: "1px solid #ccc", background: "white", color: "#555", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                Cancelar
              </button>
              <button onClick={handleEnderecoConfirm} style={{ height: 40, padding: "0 24px", borderRadius: 8, border: "none", background: "#4e008e", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
