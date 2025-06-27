export async function sendWebhook(event: string, payload: object) {
  const webhookUrls = [
    process.env.WEBHOOK_URL
  ].filter(Boolean);

  for (const url of webhookUrls) {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, ...payload }),
      });
    } catch (e) {
      console.error(`Webhook to ${url} failed:`, e);
    }
  }
}