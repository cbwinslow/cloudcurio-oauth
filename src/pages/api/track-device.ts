import type { APIRoute } from "astro";
export const post: APIRoute = async ({ request, locals }) => {
  const { user_id, device_hash } = await request.json();
  const db = locals.runtime.env.DB;
  await db.prepare(
    "INSERT OR IGNORE INTO user_devices (user_id, device_hash, first_seen) VALUES (?, ?, CURRENT_TIMESTAMP)"
  ).bind(user_id, device_hash).run();
  return new Response("Device tracked", { status: 200 });
};