import type { APIRoute } from "astro";
export const get: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return new Response("Unauthorized", { status: 401 });
  const db = locals.runtime.env.DB;
  const userData = await db.prepare("SELECT * FROM users WHERE id = ?").bind(user.id).first();
  const tokens = await db.prepare("SELECT * FROM oauth_tokens WHERE user_id = ?").bind(user.id).all();
  const sessions = await db.prepare("SELECT * FROM sessions WHERE user_id = ?").bind(user.id).all();
  return new Response(JSON.stringify({user: userData, tokens, sessions}), { headers: { "Content-Type": "application/json" } });
};