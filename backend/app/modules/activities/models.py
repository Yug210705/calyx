from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class Activity(Base):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    action_type = Column(String) # e.g. "completed_task", "uploaded_file"
    description = Column(String)
    details = Column(String, default="{}")
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User")
