import type { APIRoute } from "astro";
export const get: APIRoute = async ({ locals }) => {
  const db = locals.runtime.env.DB;
  try {
    await db.prepare("SELECT 1 FROM users LIMIT 1").first();
    return new Response(JSON.stringify({ status: "ok" }), { headers: { "Content-Type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ status: "error" }), { status: 500 });
  }
};