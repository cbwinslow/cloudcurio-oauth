import type { APIRoute } from "astro";
import { destroySessionCookie } from "../utils/session";
export const get: APIRoute = async ({ cookies }) => {
  destroySessionCookie(cookies);
  return Response.redirect("/", 302);
};