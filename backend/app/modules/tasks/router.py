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
