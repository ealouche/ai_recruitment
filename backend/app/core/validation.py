from typing import Dict, Any, List, Optional
import re
import os
from fastapi import HTTPException, UploadFile
from app.core.config import settings

class ValidationError(Exception):
    """Exception pour les erreurs de validation"""
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class DynamicFormValidator:
    """Validateur générique pour formulaires dynamiques"""
    
    # Règles de validation par type de champ
    VALIDATION_RULES = {
        'email': {
            'pattern': r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
            'required': True,
            'message': 'Format email invalide'
        },
        'phone': {
            'pattern': r'^(?:\+33|0)[1-9](?:[0-9]{8})$',
            'required': False,
            'message': 'Format téléphone invalide (format français attendu)'
        },
        'rgpd_consent': {
            'required': True,
            'expected_value': True,
            'message': 'Le consentement RGPD est obligatoire'
        },
        'prenom': {
            'required': True,
            'min_length': 2,
            'max_length': 50,
            'message': 'Le prénom doit contenir entre 2 et 50 caractères'
        },
        'nom': {
            'required': True,
            'min_length': 2,
            'max_length': 50,
            'message': 'Le nom doit contenir entre 2 et 50 caractères'
        }
    }
    
    @classmethod
    def validate_form_data(cls, form_data: Dict[str, Any]) -> List[ValidationError]:
        """
        Valide les données du formulaire de manière générique
        Retourne une liste des erreurs trouvées
        """
        errors = []
        
        # Validation obligatoire du consentement RGPD
        if not cls._validate_rgpd_consent(form_data):
            errors.append(ValidationError(
                'rgpd_consent', 
                'Le consentement RGPD est obligatoire et doit être explicitement accepté'
            ))
        
        # Validation des champs selon leur nom/type
        for field_name, field_value in form_data.items():
            try:
                cls._validate_field(field_name, field_value)
            except ValidationError as e:
                errors.append(e)
        
        return errors
    
    @classmethod
    def _validate_rgpd_consent(cls, form_data: Dict[str, Any]) -> bool:
        """Validation spécifique du consentement RGPD"""
        rgpd_fields = [
            'rgpd_consent', 'consent_rgpd', 'consentement_rgpd', 
            'gdpr_consent', 'privacy_consent', 'consentement'
        ]
        
        for field in rgpd_fields:
            if field in form_data:
                consent_value = form_data[field]
                # Le consentement doit être explicitement True
                if consent_value is True or str(consent_value).lower() in ['true', '1', 'yes', 'oui']:
                    return True
        
        return False
    
    @classmethod
    def _validate_field(cls, field_name: str, field_value: Any) -> None:
        """Valide un champ individuel selon les règles génériques"""
        # Recherche de règles applicables basées sur le nom du champ
        applicable_rules = []
        
        # Correspondance exacte
        if field_name in cls.VALIDATION_RULES:
            applicable_rules.append(cls.VALIDATION_RULES[field_name])
        
        # Correspondance partielle pour les champs similaires
        for rule_key, rule in cls.VALIDATION_RULES.items():
            if rule_key in field_name.lower() or field_name.lower() in rule_key:
                applicable_rules.append(rule)
        
        # Application des règles trouvées
        for rule in applicable_rules:
            cls._apply_validation_rule(field_name, field_value, rule)
    
    @classmethod
    def _apply_validation_rule(cls, field_name: str, field_value: Any, rule: Dict[str, Any]) -> None:
        """Applique une règle de validation spécifique"""
        # Vérification champ requis
        if rule.get('required', False) and (field_value is None or str(field_value).strip() == ''):
            raise ValidationError(field_name, f"Le champ {field_name} est obligatoire")
        
        # Si le champ est vide et non requis, pas de validation supplémentaire
        if field_value is None or str(field_value).strip() == '':
            return
        
        # Validation du pattern regex
        if 'pattern' in rule:
            if not re.match(rule['pattern'], str(field_value)):
                raise ValidationError(field_name, rule.get('message', 'Format invalide'))
        
        # Validation de la longueur minimale
        if 'min_length' in rule:
            if len(str(field_value)) < rule['min_length']:
                raise ValidationError(
                    field_name, 
                    f"Minimum {rule['min_length']} caractères requis"
                )
        
        # Validation de la longueur maximale
        if 'max_length' in rule:
            if len(str(field_value)) > rule['max_length']:
                raise ValidationError(
                    field_name, 
                    f"Maximum {rule['max_length']} caractères autorisés"
                )
        
        # Validation de valeur attendue
        if 'expected_value' in rule:
            if field_value != rule['expected_value']:
                raise ValidationError(field_name, rule.get('message', 'Valeur invalide'))

class FileValidator:
    """Validateur pour les fichiers uploadés"""
    
    @classmethod
    async def validate_cv_file(cls, file: UploadFile) -> None:
        """Valide un fichier CV uploadé"""
        # Vérification de la taille
        content = await file.read()
        await file.seek(0)  # Reset pour la lecture suivante
        
        if len(content) > settings.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=413,
                detail=f"Fichier trop volumineux. Taille maximale: {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
            )
        
        # Vérification basique du type de fichier (simplifié sans libmagic)
        # On se base sur l'extension et le content-type pour une démo
        if not file.content_type or file.content_type not in settings.ALLOWED_FILE_TYPES:
            # Vérification basique du header PDF
            if not content.startswith(b'%PDF-'):
                raise HTTPException(
                    status_code=415,
                    detail="Le fichier ne semble pas être un PDF valide"
                )
        
        # Vérification de l'extension
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(
                status_code=415,
                detail="Seuls les fichiers PDF sont acceptés"
            )
    
    @classmethod
    def validate_filename(cls, filename: str) -> str:
        """Nettoie et valide un nom de fichier"""
        # Suppression des caractères dangereux
        cleaned = re.sub(r'[^\w\-_\.]', '_', filename)
        
        # Limitation de la longueur
        if len(cleaned) > 255:
            name, ext = os.path.splitext(cleaned)
            cleaned = name[:255-len(ext)] + ext
        
        return cleaned 