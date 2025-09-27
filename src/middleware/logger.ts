import { logRequest } from "../utils/logger";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  await logRequest(context);
  return next();
});