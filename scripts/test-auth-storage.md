# Test de l'Authentification dans SessionStorage

## 🎯 Objectif
Vérifier que l'authentification est bien sauvegardée dans `sessionStorage` avant la redirection vers le portfolio secret.

## 🚀 Test de l'Authentification

### 1. Test de la Sauvegarde
1. **Aller sur la page principale** (`/`)
2. **Ouvrir la console** du navigateur (F12)
3. **Aller dans l'onglet Application** (ou Storage)
4. **Regarder dans Session Storage** pour `localhost:3000`
5. **Saisir une clé valide** et cliquer sur "Accéder au Portfolio Secret"
6. **Vérifier dans la console** le message "Authentification sauvegardée dans sessionStorage"
7. **Vérifier dans Session Storage** que `access-key-auth` est créé

### 2. Vérification du Contenu
Dans Session Storage, `access-key-auth` devrait contenir :
```json
{
  "id": "key_...",
  "name": "Nom de la clé",
  "permissions": ["portfolio_secret", "read"],
  "expiresAt": "2024-...",
  "timeRemaining": 7,
  "isActive": true
}
```

## 🧪 Test de la Redirection

### 1. Test Complet
1. **Saisir une clé valide** sur la page principale
2. **Observer les logs** dans la console :
   ```
   Clé valide, redirection vers le portfolio secret...
   Router object: [object Object]
   Tentative de redirection...
   Authentification sauvegardée dans sessionStorage
   Tentative de redirection avec router.push...
   Redirection initiée avec succès
   Vérification de l'URL actuelle: /portfolio-secret
   ```
3. **Vérifier que l'URL reste** sur `/portfolio-secret`
4. **Vérifier que la page** ne revient pas à l'accueil

### 2. Test de Persistance
1. **Après la redirection**, vérifier que l'URL reste `/portfolio-secret`
2. **Vérifier que l'interface** du portfolio secret s'affiche
3. **Vérifier que l'authentification** persiste dans sessionStorage

## 🔍 Débogage

### Si l'Authentification n'est Pas Sauvegardée
1. **Vérifier la réponse de l'API** dans la console
2. **Vérifier que `data.accessKey`** existe
3. **Vérifier que `sessionStorage.setItem`** fonctionne

### Si la Redirection Échoue Toujours
1. **Vérifier que l'authentification** est bien dans sessionStorage
2. **Vérifier que la page** `/portfolio-secret` peut lire sessionStorage
3. **Vérifier les logs** de la page portfolio-secret

## 📊 Logs Attendus

### Succès Complet
```
Clé valide, redirection vers le portfolio secret...
Router object: [object Object]
Tentative de redirection...
Authentification sauvegardée dans sessionStorage
Tentative de redirection avec router.push...
Redirection initiée avec succès
Vérification de l'URL actuelle: /portfolio-secret
```

### Dans Session Storage
- `access-key-auth` : JSON avec les données d'authentification

## ✅ Critères de Réussite

- [ ] L'authentification est sauvegardée dans sessionStorage
- [ ] Le message "Authentification sauvegardée" apparaît
- [ ] La redirection vers `/portfolio-secret` fonctionne
- [ ] L'URL reste sur `/portfolio-secret`
- [ ] La page ne revient pas à l'accueil
- [ ] L'interface du portfolio secret s'affiche

## 🚨 Problèmes Courants

1. **SessionStorage non accessible** : Vérifier les permissions du navigateur
2. **Données manquantes** : Vérifier la réponse de l'API
3. **Redirection annulée** : Vérifier la logique de la page portfolio-secret
4. **Conflit de hooks** : Vérifier que useAccessKeyAuth lit bien sessionStorage
