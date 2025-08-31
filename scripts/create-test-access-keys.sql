-- Script de création de clés d'accès de test avec différents délais d'expiration
-- Exécuter ce script dans la base de données pour tester le système

-- Supprimer les anciennes clés de test si elles existent
DELETE FROM access_keys WHERE name LIKE 'Test%';

-- Clé d'accès de test - 3 jours
INSERT INTO access_keys (id, name, key, permissions, expires_at, is_active, created_at) VALUES (
  'key_test_3days_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Accès 3 jours',
  'ck_test_3days_' || substr(md5(random()::text), 1, 15),
  '["portfolio_secret", "read"]',
  NOW() + INTERVAL '3 days',
  true,
  NOW()
);

-- Clé d'accès de test - 7 jours
INSERT INTO access_keys (id, name, key, permissions, expires_at, is_active, created_at) VALUES (
  'key_test_7days_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Accès 7 jours',
  'ck_test_7days_' || substr(md5(random()::text), 1, 15),
  '["portfolio_secret", "read", "download"]',
  NOW() + INTERVAL '7 days',
  true,
  NOW()
);

-- Clé d'accès de test - 60 jours
INSERT INTO access_keys (id, name, key, permissions, expires_at, is_active, created_at) VALUES (
  'key_test_60days_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Accès 60 jours',
  'ck_test_60days_' || substr(md5(random()::text), 1, 15),
  '["portfolio_secret", "read", "download", "share"]',
  NOW() + INTERVAL '60 days',
  true,
  NOW()
);

-- Clé d'accès permanente (sans expiration)
INSERT INTO access_keys (id, name, key, permissions, expires_at, is_active, created_at) VALUES (
  'key_test_permanent_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Accès permanent',
  'ck_test_permanent_' || substr(md5(random()::text), 1, 15),
  '["portfolio_secret", "read", "download", "share", "admin"]',
  NULL,
  true,
  NOW()
);

-- Afficher les clés créées
SELECT 
  name,
  key,
  permissions,
  expires_at,
  CASE 
    WHEN expires_at IS NULL THEN 'Permanent'
    WHEN expires_at > NOW() THEN 'Valide'
    ELSE 'Expirée'
  END as status,
  created_at
FROM access_keys 
WHERE name LIKE 'Test%'
ORDER BY created_at DESC;

-- Instructions d'utilisation :
-- 1. Copier une des clés générées ci-dessus
-- 2. L'utiliser sur la page principale pour accéder au portfolio secret
-- 3. Vérifier que l'expiration fonctionne correctement
-- 4. Tester avec des clés expirées
