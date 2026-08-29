import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Política de Troca e Devolução | PneuStore",
  description: "Regras de troca e devolução da PneuStore - arrependimento 7 dias, defeitos, logística reversa e reembolso.",
};

export default function TrocaDevolucaoPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>
      <Header />
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 20px", fontSize: 13, color: "var(--color-textSecondary)" }}>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#999" }}>/</span>
          <span style={{ color: "#666" }}>Política de troca e devolução</span>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 48px" }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", padding: "32px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>Política de Troca e Devolução</h1>
          <p style={{ fontSize: 12, color: "#8c8c8c", margin: "0 0 24px" }}>CDC art. 49 e art. 18 • Válido para compras em www.pneustore.com.br • CPX Distribuidora S/A</p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            <span style={{ background: "#f6ffed", border: "1px solid #b7eb8f", color: "#389e0d", padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>✓ 7 dias arrependimento</span>
            <span style={{ background: "#fff7e6", border: "1px solid #ffe58f", color: "#ad6800", padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>30 dias para defeito aparente</span>
            <span style={{ background: "#f6f5ff", border: "1px solid #e8e0ff", color: "#4c0082", padding: "6px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700 }}>Coleta sem custo quando elegível</span>
          </div>

          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 24 }}>
            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>1. Arrependimento — 7 dias corridos</h2>
              <p>
                Para compras online você pode desistir em <strong>7 dias corridos</strong> após o recebimento (CDC art. 49), sem necessidade de justificativa, desde que o pneu <strong>não tenha sido montado, rodado ou avariado</strong> e esteja com <strong>embalagem e etiqueta originais</strong> e NF-e.
              </p>
              <p>Como solicitar: WhatsApp <strong>(11) 94771-0544</strong> ou <a href="mailto:trocas@pneustore.com.br" style={{ color: "#4c0082", fontWeight: 700 }}>trocas@pneustore.com.br</a> com pedido e fotos. Após deferimento, geramos código de postagem/coleta.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>2. Defeito aparente e vício oculto</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li><strong>Defeito aparente</strong> (avaria de transporte, modelo divergente): comunique em até <strong>7 dias</strong> do recebimento com fotos da embalagem/pneu.</li>
                <li><strong>Vício oculto / defeito fabril</strong>: segue a <Link href="/politica-de-garantia" style={{ color: "#4c0082", fontWeight: 700 }}>Política de Garantia</Link> (até 5 anos), com análise técnica em até 30 dias.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>3. Condições para troca/devolução</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Pneu sem montagem, sem rodagem, sem reparos e com DOT legível.</li>
                <li>Acompanhado de NF-e, manual/etiqueta e brindes quando houver.</li>
                <li>Embalagem original preferencialmente — se descartada, embale com proteção equivalente.</li>
                <li>Solicitação dentro do prazo e com fotos quando solicitado.</li>
              </ul>
              <div style={{ marginTop: 10, background: "#fff1f0", border: "1px solid #ffa39e", borderRadius: 8, padding: 12, fontSize: 12, color: "#a8071a" }}>
                <strong>Não aceitamos troca por:</strong> desgaste por mau uso (furos, cortes, buracos, pressão incorreta), TWI atingido, armazenamento inadequado ou montagem incorreta.
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>4. Como funciona a logística reversa</h2>
              <ol style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                <li><strong>Abertura:</strong> você abre chamado com fotos. Validamos elegibilidade em até 2 dias úteis.</li>
                <li><strong>Coleta:</strong> quando deferido, enviamos código de postagem (Correios/Jadlog) ou agendamos coleta. Você embala e despacha.</li>
                <li><strong>Conferência:</strong> ao receber, auditamos condição em até 5 dias úteis.</li>
                <li><strong>Solução:</strong> se procedente, você escolhe: <em>troca por mesmo modelo</em>, <em>crédito</em> ou <em>estorno</em> no mesmo meio de pagamento. Se improcedente, devolvemos o pneu sem custo adicional.</li>
              </ol>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>5. Prazos de reembolso</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li><strong>PIX:</strong> estorno em até 2 dias úteis após conferência.</li>
                <li><strong>Cartão:</strong> crédito em até 2 faturas (depende da administradora). O estorno pode aparecer como “ajuste”.</li>
                <li><strong>Boleto:</strong> depósito em conta em até 5 dias úteis.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>6. Trocas por medida ou arrependimento de tamanho</h2>
              <p>
                Se comprou medida errada e não montou, use o arrependimento de 7 dias. Se já montou, a troca segue regra de garantia apenas quando houver defeito fabril. Sempre confira a medida no manual/porta-malas: ex: <code>195/55R16</code> e no buscador da home <strong>Medida do pneu</strong>.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>7. Central de trocas</h2>
              <p>
                <strong>PneuStore — Trocas e Devoluções</strong><br />
                WhatsApp: <strong>(11) 94771-0544</strong> • E-mail: <a href="mailto:trocas@pneustore.com.br" style={{ color: "#4c0082", fontWeight: 700 }}>trocas@pneustore.com.br</a><br />
                Seg a sex 8h–18h • Tenha pedido, NF-e e fotos do DOT/defeito em mãos.
              </p>
              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a href="https://wa.me/5511947710544" target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", height: 40, padding: "0 20px", borderRadius: 8, background: "#25D366", color: "white", textDecoration: "none", fontWeight: 700, fontSize: 13, alignItems: "center" }}>Falar no WhatsApp</a>
                <Link href="/perguntas-frequentes" style={{ display: "inline-flex", height: 40, padding: "0 20px", borderRadius: 8, background: "white", color: "#4c0082", border: "1px solid #4c0082", textDecoration: "none", fontWeight: 700, fontSize: 13, alignItems: "center" }}>Ver FAQ</Link>
              </div>
            </section>

            <div style={{ padding: 14, background: "#f6f5ff", border: "1px solid #e8e0ff", borderRadius: 10, fontSize: 11, color: "#4c0082", lineHeight: 1.6 }}>
              <strong>Transparência:</strong> esta política segue o CDC e as condições de garantia dos fabricantes. O consumidor pode acionar o Procon local em caso de dúvidas. Atualizada em 29/08/2025.
            </div>
          </div>
        </div>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Link href="/" style={{ fontSize: 13, color: "#4c0082", textDecoration: "underline", fontWeight: 600 }}>← Voltar para a loja</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
