const LOGIN_ATTEMPT_LIMIT = 10;
const LOGIN_WINDOW_MINUTES = 15;

export async function isRateLimited(db: D1Database, ip: string, userId?: string) {
  let query = "SELECT COUNT(*) as count FROM audit_logs WHERE event_type LIKE '%login%' AND ip_address = ? AND created_at >= datetime('now', ?)";
  const params: (string | number)[] = [ip, `-${LOGIN_WINDOW_MINUTES} minutes`];

  if (userId) {
    query += " OR user_id = ?";
    params.push(userId);
  }

  const { results } = await db.prepare(query).bind(...params).all();
  const count = (results[0]?.count as number) ?? 0;
  return count >= LOGIN_ATTEMPT_LIMIT;
}