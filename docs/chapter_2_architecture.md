# Project Atlas - Chapter 2: Software Architecture & Clean Architecture

## 2.1 Architecture Goals
Atlas should be:
- **Modular** — each business domain is independently organized.
- **Maintainable** — changes in one module should have minimal impact elsewhere.
- **Testable** — business logic should be testable without starting the entire application.
- **Scalable** — API servers and workers can scale independently.
- **Secure** — authentication and authorization are enforced consistently.
- **Observable** — logs, metrics, health checks, and errors are traceable.
- **Deployable** — the same application should work locally, in staging, and in production.

## 2.2 High-Level Architecture
```text
                         CLIENTS
                            │
                ┌───────────┴───────────┐
                │                       │
             Web App              Mobile / API
                │                       │
                └───────────┬───────────┘
                            │
                         HTTPS
                            │
                       ┌────▼────┐
                       │  NGINX  │
                       └────┬────┘
                            │
                  ┌─────────▼─────────┐
                  │      FastAPI      │
                  │    API Servers    │
                  └─────────┬─────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
   ┌────▼─────┐       ┌─────▼─────┐       ┌─────▼──────┐
   │PostgreSQL│       │   Redis   │       │  RabbitMQ  │
   │           │       │           │       │            │
   │Persistent │       │ Cache     │       │ Message    │
   │Data       │       │ Sessions  │       │ Broker     │
   └───────────┘       └───────────┘       └─────┬──────┘
                                                 │
                                           ┌─────▼─────┐
                                           │  Celery   │
                                           │  Workers  │
                                           └─────┬─────┘
                                                 │
                                  ┌──────────────┼──────────────┐
                                  │              │              │
                               Emails       Notifications    Scheduled Jobs
```

## 2.3 Request Flow
Every normal API request should follow this flow:
`Client` → `Nginx` → `FastAPI Router` → `Authentication Middleware` → `Permission Check` → `Pydantic Schema Validation` → `Service Layer` → `Repository Layer` → `SQLAlchemy` → `PostgreSQL` → `Response Schema` → `Client`

## 2.4 Clean Architecture
Atlas will use a layered Clean Architecture.
```text
┌─────────────────────────────────────┐
│              API Layer              │
│        Routes / Controllers         │
├─────────────────────────────────────┤
│            Service Layer            │
│          Business Logic             │
├─────────────────────────────────────┤
│          Repository Layer           │
│       Database Operations           │
├─────────────────────────────────────┤
│          Infrastructure             │
│ PostgreSQL / Redis / RabbitMQ/etc.  │
└─────────────────────────────────────┘
```
**The important rule: Routes should not contain business logic.**
The actual logic belongs in the Service layer.

## 2.5 API Layer
**The API layer is responsible for:** Receiving HTTP requests, Validating input, Authentication, Authorization, Calling services, Returning responses, HTTP status codes.
**It should not:** directly manipulate database models, contain complex business logic, send emails, implement caching logic, execute background jobs directly.

## 2.6 Service Layer
The service layer contains business logic. This layer should be independent of FastAPI wherever practical.
(e.g., `TaskService.create_task()`, `update_task()`, `delete_task()`)

## 2.7 Repository Layer
Repositories handle database operations. The service doesn't need to know the SQL query.
`TaskService` → `TaskRepository` → `SQLAlchemy` → `PostgreSQL`

## 2.8 Domain Models
Domain models represent business entities (User, Organization, Team, Project, Task, Sprint, etc.). SQLAlchemy models will represent database entities. Business rules should be kept separate from database-specific implementation whenever possible.

## 2.9 Schemas
Pydantic schemas define API contracts. Never expose database models directly through the API.

## 2.10 Dependency Injection
FastAPI dependency injection will be used extensively. This makes testing easier.
`Request` → `get_current_user()` → `get_db()` → `get_task_service()` → `TaskService`

## 2.11 Domain-Based Organization
Modules should also be organized around business domains to prevent the application from eventually becoming one giant `services.py` or `routes.py`.
```text
app/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── organizations/
│   ├── teams/
│   ├── projects/
│   ├── tasks/
│   ├── sprints/
│   ├── comments/
│   ├── attachments/
│   ├── notifications/
│   ├── search/
│   ├── analytics/
│   └── audit/
```

## 2.12 Multi-Tenant Architecture
A user can belong to multiple organizations. Most organization-owned data should contain `organization_id` to allow tenant isolation.

