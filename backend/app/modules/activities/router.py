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
