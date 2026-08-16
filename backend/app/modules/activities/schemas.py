from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.modules.users.schemas import UserResponse

class ActivityBase(BaseModel):
    user_id: int
    action_type: str
    description: str
    details: Optional[str] = "{}"

class ActivityCreate(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: int
    timestamp: datetime
    user: Optional[UserResponse] = None

    class Config:
        from_attributes = True
