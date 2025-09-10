-- Create test access key for portfolio secret
-- This script runs after the database schema is created

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
