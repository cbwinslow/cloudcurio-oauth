import type { APIRoute } from "astro";
export const get: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return new Response("Unauthorized", { status: 401 });
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare("SELECT * FROM sessions WHERE user_id = ?").bind(user.id).all();
  return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
};