from abc import ABC, abstractmethod
from typing import Any, Dict
import uuid
import json
import os
import aiofiles
from azure.storage.blob.aio import BlobServiceClient
from app.core.config import settings
from app.core.text_extractor import OptimizedTextExtractor
import logging

logger = logging.getLogger(__name__)

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
    async def save_text(self, text: str, filename: str, folder: str) -> str:
        """Sauvegarde du texte extrait"""
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
    
    async def save_text(self, text: str, filename: str, folder: str) -> str:
        """Sauvegarde du texte extrait localement"""
        folder_path = os.path.join(settings.UPLOAD_DIR, folder)
        os.makedirs(folder_path, exist_ok=True)
        
        file_path = os.path.join(folder_path, filename)
        
        async with aiofiles.open(file_path, 'w', encoding='utf-8') as f:
            await f.write(text)
        
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
    
    async def save_text(self, text: str, filename: str, folder: str) -> str:
        """Sauvegarde du texte extrait sur Azure Blob"""
        text_bytes = text.encode('utf-8')
        return await self.save_file(text_bytes, filename, folder)
    
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
    # Optimisé par Elyes Alouache - 09/08/2025
    # Azure Blob Storage désactivé temporairement pour développement local
    
    # TODO: Réactiver Azure quand nécessaire
    # if settings.STORAGE_BACKEND == "azure" and settings.AZURE_STORAGE_CONNECTION_STRING:
    #     return AzureBlobStorageBackend()
    
    # Utilisation du stockage local par défaut
    return LocalStorageBackend()


class StorageService:
    """Service de stockage unifié"""
    
    def __init__(self):
        self.backend = get_storage_backend()
    
    async def save_cv_upload(self, cv_content: bytes, form_data: Dict[str, Any], cv_filename: str = None) -> Dict[str, str]:
        """
        Sauvegarde un CV et ses données associées avec extraction de texte optimisée
        Retourne les URLs/chemins des fichiers sauvegardés
        
        Modifications Elyes Alouache - 09/08/2025:
        - Création automatique du dossier data/{id}/
        - Extraction optimisée du texte du CV
        - Sauvegarde du texte extrait dans data/{id}/extracted_{id}.txt
        - Sauvegarde du formulaire dans data/{id}/form_{id}.json
        """
        upload_id = str(uuid.uuid4())
        
        # Création du dossier spécifique pour cet upload
        upload_folder = f"data/{upload_id}"
        
        # Noms des fichiers selon les spécifications
        # CV original dans le dossier cv/ avec suffixe d'ID
        if cv_filename:
            name, ext = os.path.splitext(cv_filename)
            cv_original_filename = f"{name}_{upload_id}{ext}"
        else:
            cv_original_filename = f"cv_{upload_id}.pdf"
        
        extracted_filename = f"extracted_{upload_id}.txt"
        form_filename = f"form_{upload_id}.json"
        
        try:
            # 1. Extraction optimisée du texte du CV
            logger.info(f"Début extraction texte pour upload {upload_id}")
            extracted_text = OptimizedTextExtractor.extract_text_from_bytes(
                cv_content, cv_original_filename
            )
            
            # Validation du texte extrait
            if not OptimizedTextExtractor.validate_extracted_text(extracted_text):
                logger.warning(f"Texte extrait invalide pour upload {upload_id}")
                extracted_text = "[ERREUR] Impossible d'extraire le texte du CV"
            
            # Statistiques d'extraction
            text_stats = OptimizedTextExtractor.get_text_stats(extracted_text)
            logger.info(f"Extraction réussie pour {upload_id}: {text_stats['word_count']} mots")
            
            # 2. Sauvegarde du CV original dans le dossier cv/ avec suffixe d'ID
            cv_path = await self.backend.save_file(cv_content, cv_original_filename, "cv")
            
            # 3. Sauvegarde du texte extrait
            extracted_path = await self.backend.save_text(extracted_text, extracted_filename, upload_folder)
            
            # 4. Préparation des métadonnées enrichies
            metadata = {
                "upload_id": upload_id,
                "form_data": form_data,
                "cv_filename": cv_original_filename,
                "cv_folder": "cv",
                "extracted_filename": extracted_filename,
                "upload_timestamp": str(uuid.uuid1().time),
                "extraction_stats": text_stats,
                "folder_path": upload_folder,
                "extraction_date": "09/08/2025",
                "extracted_by": "Elyes Alouache - Optimized Text Extractor"
            }
            
            # 5. Sauvegarde du formulaire JSON
            form_path = await self.backend.save_json(metadata, form_filename, upload_folder)
            
            logger.info(f"Upload {upload_id} sauvegardé avec succès dans {upload_folder}")
            
            return {
                "upload_id": upload_id,
                "cv_url": await self.backend.get_file_url(cv_original_filename, "cv"),
                "extracted_url": await self.backend.get_file_url(extracted_filename, upload_folder),
                "form_url": await self.backend.get_file_url(form_filename, upload_folder),
                "cv_path": cv_path,
                "extracted_path": extracted_path,
                "form_path": form_path,
                "folder_path": upload_folder,
                "extraction_stats": text_stats
            }
            
        except Exception as e:
            logger.error(f"Erreur lors de la sauvegarde de l'upload {upload_id}: {str(e)}")
            # En cas d'erreur, on sauvegarde quand même le CV et les données de base
            cv_path = await self.backend.save_file(cv_content, cv_original_filename, "cv")
            
            error_metadata = {
                "upload_id": upload_id,
                "form_data": form_data,
                "cv_filename": cv_original_filename,
                "cv_folder": "cv",
                "upload_timestamp": str(uuid.uuid1().time),
                "extraction_error": str(e),
                "folder_path": upload_folder
            }
            
            form_path = await self.backend.save_json(error_metadata, form_filename, upload_folder)
            
            return {
                "upload_id": upload_id,
                "cv_url": await self.backend.get_file_url(cv_original_filename, "cv"),
                "form_url": await self.backend.get_file_url(form_filename, upload_folder),
                "cv_path": cv_path,
                "form_path": form_path,
                "folder_path": upload_folder,
                "extraction_error": str(e)
            } 