# Atlas Backend Implementation Plan

## Phase 1: Repository Audit

### Frontend Inspection
- **Tech Stack**: React + Vite + TypeScript.
- **Pages**: Activity, Analytics, AuditLogs, AuthPage, Backlog, Calendar, Dashboard, Documents, Files, Goals, Inbox, Integrations, Members, MyWork, Projects, Reports, Roadmap, Settings, Sprints, Tasks, Teams, VerifyEmail.
- **API Integration**: Currently using `src/services/api.ts` which falls back to hardcoded mock data in demo mode. The frontend heavily relies on this mock data.

### Backend Inspection
- **Tech Stack**: Python 3.13 + FastAPI + SQLAlchemy + SQLite (Atlas.db).
- **Structure**: `app/modules` with basic modules: `activities`, `invites`, `projects`, `roles`, `tasks`, `teams`, `users`.
- **Database**: Contains an `alembic` setup, but the schema is very minimal (e.g., `projects` model missing many enterprise fields).
- **Authentication**: Stubbed out. No real JWT flow, tenant isolation is missing (currently using a hardcoded `owner_id="demo"`).

### Missing Functionality
- Real authentication (JWT, Users).
- Multi-tenancy (Organizations).
- Goals, Sprints, Backlog, Calendar events, Roadmap tracking.
- Real Analytics & Reports.
- WebSocket for real-time updates.
- Celery for background jobs.
- Audit logs, Webhooks, Integrations.

---

## Phase 2: Gap Analysis Matrix

| Frontend Feature | Current Status | Required API | Database Entity | Backend Service | Background Job | WebSocket | Tests |
|------------------|----------------|--------------|-----------------|-----------------|----------------|-----------|-------|
| Authentication | Mocked | `/auth/login`, `/auth/signup` | `User` | Auth Service | No | No | Yes |
| Dashboard | Mocked | `/analytics/dashboard` | Aggregated | Analytics Service | Yes (Caching) | Yes | Yes |
| Projects | Basic API | `/projects/*` | `Project`, `ProjectMember` | Project Service | No | No | Yes |
| Tasks | Basic API | `/tasks/*` | `Task`, `Comment`, `Subtask` | Task Service | No | Yes | Yes |
| Teams | Basic API | `/teams/*` | `Team`, `TeamMember` | Team Service | No | No | Yes |
| My Work | Mocked | `/users/me/work` | Aggregated | User Service | No | No | Yes |
| Calendar | Mocked | `/calendar/events` | `Event` | Calendar Service | No | No | Yes |
| Roadmap | Mocked | `/roadmap/epics` | `Epic`, `Milestone` | Planning Service | No | No | Yes |
| Sprints & Backlog| Mocked | `/sprints/*`, `/backlog/*`| `Sprint`, `Task` | Sprint Service | No | No | Yes |
| Goals | Mocked | `/goals/*` | `Goal` | Goal Service | No | No | Yes |
| Documents | Mocked | `/documents/*` | `Document` | Document Service| No | Yes | Yes |
| Activity | Basic API | `/activities/*` | `Activity` | Activity Service| No | Yes | Yes |

*I will proceed with Phase 3 (Foundation) and Phase 4 (Identity and Tenancy).*
