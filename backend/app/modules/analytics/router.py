from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/analytics", tags=["analytics"])

from sqlalchemy.future import select
from sqlalchemy import func
from app.db.base_models import Project, Task, User, Team

@router.get("/dashboard")
async def get_dashboard(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    org_id = current_user.organization_id

    # Total projects
    res_proj = await db.execute(select(func.count(Project.id)).where(Project.organization_id == org_id))
    total_projects = res_proj.scalar() or 0

    # Total tasks (tasks where project belongs to org)
    res_tasks = await db.execute(
        select(func.count(Task.id))
        .join(Project)
        .where(Project.organization_id == org_id)
    )
    total_tasks = res_tasks.scalar() or 0

    # Completed tasks
    res_comp = await db.execute(
        select(func.count(Task.id))
        .join(Project)
        .where(Project.organization_id == org_id, Task.status == "Done")
    )
    completed_tasks = res_comp.scalar() or 0

    # Team members
    res_mem = await db.execute(select(func.count(User.id)).where(User.organization_id == org_id))
    team_members = res_mem.scalar() or 0

    # Mock trends and charts for now, but real KPIs
    return {
        "metrics": {
            "total_projects": total_projects,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "team_members": team_members
        },
        "trends": {
            "projects": "+0%",
            "tasks": "+0%"
        }
    }
