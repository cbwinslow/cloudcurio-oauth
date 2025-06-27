import type { APIRoute } from "astro";
export const get: APIRoute = async ({ locals }) => {
  const db = locals.runtime.env.DB;
  const { results } = await db.prepare("SELECT * FROM traffic_logs ORDER BY timestamp DESC LIMIT 100").all();
  return new Response(
    `<table border="1">${results.map(row =>
      `<tr><td>${row.timestamp}</td><td>${row.ip}</td><td>${row.user_agent}</td><td>${row.path}</td></tr>`
    ).join("")}</table>`, { headers: { "Content-Type": "text/html" } }
  );
};