from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings

engine_kwargs = {"echo": False, "future": True}
if "sqlite" not in settings.SQLALCHEMY_DATABASE_URI:
    engine_kwargs["pool_size"] = 20
    engine_kwargs["max_overflow"] = 10

engine = create_async_engine(
    settings.SQLALCHEMY_DATABASE_URI,
    **engine_kwargs
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
