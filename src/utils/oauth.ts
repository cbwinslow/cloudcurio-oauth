import { env } from "./env";

export async function getOAuthTokens(code: string) {
  const res = await fetch(`${env.OAUTH_PROVIDER_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.OAUTH_CLIENT_ID,
      client_secret: env.OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: env.OAUTH_CALLBACK_URL,
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error("OAuth token exchange failed");
  return await res.json();
}

export async function getUserInfo(access_token: string) {
  const res = await fetch(`${env.OAUTH_PROVIDER_URL}/userinfo`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  if (!res.ok) throw new Error("Fetching user info failed");
  return await res.json();
}