const ATTEMPT_LIMIT = 10;
const WINDOW_MINUTES = 10;

export async function isRateLimited(user_id: string, ip: string, db: D1Database) {
  const { results } = await db.prepare(
    "SELECT COUNT(*) as count FROM login_attempts WHERE (user_id = ? OR ip = ?) AND timestamp >= datetime('now', ?)"
  ).bind(user_id, ip, `-${WINDOW_MINUTES} minutes`).all();

  return results[0]?.count >= ATTEMPT_LIMIT;
}

export async function logLoginAttempt(user_id: string, ip: string, success: boolean, db: D1Database) {
  await db.prepare(
    "INSERT INTO login_attempts (user_id, ip, success, timestamp) VALUES (?, ?, ?, CURRENT_TIMESTAMP)"
  ).bind(user_id, ip, success ? 1 : 0).run();
}