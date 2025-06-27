# CloudCurio OAuth Portal – Architecture & Security Overview

## Project Structure

- **Astro**: Static-first, server-rendered, supports React islands.
- **React**: For dynamic UI (login, dashboard, etc.).
- **Tailwind CSS**: Utility-first CSS for rapid, consistent design.
- **Cloudflare D1**: SQL database for users, sessions, audit, traffic.
- **API routes**: Astro server endpoints for OAuth, session, logging.
- **Zod**: Runtime validation for env/config and user inputs.

## OAuth Flow

- User clicks provider login (e.g., GitHub).
- Redirects to provider; on success, callback endpoint exchanges code for tokens.
- User info and tokens stored in D1, session cookie is set (secure, HttpOnly).
- All actions are audited in `audit_logs`.
- Session persists via signed cookies (see `SESSION_SECRET`).

## Audit & Security

- All login attempts, token exchanges, and user actions are logged (user ID, IP, UA, result).
- Sessions use secure, signed cookies.
- All env secrets are loaded and validated at startup.
- No secrets exposed to client.
- All API endpoints rate-limited and validated.

## Traffic Logging

- Every page/API hit logs IP (anonymized), UA, referrer, and path in `traffic_logs`.
- Analytics can be exported or queried for compliance.

## Extensibility

- Add new OAuth providers in `src/pages/api/oauth/start.ts`.
- Add new user metadata by extending `users` table and registration logic.
- Add admin dashboard by querying `audit_logs` and `traffic_logs`.

## Usage

- Configure `.env` and `wrangler.toml` with your secrets and D1 details.
- Deploy to Cloudflare Pages with D1 binding.
- See `README.md` for quick start and deployment.

## Security Best Practices

- **Do not** commit real secrets or `.env` to git.
- Use D1 for all user/session/token storage, not KV.
- Cookies: Secure, HttpOnly, SameSite=Strict or Lax.
- Session expiration is enforced in D1 and cookies.
- All logging is GDPR-compliant (no PII unless user consents).

## Advanced Features

- Webhook notifications for logins, MFA, alerts, and more
- Real-time analytics dashboard with geo, session, and failure metrics
- Interactive admin dashboard for logs and analytics
- Device fingerprinting, anomaly detection, and RBAC
- GDPR/CCPA endpoints for data export/delete