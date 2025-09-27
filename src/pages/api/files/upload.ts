import type { APIRoute } from "astro";
import { getUserFromSession } from "../../../utils/session";
import { uploadFile } from "../../../utils/r2";
import { createAuditLog } from "../../../utils/db";
import { nanoid } from "nanoid";

export const post: APIRoute = async (context) => {
  const user = await getUserFromSession(context);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const request = context.request;
  const contentType = request.headers.get("content-type");
  if (!contentType || !contentType.includes("multipart/form-data")) {
    return new Response("Invalid content type", { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  if (!file) return new Response("No file provided", { status: 400 });

  const r2Bucket = context.locals.runtime.env.R2_BUCKET;
  const fileKey = `${user.id}/${nanoid()}-${file.name}`;

  try {
    await uploadFile(r2Bucket, fileKey, await file.arrayBuffer(), file.type);
    await createAuditLog(context.locals.runtime.env.DB, {
      user_id: user.id,
      event_type: "file_upload",
      details: `File uploaded: ${fileKey}`,
    });
    return new Response(JSON.stringify({ message: "File uploaded successfully", key: fileKey }), { status: 200 });
  } catch (e) {
    await createAuditLog(context.locals.runtime.env.DB, {
      user_id: user.id,
      event_type: "file_upload_failed",
      details: String(e),
    });
    return new Response("File upload failed", { status: 500 });
  }
};