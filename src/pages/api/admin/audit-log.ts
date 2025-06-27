import type { APIRoute } from "astro";
export const get: APIRoute = async ({ locals }) => {
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100").all();
  return new Response(
    `<table border="1">${results.map(row =>
      `<tr><td>${row.timestamp}</td><td>${row.user_id}</td><td>${row.action}</td><td>${row.status}</td><td>${row.details}</td></tr>`
    ).join("")}</table>`, { headers: { "Content-Type": "text/html" } }
  );
};