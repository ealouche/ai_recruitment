from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """Configuration centralisée de l'application"""
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    
    # File Upload Configuration - Optimisé par Elyes Alouache 09/08/2025
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB (augmenté pour les CVs volumineux)
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",  # DOCX
        "application/msword",  # DOC
        "text/plain"  # TXT
    ]
    UPLOAD_DIR: str = "uploads"
    
    # Azure Storage Configuration (désactivé temporairement)
    AZURE_STORAGE_CONNECTION_STRING: str = ""
    AZURE_CONTAINER_NAME: str = "cv-uploads"
    
    # Storage Backend ("local" forcé temporairement)
    STORAGE_BACKEND: str = "local"
    
    # Text Extraction Configuration - Ajouté par Elyes Alouache 09/08/2025
    EXTRACTION_TIMEOUT: int = 30  # secondes
    MIN_TEXT_LENGTH: int = 50  # caractères minimum pour un CV valide
    MIN_WORD_COUNT: int = 10  # mots minimum pour un CV valide
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 