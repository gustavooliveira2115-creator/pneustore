import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Informações Técnicas de Pneus | PneuStore",
  description: "Aprenda a ler medidas, índices de carga e velocidade, DOT, Inmetro, calibragem e cuidados com seus pneus.",
};

export default function InfoTecnicaPage() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", background: "#f9f9f9" }}>
      <Header />
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 20px", fontSize: 13, color: "var(--color-textSecondary)" }}>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#999" }}>/</span>
          <span style={{ color: "#666" }}>Informações técnicas de pneus</span>
        </div>
      </div>

      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px 48px" }}>
        <div style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", padding: "32px 28px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a", margin: "0 0 8px" }}>Informações Técnicas de Pneus</h1>
          <p style={{ fontSize: 13, color: "#8c8c8c", margin: "0 0 24px" }}>Guia educativo — aprenda a escolher, ler e cuidar do seu pneu corretamente</p>

          <div style={{ background: "linear-gradient(135deg, #f6f5ff, #fff)", border: "1px solid #e8e0ff", borderRadius: 12, padding: 16, marginBottom: 24, display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background: "#4c0082", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📘</div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#4c0082", margin: 0 }}>Como ler: 205/55R16 91V</p>
              <p style={{ fontSize: 12, color: "#555", margin: "4px 0 0" }}><strong>205</strong> largura (mm) • <strong>55</strong> perfil (% da largura) • <strong>R</strong> radial • <strong>16</strong> aro (pol) • <strong>91V</strong> carga/velocidade</p>
            </div>
          </div>

          <div style={{ fontSize: 14, color: "#333", lineHeight: 1.75, display: "flex", flexDirection: "column", gap: 24 }}>
            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>1. Medida — Largura, Perfil e Aro</h2>
              <p>Exemplo <strong>195/55R16</strong>: 195 mm de largura, 55% de altura em relação à largura, construção radial e aro 16". Para caminhão `215/75R17.5` o aro é 17.5". Moto `90/90-18` usa traço em vez de R. Bicicleta `700x25` usa padrão X.</p>
              <div style={{ marginTop: 12, background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 8, padding: 12, fontSize: 12, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead><tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}><th style={{ padding: "6px 8px" }}>Medida</th><th style={{ padding: "6px 8px" }}>Uso típico</th></tr></thead>
                  <tbody>
                    <tr><td style={{ padding: "6px 8px" }}>175/70R13</td><td style={{ padding: "6px 8px" }}>Hatch compacto</td></tr>
                    <tr><td style={{ padding: "6px 8px" }}>195/55R16</td><td style={{ padding: "6px 8px" }}>Sedã médio</td></tr>
                    <tr><td style={{ padding: "6px 8px" }}>265/65R17</td><td style={{ padding: "6px 8px" }}>SUV / Picape</td></tr>
                    <tr><td style={{ padding: "6px 8px" }}>90/90-18</td><td style={{ padding: "6px 8px" }}>Moto street</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>2. Índice de carga e velocidade</h2>
              <p>O número após a medida (ex: <strong>91V</strong>) indica carga máxima (91 = 615 kg) e velocidade máxima (V = 240 km/h). Sempre respeite o índice homologado pelo fabricante do veículo. Índices comuns: 82 (475 kg), 91 (615 kg), 95 (690 kg). Velocidades: H 210, V 240, W 270 km/h.</p>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>3. Etiqueta Inmetro — rolagem, aderência e ruído</h2>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 140, background: "#f6f5ff", border: "1px solid #e8e0ff", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 11, color: "#4c0082", fontWeight: 700 }}>Resistência ao rolamento</span><br /><span style={{ fontSize: 20, fontWeight: 800 }}>A → E</span><br /><span style={{ fontSize: 11, color: "#666" }}>A = menor consumo</span>
                </div>
                <div style={{ flex: 1, minWidth: 140, background: "#f0fdf4", border: "1px solid #b7eb8f", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 11, color: "#389e0d", fontWeight: 700 }}>Aderência molhado</span><br /><span style={{ fontSize: 20, fontWeight: 800 }}>A → E</span><br /><span style={{ fontSize: 11, color: "#666" }}>A = frenagem curta</span>
                </div>
                <div style={{ flex: 1, minWidth: 140, background: "#fff7e6", border: "1px solid #ffe58f", borderRadius: 8, padding: 12, textAlign: "center" }}>
                  <span style={{ fontSize: 11, color: "#ad6800", fontWeight: 700 }}>Ruído externo</span><br /><span style={{ fontSize: 20, fontWeight: 800 }}>71 dB</span><br /><span style={{ fontSize: 11, color: "#666" }}>Ex: 70-75 dB</span>
                </div>
              </div>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>4. DOT — data de fabricação</h2>
              <p>Na lateral você vê <strong>DOT 3623</strong> = 36ª semana de 2023. Pneus têm garantia de 5 anos a partir da NF-e, mas recomenda-se instalar com DOT recente. Evite DOT &gt; 2 anos se puder escolher.</p>
              <div style={{ marginTop: 8, display: "inline-flex", background: "#1a1a1a", color: "white", padding: "6px 12px", borderRadius: 6, fontSize: 12, fontFamily: "monospace" }}>DOT ... 3623 → semana 36 de 2023</div>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>5. Pressão, rodízio e alinhamento</h2>
              <ul style={{ margin: "0 0 0 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>Calibre <strong>a frio</strong> semanalmente conforme manual (geralmente 30–36 PSI para passeio).</li>
                <li>Faça <strong>rodízio a cada 10.000 km</strong>, <strong>alinhamento e balanceamento</strong> a cada 10k ou ao sentir vibração/desgaste irregular.</li>
                <li>Verifique TWI (indicador de desgaste): quando atinge 1,6 mm, troque.</li>
                <li>Armazene em local seco, longe de solventes e sol direto, na posição vertical.</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#4c0082", margin: "0 0 8px" }}>6. Montagem correta</h2>
              <p>Use aro compatível, válvulas novas e faça montagem em máquina adequada com profissional. Após montagem, calibre e balanceie. Para moto, respeite posição dianteiro/traseiro e sentido de rotação.</p>
            </section>

            <div style={{ marginTop: 8, padding: 14, background: "#f6f5ff", border: "1px solid #e8e0ff", borderRadius: 10, fontSize: 12, color: "#4c0082" }}>
              <strong>Dica PneuStore:</strong> use o buscador por <strong>Medida do pneu</strong> na home (Largura/Perfil/Aro) para encontrar exatamente <code>195/55R16</code> e filtre com <code>195/55 R16</code> em <Link href="/todos" style={{ color: "#4c0082", fontWeight: 800 }}>Todos</Link>.
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
