# Test du Système Admin - Castings et Témoignages

## Objectif
Tester la création, modification et suppression de castings et témoignages depuis l'espace admin via la base de données.

## Prérequis
1. Base de données PostgreSQL en cours d'exécution
2. Application Next.js démarrée
3. Accès admin (mot de passe: ADMIN2024)

## Étapes de Test

### 1. Préparation de la Base de Données
```bash
# Démarrer la base de données
docker-compose up -d postgres

# Attendre que la base soit prête, puis exécuter le script de test
docker exec -i castpro_postgres psql -U castpro_user -d castpro_db < scripts/create-test-castings-testimonials.sql
```

### 2. Test de l'Interface Admin

#### A. Connexion Admin
1. Aller sur http://localhost:3000/login
2. Entrer le mot de passe: `ADMIN2024`
3. Vérifier que la connexion fonctionne

#### B. Test des Castings
1. Cliquer sur l'onglet "Castings"
2. Vérifier que les 3 castings de test sont affichés
3. Tester la création d'un nouveau casting:
   - Cliquer sur "Créer un casting"
   - Remplir le formulaire
   - Sauvegarder
   - Vérifier que le casting apparaît dans la liste
4. Tester la modification d'un casting existant:
   - Cliquer sur l'icône d'édition
   - Modifier les champs
   - Sauvegarder
   - Vérifier que les modifications sont appliquées
5. Tester la suppression d'un casting:
   - Cliquer sur l'icône de suppression
   - Vérifier que le casting disparaît de la liste

#### C. Test des Témoignages
1. Cliquer sur l'onglet "Témoignages"
2. Vérifier que les 3 témoignages de test sont affichés
3. Tester la création d'un nouveau témoignage:
   - Cliquer sur "Créer un témoignage"
   - Remplir le formulaire
   - Sauvegarder
   - Vérifier que le témoignage apparaît dans la liste
4. Tester la modification d'un témoignage existant:
   - Cliquer sur l'icône d'édition
   - Modifier les champs
   - Sauvegarder
   - Vérifier que les modifications sont appliquées
5. Tester la suppression d'un témoignage:
   - Cliquer sur l'icône de suppression
   - Vérifier que le témoignage disparaît de la liste

### 3. Vérification de la Base de Données

#### A. Vérifier les Castings
```sql
-- Se connecter à la base de données
docker exec -it castpro_postgres psql -U castpro_user -d castpro_db

-- Lister tous les castings
SELECT id, title, status, location, date FROM castings ORDER BY created_at DESC;

-- Vérifier qu'un casting créé via l'admin est bien en base
SELECT * FROM castings WHERE title LIKE 'Nouveau Casting%';
```

#### B. Vérifier les Témoignages
```sql
-- Lister tous les témoignages
SELECT id, name, role, rating FROM testimonials ORDER BY created_at DESC;

-- Vérifier qu'un témoignage créé via l'admin est bien en base
SELECT * FROM testimonials WHERE name LIKE 'Nouveau Témoignage%';
```

### 4. Test des API

#### A. Test API Castings
```bash
# Lister les castings
curl http://localhost:3000/api/castings

# Créer un casting
curl -X POST http://localhost:3000/api/castings \
  -H "Content-Type: application/json" \
  -d '{"title":"Test API","description":"Test via API","location":"Paris","date":"2024-04-01","budget":"1000€","status":"open"}'

# Supprimer un casting
curl -X DELETE "http://localhost:3000/api/castings?id=casting_test_001"
```

#### B. Test API Témoignages
```bash
# Lister les témoignages
curl http://localhost:3000/api/testimonials

# Créer un témoignage
curl -X POST http://localhost:3000/api/testimonials \
  -H "Content-Type: application/json" \
  -d '{"name":"Test API","role":"Testeur","content":"Test via API","rating":5,"image":"/test.jpg"}'

# Supprimer un témoignage
curl -X DELETE "http://localhost:3000/api/testimonials?id=testimonial_test_001"
```

## Résultats Attendus

### ✅ Fonctionnalités qui doivent fonctionner
1. **Création** de castings et témoignages depuis l'admin
2. **Modification** des éléments existants
3. **Suppression** des éléments
4. **Persistance** en base de données
5. **Synchronisation** entre l'interface et la base

### ❌ Ancien comportement (localStorage) qui ne doit plus fonctionner
1. Les données ne doivent plus être stockées dans le navigateur
2. Les données doivent persister après redémarrage de l'application
3. Les données doivent être partagées entre tous les utilisateurs admin

## Dépannage

### Problème: Erreur 500 lors de la création
- Vérifier que la base de données est accessible
- Vérifier les logs de l'application
- Vérifier que les tables existent

### Problème: Données non persistées
- Vérifier que les fonctions de base de données sont correctes
- Vérifier que les API retournent des succès
- Vérifier que `loadCastings()` et `loadTestimonials()` sont appelés après sauvegarde

### Problème: Interface non mise à jour
- Vérifier que les états React sont correctement mis à jour
- Vérifier que les fonctions de rechargement sont appelées
- Vérifier la console du navigateur pour les erreurs JavaScript

## Conclusion
Le système admin doit maintenant gérer les castings et témoignages via la base de données PostgreSQL au lieu du localStorage, permettant une gestion centralisée et persistante des données.
