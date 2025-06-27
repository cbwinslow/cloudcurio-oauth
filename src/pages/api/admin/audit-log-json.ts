import type { APIRoute } from "astro";
export const get: APIRoute = async ({ locals }) => {
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100").all();
  return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
};