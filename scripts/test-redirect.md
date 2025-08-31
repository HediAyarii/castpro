# Test de Redirection - Portfolio Secret

## 🎯 Objectif
Vérifier que la redirection vers le portfolio secret fonctionne correctement après authentification.

## 🚀 Test de l'API

### 1. Vérifier que l'API Fonctionne
```bash
# Test avec curl (remplacer YOUR_KEY par une vraie clé)
curl -X POST http://localhost:3000/api/access-keys/verify \
  -H "Content-Type: application/json" \
  -d '{"key": "YOUR_KEY"}'
```

### 2. Créer une Clé de Test
```sql
-- Créer une clé de test valide
INSERT INTO access_keys (id, name, key, permissions, expires_at, is_active, created_at) VALUES (
  'key_test_redirect_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test Redirection',
  'ck_test_redirect_123456',
  '["portfolio_secret", "read"]',
  NOW() + INTERVAL '7 days',
  true,
  NOW()
);

-- Vérifier que la clé est créée
SELECT * FROM access_keys WHERE name = 'Test Redirection';
```

## 🧪 Test de l'Interface

### 1. Test de la Page Principale
1. **Aller sur la page principale** (`/`)
2. **Ouvrir la console** du navigateur (F12)
3. **Saisir la clé de test** : `ck_test_redirect_123456`
4. **Cliquer sur "Accéder au Portfolio Secret"**
5. **Vérifier dans la console** :
   - Message "Clé valide, redirection vers le portfolio secret..."
   - Pas d'erreur JavaScript

### 2. Vérifier la Redirection
1. **S'assurer que l'URL change** vers `/portfolio-secret`
2. **Vérifier que la page se charge** sans erreur
3. **Vérifier que l'interface** du portfolio secret s'affiche

## 🔍 Débogage

### Si la Redirection ne Fonctionne pas

1. **Vérifier la console** pour les erreurs
2. **Vérifier que l'API répond** correctement
3. **Vérifier que la clé est valide** dans la base
4. **Vérifier que le router Next.js** fonctionne

### Logs à Vérifier

```javascript
// Dans la console du navigateur
console.log("Clé valide, redirection vers le portfolio secret...")
// Devrait apparaître après avoir saisi une clé valide
```

## ✅ Critères de Réussite

- [ ] L'API `/api/access-keys/verify` répond correctement
- [ ] La clé de test est créée dans la base
- [ ] Le message de console apparaît
- [ ] La redirection vers `/portfolio-secret` fonctionne
- [ ] Le portfolio secret se charge sans erreur

## 🚨 Problèmes Courants

1. **Clé invalide** : Vérifier que la clé existe dans la base
2. **API en erreur** : Vérifier les logs du serveur
3. **Router Next.js** : Vérifier que la navigation fonctionne
4. **Base de données** : Vérifier la connexion et les données
