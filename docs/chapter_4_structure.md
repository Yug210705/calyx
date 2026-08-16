# Project Atlas - Chapter 4: Production Folder Structure & Coding Standards

## 4.1 Architecture Decision
Atlas will use a **Modular Monolith + Clean Architecture + Domain-Driven Module Structure**.
The backend will be one FastAPI application, but each business domain will be isolated into its own module.

## 4.2 Complete Project Structure
```text
atlas/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   │
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   ├── logging.py
│   │   ├── exceptions.py
│   │   ├── middleware.py
│   │   ├── dependencies.py
│   │   └── constants.py
│   │
│   ├── db/
│   │   ├── base.py
│   │   ├── session.py
│   │   └── init_db.py
│   │
│   ├── api/
│   │   └── v1/
│   │       ├── router.py
│   │       ├── auth.py
│   │       ├── users.py
│   │       ├── organizations.py
│   │       ├── projects.py
│   │       ├── tasks.py
│   │       └── ...
│   │
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── organizations/
│   │   ├── projects/
│   │   ├── tasks/
│   │   └── ...
│   │
│   ├── workers/
│   │   ├── celery_app.py
│   │   └── tasks/
│   │
│   ├── websocket/
│   │   ├── manager.py
│   │   ├── events.py
│   │   └── router.py
│   │
│   └── shared/
│       ├── enums.py
│       ├── pagination.py
│       ├── responses.py
│       ├── types.py
│       └── utils.py
│
├── tests/
├── alembic/
├── scripts/
├── monitoring/
├── nginx/
├── docker/
├── .env.example
├── docker-compose.yml
├── pyproject.toml
└── README.md
```

## 4.3 app/main.py
Minimal responsibilities: create app, register middleware, handlers, API/WebSocket routers, configure startup/shutdown. No business logic.

## 4.4 Core Layer
`core/` handles application-wide infrastructure.
`core/config.py` loads settings from env vars using Pydantic Settings.
Never hardcode passwords or secrets in code.

## 4.7 Database Layer
`db/base.py` for SQLAlchemy declarative base.
`db/session.py` for PostgreSQL engine, connection pool, async session.

## 4.9 API Layer
Thin routes delegating to the service layer.
Example: `@router.post("/tasks")` calls `service.create_task()`.

## 4.10 API Versioning
All APIs begin with `/api/v1`.

## 4.11 Domain Modules
Each major domain (e.g., `tasks`) gets its own module: `models.py`, `schemas.py`, `repository.py`, `service.py`, `dependencies.py`, `permissions.py`, `constants.py`.

## 4.14 Model vs Schema
**Model** (`SQLAlchemy`): Represents database structure.
**Schema** (`Pydantic`): Represents API data (requests/responses).

## 4.15 Repository Pattern
Repositories abstract database operations (e.g., `get_by_id`, `create`, `update`).

## 4.16 Service Pattern
Where business rules belong (e.g., authorization, validation, repository calls, events).

## 4.17 Dependency Injection
Dependencies (`get_db`, `get_current_user`, `get_task_service`) are centralized.

## 4.18 Shared Components
`shared/` contains non-domain-specific code (e.g., enums, pagination standard).

## 4.19 Pagination Standard
Endpoints should support `?page=1&page_size=20`.

## 4.20 Standard API Response
**Success**: `{"success": true, "data": {...}}`
**Error**: `{"success": false, "error": {"code": "...", "message": "..."}}`

## 4.21 Exception Architecture
Custom hierarchy (e.g., `AtlasException` -> `ResourceNotFoundError`) caught by FastAPI handlers.

## 4.22 Logging
Structured logging (e.g., `request_id`, `user_id`, `action`, `duration_ms`). Never log secrets.

## 4.23 Request ID Middleware
Injects a unique ID (`X-Request-ID`) into every request.

## 4.25 Security Module
`core/security.py` for hashing, JWT creation/verification.

## 4.26 Celery Structure
`workers/` handles background jobs (e.g., email, notifications) to avoid blocking API requests.

## 4.27 WebSocket Structure
`manager.py` (connection state), `events.py` (event definitions), `router.py`.

## 4.28 Testing Structure
Separated by purpose: `unit/`, `integration/`, `api/`, `websocket/`.
Use `conftest.py` for reusable fixtures (`test_database`, `test_client`, `test_user`).
Never use the production DB for tests.

## 4.34 Alembic
Database migrations in `alembic/`. Never manually modify production schemas.

## 4.35 Code Formatting & Type Checking
- **Ruff** for linting/formatting (line length 88-100, strict).
- **Mypy** for strict type checking.

## 4.37 pyproject.toml
Central configuration for dependencies, Ruff, Pytest, Mypy.

## 4.38 Docker Structure
`Dockerfile` for API, `Dockerfile.worker` for Celery, `docker-compose.yml` for local dev.

## 4.40 Nginx
Reverse proxy for API, WebSocket forwarding, security headers.

## 4.41 Git Structure
Branches (`main`, `develop`, `feature/*`, `fix/*`). Conventional commits (`feat:`, `fix:`, `test:`).

## 4.42 CI/CD Pipeline
GitHub actions for tests, linting, Docker builds, and deployment.

## 4.46 Naming Conventions
- Python files: `snake_case.py`
- Classes: `PascalCase`
- Functions: `snake_case()`
- Constants: `UPPER_SNAKE_CASE`
- Database: `snake_case`

## 4.58 Complete Request Lifecycle
Request → NGINX → FastAPI Router → Middleware → JWT/Permission Check → Schema Validation → Service → Repository → PostgreSQL & RabbitMQ (Events)

## 4.60 Definition of Done — Chapter 4
- Production folder structure mapped out
- Domain modules, API versioning, Clean Architecture confirmed
- Service, Repository, Dependency Injection patterns established
- Standardized logging, exceptions, responses
- CI/CD, Docker, Celery, WebSocket structures prepared
- Coding and testing conventions defined
