type D1Database = import("@cloudflare/workers-types").D1Database;

export const getUserSessions = async (db: D1Database, userId: string) => {
  const { results } = await db
    .prepare("SELECT * FROM sessions WHERE user_id = ?")
    .bind(userId)
    .all();
  return results;
};

export const deleteSession = async (
  db: D1Database,
  sessionId: string,
  userId: string
) => {
  await db
    .prepare("DELETE FROM sessions WHERE id = ? AND user_id = ?")
    .bind(sessionId, userId)
    .run();
};