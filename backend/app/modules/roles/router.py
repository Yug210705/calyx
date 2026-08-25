from fastapi import APIRouter, Depends
from app.db.base_models import User
from app.core.deps import get_current_user

router = APIRouter(prefix="/roles", tags=["roles"])

@router.get("/")
async def get_roles(current_user: User = Depends(get_current_user)):
    return [
        {"id": 1, "name": "Admin", "permissions": ["all"]},
        {"id": 2, "name": "Member", "permissions": ["read", "write"]}
    ]
