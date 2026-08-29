"use client";

import { useEffect, useState } from "react";

type Tracking = {
  code: string;
  carrierCode?: string;
  stage: string;
  customerName: string;
  customerEmail: string;
  orderId: string;
  product: { name: string; qty: number };
  createdAt: string;
  origin: string;
  destination: string;
};

export default function AdminRastreio() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("admin_rastreio_authed") === "1") setAuthed(true);
  }, []);

  const tryAuth = async () => {
    const r = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pass }) });
    const j = await r.json();
    if (j.ok) {
      localStorage.setItem("admin_rastreio_authed", "1");
      setAuthed(true);
      setAuthError("");
    } else setAuthError("Senha incorreta");
  };

  const [list, setList] = useState<Tracking[]>([]);
  const [form, setForm] = useState({ customerName: "", customerEmail: "", orderId: "", productName: "Pneu 205/55R16 Pirelli", qty: 1, origin: "CD São Paulo — SP", destination: "Curitiba — PR" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const r = await fetch("/api/tracking");
    const j = await r.json();
    setList(j.trackings || []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.customerEmail || !form.orderId) {
      setMsg("Preencha e-mail e Order ID");
      return;
    }
    setLoading(true);
    setMsg("Criando...");
    const r = await fetch("/api/tracking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const j = await r.json();
    setLoading(false);
    if (!r.ok) setMsg("Erro: " + (j.error || "falha"));
    else {
      setMsg(`✅ Criado! Código: ${j.tracking.code} | Link: ${j.link}`);
      setForm({ ...form, orderId: "", customerEmail: "", customerName: "" });
      load();
    }
  };

  const generateCarrier = async (code: string) => {
    setMsg(`Gerando BR para ${code}...`);
    const r = await fetch(`/api/tracking/${encodeURIComponent(code)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ generateCarrier: true }) });
    const j = await r.json();
    if (!r.ok) setMsg("Erro: " + j.error);
    else setMsg(`✅ Carrier gerado: ${j.tracking.carrierCode} (simula os 2 dias) — timeline atualizada para "Em trânsito"`);
    load();
  };

  const updateStage = async (code: string, stage: string) => {
    const r = await fetch(`/api/tracking/${encodeURIComponent(code)}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage }) });
    const j = await r.json();
    if (!r.ok) setMsg("Erro: " + j.error);
    else setMsg(`✅ Atualizado para ${stage}`);
    load();
  };

  const del = async (code: string) => {
    if (!confirm(`Excluir ${code}?`)) return;
    await fetch(`/api/tracking/${encodeURIComponent(code)}`, { method: "DELETE" });
    load();
  };

  const copyLink = async (code: string) => {
    const link = `${window.location.origin}/rastreio?code=${encodeURIComponent(code)}`;
    await navigator.clipboard.writeText(link);
    setMsg(`🔗 Link copiado: ${link}`);
  };

  if (!authed) {
    return (
      <main className="min-h-screen bg-[#F8F5FF] grid place-items-center p-6">
        <div className="w-full max-w-[420px] bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-[#4e008e] grid place-items-center text-white font-black mx-auto">PS</div>
          <h1 className="text-center text-lg font-black mt-3">Acesso restrito</h1>
          <p className="text-center text-xs text-zinc-500 mt-1">Painel de rastreio — digite a senha definida em <code className="bg-zinc-100 px-1 rounded">ADMIN_PASSWORD</code></p>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key === "Enter" && tryAuth()} placeholder="Senha do admin" className="mt-4 w-full h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white focus:border-[#4e008e] focus:outline-none focus:ring-2 focus:ring-[#4e008e]/15" />
          {authError && <p className="text-xs text-red-600 mt-2">{authError}</p>}
          <button onClick={tryAuth} className="mt-3 w-full h-11 rounded-full bg-[#4e008e] text-white font-bold hover:bg-[#3e0072]">Entrar</button>
          <p className="text-[11px] text-zinc-400 text-center mt-3">Dica: defina <code>ADMIN_PASSWORD</code> na Vercel. Padrão local: <code>admin123</code></p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F5FF] p-4 sm:p-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#4e008e] grid place-items-center text-white font-black">PS</div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-zinc-900">Painel de Rastreio</h1>
              <p className="text-xs text-zinc-500 -mt-0.5">Gere códigos, atualize status e copie o link do rastreio — sem quebrar o visual da página linda</p>
            </div>
            <div className="ml-auto flex gap-2">
              <button onClick={() => { localStorage.removeItem("admin_rastreio_authed"); setAuthed(false); }} className="h-9 px-3 rounded-full bg-zinc-100 text-xs font-bold">Sair</button>
              <a href="/rastreio" target="_blank" className="h-9 px-4 rounded-full bg-white border border-zinc-200 text-sm font-bold hover:bg-zinc-50 grid place-items-center">Ver rastreio →</a>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-zinc-200 p-6">
          <h2 className="font-bold text-sm tracking-[0.08em] uppercase text-zinc-700">+ Novo rastreio</h2>
          <p className="text-xs text-zinc-500 mt-1">Cria um código <b>PS-...</b> e libera o rastreio na hora. O link já funciona sem login.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            <input placeholder="Nome do cliente *" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white focus:border-[#4e008e] focus:outline-none focus:ring-2 focus:ring-[#4e008e]/15" />
            <input placeholder="E-mail do cliente *" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white focus:border-[#4e008e] focus:outline-none focus:ring-2 focus:ring-[#4e008e]/15" />
            <input placeholder="Order ID * (ex: ped_123)" value={form.orderId} onChange={(e) => setForm({ ...form, orderId: e.target.value })} className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white focus:border-[#4e008e] focus:outline-none focus:ring-2 focus:ring-[#4e008e]/15" />
            <input placeholder="Produto" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm focus:bg-white focus:border-[#4e008e] focus:outline-none focus:ring-2 focus:ring-[#4e008e]/15 sm:col-span-2 lg:col-span-1" />
            <input placeholder="Origem" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm" />
            <input placeholder="Destino" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm" />
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={create} disabled={loading} className="h-11 px-7 rounded-full bg-[#4e008e] text-white font-bold text-sm hover:bg-[#3e0072] disabled:opacity-60 shadow-sm">{loading ? "Criando..." : "Gerar código →"}</button>
            <button onClick={load} className="h-11 px-5 rounded-full bg-white border border-zinc-200 font-bold text-sm hover:bg-zinc-50">Atualizar lista</button>
          </div>
          {msg && <div className="mt-4 rounded-xl bg-[#F8F5FF] border border-[#4e008e]/15 p-3 text-sm font-mono text-zinc-700 break-all whitespace-pre-wrap">{msg}</div>}
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-zinc-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex flex-wrap gap-3 items-center justify-between">
            <h3 className="font-bold text-sm">Rastreios criados ({list.length})</h3>
            <div className="flex gap-2">
              <span className="text-[11px] tracking-[0.08em] uppercase font-bold text-zinc-400">Sem login necessário</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 self-center" />
            </div>
          </div>
          <div className="divide-y divide-zinc-100">
            {list.map((t) => (
              <div key={t.code} className="px-4 sm:px-6 py-4 flex flex-col lg:flex-row lg:items-center gap-3 justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-black text-sm tracking-[0.06em] bg-zinc-900 text-white px-2.5 py-1 rounded-full">{t.code}</span>
                    {t.carrierCode && <span className="font-mono font-bold text-xs bg-[#4e008e] text-white px-2.5 py-1 rounded-full">→ {t.carrierCode}</span>}
                    <span className="text-[11px] tracking-[0.1em] uppercase font-bold px-2 py-1 rounded-full bg-[#F8F5FF] border border-[#4e008e]/10 text-[#4e008e]">{t.stage}</span>
                  </div>
                  <div className="text-xs text-zinc-600 mt-1.5 truncate">{t.customerName} • {t.customerEmail} • Pedido {t.orderId}</div>
                  <div className="text-xs text-zinc-500">{t.product.name} • {t.origin} → {t.destination}</div>
                  <div className="text-[11px] text-zinc-400">{new Date(t.createdAt).toLocaleString("pt-BR")}</div>
                </div>
                <div className="flex flex-wrap gap-2 shrink-0">
                  <a href={`/rastreio?code=${encodeURIComponent(t.carrierCode || t.code)}`} target="_blank" className="h-8 px-3 rounded-full bg-[#4e008e] text-white grid place-items-center text-xs font-bold hover:bg-[#3e0072]">Ver rastreio</a>
                  <button onClick={() => copyLink(t.carrierCode || t.code)} className="h-8 px-3 rounded-full bg-white border border-zinc-200 text-xs font-bold hover:bg-zinc-50">Copiar link</button>
                  {!t.carrierCode && (
                    <button onClick={() => generateCarrier(t.code)} className="h-8 px-3 rounded-full bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700">Gerar BR (2 dias)</button>
                  )}
                  <select onChange={(e) => e.target.value && updateStage(t.code, e.target.value)} defaultValue="" className="h-8 rounded-full border border-zinc-200 bg-white px-2 text-xs font-bold">
                    <option value="">Mover para...</option>
                    <option value="pedido_confirmado">Pedido confirmado</option>
                    <option value="processamento">Processando</option>
                    <option value="transito">Em trânsito</option>
                    <option value="entrega">Entrega</option>
                  </select>
                  <button onClick={() => del(t.code)} className="h-8 w-8 grid place-items-center rounded-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100" title="Excluir">×</button>
                </div>
              </div>
            ))}
            {list.length === 0 && <div className="p-10 text-center text-sm text-zinc-500">Nenhum rastreio ainda. Crie o primeiro acima — o rastreio lindo continua intacto em <a href="/rastreio" className="text-[#4e008e] underline font-bold">/rastreio</a></div>}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm leading-6">
          <b>Como usar:</b>
          <ol className="list-decimal ml-5 mt-2 space-y-1">
            <li>Crie o rastreio no painel → copie o link <code className="bg-white px-1.5 py-0.5 rounded border">/rastreio?code=PS-...</code></li>
            <li>Envie esse link por e-mail/WhatsApp — abre sem login.</li>
            <li>Quando a transportadora liberar, clique em <b>Gerar BR</b> (simula os 2 dias) ou mude o status no dropdown — a timeline atualiza na hora pro cliente.</li>
            <li>O visual da página continua idêntico ao que você aprovou, sem ficar tudo amontoado.</li>
          </ol>
        </div>

        <p className="mt-6 text-center text-[11px] tracking-[0.08em] uppercase font-bold text-zinc-400">Painel local • dados em data/tracking.json • fácil de migrar pra Postgres depois</p>
      </div>
    </main>
  );
}
