import crypto from "crypto";

const ALGO = "aes-256-gcm";
// Chave derivada de env ou fallback (em prod defina CUSTOMER_ENCRYPTION_KEY com 32 bytes base64/hex)
// Se não houver env, usamos hash da BRAVOPAY_API_KEY + salt estático — melhor que plain, mas recomenda-se definir env.
function getKey(): Buffer {
  const raw = process.env.CUSTOMER_ENCRYPTION_KEY || process.env.BRAVOPAY_API_KEY || "pneustore-fallback-key-change-me-32b!";
  // deriva 32 bytes via SHA256
  return crypto.createHash("sha256").update(raw).digest();
}

export function encrypt(text: string): string {
  if (!text) return text;
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const enc = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // formato: iv:tag:ciphertext (base64)
  return `${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

export function decrypt(payload: string): string {
  if (!payload || !payload.includes(":")) return payload;
  try {
    const [ivB64, tagB64, encB64] = payload.split(":");
    const key = getKey();
    const iv = Buffer.from(ivB64, "base64");
    const tag = Buffer.from(tagB64, "base64");
    const enc = Buffer.from(encB64, "base64");
    const decipher = crypto.createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    const dec = Buffer.concat([decipher.update(enc), decipher.final()]);
    return dec.toString("utf8");
  } catch {
    return payload; // fallback se não for criptografado (migração)
  }
}

export function hashEmail(email: string): string {
  return crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
}
