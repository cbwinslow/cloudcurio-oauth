import type { APIRoute } from "astro";
import { nanoid } from "nanoid";
import { sendEmail } from "../../utils/email";
import { logAudit } from "../../utils/logger";

export const post: APIRoute = async ({ request, locals }) => {
  const { email, user_id } = await request.json();
  if (!email || !user_id) return new Response("Missing info", { status: 400 });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const db = locals.runtime.env.DB;
  await db.prepare(
    "INSERT INTO mfa_otps (id, user_id, email, otp, used, created_at) VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)"
  ).bind(nanoid(), user_id, email, otp).run();

  await sendEmail(email, "Your CloudCurio OTP", `Your code: ${otp}`);
  await logAudit(user_id, "mfa_otp_sent", "success", "", "", `OTP sent to ${email}`, db);

  return new Response("OTP sent", { status: 200 });
};