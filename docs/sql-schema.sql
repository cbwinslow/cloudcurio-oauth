-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  avatar_url TEXT,
  provider TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OAuth tokens table
CREATE TABLE IF NOT EXISTS oauth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  provider TEXT,
  issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  action TEXT,
  status TEXT,
  ip TEXT,
  user_agent TEXT,
  details TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Session table
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  device TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

-- Traffic log table
CREATE TABLE IF NOT EXISTS traffic_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  user_agent TEXT,
  referrer TEXT,
  path TEXT,
  country TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- MFA OTP table
CREATE TABLE IF NOT EXISTS mfa_otps (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  email TEXT,
  otp TEXT,
  used INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login attempts for lockout/rate-limiting
CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT,
  ip TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  success INTEGER
);

-- Token blacklist (for JWT revocation)
CREATE TABLE IF NOT EXISTS token_blacklist (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token TEXT,
  expires_at TIMESTAMP
);

-- IP allow/block list
CREATE TABLE IF NOT EXISTS ip_lists (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT,
  type TEXT CHECK(type IN ('allow', 'block')),
  note TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User device fingerprinting
CREATE TABLE IF NOT EXISTS user_devices (
  user_id TEXT,
  device_hash TEXT,
  first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(user_id, device_hash)
);