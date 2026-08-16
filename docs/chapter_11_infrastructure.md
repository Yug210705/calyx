# Project Atlas - Chapter 11: Redis, RabbitMQ & Celery Architecture

## 11.1 Objective
Implement distributed background-processing infrastructure to ensure the FastAPI layer remains highly responsive while offloading heavy tasks to asynchronous workers.

## 11.2 - 11.13 Redis Architecture
- **Purpose**: Caching, rate limiting, temporary state, Pub/Sub, presence, distributed locks.
- **Naming Convention**: Use colon-separated schemas (`atlas:prod:project:123:details`).
- **Cache-Aside Pattern**: Check Redis first; if miss, query PostgreSQL, set Redis with TTL, return data.
- **Resiliency**: Never trust Redis as the single source of truth. If it crashes, fall back to PostgreSQL cleanly.

## 11.14 - 11.19 RabbitMQ Architecture
- **Purpose**: Reliable message broker (Producer → Exchange → Queue → Consumer).
- **Topic Routing**: Route events using domain patterns (e.g., `task.*` to `atlas.events` exchange).
- **Queue Isolation**: Separate queues for notifications, emails, analytics, etc., so slow jobs in one queue don't block others.

## 11.20 - 11.28 Celery Architecture
- **Purpose**: Distributed background workers picking jobs from RabbitMQ.
- **Rule**: Never call slow external services synchronously in FastAPI. Always use `task.delay()`.
- **Retries**: Use exponential backoff for external API failures.
- **Dead Letter Queue (DLQ)**: If a job fails maximum retries, move it to DLQ for manual inspection to prevent blocking the main queue.

## 11.29 - 11.35 Transactional Outbox Pattern
- **Problem**: Dual-write failures (DB commits but RabbitMQ fails, or vice-versa).
- **Solution**: Save the event to `outbox_events` within the same PostgreSQL transaction as the business change.
- **Publisher**: A separate worker periodically picks `PENDING` outbox events, pushes to RabbitMQ, and marks them `PUBLISHED`.
- **Idempotency**: Consumers must check `processed_events` table before acting to prevent duplicate executions (e.g., sending 2 emails for the same event).
- **Result**: At-least-once delivery + Idempotent consumers = Effectively-once business effect.

## 11.36 - 11.43 Distributed Locks, Rate Limiting & Scheduled Jobs
- **Locks**: Use Redis distributed locks to prevent multiple workers from generating the same heavy report simultaneously.
- **Rate Limiting**: Sliding window limits stored in Redis.
- **Celery Beat**: Scheduled cron-like jobs (detect overdue tasks every 5m, cleanup every 15m, digest emails daily).

## 11.48 - 11.53 Failure Scenarios
- **RabbitMQ Crash**: Events stack up in PostgreSQL `outbox_events` as `PENDING`. When RabbitMQ recovers, the publisher resumes. No events lost.
- **Redis Crash**: App bypasses cache and queries DB directly.
- **Celery Worker Crash**: RabbitMQ retains unacknowledged messages. Another healthy worker picks it up. Acknowledgement should only happen *after* successful processing.

## 11.54 Folder Structure
- `app/messaging/` (RabbitMQ logic, queues, routing)
- `app/worker/` (Celery app, tasks, beat schedules)
- `app/cache/` (Redis caching policies)
- `app/events/` (Publisher, consumer, registry, outbox)

## 11.58 Definition of Done — Chapter 11
- Setup Redis connection, cache policies, TTLs.
- Setup RabbitMQ exchanges, queues, DLQ.
- Implement Celery workers and Beat schedules.
- Establish the Transactional Outbox.
- Implement Idempotent consumers.
- Ensure graceful degradation upon infrastructure failure.
