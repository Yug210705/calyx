import os
import textwrap

BASE_DIR = os.path.abspath("backend/app")

def write_file(path, content):
    full_path = os.path.join(BASE_DIR, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(textwrap.dedent(content).strip() + "\n")

# 1. Projects Router
write_file("modules/projects/router.py", """
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.base_models import Project, User
from app.core.deps import get_current_user

router = APIRouter(prefix="/projects", tags=["projects"])

@router.get("/")
async def get_projects(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Project).where(Project.organization_id == current_user.organization_id))
    return result.scalars().all()

@router.post("/")
async def create_project(data: dict, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = Project(
        title=data.get("title", "Untitled Project"),
        description=data.get("description", ""),
        status=data.get("status", "Planning"),
        organization_id=current_user.organization_id
    )
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project
""")

# 2. Tasks Router
write_file("modules/tasks/router.py", """
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.base_models import Task, Project, User
from app.core.deps import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/")
async def get_tasks(project_id: int = None, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Simple tenant verification
    query = select(Task).join(Project).where(Project.organization_id == current_user.organization_id)
    if project_id:
        query = query.where(Task.project_id == project_id)
    result = await db.execute(query)
    return result.scalars().all()

@router.post("/")
async def create_task(data: dict, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verify project belongs to organization
    proj_res = await db.execute(select(Project).where(Project.id == data["project_id"], Project.organization_id == current_user.organization_id))
    if not proj_res.scalars().first():
        return {"error": "Project not found"}
        
    task = Task(
        title=data["title"],
        description=data.get("description", ""),
        status=data.get("status", "Todo"),
        project_id=data["project_id"],
        assignee_id=data.get("assignee_id")
    )
    db.add(task)
    await db.commit()
    await db.refresh(task)
    return task
""")

# 3. Teams Router
write_file("modules/teams/router.py", """
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.base_models import Team, User
from app.core.deps import get_current_user

router = APIRouter(prefix="/teams", tags=["teams"])

@router.get("/")
async def get_teams(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(Team).where(Team.organization_id == current_user.organization_id))
    return result.scalars().all()

@router.post("/")
async def create_team(data: dict, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    team = Team(
        name=data["name"],
        organization_id=current_user.organization_id
    )
    db.add(team)
    await db.commit()
    await db.refresh(team)
    return team
""")

# 4. Users Router
write_file("modules/users/router.py", """
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def get_users(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(User).where(User.organization_id == current_user.organization_id))
    return result.scalars().all()

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "name": current_user.name, "avatar": current_user.avatar}
""")

# 5. Update main.py
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
# from app.modules.activities.router import router as activities_router

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
""")

print("Successfully generated phase 5 backend scaffold.")
