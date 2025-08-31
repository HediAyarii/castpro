-- Test complet du système de portfolio
-- Exécuter ce script dans votre base de données PostgreSQL

-- 1. Nettoyer les données existantes (optionnel)
-- DELETE FROM portfolio_items;
-- DELETE FROM access_keys;

-- 2. Créer une clé d'accès de test
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

-- 3. Créer des éléments de test avec des images externes
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at)
VALUES 
  -- Portfolio principal (public) - is_secret = false
  ('main_001', 'Marie Dubois', '25 ans', 'jeunes', 'https://via.placeholder.com/400x300/cccccc/666666?text=Marie+Dubois', 'Actrice talentueuse', '3 ans', '["théâtre", "cinéma"]', false, NOW()),
  ('main_002', 'Jean Martin', '35 ans', 'seniors', 'https://via.placeholder.com/400x300/cccccc/666666?text=Jean+Martin', 'Acteur expérimenté', '10 ans', '["théâtre", "cinéma"]', false, NOW()),
  ('main_003', 'Emma Petit', '8 ans', 'enfants', 'https://via.placeholder.com/400x300/cccccc/666666?text=Emma+Petit', 'Jeune actrice', '2 ans', '["théâtre"]', false, NOW()),
  
  -- Portfolio secret - is_secret = true
  ('secret_001', 'Sophie Secret', '28 ans', 'jeunes', 'https://via.placeholder.com/400x300/ffcccc/666666?text=Sophie+Secret', 'Actrice secrète', '5 ans', '["cinéma", "séries TV"]', true, NOW()),
  ('secret_002', 'Pierre Secret', '42 ans', 'seniors', 'https://via.placeholder.com/400x300/ffcccc/666666?text=Pierre+Secret', 'Acteur secret', '15 ans', '["théâtre", "cinéma"]', true, NOW()),
  ('secret_003', 'Lucas Secret', '12 ans', 'enfants', 'https://via.placeholder.com/400x300/ffcccc/666666?text=Lucas+Secret', 'Jeune talent secret', '3 ans', '["cinéma"]', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Vérifier la séparation
SELECT '=== VÉRIFICATION DU SYSTÈME ===' as info;

SELECT 'Clés d''accès créées:' as info;
SELECT id, name, key, is_active FROM access_keys;

SELECT 'Portfolio Principal (public):' as info;
SELECT id, name, category, is_secret FROM portfolio_items WHERE is_secret = false ORDER BY name;

SELECT 'Portfolio Secret:' as info;
SELECT id, name, category, is_secret FROM portfolio_items WHERE is_secret = true ORDER BY name;

SELECT '=== TEST DES REQUÊTES API ===' as info;

-- Simuler l'API portfolio principal
SELECT 'API /api/portfolio (portfolio principal):' as endpoint;
SELECT id, name, category, is_secret FROM portfolio_items WHERE is_secret = false ORDER BY created_at DESC;

-- Simuler l'API portfolio secret
SELECT 'API /api/portfolio?secret=true (portfolio secret):' as endpoint;
SELECT id, name, category, is_secret FROM portfolio_items WHERE is_secret = true ORDER BY created_at DESC;

-- 5. Vérifier la clé d'accès
SELECT '=== TEST DE LA CLÉ D''ACCÈS ===' as info;
SELECT 
  CASE 
    WHEN key = 'ck_test_2024' AND is_active = true THEN '✅ Clé valide et active'
    ELSE '❌ Clé invalide ou inactive'
  END as status,
  key,
  is_active
FROM access_keys WHERE key = 'ck_test_2024';
