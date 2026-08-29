import type { Metadata } from "next";
import "./globals.css";
import { BravoCheckoutProvider } from "@/components/BravoPayCheckout";
import { CartProvider } from "@/components/CartContext";
import { UtmCapture } from "@/components/UtmCapture";

export const metadata: Metadata = {
  title: "PneuStore | Frete Grátis em Pneus Selecionados - Aproveite",
  description:
    "Pneus com qualidade e preço baixo é Aqui na PneuStore. Até 18% OFF no Pix ✓ Parcelas até 10X ✓ Compra segura e entrega garantida ✓ Compre Online Aqui!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Captura UTM no primeiro acesso (salva em localStorage/cookie para enviar no PIX) */}
        <UtmCapture />
        <BravoCheckoutProvider>
          <CartProvider>{children}</CartProvider>
        </BravoCheckoutProvider>
      </body>
    </html>
  );
}
