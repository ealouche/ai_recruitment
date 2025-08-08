from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.routers import upload
from app.core.config import settings

app = FastAPI(
    title="AI Recruiting CV Upload Service",
    description="Microservice for dynamic CV upload with schema-less backend",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montage du dossier uploads pour servir les fichiers statiques
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Routes
app.include_router(upload.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "AI Recruiting CV Upload Service is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 