type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || "PneuStore <noreply@pneustore.com.br>";
  if (!apiKey) {
    console.log("[EMAIL MOCK] Para:", payload.to);
    console.log("[EMAIL MOCK] Assunto:", payload.subject);
    return { mocked: true, id: `mock_${Date.now()}` };
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: payload.to, subject: payload.subject, html: payload.html }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Falha ao enviar e-mail");
  return data;
}

export function trackingEmailHtml(params: { name: string; code: string; link: string; productName: string }) {
  const { name, code, link, productName } = params;
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f5ff; padding: 24px;"><div style="background: #4e008e; border-radius: 16px; padding: 24px; color: white; text-align: center;"><div style="font-size: 11px; letter-spacing: 0.16em; opacity: 0.9; font-weight: 700;">PNEUSTORE • RASTREIO OFICIAL</div><h1 style="margin: 12px 0 8px; font-size: 24px; font-weight: 800;">Seu pedido foi confirmado, ${name}!</h1><p style="margin: 0; opacity: 0.85; font-size: 14px;">Produto: ${productName}</p></div><div style="background: white; border-radius: 16px; padding: 24px; margin-top: 16px; border: 1px solid #e5e5e5;"><p style="font-size: 14px; color: #333; margin: 0 0 12px;">Seu código de rastreio é:</p><div style="font-family: monospace; font-size: 20px; font-weight: 800; letter-spacing: 0.08em; background: #f6f2ff; border: 1px solid #e8e0ff; border-radius: 10px; padding: 12px 16px; text-align: center; color: #4e008e;">${code}</div><p style="font-size: 12px; color: #666; margin: 12px 0 16px; text-align: center;">Este mesmo link será atualizado quando o código da transportadora for gerado em até 2 dias.</p><a href="${link}" style="display: block; background: #4e008e; color: white; text-align: center; padding: 14px; border-radius: 999px; font-weight: 800; text-decoration: none; font-size: 14px;">Rastrear meu pedido →</a><p style="font-size: 11px; color: #999; margin: 16px 0 0; text-align: center;">Link: <a href="${link}" style="color: #4e008e;">${link}</a><br/>Sem login necessário. Guarde este e-mail.</p></div></div>`;
}

export function carrierEmailHtml(params: { name: string; code: string; carrierCode: string; link: string }) {
  const { name, carrierCode, link } = params;
  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f5ff; padding: 24px;"><div style="background: #4e008e; border-radius: 16px; padding: 24px; color: white; text-align: center;"><h1 style="margin: 0; font-size: 22px; font-weight: 800;">Seu pedido saiu para transporte, ${name}!</h1><p style="margin: 8px 0 0; opacity: 0.85; font-size: 14px;">Código da transportadora: <b style="font-family: monospace; letter-spacing: 0.06em;">${carrierCode}</b></p></div><div style="background: white; border-radius: 16px; padding: 24px; margin-top: 16px; border: 1px solid #e5e5e5; text-align: center;"><p style="font-size: 14px; color: #333;">Agora você pode rastrear em tempo real:</p><a href="${link}" style="display: inline-block; background: #4e008e; color: white; padding: 14px 28px; border-radius: 999px; font-weight: 800; text-decoration: none; font-size: 14px;">Rastrear com código ${carrierCode} →</a><p style="font-size: 11px; color: #999; margin-top: 12px;"><a href="${link}" style="color: #4e008e;">${link}</a></p></div></div>`;
}
