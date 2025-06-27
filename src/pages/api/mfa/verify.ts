import type { APIRoute } from "astro";
import { logAudit } from "../../utils/logger";
import { sendWebhook } from "../../utils/webhook";
export const post: APIRoute = async ({ request, locals, cookies }) => {
  const { user_id, otp } = await request.json();
  if (!user_id || !otp) return new Response("Missing info", { status: 400 });
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare(
    "SELECT * FROM mfa_otps WHERE user_id = ? AND otp = ? AND used = 0 AND created_at >= datetime('now', '-10 minutes')"
  ).bind(user_id, otp).all();
  if (results.length === 0) {
    await logAudit(user_id, "mfa_otp_verify", "failed", "", "", "Invalid OTP", db);
    await sendWebhook("mfa_challenge", {
      user_id, status: "failed", timestamp: new Date().toISOString()
    });
    return new Response("Invalid or expired OTP", { status: 401 });
  }
  await db.prepare(
    "UPDATE mfa_otps SET used = 1 WHERE user_id = ? AND otp = ?"
  ).bind(user_id, otp).run();
  cookies.set("mfa_verified", "1", { httpOnly: true, secure: true, maxAge: 600, sameSite: "lax" });
  await logAudit(user_id, "mfa_otp_verify", "success", "", "", "OTP verified", db);
  await sendWebhook("mfa_challenge", {
    user_id, status: "verified", timestamp: new Date().toISOString()
  });
  return new Response("MFA verified", { status: 200 });
};