import type { APIRoute } from "astro";
import { getUserSessions } from "../../../data/sessions";

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = locals.runtime.env.DB;
  const sessions = await getUserSessions(db, user.id);

  return new Response(JSON.stringify(sessions), {
    headers: { "Content-Type": "application/json" },
  });
};