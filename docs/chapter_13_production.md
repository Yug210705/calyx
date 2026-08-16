# Project Atlas - Chapter 13: Security, Testing, Docker, CI/CD & Deployment

## 13.1 Objective
Make Atlas production-ready by enforcing security perimeters, rigorous automated testing, containerized infrastructure, and CI/CD pipelines.

## 13.2 - 13.12 Security Architecture & Authorization
- **Passwords**: Hashed via Argon2id.
- **JWT**: Short-lived Access Tokens + longer-lived Refresh Tokens (with rotation). Token revocation tracked in `user_sessions`.
- **Authorization (RBAC)**: Roles mapped to specific permissions.
- **Multi-Tenant Security**: The ultimate security boundary. Every database query MUST enforce `organization_id` (e.g. `where(Project.organization_id == current_user.org_id)`).

## 13.13 - 13.18 Input Validation, Injection & XSS
- **Validation**: Pydantic models validate all inputs (length, types). Never blindly trust client data (e.g., trying to set their own role to OWNER).
- **SQL Injection**: Prevented by SQLAlchemy parameterized queries.
- **XSS & File Uploads**: Sanitize rich text. Never trust uploaded filenames, extensions, or MIME types. Use presigned URLs for direct-to-S3 uploads to prevent FastAPI from bottlenecking.

## 13.19 - 13.26 Rate Limiting, Headers, Secrets & Audit
- **Rate Limiting**: Sliding window implementation using Redis (e.g., 5 login attempts / min / IP).
- **Headers & CORS**: Nginx provides security headers (HSTS, CSP, X-Frame-Options) and restricts CORS origins in production.
- **Secrets**: Never commit `.env` values. Use AWS Secrets Manager in production.
- **Security Audit Logs**: Explicit tracking for LOGIN_FAILED, ROLE_CHANGED, SESSION_REVOKED.

## 13.27 - 13.39 Testing Strategy
- **Layers**: Unit (isolated logic), Service (business logic & events), Repository (DB queries), API/Integration (full request flow), E2E.
- **Pytest Fixtures**: Use robust fixtures for `db_session`, `authenticated_client`, `test_user`, etc.
- **Crucial Scenarios**: Cross-organization IDOR attempts, RBAC violations, Token expirations, Celery retries.
- **Coverage**: Focus on critical business logic rather than 100% blind statement coverage.

## 13.40 - 13.53 Docker & Nginx Architecture
- **Docker Compose**: Orchestrates API, Celery Worker, Celery Beat, Postgres, Redis, and RabbitMQ.
- **Health & Readiness**: `/health` for basic process status. `/ready` checks DB, Redis, and RabbitMQ connectivity.
- **Graceful Shutdown**: On `SIGTERM`, stop accepting requests, finish active work, and close DB/Redis pools safely.
- **Nginx**: Handles TLS termination, reverse proxying, and compression.
- **Logging & Error Formatting**: Standard JSON error responses (`{"error": {"code": "TASK_NOT_FOUND", ...}}`). Structured JSON logging with `X-Request-ID` attached to everything for traceability.

## 13.54 - 13.64 CI/CD Pipeline (GitHub Actions)
- **Workflow**: Push/PR → Lint (Ruff) → Type Check (Mypy) → Tests (Pytest) → Security Scan (Trivy/pip-audit) → Docker Build.
- **Branch Protection**: `main` requires passing CI and code review. Work is done in feature branches.
- **Commit Messages**: Semantic commits (feat, fix, refactor, docs).

## 13.65 - 13.79 Deployment, Migrations & Disaster Recovery
- **Alembic Migrations**: Never manually alter production schema. Always `alembic upgrade head`.
- **Staging vs Prod**: Always deploy to Staging first and run smoke tests before Prod.
- **Rollback**: If health checks fail on deployment, revert to the previous Docker image immediately.
- **Disaster Recovery**: Automated Postgres backups and point-in-time recovery. Test restorations periodically.

## 13.80 Definition of Done — Chapter 13
- Comprehensive JWT/RBAC security and Tenant Isolation.
- Passing Unit, Integration, and Security Test suites.
- Containerized infrastructure (Docker).
- Complete GitHub Actions CI/CD pipeline (Lint, Test, Scan, Build).
- Production-ready logs, errors, and health checks.
