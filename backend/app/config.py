import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:shiv112@localhost:5432/govt_scheme_db")

    # JWT / Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your_secret_key_change_in_production")
    JWT_SECRET: str = os.getenv("JWT_SECRET", "your_jwt_secret")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # App
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    ALLOWED_HOSTS: list = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

    # AI Model
    AI_MODEL_PATH: str = os.getenv("AI_MODEL_PATH", "app/ai_model/model.pkl")


settings = Settings()
