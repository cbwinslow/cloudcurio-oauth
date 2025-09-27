import { createSession as dbCreateSession, getSession, getUserById } from "./db";
import type { APIContext } from "astro";

export async function createSession(db: D1Database, userId: string, expiresAt: Date): Promise<string> {
  const sessionId = await dbCreateSession(db, userId, expiresAt);
  return sessionId;
}

export async function getUserFromSession(context: APIContext) {
  const sessionId = context.cookies.get("session")?.value;
  if (!sessionId) return null;

  const session = await getSession(context.locals.runtime.env.DB, sessionId);
  if (!session || new Date(session.expires_at) < new Date()) return null;

  const user = await getUserById(context.locals.runtime.env.DB, session.user_id);
  return user;
}

export function setSessionCookie(cookies: APIContext["cookies"], sessionId: string) {
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