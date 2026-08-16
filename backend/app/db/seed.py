import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from datetime import datetime, timedelta

from app.db.session import engine, AsyncSessionLocal
from app.modules.users.models import User
from app.modules.projects.models import Project
from app.modules.tasks.models import Task
from app.modules.activities.models import Activity

projects_mock_data = [
    {
        "title": "Atlas Mobile App",
        "description": "Mobile application for iOS & Android",
        "status": "In Progress",
        "progress": 75,
        "due_date": datetime(2024, 5, 30)
    },
    {
        "title": "Website Redesign",
        "description": "Redesign corporate website",
        "status": "In Progress",
        "progress": 45,
        "due_date": datetime(2024, 6, 10)
    },
    {
        "title": "AI Dashboard",
        "description": "Analytics dashboard with AI insights",
        "status": "In Progress",
        "progress": 90,
        "due_date": datetime(2024, 5, 25)
    },
    {
        "title": "Marketing Website",
        "description": "Marketing & landing website",
        "status": "Planning",
        "progress": 20,
        "due_date": datetime(2024, 6, 15)
    },
    {
        "title": "Internal Admin Panel",
        "description": "Internal tools and admin panel",
        "status": "On Hold",
        "progress": 10,
        "due_date": datetime(2024, 6, 20)
    },
    {
        "title": "E-commerce Platform",
        "description": "Full-stack e-commerce solution",
        "status": "Completed",
        "progress": 100,
        "due_date": datetime(2024, 4, 30)
    }
]

async def seed_db():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Project))
        existing_projects = result.scalars().all()
        if not existing_projects:
            for p_data in projects_mock_data:
                project = Project(**p_data)
                session.add(project)
            await session.commit()
            print("Database seeded with projects.")
            
            # Fetch the first project to attach tasks to
            result = await session.execute(select(Project))
            project_1 = result.scalars().first()
            
            now = datetime.utcnow()
            tasks_mock_data = [
                {"title": "ATL-1: Fix Auth Redirect", "description": "Fix bug", "type": "Bug", "priority": "High", "status": "To Do", "project_id": project_1.id, "due_date": now + timedelta(days=2)},
                {"title": "ATL-2: Payment Integration", "description": "Stripe", "type": "Story", "priority": "Medium", "status": "In Progress", "project_id": project_1.id, "due_date": now + timedelta(days=5)},
                {"title": "v1.2 Release Freeze", "description": "Milestone", "type": "Milestone", "priority": "Highest", "status": "In Review", "project_id": project_1.id, "due_date": now + timedelta(days=8)},
                {"title": "ATL-4: AI Endpoints", "description": "Epic", "type": "Epic", "priority": "High", "status": "To Do", "project_id": project_1.id, "due_date": now + timedelta(days=12)},
            ]
            for t_data in tasks_mock_data:
                task = Task(**t_data)
                session.add(task)
            await session.commit()
            print("Database seeded with tasks.")
        else:
            print("Database already has projects and tasks.")

if __name__ == "__main__":
    asyncio.run(seed_db())
