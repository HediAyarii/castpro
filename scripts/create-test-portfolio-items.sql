-- Script pour créer des éléments de test dans le portfolio secret
-- Ces éléments seront visibles uniquement avec la clé d'accès

-- Portfolio principal (public)
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at)
VALUES 
  ('portfolio_main_001', 'Marie Dubois', '25 ans', 'jeunes', '/uploads/portfolio_main_jeunes_001.jpg', 'Actrice talentueuse avec 3 ans d''expérience', '3 ans', '["théâtre", "cinéma", "publicité"]', false, NOW()),
  ('portfolio_main_002', 'Jean Martin', '35 ans', 'seniors', '/uploads/portfolio_main_seniors_001.jpg', 'Acteur expérimenté spécialisé dans les rôles dramatiques', '10 ans', '["théâtre", "cinéma", "télévision"]', false, NOW()),
  ('portfolio_main_003', 'Emma Petit', '8 ans', 'enfants', '/uploads/portfolio_main_enfants_001.jpg', 'Jeune actrice prometteuse', '2 ans', '["théâtre", "publicité"]', false, NOW())
ON CONFLICT (id) DO NOTHING;

-- Portfolio secret
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at)
VALUES 
  ('portfolio_secret_001', 'Sophie Secret', '28 ans', 'jeunes', '/uploads/portfolio_secret_jeunes_001.jpg', 'Actrice de talent en exclusivité', '5 ans', '["cinéma", "séries TV", "voix off"]', true, NOW()),
  ('portfolio_secret_002', 'Pierre Secret', '42 ans', 'seniors', '/uploads/portfolio_secret_seniors_001.jpg', 'Acteur de caractère expérimenté', '15 ans', '["théâtre", "cinéma", "doublage"]', true, NOW()),
  ('portfolio_secret_003', 'Lucas Secret', '12 ans', 'enfants', '/uploads/portfolio_secret_enfants_001.jpg', 'Jeune talent prometteur', '3 ans', '["cinéma", "publicité", "modélisme"]', true, NOW())
ON CONFLICT (id) DO NOTHING;

-- Vérifier les éléments créés
SELECT 'Portfolio Principal' as type, COUNT(*) as count FROM portfolio_items WHERE is_secret = false
UNION ALL
SELECT 'Portfolio Secret' as type, COUNT(*) as count FROM portfolio_items WHERE is_secret = true;
