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
