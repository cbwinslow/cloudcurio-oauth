import type { APIRoute } from "astro";
import { env } from "../../utils/env";

export const get: APIRoute = async ({ request }) => {
  const providerUrl = env.OAUTH_PROVIDER_URL;
  const clientId = env.OAUTH_CLIENT_ID;
  const callbackUrl = env.OAUTH_CALLBACK_URL;
  const state = Math.random().toString(36).substring(2);

  const url = `${providerUrl}/authorize?client_id=${encodeURIComponent(clientId)}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=openid%20email%20profile&state=${state}`;

  return Response.redirect(url, 302);
};