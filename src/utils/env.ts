import { z } from "zod";

const envSchema = z.object({
  OAUTH_CLIENT_ID: z.string(),
  OAUTH_CLIENT_SECRET: z.string(),
  OAUTH_PROVIDER_URL: z.string(),
  OAUTH_CALLBACK_URL: z.string(),
  SESSION_SECRET: z.string(),
  SITE_URL: z.string(),
  CLOUDFLARE_ANALYTICS_TOKEN: z.string().optional(),
  WEBHOOK_URL: z.string().optional(),
});

export const env = envSchema.parse({
  OAUTH_CLIENT_ID: process.env.OAUTH_CLIENT_ID,
  OAUTH_CLIENT_SECRET: process.env.OAUTH_CLIENT_SECRET,
  OAUTH_PROVIDER_URL: process.env.OAUTH_PROVIDER_URL,
  OAUTH_CALLBACK_URL: process.env.OAUTH_CALLBACK_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SITE_URL: process.env.SITE_URL,
  CLOUDFLARE_ANALYTICS_TOKEN: process.env.CLOUDFLARE_ANALYTICS_TOKEN,
  WEBHOOK_URL: process.env.WEBHOOK_URL,
});