export async function isIpAllowed(ip: string, db: D1Database) {
  const { results } = await db.prepare(
    "SELECT 1 FROM ip_lists WHERE ip = ? AND type = 'allow'"
  ).bind(ip).all();
  return results.length > 0;
}

export async function isIpBlocked(ip: string, db: D1Database) {
  const { results } = await db.prepare(
    "SELECT 1 FROM ip_lists WHERE ip = ? AND type = 'block'"
  ).bind(ip).all();
  return results.length > 0;
}