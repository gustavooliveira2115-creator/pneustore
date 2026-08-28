/**
 * BravoPay — Configuração central
 *
 * COLE SEU PRODUCT_ID AQUI se você usa UTMify.
 * Pegue em: https://bravopay.club/dashboard/produtos
 *
 * Se deixar vazio/null, a API cria cobrança sem vincular a produto (funciona,
 * mas a UTMify pode filtrar/mostrar nome errado no "ghost product").
 *
 * DICA: crie um produto único "PneuStore - Checkout" e use o mesmo ID para
 * todos os pneus, ou crie 1 produto por categoria se quiser segmentar no dashboard.
 */

// ⬇️⬇️ COLE SEU ID AQUI (ex: "prod_abc123") ⬇️⬇️
export const BRAVOPAY_PRODUCT_ID: string | null = null;
// Exemplo: export const BRAVOPAY_PRODUCT_ID = "prod_abc123xyz";

// Se você usa split (revenue-share Telegram/afiliado), deixe null por padrão.
// O Checkout vai enviar `split` só quando você passar explicitamente no openCheckout.
export type BravoSplit = {
  recipient: string; // email ou user_id BravoPay do recebedor
  percent?: number; // 0-100 — use percent OU amount_cents, nunca os dois
  amount_cents?: number;
};

// Taxa PIX BravoPay é descontada no saldo; não precisa configurar aqui.
// Para cálculo de exibição (opcional): ex: R$30 mínimo saque, etc.

export const BRAVOPAY_BASE_URL = "https://bravopay.club/api/v1";
