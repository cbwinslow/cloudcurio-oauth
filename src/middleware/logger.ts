import { logTraffic } from "../utils/logger";

export async function onRequest({ request, locals }, next) {
  await logTraffic(request, locals.runtime.env.DB);
  return next();
}