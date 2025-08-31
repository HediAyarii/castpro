-- Script pour corriger les problèmes de base de données
-- Exécuter ce script dans votre base PostgreSQL

-- 1. Vérifier la structure de la table portfolio_items
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'portfolio_items';

-- 2. Vérifier s'il y a des contraintes qui posent problème
SELECT conname, contype, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conrelid = 'portfolio_items'::regclass;

-- 3. Vérifier les données existantes
SELECT id, name, category, is_secret, created_at 
FROM portfolio_items 
LIMIT 5;

-- 4. Corriger la structure si nécessaire (décommenter si problème)
-- ALTER TABLE portfolio_items ALTER COLUMN id TYPE VARCHAR(50);
-- ALTER TABLE portfolio_items ALTER COLUMN is_secret SET DEFAULT false;

-- 5. Nettoyer les données corrompues si nécessaire
-- DELETE FROM portfolio_items WHERE id IS NULL OR name IS NULL;

-- 6. Recréer les éléments de test avec une structure propre
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at)
VALUES 
  -- Portfolio principal (public)
  ('main_001', 'Marie Dubois', '25 ans', 'jeunes', 'https://via.placeholder.com/400x300/cccccc/666666?text=Marie+Dubois', 'Actrice talentueuse', '3 ans', '["théâtre", "cinéma"]', false, NOW()),
  ('main_002', 'Jean Martin', '35 ans', 'seniors', 'https://via.placeholder.com/400x300/cccccc/666666?text=Jean+Martin', 'Acteur expérimenté', '10 ans', '["théâtre", "cinéma"]', false, NOW()),
  ('main_003', 'Emma Petit', '8 ans', 'enfants', 'https://via.placeholder.com/400x300/cccccc/666666?text=Emma+Petit', 'Jeune actrice', '2 ans', '["théâtre"]', false, NOW()),
  
  -- Portfolio secret
  ('secret_001', 'Sophie Secret', '28 ans', 'jeunes', 'https://via.placeholder.com/400x300/ffcccc/666666?text=Sophie+Secret', 'Actrice secrète', '5 ans', '["cinéma", "séries TV"]', true, NOW()),
  ('secret_002', 'Pierre Secret', '42 ans', 'seniors', 'https://via.placeholder.com/400x300/ffcccc/666666?text=Pierre+Secret', 'Acteur secret', '15 ans', '["théâtre", "cinéma"]', true, NOW()),
  ('secret_003', 'Lucas Secret', '12 ans', 'enfants', 'https://via.placeholder.com/400x300/ffcccc/666666?text=Lucas+Secret', 'Jeune talent secret', '3 ans', '["cinéma"]', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. Créer la clé d'accès de test
INSERT INTO access_keys (id, name, key, permissions, created_at, expires_at, is_active)
VALUES (
  'test_key_001',
  'Clé de test Portfolio Secret',
  'ck_test_2024',
  '["portfolio_secret"]',
  NOW(),
  NULL,
  true
) ON CONFLICT (key) DO NOTHING;

-- 8. Vérifier le résultat
SELECT 'Portfolio Principal' as type, COUNT(*) as count FROM portfolio_items WHERE is_secret = false
UNION ALL
SELECT 'Portfolio Secret' as type, COUNT(*) as count FROM portfolio_items WHERE is_secret = true
UNION ALL
SELECT 'Clés d''accès' as type, COUNT(*) as count FROM access_keys;
