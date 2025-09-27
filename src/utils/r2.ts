export async function uploadFile(bucket: R2Bucket, key: string, body: ArrayBuffer | ReadableStream, contentType?: string) {
  const metadata: R2PutOptions = {};
  if (contentType) {
    metadata.httpMetadata = { contentType };
  }
  return bucket.put(key, body, metadata);
}

export async function getFile(bucket: R2Bucket, key: string): Promise<R2ObjectBody | null> {
  const obj = await bucket.get(key);
  if (!obj) return null;
  return obj;
}

export async function deleteFile(bucket: R2Bucket, key: string) {
  return bucket.delete(key);
}

export async function listFiles(bucket: R2Bucket, prefix?: string) {
  const listed = await bucket.list({ prefix });
  return listed.objects;
}