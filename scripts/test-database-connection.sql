-- Script de test de la connexion à la base de données
-- Exécuter ce script pour vérifier que tout fonctionne

-- 1. Vérifier que la table castings existe et sa structure
\d castings;

-- 2. Vérifier que la table testimonials existe et sa structure  
\d testimonials;

-- 3. Tester une insertion simple dans castings
INSERT INTO castings (id, title, description, requirements, location, date, budget, status) 
VALUES (
  'test_connection_001',
  'Test de Connexion',
  'Test simple pour vérifier la base de données',
  'Aucune exigence particulière',
  'Paris',
  '2024-01-01',
  '1000€',
  'open'
);

-- 4. Vérifier que l'insertion a fonctionné
SELECT * FROM castings WHERE id = 'test_connection_001';

-- 5. Nettoyer le test
DELETE FROM castings WHERE id = 'test_connection_001';

-- 6. Afficher le nombre total de castings
SELECT COUNT(*) as total_castings FROM castings;

-- 7. Afficher le nombre total de témoignages
SELECT COUNT(*) as total_testimonials FROM testimonials;
