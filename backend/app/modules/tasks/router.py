from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List

from app.db.session import get_db
from app.modules.tasks.models import Task
from app.modules.tasks.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.core.security import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=TaskResponse)
async def create_task(task: TaskCreate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    db_task = Task(**task.model_dump(), owner_id=current_user["sub"])
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    # Reload with relations
    result = await db.execute(select(Task).options(selectinload(Task.assignee)).filter(Task.id == db_task.id))
    return result.scalars().first()

@router.get("/", response_model=List[TaskResponse])
async def read_tasks(project_id: int = None, skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    query = select(Task).options(selectinload(Task.assignee)).filter(Task.owner_id == current_user["sub"])
    if project_id:
        query = query.filter(Task.project_id == project_id)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task_update: TaskUpdate, db: AsyncSession = Depends(get_db), current_user: dict = Depends(get_current_user)):
    result = await db.execute(select(Task).options(selectinload(Task.assignee)).filter(Task.id == task_id, Task.owner_id == current_user["sub"]))
    task = result.scalars().first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
        
    await db.commit()
    await db.refresh(task)
    return task
