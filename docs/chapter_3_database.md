# Project Atlas - Chapter 3: Database Design

## 3.1 Database Strategy
Atlas will use PostgreSQL 16+ as its primary relational database.
- Normalized relational schema
- UUID primary keys
- Foreign-key constraints
- Unique constraints
- Appropriate indexes
- created_at / updated_at timestamps
- Soft deletion where required
- Transactional integrity
- Multi-tenant data isolation
- Auditability
- PostgreSQL-native features where useful

Redis stores temporary/cache data, while RabbitMQ handles asynchronous messages.

## 3.2 Entity Overview
The initial schema will contain approximately 35–45 core tables divided into domains:
**IDENTITY**: users, user_sessions, oauth_accounts, user_preferences
**ORGANIZATION**: organizations, organization_members, organization_invitations, roles, permissions, role_permissions
**TEAM**: teams, team_members
**PROJECT**: projects, project_members, project_labels, milestones, project_templates
**TASK**: tasks, task_assignees, task_labels, task_dependencies, task_checklists, task_checklist_items
**BOARD**: boards, board_columns
**SPRINT**: sprints, sprint_tasks
**COLLABORATION**: comments, comment_mentions, comment_reactions, attachments, activity_events
**NOTIFICATION**: notifications, notification_preferences
**AUDIT**: audit_logs
**ANALYTICS**: project_metrics, sprint_metrics, team_metrics

## 3.3 Primary Key Strategy
Every major entity uses a UUID to make IDs difficult to guess, safer for public APIs, and easier to generate across distributed systems.

## 3.4 Common Base Fields
Most entities should contain: `id`, `created_at`, `updated_at`.
Entities supporting soft deletion may additionally have: `deleted_at`.

## 3.5 Users
Stores global identity (`users`). Constraints: `email UNIQUE`.

## 3.6 User Sessions
Stores refresh-token/session information (`user_sessions`). Never store raw refresh tokens; store a secure hash.

## 3.7 OAuth Accounts
Supports Google and future OAuth providers (`oauth_accounts`). Unique: `(provider, provider_user_id)`.

## 3.8 User Preferences
`user_preferences` table with unique `user_id`.

## 3.9 Organizations
Primary tenant (`organizations`). Unique `slug`.

## 3.10 Organization Members
A user can belong to multiple organizations (`organization_members`). Unique: `(organization_id, user_id)`. Important for multi-tenancy.

## 3.11 Organization Invitations
`organization_invitations` to invite users to an org.

## 3.12 Roles
`roles` for RBAC (e.g., OWNER, ADMIN, PROJECT_MANAGER, DEVELOPER, VIEWER).

## 3.13 Permissions
`permissions` (e.g., `project:read`, `task:create`).

## 3.14 Role Permissions
Many-to-many relationship (`role_permissions`). PK: `(role_id, permission_id)`.

## 3.15 Teams
`teams` within an organization.

## 3.16 Team Members
`team_members`. PK: `(team_id, user_id)`.

## 3.17 Projects
`projects`. Attributes: `name`, `key`, `description`, `status`, `visibility`, `owner_id`, `created_by`, `start_date`, `target_date`, timestamps.
Example Key: ATLAS (task keys like ATLAS-101).

## 3.18 Project Members
`project_members`. PK: `(project_id, user_id)`.

## 3.19 Project Labels
`project_labels`. Unique: `(project_id, name)`.

## 3.20 Milestones
`milestones`. Links to a project.

## 3.21 Project Templates
`project_templates` storing reusable configuration as `JSONB`.

## 3.22 Tasks
One of the most important tables (`tasks`).
Supports parent-child hierarchy via `parent_task_id`.
Tracks `title`, `description`, `status`, `priority`, `task_type`, `position`, dates, `estimated_minutes`, `actual_minutes`, `version` (for optimistic locking).

## 3.23 Task Assignees
Support multiple assignees (`task_assignees`). PK: `(task_id, user_id)`.

## 3.24 Task Labels
Many-to-many relationship (`task_labels`). PK: `(task_id, label_id)`.

## 3.25 Task Dependencies
Supports Task A blocks Task B (`task_dependencies`). `dependency_type` like BLOCKS, BLOCKED_BY, RELATES_TO.

## 3.26 Task Checklists
`task_checklists` and `task_checklist_items`.

## 3.27 Boards
`boards` linked to projects.

## 3.28 Board Columns
`board_columns` for Kanban (e.g., BACKLOG, TODO, IN_PROGRESS, CODE_REVIEW, DONE). Includes `wip_limit`.

## 3.29 Sprints
`sprints` (PLANNED, ACTIVE, COMPLETED, CANCELLED).

## 3.30 Sprint Tasks
`sprint_tasks`. PK: `(sprint_id, task_id)`.

## 3.31 Comments
Threaded comments via `parent_comment_id` in the `comments` table.

## 3.32 Comment Mentions
`comment_mentions` to trigger notifications.

## 3.33 Comment Reactions
`comment_reactions`. Unique: `(comment_id, user_id, reaction)`.

## 3.34 Attachments
Metadata only in PostgreSQL (`attachments`). File in S3/MinIO.

## 3.35 Activity Events
Tracks user-visible project activity (`activity_events`) using `JSONB` for `metadata`.

## 3.36 Notifications
`notifications` table with `is_read` flag.

