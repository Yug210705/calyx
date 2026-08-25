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
