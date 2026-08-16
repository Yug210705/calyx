from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.exceptions import AtlasException, atlas_exception_handler
from app.modules.users.router import router as users_router
from app.modules.projects.router import router as projects_router
from app.modules.tasks.router import router as tasks_router
from app.modules.activities.router import router as activities_router
from app.modules.teams.router import router as teams_router
from app.modules.invites.router import router as invites_router
from app.modules.roles.router import router as roles_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Vite default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(AtlasException, atlas_exception_handler)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/ready")
def readiness_check():
    # In the future, this will check DB, Redis, RabbitMQ
    return {"status": "ready", "database": "ok", "redis": "ok", "rabbitmq": "ok"}

app.include_router(users_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(tasks_router, prefix=settings.API_V1_STR)
app.include_router(activities_router, prefix=settings.API_V1_STR)
app.include_router(teams_router, prefix=settings.API_V1_STR)
app.include_router(invites_router, prefix=settings.API_V1_STR)
app.include_router(roles_router, prefix=settings.API_V1_STR)
