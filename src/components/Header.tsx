"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileQuery, setMobileQuery] = useState("");

  const doSearch = (q: string) => {
    const term = q.trim();
    if (!term) {
      router.push("/todos");
      return;
    }
    router.push(`/todos?title=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, q: string) => {
    if (e.key === "Enter") doSearch(q);
  };

  return (
    <div className="pneustore_header_header_container__ioqCn">
      <div className="text-[14px]">
        <div className="hidden desktop:flex flex-col">
          <div className="flex justify-between items-center w-full !px-[20px] !py-[8px] h-[30px] text-[var(--color-primary)] bg-neutralBgLayout whitespace-nowrap text-xs">
            <div className="flex h-full gap-[7px]">
              <button type="button" className="flex items-center h-full px-[12px] cursor-pointer transition-colors duration-150 hover:underline">
                Quero revender
              </button>
              <div className="flex !mx-[8px] border-1 border-dividerGlobalSplit h-full"></div>
              <button type="button" className="flex items-center h-full px-[12px] cursor-pointer transition-colors duration-150 hover:underline">
                Blog
              </button>
              <div className="flex !mx-[8px] border-1 border-dividerGlobalSplit h-full"></div>
            </div>
            <div className="flex h-full gap-[7px]">
              <div className="flex !mx-[8px] border-1 border-dividerGlobalSplit h-full"></div>
              <button type="button" className="flex items-center h-full px-[12px] cursor-pointer transition-colors duration-150 hover:underline">
                Whatsapp (16) 99764-8401
              </button>
              <div className="flex !mx-[8px] border-1 border-dividerGlobalSplit h-full"></div>
              <span className="flex items-center h-full px-[12px]">Televendas (47) 3046-2551</span>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <button type="button" className="block w-full max-w-[1240px] h-[58px] bg-transparent p-0 border-0 cursor-pointer">
              <img
                src="https://static.verumcommerce.com.br/product/Pneustore/a9c181e7594016ab63d3.webp"
                alt="Compre pneus com 5 anos de garantia de fábrica | 10% OFF pagando no PIX "
              />
            </button>
          </div>
          <div className="w-full flex justify-center">
            <div className="flex items-center justify-between w-full max-w-[1240px] !px-[50px] !py-[16px]">
              <Link href="/"><img className="h-[36px] w-auto object-contain cursor-pointer" src="/logo.png" alt="PneuStore" /></Link>
              <div className="w-[40%] !mx-[25px] relative">
                <div className="relative flex w-full items-center overflow-hidden rounded-md">
                  <input
                    className="w-full bg-[#f4f4f4] focus:outline-none border border-none placeholder:text-[14px] placeholder:text-inputGlobalTextPlaceholder h-[50px] rounded-l-[50px] pl-5! pr-4! py-2!"
                    placeholder="O que está buscando hoje?"
                    aria-label="campo de busca"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, query)}
                  />
                  <button
                    onClick={() => doSearch(query)}
                    className="btn btn-ghost flex !bg-[#f4f4f4] justify-center items-center border-none rounded-none rounded-r-[50px] h-[50px] w-[60px] hover:!bg-[#e8e8e8]"
                    aria-label="buscar"
                  >
                    <svg className="" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896">
                      <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex gap-[16px] text-primaryPurpleBase whitespace-nowrap">
                <button className="btn btn-ghost h-auto flex gap-[8px] cursor-pointer" role="button" aria-label="user-badge">
                  <svg className="" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                    <path
                      d="M11.0003 11.9167C13.5316 11.9167 15.5837 9.86464 15.5837 7.33333C15.5837 4.80203 13.5316 2.75 11.0003 2.75C8.46902 2.75 6.41699 4.80203 6.41699 7.33333C6.41699 9.86464 8.46902 11.9167 11.0003 11.9167ZM11.0003 11.9167C12.9452 11.9167 14.8105 12.6893 16.1858 14.0646C17.561 15.4398 18.3337 17.3051 18.3337 19.25M11.0003 11.9167C9.0554 11.9167 7.19014 12.6893 5.81488 14.0646C4.43961 15.4398 3.66699 17.3051 3.66699 19.25"
                      stroke="currentColor"
                      strokeWidth="1.83333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <span>Entrar</span>
                </button>
                <button className="btn btn-ghost flex cursor-pointer h-auto gap-[8px]" aria-label="cart-badge" role="button">
                  <svg className="" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
                    <path
                      d="M0.866577 1.36719H2.19991L3.97324 9.64719C4.0383 9.95043 4.20702 10.2215 4.45038 10.4138C4.69375 10.606 4.99651 10.7074 5.30658 10.7005H11.8266C12.13 10.7 12.4242 10.596 12.6606 10.4057C12.897 10.2154 13.0613 9.95021 13.1266 9.65385L14.2266 4.70052H2.91324M5.50004 14.0005C5.50004 14.3687 5.20156 14.6672 4.83337 14.6672C4.46518 14.6672 4.16671 14.3687 4.16671 14.0005C4.16671 13.6323 4.46518 13.3338 4.83337 13.3338C5.20156 13.3338 5.50004 13.6323 5.50004 14.0005ZM12.8334 14.0005C12.8334 14.3687 12.5349 14.6672 12.1667 14.6672C11.7985 14.6672 11.5 14.3687 11.5 14.0005C11.5 13.6323 11.7985 13.3338 12.1667 13.3338C12.5349 13.3338 12.8334 13.6323 12.8334 14.0005Z"
                      stroke="currentColor"
                      strokeWidth="1.33"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                  <span className="bg-primaryBlueSecondaryBase rounded-full !px-[7px]">0</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col bg-primaryPurpleBase text-white">
            <nav className="relative z-30 w-full bg-primaryPurpleBase text-white">
              <div className="w-full flex justify-center">
                <div className="flex h-[48px] w-full max-w-[1240px] items-center justify-between !px-[50px] gap-[32px]">
                  <div className="flex gap-[16px]">
                    <div className="flex items-center">
                      <button
                        type="button"
                        aria-controls="controls-Pneus"
                        aria-expanded="false"
                        className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:bg-primaryPurpleDarkest rounded-[6px] !my-[10px] whitespace-nowrap"
                      >
                        Pneus
                        <span className="transition-transform duration-200 ease-in-out">
                          <svg className="" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        aria-controls="controls-Acessórios"
                        aria-expanded="false"
                        className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:bg-primaryPurpleDarkest rounded-[6px] !my-[10px] whitespace-nowrap"
                      >
                        Acessórios
                        <span className="transition-transform duration-200 ease-in-out">
                          <svg className="" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        aria-controls="controls-Rodas"
                        aria-expanded="false"
                        className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:bg-primaryPurpleDarkest rounded-[6px] !my-[10px] whitespace-nowrap"
                      >
                        Rodas
                        <span className="transition-transform duration-200 ease-in-out">
                          <svg className="" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:bg-primaryPurpleDarkest rounded-[6px] !my-[10px] whitespace-nowrap"
                        aria-controls="controls-Marcas"
                        aria-expanded="false"
                      >
                        Marcas
                        <span className="transition-transform duration-200 ease-in-out">
                          <svg className="" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:bg-primaryPurpleDarkest rounded-[6px] !my-[10px] whitespace-nowrap"
                      >
                        Promoções
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:bg-primaryPurpleDarkest rounded-[6px] !my-[10px] whitespace-nowrap"
                      >
                        Revenda
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:bg-primaryPurpleDarkest rounded-[6px] !my-[10px] whitespace-nowrap"
                      >
                        Seja um parceiro
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="btn btn-ghost !px-[15px] flex gap-[8px] items-center h-[32px] text-[14px] cursor-pointer hover:bg-primaryPurpleDarkest rounded-[6px] !my-[10px] whitespace-nowrap"
                      >
                        Nossas lojas
                      </button>
                    </div>
                  </div>
                  <button className="btn btn-primary flex items-center justify-center text-white gap-[8px] bg-primaryPurpleDarkest !px-[15px] h-[32px] rounded-[8px] text-[14px] cursor-pointer whitespace-nowrap">
                    <svg className="" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                      <path
                        d="M15 7.5C15 12 9 16.5 9 16.5C9 16.5 3 12 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                    <span className="max-w-[150px] truncate" title="Insira seu CEP">
                      Insira seu CEP
                    </span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
        </div>
        <div className="flex desktop:hidden flex-col !p-[16px] !gap-[16px]">
          <img
            src="https://static.verumcommerce.com.br/product/Pneustore/a9c181e7594016ab63d3.webp"
            alt="Compre pneus com 5 anos de garantia de fábrica | 10% OFF pagando no PIX "
          />
          <div className="flex items-center justify-between text-primaryPurpleBase">
            <div>
              <button className="btn btn-ghost h-auto" aria-label="Abrir menu">
                <svg className="" width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M3.33398 10H16.6673M3.33398 5H16.6673M3.33398 15H16.6673" stroke="currentColor" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>
            </div>
            <Link href="/"><img className="h-[24px] w-auto object-contain" src="/logo.png" alt="PneuStore" /></Link>
            <div className="flex gap-[8px]">
              <button className="btn btn-ghost h-auto flex gap-[8px] cursor-pointer" role="button" aria-label="cart-user">
                <svg className="" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 22">
                  <path
                    d="M11.0003 11.9167C13.5316 11.9167 15.5837 9.86464 15.5837 7.33333C15.5837 4.80203 13.5316 2.75 11.0003 2.75C8.46902 2.75 6.41699 4.80203 6.41699 7.33333C6.41699 9.86464 8.46902 11.9167 11.0003 11.9167ZM11.0003 11.9167C12.9452 11.9167 14.8105 12.6893 16.1858 14.0646C17.561 15.4398 18.3337 17.3051 18.3337 19.25M11.0003 11.9167C9.0554 11.9167 7.19014 12.6893 5.81488 14.0646C4.43961 15.4398 3.66699 17.3051 3.66699 19.25"
                    stroke="currentColor"
                    strokeWidth="1.83333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
              <button className="btn btn-ghost flex cursor-pointer h-auto gap-[4px]" aria-label="cart-badge" role="button">
                <svg className="" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 16">
                  <path
                    d="M0.866577 1.36719H2.19991L3.97324 9.64719C4.0383 9.95043 4.20702 10.2215 4.45038 10.4138C4.69375 10.606 4.99651 10.7074 5.30658 10.7005H11.8266C12.13 10.7 12.4242 10.596 12.6606 10.4057C12.897 10.2154 13.0613 9.95021 13.1266 9.65385L14.2266 4.70052H2.91324M5.50004 14.0005C5.50004 14.3687 5.20156 14.6672 4.83337 14.6672C4.46518 14.6672 4.16671 14.3687 4.16671 14.0005C4.16671 13.6323 4.46518 13.3338 4.83337 13.3338C5.20156 13.3338 5.50004 13.6323 5.50004 14.0005ZM12.8334 14.0005C12.8334 14.3687 12.5349 14.6672 12.1667 14.6672C11.7985 14.6672 11.5 14.3687 11.5 14.0005C11.5 13.6323 11.7985 13.3338 12.1667 13.3338C12.5349 13.3338 12.8334 13.6323 12.8334 14.0005Z"
                    stroke="currentColor"
                    strokeWidth="1.33"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span className="bg-primaryBlueSecondaryBase rounded-full !px-[7px]">0</span>
              </button>
            </div>
          </div>
          <div className="w-[100%] relative">
            <div className="relative flex w-full items-center overflow-hidden rounded-md">
              <input
                className="w-full bg-[#f4f4f4] focus:outline-none border border-none placeholder:text-[14px] placeholder:text-inputGlobalTextPlaceholder h-[50px] rounded-l-[50px] pl-5! pr-4! py-2!"
                placeholder="O que está buscando hoje?"
                aria-label="campo de busca"
                value={mobileQuery}
                onChange={(e) => setMobileQuery(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, mobileQuery)}
              />
              <button
                onClick={() => doSearch(mobileQuery)}
                className="btn btn-ghost flex !bg-[#f4f4f4] justify-center items-center border-none rounded-none rounded-r-[50px] h-[50px] w-[60px] hover:!bg-[#e8e8e8]"
                aria-label="buscar"
              >
                <svg className="" width="20" height="20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="64 64 896 896">
                  <path d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"></path>
                </svg>
              </button>
            </div>
          </div>
          <div className="flex flex-col bg-primaryPurpleBase text-white">
            <div className="flex gap-[8px] z-30 !px-[15px] h-[32px] bg-primaryPurpleDarkest items-center justify-start">
              <svg className="" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18">
                <path
                  d="M15 7.5C15 12 9 16.5 9 16.5C9 16.5 3 12 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span className="flex-1 min-w-0 truncate" title="Insira seu CEP">
                Insira seu CEP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
