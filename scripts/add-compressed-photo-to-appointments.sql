-- Migration pour stocker les images compressées directement en base
-- Fichier: scripts/add-compressed-photo-to-appointments.sql

-- Ajouter une colonne pour stocker l'image compressée en base64
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS photo_compressed TEXT;

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_appointments_photo_compressed ON appointments(photo_compressed);

-- Commentaire sur la colonne
COMMENT ON COLUMN appointments.photo_compressed IS 'Image compressée en base64 (max 100KB)';
