"use client";

import { useState, useEffect } from "react";

type ViaCepResponse = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialCep: string;
  onConfirm: (cep: string, display: string, data: ViaCepResponse) => void;
};

function maskCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}

export default function CepLocationModal({ isOpen, onClose, initialCep, onConfirm }: Props) {
  const [cep, setCep] = useState(initialCep);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCep(initialCep);
      setError(null);
      setLoading(false);
      setGeoLoading(false);
    }
  }, [isOpen, initialCep]);

  // close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleContinuar = async () => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setError("Digite um CEP válido com 8 dígitos.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data: ViaCepResponse = await res.json();
      if ((data as any).erro) {
        setError("CEP não encontrado. Verifique e tente novamente.");
        setLoading(false);
        return;
      }
      const display =
        data.logradouro?.trim() ||
        (data.bairro ? `${data.bairro}, ${data.localidade}` : `${data.localidade} - ${data.uf}`) ||
        `CEP ${maskCep(digits)}`;
      onConfirm(maskCep(digits), display, data);
      onClose();
    } catch {
      setError("Erro ao consultar o CEP. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalização não suportada neste navegador.");
      return;
    }
    setGeoLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          // tenta reverse geocode via Nominatim para obter CEP
          const rev = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { Accept: "application/json" } }
          );
          const revData: any = await rev.json();
          const postcode: string | undefined = revData?.address?.postcode;
          if (postcode) {
            const digits = postcode.replace(/\D/g, "").slice(0, 8);
            if (digits.length === 8) {
              const via = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
              const viaData: ViaCepResponse = await via.json();
              if (!(viaData as any).erro) {
                const display =
                  viaData.logradouro?.trim() ||
                  (viaData.bairro ? `${viaData.bairro}, ${viaData.localidade}` : `${viaData.localidade} - ${viaData.uf}`);
                onConfirm(maskCep(digits), display, viaData);
                onClose();
                setGeoLoading(false);
                return;
              }
            }
          }
          // fallback: salva coords e mostra como localização ativada
          const display = revData?.display_name
            ? revData.display_name.split(",")[0]
            : "Localização ativada";
          const mock: ViaCepResponse = {
            cep: "",
            logradouro: display,
            complemento: "",
            bairro: "",
            localidade: "",
            uf: "",
          };
          onConfirm("", display, mock);
          // salva coords separadamente
          try {
            localStorage.setItem("pneustore_coords", JSON.stringify({ latitude, longitude }));
          } catch {}
          onClose();
        } catch {
          setError("Não foi possível obter o endereço pela localização. Tente inserir o CEP manualmente.");
        } finally {
          setGeoLoading(false);
        }
      },
      (err) => {
        if (err.code === 1) setError("Permissão de localização negada. Insira o CEP manualmente.");
        else setError("Não foi possível obter sua localização. Tente inserir o CEP.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cep-modal-title"
    >
      {/* Overlay */}
      <button
        aria-label="Fechar modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-[420px] bg-[#FFFDF5] rounded-[16px] shadow-[0_16px_40px_rgba(0,0,0,0.18)] border border-[#F2EAD8] px-6 py-6 sm:px-7 sm:py-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-1">
          <div>
            <h2 id="cep-modal-title" className="text-[18px] font-bold text-[#1a1a1a] leading-tight">
              Ative sua localização
            </h2>
            <p className="text-[13px] text-[#6b6b6b] mt-1">Para uma melhor experiência com fretes e prazos!</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6b6b6b] hover:bg-black/5 transition-colors shrink-0 -mr-1 -mt-1"
          >
            <span className="text-[18px] leading-none">✕</span>
          </button>
        </div>

        {/* Opção 1 */}
        <button
          onClick={handleUseLocation}
          disabled={geoLoading}
          className="mt-5 w-full h-[44px] rounded-full border border-[#4e008e] text-[#4e008e] bg-transparent font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#4e008e]/5 transition-colors disabled:opacity-60"
        >
          <svg width="16" height="16" fill="none" viewBox="0 0 18 18" aria-hidden>
            <path
              d="M15 7.5C15 12 9 16.5 9 16.5C9 16.5 3 12 3 7.5C3 5.9087 3.63214 4.38258 4.75736 3.25736C5.88258 2.13214 7.4087 1.5 9 1.5C10.5913 1.5 12.1174 2.13214 13.2426 3.25736C14.3679 4.38258 15 5.9087 15 7.5Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {geoLoading ? "Buscando localização..." : "Usar minha localização atual"}
        </button>

        {/* Separador */}
        <p className="text-center text-[13px] text-[#6b6b6b] mt-4 mb-3">Se preferir, insira um CEP para continuar</p>

        {/* Campo CEP */}
        <div className="relative">
          <input
            value={cep}
            onChange={(e) => {
              setCep(maskCep(e.target.value));
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleContinuar();
            }}
            placeholder="00000-000"
            inputMode="numeric"
            maxLength={9}
            autoFocus
            className="w-full h-11 rounded-full border border-zinc-200 bg-white pl-4 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#4e008e]/20 focus:border-[#4e008e] placeholder:text-zinc-400"
          />
        </div>
        {error && <p className="text-[12px] text-red-600 mt-2">{error}</p>}

        {/* Botões Limpar / Continuar */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={() => {
              setCep("");
              setError(null);
            }}
            className="h-[42px] rounded-full border border-[#4e008e] text-[#4e008e] bg-transparent font-semibold text-[14px] hover:bg-[#4e008e]/5 transition-colors"
          >
            Limpar CEP
          </button>
          <button
            type="button"
            onClick={handleContinuar}
            disabled={loading}
            className="h-[42px] rounded-full bg-[#4e008e] text-white font-semibold text-[14px] hover:bg-[#3a006e] transition-colors disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? "Buscando..." : "Continuar"}
          </button>
        </div>

        {/* Link ajuda */}
        <div className="text-center mt-4">
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-[#4e008e] underline underline-offset-2 hover:text-[#3a006e]"
          >
            Não sei meu CEP
          </a>
        </div>
      </div>
    </div>
  );
}
