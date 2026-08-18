from sqlalchemy import Column, Integer, String, Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

project_members = Table(
    "project_members",
    Base.metadata,
    Column("project_id", Integer, ForeignKey("projects.id")),
    Column("user_id", Integer, ForeignKey("users.id"))
)

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(String, index=True, nullable=False, default="demo")
    title = Column(String, index=True)
    description = Column(String)
    status = Column(String, default="Planning") # Planning, In Progress, On Hold, Completed
    progress = Column(Integer, default=0)
    due_date = Column(DateTime, nullable=True)
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("User", secondary=project_members)
    tasks = relationship("Task", back_populates="project", cascade="all, delete-orphan")
