"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Stars } from "@/components/icons";
import { products } from "@/lib/products";
import { useBravoCheckout } from "@/components/BravoPayCheckout";

function brlToCents(v: string): number {
  const digits = v.replace(/\./g, "").replace(",", "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

const ITEMS_PER_PAGE = 20;

const STATIC_BASE = "https://static.verumcommerce.com.br/product/Pneustore";

function TodosContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openCheckout } = useBravoCheckout();
  const rawQuery = searchParams.get("title") || searchParams.get("q") || searchParams.get("search") || searchParams.get("query") || "";
  const query = rawQuery.trim();
  const larguraQ = (searchParams.get("largura") || "").trim();
  const perfilQ = (searchParams.get("perfil") || "").trim();
  const aroQ = (searchParams.get("aro") || "").trim();
  const medidaQ = (searchParams.get("medida") || (larguraQ && perfilQ && aroQ ? `${larguraQ}/${perfilQ}R${aroQ}` : "")).trim();

  function parseMedida(name: string): { largura: string; perfil: string; aro: string } | null {
    const m1 = name.match(/(\d{3})\/(\d{2,3})R(\d+(?:\.\d+)?)/i);
    if (m1) return { largura: m1[1], perfil: m1[2], aro: m1[3] };
    const m2 = name.match(/(\d{2,3})\/(\d{2,3})-(\d+(?:\.\d+)?)/);
    if (m2) return { largura: m2[1], perfil: m2[2], aro: m2[3] };
    const m3 = name.match(/(\d{3})X(\d{2,3})/i);
    if (m3) return { largura: m3[1], perfil: m3[2], aro: "700" };
    return null;
  }

  const [sortBy, setSortBy] = useState("relevance");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const allProducts = useMemo(() => Object.values(products), []);

  const brands = useMemo(() => {
    const b = Array.from(new Set(allProducts.map((p) => p.brand))).sort();
    return b;
  }, [allProducts]);

  const filtered = useMemo(() => {
    let list = allProducts;
    // Filtro por medida (largura/perfil/aro) vindo da busca por medidas da home
    if (larguraQ || perfilQ || aroQ || medidaQ) {
      list = list.filter((p) => {
        const m = parseMedida(p.name);
        if (!m) return false;
        if (larguraQ && m.largura !== larguraQ) return false;
        if (perfilQ && m.perfil !== perfilQ) return false;
        if (aroQ && m.aro !== aroQ) return false;
        if (medidaQ) {
          const medidaNorm = medidaQ.replace(/\s+/g, "").toUpperCase();
          const pNorm1 = `${m.largura}/${m.perfil}R${m.aro}`.toUpperCase();
          const pNorm2 = `${m.largura}/${m.perfil}-${m.aro}`.toUpperCase();
          if (!pNorm1.includes(medidaNorm) && !pNorm2.includes(medidaNorm) && !p.name.toLowerCase().includes(medidaQ.toLowerCase())) return false;
        }
        return true;
      });
    } else if (query) {
      // Fallback: busca textual também entende "195/55R16" ou "195/55 R16"
      const q = query.toLowerCase();
      const qNorm = q.replace(/\s+/g, "");
      list = list.filter((p) => {
        const m = parseMedida(p.name);
        const medidaStr1 = m ? `${m.largura}/${m.perfil}R${m.aro}`.toLowerCase() : "";
        const medidaStr2 = m ? `${m.largura}/${m.perfil}-${m.aro}`.toLowerCase() : "";
        const medidaStr3 = m ? `${m.largura}/${m.perfil} R${m.aro}`.toLowerCase() : "";
        return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.id.includes(q) || (qNorm && (medidaStr1.includes(qNorm) || medidaStr2.includes(qNorm))) || medidaStr3.includes(q);
      });
    }
    if (selectedBrand) {
      list = list.filter((p) => p.brand === selectedBrand);
    }
    if (sortBy === "price-asc") list = [...list].sort((a, b) => parseFloat(a.pixPrice.replace(/\./g, "").replace(",", ".")) - parseFloat(b.pixPrice.replace(/\./g, "").replace(",", ".")));
    if (sortBy === "price-desc") list = [...list].sort((a, b) => parseFloat(b.pixPrice.replace(/\./g, "").replace(",", ".")) - parseFloat(a.pixPrice.replace(/\./g, "").replace(",", ".")));
    if (sortBy === "name-asc") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [query, selectedBrand, sortBy, allProducts, larguraQ, perfilQ, aroQ, medidaQ]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [query, selectedBrand, sortBy, larguraQ, perfilQ, aroQ, medidaQ]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const goToPage = (page: number) => {
    const p = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    setSelectedBrand(null);
    setCurrentPage(1);
    router.push("/todos");
  };

  const medidaAtiva = larguraQ || perfilQ || aroQ || medidaQ ? `${larguraQ || ""}${perfilQ ? `/${perfilQ}` : ""}${aroQ ? `R${aroQ}` : ""}`.replace(/^\//, "") : "";
  const hasMedidaFilter = !!(larguraQ || perfilQ || aroQ || medidaQ);
  const tituloBusca = medidaQ || (hasMedidaFilter ? medidaAtiva : query);
  const isFiltered = !!(query || selectedBrand || hasMedidaFilter);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f9f9f9" }}>
      <Header />

      {/* Breadcrumb */}
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "12px 20px", fontSize: 13, color: "var(--color-textSecondary)" }}>
          <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Home</Link>
          <span style={{ margin: "0 8px", color: "#999" }}>/</span>
          <Link href="/todos" style={{ color: "var(--color-primary)", textDecoration: "none" }}>Todos</Link>
          {tituloBusca && (
            <>
              <span style={{ margin: "0 8px", color: "#999" }}>/</span>
              <span style={{ color: "#666" }}>&quot;{tituloBusca}&quot;</span>
            </>
          )}
        </div>
      </div>

      {/* Título + Busca interna */}
      <div style={{ background: "white", borderBottom: "1px solid #f0f0f0" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 20px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-textBase)", margin: 0 }}>
                {tituloBusca ? `Resultados para "${tituloBusca}"` : "Todos os produtos"}
              </h1>
              <p style={{ fontSize: 14, color: "var(--color-textSecondary)", margin: "4px 0 0" }}>
                {filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"} {tituloBusca ? `para "${tituloBusca}"` : ""} • {allProducts.length} no total
              </p>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: "var(--color-textSecondary)" }}>Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ height: 36, border: "1px solid #d9d9d9", borderRadius: 8, padding: "0 12px", fontSize: 13, background: "white", minWidth: 160 }}
              >
                <option value="relevance">Relevância</option>
                <option value="price-asc">Menor preço</option>
                <option value="price-desc">Maior preço</option>
                <option value="name-asc">Nome A-Z</option>
              </select>
            </div>
          </div>

          {isFiltered && (
            <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: "var(--color-textSecondary)" }}>Filtros ativos:</span>
              {tituloBusca && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-primaryLightest)", color: "var(--color-primary)", padding: "4px 10px", borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                  {hasMedidaFilter ? `Medida: ${tituloBusca}` : `Busca: "${tituloBusca}"`}
                  <button onClick={clearSearch} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
                </span>
              )}
              {hasMedidaFilter && larguraQ && <span style={{ background: "#f6f5ff", border: "1px solid #e8e0ff", color: "#4c0082", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{larguraQ}</span>}
              {hasMedidaFilter && perfilQ && <span style={{ background: "#f6f5ff", border: "1px solid #e8e0ff", color: "#4c0082", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{perfilQ}</span>}
              {hasMedidaFilter && aroQ && <span style={{ background: "#f6f5ff", border: "1px solid #e8e0ff", color: "#4c0082", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>R{aroQ}</span>}
              {selectedBrand && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "var(--color-primaryLightest)", color: "var(--color-primary)", padding: "4px 10px", borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                  Marca: {selectedBrand}
                  <button onClick={() => setSelectedBrand(null)} style={{ background: "none", border: "none", color: "var(--color-primary)", cursor: "pointer", fontSize: 14, lineHeight: 1 }}>×</button>
                </span>
              )}
              <button onClick={clearSearch} style={{ fontSize: 12, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Limpar filtros</button>
            </div>
          )}
        </div>
      </div>

      <main style={{ maxWidth: 1240, margin: "0 auto", padding: "24px 20px", width: "100%", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Sidebar Filtros — clone visual do original */}
        <aside style={{ width: 260, flexShrink: 0, background: "white", borderRadius: 12, border: "1px solid #f0f0f0", overflow: "hidden", position: "sticky", top: 16 }} className="hidden md:block">
          <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Filtros</h2>
            {isFiltered && (
              <button onClick={clearSearch} style={{ fontSize: 12, color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer" }}>Limpar</button>
            )}
          </div>

          <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>Marca</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 200, overflowY: "auto" }}>
              <button
                onClick={() => setSelectedBrand(null)}
                style={{ textAlign: "left", background: selectedBrand === null ? "var(--color-primaryLightest)" : "transparent", border: "1px solid", borderColor: selectedBrand === null ? "var(--color-primary)" : "#f0f0f0", borderRadius: 6, padding: "6px 10px", fontSize: 13, cursor: "pointer", color: selectedBrand === null ? "var(--color-primary)" : "var(--color-textBase)", fontWeight: selectedBrand === null ? 600 : 400 }}
              >
                Todas as marcas ({allProducts.length})
              </button>
              {brands.map((b) => {
                const count = allProducts.filter((p) => p.brand === b).length;
                const active = selectedBrand === b;
                return (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(active ? null : b)}
                    style={{ textAlign: "left", background: active ? "var(--color-primaryLightest)" : "transparent", border: "1px solid", borderColor: active ? "var(--color-primary)" : "#f0f0f0", borderRadius: 6, padding: "6px 10px", fontSize: 13, cursor: "pointer", color: active ? "var(--color-primary)" : "var(--color-textBase)", fontWeight: active ? 600 : 400, display: "flex", justifyContent: "space-between", alignItems: "center" }}
                  >
                    <span>{b}</span>
                    <span style={{ fontSize: 11, color: "var(--color-textSecondary)", background: "#f5f5f5", padding: "2px 6px", borderRadius: 10 }}>{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>Categoria</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "var(--color-textSecondary)" }}>
              <span>• Pneus de carro ({allProducts.filter((p) => p.name.toLowerCase().includes("carro") || p.name.includes("Aro 1") ).length || 9})</span>
              <span>• Pneus de moto ({allProducts.filter((p) => p.name.toLowerCase().includes("moto")).length})</span>
              <span>• Caminhão e ônibus ({allProducts.filter((p) => p.name.includes("17.5")).length})</span>
              <span>• Bicicleta ({allProducts.filter((p) => p.name.toLowerCase().includes("bicicleta")).length})</span>
            </div>
          </div>

          <div style={{ padding: "16px" }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: 0.5 }}>Preço</h3>
            <div style={{ fontSize: 12, color: "var(--color-textSecondary)", lineHeight: 1.6 }}>
              <div>PIX com até 30% OFF</div>
              <div style={{ marginTop: 8, padding: "8px", background: "#fafafa", borderRadius: 6, border: "1px solid #f0f0f0" }}>
                <div style={{ fontWeight: 600, color: "var(--color-textBase)" }}>Dica:</div>
                <div>Digite o nome, marca ou medida (ex: 195/55R16) na busca acima.</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Grid de produtos */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {filtered.length === 0 ? (
            <div style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", padding: "48px 24px", textAlign: "center" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fff1f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid #ffccc7" }}>
                <span style={{ fontSize: 32 }}>🔍</span>
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-textBase)", margin: "0 0 8px" }}>Nenhum produto encontrado</h2>
              <p style={{ fontSize: 14, color: "var(--color-textSecondary)", margin: "0 0 6px" }}>
                Não encontramos resultados para <strong style={{ color: "var(--color-textBase)" }}>&quot;{tituloBusca || query}&quot;</strong>
                {selectedBrand ? ` na marca ${selectedBrand}` : ""} {hasMedidaFilter ? `— medida ${medidaAtiva}` : ""}.
              </p>
              <p style={{ fontSize: 13, color: "var(--color-textSecondary)", margin: "0 0 20px" }}>
                Verifique se digitou corretamente, tente termos mais genéricos (ex: &quot;continental&quot;, &quot;195/55&quot;, &quot;moto&quot;) ou limpe os filtros.
              </p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <button
                  onClick={clearSearch}
                  style={{ padding: "10px 20px", borderRadius: 8, background: "var(--color-primary)", color: "white", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                >
                  Limpar busca e ver todos
                </button>
                <Link href="/" style={{ padding: "10px 20px", borderRadius: 8, background: "white", color: "var(--color-primary)", border: "1px solid var(--color-primary)", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                  Voltar para home
                </Link>
              </div>

              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #f0f0f0", textAlign: "left", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
                <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 8px" }}>Sugestões:</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["continental", "maggion", "pirelli", "195/55", "aro 16", "moto"].map((s) => (
                    <button key={s} onClick={() => (window.location.href = `/todos?title=${encodeURIComponent(s)}`)} style={{ padding: "6px 12px", borderRadius: 16, background: "#fafafa", border: "1px solid #f0f0f0", fontSize: 12, cursor: "pointer" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 24, fontSize: 12, color: "var(--color-textSecondary)" }}>
                Produtos disponíveis: {allProducts.length} • Tente buscar por marca, modelo ou medida.
              </div>
            </div>
          ) : (
            <>
              {/* Mobile filtros */}
              <div className="md:hidden" style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
                <button
                  onClick={() => setSelectedBrand(null)}
                  style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: selectedBrand === null ? 700 : 400, background: selectedBrand === null ? "var(--color-primary)" : "white", color: selectedBrand === null ? "white" : "var(--color-textBase)", border: "1px solid", borderColor: selectedBrand === null ? "var(--color-primary)" : "#d9d9d9", cursor: "pointer" }}
                >
                  Todas
                </button>
                {brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(selectedBrand === b ? null : b)}
                    style={{ whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 16, fontSize: 12, fontWeight: selectedBrand === b ? 700 : 400, background: selectedBrand === b ? "var(--color-primary)" : "white", color: selectedBrand === b ? "white" : "var(--color-textBase)", border: "1px solid", borderColor: selectedBrand === b ? "var(--color-primary)" : "#d9d9d9", cursor: "pointer" }}
                  >
                    {b}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                {paginated.map((p) => (
                  <div key={p.slug} style={{ background: "white", borderRadius: 12, border: "1px solid #f0f0f0", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", transition: "box-shadow 0.2s" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)")} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                    <Link href={`/produto/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <div style={{ position: "relative", aspectRatio: "1/1", background: "#fafafa", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
                        <img src={`${STATIC_BASE}/${p.images[0]}?w=400&q=75`} alt={p.name} style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }} />
                        {p.inmetro && (
                          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", gap: 4 }}>
                            <span style={{ fontSize: 10, fontWeight: 700, background: "#FFED00", padding: "2px 6px", borderRadius: 4 }}>{p.inmetro.rollingResistance}</span>
                            <span style={{ fontSize: 10, fontWeight: 700, background: "#C8D400", padding: "2px 6px", borderRadius: 4 }}>{p.inmetro.wetGrip}</span>
                          </div>
                        )}
                      </div>
                    </Link>
                    <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                      <div style={{ height: 20, display: "flex", alignItems: "center" }}>
                        <img src={`/${p.brandLogo}`} alt={p.brand} style={{ maxHeight: 18, maxWidth: 80, objectFit: "contain" }} />
                      </div>
                      <Link href={`/produto/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <h3 style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: "#1a1a1a", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: 36, margin: 0 }}>{p.name}</h3>
                      </Link>
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Stars count={p.stars} />
                        <span style={{ fontSize: 11, color: "var(--color-textSecondary)" }}>({p.reviews})</span>
                        <span style={{ fontSize: 11, color: "var(--color-textSecondary)", marginLeft: "auto" }}>ID: {p.id}</span>
                      </div>
                      <div style={{ marginTop: "auto", paddingTop: 4 }}>
                        <div style={{ fontSize: 11, color: "var(--color-textSecondary)", textDecoration: "line-through" }}>R$ {p.origPrice}</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--color-primary)" }}>R$ {p.pixPrice}</span>
                          <span style={{ fontSize: 10, fontWeight: 700, background: "var(--color-primary)", color: "white", padding: "2px 6px", borderRadius: 4 }}>PIX</span>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          openCheckout({
                            product: { name: p.name, amount_cents: brlToCents(p.pixPrice), slug: p.slug, id: p.id },
                            quantity: 1,
                          })
                        }
                        style={{ width: "100%", padding: "8px", borderRadius: 6, background: "var(--color-primary)", color: "white", fontSize: 12, fontWeight: 700, border: "none", cursor: "pointer", marginTop: 4 }}
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginação — 20 por página */}
              {totalPages > 1 && (
                <div style={{ marginTop: 24, display: "flex", justifyContent: "center", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                    style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #d9d9d9", background: currentPage === 1 ? "#f5f5f5" : "white", color: currentPage === 1 ? "#bfbfbf" : "var(--color-primary)", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    ← Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
                    .reduce((acc: (number | string)[], page, idx, arr) => {
                      if (idx > 0 && typeof acc[acc.length - 1] === "number" && (page as number) - (acc[acc.length - 1] as number) > 1) acc.push("...");
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === "..." ? (
                        <span key={`ellipsis-${idx}`} style={{ padding: "8px 4px", color: "var(--color-textSecondary)", fontSize: 13 }}>…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => goToPage(item as number)}
                          aria-label={`Ir para página ${item}`}
                          aria-current={currentPage === item ? "page" : undefined}
                          style={{
                            minWidth: 36,
                            height: 36,
                            borderRadius: 8,
                            border: "1px solid",
                            borderColor: currentPage === item ? "var(--color-primary)" : "#d9d9d9",
                            background: currentPage === item ? "var(--color-primary)" : "white",
                            color: currentPage === item ? "white" : "var(--color-textBase)",
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: currentPage === item ? 700 : 500,
                          }}
                        >
                          {item}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Próxima página"
                    style={{ padding: "8px 14px", borderRadius: 8, border: "1px solid #d9d9d9", background: currentPage === totalPages ? "#f5f5f5" : "white", color: currentPage === totalPages ? "#bfbfbf" : "var(--color-primary)", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 600 }}
                  >
                    Próxima →
                  </button>
                </div>
              )}

              <div style={{ marginTop: 16, display: "flex", justifyContent: "center", alignItems: "center", gap: 12, fontSize: 13, color: "var(--color-textSecondary)", flexWrap: "wrap" }}>
                <span>
                  Exibindo {paginated.length} de {filtered.length} {filtered.length === 1 ? "produto" : "produtos"} {filtered.length !== allProducts.length ? `filtrados de ${allProducts.length}` : `de ${allProducts.length}`} • Página {currentPage} de {totalPages}
                </span>
                {isFiltered && <button onClick={clearSearch} style={{ color: "var(--color-primary)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: 13 }}>Limpar busca</button>}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function TodosPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>Carregando...</div>}>
      <TodosContent />
    </Suspense>
  );
}
