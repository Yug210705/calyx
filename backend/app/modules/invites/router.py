from fastapi import APIRouter, Depends
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/invites", tags=["invites"])

@router.get("/")
async def get_invites(current_user: User = Depends(get_current_user)):
    return []
