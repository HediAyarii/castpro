-- Test simple du système de portfolio
-- 1. Créer une clé d'accès de test
INSERT INTO access_keys (id, name, key, permissions, created_at, expires_at, is_active)
VALUES (
  'test_key_001',
  'Clé de test',
  'ck_test_2024',
  '["portfolio_secret"]',
  NOW(),
  NULL,
  true
) ON CONFLICT (key) DO NOTHING;

-- 2. Créer des éléments de test avec des images externes
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at)
VALUES 
  -- Portfolio principal (public)
  ('main_001', 'Marie Dubois', '25 ans', 'jeunes', 'https://via.placeholder.com/400x300/cccccc/666666?text=Marie+Dubois', 'Actrice talentueuse', '3 ans', '["théâtre", "cinéma"]', false, NOW()),
  ('main_002', 'Jean Martin', '35 ans', 'seniors', 'https://via.placeholder.com/400x300/cccccc/666666?text=Jean+Martin', 'Acteur expérimenté', '10 ans', '["théâtre", "cinéma"]', false, NOW()),
  
  -- Portfolio secret
  ('secret_001', 'Sophie Secret', '28 ans', 'jeunes', 'https://via.placeholder.com/400x300/ffcccc/666666?text=Sophie+Secret', 'Actrice secrète', '5 ans', '["cinéma", "séries TV"]', true, NOW()),
  ('secret_002', 'Pierre Secret', '42 ans', 'seniors', 'https://via.placeholder.com/400x300/ffcccc/666666?text=Pierre+Secret', 'Acteur secret', '15 ans', '["théâtre", "cinéma"]', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Vérifier ce qui a été créé
SELECT 'Clés d''accès' as type, COUNT(*) as count FROM access_keys
UNION ALL
SELECT 'Portfolio Principal' as type, COUNT(*) as count FROM portfolio_items WHERE is_secret = false
UNION ALL
SELECT 'Portfolio Secret' as type, COUNT(*) as count FROM portfolio_items WHERE is_secret = true;

-- 4. Voir les détails
SELECT id, name, category, is_secret, image FROM portfolio_items ORDER BY is_secret, name;
