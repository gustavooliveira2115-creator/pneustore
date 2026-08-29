"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type FAQ = { q: string; a: string };
type Category = { title: string; icon: string; faqs: FAQ[] };

const categories: Category[] = [
  {
    title: "Entregas",
    icon: "🚚",
    faqs: [
      { q: "Qual o prazo de entrega?", a: "O prazo varia por CEP e tipo de produto. Você vê a estimativa no checkout ao informar o CEP e também no e-mail de confirmação com o código de rastreio. Pneus de passeio costumam ser 2 a 7 dias úteis nas capitais." },
      { q: "O frete é grátis?", a: "Temos frete grátis em pneus selecionados e em campanhas. O valor aparece automaticamente no carrinho e no checkout após informar o CEP." },
      { q: "Posso retirar em loja parceira?", a: "Sim. Na finalização, você pode escolher montagem em um dos 5.000+ parceiros. O pneu é enviado ao parceiro e você agenda a instalação." },
      { q: "Como rastreio meu pedido?", a: "Após o despacho você recebe e-mail/SMS com o link da transportadora. Também pode acompanhar em Meus pedidos." },
    ],
  },
  {
    title: "Pagamentos",
    icon: "💳",
    faqs: [
      { q: "Quais formas de pagamento aceitam?", a: "PIX (10% OFF e aprovação imediata via BravoPay), cartão em até 10x sem juros e boleto em campanhas selecionadas. Todo pagamento é processado em ambiente seguro." },
      { q: "O pagamento no PIX gera QR Code?", a: "Sim. Ao finalizar no checkout você é levado para /pagamento com QR Code e Pix Copia e Cola, vinculado à sua chave BravoPay. O status atualiza a cada 3 segundos." },
      { q: "Posso usar cupom?", a: "Sim. Aplique o cupom no resumo do checkout. Se inválido ou expirado, avisamos em vermelho." },
      { q: "Quando meu pagamento é confirmado?", a: "No PIX a confirmação é em segundos/minutos. No cartão, após captura e antifraude. Você vê o status em Meus pedidos." },
    ],
  },
  {
    title: "Trocas e Devoluções",
    icon: "↩️",
    faqs: [
      { q: "Qual o prazo para devolver?", a: "7 dias corridos após o recebimento para compras online (CDC art. 49), sem montagem/rodagem e com embalagem original. Veja detalhes em Política de Troca e Devolução." },
      { q: "Como solicito a troca?", a: "Fale no WhatsApp (11) 94771-0544 ou garantia@pneustore.com.br com pedido, NF-e e fotos. Enviamos código de coleta quando elegível." },
      { q: "Quem paga o frete da devolução?", a: "Em defeito fabril ou arrependimento dentro do prazo, a coleta é sem custo quando autorizada pela PneuStore." },
    ],
  },
  {
    title: "Garantia",
    icon: "🛡️",
    faqs: [
      { q: "Quantos anos de garantia?", a: "Até 5 anos de garantia de fábrica contra defeitos de fabricação, além de 90 dias legais (CDC). Veja a Política de Garantia." },
      { q: "O que não cobre?", a: "Mau uso (furos, cortes, impactos, pressão incorreta, sobrecarga), desgaste natural, armazenamento inadequado e acidentes." },
      { q: "Como aciono a garantia?", a: "Envie pedido, NF-e, DOT e fotos para garantia@pneustore.com.br ou WhatsApp (11) 94771-0544. Análise técnica em até 30 dias." },
    ],
  },
  {
    title: "Montagem e Serviços",
    icon: "🔧",
    faqs: [
      { q: "O serviço de instalação de R$ 50,00 o que inclui?", a: "Montagem + balanceamento em parceiro credenciado. Você marca no checkout e o valor é somado ao total." },
      { q: "Preciso levar algo ao parceiro?", a: "Leve documento e pedido/QR. O parceiro faz a conferência e instalação." },
    ],
  },
];

function Accordion({ category }: { category: Category }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", overflow: "hidden" }}>
      <div style={{ padding: "16px 20px", background: "#f6f5ff", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ width: 32, height: 32, borderRadius: 8, background: "#4c0082", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{category.icon}</span>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#4c0082", margin: 0 }}>{category.title}</h2>
      </div>
      <div>
        {category.faqs.map((f, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div key={f.q} style={{ borderBottom: idx === category.faqs.length - 1 ? "none" : "1px solid #f5f5f5" }}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                aria-expanded={isOpen}
                style={{
                  width: "100%", textAlign: "left", background: "white", border: "none",
                  padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
                  cursor: "pointer", gap: 12,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{f.q}</span>
                <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: "50%", background: isOpen ? "#4c0082" : "#f6f5ff", color: isOpen ? "white" : "#4c0082", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, border: "1px solid #e8e0ff" }}>{isOpen ? "−" : "+"}</span>
              </button>
              {isOpen && (
                <div style={{ padding: "0 20px 14px", fontSize: 13, color: "#555", lineHeight: 1.6, background: "#fcfcff" }}>
                  {f.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PerguntasFrequentesPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>
      <Header />
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 20px", fontSize: 13, color: "var(--color-textSecondary)" }}>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#999" }}>/</span>
          <span style={{ color: "#666" }}>Perguntas frequentes</span>
        </div>
      </div>
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 48px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>Perguntas Frequentes</h1>
        <p style={{ fontSize: 13, color: "#8c8c8c", margin: "0 0 24px" }}>Encontre respostas rápidas por categoria. Se precisar, fale no WhatsApp (11) 94771-0544.</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {categories.map((c) => (
            <Accordion key={c.title} category={c} />
          ))}
        </div>

        <div style={{ marginTop: 20, background: "white", border: "1px solid #f0f0f0", borderRadius: 12, padding: 16, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
          <p style={{ fontSize: 13, color: "#333", margin: 0 }}><strong>Não encontrou?</strong> Fale com nosso atendimento.</p>
          <a href="https://wa.me/5511947710544" target="_blank" rel="noopener noreferrer" style={{ height: 40, padding: "0 20px", borderRadius: 8, background: "#25D366", color: "white", display: "inline-flex", alignItems: "center", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>Falar no WhatsApp</a>
        </div>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/" style={{ fontSize: 13, color: "#4c0082", textDecoration: "underline", fontWeight: 600 }}>← Voltar para a loja</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
