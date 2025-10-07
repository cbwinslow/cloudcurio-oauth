import type { APIRoute, APIContext } from "astro";
import { getOAuthTokens, getUserInfo } from "../../../utils/oauth";
import { logAudit } from "../../../utils/logger";
import { createSession, setSessionCookie } from "../../../utils/session";
import { env } from "../../../utils/env";
import { sendWebhook } from "../../../utils/webhook";

type OAuthUser = {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  provider: string;
};

const handleOAuthError = async (
  context: APIContext,
  reason: string,
  ip: string,
  userAgent: string
) => {
  await logAudit(
    null,
    "oauth_callback",
    "failed",
    ip,
    userAgent,
    reason,
    context.locals.runtime.env.DB
  );
  await sendWebhook("user_login", {
    status: "failed",
    reason,
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  });
  return new Response(reason, { status: 400 });
};

const upsertUserAndTokens = async (
  db: D1Database,
  user: OAuthUser,
  tokens: { access_token: string; refresh_token: string; expires_at: number }
) => {
  await db
    .prepare(
      "INSERT OR IGNORE INTO users (id, email, name, avatar_url, provider) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(user.id, user.email, user.name, user.avatar_url, user.provider)
    .run();

  await db
    .prepare(
      `INSERT INTO oauth_tokens (user_id, access_token, refresh_token, expires_at, provider) VALUES (?, ?, ?, ?, ?)`
    )
    .bind(
      user.id,
      tokens.access_token,
      tokens.refresh_token,
      tokens.expires_at,
      user.provider
    )
    .run();
};

export const GET: APIRoute = async (context) => {
  const { request, cookies, locals } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies.get("oauth_state")?.value;

  cookies.delete("oauth_state", { path: "/" });

  const ip = request.headers.get("cf-connecting-ip") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";

  if (!code || !state || !storedState || state !== storedState) {
    const reason = !code ? "No code" : "State mismatch";
    return handleOAuthError(context, reason, ip, userAgent);
  }

  try {
    const tokens = await getOAuthTokens(code);
    const user = await getUserInfo(tokens.access_token);
    const db = locals.runtime.env.DB;

    await upsertUserAndTokens(db, user, tokens);

    const sessionId = await createSession(user.id, db);
    setSessionCookie(cookies, sessionId);

    await logAudit(
      user.id,
      "oauth_callback",
      "success",
      ip,
      userAgent,
      "User logged in",
      db
    );
    await sendWebhook("user_login", {
      user_id: user.id,
      email: user.email,
      status: "success",
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });

    return Response.redirect(env.SITE_URL + "/dashboard", 302);
  } catch (e) {
    return handleOAuthError(context, String(e), ip, userAgent);
  }
};