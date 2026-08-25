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
