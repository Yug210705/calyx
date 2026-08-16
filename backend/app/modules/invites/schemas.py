from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class InviteBase(BaseModel):
    email: str
    role: Optional[str] = "member"
    status: Optional[str] = "Pending"
    team_id: Optional[int] = None

class InviteCreate(InviteBase):
    pass

class InviteUpdate(BaseModel):
    status: Optional[str] = None

class InviteResponse(InviteBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
