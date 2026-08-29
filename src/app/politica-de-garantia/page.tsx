import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Política de Garantia | PneuStore",
  description: "Política de Garantia PneuStore - 5 anos de garantia de fábrica, coberturas, exclusões e como acionar.",
};

export default function PoliticaGarantiaPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>
      <Header />
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 20px", fontSize: 13, color: "var(--color-textSecondary)" }}>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#999" }}>/</span>
          <span style={{ color: "#666" }}>Política de garantia</span>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 48px" }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", padding: "32px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>Política de Garantia</h1>
          <p style={{ fontSize: 12, color: "#8c8c8c", margin: "0 0 24px" }}>Garantia de fábrica de até 5 anos • Válida para todo o Brasil • CPX Distribuidora S/A</p>

          <div style={{ display: "flex", background: "linear-gradient(90deg, #4c0082, #6a2db8)", borderRadius: 10, padding: 16, color: "white", gap: 12, alignItems: "center", marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, margin: 0 }}>5 anos de garantia de fábrica</p>
              <p style={{ fontSize: 12, margin: "2px 0 0", opacity: 0.9 }}>Contra defeitos de fabricação em pneus novos, conforme condições desta política e do fabricante.</p>
            </div>
          </div>

          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 24 }}>
            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>1. Vigência e cobertura</h2>
              <p>
                A PneuStore assegura <strong>garantia contratual de até 5 (cinco) anos</strong> a contar da data de emissão da Nota Fiscal, contra defeitos de fabricação, em complemento à garantia legal de 90 dias (art. 26, CDC). A cobertura inclui falhas estruturais, descolamento de banda, bolhas por falha de vulcanização e empenamento comprovadamente fabril.
              </p>
              <ul style={{ margin: "8px 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Válida apenas para pneus <strong>novos, originais e com NF-e da PneuStore</strong>.</li>
                <li>O pneu deve ter sido utilizado dentro de suas especificações (carga, pressão, aro, veículo e montagem correta).</li>
                <li>A análise técnica é soberana e realizada por fabricante ou rede credenciada.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>2. O que não cobre (exclusões)</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Danos por mau uso: furos, cortes, impactos em buracos/guias, sobrecarga, pressão incorreta, rodagem com pneu murcho ou desalinhamento.</li>
                <li>Desgaste natural do TWI, frenagens bruscas, derrapagens, uso em competição, manobras agressivas ou off-road não previsto.</li>
                <li>Armazenamento inadequado, exposição a solventes/óleos, montagem por não credenciado ou com ferramentas inadequadas.</li>
                <li>Reparos, recapagens, carcaças com mais de um reparo, talão danificado ou DOT ilegível/adulterado.</li>
                <li>Avarias por acidente, colisão, vandalismo, fenômenos naturais ou mau acondicionamento pós-entrega.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>3. Como acionar a garantia</h2>
              <ol style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 8 }}>
                <li>
                  <strong>Contato inicial:</strong> fale com nosso atendimento via WhatsApp <strong>(11) 94771-0544</strong> ou e-mail <a href="mailto:garantia@pneustore.com.br" style={{ color: "#4c0082", fontWeight: 700 }}>garantia@pneustore.com.br</a>, informando nº do pedido, NF-e, DOT e fotos do defeito e da banda lateral.
                </li>
                <li>
                  <strong>Triagem:</strong> nossa equipe verifica NF-e, prazo e elegibilidade e orienta o envio ou encaminhamento à credenciada mais próxima.
                </li>
                <li>
                  <strong>Análise técnica:</strong> o pneu é periciado em até <strong>30 dias</strong> (CDC art. 18). Se constatado defeito fabril, realizamos troca por modelo igual ou, na indisponibilidade, por similar ou crédito/estorno proporcional.
                </li>
                <li>
                  <strong>Desconto proporcional:</strong> em caso de uso parcial, o crédito considera o desgaste (sulco remanescente) conforme laudo. Ex: 50% de vida útil → crédito de 50% sobre valor pago.
                </li>
              </ol>
              <div style={{ marginTop: 12, background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 8, padding: 12, fontSize: 12, color: "#555" }}>
                <strong>Documentos necessários:</strong> NF-e (ou pedido + CPF), fotos nítidas do DOT (semana/ano), lateral interna/externa e do defeito relatado. Sem DOT legível não é possível analisar.
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>4. Prazos</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li><strong>Reclamação:</strong> em até 5 anos da NF-e, observado o início do defeito.</li>
                <li><strong>Análise:</strong> até 30 dias corridos após recebimento na credenciada.</li>
                <li><strong>Troca/estorno:</strong> em até 7 dias úteis após laudo procedente.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>5. Montagem e cuidados para manter a garantia</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Calibre semanalmente a frio, conforme manual do veículo; faça rodízio, alinhamento e balanceamento a cada 10.000 km ou quando houver vibração/desgaste irregular.</li>
                <li>Respeite índice de carga/velocidade e medida homologada para o veículo.</li>
                <li>Prefira montagem em rede credenciada PneuStore (5.000+ parceiros) com nota de serviço — isso acelera a análise.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>6. Trocas por arrependimento (CDC art. 49)</h2>
              <p>
                Para compras online, você tem <strong>7 dias corridos</strong> após o recebimento para desistir, desde que o pneu não tenha sido montado/rodado e esteja com embalagem e etiqueta originais. Contate o atendimento para gerar logística reversa sem custo quando elegível.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>7. Canal de atendimento</h2>
              <p>
                <strong>Central de Relacionamento PneuStore</strong><br />
                WhatsApp: <strong>(11) 94771-0544</strong> • E-mail garantia: <a href="mailto:garantia@pneustore.com.br" style={{ color: "#4c0082", fontWeight: 700 }}>garantia@pneustore.com.br</a>
                <br />
                Seg a sex 8h–18h • Sáb 8h–12h. Tenha em mãos pedido, NF-e e DOT.
              </p>
              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="https://wa.me/5511947710544" target="_blank" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "#25D366", color: "white", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                  Falar no WhatsApp
                </Link>
                <Link href="/todos" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: 40, padding: "0 20px", borderRadius: 8, background: "white", color: "#4c0082", border: "1px solid #4c0082", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
                  Ver pneus
                </Link>
              </div>
            </section>

            <div style={{ marginTop: 8, padding: 14, background: "#f6f5ff", border: "1px solid #e8e0ff", borderRadius: 10, fontSize: 11, color: "#4c0082", lineHeight: 1.6 }}>
              <strong>Transparência:</strong> esta política segue o Código de Defesa do Consumidor e as orientações dos fabricantes. Em caso de divergência, prevalece o laudo técnico do fabricante e a legislação vigente. Atualizada em 29/08/2025.
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
