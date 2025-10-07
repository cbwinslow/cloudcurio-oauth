type D1Database = import("@cloudflare/workers-types").D1Database;

export const deleteUser = async (db: D1Database, userId: string) => {
  await db.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();
  await db
    .prepare("DELETE FROM oauth_tokens WHERE user_id = ?")
    .bind(userId)
    .run();
  await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId).run();
};

export const getUserData = async (db: D1Database, userId: string) => {
  const userData = await db
    .prepare("SELECT * FROM users WHERE id = ?")
    .bind(userId)
    .first();
  const tokens = await db
    .prepare("SELECT * FROM oauth_tokens WHERE user_id = ?")
    .bind(userId)
    .all();
  const sessions = await db
    .prepare("SELECT * FROM sessions WHERE user_id = ?")
    .bind(userId)
    .all();

  return { userData, tokens, sessions };
};