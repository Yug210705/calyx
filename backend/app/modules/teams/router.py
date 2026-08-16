from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.modules.teams.models import Team
from app.modules.teams.schemas import TeamCreate, TeamUpdate, TeamResponse

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.post("/", response_model=TeamResponse)
async def create_team(team: TeamCreate, db: AsyncSession = Depends(get_db)):
    db_team = Team(**team.model_dump())
    db.add(db_team)
    await db.commit()
    await db.refresh(db_team)
    
    # Defaults for new team
    setattr(db_team, "members_count", 0)
    setattr(db_team, "projects_count", 0)
    return db_team

@router.get("/", response_model=List[TeamResponse])
async def read_teams(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).options(selectinload(Team.lead), selectinload(Team.members)).offset(skip).limit(limit))
    teams = result.scalars().all()
    
    # Compute counts dynamically
    for team in teams:
        setattr(team, "members_count", len(team.members) if team.members else 0)
        setattr(team, "projects_count", 0) # Mocked for now
        
    return teams

@router.get("/{team_id}", response_model=TeamResponse)
async def read_team(team_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).options(selectinload(Team.lead), selectinload(Team.members)).filter(Team.id == team_id))
    team = result.scalars().first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
        
    setattr(team, "members_count", len(team.members) if team.members else 0)
    setattr(team, "projects_count", 0)
    return team

@router.put("/{team_id}", response_model=TeamResponse)
async def update_team(team_id: int, team_update: TeamUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).options(selectinload(Team.lead), selectinload(Team.members)).filter(Team.id == team_id))
    team = result.scalars().first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    
    update_data = team_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(team, key, value)
        
    await db.commit()
    await db.refresh(team)
    
    setattr(team, "members_count", len(team.members) if team.members else 0)
    setattr(team, "projects_count", 0)
    return team

@router.delete("/{team_id}")
async def delete_team(team_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).filter(Team.id == team_id))
    team = result.scalars().first()
    if team is None:
        raise HTTPException(status_code=404, detail="Team not found")
    await db.delete(team)
    await db.commit()
    return {"ok": True}

from pydantic import BaseModel
class MemberAdd(BaseModel):
    user_id: int

@router.post("/{team_id}/members", response_model=TeamResponse)
async def add_team_member(team_id: int, payload: MemberAdd, db: AsyncSession = Depends(get_db)):
    from app.modules.users.models import User
    
    result = await db.execute(select(Team).options(selectinload(Team.lead), selectinload(Team.members)).filter(Team.id == team_id))
    team = result.scalars().first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    user_result = await db.execute(select(User).filter(User.id == payload.user_id))
    user = user_result.scalars().first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user not in team.members:
        team.members.append(user)
        await db.commit()
        await db.refresh(team)
        
    setattr(team, "members_count", len(team.members) if team.members else 0)
    setattr(team, "projects_count", 0)
    return team

@router.delete("/{team_id}/members/{user_id}", response_model=TeamResponse)
async def remove_team_member(team_id: int, user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Team).options(selectinload(Team.lead), selectinload(Team.members)).filter(Team.id == team_id))
    team = result.scalars().first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
        
    team.members = [m for m in team.members if m.id != user_id]
    await db.commit()
    await db.refresh(team)
    
    setattr(team, "members_count", len(team.members) if team.members else 0)
    setattr(team, "projects_count", 0)
    return team
