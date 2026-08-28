/** Validadores leves — sem zod para não adicionar dependência */

/** Remove tudo que não é dígito */
export function onlyDigits(v: string) {
  return (v || "").replace(/\D/g, "");
}

/** Valida CPF (11 dígitos com DV) */
export function isValidCPF(cpf: string): boolean {
  const d = onlyDigits(cpf);
  if (d.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(d)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
  let rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  if (rev !== parseInt(d[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
  rev = 11 - (sum % 11);
  if (rev === 10 || rev === 11) rev = 0;
  return rev === parseInt(d[10]);
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  const d = onlyDigits(phone);
  // Brasil: 10 ou 11 dígitos (com DDD). Aceita 12-13 se vier com 55 na frente.
  if (d.startsWith("55") && d.length >= 12) return d.length === 12 || d.length === 13;
  return d.length === 10 || d.length === 11;
}

/** Formata telefone brasileiro para exibição */
export function formatPhone(v: string) {
  const d = onlyDigits(v).slice(-11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

export function formatCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
