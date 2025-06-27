import type { APIRoute } from "astro";
export const get: APIRoute = async ({ locals }) => {
  const db = locals.runtime.env.DB;
  const { results: active } = await db.prepare(
    "SELECT COUNT(*) as count FROM sessions WHERE expires_at > CURRENT_TIMESTAMP"
  ).all();
  const { results: recent } = await db.prepare(
    "SELECT COUNT(DISTINCT user_id) as count FROM audit_logs WHERE action = 'oauth_callback' AND timestamp >= datetime('now', '-1 day')"
  ).all();
  const { results: failed } = await db.prepare(
    "SELECT COUNT(*) as count FROM audit_logs WHERE status = 'failed' AND timestamp >= datetime('now', '-1 day')"
  ).all();
  const { results: byCountry } = await db.prepare(
    "SELECT country, COUNT(*) as count FROM traffic_logs WHERE country IS NOT NULL GROUP BY country ORDER BY count DESC LIMIT 5"
  ).all();

  return new Response(JSON.stringify({
    active_sessions: active[0].count,
    recent_users: recent[0].count,
    failed_logins: failed[0].count,
    top_countries: byCountry
  }), { headers: { "Content-Type": "application/json" } });
};