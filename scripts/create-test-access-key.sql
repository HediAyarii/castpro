-- Script pour créer une clé d'accès de test
-- Cette clé permettra d'accéder au portfolio secret

INSERT INTO access_keys (id, name, key, permissions, created_at, expires_at, is_active)
VALUES (
  'test_key_001',
  'Clé de test - Portfolio Secret',
  'ck_test_portfolio_secret_2024',
  '["portfolio_secret"]',
  NOW(),
  NULL, -- Pas d'expiration
  true
) ON CONFLICT (key) DO NOTHING;

-- Vérifier que la clé a été créée
SELECT * FROM access_keys WHERE key = 'ck_test_portfolio_secret_2024';
