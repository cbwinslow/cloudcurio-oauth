import type { APIRoute } from "astro";
import { deleteSession } from "../../../../data/sessions";

export const DELETE: APIRoute = async ({ locals, params }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = locals.runtime.env.DB;
  await deleteSession(db, params.id, user.id);

  return new Response("Revoked", { status: 200 });
};