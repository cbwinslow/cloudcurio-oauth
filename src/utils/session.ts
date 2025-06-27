import { env } from "./env";
import { nanoid } from "nanoid";

export async function createSession(user_id: string, db: D1Database) {
  const sessionId = nanoid();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days
  await db.prepare(
    "INSERT INTO sessions (id, user_id, created_at, expires_at) VALUES (?, ?, CURRENT_TIMESTAMP, ?)"
  ).bind(sessionId, user_id, expiresAt.toISOString()).run();
  return sessionId;
}

export function setSessionCookie(cookies, sessionId: string) {
  cookies.set("session", sessionId, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
  });
}

export function destroySessionCookie(cookies) {
  cookies.set("session", "", { path: "/", maxAge: 0 });
}