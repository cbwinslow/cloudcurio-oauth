import type { APIRoute } from "astro";
import { getUserData } from "../../../data/users";

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = locals.runtime.env.DB;
  const { userData, tokens, sessions } = await getUserData(db, user.id);

  return new Response(JSON.stringify({ user: userData, tokens, sessions }), {
    headers: { "Content-Type": "application/json" },
  });
};