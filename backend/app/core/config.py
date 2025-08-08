from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_FILE_TYPES: List[str] = ["application/pdf"]
    UPLOAD_DIR: str = "uploads"
    CV_UPLOAD_DIR: str = "uploads/cv"
    DATA_UPLOAD_DIR: str = "uploads/data"
    
    # Azure Storage Configuration (for future use)
    AZURE_STORAGE_CONNECTION_STRING: str = ""
    AZURE_CONTAINER_NAME: str = "cv-uploads"
    
    # Storage Backend ("local" or "azure")
    STORAGE_BACKEND: str = "local"
    
    class Config:
        env_file = ".env"

settings = Settings() 