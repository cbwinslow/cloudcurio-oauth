import type { APIRoute } from "astro";
export const del: APIRoute = async ({ locals, params }) => {
  const user = locals.user;
  if (!user) return new Response("Unauthorized", { status: 401 });
  const db = locals.runtime.env.DB;
  await db.prepare("DELETE FROM sessions WHERE id = ? AND user_id = ?").bind(params.id, user.id).run();
  return new Response("Revoked", { status: 200 });
};