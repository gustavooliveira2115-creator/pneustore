import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Política de Privacidade | PneuStore",
  description: "Política de Privacidade da PneuStore - Saiba como coletamos, usamos e protegemos seus dados pessoais conforme a LGPD.",
};

export default function PoliticaPrivacidadePage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>
      <Header />
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 20px", fontSize: 13, color: "var(--color-textSecondary)" }}>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#999" }}>/</span>
          <span style={{ color: "#666" }}>Política de privacidade</span>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 48px" }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", padding: "32px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>Política de Privacidade</h1>
          <p style={{ fontSize: 12, color: "#8c8c8c", margin: "0 0 24px" }}>Última atualização: 29 de agosto de 2025 • CPX Distribuidora S/A — PneuStore</p>

          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 24 }}>
            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>1. Introdução</h2>
              <p>
                A PneuStore, operada pela <strong>CPX Distribuidora S/A</strong> (CNPJ 10.158.356/0001-01), com sede na Rodovia SC 486, 800, Itaipava, Itajaí/SC, CEP 88316-001, valoriza a sua privacidade e está comprometida com a proteção dos seus dados pessoais, em conformidade com a <strong>Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)</strong> e demais legislações aplicáveis.
              </p>
              <p>Esta Política descreve como coletamos, utilizamos, compartilhamos, armazenamos e protegemos seus dados quando você navega, compra ou interage com nossos canais.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>2. Dados que coletamos</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li><strong>Identificação e contato:</strong> nome, CPF, e-mail, telefone, data de nascimento.</li>
                <li><strong>Endereço e entrega:</strong> CEP, logradouro, número, bairro, cidade, UF, complemento.</li>
                <li><strong>Pagamento:</strong> dados de transação (valor, método PIX/cartão), sem armazenamento de CVV. Processamento via gateway seguro BravoPay.</li>
                <li><strong>Navegação e dispositivo:</strong> IP, cookies, identificadores, páginas visitadas, UTM, carrinho e preferências.</li>
                <li><strong>Atendimento:</strong> histórico de chats, e-mails e gravações quando você entra em contato.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>3. Para quais finalidades usamos seus dados</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Processar pedidos, pagamentos, prevenção à fraude, emissão de NF-e e logística de entrega.</li>
                <li>Criar e autenticar conta, exibir histórico e recomendar produtos.</li>
                <li>Comunicações transacionais (confirmação, rastreio) e, com seu consentimento, ofertas por e-mail/WhatsApp/SMS.</li>
                <li>Melhorar navegação, personalizar vitrine, medir campanhas e gerar estatísticas anonimizadas.</li>
                <li>Cumprir obrigações legais, fiscais e atender solicitações de autoridades.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>4. Bases legais (LGPD)</h2>
              <p>Tratamos dados com base em: <strong>execução de contrato</strong> (compra e entrega), <strong>consentimento</strong> (marketing), <strong>legítimo interesse</strong> (melhorias, segurança e prevenção à fraude), <strong>cumprimento de obrigação legal</strong> e <strong>exercício regular de direitos</strong>.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>5. Compartilhamento</h2>
              <p>Podemos compartilhar dados com:</p>
              <ul style={{ margin: "6px 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Gateway de pagamento (BravoPay), transportadoras, parceiros de montagem e meios de pagamento.</li>
                <li>Plataforma de e-commerce, provedores de nuvem, analytics e atendimento, todos com contratos de confidencialidade.</li>
                <li>Autoridades, quando exigido por lei ou para proteção de direitos e segurança.</li>
              </ul>
              <p style={{ marginTop: 8, fontSize: 12, color: "#666", background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 8, padding: 12 }}>
                Nunca vendemos seus dados pessoais a terceiros.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>6. Cookies e tecnologias similares</h2>
              <p>
                Utilizamos cookies essenciais (carrinho, login, segurança), de desempenho (métricas de navegação) e de marketing (personalização de ofertas e remarketing). Você pode gerenciá-los no seu navegador, mas a desativação de cookies essenciais pode afetar funcionalidades como manter produtos no carrinho e finalizar a compra.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>7. Seus direitos (LGPD)</h2>
              <p>Você pode, a qualquer momento, solicitar:</p>
              <ul style={{ margin: "6px 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Confirmação e acesso aos dados, correção, anonimização, bloqueio ou eliminação de dados desnecessários.</li>
                <li>Portabilidade, informação sobre compartilhamentos e revogação do consentimento.</li>
                <li>Oposição a tratamento baseado em legítimo interesse e revisão de decisões automatizadas.</li>
              </ul>
              <p style={{ marginTop: 8 }}>
                Solicitações: <a href="mailto:privacidade@pneustore.com.br" style={{ color: "#4c0082", fontWeight: 700 }}>privacidade@pneustore.com.br</a> ou pelo WhatsApp <strong>(11) 94771-0544</strong>. Responderemos em até 15 dias.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>8. Segurança e retenção</h2>
              <p>
                Adotamos medidas técnicas e administrativas como criptografia em trânsito (TLS), controle de acesso, logs e monitoramento. Mantemos dados apenas pelo tempo necessário para cumprir finalidades legais, contratuais e de atendimento (ex: 5 anos para documentos fiscais).
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>9. Transferência internacional</h2>
              <p>Quando houver processamento fora do Brasil (ex: data centers em nuvem), garantimos nível adequado de proteção por meio de cláusulas contratuais e salvaguardas previstas na LGPD.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>10. Encarregado (DPO)</h2>
              <p>
                Encarregado: <strong>DPO PneuStore</strong> • E-mail: <a href="mailto:dpo@pneustore.com.br" style={{ color: "#4c0082", fontWeight: 700 }}>dpo@pneustore.com.br</a> • Endereço: Rodovia SC 486, 800 — Itaipava, Itajaí/SC.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>11. Alterações desta Política</h2>
              <p>Podemos atualizar esta Política para refletir melhorias ou exigências legais. A versão vigente será sempre publicada nesta página com a data de atualização no topo.</p>
            </section>

            <div style={{ marginTop: 8, padding: 16, background: "#f6f5ff", border: "1px solid #e8e0ff", borderRadius: 10, fontSize: 12, color: "#4c0082" }}>
              <strong>Dúvidas?</strong> Fale conosco em <Link href="/nossas-lojas" style={{ color: "#4c0082", fontWeight: 800 }}>Nossas lojas</Link> ou no WhatsApp (11) 94771-0544.
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
