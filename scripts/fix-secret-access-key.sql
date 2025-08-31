-- Script pour corriger et tester la clé d'accès au portfolio secret
-- Exécuter ce script dans votre base PostgreSQL

-- 1. Vérifier l'état actuel des clés d'accès
SELECT '=== ÉTAT ACTUEL DES CLÉS D''ACCÈS ===' as info;

SELECT 
  id,
  name,
  key,
  permissions,
  created_at,
  expires_at,
  is_active,
  CASE 
    WHEN is_active = false THEN '❌ INACTIVE'
    WHEN expires_at IS NOT NULL AND expires_at < NOW() THEN '❌ EXPIRÉE'
    WHEN is_active = true THEN '✅ ACTIVE'
    ELSE '❓ STATUT INCONNU'
  END as status
FROM access_keys 
ORDER BY created_at DESC;

-- 2. Supprimer les anciennes clés et créer une nouvelle clé propre
SELECT '=== NETTOYAGE ET CRÉATION DE NOUVELLE CLÉ ===' as info;

-- Supprimer toutes les anciennes clés
DELETE FROM access_keys;

-- Créer une nouvelle clé d'accès de test
INSERT INTO access_keys (id, name, key, permissions, created_at, expires_at, is_active)
VALUES (
  'secret_portfolio_key_2024',
  'Clé Portfolio Secret CastPro',
  'ck_test_2024',
  '["portfolio_secret"]',
  NOW(),
  NULL,  -- Pas d'expiration
  true   -- Active
);

-- 3. Créer une clé alternative plus simple
INSERT INTO access_keys (id, name, key, permissions, created_at, expires_at, is_active)
VALUES (
  'secret_key_simple',
  'Clé Simple Portfolio Secret',
  'secret123',
  '["portfolio_secret"]',
  NOW(),
  NULL,
  true
);

-- 4. Vérifier que les clés sont bien créées
SELECT '=== NOUVELLES CLÉS CRÉÉES ===' as info;
SELECT 
  id,
  name,
  key,
  permissions,
  is_active,
  'Clé prête à utiliser' as status
FROM access_keys 
WHERE is_active = true;

-- 5. Vérifier qu'il y a des éléments dans le portfolio secret
SELECT '=== PORTFOLIO SECRET - ÉLÉMENTS DISPONIBLES ===' as info;
SELECT 
  COUNT(*) as total_elements_secrets,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Portfolio secret contient des éléments'
    ELSE '❌ Portfolio secret vide - Ajouter des éléments'
  END as status
FROM portfolio_items 
WHERE is_secret = true;

-- 6. Afficher quelques éléments du portfolio secret
SELECT '=== ÉLÉMENTS DU PORTFOLIO SECRET ===' as info;
SELECT 
  id,
  name,
  category,
  CASE 
    WHEN image IS NOT NULL AND image != '' THEN '✅ Image présente'
    ELSE '❌ Pas d''image'
  END as image_status
FROM portfolio_items 
WHERE is_secret = true
LIMIT 5;

-- 7. Instructions pour tester
SELECT '=== INSTRUCTIONS DE TEST ===' as info;
SELECT 
  'Pour tester l''accès au portfolio secret:' as instruction,
  '' as vide1,
  '1. Aller sur la page /portfolio' as step1,
  '2. Cliquer sur l''icône de clé pour ouvrir le modal' as step2,
  '3. Entrer une de ces clés:' as step3,
  '   - ck_test_2024' as key1,
  '   - secret123' as key2,
  '4. Valider la clé' as step4,
  '5. Le portfolio secret devrait s''afficher' as step5;
