from sqlalchemy import Column, Integer, String, Table, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

team_members = Table(
    "team_members",
    Base.metadata,
    Column("team_id", Integer, ForeignKey("teams.id")),
    Column("user_id", Integer, ForeignKey("users.id"))
)

class Team(Base):
    __tablename__ = "teams"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(String, index=True, nullable=False, default="demo")
    name = Column(String, index=True)
    acronym = Column(String, index=True)
    description = Column(String)
    status = Column(String, default="Active")
    css_class = Column(String)
    lead_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    lead = relationship("User")
    members = relationship("User", secondary=team_members)
