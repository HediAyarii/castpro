# Test du Nouveau Système d'Authentification avec Clés d'Accès

## 🎯 Objectif
Tester le nouveau système d'authentification qui utilise les clés d'accès de la base de données avec gestion des délais d'expiration (3 jours, 7 jours, 60 jours).

## 🚀 Préparation

### 1. Créer les Clés de Test
Exécuter le script SQL `create-test-access-keys.sql` dans la base de données pour créer des clés de test avec différents délais d'expiration.

### 2. Créer les Éléments du Portfolio Secret
Exécuter le script SQL `create-test-portfolio-secret.sql` dans la base de données pour créer des éléments de test dans le portfolio secret.

### 3. Vérifier les Données Créées
```sql
-- Vérifier les clés d'accès
SELECT name, key, expires_at, is_active 
FROM access_keys 
WHERE name LIKE 'Test%'
ORDER BY created_at DESC;

-- Vérifier les éléments du portfolio secret
SELECT name, category, specialties, is_secret
FROM portfolio_items 
WHERE is_secret = true AND name LIKE 'Test%'
ORDER BY created_at DESC;
```

## 🧪 Tests à Effectuer

### Test 1 : Clé d'Accès de 3 Jours
1. **Copier la clé** générée pour "Test - Accès 3 jours"
2. **Aller sur la page principale** (`/`)
3. **Saisir la clé** dans le formulaire d'accès
4. **Cliquer sur "Accéder au Portfolio Secret"**
5. **Vérifier** :
   - Redirection vers `/portfolio-secret`
   - Affichage du nom de la clé
   - Affichage "Expire dans 3 jours"
   - Icône d'alerte jaune

### Test 2 : Clé d'Accès de 7 Jours
1. **Utiliser la clé** "Test - Accès 7 jours"
2. **Vérifier** :
   - Accès au portfolio secret
   - Affichage "Expire dans 1 semaine"
   - Icône d'alerte jaune

### Test 3 : Clé d'Accès de 60 Jours
1. **Utiliser la clé** "Test - Accès 60 jours"
2. **Vérifier** :
   - Accès au portfolio secret
   - Affichage "Expire dans 2 mois"
   - Icône d'alerte verte

### Test 4 : Clé d'Accès Permanente
1. **Utiliser la clé** "Test - Accès permanent"
2. **Vérifier** :
   - Accès au portfolio secret
   - Affichage "Accès permanent"
   - Pas d'icône d'alerte

### Test 5 : Clé Expirée
1. **Modifier une clé** pour qu'elle expire dans le passé :
   ```sql
   UPDATE access_keys 
   SET expires_at = NOW() - INTERVAL '1 day'
   WHERE name = 'Test - Accès 3 jours';
   ```
2. **Essayer d'utiliser la clé** expirée
3. **Vérifier** :
   - Message d'erreur "Clé d'accès invalide ou expirée"
   - Pas d'accès au portfolio secret

### Test 6 : Clé Désactivée
1. **Désactiver une clé** :
   ```sql
   UPDATE access_keys 
   SET is_active = false
   WHERE name = 'Test - Accès 7 jours';
   ```
2. **Essayer d'utiliser la clé** désactivée
3. **Vérifier** :
   - Message d'erreur "Clé d'accès invalide ou expirée"

## 🔍 Vérifications Techniques

### Console du Navigateur
- Aucune erreur JavaScript
- Appels API vers `/api/access-keys/verify`
- Réponses correctes de l'API

### SessionStorage
- Vérifier que `access-key-auth` est créé
- Vérifier que les informations de la clé sont sauvegardées
- Vérifier que l'expiration est gérée

### API de Vérification
- Endpoint `/api/access-keys/verify` fonctionne
- Validation des clés dans la base de données
- Calcul correct du temps restant
- Gestion des erreurs

## 📱 Interface Utilisateur

### Page Principale
- Formulaire de saisie de la clé
- Bouton avec état de chargement
- Affichage des erreurs d'authentification
- Informations de la clé après authentification

### Portfolio Secret
- Header avec informations de la clé
- Affichage du temps restant
- Bouton de déconnexion fonctionnel
- Protection contre l'accès non autorisé
- **Connexion à la base de données** : Récupération des acteurs depuis `portfolio_items` avec `is_secret = true`
- **Images dynamiques** : Affichage des images stockées en base
- **Catégories dynamiques** : Génération automatique des catégories selon les données
- **Gestion des erreurs** : Affichage des erreurs de base avec bouton de retry
- **Actualisation** : Bouton pour recharger les données depuis la base

## 🚨 Cas d'Erreur

### Clé Invalide
- Message : "Clé d'accès invalide ou expirée"
- Formulaire réinitialisé
- Pas de redirection

### Erreur Serveur
- Message : "Erreur de connexion au serveur"
- Bouton désactivé pendant la vérification
- Retry automatique possible

### Session Expirée
- Redirection automatique vers la page principale
- Message : "Votre clé d'accès a expiré"
- SessionStorage nettoyé

## 📊 Métriques de Test

### Performance
- Temps de réponse de l'API < 500ms
- Chargement de la page < 2s
- Transition fluide entre les pages

### Sécurité
- Clés expirées rejetées
- Clés désactivées rejetées
- Session sécurisée
- Pas d'exposition des clés dans l'URL

### UX
- Messages d'erreur clairs
- États de chargement visibles
- Informations de la clé accessibles
- Navigation intuitive

## 🔧 Résolution des Problèmes

### Si l'API ne répond pas
1. Vérifier que le serveur fonctionne
2. Vérifier la connexion à la base de données
3. Vérifier les logs du serveur

### Si l'authentification ne persiste pas
1. Vérifier le sessionStorage
2. Vérifier que la clé est valide
3. Vérifier que l'expiration n'est pas dépassée

### Si les permissions ne fonctionnent pas
1. Vérifier le format JSON des permissions
2. Vérifier que les permissions sont bien définies
3. Vérifier la logique de vérification

## ✅ Critères de Réussite

- [ ] Toutes les clés de test fonctionnent
- [ ] L'expiration est correctement gérée
- [ ] Les clés expirées sont rejetées
- [ ] L'interface affiche les informations de la clé
- [ ] La session persiste pendant la navigation
- [ ] La déconnexion fonctionne correctement
- [ ] Les erreurs sont bien gérées et affichées
- [ ] Les performances sont acceptables
- [ ] Le portfolio secret récupère les données de la base
- [ ] Les images s'affichent correctement depuis la base
- [ ] Le filtrage par catégorie fonctionne dynamiquement
- [ ] La gestion des erreurs de base de données est robuste
