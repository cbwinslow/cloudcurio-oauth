import type { APIRoute } from "astro";
import { deleteUser } from "../../../data/users";

export const POST: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const db = locals.runtime.env.DB;
  await deleteUser(db, user.id);

  return new Response("Deleted", { status: 200 });
};