## 2.13 Tenant Isolation Rule
Every organization-scoped request should establish: `Current User` → `Current Organization` → `Permission` → `Resource`.
Never rely only on the frontend to enforce this.

## 2.14 Authentication Architecture
Authentication flow: Login → Validate credentials → Generate Access Token → Generate Refresh Token → Client stores tokens securely → Access Token → API → Expired? → Refresh Token → New Access Token.

## 2.15 Authorization Architecture
Authentication answers: *Who are you?*
Authorization answers: *What are you allowed to do?*
`User` → `Organization Membership` → `Role` → `Permission` → `Resource`

## 2.16 Caching Architecture
Redis will be used for frequently accessed data.
If cache miss: FastAPI → Redis (MISS) → PostgreSQL → Store in Redis → Return.

## 2.17 Background Processing
Operations that shouldn't block an API request will use RabbitMQ and Celery (e.g., Emails, Notifications, Report generation).

## 2.18 Real-Time Architecture
WebSockets will handle: Task updates, Notifications, Comments, Presence, Activity feeds.

## 2.19 Event-Driven Components
Atlas will use events for loosely coupled operations (e.g., `TaskCreated`, `TaskAssigned`).
`TaskAssigned` → `Activity Service`, `Notification Service`, `Analytics Service`.

## 2.20 API Versioning
All APIs should start with: `/api/v1/`

## 2.21 Error Handling
The application should use standardized errors. Never expose stack traces or sensitive internal information to clients.

## 2.22 Request Correlation
Every request should receive a unique request ID to trace a problem across services.

## 2.23 Observability
Health endpoints (`/health`, `/health/live`, `/health/ready`). Prometheus collects metrics, Grafana visualizes them.

## 2.24 Scalability
The FastAPI application should remain stateless. Any API instance can handle any request.

## 2.25 Database Connection Management
Use SQLAlchemy connection pooling. Never create a completely new database connection for every request.

## 2.26 Transaction Management
Operations involving multiple database changes should use transactions. If something fails: ROLLBACK.

## 2.27 Concurrency
Atlas must account for multiple users modifying the same resource using optimistic locking, database transactions, unique constraints, or row-level locking where required.

## 2.28 API Performance
Consider: Pagination, Filtering, Sorting, Selective loading, Database indexes.

## 2.29 Architecture Principles
1. No business logic in routes.
2. No direct database access from routes.
3. Validate all external input.
4. Never trust organization IDs supplied by clients without authorization checks.
5. Cache only data where it provides measurable benefit.
6. Use asynchronous processing for slow non-critical operations.
7. Keep API servers stateless.
8. Every important action should be auditable.
9. Every important module must have tests.
10. Do not introduce microservices prematurely.

## 2.30 Modular Monolith vs Microservices
Atlas starts as a modular monolith, while maintaining boundaries that allow future extraction of services if required.

## 2.31 Final Architecture
```text
                       ┌───────────────┐
                       │    Client     │
                       └───────┬───────┘
                               │
                              HTTPS
                               │
                       ┌───────▼───────┐
                       │     Nginx     │
                       └───────┬───────┘
                               │
                    ┌──────────▼──────────┐
                    │      FastAPI        │
                    │   Modular Monolith  │
                    └──────────┬──────────┘
                               │
        ┌──────────────┬───────┼────────┬─────────────┐
        │              │       │        │             │
        ▼              ▼       ▼        ▼             ▼
   PostgreSQL        Redis  RabbitMQ  WebSocket    External APIs
        │                      │
        │                      ▼
        │                  Celery
        │                      │
        │            ┌─────────┼─────────┐
        │            ▼         ▼         ▼
        │          Email   Notifications Reports
        │
        ▼
    Persistent
       Data

              ┌──────────────────────┐
              │ Prometheus + Grafana │
              └──────────────────────┘
```

## 2.32 Definition of Done — Chapter 2
- Modular monolith architecture
- Clean Architecture principles
- API → Service → Repository separation
- PostgreSQL persistence
- Redis integration boundary
- RabbitMQ/Celery integration boundary
- WebSocket architecture
- Multi-tenant architecture
- API versioning
- Centralized error handling
- Request correlation IDs
- Health checks
- Observability design
- Horizontal scalability
- Transaction strategy
- Concurrency strategy
- Testing boundaries
- Security boundaries

---

## Next Chapter
Chapter 3 — Database Design (PostgreSQL schema, ER diagram, tables for all modules).
