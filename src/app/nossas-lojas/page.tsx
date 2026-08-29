"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./style.css";

export default function NossasLojasPage() {
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [activeCard, setActiveCard] = useState<"loja" | "instalar" | "servicos">("loja");

  const estados = ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"];
  const cidadesMock: Record<string,string[]> = {
    SP: ["São Paulo","Campinas","Santos","Ribeirão Preto","Sorocaba"],
    RJ: ["Rio de Janeiro","Niterói","Volta Redonda"],
    PR: ["Curitiba","Londrina","Maringá"],
    SC: ["Florianópolis","Joinville","Itajaí","Blumenau"],
  };

  const handleCepChange = (v: string) => {
    const digits = v.replace(/\D/g,"").slice(0,8);
    const masked = digits.length > 5 ? `${digits.slice(0,5)}-${digits.slice(5)}` : digits;
    setCep(masked);
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#fff" }}>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {/* HERO */}
        <div className="HeroSection_wrapper__fQY6S">
          <div className="HeroSection_content__y3tUF">
            <h2 className="HeroSection_title__bJN0_">
              PNEUSTORE evoluiu, e agora tem <span>lojas físicas!</span>
            </h2>
            <h3 className="HeroSection_subtitle__pP8_e">Uma experiência completa feita para você!</h3>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="BenefitsSection_container__0o7OP">
          <div className="BenefitsSection_grid__Hs3Pa">
            <div className="BenefitsSection_item__wsGyL">
              <div className="BenefitsSection_iconWrapper__jr3zm">
                <svg viewBox="0 0 29 29" width="1em" height="1em" fill="none" stroke="currentColor" className="BenefitsSection_icon__kr9pW">
                  <path d="M27.0533 18.3333H21C20.2928 18.3333 19.6145 18.6143 19.1144 19.1144C18.6143 19.6145 18.3333 20.2928 18.3333 21V27.0533" strokeWidth="2"></path>
                  <path d="M7.66667 2.78678V5.00012C7.66667 6.06098 8.08809 7.0784 8.83824 7.82854C9.58838 8.57869 10.6058 9.00012 11.6667 9.00012C12.3739 9.00012 13.0522 9.28107 13.5523 9.78117C14.0524 10.2813 14.3333 10.9595 14.3333 11.6668C14.3333 13.1334 15.5333 14.3334 17 14.3334C17.7072 14.3334 18.3855 14.0525 18.8856 13.5524C19.3857 13.0523 19.6667 12.374 19.6667 11.6668C19.6667 10.2001 20.8667 9.00012 22.3333 9.00012H26.56" strokeWidth="2"></path>
                  <path d="M12.9997 27.6V22.3333C12.9997 21.6261 12.7188 20.9478 12.2187 20.4477C11.7186 19.9476 11.0403 19.6667 10.3331 19.6667C9.62583 19.6667 8.94755 19.3857 8.44745 18.8856C7.94736 18.3855 7.66641 17.7072 7.66641 17V15.6667C7.66641 14.9594 7.38545 14.2811 6.88536 13.781C6.38526 13.281 5.70698 13 4.99974 13H1.06641" strokeWidth="2"></path>
                  <path d="M27.6667 14.3333C27.6667 21.6971 21.6971 27.6667 14.3333 27.6667C6.96954 27.6667 1 21.6971 1 14.3333C1 6.96954 6.96954 1 14.3333 1C21.6971 1 27.6667 6.96954 27.6667 14.3333Z" strokeWidth="2"></path>
                </svg>
              </div>
              <h5 className="BenefitsSection_title__7bqby">PNEUSTORE em todo Brasil</h5>
              <p className="BenefitsSection_description__2IgWV">Escolha entre 120 lojas para comprar e instalar seus pneus</p>
            </div>
            <div className="BenefitsSection_item__wsGyL">
              <div className="BenefitsSection_iconWrapper__jr3zm">
                <svg viewBox="0 0 32 32" width="1em" height="1em" fill="none" stroke="currentColor" className="BenefitsSection_icon__kr9pW">
                  <path d="M2.73303 2.7334H5.3997L8.94637 19.2934C9.07647 19.8999 9.41393 20.442 9.90065 20.8265C10.3874 21.2111 10.9929 21.4139 11.613 21.4001H24.653C25.2599 21.3991 25.8483 21.1911 26.3211 20.8105C26.7938 20.4299 27.1226 19.8994 27.253 19.3067L29.453 9.40007H6.82637" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M12 28C12 28.7364 11.403 29.3333 10.6666 29.3333C9.93025 29.3333 9.33329 28.7364 9.33329 28C9.33329 27.2636 9.93025 26.6667 10.6666 26.6667C11.403 26.6667 12 27.2636 12 28Z" strokeWidth="2"></path>
                  <path d="M26.6666 28C26.6666 28.7364 26.0697 29.3333 25.3333 29.3333C24.5969 29.3333 24 28.7364 24 28C24 27.2636 24.5969 26.6667 25.3333 26.6667C26.0697 26.6667 26.6666 27.2636 26.6666 28Z" strokeWidth="2"></path>
                </svg>
              </div>
              <h5 className="BenefitsSection_title__7bqby">Retire na loja</h5>
              <p className="BenefitsSection_description__2IgWV">Compre online e retire seus pneus na loja mais perto de você</p>
            </div>
            <div className="BenefitsSection_item__wsGyL">
              <div className="BenefitsSection_iconWrapper__jr3zm">
                <svg viewBox="0 0 32 32" width="1em" height="1em" fill="none" stroke="currentColor" className="BenefitsSection_icon__kr9pW">
                  <path d="M21.3333 28V25.3333C21.3333 23.9188 20.7714 22.5623 19.7712 21.5621C18.771 20.5619 17.4144 20 16 20H7.99996C6.58547 20 5.22892 20.5619 4.22872 21.5621C3.22853 22.5623 2.66663 23.9188 2.66663 25.3333V28" strokeWidth="2"></path>
                  <path d="M21.3333 14.6667L24 17.3333L29.3333 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  <path d="M17.3333 9.33333C17.3333 12.2789 14.9455 14.6667 12 14.6667C9.05444 14.6667 6.66663 12.2789 6.66663 9.33333C6.66663 6.38781 9.05444 4 12 4C14.9455 4 17.3333 6.38781 17.3333 9.33333Z" strokeWidth="2"></path>
                </svg>
              </div>
              <h5 className="BenefitsSection_title__7bqby">Profissionais Certificados</h5>
              <p className="BenefitsSection_description__2IgWV">Serviços de instalação feitos por especialistas e com 90 dias de garantia</p>
            </div>
            <div className="BenefitsSection_item__wsGyL">
              <div className="BenefitsSection_iconWrapper__jr3zm">
                <svg viewBox="0 0 32 32" width="1em" height="1em" fill="none" stroke="currentColor" className="BenefitsSection_icon__kr9pW">
                  <path d="M21.3333 10.6667H13.3333C12.626 10.6667 11.9478 10.9476 11.4477 11.4477C10.9476 11.9478 10.6666 12.6261 10.6666 13.3333C10.6666 14.0406 10.9476 14.7188 11.4477 15.2189C11.9478 15.719 12.626 16 13.3333 16H18.6666C19.3739 16 20.0521 16.2809 20.5522 16.781C21.0523 17.2811 21.3333 17.9594 21.3333 18.6667C21.3333 19.3739 21.0523 20.0522 20.5522 20.5523C20.0521 21.0524 19.3739 21.3333 18.6666 21.3333H10.6666" strokeWidth="2" strokeLinecap="round"></path>
                  <path d="M16 24V8" strokeWidth="2" strokeLinecap="round"></path>
                  <path d="M29.3333 16C29.3333 23.3638 23.3638 29.3333 16 29.3333C8.63616 29.3333 2.66663 23.3638 2.66663 16C2.66663 8.63619 8.63616 2.66666 16 2.66666C23.3638 2.66666 29.3333 8.63619 29.3333 16Z" strokeWidth="2"></path>
                </svg>
              </div>
              <h5 className="BenefitsSection_title__7bqby">Preços de e-commerce</h5>
              <p className="BenefitsSection_description__2IgWV">Compre pneus com condições do site, com atendimento de especialistas</p>
            </div>
          </div>
        </div>

        {/* ACTION CARDS */}
        <div className="ActionSection_container__ep3GP">
          <h4 style={{ textAlign: "center", fontWeight: 600, fontSize: 18, marginBottom: 16 }}>O que você precisa hoje?</h4>
          <div className="ant-row ant-row-center ant-row-stretch" style={{ marginLeft: -8, marginRight: -8, rowGap: 16, display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
            <div style={{ paddingLeft: 8, paddingRight: 8, flex: "0 0 25%", minWidth: 260, maxWidth: 320 }}>
              <div className={`ant-card ant-card-bordered ActionSection_card__lkCR_ ${activeCard==="loja" ? "ActionSection_active__TlSOl" : ""}`} onClick={()=>setActiveCard("loja")} style={{ cursor: "pointer" }}>
                <div className="ant-card-body">
                  <div className="ActionSection_content__kdBcH">
                    <div className="ActionSection_icon__jVp4n">
                      <span role="img" aria-label="shop" className="anticon anticon-shop">
                        <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M882 272.1V144c0-17.7-14.3-32-32-32H174c-17.7 0-32 14.3-32 32v128.1c-16.7 1-30 14.9-30 31.9v131.7a177 177 0 0014.4 70.4c4.3 10.2 9.6 19.8 15.6 28.9v345c0 17.6 14.3 32 32 32h676c17.7 0 32-14.3 32-32V535a175 175 0 0015.6-28.9c9.5-22.3 14.4-46 14.4-70.4V304c0-17-13.3-30.9-30-31.9zM214 184h596v88H214v-88zm362 656.1H448V736h128v104.1zm234 0H640V704c0-17.7-14.3-32-32-32H416c-17.7 0-32 14.3-32 32v136.1H214V597.9c2.9 1.4 5.9 2.8 9 4 22.3 9.4 46 14.1 70.4 14.1s48-4.7 70.4-14.1c13.8-5.8 26.8-13.2 38.7-22.1.2-.1.4-.1.6 0a180.4 180.4 0 0038.7 22.1c22.3 9.4 46 14.1 70.4 14.1 24.4 0 48-4.7 70.4-14.1 13.8-5.8 26.8-13.2 38.7-22.1.2-.1.4-.1.6 0a180.4 180.4 0 0038.7 22.1c22.3 9.4 46 14.1 70.4 14.1 24.4 0 48-4.7 70.4-14.1 3-1.3 6-2.6 9-4v242.2zm30-404.4c0 59.8-49 108.3-109.3 108.3-40.8 0-76.4-22.1-95.2-54.9-2.9-5-8.1-8.1-13.9-8.1h-.6c-5.7 0-11 3.1-13.9 8.1A109.24 109.24 0 01512 544c-40.7 0-76.2-22-95-54.7-3-5.1-8.4-8.3-14.3-8.3s-11.4 3.2-14.3 8.3a109.63 109.63 0 01-95.1 54.7C233 544 184 495.5 184 435.7v-91.2c0-.3.2-.5.5-.5h655c.3 0 .5.2.5.5v91.2z"></path></svg>
                      </span>
                    </div>
                    <div>
                      <h5 className="ActionSection_title__L3L_E" style={{ margin: 0, fontWeight: 600 }}>Encontrar loja</h5>
                      <span className="ActionSection_desc__rlLaO">Veja a loja mais próxima de você</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ paddingLeft: 8, paddingRight: 8, flex: "0 0 25%", minWidth: 260, maxWidth: 320 }}>
              <div className={`ant-card ant-card-bordered ActionSection_card__lkCR_ ${activeCard==="instalar" ? "ActionSection_active__TlSOl" : ""}`} onClick={()=>setActiveCard("instalar")} style={{ cursor: "pointer" }}>
                <div className="ant-card-body">
                  <div className="ActionSection_content__kdBcH">
                    <div className="ActionSection_icon__jVp4n">
                      <span role="img" aria-label="tool" className="anticon anticon-tool">
                        <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M876.6 239.5c-.5-.9-1.2-1.8-2-2.5-5-5-13.1-5-18.1 0L684.2 409.3l-67.9-67.9L788.7 169c.8-.8 1.4-1.6 2-2.5 3.6-6.1 1.6-13.9-4.5-17.5-98.2-58-226.8-44.7-311.3 39.7-67 67-89.2 162-66.5 247.4l-293 293c-3 3-2.8 7.9.3 11l169.7 169.7c3.1 3.1 8.1 3.3 11 .3l292.9-292.9c85.5 22.8 180.5.7 247.6-66.4 84.4-84.5 97.7-213.1 39.7-311.3zM786 499.8c-58.1 58.1-145.3 69.3-214.6 33.6l-8.8 8.8-.1-.1-274 274.1-79.2-79.2 230.1-230.1s0 .1.1.1l52.8-52.8c-35.7-69.3-24.5-156.5 33.6-214.6a184.2 184.2 0 01144-53.5L537 318.9a32.05 32.05 0 000 45.3l124.5 124.5a32.05 32.05 0 0045.3 0l132.8-132.8c3.7 51.8-14.4 104.8-53.6 143.9z"></path></svg>
                      </span>
                    </div>
                    <div>
                      <h5 className="ActionSection_title__L3L_E" style={{ margin: 0, fontWeight: 600 }}>Instalar pneus</h5>
                      <span className="ActionSection_desc__rlLaO">Agende os serviços de instalação</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ paddingLeft: 8, paddingRight: 8, flex: "0 0 25%", minWidth: 260, maxWidth: 320 }}>
              <div className={`ant-card ant-card-bordered ActionSection_card__lkCR_ ${activeCard==="servicos" ? "ActionSection_active__TlSOl" : ""}`} onClick={()=>setActiveCard("servicos")} style={{ cursor: "pointer" }}>
                <div className="ant-card-body">
                  <div className="ActionSection_content__kdBcH">
                    <div className="ActionSection_icon__jVp4n">
                      <span role="img" aria-label="setting" className="anticon anticon-setting">
                        <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor"><path d="M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z"></path></svg>
                      </span>
                    </div>
                    <div>
                      <h5 className="ActionSection_title__L3L_E" style={{ margin: 0, fontWeight: 600 }}>Serviços automotivos</h5>
                      <span className="ActionSection_desc__rlLaO">Agende serviços avulsos como revisão</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH FORM */}
        <div className="SearchForm_root__YcoiP" id="section-store">
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <h3 style={{ fontWeight: 600, fontSize: 18, margin: 0 }}>Encontre a PNEUSTORE mais próxima de você</h3>
            <span style={{ color: "#666", fontSize: 14 }}>Mais de 120 lojas em todas as regiões do Brasil</span>
          </div>
          <div className="SearchForm_container__GyxKH">
            <div className="SearchForm_inner__xiKKm">
              <div className="SearchForm_group__bgxjH">
                <span className="ant-input-affix-wrapper SearchForm_inputCep__c_Xhw" style={{ display: "flex", alignItems: "center", border: "1px solid #d9d9d9", borderRadius: 8, background: "#fff", padding: "0 12px", height: 40, flex: 2 }}>
                  <span className="ant-input-prefix" style={{ marginRight: 8, color: "#4e008e" }}>
                    <svg viewBox="64 64 896 896" width="14" height="14" fill="currentColor"><path d="M854.6 289.1a362.49 362.49 0 00-79.9-115.7 370.83 370.83 0 00-118.2-77.8C610.7 76.6 562.1 67 512 67c-50.1 0-98.7 9.6-144.5 28.5-44.3 18.3-84 44.5-118.2 77.8A363.6 363.6 0 00169.4 289c-19.5 45-29.4 92.8-29.4 142 0 70.6 16.9 140.9 50.1 208.7 26.7 54.5 64 107.6 111 158.1 80.3 86.2 164.5 138.9 188.4 153a43.9 43.9 0 0022.4 6.1c7.8 0 15.5-2 22.4-6.1 23.9-14.1 108.1-66.8 188.4-153 47-50.4 84.3-103.6 111-158.1C867.1 572 884 501.8 884 431.1c0-49.2-9.9-97-29.4-142zM512 880.2c-65.9-41.9-300-207.8-300-449.1 0-77.9 31.1-151.1 87.6-206.3C356.3 169.5 431.7 139 512 139s155.7 30.5 212.4 85.9C780.9 280 812 353.2 812 431.1c0 241.3-234.1 407.2-300 449.1zm0-617.2c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 551c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 439c0-29.9 11.7-58 32.8-79.2C454 338.6 482.1 327 512 327c29.9 0 58 11.6 79.2 32.8C612.4 381 624 409.1 624 439c0 29.9-11.6 58-32.8 79.2z"></path></svg>
                  </span>
                  <input
                    placeholder="00000-000"
                    maxLength={9}
                    value={cep}
                    onChange={(e)=>handleCepChange(e.target.value)}
                    style={{ border: "none", outline: "none", flex: 1, fontSize: 14 }}
                  />
                </span>
                <button
                  type="button"
                  disabled={cep.length < 9}
                  onClick={()=>alert(`Buscando lojas próximas ao CEP ${cep}... (integração em breve)`)}
                  className="SearchForm_button__oGaQR"
                  style={{ background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 8, height: 40, padding: "0 16px", fontWeight: 600, opacity: cep.length < 9 ? 0.6 : 1, cursor: cep.length < 9 ? "not-allowed" : "pointer" }}
                >
                  Buscar
                </button>
              </div>
              <span className="SearchForm_separator__PkKpr" style={{ color: "#999", fontSize: 14, margin: "0 8px" }}>ou</span>
              <div className="SearchForm_group__bgxjH" style={{ display: "flex", gap: 12, alignItems: "center", flex: 1 }}>
                <span className="SearchForm_label__OIbdG" style={{ fontSize: 14, color: "#555", whiteSpace: "nowrap" }}>Estado:</span>
                <select
                  value={estado}
                  onChange={(e)=>{ setEstado(e.target.value); setCidade(""); }}
                  style={{ flex: 1, height: 40, borderRadius: 8, border: "1px solid #d9d9d9", padding: "0 12px", fontSize: 14, background: "#fff", minWidth: 140 }}
                >
                  <option value="">Selecionar</option>
                  {estados.map(uf=> <option key={uf} value={uf}>{uf}</option>)}
                </select>
                <span className="SearchForm_label__OIbdG" style={{ fontSize: 14, color: "#555", whiteSpace: "nowrap" }}>Cidade:</span>
                <select
                  value={cidade}
                  onChange={(e)=>setCidade(e.target.value)}
                  disabled={!estado}
                  style={{ flex: 1, height: 40, borderRadius: 8, border: "1px solid #d9d9d9", padding: "0 12px", fontSize: 14, background: "#fff", minWidth: 140, opacity: !estado ? 0.6 : 1 }}
                >
                  <option value="">Selecionar</option>
                  {(cidadesMock[estado] || []).map(c=> <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  type="button"
                  disabled={!estado || !cidade}
                  onClick={()=>alert(`Buscando lojas em ${cidade}/${estado}...`)}
                  className="SearchForm_button__oGaQR"
                  style={{ background: "var(--color-primary)", color: "#fff", border: "none", borderRadius: 8, height: 40, padding: "0 16px", fontWeight: 600, opacity: (!estado || !cidade) ? 0.6 : 1, cursor: (!estado || !cidade) ? "not-allowed" : "pointer" }}
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* STORE LIST PLACEHOLDER - mantém característica visual original */}
        <div style={{ background: "#f4f4f4", padding: "20px 16px", display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: 1100, width: "100%", background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
            {cidade || cep ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
                {[
                  { nome: `PNEUSTORE ${cidade || "Centro"} - ${estado || "SP"}`, endereco: "Av. Principal, 1000", telefone: "(11) 3046-2551", distancia: "1,2 km" },
                  { nome: `PNEUSTORE Shopping ${estado || "SP"}`, endereco: "Rua das Lojas, 500", telefone: "(11) 3046-2552", distancia: "3,4 km" },
                  { nome: "PNEUSTORE Express", endereco: "Rod. Antonio Heil, 800", telefone: "(47) 3046-2551", distancia: "5,0 km" },
                ].map(s=> (
                  <div key={s.nome} style={{ border: "1px solid #eee", borderRadius: 12, padding: 16, background: "#fafafa" }}>
                    <h5 style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>{s.nome}</h5>
                    <p style={{ fontSize: 13, color: "#555", display: "flex", gap: 6 }}><span>📍</span>{s.endereco}</p>
                    <a href={`tel:${s.telefone}`} style={{ fontSize: 13, color: "var(--color-primary)", fontWeight: 600 }}>{s.telefone}</a>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontSize: 12, color: "#888" }}>
                      <span>{s.distancia}</span><a href="#" style={{ color: "var(--color-primary)", fontWeight: 600 }}>Como chegar →</a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#888", padding: "40px 0" }}>
                <p style={{ fontSize: 14 }}>Digite seu CEP ou selecione Estado e Cidade para encontrar a loja mais próxima.</p>
                <p style={{ fontSize: 12, marginTop: 8 }}>120 lojas em todo Brasil prontas para te atender.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
