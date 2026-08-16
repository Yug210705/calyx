# Project Atlas - Chapter 10: Notifications, WebSockets & Activity Timeline

## 10.1 Objective
Build a unified event-driven notification system supporting in-app notifications, real-time WebSockets, emails, activity timelines, and robust background processing via RabbitMQ and Celery.

## 10.2 - 10.9 Notification Model
- `notifications` table (`id`, `recipient_id`, `actor_id`, `type`, `entity_type`, `entity_id`, `is_read`).
- **Entity Agnostic**: Use `entity_type` (e.g., 'task', 'comment') and `entity_id` instead of specific foreign keys for extensibility.
- **Unread Count**: Calculated via COUNT query or Redis counter `notification_count:user_uuid`.
- **Pagination**: Cursor pagination required. Index on `(recipient_id, created_at DESC)`.

## 10.10 - 10.11 Preferences
- `notification_preferences` allow users to toggle `in_app`, `email`, or `push` per notification type (e.g., MENTION, TASK_ASSIGNED).

## 10.12 - 10.18 Event-Driven Architecture & Outbox
- **Flow**: API → PostgreSQL (Transaction + Outbox Event) → RabbitMQ → Workers (Notification, Email, Activity, WebSocket).
- **Transactional Outbox**: Guarantees event delivery even if RabbitMQ temporarily fails. Outbox Worker publishes pending events.
- **Retries & Dead Letter**: Retry failing events with exponential backoff. Move poison pills to a Dead Letter Queue.

## 10.19 - 10.28 WebSockets
- **Connection**: `WS /api/v1/ws` authenticated via token.
- **Connection Manager**: Maps `user_id` to a `set<WebSocket>` (supporting multiple tabs/devices per user).
- **Multi-Instance Support**: Redis Pub/Sub bridges WebSocket connections across multiple FastAPI instances.
- **Channels**: Broadcast events to logical scopes like `user:{id}`, `project:{id}` instead of global broadcasting.
- **Heartbeats (PING/PONG)**: Keep connections alive and detect silent drops.

## 10.29 - 10.35 Activity Timeline
- `activities` table (`organization_id`, `project_id`, `task_id`, `actor_id`, `action`, `metadata`).
- Human-readable timeline (Who did what when) vs Audit Log (Security focused).
- Paginated via cursor, indexed on `project_id, created_at DESC`.

## 10.36 - 10.38 Notification Rules & Grouping
- Don't notify the actor (e.g., if Yug assigns a task to Yug, no notification).
- Group similar notifications ("3 people commented on your task") using a `notification_group_key`.

## 10.39 - 10.44 Background Jobs & Idempotency
- **Celery**: Processes email sending (never block API).
- **Celery Beat**: Scheduled jobs (daily digests, hourly cleanup, overdue task detection).
- **Idempotency**: Workers must check `processed_events` table before acting to prevent duplicate processing if RabbitMQ delivers a message twice.

## 10.45 - 10.48 Service Structure & Dispatcher
- **Handler Registry**: A dispatcher maps event types (`TASK_ASSIGNED`, `MENTION`) to specific handler functions, keeping the code clean.

## 10.49 - 10.53 Security & Online Presence
- **WebSocket Auth**: Must verify organization/project access before subscribing to a channel.
- **Presence**: Redis key `user:{id}:presence` with a TTL, refreshed by WebSocket heartbeats.
- **Typing Indicators**: Routed via WebSocket/Redis without touching PostgreSQL.

## 10.58 - 10.60 Performance & Observability
- **Load Testing**: k6/Locust targeting 1000 WS connections, 10,000 events.
- **Metrics**: Prometheus scrapes (WS connections, RabbitMQ queue depth, API latency, Celery failures).
- **Grafana**: Dashboard visualizing system health.

## 10.61 - 10.62 Resiliency
- **Failure Isolation**: If email provider fails, the core API remains unaffected.
- **Graceful Shutdown**: Close WebSockets, finish in-flight requests, and drain Redis/DB pools cleanly on exit.

## 10.63 Definition of Done — Chapter 10
- Notifications CRUD, counts, and preferences.
- WebSockets with Redis Pub/Sub, heartbeats, and auth.
- Activity timeline with cursor pagination.
- Outbox pattern, RabbitMQ event dispatching, Idempotency.
- Celery email workers, scheduled tasks.
- Prometheus/Grafana observability.
