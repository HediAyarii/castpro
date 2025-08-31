-- Script de création de données de test pour les castings et témoignages
-- Exécuter ce script dans la base de données pour tester le système admin

-- Supprimer les anciennes données de test si elles existent
DELETE FROM castings WHERE title LIKE 'Test%';
DELETE FROM testimonials WHERE name LIKE 'Test%';

-- Créer des castings de test
INSERT INTO castings (id, title, description, requirements, location, date, budget, status, created_at) VALUES 
  ('casting_test_001', 'Test - Casting Film Drame', 'Casting pour un film dramatique sur la vie urbaine', 'Acteurs 25-35 ans, expérience en théâtre ou cinéma', 'Paris, France', '2024-03-15', 'Budget: 2000€/jour', 'open', NOW()),
  ('casting_test_002', 'Test - Casting Série TV Comédie', 'Casting pour une série comique diffusée sur une chaîne nationale', 'Acteurs comiques, tous âges, expérience en improvisation', 'Lyon, France', '2024-04-20', 'Budget: 1500€/jour', 'open', NOW()),
  ('casting_test_003', 'Test - Casting Publicité Mode', 'Casting pour une campagne publicitaire de mode', 'Modèles 18-30 ans, look moderne et élégant', 'Marseille, France', '2024-03-30', 'Budget: 800€/jour', 'closed', NOW());

-- Créer des témoignages de test
INSERT INTO testimonials (id, name, role, content, rating, image, created_at) VALUES 
  ('testimonial_test_001', 'Test - Marie Dubois', 'Réalisatrice', 'CastPro nous a aidés à trouver les talents parfaits pour notre dernière production. Service exceptionnel et professionnel !', 5, 'https://via.placeholder.com/100x100/cccccc/666666?text=Marie', NOW()),
  ('testimonial_test_002', 'Test - Jean Martin', 'Producteur', 'Une équipe professionnelle qui comprend parfaitement nos besoins. Recommandé sans hésitation pour tous les projets.', 5, 'https://via.placeholder.com/100x100/cccccc/666666?text=Jean', NOW()),
  ('testimonial_test_003', 'Test - Sophie Laurent', 'Directrice de Casting', 'CastPro a révolutionné notre façon de recruter des talents. La qualité des profils est exceptionnelle.', 5, 'https://via.placeholder.com/100x100/cccccc/666666?text=Sophie', NOW());

-- Vérifier les données créées
SELECT 'Castings' as type, COUNT(*) as count FROM castings WHERE title LIKE 'Test%'
UNION ALL
SELECT 'Témoignages' as type, COUNT(*) as count FROM testimonials WHERE name LIKE 'Test%';

-- Afficher les castings de test
SELECT id, title, status, location, date FROM castings WHERE title LIKE 'Test%' ORDER BY created_at;

-- Afficher les témoignages de test
SELECT id, name, role, rating FROM testimonials WHERE name LIKE 'Test%' ORDER BY created_at;
