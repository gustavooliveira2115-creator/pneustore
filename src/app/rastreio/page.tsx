"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Types
type StageKey = "postado" | "processamento" | "transito" | "entrega";
type Status = "idle" | "loading" | "success" | "error";

type TimelineEvent = {
  date: string;
  time: string;
  title: string;
  desc: string;
  location: string;
  done: boolean;
  current?: boolean;
};

type TrackingData = {
  code: string;
  stage: StageKey;
  eta: string;
  etaLabel: string;
  origin: string;
  destination: string;
  lastUpdate: string;
  events: TimelineEvent[];
  product: { name: string; qty: number; image: string };
};

// Mock DB
const MOCK_DB: Record<string, TrackingData> = {
  BR123456789: {
    code: "BR123456789",
    stage: "transito",
    eta: "qui, 05 set",
    etaLabel: "Chega em 2 dias",
    origin: "CD São Paulo — SP",
    destination: "Curitiba — PR",
    lastUpdate: "há 3 horas",
    product: { name: "Pneu 205/55R16 Pirelli Cinturato", qty: 2, image: "◍" },
    events: [
      { date: "02 set", time: "14:32", title: "Pedido postado", desc: "Coletado pela transportadora", location: "São Paulo, SP", done: true },
      { date: "03 set", time: "09:10", title: "Em processamento", desc: "Nota fiscal emitida • NF-e 884192", location: "Barueri, SP", done: true },
      { date: "04 set", time: "16:45", title: "Em trânsito", desc: "Em rota para centro de distribuição", location: "Campinas → Curitiba", done: true, current: true },
      { date: "05 set", time: "—", title: "Saiu para entrega", desc: "Aguardando expedição final", location: "Curitiba, PR", done: false },
      { date: "05 set", time: "—", title: "Entregue", desc: "Assinatura ou portaria", location: "Destino", done: false },
    ],
  },
  PS2024BR: {
    code: "PS2024BR",
    stage: "entrega",
    eta: "hoje",
    etaLabel: "Saiu para entrega até 18h",
    origin: "CD Extrema — MG",
    destination: "Belo Horizonte — MG",
    lastUpdate: "há 18 min",
    product: { name: "Pneu 175/65R14 Goodyear Kelly", qty: 4, image: "◍" },
    events: [
      { date: "30 ago", time: "11:20", title: "Pedido postado", desc: "Coletado", location: "Extrema, MG", done: true },
      { date: "31 ago", time: "08:04", title: "Em processamento", desc: "Separação no CD", location: "Extrema, MG", done: true },
      { date: "02 set", time: "22:11", title: "Em trânsito", desc: "Transferência interestadual", location: "Extrema → BH", done: true },
      { date: "04 set", time: "07:30", title: "Saiu para entrega", desc: "Veículo BRA2E19 • Entregador: Marcos", location: "Belo Horizonte, MG", done: true, current: true },
      { date: "04 set", time: "—", title: "Entregue", desc: "Em breve", location: "Destino", done: false },
    ],
  },
  TEST123: {
    code: "TEST123",
    stage: "postado",
    eta: "ter, 10 set",
    etaLabel: "Postagem confirmada",
    origin: "CD São Paulo — SP",
    destination: "Porto Alegre — RS",
    lastUpdate: "há 1 dia",
    product: { name: "Pneu 195/55R15 Continental", qty: 1, image: "◍" },
    events: [
      { date: "03 set", time: "18:00", title: "Pedido postado", desc: "Etiqueta criada", location: "São Paulo, SP", done: true, current: true },
      { date: "—", time: "—", title: "Em processamento", desc: "Aguardando coleta", location: "—", done: false },
      { date: "—", time: "—", title: "Em trânsito", desc: "—", location: "—", done: false },
      { date: "—", time: "—", title: "Saiu para entrega", desc: "—", location: "—", done: false },
      { date: "—", time: "—", title: "Entregue", desc: "—", location: "—", done: false },
    ],
  },
};

const STAGES: { key: StageKey; label: string; short: string }[] = [
  { key: "postado", label: "Postado", short: "POST" },
  { key: "processamento", label: "Processando", short: "PROC" },
  { key: "transito", label: "Em trânsito", short: "ROTA" },
  { key: "entrega", label: "Entrega", short: "FIM" },
];

