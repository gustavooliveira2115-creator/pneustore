type WebhookEvent = "customer.created" | "customer.updated" | "customer.abandoned" | "order.created" | "order.updated" | "order.paid" | "order.abandoned" | "tracking.updated";

export async function dispatchWebhook(event: WebhookEvent, payload: any) {
  const urls = [
    process.env.WEBHOOK_URL,
    process.env.WEBHOOK_CUSTOMER_URL,
    process.env.WEBHOOK_ORDER_URL,
    process.env.ACTIVECAMPAIGN_WEBHOOK_URL,
    process.env.RDSTATION_WEBHOOK_URL,
    process.env.UTMIFY_WEBHOOK_URL,
  ].filter(Boolean) as string[];

  // também suporta lista separada por vírgula em WEBHOOK_URLS
  const extra = (process.env.WEBHOOK_URLS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const allUrls = [...new Set([...urls, ...extra])];

  if (allUrls.length === 0) {
    console.log(`[webhook] ${event} sem destinatário configurado. Payload:`, JSON.stringify(payload).slice(0, 400));
    return { dispatched: 0, urls: [] as string[] };
  }

  const body = JSON.stringify({ event, timestamp: new Date().toISOString(), data: payload });

  const results = await Promise.allSettled(
    allUrls.map(async (url) => {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Event": event,
          "User-Agent": "PneuStore-Webhook/1.0",
          ...(process.env.WEBHOOK_SECRET ? { "X-Webhook-Secret": process.env.WEBHOOK_SECRET } : {}),
        },
        body,
      });
      const text = await res.text().catch(() => "");
      if (!res.ok) throw new Error(`Webhook ${url} retornou ${res.status}: ${text.slice(0, 200)}`);
      return url;
    })
  );

  const ok = results.filter((r) => r.status === "fulfilled").length;
  const errs = results.filter((r) => r.status === "rejected").map((r: any) => r.reason?.message || String(r.reason));
  if (errs.length) console.warn(`[webhook] ${event} falhas:`, errs);
  else console.log(`[webhook] ${event} enviado para ${ok}/${allUrls.length} URLs`);

  return { dispatched: ok, urls: allUrls, errors: errs };
}
