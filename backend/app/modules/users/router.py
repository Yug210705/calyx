from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/")
async def get_users(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    result = await db.execute(select(User).where(User.organization_id == current_user.organization_id))
    return result.scalars().all()

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "name": current_user.name, "avatar": current_user.avatar}
