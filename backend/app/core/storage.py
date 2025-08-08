from abc import ABC, abstractmethod
from typing import Any, Dict
import uuid
import json
import os
import aiofiles
from azure.storage.blob.aio import BlobServiceClient
from app.core.config import settings

class StorageBackend(ABC):
    """Interface abstraite pour les backends de stockage"""
    
    @abstractmethod
    async def save_file(self, file_content: bytes, filename: str, folder: str) -> str:
        """Sauvegarde un fichier et retourne l'URL/chemin"""
        pass
    
    @abstractmethod
    async def save_json(self, data: Dict[str, Any], filename: str, folder: str) -> str:
        """Sauvegarde des données JSON"""
        pass
    
    @abstractmethod
    async def get_file_url(self, filename: str, folder: str) -> str:
        """Retourne l'URL publique du fichier"""
        pass


class LocalStorageBackend(StorageBackend):
    """Backend de stockage local"""
    
    async def save_file(self, file_content: bytes, filename: str, folder: str) -> str:
        """Sauvegarde un fichier localement"""
        folder_path = os.path.join(settings.UPLOAD_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        file_path = os.path.join(folder_path, filename)
        
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        return file_path
    
    async def save_json(self, data: Dict[str, Any], filename: str, folder: str) -> str:
        """Sauvegarde des données JSON localement"""
        folder_path = os.path.join(settings.UPLOAD_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        file_path = os.path.join(folder_path, filename)
        
        async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
            await f.write(json.dumps(data, indent=2, ensure_ascii=False))
        
        return file_path
    
    async def get_file_url(self, filename: str, folder: str) -> str:
        """Retourne l'URL locale du fichier"""
        return f"/uploads/{folder}/{filename}"


class AzureBlobStorageBackend(StorageBackend):
    """Backend de stockage Azure Blob"""
    
    def __init__(self):
        if settings.AZURE_STORAGE_CONNECTION_STRING:
            self.blob_service_client = BlobServiceClient.from_connection_string(
                settings.AZURE_STORAGE_CONNECTION_STRING
            )
        else:
            self.blob_service_client = None
    
    async def save_file(self, file_content: bytes, filename: str, folder: str) -> str:
        """Sauvegarde un fichier sur Azure Blob"""
        if not self.blob_service_client:
            raise ValueError("Azure Storage not configured")
        
        blob_name = f"{folder}/{filename}"
        blob_client = self.blob_service_client.get_blob_client(
            container=settings.AZURE_CONTAINER_NAME,
            blob=blob_name
        )
        
        await blob_client.upload_blob(file_content, overwrite=True)
        return blob_client.url
    
    async def save_json(self, data: Dict[str, Any], filename: str, folder: str) -> str:
        """Sauvegarde des données JSON sur Azure Blob"""
        json_content = json.dumps(data, indent=2, ensure_ascii=False)
        json_bytes = json_content.encode('utf-8')
        
        return await self.save_file(json_bytes, filename, folder)
    
    async def get_file_url(self, filename: str, folder: str) -> str:
        """Retourne l'URL Azure Blob du fichier"""
        blob_name = f"{folder}/{filename}"
        blob_client = self.blob_service_client.get_blob_client(
            container=settings.AZURE_CONTAINER_NAME,
            blob=blob_name
        )
        return blob_client.url


def get_storage_backend() -> StorageBackend:
    """Factory pour récupérer le backend de stockage configuré"""
    if settings.STORAGE_BACKEND == "azure":
        return AzureBlobStorageBackend()
    else:
        return LocalStorageBackend()


class StorageService:
    """Service de stockage unifié"""
    
    def __init__(self):
        self.backend = get_storage_backend()
    
    async def save_cv_upload(self, cv_content: bytes, form_data: Dict[str, Any]) -> Dict[str, str]:
        """
        Sauvegarde un CV et ses données associées
        Retourne les URLs/chemins des fichiers sauvegardés
        """
        upload_id = str(uuid.uuid4())
        
        # Noms des fichiers
        cv_filename = f"{upload_id}.pdf"
        data_filename = f"{upload_id}.json"
        
        # Sauvegarde du CV
        cv_path = await self.backend.save_file(cv_content, cv_filename, "cv")
        
        # Préparation des métadonnées
        metadata = {
            "upload_id": upload_id,
            "form_data": form_data,
            "cv_filename": cv_filename,
            "upload_timestamp": str(uuid.uuid1().time)
        }
        
        # Sauvegarde des données JSON
        data_path = await self.backend.save_json(metadata, data_filename, "data")
        
        return {
            "upload_id": upload_id,
            "cv_url": await self.backend.get_file_url(cv_filename, "cv"),
            "data_url": await self.backend.get_file_url(data_filename, "data"),
            "cv_path": cv_path,
            "data_path": data_path
        } 