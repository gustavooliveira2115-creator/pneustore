"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type CartItem = {
  slug: string;
  name: string;
  id: string;
  brand?: string | null;
  brandLogo?: string | null;
  image: string;
  curPrice: string; // "398,93"
  origPrice: string;
  priceCents: number; // curPrice em centavos
  origCents: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  totalCents: number;
  origTotalCents: number;
  discountCents: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, qty: number) => void;
  clear: () => void;
};

const CartCtx = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
}

function brlToCents(v: string): number {
  const digits = v.replace(/\./g, "").replace(",", "");
  const n = parseInt(digits, 10);
  return Number.isFinite(n) ? n : 0;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("pneustore_cart");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("pneustore_cart", JSON.stringify(items));
    } catch {}
  }, [items]);

  // lock scroll when open
  useEffect(() => {
    if (isOpen) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  const count = useMemo(() => items.reduce((a, b) => a + b.quantity, 0), [items]);
  const totalCents = useMemo(() => items.reduce((a, b) => a + b.priceCents * b.quantity, 0), [items]);
  const origTotalCents = useMemo(() => items.reduce((a, b) => a + b.origCents * b.quantity, 0), [items]);
  const discountCents = origTotalCents - totalCents;

  const addItem = (item: Omit<CartItem, "quantity">, qty = 1) => {
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.slug === item.slug);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (slug: string) => {
    setItems((prev) => prev.filter((p) => p.slug !== slug));
  };

  const updateQuantity = (slug: string, qty: number) => {
    if (qty < 1) {
      removeItem(slug);
      return;
    }
    setItems((prev) => prev.map((p) => (p.slug === slug ? { ...p, quantity: qty } : p)));
  };

  const clear = () => setItems([]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartCtx.Provider
      value={{
        items,
        count,
        totalCents,
        origTotalCents,
        discountCents,
        isOpen,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        clear,
      }}
    >
      {children}
      <SideCart />
    </CartCtx.Provider>
  );
}

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function SideCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalCents, origTotalCents, discountCents } = useCart();
  const router = useRouter();

  if (!isOpen) return null;

  const totalPIX = totalCents;
  // parcelado 10x sem juros fictício
  const parcelado = totalCents;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[90] flex justify-end"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeCart();
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeCart} />

      {/* Drawer - container principal com padding de respiro 20px */}
      <div className="relative w-full max-w-[420px] bg-white h-[100dvh] flex flex-col shadow-[-8px_0_32px_rgba(0,0,0,0.18)] animate-[slideIn_0.28s_ease] p-0">
        <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header - com padding interno 20px */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#eee] shrink-0" style={{ paddingLeft: 20, paddingRight: 20 }}>
          <h2 className="text-[18px] font-bold text-[#111]">Carrinho</h2>
          <button
            onClick={closeCart}
            aria-label="Fechar carrinho"
            className="w-8 h-8 rounded-full border border-[#e5e5e5] flex items-center justify-center hover:bg-zinc-50 text-[18px] leading-none"
          >
            ✕
          </button>
        </div>

        {/* List - padding interno garante respiro nas laterais */}
        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-4" style={{ paddingLeft: 20, paddingRight: 20 }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[15px] font-semibold text-[#333]">Seu carrinho está vazio</p>
              <p className="text-[13px] text-[#888] mt-1">Adicione produtos para continuar</p>
              <button
                onClick={closeCart}
                className="mt-6 h-10 px-6 rounded-full border border-[#4e008e] text-[#4e008e] font-semibold text-sm"
              >
                Continuar comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.slug} className="flex gap-3 pb-4 border-b border-[#f0f0f0] last:border-0">
                <div className="w-[88px] h-[88px] bg-[#fafafa] rounded-lg border border-[#eee] flex items-center justify-center shrink-0 overflow-hidden p-2">
                  <img src={item.image.startsWith("http") ? item.image : `/${item.image}`} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  {item.brand && <span className="text-[11px] font-bold text-[#666] tracking-wide uppercase">{item.brand}</span>}
                  <p className="text-[13px] leading-[1.35] text-[#222] line-clamp-2 font-medium">{item.name}</p>
                  <span className="text-[11px] text-[#999]">ID: {item.id}</span>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center border border-[#e5e5e5] rounded-full overflow-hidden h-7">
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-zinc-50 text-[#4e008e] font-bold"
                        aria-label="Diminuir"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center hover:bg-zinc-50 text-[#4e008e] font-bold"
                        aria-label="Aumentar"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.slug)}
                      aria-label="Remover"
                      className="ml-auto w-7 h-7 rounded-full hover:bg-red-50 text-[#999] hover:text-red-600 flex items-center justify-center"
                      title="Remover"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 6h18M8 6V4h8v2M10 11v6M14 11v6M5 6l1 14h12l1-14" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <div className="mt-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[16px] font-extrabold text-[#4e008e]">{formatBRL(item.priceCents * item.quantity)}</span>
                      {item.quantity > 1 && <span className="text-[11px] text-[#888]">({formatBRL(item.priceCents)} un.)</span>}
                    </div>
                    {discountCents > 0 && (
                      <span className="inline-block mt-1 text-[11px] font-bold bg-[#e8f5e9] text-[#2e7d32] px-2 py-0.5 rounded">Desconto no PIX</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Resumo - padding interno 20px */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-[#eee] bg-white px-5 py-4 flex flex-col gap-3" style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
            <div className="flex justify-between items-baseline">
              <span className="text-sm text-[#666]">Total</span>
              <span className="text-[20px] font-extrabold text-[#4e008e]">{formatBRL(totalCents)}</span>
            </div>
            <p className="text-[11px] text-[#2e7d32] -mt-2 font-bold">PIX com 40% OFF • Somente PIX</p>
            {origTotalCents > totalCents && (
              <p className="text-[12px] text-[#2e7d32]">Economia de {formatBRL(discountCents)} no PIX</p>
            )}

            <button
              onClick={() => {
                closeCart();
                router.push("/checkout");
              }}
              className="w-full h-[48px] rounded-full bg-[#4e008e] text-white font-extrabold text-[15px] hover:bg-[#3a006e] transition-colors"
            >
              Finalizar compra
            </button>
            <button
              onClick={closeCart}
              className="w-full h-[44px] rounded-full border border-[#d9d9d9] text-[#333] font-semibold text-[14px] bg-white hover:bg-zinc-50"
            >
              Continuar comprando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
