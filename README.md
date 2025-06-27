# CloudCurio OAuth Portal

A professional, enterprise-ready OAuth portal for CloudCurio.cc. Built with Astro, React, Tailwind CSS, and Cloudflare D1 for secure authentication, session management, traffic analytics, and audit logging.

## Features

- Enterprise OAuth login (multi-provider ready)
- User and token storage with Cloudflare D1
- Secure, signed cookie sessions
- Full audit trail and analytics
- Traffic logging (IP, UA, referrer, timestamp)
- Modular React UI with Astro islands
- TailwindCSS design system
- Extensible, fully documented codebase

## Enterprise Features

- Multi-Factor Authentication (MFA) with email OTP
- Role-Based Access Control (RBAC)
- Account lockout & rate limiting for brute-force protection
- JWT/token revocation & blacklist
- IP allowlist/blocklist for admin or sensitive areas
- Device fingerprinting & anomaly detection
- GDPR/CCPA: Data export and deletion endpoints
- Admin dashboard for audit & traffic logs
- Health check/status endpoint
- Localization (i18n) and accessibility
- Suspicious activity alerts (email/webhook integration)
- Webhook notifications for logins, MFA, alerts, and more
- Advanced analytics dashboard (sessions, unique users, geo, failed logins)

## Quick Start

1. **Clone the repo:**
   ```bash
   git clone https://github.com/cloudcurio/cloudcurio-oauth.git
   cd cloudcurio-oauth
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env` and set your secrets.
   - Edit `wrangler.toml` with your D1 database info.

4. **Apply D1 schema:**
   - Use Cloudflare dashboard or CLI to run `docs/sql-schema.sql` on your D1 instance.

5. **Start development:**
   ```bash
   npm run dev
   ```

6. **Deploy:**
   - Push to your repo, connect to Cloudflare Pages, and set up D1 binding.

## Documentation

- Architecture: [docs/architecture.md](docs/architecture.md)
- SQL Schema: [docs/sql-schema.sql](docs/sql-schema.sql)
- See in-code comments for endpoint and security details.

## Security

- All secrets in `.env` (not committed)
- All cookies: Secure, HttpOnly, SameSite
- All user actions and logins are audited

---

© 2025 CloudCurio. All rights reserved.