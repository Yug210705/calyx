from sqlalchemy import Column, Integer, String
from app.db.base import Base

class Role(Base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    permissions = Column(String, default="[]") # JSON string array of permission strings
