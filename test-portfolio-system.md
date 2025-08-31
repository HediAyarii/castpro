# Test du Système de Portfolio Secret

## Étapes de Test

### 1. Test de la Base de Données
```sql
-- Exécuter dans votre base de données PostgreSQL
-- Créer la clé de test
INSERT INTO access_keys (id, name, key, permissions, created_at, expires_at, is_active)
VALUES (
  'test_key_001',
  'Clé de test - Portfolio Secret',
  'ck_test_portfolio_secret_2024',
  '["portfolio_secret"]',
  NOW(),
  NULL,
  true
);

-- Créer des éléments de test
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at)
VALUES 
  ('portfolio_main_001', 'Marie Dubois', '25 ans', 'jeunes', '/uploads/test_main_001.jpg', 'Actrice talentueuse', '3 ans', '["théâtre", "cinéma"]', false, NOW()),
  ('portfolio_secret_001', 'Sophie Secret', '28 ans', 'jeunes', '/uploads/test_secret_001.jpg', 'Actrice secrète', '5 ans', '["cinéma", "séries TV"]', true, NOW());
```

### 2. Test de l'Interface Admin
1. Aller sur `/login`
2. Se connecter avec le mot de passe admin
3. Aller dans l'onglet "Portfolio"
4. Tester la création d'éléments dans les deux onglets (Principal et Secret)
5. Vérifier que les éléments sont correctement séparés

### 3. Test de l'Interface Publique
1. Aller sur `/portfolio`
2. Vérifier que seuls les éléments publics sont visibles
3. Cliquer sur "Clé d'Accès"
4. Entrer la clé de test : `ck_test_portfolio_secret_2024`
5. Vérifier que les éléments secrets apparaissent

### 4. Test des Images
1. Uploader une image via l'interface admin
2. Vérifier qu'elle s'affiche correctement
3. Vérifier le fallback vers placeholder si l'image ne charge pas

## Résultats Attendus

### ✅ Portfolio Principal
- Visible par tous les visiteurs
- Images s'affichent correctement
- Compteurs de catégories fonctionnent

### ✅ Portfolio Secret
- Visible uniquement avec clé d'accès
- Séparé du portfolio principal
- Badge "Secret" visible sur les éléments

### ✅ Système de Clés
- Clé de test fonctionne
- Accès persiste entre les sessions
- Séparation stricte des contenus

### ✅ Gestion des Images
- Upload fonctionne
- Affichage correct
- Fallback vers placeholder

## Clé de Test
```
ck_test_portfolio_secret_2024
```

## Dépannage

### Si les images ne s'affichent pas
1. Vérifier que le dossier `/public/uploads/` existe
2. Vérifier les permissions
3. Vérifier que l'image a été uploadée

### Si la clé ne fonctionne pas
1. Vérifier que la clé est dans la base de données
2. Vérifier qu'elle est active
3. Vérifier les logs du serveur

### Si le portfolio secret ne se charge pas
1. Vérifier la requête API `/api/portfolio?secret=true`
2. Vérifier que les éléments ont `is_secret=true`
3. Vérifier la réponse de l'API
