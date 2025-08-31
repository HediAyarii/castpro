# TEST SIMPLE - Portfolio Secret vs Principal

## 🎯 OBJECTIF
Vérifier que :
1. ✅ Portfolio principal affiche des images
2. ✅ Portfolio secret est séparé et affiche des images  
3. ✅ Clé d'accès ouvre le portfolio secret

## 🚀 ÉTAPES DE TEST

### Étape 1: Exécuter le Script SQL
```sql
-- Copier et exécuter dans votre base PostgreSQL
-- Fichier: scripts/test-complete-system.sql
```

### Étape 2: Tester l'Interface Admin
1. Aller sur `/login`
2. Se connecter avec le mot de passe admin
3. Aller dans l'onglet "Portfolio"
4. **Vérifier Portfolio Principal** : doit afficher 3 éléments avec images
5. **Basculer vers Portfolio Secret** : doit afficher 3 éléments avec images
6. **Vérifier la séparation** : les éléments ne doivent pas se mélanger

### Étape 3: Tester l'Interface Publique
1. Aller sur `/portfolio`
2. **Vérifier Portfolio Principal** : doit afficher 3 éléments
3. **Cliquer sur "Clé d'Accès"**
4. **Entrer la clé** : `ck_test_2024`
5. **Vérifier Portfolio Secret** : doit afficher 3 éléments supplémentaires

## 🔑 CLÉ DE TEST
```
ck_test_2024
```

## 📊 RÉSULTATS ATTENDUS

### Interface Admin
- **Portfolio Principal** : 3 éléments (Marie, Jean, Emma)
- **Portfolio Secret** : 3 éléments (Sophie, Pierre, Lucas)
- **Séparation** : Aucun mélange entre les deux

### Interface Publique
- **Sans clé** : 3 éléments (Marie, Jean, Emma)
- **Avec clé** : 6 éléments (3 + 3 secrets)

## ❌ SI ÇA NE MARCHE PAS

### Problème 1: Images ne s'affichent pas
- Vérifier que les URLs d'images sont accessibles
- Tester: https://via.placeholder.com/400x300/cccccc/666666?text=Test

### Problème 2: Portfolios mélangés
- Vérifier la base de données: `SELECT * FROM portfolio_items WHERE is_secret = true;`
- Vérifier l'API: `/api/portfolio?secret=true`

### Problème 3: Clé ne fonctionne pas
- Vérifier la base: `SELECT * FROM access_keys WHERE key = 'ck_test_2024';`
- Vérifier l'API: `/api/access-keys/verify`

## 🐛 DÉBOGAGE

### Console du Navigateur
```javascript
// Dans l'interface admin
console.log('Portfolio principal:', portfolioItems);
console.log('Portfolio secret:', secretPortfolio);

// Dans l'interface publique  
console.log('Talents:', talents);
console.log('Secret talents:', secretTalents);
```

### Vérifier les Requêtes API
1. Onglet Network dans les DevTools
2. Vérifier `/api/portfolio` (portfolio principal)
3. Vérifier `/api/portfolio?secret=true` (portfolio secret)
4. Vérifier `/api/access-keys/verify` (vérification clé)

## ✅ SUCCÈS
Si tout fonctionne :
- Portfolio principal : 3 éléments visibles
- Portfolio secret : 3 éléments visibles avec clé
- Images s'affichent correctement
- Séparation parfaite entre les deux portfolios
