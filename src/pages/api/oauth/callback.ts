import type { APIRoute } from "astro";
import { getOAuthTokens, getUserInfo } from "../../../utils/oauth";
import { createAuditLog, createUser, getUserByEmail, updateUser } from "../../../utils/db";
import { createSession, setSessionCookie } from "../../../utils/session";
import { env } from "../../../utils/env";
import { sendWebhook } from "../../../utils/webhook";

export const get: APIRoute = async (context) => {
  const url = new URL(context.request.url);
  const code = url.searchParams.get("code");
  const ip = context.request.headers.get("cf-connecting-ip") ?? "";
  const userAgent = context.request.headers.get("user-agent") ?? "";
  const db = context.locals.runtime.env.DB;

  if (!code) {
    await createAuditLog(db, { event_type: "oauth_callback_failed", ip_address: ip, user_agent: userAgent, details: "No code provided" });
    await sendWebhook("user_login_failed", { reason: "No code provided", ip, userAgent });
    return new Response("Missing code", { status: 400 });
  }

  try {
    const tokens = await getOAuthTokens(code);
    const userInfo = await getUserInfo(tokens.access_token);

    let user = await getUserByEmail(db, userInfo.email);
    if (user) {
      await updateUser(db, user.id, { name: userInfo.name, avatar_url: userInfo.picture });
    } else {
      user = { id: userInfo.sub, email: userInfo.email, name: userInfo.name, avatar_url: userInfo.picture };
      await createUser(db, user);
    }

    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
    const sessionId = await createSession(db, user.id, expiresAt);
    setSessionCookie(context.cookies, sessionId);

    await createAuditLog(db, { user_id: user.id, event_type: "user_login", ip_address: ip, user_agent: userAgent });
    await sendWebhook("user_login_success", { userId: user.id, email: user.email, ip, userAgent });

    return Response.redirect(env.SITE_URL + "/dashboard", 302);
  } catch (e) {
    await createAuditLog(db, { event_type: "oauth_callback_failed", ip_address: ip, user_agent: userAgent, details: String(e) });
    await sendWebhook("user_login_failed", { reason: String(e), ip, userAgent });
    return new Response("OAuth error", { status: 500 });
  }
};