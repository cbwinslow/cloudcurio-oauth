import type { APIRoute } from "astro";
import { getOAuthTokens, getUserInfo } from "../../utils/oauth";
import { logAudit } from "../../utils/logger";
import { createSession, setSessionCookie } from "../../utils/session";
import { env } from "../../utils/env";
import { sendWebhook } from "../../utils/webhook";

export const get: APIRoute = async ({ request, cookies, locals }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";

  if (!code) {
    await logAudit(null, "oauth_callback", "failed", ip, userAgent, "No code", locals.runtime.env.DB);
    await sendWebhook("user_login", {
      status: "failed", reason: "No code", ip, userAgent, timestamp: new Date().toISOString()
    });
    return new Response("Missing code", { status: 400 });
  }

  try {
    const { access_token, refresh_token, expires_at } = await getOAuthTokens(code);
    const user = await getUserInfo(access_token);

    const db = locals.runtime.env.DB;
    await db.prepare(
      "INSERT OR IGNORE INTO users (id, email, name, avatar_url, provider) VALUES (?, ?, ?, ?, ?)"
    ).bind(user.id, user.email, user.name, user.avatar_url, user.provider).run();

    await db.prepare(
      `INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expires_at, provider) VALUES (?, ?, ?, ?, ?)`
    ).bind(user.id, access_token, refresh_token, expires_at, user.provider).run();

    const sessionId = await createSession(user.id, db);
    setSessionCookie(cookies, sessionId);

    await logAudit(user.id, "oauth_callback", "success", ip, userAgent, "User logged in", db);
    await sendWebhook("user_login", {
      user_id: user.id, email: user.email, status: "success", ip, userAgent, timestamp: new Date().toISOString()
    });

    return Response.redirect(env.SITE_URL + "/dashboard", 302);
  } catch (e) {
    await logAudit(null, "oauth_callback", "failed", ip, userAgent, String(e), locals.runtime.env.DB);
    await sendWebhook("user_login", {
      status: "failed", reason: String(e), ip, userAgent, timestamp: new Date().toISOString()
    });
    return new Response("OAuth error", { status: 500 });
  }
};