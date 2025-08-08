# AI Recruiting - Microservice d'Upload CV

Un microservice moderne pour l'upload de CV avec formulaire dynamique et backend schema-less.

## 🚀 Fonctionnalités

### Backend (FastAPI)
- **Schema-less** : Accepte dynamiquement n'importe quelle configuration de formulaire
- **Upload sécurisé** : Validation stricte des fichiers PDF (<5MB)
- **Validation RGPD** : Consentement obligatoire et validation générique
- **Stockage abstrait** : Support local et Azure Blob Storage
- **API RESTful** : Endpoints génériques pour upload, stats et configuration

### Frontend (React + Vite)
- **Formulaire dynamique** : Configuration des champs côté serveur
- **Aperçu PDF live** : Preview direct avec react-pdf
- **Validation temps réel** : Contrôles côté client et serveur
- **Interface moderne** : UI responsive avec Tailwind CSS
- **TypeScript** : Typage strict pour la robustesse

## 📁 Structure du Projet

```
ai_recruiting/
├── backend/                 # API FastAPI
│   ├── app/
│   │   ├── core/           # Configuration et services
│   │   │   ├── config.py   # Settings application
│   │   │   ├── storage.py  # Abstraction stockage
│   │   │   └── validation.py # Validation dynamique
│   │   ├── routers/        # Endpoints API
│   │   │   └── upload.py   # Routes d'upload
│   │   └── main.py         # Point d'entrée FastAPI
│   ├── requirements.txt    # Dépendances Python
│   ├── start.py           # Script de démarrage
│   └── env.example        # Variables d'environnement
└── frontend/               # Application React
    ├── src/
    │   ├── components/     # Composants React
    │   │   ├── CVUploadForm.tsx
    │   │   ├── DynamicFormFields.tsx
    │   │   ├── CVPreview.tsx
    │   │   └── StatsDisplay.tsx
    │   ├── services/       # Services API
    │   │   └── api.ts
    │   ├── types/          # Types TypeScript
    │   │   └── form.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    └── tailwind.config.js
```

## 🛠️ Installation

### Prérequis
- Python 3.10+
- Node.js 18+
- npm ou yarn

### Backend
```bash
cd backend
pip install -r requirements.txt
python start.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🚀 Démarrage Rapide

1. **Backend** (Terminal 1):
```bash
cd ai_recruiting/backend
pip install -r requirements.txt
python start.py
```

2. **Frontend** (Terminal 2):
```bash
cd ai_recruiting/frontend
npm install
npm run dev
```

3. **Accès**:
   - Application : http://localhost:5173
   - API Docs : http://localhost:8000/docs
   - API Backend : http://localhost:8000

## 📋 API Endpoints

### POST `/api/upload`
Upload d'un CV avec données formulaire
```json
{
  "cv_file": "fichier.pdf",
  "form_data": "{\"nom\":\"Dupont\",\"email\":\"test@example.com\",\"rgpd_consent\":true}"
}
```

### GET `/api/stats`
Statistiques d'upload
```json
{
  "total_uploads": 42,
  "timestamp": "2024-01-15T10:30:00",
  "storage_backend": "LocalStorageBackend"
}
```

### GET `/api/form-config`
Configuration dynamique du formulaire
```json
{
  "fields": [
    {
      "name": "email",
      "type": "email", 
      "label": "Email",
      "required": true
    }
  ]
}
```

## 🔧 Configuration

### Variables d'Environnement Backend
```bash
# Copier le fichier exemple
cp env.example .env

# Modifier selon vos besoins
STORAGE_BACKEND=local  # ou "azure"
MAX_FILE_SIZE=5242880  # 5MB
AZURE_STORAGE_CONNECTION_STRING=  # Si Azure
```

### Variables d'Environnement Frontend
```bash
# Optionnel: URL de l'API personnalisée
VITE_API_URL=http://localhost:8000
```

## 🏗️ Architecture Schema-less

### Principe
Le backend ne connaît **aucun champ spécifique** à l'avance. Il accepte dynamiquement :
- N'importe quelle structure de formulaire
- Tout ajout/suppression de champs côté frontend
- Validation générique basée sur les noms de champs

### Exemple d'évolution

**Version 1** (6 champs):
```json
{
  "prenom": "Jean",
  "nom": "Dupont", 
  "email": "jean@example.com",
  "telephone": "0123456789",
  "localisation": "Paris",
  "rgpd_consent": true
}
```

**Version 2** (10 champs) - Aucun changement backend requis:
```json
{
  "prenom": "Jean",
  "nom": "Dupont",
  "email": "jean@example.com", 
  "telephone": "0123456789",
  "localisation": "Paris",
  "poste_souhaite": "Développeur",
  "experience": "5 ans",
  "salaire_attendu": "50000",
  "mobilite": "Nationale",
  "rgpd_consent": true
}
```

## 🔒 Sécurité et Validation

### Validation Fichiers
- ✅ Format PDF uniquement
- ✅ Taille maximum 5MB
- ✅ Vérification MIME type
- ✅ Nom de fichier sécurisé

### Validation RGPD
- ✅ Consentement obligatoire
- ✅ Détection automatique des champs RGPD
- ✅ Validation côté client et serveur

### Validation Générique
- ✅ Email format si champ "email" présent
- ✅ Téléphone français si champ "phone/telephone"
- ✅ Longueur min/max selon configuration
- ✅ Champs requis selon configuration

## 🗃️ Stockage

### Local (par défaut)
```
uploads/
├── cv/       # Fichiers PDF (uuid.pdf)
└── data/     # Métadonnées JSON (uuid.json)
```

### Azure Blob Storage
Configuration via variables d'environnement :
```bash
STORAGE_BACKEND=azure
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AZURE_CONTAINER_NAME=cv-uploads
```

## 🧪 Tests

### Test Manuel
1. Démarrer backend et frontend
2. Ouvrir http://localhost:5173
3. Remplir le formulaire avec un PDF
4. Vérifier l'upload et les statistiques

### Test API avec curl
```bash
# Upload test
curl -X POST "http://localhost:8000/api/upload" \
  -F "cv_file=@test.pdf" \
  -F "form_data={\"nom\":\"Test\",\"email\":\"test@example.com\",\"rgpd_consent\":true}"

# Statistiques
curl http://localhost:8000/api/stats
```

## 🔄 Évolution Future

### Ajout de Champs Frontend
1. Modifier la configuration dans `/api/form-config`
2. Aucune modification backend nécessaire
3. Le nouveau champ sera automatiquement traité

### Migration vers Azure
1. Configurer les variables d'environnement Azure
2. Changer `STORAGE_BACKEND=azure`
3. Redémarrer le backend

## 📈 Monitoring

### Logs
- Logs FastAPI automatiques
- Erreurs de validation détaillées
- Métriques d'upload dans `/api/stats`

### Surveillance
- Surveiller le dossier `uploads/` (mode local)
- Métriques Azure Blob (mode cloud)
- Logs d'erreur dans la console

## 🤝 Contribution

### Ajout de Validations
Modifier `app/core/validation.py` pour ajouter de nouvelles règles génériques.

### Nouveaux Backends de Stockage
Implémenter `StorageBackend` dans `app/core/storage.py`.

### Nouveaux Types de Champs
Étendre `DynamicFormFields.tsx` pour supporter de nouveaux types.

## 📝 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

---

**Architecture conçue pour la flexibilité maximale** 🚀  
*Aucun changement backend nécessaire lors de l'évolution des formulaires frontend*