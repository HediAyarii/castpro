-- Optimisation des performances pour les rendez-vous
-- Ajouter des index pour accélérer les requêtes

-- Index sur created_at pour les requêtes récentes
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at DESC);

-- Index sur date et time pour les vérifications de disponibilité
CREATE INDEX IF NOT EXISTS idx_appointments_date_time ON appointments(date, time);

-- Index sur status pour filtrer les rendez-vous actifs
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Index composite pour les requêtes les plus fréquentes
CREATE INDEX IF NOT EXISTS idx_appointments_status_created ON appointments(status, created_at DESC);
