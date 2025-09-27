import type { APIRoute } from "astro";
import { getUserFromSession } from "../../../utils/session";
import { getFile, deleteFile } from "../../../utils/r2";
import { createAuditLog } from "../../../utils/db";

export const get: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const key = context.params.key;
  if (!key) return new Response("Missing file key", { status: 400 });

  // For simplicity, this allows any authenticated user to download any file.
  // In a real application, you would add more sophisticated access control here.
  // For example, checking if the user owns the file or has been granted access.

  const r2Bucket = context.locals.runtime.env.R2_BUCKET;
  const file = await getFile(r2Bucket, key);

  if (!file) {
    return new Response("File not found", { status: 404 });
  }

  return new Response(file.body, {
    headers: {
      "Content-Type": file.httpMetadata?.contentType || "application/octet-stream",
      "Content-Length": file.size.toString(),
    },
  });
};

export const del: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const key = context.params.key;
  if (!key) return new Response("Missing file key", { status: 400 });

  // Add access control here to ensure only authorized users can delete files.
  // For example, check if `key.startsWith(user.id)`.

  const r2Bucket = context.locals.runtime.env.R2_BUCKET;
  await deleteFile(r2Bucket, key);

  await createAuditLog(context.locals.runtime.env.DB, {
    user_id: user.id,
    event_type: "file_delete",
    details: `File deleted: ${key}`,
  });

  return new Response("File deleted", { status: 200 });
};