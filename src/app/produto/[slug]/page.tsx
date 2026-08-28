"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WhatsAppIcon, ChevronLeft, ChevronRight, Stars, CartIcon } from "@/components/icons";
import { getProductBySlug } from "@/lib/products";
import { useBravoCheckout } from "@/components/BravoPayCheckout";

function brlToCents(v: string): number {
  const digits = v.replace(/\./g, "").replace(",", "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

const STATIC_BASE = "https://static.verumcommerce.com.br/product/Pneustore";

/* ═══════════════════════════════════════════════════════════════════
   RELATED + Q&A (shared)
   ═══════════════════════════════════════════════════════════════════ */

const relatedProducts = [
  { slug: "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl", img: "bc833bd47d1eb07f3a43.webp", img2x: "bc833bd47d1eb07f3a43-1.webp", title: "Pneu Westlake Aro 17.5 CM986 215/75R17.5 135/133J 16 Lonas TL", origPrice: "799,89", curPrice: "719,90", installment: "79,99", stars: 4.5, reviews: 8, brand: "Westlake_banner_1.webp", rr: "D", wg: "C", noise: "72" },
  { slug: "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl", img: "ccdac76cd9248bd45280.webp", img2x: "ccdac76cd9248bd45280-1.webp", title: "Pneu Westlake Aro 17.5 CR960A 215/75R17.5 135/133J 16 Lonas TL", origPrice: "822,12", curPrice: "739,90", installment: "82,21", stars: 4, reviews: 5, brand: "Westlake_banner_1.webp", rr: "C", wg: "B", noise: "70" },
  { slug: "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl", img: "cc3ef30f33ac7c28018d.webp", img2x: "cc3ef30f33ac7c28018d-1.webp", title: "Pneu Westlake Aro 17.5 CM986 215/75R17.5 136/134K 18 Lonas TL", origPrice: "955,45", curPrice: "859,90", installment: "95,55", stars: 4.5, reviews: 3, brand: "Westlake_banner_1.webp", rr: "D", wg: "C", noise: "72" },
  { slug: "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl", img: "bfc10d0ef0e933bd9203.webp", img2x: "bfc10d0ef0e933bd9203-1.webp", title: "Pneu Westlake Aro 17.5 CR960A 215/75R17.5 136/134K 18 Lonas TL", origPrice: "933,23", curPrice: "839,90", installment: "93,32", stars: 4, reviews: 2, brand: "Westlake_banner_1.webp", rr: "C", wg: "B", noise: "70" },
  { slug: "pneu-continental-aro-16-powercontact-2-195-55r16-87h-10120084", img: "b008510702b224d2c3f3.webp", img2x: "b008510702b224d2c3f3-1.webp", title: "Pneu Speedmax Aro 17.5 FACTORMAX-MD 215/75R17.5 135/133J 16 Lonas TL", origPrice: "666,56", curPrice: "599,90", installment: "66,66", stars: 5, reviews: 11, brand: "MINI-BANNER-SPEEDMAX-NOVO.png", rr: "C", wg: "C", noise: "71" },
  { slug: "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl", img: "d1a75f4fb5197084b466.webp", img2x: "d1a75f4fb5197084b466-1.webp", title: "Pneu Itaro Aro 17.5 IT01 215/75R17.5 136/134K 18 Lonas TL", origPrice: "622,12", curPrice: "559,90", installment: "62,21", stars: 4.5, reviews: 7, brand: "ITARO-2-1-.png", rr: "C", wg: "C", noise: "71" },
  { slug: "pneu-itaro-aro-17-5-it01-215-75r17-5-135-133j-16-lonas-tl", img: "d4cb2e20d0accbce337b.webp", img2x: "d4cb2e20d0accbce337b-1.webp", title: "Pneu Itaro Aro 17.5 IT01 225/75R17.5 140/138M 18 Lonas TL", origPrice: "711,00", curPrice: "639,90", installment: "71,10", stars: 4, reviews: 4, brand: "ITARO-2-1-.png", rr: "C", wg: "C", noise: "72" },
  { slug: "pneu-continental-aro-16-powercontact-2-195-55r16-87h-10120084", img: "e67f454502c229412897.webp", img2x: "e67f454502c229412897-1.webp", title: "Pneu Itaro Aro 17.5 IT01 225/75R17.5 135/133J 16 Lonas TL", origPrice: "688,78", curPrice: "619,90", installment: "68,88", stars: 4.5, reviews: 9, brand: "ITARO-2-1-.png", rr: "C", wg: "C", noise: "71" },
];

const qaQuestions = [
  {
    question: "O pneu de voces tem garantia",
    author: "ANDRE FRANCISCO PESSANHA",
    date: "11/08/2026",
    answer: "Ola! Bom dia. Agradecemos o contato. Sim, os pneus possuem cinco anos de garantia contra defeitos de fabricacao, contados a partir da emissao da nota fiscal.",
    answerBy: "PneuStore",
    answerDate: "11/08/2026",
  },
  {
    question: "Preciso de pneus para caminhao Ford F 4000. Seria 7-50-16 ?",
    author: "Diac. Jose Maria Pinheiro Furtado",
    date: "10/06/2026",
    answer: "Ola, tudo bem? Espero que sim!\n\nSugerimos que confira no manual do seu veiculo ou nos pneus ja existentes nele se essas medidas correspondem aos mesmos.\n\nInformacoes importantes que podem ser analisadas: largura, perfil, aro, indice de peso e indice de velocidade; todas essas informacoes podem ser encontradas na lateral externa do pneu.\n\nCaso o pneu desejado siga as mesmas caracteristicas pode ficar tranquilo que o pneu sera otimo para voce!\n\nSe precisar de algo mais e so chamar!",
    answerBy: "PneuStore",
    answerDate: "12/06/2026",
  },
];

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z" /></svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="1em" height="1em" fill="currentColor"><path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8Z" /><path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8Z" /></svg>
);

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

export default function ProductPage() {
  const params = useParams();
  const slugParam = params?.slug as string | string[] | undefined;
  const slug = Array.isArray(slugParam) ? slugParam[0] : (slugParam as string);
  const product = getProductBySlug(slug || "");

  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const relatedScrollRef = useRef<HTMLDivElement>(null);
  const [qaPage, setQaPage] = useState(0);
  const { openCheckout } = useBravoCheckout();

  useEffect(() => {
    setCurrentImage(0);
  }, [slug]);

  const scrollRelated = (dir: "left" | "right") => {
    if (!relatedScrollRef.current) return;
    const amount = dir === "left" ? -280 : 280;
    relatedScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!product) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-background)" }}>
        <Header />
        <main style={{ maxWidth: 1240, margin: "0 auto", padding: "40px 50px", width: "100%", textAlign: "center" }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>Produto não encontrado</h1>
          <p style={{ color: "var(--color-textSecondary)", marginBottom: 24 }}>O produto "{slug}" não existe. Verifique o link ou volte para a página inicial.</p>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "underline" }}>Voltar para a home</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--color-background)" }}>
      <a href="#main-content" className="skip-link">Pular para o conteudo principal</a>

      <Header />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 50px", width: "100%" }}>
        <nav aria-label="Breadcrumb" style={{ fontSize: 13, color: "var(--color-textSecondary)", fontFamily: "Arial, sans-serif" }}>
          <ol style={{ display: "flex", gap: 8, listStyle: "none", margin: 0, padding: 0, flexWrap: "wrap" }}>
            <li><button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13 }}>Pneus</button></li>
            <li style={{ color: "#999" }}>/</li>
            <li><button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13 }}>{product.brand}</button></li>
            <li style={{ color: "#999" }}>/</li>
            <li style={{ color: "#666" }}>{product.name}</li>
          </ol>
        </nav>
      </div>

      <main id="main-content" style={{ maxWidth: 1240, margin: "0 auto", padding: "0 50px 40px", width: "100%" }}>
        <div className="product_container_product__Yi9Lf" style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          <div className="product_product_left_column__BRpbr" style={{ flex: "1 1 480px", minWidth: 320, maxWidth: 560 }}>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", gap: 12 }}>
                <div className="product_thumbnails__SHRvn" style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={`product_thumbnails_img__z1Dr2 ${currentImage === i ? "product_active_thumbnail__icgqh" : ""}`}
                      style={{
                        width: 80, height: 80,
                        border: currentImage === i ? "2px solid var(--color-primary)" : "2px solid #e0e0e0",
                        borderRadius: 8, overflow: "hidden", cursor: "pointer", background: "white", padding: 2, flexShrink: 0,
                      }}
                      aria-label={`Imagem ${i + 1}`}
                    >
                      <img src={`${STATIC_BASE}/${img}?w=200&q=50`} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                    </button>
                  ))}

                  {product.inmetro && (
                  <div className="product_selo_inmetro____W_B" style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
                    <div className="product_all_stamps__onSMZ" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: 22, height: 22, background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>
                            <img src="/resistencia-ao-rolamento.svg" alt="" width={14} height={14} />
                          </div>
                          <div style={{ width: 22, height: 22, background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0", fontSize: 11, fontWeight: 700 }}>
                            {product.inmetro.rollingResistance}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: 22, height: 22, background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>
                            <img src="/aderencia-pista-molhada.svg" alt="" width={14} height={14} />
                          </div>
                          <div style={{ width: 22, height: 22, background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0", fontSize: 11, fontWeight: 700 }}>
                            {product.inmetro.wetGrip}
                          </div>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, borderRadius: 4, overflow: "hidden" }}>
                          <div style={{ width: 22, height: 22, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>
                            <img src="/ruido-externo-2.png" alt="" width={14} height={14} />
                          </div>
                          <div style={{ width: 22, height: 22, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0", fontSize: 9, fontWeight: 700, color: "white" }}>
                            {product.inmetro.noise}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 12, textDecoration: "underline", padding: 0, marginTop: 4 }}>Inmetro</button>
                  </div>
                  )}
                </div>

                <div className="product_main_carousel__zKHVJ" style={{ flex: 1, position: "relative" }}>
                  <div style={{ position: "relative", aspectRatio: "1/1", background: "#fafafa", borderRadius: 12, overflow: "hidden" }}>
                    <img
                      src={`${STATIC_BASE}/${product.images[currentImage]}?w=1080&q=50`}
                      alt={product.name}
                      fetchPriority="high"
                      style={{ position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, objectFit: "contain" }}
                    />
                  </div>

                  <button
                    onClick={() => setCurrentImage(Math.max(0, currentImage - 1))}
                    disabled={currentImage === 0}
                    className="product_buttonBack__0KLTL"
                    style={{
                      position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                      width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
                      border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: currentImage === 0 ? "not-allowed" : "pointer", opacity: currentImage === 0 ? 0.4 : 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)",
                    }}
                    aria-label="Imagem anterior"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => setCurrentImage(Math.min(product.images.length - 1, currentImage + 1))}
                    disabled={currentImage === product.images.length - 1}
                    className="product_buttonNext__bXWuP"
                    style={{
                      position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                      width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)",
                      border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: currentImage === product.images.length - 1 ? "not-allowed" : "pointer",
                      opacity: currentImage === product.images.length - 1 ? 0.4 : 1,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)",
                    }}
                    aria-label="Proxima imagem"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>

              <div className="product_dotGroup__m7O1k" style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12, height: 50, alignItems: "center" }}>
                {product.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`dot___3c3SI ${currentImage === i ? "carousel__dot--selected" : ""}`}
                    style={{
                      width: currentImage === i ? 24 : 8, height: 8, borderRadius: 4, border: "none",
                      background: currentImage === i ? "var(--color-primary)" : "#d0d0d0", cursor: "pointer",
                      transition: "all 0.2s", padding: 0,
                    }}
                    aria-label={`Imagem ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="product_container_info__o42_9" style={{ flex: "1 1 480px", minWidth: 320 }}>
            <div style={{ marginBottom: 12 }}>
              <img
                src={`/${product.brandLogo}`}
                srcSet={`/${product.brandLogo} 1x, /${product.brandLogo2x} 2x`}
                alt={product.brand}
                style={{ height: 40, objectFit: "contain" }}
              />
            </div>

            <div className="product_title_and_subtitle__KY7xd">
              <h1 style={{ fontSize: 22, fontWeight: 400, color: "var(--color-textBase)", margin: "0 0 12px", lineHeight: 1.4, fontFamily: "Arial, sans-serif" }}>
                {product.name}
              </h1>
            </div>

            <div className="product_id_and_rating__i6LqA" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, color: "var(--color-textSecondary)" }}>ID: {product.id}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Stars count={product.stars} />
                <span style={{ fontSize: 14, color: "var(--color-textSecondary)" }}>({product.reviews})</span>
              </div>
            </div>

            <div className="product_buttons_info__7aTna" style={{ marginBottom: 16 }}>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 16px", border: "1px solid var(--color-primary)", borderRadius: 6, background: "transparent", color: "var(--color-primary)", cursor: "pointer", fontSize: 14 }}>
                <svg width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                Informacoes
              </button>
            </div>

            <div className="product_prices__sV_aS" style={{ marginBottom: 20 }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, color: "var(--color-textSecondary)" }}>
                <s>R$&nbsp;{product.origPrice}</s>
              </p>

              <div className="product_in_cash__FuouE" style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 36, fontWeight: 700, color: "var(--color-pdp-price, var(--color-primary))", lineHeight: 1.1 }}>
                  R$ {product.pixPrice.split(",")[0]}<span style={{ fontSize: 22 }}>,{product.pixPrice.split(",")[1]}</span>
                </h2>
                <span style={{ display: "inline-block", background: "var(--color-primary)", color: "white", padding: "3px 12px", borderRadius: 4, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}>
                  no PIX
                </span>
              </div>

              <div className="product_in_installments__mpOM0">
                <p style={{ margin: "4px 0", fontSize: 14, color: "var(--color-textSecondary)" }}>
                  ou R$&nbsp;{product.installmentTotal} em ate {product.installmentCount}x de R$&nbsp;{product.installmentValue} sem juros.
                </p>
                <button style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 13, textDecoration: "underline", padding: 0 }}>
                  <span>Veja mais formas de pagamento</span>
                </button>
              </div>
            </div>

            <div className="product_btn_buy_and_shipping__Dv8_J" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
              <div className="counter_counter_container__jFi8Q" style={{ display: "flex", alignItems: "center" }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  style={{
                    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "white", border: "1px solid #d9d9d9", borderRadius: "6px 0 0 6px",
                    cursor: quantity <= 1 ? "not-allowed" : "pointer",
                    color: quantity <= 1 ? "#ccc" : "var(--color-primary)", fontSize: 16,
                  }}
                  aria-label="Diminuir quantidade"
                >
                  <MinusIcon />
                </button>
                <input
                  type="text"
                  value={quantity}
                  readOnly
                  style={{
                    width: 50, height: 40, textAlign: "center", border: "1px solid #d9d9d9",
                    borderLeft: "none", borderRight: "none", outline: "none", fontSize: 14,
                  }}
                  aria-label="Quantidade"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  style={{
                    width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                    background: "white", border: "1px solid #d9d9d9", borderRadius: "0 6px 6px 0",
                    cursor: "pointer", color: "var(--color-primary)", fontSize: 16,
                  }}
                  aria-label="Aumentar quantidade"
                >
                  <PlusIcon />
                </button>
              </div>

              <button
                onClick={() =>
                  openCheckout({
                    product: {
                      name: product.name,
                      amount_cents: brlToCents(product.pixPrice),
                      slug: product.slug,
                      id: product.id,
                    },
                    quantity,
                  })
                }
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", maxWidth: 300, height: 48,
                  border: "1px solid #68DCFA", borderRadius: 8,
                  background: "#68DCFA", color: "#4e008e",
                  fontSize: 16, fontWeight: 700, cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#5ac8e6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#68DCFA"; }}
              >
                <CartIcon size={20} />
                <span>Comprar</span>
              </button>
            </div>

            <button style={{ background: "none", border: "1px solid #d9d9d9", borderRadius: 8, padding: "8px 16px", fontSize: 13, color: "var(--color-textSecondary)", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              Comparar produto
            </button>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <div className="ant-tabs ant-tabs-top ant-tabs-centered" style={{ position: "relative" }}>
            <div role="tablist" className="ant-tabs-nav" style={{ display: "flex", justifyContent: "center", borderBottom: "1px solid #e8e8e8" }}>
              <div className="ant-tabs-nav-wrap">
                <div className="ant-tabs-nav-list" style={{ display: "flex", position: "relative" }}>
                  <button
                    role="tab"
                    onClick={() => setActiveTab(0)}
                    className={`ant-tabs-tab ${activeTab === 0 ? "ant-tabs-tab-active" : ""}`}
                    style={{
                      padding: "16px 24px", fontSize: 15, fontWeight: activeTab === 0 ? 600 : 400,
                      color: activeTab === 0 ? "var(--color-primary)" : "var(--color-textSecondary)",
                      background: "none", border: "none", cursor: "pointer",
                      borderBottom: activeTab === 0 ? "2px solid var(--color-primary)" : "2px solid transparent",
                      transition: "all 0.2s", position: "relative",
                    }}
                  >
                    Sobre o produto
                  </button>
                  <button
                    role="tab"
                    onClick={() => setActiveTab(1)}
                    className={`ant-tabs-tab ${activeTab === 1 ? "ant-tabs-tab-active" : ""}`}
                    style={{
                      padding: "16px 24px", fontSize: 15, fontWeight: activeTab === 1 ? 600 : 400,
                      color: activeTab === 1 ? "var(--color-primary)" : "var(--color-textSecondary)",
                      background: "none", border: "none", cursor: "pointer",
                      borderBottom: activeTab === 1 ? "2px solid var(--color-primary)" : "2px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    Informacoes tecnicas
                  </button>
                </div>
              </div>
            </div>

            <div className="ant-tabs-content-holder">
              <div className="ant-tabs-content ant-tabs-content-top">
                {activeTab === 0 && (
                  <div role="tabpanel" className="ant-tabs-tabpane ant-tabs-tabpane-active">
                    <div className="tabs-product_about_tire__RmDXf" style={{ display: "flex", justifyContent: "center", alignItems: "center", maxWidth: 860, margin: "70px auto", padding: "0 20px" }}>
                      <div>
                        <h3 style={{ fontSize: "1.5rem", marginBottom: 20 }}>{product.name}</h3>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)", marginBottom: 20 }}>
                          *Nossas vendas sao realizadas apenas para consumidor final, sendo vetada a comercializacao para CNPJ de revendedores.
                        </p>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)", marginBottom: 8, fontWeight: 600 }}>
                          {product.aboutBrandTitle}
                        </p>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)", marginBottom: 16 }}>
                          {product.aboutBrandText}
                        </p>
                        <p style={{ fontSize: 15, lineHeight: 1.8, color: "var(--color-textSecondary)" }}>
                          {product.aboutProductText}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 1 && (
                  <div role="tabpanel" className="ant-tabs-tabpane ant-tabs-tabpane-active">
                    <div style={{ maxWidth: 860, margin: "40px auto", padding: "0 20px" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, fontFamily: "Arial, sans-serif" }}>
                        <tbody>
                          {product.technical.map(([label, value], i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #e8e8e8" }}>
                              <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--color-textBase)", background: i % 2 === 0 ? "#fafafa" : "white", width: "40%" }}>{label}</td>
                              <td style={{ padding: "12px 16px", color: "var(--color-textSecondary)", background: i % 2 === 0 ? "#fafafa" : "white" }}>{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48, borderTop: "1px solid #e8e8e8", paddingTop: 32 }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ marginBottom: 20 }}>
              <p style={{ color: "var(--color-primary)", fontSize: 18, fontWeight: 600, margin: "0 0 4px" }}>Perguntas e Respostas</p>
              <p style={{ color: "var(--color-primary)", fontSize: 14, margin: 0 }}>Tem alguma duvida sobre esse produto? Envie-nos.</p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <textarea
                placeholder="Digite sua pergunta"
                style={{
                  width: "100%", minHeight: 80, padding: 12, borderRadius: 8,
                  border: "2px solid #dfe1e6", fontSize: 14, fontFamily: "Arial, sans-serif",
                  resize: "vertical", outline: "none",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#4c9aff"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "#dfe1e6"; }}
              />
              <button style={{
                marginTop: 8, padding: "8px 24px", borderRadius: 8,
                background: "var(--color-primary)", color: "white", border: "none",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
              }}>
                Enviar pergunta
              </button>
            </div>

            {qaQuestions.map((qa, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ borderRadius: 10, padding: 16, background: "#f9f9f9" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 500, color: "var(--color-textBase)" }}>{qa.question}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-textSecondary)" }}>
                    por <b>{qa.author}</b> em {qa.date}
                  </p>
                </div>
                <div style={{ marginLeft: 24, marginTop: 8, padding: "12px 16px", borderLeft: "3px solid var(--color-primary)", background: "#fafafa", borderRadius: "0 8px 8px 0" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 14, color: "var(--color-textBase)", lineHeight: 1.6, whiteSpace: "pre-line" }}>{qa.answer}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "var(--color-textSecondary)" }}>
                    por <b>{qa.answerBy}</b> em {qa.answerDate}
                  </p>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 16, alignItems: "center" }}>
              <button disabled style={{ color: "var(--color-primary)", opacity: 0.3, background: "none", border: "none", fontSize: 16, cursor: "not-allowed" }}>&lt;</button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  onClick={() => setQaPage(page - 1)}
                  style={{
                    width: 32, height: 32, borderRadius: "50%", border: "none",
                    background: qaPage === page - 1 ? "var(--color-primary)" : "transparent",
                    color: qaPage === page - 1 ? "white" : "var(--color-primary)",
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                  }}
                >
                  {page}
                </button>
              ))}
              <button style={{ color: "var(--color-primary)", background: "none", border: "none", fontSize: 16, cursor: "pointer" }}>&gt;</button>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20, color: "var(--color-textBase)" }}>
            Confira outros produtos
          </h2>

          <div style={{ position: "relative" }}>
            <button onClick={() => scrollRelated("left")} style={{ position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "white", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)" }} aria-label="Anterior">
              <ChevronLeft />
            </button>

            <div ref={relatedScrollRef} style={{ display: "flex", gap: 16, overflowX: "auto", scrollBehavior: "smooth", scrollbarWidth: "none", msOverflowStyle: "none", padding: "4px 0" }} className="hide-scrollbar">
              {relatedProducts.map((p, i) => (
                <Link href={`/produto/${p.slug}`} key={i} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ minWidth: 260, maxWidth: 260, border: "1px solid #e8e8e8", borderRadius: 12, overflow: "hidden", background: "white", cursor: "pointer", transition: "box-shadow 0.2s", flexShrink: 0 }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                  >
                    <div style={{ padding: 16 }}>
                      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 700 }}>
                          <div style={{ width: 18, height: 18, borderRadius: "4px 0 0 4px", background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src="/858188e454f29bd80bfe9090e2d077acc45f5ee7.png" alt="" width={12} height={12} />
                          </div>
                          <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "#FFED00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{p.rr}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 700 }}>
                          <div style={{ width: 18, height: 18, borderRadius: "4px 0 0 4px", background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src="/92cd0612962d6caef7b755437547b544970a915c.png" alt="" width={12} height={12} />
                          </div>
                          <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "#C8D400", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>{p.wg}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 10, fontWeight: 700 }}>
                          <div style={{ width: 18, height: 18, borderRadius: "4px 0 0 4px", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                            <img src="/a9c67ec6b08617feea202bddb77ebc4ae147d1ff.png" alt="" width={12} height={12} />
                          </div>
                          <div style={{ width: 18, height: 18, borderRadius: "0 4px 4px 0", background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 9 }}>{p.noise}</div>
                        </div>
                      </div>

                      <div style={{ width: "100%", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                        <img src={`/${p.img}`} alt={p.title} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                      </div>

                      {p.brand && (
                        <div style={{ width: "100%", height: 24, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                          <img src={`/${p.brand}`} alt="" style={{ maxHeight: 24, objectFit: "contain" }} />
                        </div>
                      )}

                      <p style={{ fontSize: 13, color: "var(--color-textBase)", lineHeight: 1.4, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.title}
                      </p>

                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
                        <Stars count={p.stars} />
                        <span style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>({p.reviews})</span>
                      </div>

                      <div>
                        <span style={{ fontSize: 12, color: "var(--color-textSecondary)", textDecoration: "line-through" }}>R$ {p.origPrice}</span>
                        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-primary)" }}>R$ {p.curPrice}</div>
                        <span style={{ fontSize: 12, color: "var(--color-textSecondary)" }}>ou 10x de R$ {p.installment}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <button onClick={() => scrollRelated("right")} style={{ position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", zIndex: 10, width: 36, height: 36, borderRadius: "50%", background: "white", border: "1px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", color: "var(--color-primary)" }} aria-label="Proximo">
              <ChevronRight />
            </button>
          </div>
        </div>
      </main>

      <section className="product_container_newsletter__ZmXX_" style={{ background: "var(--color-secondary)" }}>
        <section className="newsletter_newsletter_container_home__4T9VZ">
          <form className="flex flex-col desktop:flex-row h-full">
            <div className="flex flex-col w-full h-full font-arial gap-[24px] items-center !bg-[var(--color-secondary)] !px-[16px] !py-[24px] desktop:!px-[100px] desktop:!py-[48px]">
              <div className="flex flex-col gap-[4px]">
                <h2 className="font-bold text-center !text-[24px] desktop:!text-[30px] leading-[32px] desktop:leading-[38px] !text-[var(--color-primary)]">
                  Fique por dentro das acoes que acontecem na PNEUSTORE
                </h2>
              </div>
              <div className="flex flex-col desktop:flex-row gap-[16px] w-full justify-center">
                <div className="w-full flex flex-col">
                  <input className="!border-inputGlobalBorder w-full bg-white border-[1px] !py-[4px] !px-[11px] rounded-md !text-[14px] placeholder-inputGlobalTextPlaceholder !h-[40px]" aria-label="Seu nome" placeholder="Seu nome" name="name" />
                </div>
                <div className="w-full flex flex-col">
                  <input className="!border-inputGlobalBorder w-full bg-white border-[1px] !py-[4px] !px-[11px] rounded-md !text-[14px] placeholder-inputGlobalTextPlaceholder !h-[40px]" type="email" aria-label="Seu email" placeholder="E-mail" name="email" />
                </div>
                <button type="submit" className="!bg-[var(--color-primary)] !border-[var(--color-primary)] text-white !h-[40px] rounded-md !px-[32px] font-bold cursor-pointer border-none" style={{ minWidth: 140 }}>
                  Me inscrever
                </button>
              </div>
            </div>
          </form>
        </section>
      </section>

      <Footer />

      <button
        style={{
          position: "fixed", bottom: 24, right: 24, width: 56, height: 56,
          borderRadius: "50%", background: "#25D366", display: "flex",
          alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          cursor: "pointer", border: "none", zIndex: 50,
        }}
        aria-label="WhatsApp"
      >
        <WhatsAppIcon />
      </button>
    </div>
  );
}
