import { nanoid } from "nanoid";

export type User = {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: "user" | "admin";
  created_at: string;
  updated_at: string;
};

export type Session = {
  id: string;
  user_id: string;
  expires_at: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_id?: string;
  event_type: string;
  ip_address?: string;
  user_agent?: string;
  details?: string;
  created_at: string;
};

export function createUser(db: D1Database, user: { id: string; email: string; name?: string; avatar_url?: string; role?: "user" | "admin" }) {
  return db.prepare("INSERT INTO users (id, email, name, avatar_url, role) VALUES (?, ?, ?, ?, ?)")
    .bind(user.id, user.email, user.name, user.avatar_url, user.role ?? "user")
    .run();
}

export function updateUser(db: D1Database, userId: string, data: { name?: string; avatar_url?: string; }) {
  return db.prepare("UPDATE users SET name = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
    .bind(data.name, data.avatar_url, userId)
    .run();
}

export function getUserByEmail(db: D1Database, email: string) {
  return db.prepare("SELECT * FROM users WHERE email = ?").bind(email).first<User>();
}

export function getUserById(db: D1Database, userId: string) {
  return db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first<User>();
}

export async function createSession(db: D1Database, userId: string, expires_at: Date): Promise<string> {
  const newSession = { id: nanoid(), user_id: userId, expires_at: expires_at.toISOString() };
  await db.prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(newSession.id, newSession.user_id, newSession.expires_at)
    .run();
  return newSession.id;
}

export function getSession(db: D1Database, sessionId: string) {
  return db.prepare("SELECT * FROM sessions WHERE id = ?").bind(sessionId).first<Session>();
}

export function createAuditLog(db: D1Database, log: Omit<AuditLog, "id" | "created_at">) {
  const newLog = { ...log, id: nanoid() };
  return db.prepare("INSERT INTO audit_logs (id, user_id, event_type, ip_address, user_agent, details) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(newLog.id, newLog.user_id, newLog.event_type, newLog.ip_address, newLog.user_agent, newLog.details)
    .run();
}

export function getUsers(db: D1Database) {
  return db.prepare("SELECT * FROM users").all<User>();
}