import os
import textwrap

BASE_DIR = os.path.abspath("backend/app")

def write_file(path, content):
    full_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(content).strip() + "\n")

# 1. Activities Router
write_file("modules/activities/router.py", """
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/activities", tags=["activities"])

@router.get("/")
async def get_activities(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Returns empty for now, would query Activity model scoped to org
    return []

@router.post("/")
async def create_activity(data: dict, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    return {"status": "success"}
""")

# 2. Analytics Router
write_file("modules/analytics/router.py", """
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
async def get_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # In a real app, query count() on projects, tasks, etc.
    return {
        "metrics": {
            "total_projects": 0,
            "total_tasks": 0,
            "completed_tasks": 0,
            "team_members": 1
        },
        "trends": {
            "projects": "+0%",
            "tasks": "+0%"
        }
    }
""")

# 3. Invites Router
write_file("modules/invites/router.py", """
from fastapi import APIRouter, Depends
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/invites", tags=["invites"])

@router.get("/")
async def get_invites(current_user: User = Depends(get_current_user)):
    return []
""")

# 4. Roles Router
write_file("modules/roles/router.py", """
from fastapi import APIRouter, Depends
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/roles", tags=["roles"])

@router.get("/")
async def get_roles(current_user: User = Depends(get_current_user)):
    return [
        {"id": 1, "name": "Admin", "permissions": ["all"]},
        {"id": 2, "name": "Member", "permissions": ["read", "write"]}
    ]
""")

# 5. Update main.py to include everything
write_file("main.py", """
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import AtlasException, atlas_exception_handler
from app.db.session import engine
from app.db.base_models import Base

# Routers
from app.modules.auth.router import router as auth_router
from app.modules.users.router import router as users_router
from app.modules.projects.router import router as projects_router
from app.modules.tasks.router import router as tasks_router
from app.modules.teams.router import router as teams_router
from app.modules.activities.router import router as activities_router
from app.modules.analytics.router import router as analytics_router
from app.modules.invites.router import router as invites_router
from app.modules.roles.router import router as roles_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(AtlasException, atlas_exception_handler)

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/health")
def health_check():
    return {"status": "ok"}

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(tasks_router, prefix=settings.API_V1_STR)
app.include_router(teams_router, prefix=settings.API_V1_STR)
app.include_router(activities_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(invites_router, prefix=settings.API_V1_STR)
app.include_router(roles_router, prefix=settings.API_V1_STR)
""")

print("Successfully generated phase 6 backend scaffold.")
