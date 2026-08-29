"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { products } from "@/lib/products";

const ADMIN_PASS = "pneustore2025"; // senha local - troque em .env se quiser

export default function LocalAdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 20;

  const allProducts = useMemo(() => Object.values(products), []);
  const brands = useMemo(() => [...new Set(allProducts.map((p) => p.brand))].sort(), [allProducts]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allProducts;
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q)
    );
  }, [allProducts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const stats = useMemo(() => {
    const total = allProducts.length;
    const totalBrands = brands.length;
    const avgPix =
      allProducts.reduce((acc, p) => acc + parseFloat(p.pixPrice.replace(/\./g, "").replace(",", ".")), 0) /
      total;
    const withReviews = allProducts.filter((p) => p.reviews > 0).length;
    const topRated = [...allProducts].sort((a, b) => b.reviews - a.reviews).slice(0, 3);
    return { total, totalBrands, avgPix, withReviews, topRated };
  }, [allProducts, brands]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === ADMIN_PASS) {
      setAuthed(true);
      setError("");
    } else {
      setError("Senha incorreta. Dica: pneusstore2025");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#0f0a1e] flex items-center justify-center p-4">
        <div className="w-full max-w-[420px] bg-white rounded-[16px] shadow-2xl overflow-hidden">
          <div className="bg-[#3a0ca3] px-6 py-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">PS</div>
              <div>
                <h1 className="font-bold leading-none text-[16px]">LocalAdmin</h1>
                <p className="text-white/70 text-xs">PneuStore • acesso local</p>
              </div>
              <span className="ml-auto text-[10px] bg-white/15 px-2 py-1 rounded-full">v1.0</span>
            </div>
          </div>
          <form onSubmit={handleLogin} className="p-6 space-y-4">
            <div>
              <p className="text-sm text-zinc-600">Área restrita para administração local. Insira a senha para continuar.</p>
              <p className="text-[11px] text-zinc-400 mt-1">Padrão: <code className="bg-zinc-100 px-1 py-0.5 rounded">pneustore2025</code> (defina em <code>LOCALADMIN_PASS</code>)</p>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-700">Senha</label>
              <input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full h-[44px] rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a0ca3]/20 focus:border-[#3a0ca3]"
                autoFocus
              />
              {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full h-[44px] rounded-xl bg-[#3a0ca3] text-white text-sm font-semibold hover:bg-[#2f0a85] transition-colors"
            >
              Entrar no LocalAdmin
            </button>
            <div className="flex gap-2 text-xs justify-center text-zinc-500">
              <Link href="/" className="hover:underline">← Voltar à loja</Link>
              <span>•</span>
              <Link href="/todos" className="hover:underline">Ver /todos</Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f8] text-zinc-900">
      {/* Topbar */}
      <header className="sticky top-0 z-10 bg-[#1a0b3a] text-white border-b border-white/10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-[56px] flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#3a0ca3] flex items-center justify-center font-black text-xs">PS</div>
            <span className="font-bold text-sm">LocalAdmin</span>
            <span className="hidden md:inline text-xs bg-white/15 px-2 py-1 rounded-full">{stats.total} produtos</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-6 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-white text-[#3a0ca3] font-semibold">Dashboard</span>
            <Link href="/todos" className="px-3 py-1.5 rounded-full hover:bg-white/10">Loja /todos</Link>
            <Link href="/" className="px-3 py-1.5 rounded-full hover:bg-white/10">Home</Link>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-white/60">logado localmente</span>
            <button
              onClick={() => {
                setAuthed(false);
                setPass("");
              }}
              className="h-8 px-3 rounded-full bg-white/10 hover:bg-white/15 text-xs font-medium"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-2xl p-4 border border-zinc-200">
            <div className="text-[11px] tracking-wide font-semibold text-zinc-500 uppercase">Total produtos</div>
            <div className="text-2xl font-black mt-1">{stats.total}</div>
            <div className="text-xs text-zinc-500 mt-1">{stats.withReviews} com avaliações</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-zinc-200">
            <div className="text-[11px] tracking-wide font-semibold text-zinc-500 uppercase">Marcas</div>
            <div className="text-2xl font-black mt-1">{stats.totalBrands}</div>
            <div className="text-xs text-zinc-500 mt-1 truncate" title={brands.join(", ")}>{brands.slice(0, 4).join(", ")}{brands.length > 4 ? " +..." : ""}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-zinc-200">
            <div className="text-[11px] tracking-wide font-semibold text-zinc-500 uppercase">Ticket médio PIX</div>
            <div className="text-2xl font-black mt-1">R$ {stats.avgPix.toFixed(2).replace(".", ",")}</div>
            <div className="text-xs text-emerald-600 mt-1">base products.ts</div>
          </div>
          <div className="bg-gradient-to-br from-[#3a0ca3] to-[#7209b7] rounded-2xl p-4 text-white">
            <div className="text-[11px] tracking-wide font-semibold text-white/70 uppercase">Atalhos</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Link href="/todos" className="text-xs bg-white text-[#3a0ca3] px-3 py-1.5 rounded-full font-semibold hover:bg-zinc-100">Abrir /todos</Link>
              <Link href="/" className="text-xs bg-white/15 px-3 py-1.5 rounded-full font-semibold hover:bg-white/20">Home</Link>
              <a href="https://pneustore-nextjs.vercel.app/todos" target="_blank" className="text-xs bg-white/15 px-3 py-1.5 rounded-full font-semibold hover:bg-white/20">Vercel</a>
            </div>
          </div>
        </div>

        {/* Top rated */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Mais avaliados</h2>
            <span className="text-xs text-zinc-500">{stats.topRated.length} destaques</span>
          </div>
          <div className="grid md:grid-cols-3 gap-3 mt-3">
            {stats.topRated.map((p) => (
              <Link key={p.id} href={`/produto/${p.slug}`} className="flex gap-3 p-3 rounded-xl border border-zinc-100 hover:border-[#3a0ca3]/20 hover:bg-zinc-50 transition-colors">
                <img src={`/public/${p.images[0]}`.replace("/public/", "/")} alt={p.name} className="w-16 h-16 object-contain bg-white rounded-lg border border-zinc-100"
                  onError={(e) => ((e.target as HTMLImageElement).src = `/${p.images[0]}`)}
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold leading-tight line-clamp-2">{p.name}</div>
                  <div className="text-[11px] text-zinc-500 mt-1">{p.brand} • {p.reviews} avaliações • ⭐ {p.stars}</div>
                  <div className="text-xs font-bold text-[#3a0ca3] mt-1">R$ {p.pixPrice} no PIX</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Tabela produtos */}
        <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="p-4 flex flex-col md:flex-row gap-3 md:items-center justify-between border-b border-zinc-100">
            <h2 className="text-sm font-bold">Catálogo • {filtered.length} / {allProducts.length}</h2>
            <div className="flex gap-2 flex-1 md:max-w-[420px] ml-auto">
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Buscar por nome, marca, ID ou slug…"
                  className="w-full h-10 rounded-full border border-zinc-200 bg-zinc-50 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#3a0ca3]/20 focus:border-[#3a0ca3]"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">⌕</span>
              </div>
              <select
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                value={brands.includes(query) ? query : ""}
                className="h-10 rounded-full border border-zinc-200 bg-white px-3 text-xs"
              >
                <option value="">Todas marcas</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 text-xs text-zinc-500">
                <tr>
                  <th className="text-left font-semibold px-4 py-3">Produto</th>
                  <th className="text-left font-semibold px-3 py-3">Marca</th>
                  <th className="text-left font-semibold px-3 py-3">ID</th>
                  <th className="text-right font-semibold px-3 py-3">PIX</th>
                  <th className="text-center font-semibold px-3 py-3">Aval.</th>
                  <th className="text-right font-semibold px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {paginated.map((p) => (
                  <tr key={p.slug} className="hover:bg-zinc-50/70">
                    <td className="px-4 py-3">
                      <div className="flex gap-3 items-center">
                        <img
                          src={`/${p.images[0]}`}
                          alt={p.name}
                          className="w-10 h-10 object-contain bg-white rounded-lg border border-zinc-100 shrink-0"
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            // fallback sem prefixo
                            if (!img.src.includes("/public/")) img.src = `/public/${p.images[0]}`;
                          }}
                        />
                        <div className="min-w-0">
                          <div className="font-medium leading-tight line-clamp-2 text-xs md:text-sm" title={p.name}>{p.name}</div>
                          <div className="text-[11px] text-zinc-500 truncate md:max-w-[420px]">{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs whitespace-nowrap">{p.brand}</td>
                    <td className="px-3 py-3 text-xs font-mono text-zinc-600">{p.id}</td>
                    <td className="px-3 py-3 text-right font-bold text-[#3a0ca3] whitespace-nowrap">R$ {p.pixPrice}</td>
                    <td className="px-3 py-3 text-center text-xs">{p.stars ? `⭐ ${p.stars}` : "—"} <span className="text-zinc-500">({p.reviews})</span></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1.5">
                        <Link href={`/produto/${p.slug}`} className="h-7 px-3 rounded-full border border-zinc-200 bg-white text-xs font-semibold hover:bg-zinc-50">Ver</Link>
                        <button
                          onClick={() => navigator.clipboard.writeText(`https://pneustore-nextjs.vercel.app/produto/${p.slug}`)}
                          className="h-7 px-3 rounded-full bg-[#3a0ca3] text-white text-xs font-semibold hover:bg-[#2f0a85]"
                          title="Copiar link"
                        >
                          Link
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-zinc-500">Nenhum produto encontrado para “{query}”.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 flex items-center justify-between border-t border-zinc-100">
            <span className="text-xs text-zinc-500">Página {page} de {totalPages} • {filtered.length} resultados</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-4 rounded-full border border-zinc-200 bg-white text-xs font-semibold disabled:opacity-40"
              >
                Anterior
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 px-4 rounded-full bg-[#3a0ca3] text-white text-xs font-semibold disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>

          <div className="px-4 pb-4">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
              <strong>Dica LocalAdmin:</strong> este painel é <em>somente leitura</em> sobre <code>src/lib/products.ts</code>. Para editar produtos, altere o arquivo e faça redeploy. Use o botão “Link” para copiar URL de produção e testar checkout BravoPay.
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-zinc-400">LocalAdmin • acesso local protegido • PneuStore Next.js • {new Date().getFullYear()}</p>
      </main>
    </div>
  );
}
