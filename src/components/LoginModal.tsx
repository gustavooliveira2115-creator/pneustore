"use client";

import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) document.documentElement.style.overflow = "hidden";
    else document.documentElement.style.overflow = "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Login simulado:\n${email}`);
      onClose();
    }, 800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(2px)",
        padding: 16,
      }}
    >
      <div
        style={{
          position: "relative", width: "100%", maxWidth: 420,
          background: "white", borderRadius: 12,
          boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
          padding: "28px 24px 24px", maxHeight: "90dvh", overflowY: "auto",
        }}
      >
        {/* Close X */}
        <button
          onClick={onClose}
          aria-label="Fechar"
          style={{
            position: "absolute", top: 12, right: 12,
            width: 32, height: 32, borderRadius: "50%",
            border: "1px solid #e5e5e5", background: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", fontSize: 16, lineHeight: 1, color: "#666",
          }}
        >
          ✕
        </button>

        <h2 id="login-title" style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: "0 0 20px", textAlign: "center" }}>
          Entrar com e-mail
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* E-mail */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>E-mail</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoComplete="email"
              style={{
                height: 42, borderRadius: 8, border: "1px solid #d9d9d9",
                padding: "0 12px", fontSize: 14, outline: "none", background: "white",
              }}
            />
          </label>

          {/* Senha */}
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#333" }}>Senha</span>
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: "100%", height: 42, borderRadius: 8, border: "1px solid #d9d9d9",
                  padding: "0 40px 0 12px", fontSize: 14, outline: "none", background: "white",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Ocultar senha" : "Exibir senha"}
                style={{
                  position: "absolute", right: 8, width: 28, height: 28,
                  border: "none", background: "transparent", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#8c8c8c", fontSize: 14,
                }}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <a href="#" onClick={(e) => e.preventDefault()} style={{ fontSize: 12, color: "#4c0082", textDecoration: "underline", alignSelf: "flex-start", marginTop: -4 }}>
            Esqueci minha senha
          </a>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%", height: 44, borderRadius: 8,
              background: "#4c0082", color: "white", border: "none",
              fontWeight: 800, fontSize: 14, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            type="button"
            onClick={() => alert("Fluxo de cadastro simulado")}
            style={{
              width: "100%", height: 44, borderRadius: 8,
              background: "white", color: "#4c0082", border: "1px solid #4c0082",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            Não tem conta? Cadastre-se
          </button>

          {/* Divisor ou */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
            <span style={{ fontSize: 12, color: "#8c8c8c", fontWeight: 600 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: "#f0f0f0" }} />
          </div>

          <button
            type="button"
            onClick={() => alert("Código enviado para " + (email || "seu e-mail") + " (simulado)")}
            style={{
              width: "100%", height: 44, borderRadius: 8,
              background: "white", color: "#4c0082", border: "1px solid #d9d9d9",
              fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            Receber código de acesso por e-mail
          </button>

          {/* Login social */}
          <div style={{ marginTop: 8, borderTop: "1px solid #f0f0f0", paddingTop: 16 }}>
            <p style={{ fontSize: 12, color: "#8c8c8c", textAlign: "center", margin: "0 0 12px", fontWeight: 600 }}>Entrar com login social</p>
            <button
              type="button"
              onClick={() => alert("Login Google simulado")}
              style={{
                width: "100%", height: 42, borderRadius: 8,
                background: "white", border: "1px solid #d9d9d9",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                cursor: "pointer", fontSize: 13, fontWeight: 700, color: "#1a1a1a",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-5.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                <path fill="none" d="M0 0h48v48H0z" />
              </svg>
              Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
