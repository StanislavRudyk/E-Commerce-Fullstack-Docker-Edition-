from pydantic_settings import BaseSettings
from typing import List, Optional
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "E-Commerce API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DATABASE_URL: str = "postgresql://ecommerce_user:ecommerce_pass@postgres:5432/ecommerce_db"
    SECRET_KEY: str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            if field_name == "BACKEND_CORS_ORIGINS":
                if raw_val.startswith("[") and raw_val.endswith("]"):
                    return json.loads(raw_val)
            return json.loads(raw_val) if raw_val.startswith("[") else raw_val

settings = Settings()

print(f"✅ Загружены настройки:")
print(f"   DATABASE_URL: {settings.DATABASE_URL[:30]}...")
print(f"   SECRET_KEY: {settings.SECRET_KEY[:10]}...")