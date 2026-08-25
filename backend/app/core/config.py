from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Project Atlas"
    API_V1_STR: str = "/api/v1"

    # We use SQLite for local dev per the environment limitations
    SQLALCHEMY_DATABASE_URI: str = "sqlite+aiosqlite:///./atlas.db"

    JWT_SECRET_KEY: str = "supersecretkey_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days for dev

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)

settings = Settings()
