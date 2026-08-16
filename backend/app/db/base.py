from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import models in alembic/env.py instead to avoid circular imports
