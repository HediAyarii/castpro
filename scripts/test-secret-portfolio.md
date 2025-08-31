# Test du Portfolio Secret

## Étapes de Test

### 1. Test de la Page Principale
1. Ouvrir la page principale (`/`)
2. Vérifier que la section "Portfolio Secret - Accès Exclusif" est visible
3. Vérifier que le formulaire de saisie du code est présent

### 2. Test avec Code Incorrect
1. Saisir un code incorrect (ex: "test123")
2. Cliquer sur "Accéder au Portfolio Secret"
3. Vérifier que l'erreur "Code incorrect. Veuillez réessayer." s'affiche

### 3. Test avec Code Secret Valide
1. Saisir le code secret : `ck_zozswr9avalmps6pvo5s0s`
2. Cliquer sur "Accéder au Portfolio Secret"
3. Vérifier la redirection vers `/portfolio-secret`

### 4. Test de la Page Portfolio Secret
1. Vérifier que la page se charge correctement
2. Vérifier que le header affiche "Portfolio Secret - Collection Exclusive"
3. Vérifier que les acteurs sont affichés avec leurs informations
4. Tester les fonctionnalités (favoris, partage, etc.)

### 5. Test de la Déconnexion
1. Cliquer sur le bouton "Déconnexion"
2. Vérifier la redirection vers la page principale
3. Essayer d'accéder directement à `/portfolio-secret`
4. Vérifier que la page de connexion s'affiche

### 6. Test avec Code Standard
1. Retourner à la page principale
2. Saisir le code standard : `CASTPRO2024`
3. Vérifier la redirection vers `/portfolio-acteurs`

## Codes de Test

### Portfolio Secret (Niveau Élite)
- **Code** : `ck_zozswr9avalmps6pvo5s0s`
- **Route** : `/portfolio-secret`
- **Contenu** : Acteurs de haut niveau avec récompenses

### Portfolio Acteurs (Niveau Standard)
- **Code** : `CASTPRO2024`
- **Route** : `/portfolio-acteurs`
- **Contenu** : Acteurs professionnels standard

## Vérifications Techniques

### Console du Navigateur
- Aucune erreur JavaScript
- Redirections correctes
- SessionStorage correctement configuré

### Routes
- `/` → Page principale avec formulaire
- `/portfolio-secret` → Portfolio secret protégé
- `/portfolio-acteurs` → Portfolio standard protégé

### Authentification
- `secret-portfolio-auth` dans sessionStorage
- `actors-portfolio-auth` dans sessionStorage
- Protection persistante pendant la navigation

## Résolution des Problèmes

### Si la redirection ne fonctionne pas
1. Vérifier que `router.push()` est bien appelé
2. Vérifier que les routes sont correctement configurées
3. Vérifier la console pour les erreurs

### Si l'authentification ne persiste pas
1. Vérifier que sessionStorage est utilisé
2. Vérifier que les clés sont correctes
3. Vérifier que le composant AuthGuard fonctionne

### Si les images ne s'affichent pas
1. Vérifier les URLs des images
2. Vérifier que les images sont accessibles
3. Vérifier les fallbacks vers placeholder.svg
