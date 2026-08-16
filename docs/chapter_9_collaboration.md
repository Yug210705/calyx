# Project Atlas - Chapter 9: Comments, Mentions, Attachments & Collaboration

## 9.1 Collaboration Architecture
Tasks support Comments, Threaded replies, Mentions, Reactions, and Attachments. All collaboration events trigger activity and notifications.

## 9.2 - 9.11 Comment Model & Basics
- `comments` table (`id`, `task_id`, `author_id`, `parent_id`, `content`, `is_edited`).
- **Soft Delete**: `deleted_at` replaces immediate deletion to preserve auditability and thread context.
- **Pagination**: Use cursor pagination for highly active discussion threads to avoid offset issues.
- **Edit History**: Optional `comment_revisions` table for enterprise auditability.

## 9.12 - 9.14 Threaded Comments
Comments can reply to other comments via `parent_id`.
Validation rule: A reply must belong to the same task as its parent. Cross-task threading is forbidden.

## 9.15 - 9.19 Mention System
- `@mentions` parsed from comment content.
- Creates `comment_mentions` records mapping `comment_id` to `mentioned_user_id`.
- Mentioning someone outside the project/organization is forbidden and should fail validation.
- Triggers async RabbitMQ → Celery events for notifications.

## 9.20 - 9.23 Reactions
- `comment_reactions` (`comment_id`, `user_id`, `reaction`).
- Unique constraint: `(comment_id, user_id, reaction)`.
- Use a toggle API (`PUT /reactions/{reaction}`) for easier frontend integration.
- API returns aggregated counts (`👍: 12`) and the current user's reaction list.

## 9.24 - 9.36 Attachments
- **DO NOT** store binary data in PostgreSQL. Use Object Storage (S3/MinIO).
- `attachments` table stores metadata (`original_filename`, `storage_key`, `content_type`, `file_size`, `checksum`).
- **Upload Flow**: Frontend requests Presigned URL → Frontend uploads directly to S3 → Frontend confirms with API.
- **Download Flow**: Backend validates permissions and returns a short-lived Signed URL.
- **Security**: Validate MIME types, limit sizes, and implement a Celery AV scanning pipeline (Quarantine malicious files).
- **Deletion**: Soft delete in DB, queue background worker to remove the actual file.
- **Deduplication**: SHA-256 checksums to detect duplicate uploads.

## 9.37 - 9.42 Activity Events, Notifications & Permissions
- All collaboration actions (create, edit, delete, react, upload) emit events.
- **Permissions**: Granular controls (`comment.create`, `comment.update_own`, `attachment.read`).
- **Multi-Tenant Security (IDOR)**: Accessing a comment or attachment must validate the parent Task, Project, and Organization.

## 9.43 Rate Limiting
Prevent spam: e.g., 30 comments/min, 20 uploads/min per user.

## 9.44 - 9.47 Parsers & Text Security
- Simple regex for mentions: `@([a-zA-Z0-9_]+)`.
- **Rich Text**: Store as Markdown or structured JSON. If HTML is allowed, sanitize it heavily (XSS protection) on both frontend and backend.

## 9.48 - 9.52 APIs & Schemas
- Clear REST endpoints under `/tasks/{id}/comments` and `/comments/{id}/reactions`.
- Pydantic schemas enforce length validations.
- **N+1 Queries**: Avoid querying authors iteratively. Use `selectinload` or `JOIN`.

## 9.53 - 9.57 Transactions & Background Processing
- **Transactional Outbox Pattern**: Store the RabbitMQ event in an `outbox_events` table during the DB transaction, and use a separate worker to publish it. Ensures events are never lost if a transaction rolls back.
- **Celery Jobs**: AV scanning, thumbnail generation, email notifications, and daily cleanup of orphaned files.

## 9.58 - 9.61 Security & Testing
- Unit and Integration tests for editing/deleting own vs others' comments, parsing mentions, duplicate reactions, and file uploads.
- Explicitly test cross-organization (IDOR) blocks.
- End-to-end integration test (upload → comment → mention → reply → reaction → activity timeline).

## 9.62 - 9.65 Architecture & Definition of Done
- Domain modules for Comments, Mentions, Reactions, and Attachments.
- Outbox pattern for reliable RabbitMQ event publishing.
- Completion requires CRUD, Threads, Mentions, Presigned URL flows, AV integration, and robust tests.
