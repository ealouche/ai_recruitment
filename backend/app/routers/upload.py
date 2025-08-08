from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import Dict, Any, Optional
import json
import os
import glob
from datetime import datetime

from app.core.storage import StorageService
from app.core.validation import DynamicFormValidator, FileValidator, ValidationError

router = APIRouter()

# Service de stockage partagé
storage_service = StorageService()

@router.post("/upload")
async def upload_cv(
    cv_file: UploadFile = File(..., description="Fichier CV au format PDF"),
    form_data: str = Form(..., description="Données du formulaire en JSON")
):
    """
    Endpoint générique pour l'upload de CV avec formulaire dynamique
    
    Le backend accepte n'importe quelle structure de formulaire,
    aucun champ n'est hardcodé dans le code.
    """
    try:
        # Parsing des données du formulaire
        try:
            parsed_form_data = json.loads(form_data)
        except json.JSONDecodeError:
            raise HTTPException(
                status_code=400,
                detail="Format JSON invalide pour les données du formulaire"
            )
        
        # Validation du fichier CV
        await FileValidator.validate_cv_file(cv_file)
        
        # Validation générique des données du formulaire
        validation_errors = DynamicFormValidator.validate_form_data(parsed_form_data)
        
        if validation_errors:
            error_details = {
                "message": "Erreurs de validation détectées",
                "errors": [
                    {"field": error.field, "message": error.message}
                    for error in validation_errors
                ]
            }
            raise HTTPException(status_code=422, detail=error_details)
        
        # Lecture du contenu du fichier
        cv_content = await cv_file.read()
        
        # Sauvegarde via le service de stockage
        storage_result = await storage_service.save_cv_upload(cv_content, parsed_form_data)
        
        # Construction de la réponse
        response_data = {
            "success": True,
            "message": "CV et données sauvegardés avec succès",
            "upload_id": storage_result["upload_id"],
            "cv_url": storage_result["cv_url"],
            "timestamp": datetime.now().isoformat(),
            "form_fields_received": list(parsed_form_data.keys()),
            "file_info": {
                "filename": cv_file.filename,
                "size": len(cv_content),
                "content_type": cv_file.content_type
            }
        }
        
        return JSONResponse(
            status_code=201,
            content=response_data
        )
        
    except HTTPException:
        # Re-lever les HTTPException déjà formatées
        raise
    except Exception as e:
        # Gestion des erreurs inattendues
        raise HTTPException(
            status_code=500,
            detail=f"Erreur interne du serveur: {str(e)}"
        )

@router.get("/stats")
async def get_upload_stats():
    """
    Endpoint pour récupérer les statistiques d'upload
    
    Retourne le nombre total d'uploads reçus en comptant les fichiers JSON
    dans le dossier de données (chaque upload génère un fichier JSON unique)
    """
    try:
        # Comptage des fichiers de données (un par upload)
        data_dir = os.path.join("uploads", "data")
        
        if not os.path.exists(data_dir):
            total_uploads = 0
        else:
            # Compter les fichiers JSON dans le dossier data
            json_files = glob.glob(os.path.join(data_dir, "*.json"))
            total_uploads = len(json_files)
        
        return {
            "total_uploads": total_uploads,
            "timestamp": datetime.now().isoformat(),
            "storage_backend": storage_service.backend.__class__.__name__
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des statistiques: {str(e)}"
        )

@router.get("/form-config")
async def get_form_configuration():
    """
    Endpoint optionnel pour retourner la configuration du formulaire
    
    Cet endpoint peut être utilisé par le frontend pour obtenir
    la structure des champs à afficher dynamiquement
    """
    # Configuration exemple - peut être stockée en base ou dans un fichier
    form_config = {
        "fields": [
            {
                "name": "prenom",
                "type": "text",
                "label": "Prénom",
                "required": True,
                "placeholder": "Votre prénom"
            },
            {
                "name": "nom", 
                "type": "text",
                "label": "Nom",
                "required": True,
                "placeholder": "Votre nom"
            },
            {
                "name": "email",
                "type": "email",
                "label": "Email",
                "required": True,
                "placeholder": "votre@email.com"
            },
            {
                "name": "telephone",
                "type": "tel",
                "label": "Téléphone",
                "required": False,
                "placeholder": "01 23 45 67 89"
            },
            {
                "name": "localisation",
                "type": "text",
                "label": "Localisation",
                "required": False,
                "placeholder": "Ville, Région"
            },
            {
                "name": "date_disponibilite",
                "type": "date",
                "label": "Date de disponibilité",
                "required": False
            },
            {
                "name": "rgpd_consent",
                "type": "checkbox",
                "label": "J'accepte le traitement de mes données personnelles conformément au RGPD",
                "required": True
            }
        ],
        "version": "1.0",
        "last_updated": datetime.now().isoformat()
    }
    
    return form_config

@router.get("/uploads/{upload_id}")
async def get_upload_details(upload_id: str):
    """
    Endpoint pour récupérer les détails d'un upload spécifique
    """
    try:
        # Vérification de l'existence du fichier de données
        data_file = os.path.join("uploads", "data", f"{upload_id}.json")
        
        if not os.path.exists(data_file):
            raise HTTPException(
                status_code=404,
                detail="Upload non trouvé"
            )
        
        # Lecture des métadonnées
        with open(data_file, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
        
        return {
            "upload_id": upload_id,
            "metadata": metadata,
            "cv_available": os.path.exists(os.path.join("uploads", "cv", f"{upload_id}.pdf"))
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur lors de la récupération des détails: {str(e)}"
        ) 