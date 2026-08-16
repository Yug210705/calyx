# Project Atlas - Chapter 15: Integrations, Webhooks & API Platform

## 15.1 Objective
Transform Atlas into an extensible enterprise platform by building a versioned Public API, API Keys, OAuth2 Integrations (GitHub, Slack, Calendar), and a robust Webhook delivery & reception system.

## 15.3 - 15.7 Public API & API Keys
- **Versioning**: Always use `/api/v1/` to allow future backwards-incompatible changes under `/api/v2/`.
- **API Keys**: Stored in DB as hashes (`key_hash`). Never store plaintext keys.
- **Least Privilege Permissions**: API keys must have granular scopes (e.g., `tasks:read`, `projects:write`), forbidding destructive actions by default.

## 15.8 - 15.14 OAuth2 Integrations
- **Flow**: User redirects to provider (GitHub) → User approves → Atlas receives `code` and `state` (for CSRF) → Atlas exchanges for tokens.
- **Storage**: Tokens (`access_token`, `refresh_token`) MUST be stored encrypted in the DB (`integrations` table).
- **Use Cases**: Link a GitHub Issue to an Atlas Task, or automatically transition an Atlas task to DONE when a linked GitHub PR is merged.

## 15.15 - 15.21 Incoming Webhooks
- **Architecture**: Webhook hits API → Verify Signature (`X-Hub-Signature-256`) → Store in `webhook_events` DB → Queue RabbitMQ event → Celery worker processes async.
- **Idempotency**: Prevent duplicate processing by creating a unique constraint on `(provider, external_event_id)`.
- **Retries**: If processing fails, retry with exponential backoff. Move poison pills to a Dead Letter Queue (DLQ).

## 15.22 - 15.25 Outgoing Webhooks
- Allow external apps to subscribe to Atlas events (`task.created`, `sprint.started`).
- **Flow**: Outbox → RabbitMQ → Celery Webhook Dispatcher → External URL.
- **Security**: Atlas signs the payload using HMAC-SHA256 with the subscriber's secret (`X-Atlas-Signature`), allowing them to verify the payload's authenticity.

## 15.26 - 15.30 Other Integrations
- **Slack**: Send channel notifications on task completion, support Slash commands (`/atlas task ATLAS-142`).
- **Google Calendar**: Sync Sprint deadlines or meetings. Sync should be periodic via Celery Beat or strictly event-driven.

## 15.31 - 15.39 API Platform Standards
- **Rate Limiting**: Track requests via Redis (`rate_limit:user:123`). Return HTTP 429 with limit headers.
- **Standardized Errors**: Consistent JSON (`code`, `message`, `request_id`).
- **Bulk APIs**: E.g., `POST /tasks/bulk-update`.
- **Pagination & Sorting Limits**: Never allow unbounded queries (`?limit=10000000`). Restrict limits and whitelist sorting keys.

## 15.40 - 15.47 Failure Isolation & Management
- If GitHub is down, Atlas core (Tasks, Projects) must continue to function normally. Display "Integration temporarily unavailable."
- **Integration Dashboard**: Users manage connections, view sync logs, and generate API keys.
- **API Analytics**: Track endpoint usage, latency, and errors for the developer portal.

## 15.48 Definition of Done — Chapter 15
- Versioned public APIs with rate limiting and pagination.
- Secure API key generation and hashed storage.
- OAuth2 token encryption and flow.
- GitHub and Slack integrations.
- Incoming & Outgoing webhooks with signature verification, retries, and idempotency.
- Robust integration testing and error isolation.