function stageIndex(s: StageKey) {
  return STAGES.findIndex((x) => x.key === s);
}

function RastreioInner() {
  const searchParams = useSearchParams();
  const urlCode = searchParams.get("code")?.toUpperCase() || "";
  const [code, setCode] = useState(urlCode);
  const [status, setStatus] = useState<Status>("idle");
  const [data, setData] = useState<TrackingData | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [autoLoaded, setAutoLoaded] = useState(false);

  const doSearch = async (raw: string) => {
    const trimmed = raw.trim().toUpperCase().replace(/\s/g, "");
    if (!trimmed) {
      setErrorMsg("Digite o código de rastreio.");
      setStatus("error");
      return;
    }
    if (trimmed.length < 3) {
      setErrorMsg("Código muito curto. Ex: BR123456789");
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch(`/api/tracking/${encodeURIComponent(trimmed)}`);
      if (res.ok) {
        const json = await res.json();
        const api = json.tracking;
        const stageMap: Record<string, StageKey> = { pedido_confirmado: "postado" } as any;
        const mapped: TrackingData = {
          code: api.code,
          stage: (stageMap[api.stage] || api.stage) as StageKey,
          eta: api.eta,
          etaLabel: api.etaLabel,
          origin: api.origin,
          destination: api.destination,
          lastUpdate: api.lastUpdate,
          product: { name: api.product.name, qty: api.product.qty, image: "◍" },
          events: api.events,
        };
        setData(mapped);
        setStatus("success");
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("code", trimmed);
          window.history.replaceState({}, "", url.toString());
        }
        return;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
    const found = MOCK_DB[trimmed];
    if (found) {
      setData(found);
      setStatus("success");
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("code", trimmed);
        window.history.replaceState({}, "", url.toString());
      }
    } else {
      setData(null);
      setErrorMsg(`Código "${trimmed}" não encontrado. Tente BR123456789, PS2024BR ou TEST123.`);
      setStatus("error");
    }
  };

  const handleSearch = () => doSearch(code);

  useEffect(() => {
    if (urlCode && !autoLoaded) {
      setAutoLoaded(true);
      doSearch(urlCode);
    }
  }, [urlCode, autoLoaded]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const copyCode = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const share = async () => {
    if (!data) return;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Rastreio ${data.code} — ${data.etaLabel}`;
    if (navigator.share) {
      try { await navigator.share({ title: text, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const progress = data ? ((stageIndex(data.stage) + 1) / STAGES.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F8F5FF] text-zinc-900 selection:bg-[#4e008e]/20">
      {/* Beautiful premium background — mesh + orbs + tire watermark */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Base */}
        <div className="absolute inset-0 bg-[#F8F5FF]" />
        {/* Hero purple block */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1600px] h-[640px] -translate-y-[120px] rounded-[60px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#4e008e] via-[#5b0fa8] to-[#3a0070]" />
          {/* mesh orbs */}
          <div className="absolute -top-20 -right-20 h-[520px] w-[720px] rounded-full opacity-[0.35] blur-[80px]" style={{ background: `radial-gradient(circle at 50% 50%, #68dcfa 0%, #8b5cf6 35%, transparent 70%)` }} />
          <div className="absolute -bottom-32 -left-32 h-[480px] w-[560px] rounded-full opacity-[0.25] blur-[70px]" style={{ background: `radial-gradient(circle at 50% 50%, #a78bfa 0%, transparent 70%)` }} />
          {/* subtle grid */}
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)`, backgroundSize: `40px 40px` }} />
          {/* vertical tread lines */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `repeating-linear-gradient(90deg, #fff 0 1px, transparent 1px 22px)` }} />
        </div>
        {/* Large faint tire watermark on hero right */}
        <div className="absolute top-[40px] right-[6%] hidden lg:block opacity-[0.06] rotate-12">
          <svg width="420" height="420" viewBox="0 0 200 200" fill="none">
            <circle cx="100" cy="100" r="78" stroke="white" strokeWidth="14" />
            <circle cx="100" cy="100" r="44" stroke="white" strokeWidth="8" />
            <circle cx="100" cy="100" r="12" fill="white" />
            {Array.from({ length: 16 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 22.5} 100 100)`}>
                <rect x="98" y="18" width="4" height="18" rx="2" fill="white" />
              </g>
            ))}
          </svg>
        </div>
        {/* bottom soft gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[400px] bg-gradient-to-t from-white to-transparent opacity-60" />
      </div>

      {/* Header — PneuStore official white */}
      <header className="relative z-30 bg-white/90 backdrop-blur-xl border-b border-zinc-200/60">
        <div className="mx-auto max-w-[1100px] px-6 h-[68px] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="flex items-center gap-3">
              {/* Logo — vetor perfeito em alta resolução (crisp) — baseado exatamente na sua imagem */}
              <img src="/pneustore-logo-perfect.svg" alt="PneuStore" className="hidden sm:block h-[34px] w-auto" />
              <img src="/pneustore-logo-perfect.svg" alt="PneuStore" className="sm:hidden h-[30px] w-auto" />
              <span className="hidden lg:inline-flex text-[10px] tracking-[0.14em] uppercase font-bold bg-[#4e008e] text-white px-2 py-1 rounded-full">Rastreio Oficial</span>
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-2 text-[12px] font-medium text-zinc-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Atendimento <b className="text-zinc-900">11 4000-1234</b>
            </span>
            <a href="/" className="inline-flex h-9 px-5 rounded-full bg-[#4e008e] text-white text-[13px] font-bold hover:bg-[#3e0072] transition shadow-sm">Voltar à loja</a>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1100px] px-6 pb-16">
        {/* Hero intro — now over purple */}
        <div className="pt-6 sm:pt-8 pb-8">
          <div className="max-w-[720px]">
            <p className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase font-bold text-white/90 bg-white/15 border border-white/20 rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#68dcfa]" /> Acompanhamento em tempo real
            </p>
            <h1 className="mt-4 text-[34px] sm:text-[48px] font-[800] tracking-[-0.04em] leading-[0.9] text-white">Onde está<br /> <span className="text-[#68dcfa]">seu pedido?</span></h1>
            <p className="mt-4 text-[15px] leading-6 text-white/75 max-w-[520px]">
              Interface minimalista, informação máxima — sem poluição. Digite o código e acompanhe cada etapa.
              <span className="text-white font-semibold"> Teste com BR123456789</span>
            </p>
          </div>
        </div>

        {/* Search Card — The hero element */}
        <div className="relative rounded-[24px] bg-white border border-zinc-200 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: `repeating-linear-gradient(90deg, #000 0 1px, transparent 1px 12px)` }} />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6 lg:items-end justify-between">
              <div className="flex-1 max-w-[640px]">
                <label htmlFor="track-input" className="text-[11px] tracking-[0.16em] uppercase font-semibold text-zinc-500">Código de rastreio</label>
                <div className="mt-2 flex gap-3">
                  <div className="relative flex-1 group">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
                    </span>
                    <input
                      id="track-input"
                      ref={inputRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="BR123456789  •  PS2024BR  •  TEST123"
                      spellCheck={false}
                      autoComplete="off"
                      className="w-full h-[56px] rounded-[14px] bg-zinc-50 border border-zinc-200 pl-11 pr-4 text-[15px] font-medium tracking-[0.02em] placeholder:text-zinc-400 focus:outline-none focus:bg-white focus:border-[#4e008e] focus:ring-[3px] focus:ring-[#4e008e]/15 transition"
                      aria-invalid={status === "error"}
                      aria-describedby="track-help"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="h-[56px] px-7 rounded-[14px] bg-[#4e008e] text-white font-semibold text-[14px] tracking-[-0.01em] hover:bg-[#3e0072] active:bg-[#360063] transition flex items-center gap-2 shrink-0 disabled:opacity-60"
                    disabled={status === "loading"}
                  >
                    {status === "loading" ? (
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14" /><path d="M13 5l7 7-7 7" /></svg>
                    )}
                    Rastrear
                  </button>
                </div>
                <p id="track-help" className="mt-2 text-[12.5px] text-zinc-500">Pressione Enter ou clique em rastrear. Códigos de teste disponíveis acima.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.keys(MOCK_DB).map((c) => (
                    <button
                      key={c}
                      onClick={() => setCode(c)}
                      className="px-3 py-1.5 rounded-full bg-zinc-900 text-white text-[11px] font-semibold tracking-[0.08em] uppercase hover:bg-black transition"
                    >
                      {c}
                    </button>
                  ))}
                  <span className="text-[12px] text-zinc-400 self-center ml-1">toque para preencher</span>
                </div>
              </div>

              {/* Micro info — PneuStore */}
              <div className="lg:w-[300px] rounded-2xl bg-[#4e008e] text-white p-4 flex gap-3 border border-[#4e008e]">
                <div className="h-9 w-9 rounded-xl bg-white grid place-items-center text-[#4e008e]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l1 4a2 2 0 0 1-.6 1.9l-1.4 1.4a16 16 0 0 0 5.6 5.6l1.4-1.4a2 2 0 0 1 1.9-.6l4 1A2 2 0 0 1 22 16.9z"/></svg>
                </div>
                <div className="text-[13px] leading-5">
                  <div className="font-bold tracking-tight text-white">Atendimento PneuStore</div>
                  <div className="text-white/70 text-[12px]">Seg–Sex 8h–19h • Sáb 8h–14h</div>
                  <div className="text-[12px] font-semibold text-[#68dcfa] mt-1">11 4000-1234 • ajuda@pneustore.com</div>
                </div>
              </div>
            </div>

            {/* Error inline */}
            {status === "error" && (
              <div role="alert" className="mt-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex gap-3 text-[13.5px] leading-5 text-red-800">
                <span className="mt-0.5">ⓘ</span>
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Bottom stripe */}
          <div className="h-[1px] bg-zinc-200" />
          <div className="px-6 sm:px-8 py-3 flex flex-wrap gap-x-6 gap-y-1 text-[11px] tracking-[0.08em] uppercase font-semibold text-zinc-400">
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Sistema atualizado agora</span>
            <span>Privacidade: código apenas local</span>
            <span>Sem cadastro</span>
          </div>
        </div>

        {/* Loading skeleton */}
        {status === "loading" && (
          <div className="mt-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-6 animate-pulse">
            <div className="rounded-[24px] bg-white border border-zinc-200 p-8 h-[420px] flex flex-col gap-6">
              <div className="h-4 w-32 bg-zinc-100 rounded" />
              <div className="h-10 w-64 bg-zinc-100 rounded" />
              <div className="h-[2px] bg-zinc-100" />
              <div className="flex gap-4">
                <div className="h-16 flex-1 bg-zinc-100 rounded-xl" />
                <div className="h-16 flex-1 bg-zinc-100 rounded-xl" />
              </div>
            </div>
            <div className="rounded-[24px] bg-white border border-zinc-200 p-8 h-[420px]">
              <div className="h-4 w-24 bg-zinc-100 rounded mb-6" />
              <div className="space-y-4">
                <div className="h-14 bg-zinc-100 rounded-xl" />
                <div className="h-14 bg-zinc-100 rounded-xl" />
                <div className="h-14 bg-zinc-100 rounded-xl" />
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {status === "success" && data && (
          <div className="mt-8 space-y-6">
            {/* Status Hero — premium PneuStore gradient */}
            <div className="rounded-[24px] bg-gradient-to-br from-[#4e008e] via-[#3a006b] to-[#0A0A0B] text-white overflow-hidden relative border border-white/10 shadow-[0_16px_40px_rgba(78,0,142,0.25)]">
              {/* subtle grain */}
              <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")` }} />
              <div className="relative p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-3 py-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                      <span className="text-[11px] tracking-[0.14em] uppercase font-semibold">{STAGES[stageIndex(data.stage)].label} • {data.lastUpdate}</span>
                    </div>
                    <h2 className="mt-4 text-[30px] sm:text-[36px] font-[700] tracking-[-0.03em] leading-none">{data.etaLabel}</h2>
                    <p className="mt-2 text-white/60 text-[14px]">Previsão: <span className="text-white font-semibold">{data.eta}</span> • {data.destination}</p>

                    {/* Road Progress */}
                    <div className="mt-8">
                      <div className="flex justify-between text-[11px] tracking-[0.12em] uppercase font-semibold text-white/50 mb-3">
                        <span>{data.origin}</span>
                        <span>{data.destination}</span>
                      </div>
                      <div className="relative h-[44px] flex items-center">
                        {/* track */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-white/15 rounded-full" />
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-white rounded-full transition-all duration-700" style={{ width: `${progress}%` }} />
                        {/* tread dashes over progress */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full opacity-20" style={{ backgroundImage: `repeating-linear-gradient(90deg, white 0 6px, transparent 6px 14px)` }} />
                        <div className="relative w-full flex justify-between">
                          {STAGES.map((s, i) => {
                            const active = i <= stageIndex(data.stage);
                            const isCurrent = s.key === data.stage;
                            return (
                              <div key={s.key} className="flex flex-col items-center gap-2">
                                <div
                                  className={`h-9 w-9 rounded-full grid place-items-center border-2 transition-all duration-300 ${
                                    active ? "bg-white border-white text-zinc-900 shadow-[0_6px_20px_rgba(255,255,255,0.25)] scale-100" : "bg-transparent border-white/25 text-white/40"
                                  } ${isCurrent ? "ring-4 ring-white/20" : ""}`}
                                >
                                  <span className="text-[10px] font-black tracking-widest">{active ? "✓" : s.short.slice(0,1)}</span>
                                </div>
                                <span className={`text-[10px] tracking-[0.10em] uppercase font-semibold ${active ? "text-white" : "text-white/35"}`}>{s.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Code card */}
                  <div className="lg:w-[340px] shrink-0">
                    <div className="rounded-2xl bg-white text-zinc-900 p-5 border border-zinc-200">
                      <div className="text-[11px] tracking-[0.16em] uppercase font-semibold text-zinc-500">Código</div>
                      <div className="mt-1 font-mono text-[18px] font-bold tracking-[0.08em] flex items-center gap-2">
                        {data.code}
                        <button onClick={copyCode} className="ml-auto h-7 px-2.5 rounded-full bg-zinc-900 text-white text-[11px] font-semibold hover:bg-black transition">
                          {copied ? "Copiado ✓" : "Copiar"}
                        </button>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-[12.5px]">
                        <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                          <div className="text-[11px] uppercase tracking-[0.08em] font-semibold text-zinc-500">Produto</div>
                          <div className="font-semibold leading-tight mt-1">{data.product.name}</div>
                          <div className="text-zinc-500">Qtd: {data.product.qty}</div>
                        </div>
                        <div className="rounded-xl bg-[#4e008e] text-white p-3 flex flex-col justify-between">
                          <div className="text-[11px] uppercase tracking-[0.08em] font-semibold opacity-80">Previsão</div>
                          <div className="text-[18px] font-bold leading-none">{data.eta}</div>
                          <div className="text-[11px] opacity-80">Entrega padrão</div>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button onClick={share} className="flex-1 h-9 rounded-full bg-zinc-900 text-white text-[13px] font-medium hover:bg-black transition">Compartilhar</button>
                        <button onClick={() => { setStatus("idle"); setCode(""); setData(null); }} className="h-9 px-4 rounded-full bg-white border border-zinc-200 text-[13px] font-medium hover:bg-zinc-50 transition">Novo código</button>
                      </div>
                    </div>
                    <p className="mt-3 text-center text-[11px] text-white/50">Atualização automática a cada 30 min • ID: {data.code.slice(-6)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline + Map */}
            <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-6">
              {/* Timeline */}
              <div className="rounded-[24px] bg-white border border-zinc-200 p-6 sm:p-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-[13px] tracking-[0.16em] uppercase font-semibold">Histórico completo</h3>
                  <span className="text-[12px] text-zinc-500">{data.events.filter(e=>e.done).length} de {data.events.length} etapas</span>
                </div>

                <div className="mt-6 relative">
                  {/* vertical line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-zinc-100 hidden sm:block" />
                  <div
                    className="absolute left-[15px] top-2 w-[2px] bg-[#4e008e] hidden sm:block transition-all duration-700"
                    style={{ height: `${(data.events.filter(e=>e.done).length / data.events.length)*100}%` }}
                  />

                  <ol className="space-y-6">
                    {data.events.map((ev, idx) => (
                      <li key={idx} className="relative flex gap-4 sm:gap-5">
                        <div className={`relative z-10 h-[32px] w-[32px] rounded-full grid place-items-center border-2 shrink-0 mt-0.5 ${
                          ev.done ? "bg-[#4e008e] border-[#4e008e] text-white" : "bg-white border-zinc-200 text-zinc-400"
                        } ${ev.current ? "ring-4 ring-[#4e008e]/15" : ""}`}>
                          <span className="text-[12px] font-bold">{ev.done ? "✓" : "•"}</span>
                        </div>
                        <div className={`flex-1 rounded-2xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          ev.current ? "bg-[#4e008e]/[0.04] border-[#4e008e]/20" : ev.done ? "bg-white border-zinc-200" : "bg-zinc-50 border-zinc-100 opacity-70"
                        }`}>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[13px] font-semibold ${ev.current ? "text-[#4e008e]" : "text-zinc-900"}`}>{ev.title}</span>
                              {ev.current && <span className="text-[10px] tracking-[0.1em] uppercase font-bold bg-[#4e008e] text-white px-2 py-0.5 rounded-full">Atual</span>}
                            </div>
                            <div className="text-[13px] text-zinc-600 mt-0.5">{ev.desc}</div>
                            <div className="text-[11px] tracking-[0.06em] uppercase font-medium text-zinc-500 mt-1">{ev.location}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[12px] font-mono font-semibold text-zinc-900">{ev.date} • {ev.time}</div>
                            <div className={`text-[11px] font-medium ${ev.done ? "text-emerald-600" : "text-zinc-400"}`}>{ev.done ? "Confirmado" : "Pendente"}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Map / abstract route + help */}
              <div className="space-y-6">
                <div className="rounded-[24px] bg-white border border-zinc-200 overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-[13px] tracking-[0.16em] uppercase font-semibold">Rota estimada</h3>
                    <p className="text-[12.5px] text-zinc-500 mt-1">{data.origin} → {data.destination}</p>
                  </div>
                  {/* Abstract map */}
                  <div className="mx-6 rounded-2xl bg-zinc-50 border border-zinc-200 p-4 overflow-hidden">
                    <svg viewBox="0 0 320 140" className="w-full h-[140px]">
                      <path d="M20 90 Q 90 20, 160 70 T 300 50" fill="none" stroke="#e4e4e7" strokeWidth="2" strokeDasharray="6 8" />
                      <path d="M20 90 Q 90 20, 160 70 T 300 50" fill="none" stroke="#4e008e" strokeWidth="2.5" strokeDasharray="300" style={{ strokeDashoffset: data.stage === "entrega" ? "0" : data.stage === "transito" ? "80" : "160" }} />
                      <circle cx="20" cy="90" r="8" fill="#4e008e" />
                      <circle cx="20" cy="90" r="3" fill="white" />
                      <circle cx="300" cy="50" r="8" fill="white" stroke="#4e008e" strokeWidth="2" />
                      <circle cx="300" cy="50" r="3" fill="#4e008e" />
                      {/* truck */}
                      <g transform={`translate(${data.stage==="postado"?40:data.stage==="processamento"?90:data.stage==="transito"?165:270}, ${data.stage==="postado"?68:data.stage==="transito"?60:50})`}>
                        <rect x="-14" y="-10" width="28" height="14" rx="3" fill="#0A0A0B" />
                        <circle cx="-8" cy="6" r="4" fill="#0A0A0B" />
                        <circle cx="8" cy="6" r="4" fill="#0A0A0B" />
                        <rect x="-10" y="-6" width="12" height="6" rx="1" fill="white" opacity="0.9" />
                      </g>
                    </svg>
                    <div className="flex justify-between text-[11px] font-medium text-zinc-500 mt-2">
                      <span>Origem</span>
                      <span className="text-[#4e008e] font-semibold">{data.stage === "entrega" ? "Chegando" : "Em movimento"}</span>
                      <span>Destino</span>
                    </div>
                  </div>
                  <div className="px-6 pb-6 pt-4 flex gap-2">
                    <div className="flex-1 rounded-xl bg-zinc-900 text-white p-3 text-center">
                      <div className="text-[11px] uppercase tracking-[0.1em] font-semibold opacity-70">Distância</div>
                      <div className="text-[14px] font-bold">420 km</div>
                    </div>
                    <div className="flex-1 rounded-xl bg-white border border-zinc-200 p-3 text-center">
                      <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-zinc-500">Transportadora</div>
                      <div className="text-[14px] font-bold">JADLOG</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] bg-[#4e008e] text-white p-6">
                  <h4 className="font-semibold tracking-tight">Precisa de ajuda?</h4>
                  <p className="text-[13px] leading-5 text-white/70 mt-1">Se o status não atualizar em 48h, fale com nosso time. Tenha o código em mãos.</p>
                  <div className="mt-4 flex gap-2">
                    <a href="#" className="flex-1 h-9 rounded-full bg-white text-[#4e008e] grid place-items-center text-[13px] font-semibold">Falar no WhatsApp</a>
                    <a href="#" className="h-9 px-4 rounded-full bg-white/15 border border-white/20 grid place-items-center text-[13px] font-medium">Abrir ticket</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Idle empty state — premium feature grid */}
        {status === "idle" && (
          <div className="mt-8">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: "01", t: "Sem cadastro", d: "Cole o código e veja. Sem login, sem fricção.", icon: "◍" },
                { n: "02", t: "Tempo real", d: "Linha do tempo honesta, com hora e local confirmados.", icon: "◎" },
                { n: "03", t: "Compartilhável", d: "Copie e mande para quem vai receber.", icon: "↗" },
              ].map((f) => (
                <div key={f.n} className="group rounded-[20px] bg-white border border-zinc-200 p-6 hover:shadow-[0_8px_30px_rgba(78,0,142,0.08)] hover:border-[#4e008e]/15 transition-all">
                  <div className="h-9 w-9 rounded-xl bg-[#F6F2FF] border border-[#4e008e]/10 grid place-items-center text-[#4e008e] text-sm">{f.icon}</div>
                  <div className="mt-3 text-[11px] tracking-[0.14em] uppercase font-bold text-[#4e008e]">{f.n} • {f.t}</div>
                  <div className="mt-1.5 text-[13px] leading-5 text-zinc-500">{f.d}</div>
                </div>
              ))}
            </div>
            {/* Trust row — PneuStore selos */}
            <div className="mt-4 rounded-2xl bg-white border border-zinc-200 px-5 py-3.5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium text-zinc-500">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/> Compra segura</span>
              <span className="hidden sm:block h-3 w-px bg-zinc-200"/>
              <span>Até 18% OFF no Pix</span>
              <span className="hidden sm:block h-3 w-px bg-zinc-200"/>
              <span>10x sem juros</span>
              <span className="hidden sm:block h-3 w-px bg-zinc-200"/>
              <span className="inline-flex items-center gap-1"><span className="text-amber-500">★★★★★</span> 4,8 • 120k avaliações</span>
            </div>
          </div>
        )}

        <p className="mt-10 text-center text-[11px] tracking-[0.08em] uppercase font-medium text-zinc-400">PneuStore © 2026 • Página de rastreio minimalista • Feito para ser rápido no mobile</p>
      </main>

      {/* Footer PneuStore — com logo exata */}
      <footer className="relative z-10 mt-8 bg-[#4e008e] text-white">
        <div className="mx-auto max-w-[1100px] px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/pneustore-logo-perfect.svg" alt="PneuStore" className="h-[30px] w-auto brightness-0 invert" style={{ filter: 'brightness(0) invert(1)' }} />
            <div className="text-[13px] leading-tight">
              <div className="font-bold tracking-tight">PneuStore — Pneus com preço baixo</div>
              <div className="text-white/60 text-[11px]">Até 18% OFF no Pix • 10x sem juros • Compra segura</div>
            </div>
          </div>
          <div className="text-[11px] text-white/60 text-center sm:text-right">
            <div>© 1998–2026 PneuStore. Todos os direitos reservados.</div>
            <div className="text-white/40">Rastreio é apenas consulta — sem coleta de dados pessoais.</div>
          </div>
        </div>
        <div className="bg-white text-center py-3 text-[11px] tracking-[0.08em] uppercase font-medium text-zinc-500">Entrega garantida • Frete grátis em selecionados • Atendimento humano</div>
      </footer>

      <style>{`@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }`}</style>
    </div>
  );
}

export default function RastreioPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center bg-[#F8F5FF]"><div className="h-8 w-8 rounded-full border-2 border-[#4e008e]/30 border-t-[#4e008e] animate-spin" /></div>}>
      <RastreioInner />
    </Suspense>
  );
}
