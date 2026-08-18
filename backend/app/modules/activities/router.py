from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.modules.activities.models import Activity
from app.modules.activities.schemas import ActivityCreate, ActivityResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/activities", tags=["Activities"])

@router.post("/", response_model=ActivityResponse)
async def create_activity(activity: ActivityCreate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_activity = Activity(**activity.model_dump(), owner_id=current_user["sub"])
    db.add(db_activity)
    await db.commit()
    await db.refresh(db_activity)
    result = await db.execute(select(Activity).options(selectinload(Activity.user)).filter(Activity.id == db_activity.id))
    return result.scalars().first()

@router.get("/", response_model=List[ActivityResponse])
async def read_activities(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    result = await db.execute(
        select(Activity).options(selectinload(Activity.user)).filter(Activity.owner_id == current_user["sub"]).order_by(Activity.timestamp.desc()).offset(skip).limit(limit)
    )
    return result.scalars().all()
