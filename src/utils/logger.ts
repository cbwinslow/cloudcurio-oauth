import { createAuditLog } from "./db";
import type { APIContext } from "astro";

export async function logRequest(context: APIContext) {
  const { request, locals, url } = context;
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";

  await createAuditLog(locals.runtime.env.DB, {
    event_type: "http_request",
    ip_address: ip,
    user_agent: userAgent,
    details: `${request.method} ${url.pathname}`,
  });
}