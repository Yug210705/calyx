# Project Atlas - Chapter 12: Search, Analytics & Reporting

## 12.1 Objective
Turn Atlas into a data-rich platform supporting Global Search, advanced filtering, sprint/project analytics, team workloads, and async report generation (CSV/PDF).

## 12.2 - 12.12 Global Search & Full-Text Search
- **Architecture**: Start with PostgreSQL Full-Text Search (FTS) before introducing Elasticsearch.
- **Search Vector**: Use `to_tsvector` and `plainto_tsquery` instead of `ILIKE` for massive performance gains on text searches.
- **GIN Index**: Crucial for FTS performance (`CREATE INDEX idx_tasks_search ON tasks USING GIN(search_vector)`).
- **Ranking**: Use `ts_rank()` to order results by relevance.
- **Multi-Tenant Security**: Every search query must append `WHERE organization_id = :org_id`. Never search globally and filter later in application memory.

## 12.13 - 12.15 Advanced Filtering & Sorting
- **Filters**: Implement dynamic SQLAlchemy queries using a dedicated `TaskFilter` object (project, sprint, assignee, status, priority, due date).
- **Sorting**: Whitelist sort fields to prevent SQL injection (e.g., `sort=created_at`, `order=desc`).

## 12.16 - 12.21 Analytics Architecture
- **Problem**: Running expensive aggregates (`COUNT`, `GROUP BY`) on millions of rows for every dashboard request will crash the DB.
- **Solution**: Aggregate Tables (`project_metrics`, `sprint_metrics`).
- **Flow**: Task updated → RabbitMQ Event → Analytics Worker → Updates Aggregate Table. The Dashboard API simply reads the aggregate table.

## 12.22 - 12.36 Specific Analytics Metrics
- **Velocity**: Average completed story points across past sprints.
- **Burndown**: Daily snapshot tracking `remaining_points` vs `completed_points`.
- **Workload**: Track tasks and story points assigned per developer.
- **Cycle Time vs Lead Time**: Cycle time = Work started → Completed. Lead time = Created → Completed.
- **Timezones**: Store everything in UTC; convert on the frontend to avoid cross-team timezone bugs.

## 12.37 - 12.44 Reporting Module
- **Async Generation**: Reports (e.g., CSV exports of 1 million tasks) are processed asynchronously via Celery.
- **Chunking**: Use streaming/batched DB reads to prevent memory exhaustion when generating massive CSVs.
- **Storage**: Upload generated reports to Object Storage (S3/MinIO), storing only the `file_path` in DB. Provide short-lived signed URLs for download.

## 12.45 - 12.47 Caching & Materialized Views
- **Caching**: Dashboard responses cached in Redis with short TTLs (30-60s) or invalidated on specific RabbitMQ events.
- **Materialized Views**: Complex cross-table joins can be pre-computed in Postgres Materialized Views and refreshed via Celery Beat schedules.

## 12.48 - 12.52 Database Optimization
- **Indexing**: Add B-Tree indexes on commonly filtered columns (`status`, `assignee_id`, `due_date`). Don't over-index (storage/write costs).
- **EXPLAIN ANALYZE**: Profile slow queries to ensure Index Scans instead of Sequential Scans.
- **N+1 Problem**: Use `selectinload()` or `joinedload()` in SQLAlchemy to eager-load relationships (e.g., loading assignees for 100 tasks in 1 query instead of 101).

## 12.58 Security & Multi-Tenancy in Search
Search boundaries are non-negotiable. A user searching "payment" in Org 1 must never see a task named "Payment" belonging to Org 2, even if it's a perfect text match.

## 12.59 - 12.61 Testing & Observability
- **Tests**: Exact/partial search, ranking, pagination, IDOR prevention, async report creation.
- **Load Testing**: Test search latency on 10M tasks; test DB CPU under 100 concurrent dashboard requests.
- **Metrics**: Prometheus tracking `search_latency_seconds`, `report_generation_duration`, etc.

## 12.62 Definition of Done — Chapter 12
- FTS setup with GIN indexes and ranking.
- Advanced filtering and safe sorting logic.
- Aggregate tables for velocity, burndown, workload, cycle time.
- Async CSV reporting via Celery and S3.
- Query optimization (EXPLAIN, N+1 prevention).
- Comprehensive tests and metrics.
