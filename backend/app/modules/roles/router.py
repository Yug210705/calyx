from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from app.db.session import get_db
from app.modules.roles.models import Role
from app.modules.roles.schemas import RoleCreate, RoleUpdate, RoleResponse

router = APIRouter(prefix="/roles", tags=["Roles"])

@router.post("/", response_model=RoleResponse)
async def create_role(role: RoleCreate, db: AsyncSession = Depends(get_db)):
    db_role = Role(**role.model_dump())
    db.add(db_role)
    await db.commit()
    await db.refresh(db_role)
    return db_role

@router.get("/", response_model=List[RoleResponse])
async def read_roles(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).offset(skip).limit(limit))
    return result.scalars().all()

@router.put("/{role_id}", response_model=RoleResponse)
async def update_role(role_id: int, role_update: RoleUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).filter(Role.id == role_id))
    role = result.scalars().first()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    
    update_data = role_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(role, key, value)
        
    await db.commit()
    await db.refresh(role)
    return role

@router.delete("/{role_id}")
async def delete_role(role_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Role).filter(Role.id == role_id))
    role = result.scalars().first()
    if role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    await db.delete(role)
    await db.commit()
    return {"ok": True}
