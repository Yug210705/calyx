# Project Atlas - Chapter 5: Authentication, JWT, OAuth2 & RBAC

## 5.1 Authentication Architecture
Atlas will implement a production-grade identity system supporting user registration, email verification, secure password hashing, login, tokens, rotation, sessions, OAuth2, and RBAC.
**Authentication**: "Who are you?"
**Authorization**: "What are you allowed to do?"

## 5.3 Authentication Modules
Structure in `app/modules/auth/`:
- `models.py`, `schemas.py`, `repository.py`, `service.py`, `dependencies.py`, `permissions.py`, `oauth.py`, `tokens.py`, `security.py`, `constants.py`.

## 5.4 & 5.5 User Model & Password Hashing
Never store raw passwords. Use Argon2id for password hashing.
Flow: Password → Argon2id → Stored Hash.

## 5.6 & 5.7 Registration & Email Verification
Registration stores a user, generates a verification token, and sends an email via Celery asynchronously.
Verification tokens should be single-use, hashed at rest, and expire.

## 5.9 Login Flow
Email + Password → Find User → Verify Hash → Check Status → Create Session → Generate Access/Refresh Tokens.

## 5.10 - 5.15 Tokens & Security
- **Access Token**: Short-lived (15-30 mins), purely for API authorization.
- **Refresh Token**: Long-lived (7-30 days), stored as a hash in DB.
- **Token Rotation**: Every refresh invalidates the old RT and issues a new one.
- **Reuse Detection**: If a revoked RT is used, the entire token family (session) is revoked, forcing re-login.

## 5.16 & 5.17 Sessions & Logout
`user_sessions` tracks active sessions (device, IP).
Logout revokes the specific session and refresh token. `logout-all` revokes all sessions for a user.

## 5.19 & 5.21 Current User & JWT Verification
`get_current_user` dependency verifies JWT signature, expiration, type, issuer, session validity, and user status.

## 5.23 - 5.26 OAuth2 Architecture
Google OAuth2 support.
`oauth_accounts` table links `provider` and `provider_user_id` to a global `user_id`.
Secure account linking prevents duplicate accounts for the same verified email.

## 5.27 & 5.28 Password Reset
Forgot password generates a hashed, short-lived, single-use token sent via email. Resetting the password revokes existing sessions.

## 5.29 & 5.30 Account Locking & Rate Limiting
Redis-backed rate limiting (e.g., 5 failed logins / minute / IP) to prevent brute-forcing and abuse.

## 5.31 - 5.40 RBAC Architecture
- **Hierarchy**: Organization → Membership → Role → Permissions.
- **Roles**: SYSTEM_ADMIN, ORGANIZATION_OWNER, ORGANIZATION_ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER.
- **Permissions**: Explicit rules (e.g., `project.create`, `task.update`).
- **Resource Ownership**: Role checks apply only within the scope of the organization the user belongs to.

## 5.41 & 5.42 Authorization Flow & 401 vs 403
- **401 Unauthorized**: Unauthenticated (no valid JWT).
- **403 Forbidden**: Authenticated but lacks permission.
Request → JWT → User → Organization → Membership → Role → Permission → Resource → Allowed?

## 5.43 - 5.48 Security
- **Headers & CORS**: Secure headers, restricted origins.
- **Tokens**: Access tokens in memory or auth header, not localStorage if avoidable, or HttpOnly cookies.
- **SQL Injection**: SQLAlchemy parameterized queries.
- **XSS**: Input validation, sanitize HTML.

## 5.49 & 5.50 Audit Logging & Events
Record auth events (USER_REGISTERED, LOGIN, LOGOUT, PASSWORD_RESET) in `audit_logs` without secrets. Publish internal events.

## 5.51 Authentication API
Endpoints for register, login, refresh, logout, verify-email, forgot-password, reset-password, change-password, google-login/callback, sessions.

## 5.56 & 5.57 Example Dependencies
`get_current_user` handles JWT validation.
`require_permission("...")` handles RBAC checks tied to the current organization context.

## 5.58 & 5.59 Testing
Extensive unit, integration, and security tests covering invalid credentials, rate limits, token rotations, privilege escalation, and multi-tenant boundary enforcement.

## 5.61 Definition of Done — Chapter 5
- Registration, Password Hashing, Login, JWT logic.
- Refresh tokens, rotation, reuse detection.
- Sessions, Logout, Password Reset.
- Google OAuth2.
- RBAC, permission checks, organization-scoped auth.
- Rate limiting, security headers, CORS, audit logs.
- Thorough tests.
