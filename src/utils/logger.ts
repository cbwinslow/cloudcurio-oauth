export async function logAudit(
  user_id: string | null,
  action: string,
  status: string,
  ip: string,
  user_agent: string,
  details: string,
  db: D1Database
) {
  await db.prepare(
    "INSERT INTO audit_logs (user_id, action, status, ip, user_agent, details, timestamp) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)"
  ).bind(user_id, action, status, ip, user_agent, details).run();
}

// Log traffic for analytics (middleware usage)
export async function logTraffic(request: Request, db: D1Database) {
  const ip = request.headers.get("cf-connecting-ip") ?? "";
  const userAgent = request.headers.get("user-agent") ?? "";
  const referrer = request.headers.get("referer") ?? "";
  const url = new URL(request.url);
  const path = url.pathname;

  let country = null;
  if (ip) {
    try {
      // Free IP geolocation API
      const geo = await fetch(`https://ipapi.co/${ip}/country/`).then(r => r.text());
      country = geo.length === 2 ? geo : null;
    } catch { /* ignore */ }
  }

  await db.prepare(
    "INSERT INTO traffic_logs (ip, user_agent, referrer, path, country) VALUES (?, ?, ?, ?, ?)"
  ).bind(ip, userAgent, referrer, path, country).run();
}