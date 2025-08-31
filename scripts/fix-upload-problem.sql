-- Script pour corriger le problème d'upload des images
-- Exécuter ce script dans votre base PostgreSQL

-- 1. Voir l'état actuel des images
SELECT '=== ÉTAT ACTUEL DES IMAGES ===' as info;

SELECT 
  id,
  name,
  category,
  image,
  is_secret,
  CASE 
    WHEN image IS NULL THEN '❌ AUCUNE IMAGE'
    WHEN image = '' THEN '❌ IMAGE VIDE'
    WHEN image LIKE 'http%' THEN '✅ IMAGE EXTERNE'
    WHEN image LIKE '/uploads/%' THEN '✅ IMAGE LOCALE'
    ELSE '❓ FORMAT INCONNU: ' || image
  END as status_image
FROM portfolio_items 
ORDER BY is_secret, name;

-- 2. Créer des éléments de test avec des images qui fonctionnent
SELECT '=== CRÉATION D\'ÉLÉMENTS DE TEST ===' as info;

-- Supprimer les éléments existants pour recommencer proprement
DELETE FROM portfolio_items WHERE id LIKE 'main_%' OR id LIKE 'secret_%';

-- Créer des éléments avec des images externes qui fonctionnent
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at)
VALUES 
  -- Portfolio principal (public) - Images externes qui fonctionnent
  ('main_001', 'Marie Dubois', '25 ans', 'jeunes', 'https://picsum.photos/400/300?random=1', 'Actrice talentueuse', '3 ans', '["théâtre", "cinéma"]', false, NOW()),
  ('main_002', 'Jean Martin', '35 ans', 'seniors', 'https://picsum.photos/400/300?random=2', 'Acteur expérimenté', '10 ans', '["théâtre", "cinéma"]', false, NOW()),
  ('main_003', 'Emma Petit', '8 ans', 'enfants', 'https://picsum.photos/400/300?random=3', 'Jeune actrice', '2 ans', '["théâtre"]', false, NOW()),
  
  -- Portfolio secret - Images externes qui fonctionnent
  ('secret_001', 'Sophie Secret', '28 ans', 'jeunes', 'https://picsum.photos/400/300?random=4', 'Actrice secrète', '5 ans', '["cinéma", "séries TV"]', true, NOW()),
  ('secret_002', 'Pierre Secret', '42 ans', 'seniors', 'https://picsum.photos/400/300?random=5', 'Acteur secret', '15 ans', '["théâtre", "cinéma"]', true, NOW()),
  ('secret_003', 'Lucas Secret', '12 ans', 'enfants', 'https://picsum.photos/400/300?random=6', 'Jeune talent secret', '3 ans', '["cinéma"]', true, NOW());

-- 3. Créer la clé d'accès de test
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

-- 4. Vérifier le résultat
SELECT '=== RÉSULTAT FINAL ===' as info;
SELECT 
  'Portfolio Principal' as type, COUNT(*) as count 
FROM portfolio_items 
WHERE is_secret = false
UNION ALL
SELECT 
  'Portfolio Secret' as type, COUNT(*) as count 
FROM portfolio_items 
WHERE is_secret = true;

-- 5. Voir les détails des nouveaux éléments
SELECT '=== DÉTAILS DES NOUVEAUX ÉLÉMENTS ===' as info;
SELECT 
  id, 
  name, 
  category, 
  is_secret, 
  CASE 
    WHEN image LIKE 'https://picsum.photos%' THEN '✅ IMAGE PICSUM'
    ELSE '❓ AUTRE: ' || image
  END as status_image
FROM portfolio_items 
ORDER BY is_secret, name;
