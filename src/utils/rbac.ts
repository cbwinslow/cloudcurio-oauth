export function isAdmin(user) {
  return user?.role === "admin";
}

export function requireAdmin(user) {
  if (!isAdmin(user)) throw new Error("Not authorized");
}