import type { APIRoute } from "astro";
import { nanoid } from "nanoid";
import { env } from "../../../utils/env";

export const GET: APIRoute = async ({ cookies }) => {
  const providerUrl = env.OAUTH_PROVIDER_URL;
  const clientId = env.OAUTH_CLIENT_ID;
  const callbackUrl = env.OAUTH_CALLBACK_URL;
  const state = nanoid(16);

  cookies.set("oauth_state", state, {
    path: "/",
    httpOnly: true,
    secure: import.meta.env.PROD,
    maxAge: 60 * 10, // 10 minutes
  });

  const url = new URL(`${providerUrl}/authorize`);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", callbackUrl);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);

  return Response.redirect(url.toString(), 302);
};