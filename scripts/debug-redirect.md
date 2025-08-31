# Débogage de la Redirection - Portfolio Secret

## 🎯 Objectif
Identifier et résoudre le problème de redirection qui rafraîchit la page au lieu de rediriger.

## 🔍 Diagnostic Étape par Étape

### 1. Vérifier les Logs de la Console
Après avoir saisi une clé valide, vous devriez voir dans la console :

```javascript
Clé valide, redirection vers le portfolio secret...
Router object: [object Object]
Tentative de redirection...
Tentative de redirection avec router.push...
Redirection initiée avec succès
```

### 2. Vérifier l'État de l'URL
- **Avant** : L'URL devrait être `/`
- **Après** : L'URL devrait changer vers `/portfolio-secret`

### 3. Vérifier l'API
Testez l'API directement avec curl :

```bash
curl -X POST http://localhost:3000/api/access-keys/verify \
  -H "Content-Type: application/json" \
  -d '{"key": "VOTRE_CLE_DE_TEST"}'
```

## 🚨 Problèmes Possibles

### Problème 1: Router Next.js Dysfonctionnel
**Symptômes** : `router.push()` ne fonctionne pas
**Solution** : Utilisation du fallback `window.location.href`

### Problème 2: Conflit de Navigation
**Symptômes** : La page se rafraîchit au lieu de naviguer
**Solution** : Délai et vérification de l'état de navigation

### Problème 3: API en Erreur
**Symptômes** : Pas de réponse de l'API
**Solution** : Vérifier les logs du serveur

## 🧪 Test de la Solution

### 1. Créer une Clé de Test
```sql
INSERT INTO access_keys (id, name, key, permissions, expires_at, is_active, created_at) VALUES (
  'key_debug_' || EXTRACT(EPOCH FROM NOW())::text,
  'Debug Redirection',
  'ck_debug_123456',
  '["portfolio_secret", "read"]',
  NOW() + INTERVAL '7 days',
  true,
  NOW()
);
```

### 2. Tester la Redirection
1. **Aller sur la page principale** (`/`)
2. **Ouvrir la console** (F12)
3. **Saisir la clé** : `ck_debug_123456`
4. **Cliquer sur "Accéder au Portfolio Secret"`
5. **Observer les logs** dans la console
6. **Vérifier l'URL** après 1-2 secondes

## 📊 Logs Attendus

### Succès
```
Clé valide, redirection vers le portfolio secret...
Router object: [object Object]
Tentative de redirection...
Tentative de redirection avec router.push...
Redirection initiée avec succès
```

### Échec avec Fallback
```
Clé valide, redirection vers le portfolio secret...
Router object: [object Object]
Tentative de redirection...
Tentative de redirection avec router.push...
Redirection initiée avec succès
Redirection échouée, utilisation de window.location...
```

## ✅ Critères de Réussite

- [ ] Les logs s'affichent dans la console
- [ ] L'URL change vers `/portfolio-secret`
- [ ] La page ne se rafraîchit pas
- [ ] Le portfolio secret se charge correctement

## 🔧 Si le Problème Persiste

1. **Vérifier la version de Next.js**
2. **Vérifier que le serveur fonctionne**
3. **Vérifier la base de données**
4. **Tester avec un navigateur différent**
5. **Vérifier les erreurs dans les outils de développement**
