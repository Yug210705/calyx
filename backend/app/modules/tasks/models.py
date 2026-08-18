from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(String, index=True, nullable=False, default="demo")
    title = Column(String, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    status = Column(String, default="To Do") # To Do, In Progress, Review, Done
    priority = Column(String, default="Medium") # Low, Medium, High
    due_date = Column(DateTime, nullable=True)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User")
