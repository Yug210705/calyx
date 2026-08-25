from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db.session import get_db
from app.db.base_models import User, Organization
from app.core.security import verify_password, get_password_hash, create_access_token

router = APIRouter(prefix="/auth", tags=["auth"])

class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    email: str
    password: str
    name: str
    org_name: str

@router.post("/signup")
async def signup(req: SignupRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")

    org = Organization(name=req.org_name)
    db.add(org)
    await db.commit()
    await db.refresh(org)

    user = User(
        email=req.email,
        hashed_password=get_password_hash(req.password),
        name=req.name,
        organization_id=org.id
    )
    db.add(user)
    await db.commit()
    return {"message": "User created successfully"}

from fastapi.security import OAuth2PasswordRequestForm

@router.post("/login")
async def login(req: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == req.username))
    user = result.scalars().first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    access_token = create_access_token(data={"sub": str(user.id), "org_id": str(user.organization_id)})
    return {"access_token": access_token, "token_type": "bearer"}