## 3.37 Notification Preferences
`notification_preferences` for in-app and email toggles.

## 3.38 Audit Logs
Append-only `audit_logs` tracking sensitive changes (e.g., role changes), including `old_values` and `new_values`.

## 3.39 Analytics Tables
Aggregated tables (`project_metrics`, `sprint_metrics`, `team_metrics`) to prevent expensive real-time calculation.

## 3.40 Relationships
Graph showing interactions from User to Organization, Projects, Tasks, Comments, etc.

## 3.41 Core ER Diagram
```text
┌──────────────┐
│    USERS     │
└──────┬───────┘
       │
       │
       ▼
┌──────────────────────┐
│ ORGANIZATION_MEMBERS │
└──────────┬───────────┘
           │
           ▼
┌────────────────┐
│ ORGANIZATIONS  │
└───────┬────────┘
        │
        ├──────────────────┐
        ▼                  ▼
┌───────────────┐    ┌───────────────┐
│    TEAMS      │    │   PROJECTS    │
└───────┬───────┘    └───────┬───────┘
        │                     │
        │                     ├─────────────┐
        │                     │             │
        │                     ▼             ▼
        │                  SPRINTS        BOARDS
        │                     │             │
        │                     ▼             ▼
        │                 SPRINT_TASKS  BOARD_COLUMNS
        │                     │
        │                     ▼
        │                  ┌───────┐
        └─────────────────►│ TASKS │
                           └───┬───┘
                               │
              ┌────────────────┼─────────────────┐
              ▼                ▼                 ▼
          COMMENTS         ATTACHMENTS       CHECKLISTS
              │
       ┌──────┴──────┐
       ▼             ▼
   MENTIONS       REACTIONS
```

## 3.42 Important Foreign Keys
Every foreign key should have an intentional deletion strategy.

## 3.43 Delete Strategy
Don't blindly use CASCADE. Soft deletes/archive policies for important historical records. Soft cascades for tenant data where appropriate.

## 3.44 Indexing Strategy
Important indexes based on query patterns (e.g., `users(email)`, `tasks(project_id)`, `task_assignees(user_id, task_id)`).

## 3.45 Composite Indexes
Indexes on multiple columns like `(project_id, status)` or `(user_id, is_read, created_at)`.

## 3.46 Unique Constraints
Database-level guarantees preventing duplicates, such as `organizations(slug)` or `team_members(team_id, user_id)`.

## 3.47 Enumerations
Controlled values for Task status, Priority, Project status, Sprint status.

## 3.48 Optimistic Locking
`version` column in `tasks` to prevent silent overwrites.

## 3.49 Soft Delete
Use `deleted_at` instead of immediate deletion for critical entities. Normal queries should exclude soft-deleted records.

## 3.50 Timestamps
Store consistently in UTC.

## 3.51 Migration Strategy
Alembic manages schema changes. Never manually modify production database schemas without a migration.

## 3.52 SQLAlchemy Model Strategy
Use SQLAlchemy 2.0 typed mappings. Models should map cleanly to tables.

## 3.53 Database Transactions
Multiple database changes should use transactions with ROLLBACK on failure.

## 3.54 Database Security
Parameterized SQL, least-privilege credentials, hide sensitive fields, restrict network access.

## 3.55 Database Backup Strategy
Daily full backup + Point-in-time recovery + Backup retention + Restore testing.

## 3.56 Database Performance Rules
Avoid N+1 queries. Use eager loading, pagination.

## 3.57 Search Data
PostgreSQL full-text search initially, potentially OpenSearch/Elasticsearch later.

## 3.58 Redis vs PostgreSQL
Redis for temporary/fast data (cache, limits, sessions, websockets, locks). PostgreSQL for permanent data.

## 3.59 RabbitMQ vs PostgreSQL
RabbitMQ for transient messages consumed by Celery workers, not as a permanent database.

## 3.60 Final Database Architecture
```text
                         PostgreSQL
                              │
       ┌──────────────────────┼───────────────────────┐
       │                      │                       │
       ▼                      ▼                       ▼
   Identity              Organization              Projects
       │                      │                       │
       │                      ├── Teams               ├── Boards
       │                      ├── Members             ├── Sprints
       │                      └── Roles               └── Tasks
       │                                               │
       │                              ┌────────────────┼───────────────┐
       │                              ▼                ▼               ▼
       │                          Comments        Attachments      Dependencies
       │
       ├── Sessions
       ├── OAuth
       └── Preferences

       ┌────────────────────────────────────────────────────┐
       │                    Cross-cutting                   │
       │                                                    │
       │ Notifications │ Activity Events │ Audit Logs       │
       │ Analytics     │ Metrics         │ Search Data      │
       └────────────────────────────────────────────────────┘
```

## 3.61 Definition of Done — Chapter 3
- PostgreSQL selected as primary database
- UUID primary keys
- Multi-tenant organization model
- User/session/OAuth model
- RBAC schema
- Organization/team schema
- Project schema
- Task/subtask schema
- Task dependency system
- Kanban board schema
- Sprint schema
- Comments and mentions
- Attachments metadata
- Notifications
- Activity events
- Audit logs
- Analytics aggregation tables
- Foreign-key relationships
- Unique constraints
- Indexing strategy
- Soft-delete strategy
- Optimistic locking strategy
- UTC timestamp strategy
- Alembic migration strategy
- Transaction strategy
- Backup strategy
