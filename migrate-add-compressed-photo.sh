#!/bin/bash

echo "🚀 Migration pour ajouter la colonne photo_compressed à la table appointments..."

# Exécuter la commande SQL pour ajouter la colonne
sudo docker exec castpro-postgres-1 psql -U postgres -d castpro -c "
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS photo_compressed TEXT;

CREATE INDEX IF NOT EXISTS idx_appointments_photo_compressed ON appointments(photo_compressed);

COMMENT ON COLUMN appointments.photo_compressed IS 'Image compressée en base64 (max 100KB)';
"

if [ $? -eq 0 ]; then
    echo "✅ Colonne 'photo_compressed' ajoutée avec succès à la table 'appointments'."
    echo "✅ Index 'idx_appointments_photo_compressed' créé avec succès."
    echo "✅ Commentaire ajouté sur la colonne."
else
    echo "❌ Erreur lors de l'ajout de la colonne ou de l'index."
    exit 1
fi

echo "✨ Migration terminée."
