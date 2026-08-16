# Project Atlas - Chapter 7: Project Management Module

## 7.1 Project Module Responsibilities
The Project module will handle: Project creation, updates, deletion/archive, members, roles, settings, visibility, status, templates, milestones, labels, statistics, activity, project-level permissions, search, and pagination.

## 7.2 Project Architecture
Organization → Teams & Projects.
Projects → Project Members, Milestones, Labels, Settings, Tasks (Subtasks, Comments, Attachments).
A project must always belong to exactly one organization. Optionally, it can belong to a team.

## 7.3 Project Model
```sql
projects
------------------------------------------------
id                  UUID PK
organization_id     UUID FK
team_id             UUID FK NULL
owner_id            UUID FK
name                VARCHAR
slug                VARCHAR
description         TEXT NULL
key                 VARCHAR
status              VARCHAR
visibility          VARCHAR
priority            VARCHAR
start_date          DATE NULL
target_date         DATE NULL
logo_url            TEXT NULL
archived_at         TIMESTAMP NULL
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

## 7.4 - 7.7 Keys and Slugs
- **organization_id**: Tenant identifier.
- **owner_id**: User responsible for project.
- **key**: Short identifier (e.g., ATL). UNIQUE (organization_id, key). Used for tasks (ATL-1).
- **slug**: URL friendly (e.g., enterprise-backend-platform). UNIQUE (organization_id, slug).

## 7.8 - 7.10 Status, Visibility, Priority
- **Status**: PLANNING, ACTIVE, ON_HOLD, COMPLETED, ARCHIVED.
- **Visibility**: PRIVATE, TEAM, ORGANIZATION.
- **Priority**: LOW, MEDIUM, HIGH, CRITICAL.

## 7.11 - 7.14 Project Creation Flow
- **Endpoint**: `POST /api/v1/organizations/{organization_id}/projects`
- Flow runs in a **Transaction**: Validate Context → Generate Slug → Create Project → Create Owner Membership → Default Settings → Audit Event → Commit.
- **Project Owner**: The creator is typically the initial owner. Distinct from organization owner.

## 7.15 - 7.21 Project Members & Roles
- **Model**: `project_members` (id, project_id, user_id, role_id, joined_at). Unique: `(project_id, user_id)`.
- **Roles**: PROJECT_OWNER, PROJECT_ADMIN, PROJECT_MANAGER, CONTRIBUTOR, VIEWER.
- **Permissions**: Instead of hardcoding roles, use granular permissions (`project.read`, `project.task.create`).
- Members must belong to the organization. Owners cannot be removed without transferring ownership first.

## 7.22 - 7.24 Team Integration & Resource Isolation
- Projects can optionally belong to a team (`team_id`).
- **Resource Isolation**: Queries must always include `organization_id`. Authorization must verify: `JWT → User → Organization Membership → Project Visibility → Project Membership/Permission`.

## 7.25 - 7.30 Project APIs
- CRUD endpoints.
- **Pagination**: Limit result sizes (e.g., `?page=1&limit=25`).
- **Search & Filtering**: Search by name/key/description. Filter by status, priority, visibility, team.
- **Sorting**: Validate/whitelist sorting fields (e.g., `created_at`, `priority`). Never concatenate SQL directly.

## 7.31 - 7.32 Project Settings
- `project_settings` (default task status, priority, toggles for comments/attachments/notifications).

## 7.33 - 7.37 Milestones
- `milestones` linked to `project_id`. Statuses: PLANNED, ACTIVE, COMPLETED, CANCELLED.
- Track major objectives, dates, and eventually progress percentages.

## 7.38 - 7.40 Labels
- `project_labels` (name, description, color). Unique: `(project_id, name)`.

## 7.41 - 7.44 Project Templates
- `project_templates` store reusable configurations (labels, milestones, workflow) in JSONB.
- System templates (available globally) vs Organization templates (scoped by `organization_id`).

## 7.45 - 7.47 Archiving and Deletion
- **Archive**: Soft state change (`status = ARCHIVED`, sets `archived_at`). Read-only.
- **Restore**: Back to ACTIVE.
- **Hard Delete**: Restricted to PROJECT_OWNER or ORGANIZATION_OWNER. Recommended retention period before permanent delete.

## 7.48 - 7.50 Activity and Audit Events
- **Activity**: User-friendly timeline events (e.g., "Yug created project...").
- **Audit**: Security/compliance events.

## 7.51 - 7.52 Project Statistics & N+1 Queries
- Expose summary stats (tasks, completion %).
- Avoid N+1 queries by using `selectinload`, `JOIN`s, or dedicated aggregated tables.

## 7.53 - 7.63 Clean Architecture
- **Schemas**: Separate API schemas (`ProjectCreate`) from SQLAlchemy models.
- **Dependencies**: `get_current_project` handles org verification, visibility, and membership checks automatically.
- **Service Layer**: Handles transactions and business logic.
- **Repository**: Pure database queries without business permissions.

## 7.64 - 7.66 Messaging & Caching
- **RabbitMQ**: Publish domain events (PROJECT_CREATED) for async processing (analytics, email).
- **Redis**: Cache project details or member lists with short TTLs. Invalidate on updates.

## 7.68 - 7.72 Security & Testing
- **IDOR Protection**: Verify cross-organization access attempts return 403/404.
- **Member Security**: Validate `PRIVATE` project access restrictions.
- **Team/Org Visibility**: Test that visibility scopes correctly allow or deny access based on explicit membership vs inherited access.

## 7.74 - 7.78 Performance, Observability, APIs
- **Performance targets**: Lists < 150ms, Details < 150ms.
- **Observability**: Prometheus metrics (creation rate, errors, latency). Structured logging (no secrets).
- **API Errors**: Standard format (`{"error": {"code": "PROJECT_NOT_FOUND", "message": "..."}}`).
- **OpenAPI**: Fully documented via FastAPI `/docs`.

## 7.80 Recommended Implementation Order
Phase 1: Model, CRUD, Permissions. Phase 2: Members, Visibility. Phase 3: Settings, Milestones, Labels. Phase 4: Templates, Archive/Restore. Phase 5: Events, Cache. Phase 6: Testing, Performance.

## 7.81 Definition of Done — Chapter 7
- Project CRUD, keys, slugs, visibility, priority.
- Project members, roles, permissions, ownership.
- Milestones, Labels, Settings, Templates.
- Multi-tenant isolation, IDOR protection, structured logs, events, cache.
- Comprehensive Unit, Integration, Security testing.
