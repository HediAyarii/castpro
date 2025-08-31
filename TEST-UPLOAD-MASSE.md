# TEST UPLOAD EN MASSE - Portfolio Secret vs Principal

## 🎯 OBJECTIF
Vérifier que l'upload en masse fonctionne pour :
1. ✅ Portfolio Principal (public)
2. ✅ Portfolio Secret (privé)
3. ✅ Séparation parfaite entre les deux

## 🚀 ÉTAPES DE TEST

### Étape 1: Préparer les Images de Test
1. Créer 3-5 images de test (JPG, PNG)
2. Taille recommandée : 400x300 pixels
3. Noms simples : `test1.jpg`, `test2.jpg`, etc.

### Étape 2: Tester Portfolio Principal
1. Aller sur `/login` (interface admin)
2. Se connecter avec le mot de passe admin
3. Aller dans l'onglet "Portfolio"
4. **Rester sur "Portfolio Principal"**
5. Cliquer sur "Ajouter en masse"
6. Sélectionner la catégorie (ex: "jeunes")
7. Sélectionner 3-5 images
8. Cliquer sur "Upload X fichiers"
9. **Vérifier** : Les images apparaissent dans Portfolio Principal

### Étape 3: Tester Portfolio Secret
1. **Basculer vers "Portfolio Secret"**
2. Cliquer sur "Ajouter en masse"
3. Sélectionner la catégorie (ex: "seniors")
4. Sélectionner 3-5 images différentes
5. Cliquer sur "Upload X fichiers"
6. **Vérifier** : Les images apparaissent dans Portfolio Secret

### Étape 4: Vérifier la Séparation
1. **Retourner sur "Portfolio Principal"**
2. **Vérifier** : Seules les images du portfolio principal sont visibles
3. **Basculer sur "Portfolio Secret"**
4. **Vérifier** : Seules les images du portfolio secret sont visibles
5. **Aucun mélange** entre les deux portfolios

## 🔑 CLÉ DE TEST
```
ck_test_2024
```

## 📊 RÉSULTATS ATTENDUS

### Portfolio Principal
- Images uploadées en masse visibles
- Catégorie correcte assignée
- `is_secret = false` dans la base

### Portfolio Secret
- Images uploadées en masse visibles
- Catégorie correcte assignée
- `is_secret = true` dans la base

### Séparation
- Aucun élément du portfolio secret dans le principal
- Aucun élément du portfolio principal dans le secret

## ❌ SI ÇA NE MARCHE PAS

### Problème 1: Erreur SQL
- Vérifier la structure de la base de données
- Exécuter le script `scripts/fix-database-issues.sql`

### Problème 2: Images ne s'uploadent pas
- Vérifier que le dossier `public/uploads/` existe
- Vérifier les permissions du dossier
- Vérifier la console du navigateur

### Problème 3: Portfolios mélangés
- Vérifier la base : `SELECT * FROM portfolio_items WHERE is_secret = true;`
- Vérifier l'API : `/api/portfolio?secret=true`

## 🐛 DÉBOGAGE

### Console du Navigateur
```javascript
// Dans l'interface admin
console.log('Portfolio principal:', portfolioItems);
console.log('Portfolio secret:', secretPortfolio);
```

### Vérifier les Requêtes API
1. Onglet Network dans les DevTools
2. Vérifier `/api/upload-bulk` (upload des images)
3. Vérifier `/api/portfolio` (portfolio principal)
4. Vérifier `/api/portfolio?secret=true` (portfolio secret)

### Vérifier la Base de Données
```sql
-- Vérifier la séparation
SELECT 'Portfolio Principal' as type, COUNT(*) as count FROM portfolio_items WHERE is_secret = false
UNION ALL
SELECT 'Portfolio Secret' as type, COUNT(*) as count FROM portfolio_items WHERE is_secret = true;

-- Voir les détails
SELECT id, name, category, is_secret, image FROM portfolio_items ORDER BY is_secret, created_at DESC;
```

## ✅ SUCCÈS
Si tout fonctionne :
- Upload en masse fonctionne pour les deux portfolios
- Images s'affichent correctement
- Séparation parfaite entre portfolio principal et secret
- Catégories correctement assignées
- Base de données cohérente

## 🎯 POINTS DE VÉRIFICATION

### Interface Admin
- [ ] Portfolio Principal affiche ses images
- [ ] Portfolio Secret affiche ses images
- [ ] Aucun mélange entre les deux
- [ ] Upload en masse fonctionne pour les deux

### Interface Publique
- [ ] Sans clé : seules les images du portfolio principal
- [ ] Avec clé : images du portfolio principal + secret
- [ ] Images s'affichent correctement

### Base de Données
- [ ] `is_secret = false` pour portfolio principal
- [ ] `is_secret = true` pour portfolio secret
- [ ] Catégories correctement assignées
- [ ] Images correctement liées
