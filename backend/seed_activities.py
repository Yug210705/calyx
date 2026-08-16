import asyncio
import json
from datetime import datetime, timedelta
from app.db.session import AsyncSessionLocal
from app.modules.activities.models import Activity
from app.modules.users.models import User

# Mock data mapping exactly to screenshot
activities = [
    {
        "user_id": 1,
        "action_type": "project_create",
        "description": "created a new project",
        "details": json.dumps({
            "user_name": "Arjun Mehta",
            "target_text": "Enterprise Dashboard Redesign",
            "sub_text": "Web Platform",
            "time_str": "10:24 AM",
            "icon": "file-text",
            "color": "purple",
            "badge_text": "Enterprise Dashboard",
            "badge_icon": "folder"
        }),
        "timestamp": datetime.utcnow() - timedelta(minutes=10)
    },
    {
        "user_id": 1,
        "action_type": "task_complete",
        "description": "completed a task",
        "details": json.dumps({
            "user_name": "Priya Sharma",
            "target_text": "Design system implementation",
            "sub_text": "Design",
            "time_str": "09:58 AM",
            "icon": "check-square",
            "color": "green",
            "badge_text": "Task completed",
            "badge_icon": "check-circle"
        }),
        "timestamp": datetime.utcnow() - timedelta(minutes=40)
    },
    {
        "user_id": 1,
        "action_type": "comment",
        "description": "commented on a task",
        "details": json.dumps({
            "user_name": "Rohit Singh",
            "target_text": "Let's update the API rate limits as discussed.",
            "sub_text": "API Integration",
            "time_str": "09:41 AM",
            "icon": "message-square",
            "color": "blue",
            "badge_text": "Update rate limits",
            "badge_icon": "check-square"
        }),
        "timestamp": datetime.utcnow() - timedelta(minutes=60)
    },
    {
        "user_id": 1,
        "action_type": "member_add",
        "description": "added 2 new members",
        "details": json.dumps({
            "user_name": "Sneha Iyer",
            "target_text": "Vikram Joshi, Ananya Rao",
            "sub_text": "Engineering",
            "time_str": "09:15 AM",
            "icon": "user-plus",
            "color": "orange",
            "badge_text": "Engineering Team",
            "badge_icon": "users"
        }),
        "timestamp": datetime.utcnow() - timedelta(minutes=90)
    },
    {
        "user_id": 1,
        "action_type": "file_upload",
        "description": "uploaded 3 files",
        "details": json.dumps({
            "user_name": "Vikram Joshi",
            "target_text": "requirements.pdf, api-spec.json, mockups.fig",
            "sub_text": "Product Planning",
            "time_str": "08:47 AM",
            "icon": "folder",
            "color": "purple",
            "badge_text": "Product Requirements",
            "badge_icon": "folder"
        }),
        "timestamp": datetime.utcnow() - timedelta(minutes=120)
    },
    {
        "user_id": 1,
        "action_type": "event_create",
        "description": "created an event",
        "details": json.dumps({
            "user_name": "Ananya Rao",
            "target_text": "Sprint Planning - Q2",
            "sub_text": "Calendar",
            "time_str": "08:30 AM",
            "icon": "calendar",
            "color": "pink",
            "badge_text": "May 20, 2024 at 11:00 AM",
            "badge_icon": "calendar"
        }),
        "timestamp": datetime.utcnow() - timedelta(minutes=140)
    },
    {
        "user_id": 1,
        "action_type": "role_update",
        "description": "updated role permissions",
        "details": json.dumps({
            "user_name": "Arjun Mehta",
            "target_text": "Changed role permissions for \"Product Manager\"",
            "sub_text": "Settings",
            "time_str": "Yesterday, 05:22 PM",
            "icon": "shield",
            "color": "green",
            "badge_text": "Role: Product Manager",
            "badge_icon": "shield"
        }),
        "timestamp": datetime.utcnow() - timedelta(days=1, hours=2)
    }
]

async def seed():
    async with AsyncSessionLocal() as db:
        from sqlalchemy import text
        await db.execute(text("DELETE FROM activities"))
        for act in activities:
            db_act = Activity(**act)
            db.add(db_act)
        await db.commit()
        print("Activities seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed())
