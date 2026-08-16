# Project Atlas - Chapter 6: Organization & Team Management

## 6.1 Organization Architecture
Atlas follows a multi-tenant architecture. All organization-owned data must be isolated.
A single user can belong to multiple organizations and have different roles in each.

## 6.2 Core Organization Concepts
Organizations, Members, Roles, Teams, Invitations, Departments, Settings, Organization-switching, and Multi-tenant isolation.

## 6.3 - 6.7 Organization & Membership Models
- **Organizations**: `id` (UUID), `slug` (unique), `owner_id`.
- **Memberships**: `organization_members` junction table to allow a user to join multiple orgs. Unique constraint on `(organization_id, user_id)`.

## 6.8 & 6.9 Organization Creation
Must happen inside a database transaction:
Create Organization → Create Membership → Assign Owner Role → Create Audit Log → Commit.
If anything fails, ROLLBACK.

## 6.10 - 6.15 Organization Lifecycle & APIs
- Endpoints for GET, PATCH, DELETE.
- Soft Delete for organizations instead of hard destruction.
- Lifecycle states: ACTIVE, SUSPENDED, DELETED (and potentially TRIAL, ARCHIVED).

## 6.17 - 6.22 Organization Context & Multi-Tenant Data Isolation
- A user selects their "Current Organization" in the UI.
- Backend resolves context: `JWT` → `User` → `Membership Lookup` → `Organization Context` via dependency (`get_current_organization`).
- **Never trust resource IDs implicitly.** Queries must include `organization_id` to guarantee tenant isolation (e.g., `WHERE id = :project_id AND organization_id = :org_id`).

## 6.23 - 6.25 Departments
`departments` table linked to `organization_id` for grouping (Engineering, HR, etc.).

## 6.26 - 6.34 Teams & Team Members
- `teams` belong to organizations (and optionally departments).
- `team_members` junction table maps users to teams with `team_role` (TEAM_LEAD, MEMBER, GUEST).
- Endpoints to create teams, add/remove members, list members (paginated).

## 6.35 - 6.43 Invitations
- `organization_invitations` table with hashed tokens.
- Flow: Store token hash → Celery sends email → User clicks link → Backend hashes token and verifies → Authenticates → Creates Membership.
- Invitations expire and can be revoked.
- Rate limits on sending/resending to prevent abuse.

## 6.44 - 6.49 Member Management & Privilege Escalation
- Role changes must be validated against the requester's permissions.
- Prevent privilege escalation (e.g., an ADMIN cannot blindly make someone an OWNER).
- Removed users immediately lose access because every request verifies the active membership status.

## 6.50 - 6.52 Team-Level Authorization
Team-level permissions dictate what actions a user can perform within a specific team's projects.

## 6.53 Audit Events
ORGANIZATION_CREATED, MEMBER_INVITED, MEMBER_REMOVED, TEAM_CREATED, OWNERSHIP_TRANSFERRED, etc., tracked for enterprise auditing.

## 6.54 - 6.58 Repository & Service Layers
- **Service Layer**: Handles business logic like transactions, generating slugs, queueing emails, and auditing.
- **Repository Layer**: Handles database operations.

## 6.62 - 6.64 Database Relationships & Constraints
- UNIQUE constraints on slugs and junction tables `(organization_id, user_id)`.
- Indexes on foreign keys to support fast queries as the platform scales to millions of users.

## 6.68 - 6.70 Celery & Redis
- **Celery**: Background jobs for invitation emails and audit archival.
- **Redis**: Caching context/permissions with short TTLs. Must be invalidated upon role changes or membership removal.

## 6.72 - 6.74 Common Security Vulnerabilities
- **IDOR**: Prevented by validating the resource's `organization_id` against the current user's membership.
- **Invitation Abuse**: Prevented by rate limits, throttling, and pending checks.
- **Privilege Escalation**: Prevented by strict role-hierarchy enforcement server-side.

## 6.75 - 6.77 Testing Strategy
- Unit and Integration tests for team/org creation and invitations.
- **Multi-Tenant Security Tests**: Explicitly testing that User A cannot access Organization B's resources, confirming the isolation boundaries.

## 6.78 Definition of Done — Chapter 6
- Organization, Department, and Team models & CRUD APIs.
- Invitations & Member management.
- Multi-tenant isolation verified.
- RBAC, Audit, Redis, Celery integration.
- Tests (Unit, Integration, Security).
