# Project Atlas - Chapter 8: Task Management, Kanban & Sprint System

## 8.1 Core Design
The system supports Tasks, Subtasks, Assignments, Priorities, Statuses, Kanban boards, Custom workflows, Sprint planning, Dependencies, Labels, and Analytics.
Tasks belong to a project and optionally to a sprint (for backlog vs active execution).

## 8.2 & 8.3 Task Model & Task ID
- `tasks` table: `id`, `project_id`, `sprint_id`, `parent_id`, `task_number`, etc.
- Task ID combines Project Key + Task Number (e.g., `ATL-1`).
- `task_number` is generated safely using a `project_counters` table with a row lock to prevent duplicates.

## 8.4 & 8.5 Task Types & Priorities
- **Types**: TASK, BUG, FEATURE, STORY, EPIC, SPIKE.
- **Priority**: LOW, MEDIUM, HIGH, URGENT. (Index this for fast filtering).

## 8.6 - 8.9 Task Status & Custom Workflows
- `task_statuses` table supports custom statuses for projects.
- Statuses map to generic categories: TODO, IN_PROGRESS, DONE, CANCELLED.
- Each status has a `position` that drives the Kanban board order.

## 8.10 - 8.14 Task Creation & Assignment
- Flow: JWT Auth → Project Access → Assignee Validation → Generate Number → Create Task → Activity/RabbitMQ Events.
- Assignment: Tasks have `creator`, `reporter`, and `assignee`. `assignee` can be null for backlog planning.

## 8.15 - 8.20 Subtasks & Dependencies
- **Subtasks**: Use `parent_id` (kept to 1 level deep). Cycles prevented.
- **Dependencies**: `task_dependencies` table handles BLOCKS, BLOCKED_BY, RELATES_TO. Cycle detection (DFS/topological) required before creation.

## 8.21 Task Labels
`task_labels` junction table linking `tasks` to `project_labels`.

## 8.22 & 8.23 Kanban Board Ordering (Task Position)
- `position` drives board order.
- Fractional ordering (e.g., moving between 1000 and 2000 assigns 1500) to avoid updating all rows. LexoRank can be considered later.

## 8.24 - 8.29 Kanban Board & Transitions
- `GET /api/v1/projects/{project_id}/board` returns columns based on statuses.
- `workflow_transitions` defines valid status changes to prevent illegal moves (e.g., jumping from TODO straight to DONE if prohibited).

## 8.30 - 8.39 Sprint System
- **Sprints**: Time-boxed cycles (PLANNED, ACTIVE, COMPLETED, CANCELLED).
- Only one active sprint per project.
- **Sprint Completion**: Moves incomplete tasks back to backlog or next sprint.
- Tasks are added to a sprint by patching `sprint_id`.

## 8.40 - 8.43 Sprint Analytics
- **Velocity**: Sum of completed story points in a sprint.
- **Burndown**: Remaining points plotted daily.
- Aggregate endpoints for total/completed/remaining tasks and completion percentage.

## 8.44 - 8.47 Search, Filtering & Bulk Operations
- Filtering by status, assignee, priority, sprint, due_date, etc.
- Search tasks using ILIKE or Full Text Search.
- Bulk operations: update status, assignment, or sprint for multiple tasks in a single transaction.

## 8.49 & 8.50 Due Dates & Estimates
- `start_date` and `due_date`.
- `estimate_points` (Story Points) and `estimated_hours`.

## 8.52 & 8.53 Task Activity & History
- `task_history` tracks changes (`field`, `old_value`, `new_value`) to answer Who/What/When.
- Action events generated (TASK_STATUS_CHANGED, TASK_MOVED, etc.).

## 8.54 - 8.56 API Structure
Comprehensive REST endpoints for Tasks, Assignments, Status, Position, Sprint, Subtasks, Dependencies, and Workflows.

## 8.58 - 8.63 Database & SQLAlchemy
- **Indexes**: heavily used on `project_id`, `status_id`, `sprint_id`, `assignee_id`. Composite index `(project_id, status_id, position)` for Kanban querying.
- **Service vs Model**: Keep business logic in the Service layer (e.g., `TaskService.transition_task()`), not the Model or Router. Repository handles persistence.

## 8.66 - 8.69 Multi-Tenant Security & Concurrency
- **IDOR Protection**: Every task lookup must verify Project visibility and Organization membership.
- **Concurrency**: Use Optimistic Locking (`version` column on Task) to prevent silent overwrites when multiple users move/edit the same task.

## 8.70 - 8.72 Caching & Messaging
- **Redis**: Cache board and analytics (short TTL, invalidate on update).
- **RabbitMQ**: Publish events for notification/activity processing.
- **WebSockets**: Real-time board updates (`task.updated` event).

## 8.77 Kanban Board Query Optimization
Avoid N+1 queries. Retrieve tasks efficiently using `selectinload` or application-level grouping, keeping DB calls to 1-3 queries.

## 8.83 & 8.84 Implementation & Definition of Done
Phased implementation from Task Foundation → Workflow → Kanban → Subtasks/Dependencies → Sprints → Analytics → Infrastructure → Testing.
End-to-End flow proves out RBAC, transactional workflows, and real-time capable systems.
