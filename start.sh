#!/bin/bash

# Script de démarrage pour AI Recruiting CV Upload Service
# Ce script démarre le backend et le frontend en parallèle

echo "🚀 Démarrage d'AI Recruiting CV Upload Service"
echo "================================================"

# Fonction pour afficher les messages avec couleurs
print_status() {
    echo -e "\033[1;34m[INFO]\033[0m $1"
}

print_success() {
    echo -e "\033[1;32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[1;31m[ERROR]\033[0m $1"
}

# Vérification des prérequis
print_status "Vérification des prérequis..."

# Vérifier Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 n'est pas installé"
    exit 1
fi

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js n'est pas installé"
    exit 1
fi

# Vérifier npm
if ! command -v npm &> /dev/null; then
    print_error "npm n'est pas installé"
    exit 1
fi

print_success "Prérequis validés ✓"

# Installation des dépendances backend
print_status "Installation des dépendances backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
    print_status "Environnement virtuel créé"
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Dépendances backend installées ✓"
else
    print_error "Erreur lors de l'installation des dépendances backend"
    exit 1
fi
cd ..

# Installation des dépendances frontend
print_status "Installation des dépendances frontend..."
cd frontend
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    print_success "Dépendances frontend installées ✓"
else
    print_error "Erreur lors de l'installation des dépendances frontend"
    exit 1
fi
cd ..

# Création des dossiers uploads
print_status "Création des dossiers uploads..."
mkdir -p backend/uploads/cv
mkdir -p backend/uploads/data
print_success "Dossiers uploads créés ✓"

# Fonction pour nettoyer les processus en arrière-plan
cleanup() {
    print_status "Arrêt des services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Capturer Ctrl+C pour nettoyer proprement
trap cleanup SIGINT

echo ""
print_status "Démarrage des services..."

# Démarrage du backend
print_status "Démarrage du backend FastAPI..."
cd backend
source venv/bin/activate
python start.py &
BACKEND_PID=$!
cd ..

# Attendre un peu pour que le backend démarre
sleep 3

# Démarrage du frontend
print_status "Démarrage du frontend React..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Attendre un peu pour que le frontend démarre
sleep 3

echo ""
print_success "Services démarrés avec succès !"
echo ""
echo "📱 Frontend (React + Vite):  http://localhost:5173"
echo "🔧 Backend (FastAPI):       http://localhost:8000"
echo "📚 Documentation API:       http://localhost:8000/docs"
echo ""
echo "💡 Pour arrêter les services, appuyez sur Ctrl+C"
echo ""

# Attendre que les processus se terminent
wait $BACKEND_PID $FRONTEND_PID 