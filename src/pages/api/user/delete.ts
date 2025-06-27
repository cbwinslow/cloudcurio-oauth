import type { APIRoute } from "astro";
export const post: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return new Response("Unauthorized", { status: 401 });
  const db = locals.runtime.env.DB;
  await db.prepare("DELETE FROM users WHERE id = ?").bind(user.id).run();
  await db.prepare("DELETE FROM oauth_tokens WHERE user_id = ?").bind(user.id).run();
  await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(user.id).run();
  return new Response("Deleted", { status: 200 });
};