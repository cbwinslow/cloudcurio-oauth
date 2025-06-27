import { sendWebhook } from "./webhook";
export async function sendAlert(subject: string, body: string) {
  await sendWebhook("alert", { subject, body, timestamp: new Date().toISOString() });
  // Optionally send an email or other alert here too.
}