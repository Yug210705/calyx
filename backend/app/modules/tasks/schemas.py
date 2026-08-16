from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.modules.users.schemas import UserResponse

class TaskBase(BaseModel):
    title: str
    project_id: int
    status: Optional[str] = "To Do"
    priority: Optional[str] = "Medium"
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    assignee: Optional[UserResponse] = None

    class Config:
        from_attributes = True
