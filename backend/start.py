import uvicorn
import os

if __name__ == "__main__":
    # Configuration du serveur
    host = os.getenv("HOST", "127.0.0.1")
    port = int(os.getenv("PORT", 8000))
    reload = os.getenv("RELOAD", "true").lower() == "true"
    
    # Création des dossiers nécessaires
    os.makedirs("uploads/cv", exist_ok=True)
    os.makedirs("uploads/data", exist_ok=True)
    
    print(f"🚀 Démarrage du serveur FastAPI...")
    print(f"📂 Dossiers uploads créés")
    print(f"🌐 http://{host}:{port}")
    print(f"📚 Documentation: http://{host}:{port}/docs")
    
    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload,
        log_level="info"
    ) 