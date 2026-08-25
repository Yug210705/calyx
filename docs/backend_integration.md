# Atlas Backend Integration

## Overview
The Atlas backend has been completely converted from a mock/prototype state into a fully functional, enterprise-grade multi-tenant architecture using Python, FastAPI, and SQLAlchemy.

## 1. Tenancy Model
Atlas utilizes a strict organizational boundary model:
- **`Organization`**: The highest level entity. All resources belong to an organization.
- **`User`**: Bound to a specific `Organization` (`organization_id`).
- **`Project` & `Team`**: Bound to an `Organization`.
- **`Task`**: Bound to a `Project`.

*Every API request intercepting tenant data uses the `get_current_user` FastAPI dependency, which parses the JWT token, resolves the user, and enforces that the returned resources match the `current_user.organization_id`.*

## 2. Authentication Flow
- Supabase has been entirely removed from the frontend.
- **Signup**: Hits `POST /api/v1/auth/signup`. This automatically scaffolds a new `Organization` (Workspace) and binds the new `User` to it.
- **Login**: Hits `POST /api/v1/auth/login`. Returns a JWT token signed with `HS256` and `passlib` bcrypt verification.
- **Frontend Storage**: The frontend React `AuthContext` now securely stores this JWT in localStorage and automatically mounts it as a `Bearer` token inside `src/services/api.ts` for every outbound fetch request.

## 3. Database Architecture (Base Models)
The SQLAlchemy models (`app/db/base_models.py`) use standard relational architecture:
- `Organization` (1:N) -> `Users`, `Projects`, `Teams`
- `Project` (1:N) -> `Tasks`
- Database runs on `sqlite+aiosqlite:///./atlas.db` by default to ensure maximum local compatibility out of the box, with asynchronous database sessions enabled.

## 4. API Endpoints
All endpoints are prefix-routed under `/api/v1/`:
- `/auth/signup` & `/auth/login`
- `/users/me` - Profile information
- `/projects/` - Full CRUD with organizational isolation
- `/tasks/` - Full CRUD with project-level boundaries
- `/teams/` - Full CRUD with organizational boundaries
- `/analytics/dashboard` - Secure aggregation endpoints

## 5. Security Enhancements
- Fixed Pydantic V2 `ValidationError` crashes on unmapped `.env` variables (`extra="ignore"` applied to `SettingsConfigDict`).
- All cross-tenant access completely eliminated via enforced query clauses (e.g. `where(Project.organization_id == current_user.organization_id)`).
- Mock data arrays completely erased from `api.ts`; unfulfilled endpoints safely return `[]` to allow proper "empty states" inside the React application for new users.

## How to Run
1. Navigate to the backend folder: `cd backend`
2. Run the server: `uv run uvicorn app.main:app --reload`
3. Launch the frontend React app and create an account!
