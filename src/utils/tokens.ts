import { nanoid } from "nanoid";
import { env } from "./env";

export function generateJWT(user) {
  // This is a placeholder, use a real JWT lib in production!
  return `${user.id}.${nanoid()}`;
}

export async function blacklistToken(token: string, expires_at: Date, db: D1Database) {
  await db.prepare(
    "INSERT INTO token_blacklist (token, expires_at) VALUES (?, ?)"
  ).bind(token, expires_at.toISOString()).run();
}