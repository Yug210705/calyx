from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.modules.users.schemas import UserResponse

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "Planning"
    progress: Optional[int] = 0
    due_date: Optional[datetime] = None
    team_id: Optional[int] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    progress: Optional[int] = None
    due_date: Optional[datetime] = None
    team_id: Optional[int] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    team: List[UserResponse] = []

    class Config:
        from_attributes = True
