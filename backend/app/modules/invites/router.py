from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.modules.invites.models import Invite
from app.modules.invites.schemas import InviteCreate, InviteUpdate, InviteResponse

router = APIRouter(prefix="/invites", tags=["Invites"])

@router.post("/", response_model=InviteResponse)
async def create_invite(invite: InviteCreate, db: AsyncSession = Depends(get_db)):
    db_invite = Invite(**invite.model_dump())
    db.add(db_invite)
    await db.commit()
    await db.refresh(db_invite)
    return db_invite

@router.get("/", response_model=List[InviteResponse])
async def read_invites(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Invite).offset(skip).limit(limit))
    return result.scalars().all()

@router.put("/{invite_id}/revoke", response_model=InviteResponse)
async def revoke_invite(invite_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Invite).filter(Invite.id == invite_id))
    invite = result.scalars().first()
    if invite is None:
        raise HTTPException(status_code=404, detail="Invite not found")
    
    invite.status = "Revoked"
    await db.commit()
    await db.refresh(invite)
    return invite
