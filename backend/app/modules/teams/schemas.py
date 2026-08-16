from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.modules.users.schemas import UserResponse

class TeamBase(BaseModel):
    name: str
    acronym: str
    description: str
    status: Optional[str] = "Active"
    css_class: Optional[str] = None
    lead_id: Optional[int] = None

class TeamCreate(TeamBase):
    pass

class TeamUpdate(BaseModel):
    name: Optional[str] = None
    acronym: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    css_class: Optional[str] = None
    lead_id: Optional[int] = None

class TeamResponse(TeamBase):
    id: int
    created_at: datetime
    lead: Optional[UserResponse] = None
    members_count: Optional[int] = 0
    projects_count: Optional[int] = 0

    class Config:
        from_attributes = True
