"use client";

import { useEffect } from "react";
import { captureUtmOnLoad } from "@/lib/utm";

/**
 * Componente client que roda 1x para capturar UTMs da URL.
 * Coloque no layout.tsx para garantir que TODAS as páginas capturem.
 */
export function UtmCapture() {
  useEffect(() => {
    captureUtmOnLoad();
    // também re-captura se mudar query sem reload (SPA navigation)
    const onPop = () => captureUtmOnLoad();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  return null;
}
