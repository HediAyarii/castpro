#!/bin/bash

# Script de migration pour ajouter la colonne photo aux rendez-vous
# Fichier: migrate-add-photo-to-appointments.sh

echo "🔄 MIGRATION: Ajout de la colonne photo aux rendez-vous"
echo "======================================================"

# Vérifier si Docker est en cours d'exécution
if ! docker ps | grep -q "castpro-postgres-1"; then
    echo "❌ Le container PostgreSQL n'est pas en cours d'exécution"
    echo "Démarrez d'abord Docker Compose: sudo docker compose up -d"
    exit 1
fi

echo "📊 Exécution de la migration..."

# Exécuter la migration SQL
docker exec castpro-postgres-1 psql -U postgres -d castpro -c "
-- Ajouter la colonne photo à la table appointments
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_appointments_photo ON appointments(photo_url);

-- Vérifier la structure de la table
\d appointments;
"

if [ $? -eq 0 ]; then
    echo "✅ Migration réussie!"
    echo "📋 La colonne 'photo_url' a été ajoutée à la table 'appointments'"
    echo "📋 Un index a été créé pour optimiser les requêtes"
else
    echo "❌ Erreur lors de la migration"
    exit 1
fi

echo "======================================================"
