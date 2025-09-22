-- Migration pour ajouter la colonne photo aux rendez-vous
-- Fichier: scripts/add-photo-to-appointments.sql

-- Ajouter la colonne photo à la table appointments
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_appointments_photo ON appointments(photo_url);
