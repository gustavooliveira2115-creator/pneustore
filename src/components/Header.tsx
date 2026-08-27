"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  SearchIcon,
  UserIcon,
  CartIcon,
  ChevronDown,
  ChevronRight,
  LocationPin,
  HamburgerIcon,
} from "./icons";

const navLinks = [
  { label: "Pneus", href: "#" },
  { label: "Rodas", href: "#" },
  { label: "Acessórios", href: "#" },
  { label: "Oficinas parceiras", href: "#" },
];

const vehicleTabs = ["Carros", "Caminhão e ônibus", "Motos"];

const carBrands = [
  "BYRD","CHEVROLET","CITROEN","FIAT","FORD","HONDA","HYUNDAI","JAC","KIA",
  "LAND ROVER","NISSAN","PEUGEOT","RENAULT","SSANGYONG","SUBARU","SUZUKI",
  "TOYOTA","VOLKSWAGEN","VOLVO",
];

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [vehicleTab, setVehicleTab] = useState(0);
  const [cookieOpen, setCookieOpen] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="pneustore-header"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "var(--color-primaryPurpleDarkest)",
      }}
    >
      {/* Cookie Banner */}
      {cookieOpen && (
        <div
          style={{
            background: "var(--color-primaryPurpleBase)",
            padding: "12px 16px",
            textAlign: "center",
            color: "white",
            fontSize: 12,
            position: "relative",
          }}
        >
          <span style={{ fontSize: 12 }}>
            Utilizamos cookies para melhorar sua experiência. Ao continuar
            navegando, você concorda com a nossa{" "}
            <a href="#" style={{ textDecoration: "underline" }}>
              Política de Privacidade
            </a>
            .
          </span>
          <button
            onClick={() => setCookieOpen(false)}
            style={{
              position: "absolute",
              right: 20,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: "white",
              fontSize: 18,
              cursor: "pointer",
              padding: 4,
            }}
            aria-label="Fechar aviso de cookies"
          >
            ✕
          </button>
        </div>
      )}

      <div
        style={{
          background: scrolled
            ? "rgba(78,0,142,0.97)"
            : "var(--color-primaryPurpleDarkest)",
          transition: "background 0.3s",
        }}
      >
        {/* Desktop Header */}
        <div
          className="hidden desktop:flex"
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "16px 50px",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Link href="/" style={{ flexShrink: 0, lineHeight: 0 }}>
            <img
              src="/0e22de206c8bff4b6700ad14924492a518cca03a.png"
              alt="Logo Pneustore"
              style={{ height: 22 }}
            />
          </Link>

          {/* Location */}
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            <LocationPin />
            <span style={{ fontSize: 12 }}>
              Informar <br /> local de entrega
            </span>
            <ChevronDown color="white" />
          </button>

          {/* Search Bar */}
          <div
            style={{
              position: "relative",
              flex: 1,
              maxWidth: 600,
            }}
          >
            <input
              style={{
                width: "100%",
                height: 44,
                background: "white",
                borderRadius: "10px 10px 10px 10px",
                border: "none",
                outline: "none",
                padding: "0 20px",
                fontSize: 14,
              }}
              placeholder="O que estou buscando hoje?"
              aria-label="Campo de busca"
            />
            <button
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: 44,
                width: 60,
                borderRadius: "0 10px 10px 0",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="Buscar"
            >
              <SearchIcon />
            </button>
          </div>

          {/* User */}
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            <UserIcon />
            <span style={{ fontSize: 12 }}>Entrar ou<br />cadastrar</span>
          </button>

          {/* Cart */}
          <button
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <div style={{ position: "relative" }}>
              <CartIcon />
              <span
                style={{
                  position: "absolute",
                  top: -8,
                  right: -10,
                  background: "var(--color-primaryBlueSecondaryBase)",
                  borderRadius: "50%",
                  padding: "2px 6px",
                  fontSize: 11,
                  color: "var(--color-primaryPurpleBase)",
                  lineHeight: 1,
                }}
              >
                0
              </span>
            </div>
          </button>
        </div>

        {/* Desktop Nav */}
        <div
          className="hidden desktop:block"
          style={{
            background: "var(--color-primaryPurpleBase)",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <div
            style={{
              maxWidth: 1240,
              margin: "0 auto",
              padding: "0 50px",
              display: "flex",
              gap: 8,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "white",
                  textDecoration: "none",
                  padding: "12px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  position: "relative",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
                <ChevronDown color="white" />
              </a>
            ))}

            {/* Vehicle Dropdown Trigger */}
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setVehicleOpen(!vehicleOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: "white",
                  background: vehicleOpen ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "none",
                  padding: "12px 16px",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                }}
                onMouseLeave={(e) => {
                  if (!vehicleOpen) e.currentTarget.style.background = "transparent";
                }}
              >
                Informações do seu veículo
                <ChevronDown color="white" />
              </button>

              {/* Vehicle Dropdown */}
              {vehicleOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    background: "white",
                    color: "black",
                    padding: 20,
                    width: 600,
                    zIndex: 200,
                  }}
                >
                  {/* Tabs */}
                  <div style={{ display: "flex", gap: 0, marginBottom: 16 }}>
                    {vehicleTabs.map((tab, i) => (
                      <button
                        key={tab}
                        onClick={() => setVehicleTab(i)}
                        style={{
                          flex: 1,
                          padding: "12px 16px",
                          background: vehicleTab === i ? "var(--color-primaryPurpleDarkest)" : "#eee",
                          color: vehicleTab === i ? "white" : "#333",
                          border: "none",
                          cursor: "pointer",
                          fontWeight: vehicleTab === i ? 600 : 400,
                          fontSize: 14,
                        }}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  {/* Brand Select */}
                  <div
                    style={{
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      padding: "12px 16px",
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                  >
                    <span style={{ color: "#666", fontSize: 14 }}>Marca</span>
                    <ChevronDown color="#666" />
                  </div>

                  {/* Brand Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "8px 24px",
                    }}
                  >
                    {carBrands.map((brand) => (
                      <a
                        key={brand}
                        href="#"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 0",
                          textDecoration: "none",
                          color: "#333",
                          fontSize: 14,
                        }}
                      >
                        {brand}
                        <ChevronRight />
                      </a>
                    ))}
                  </div>

                  {/* View All */}
                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <a
                      href="#"
                      style={{
                        color: "var(--color-primaryBlueBase)",
                        textDecoration: "underline",
                        fontSize: 14,
                      }}
                    >
                      ver todas as marcas
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div
          className="desktop:hidden"
          style={{
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <img
            src="/a9c181e7594016ab63d3.webp"
            alt="Compre pneus com 5 anos de garantia"
            style={{ width: "100%" }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "var(--color-primaryPurpleBase)",
            }}
          >
            <button
              style={{
                background: "none",
                border: "none",
                color: "inherit",
                cursor: "pointer",
              }}
              aria-label="Abrir menu"
            >
              <HamburgerIcon />
            </button>
            <Link href="/" style={{ lineHeight: 0 }}>
              <img
                src="/0e22de206c8bff4b6700ad14924492a518cca03a.png"
                alt="logo"
                style={{ height: 14 }}
              />
            </Link>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                }}
                aria-label="Usuário"
              >
                <UserIcon />
              </button>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                }}
                aria-label="Carrinho"
              >
                <CartIcon />
                <span
                  style={{
                    background: "var(--color-primaryBlueSecondaryBase)",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: 11,
                    color: "var(--color-primaryPurpleBase)",
                  }}
                >
                  0
                </span>
              </button>
            </div>
          </div>
          {/* Mobile Search */}
          <div style={{ width: "100%", position: "relative" }}>
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                overflow: "hidden",
                borderRadius: 10,
              }}
            >
              <input
                style={{
                  width: "100%",
                  background: "#f4f4f4",
                  outline: "none",
                  border: "none",
                  height: 50,
                  borderRadius: "10px 0 0 10px",
                  padding: "0 20px",
                  fontSize: 14,
                }}
                placeholder="O que estou buscando hoje?"
                aria-label="campo de busca"
              />
              <button
                style={{
                  background: "#f4f4f4",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "none",
                  borderRadius: "0 10px 10px 0",
                  height: 50,
                  width: 60,
                  cursor: "pointer",
                }}
                aria-label="buscar"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
