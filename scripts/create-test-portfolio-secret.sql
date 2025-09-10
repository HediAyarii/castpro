-- Script de création d'éléments de test pour le portfolio secret
-- Exécuter ce script dans la base de données pour tester le système

-- Supprimer les anciens éléments de test si ils existent
DELETE FROM portfolio_items WHERE name LIKE 'Test%' AND is_secret = true;

-- Élément de test 1 - Acteur Premium
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at) VALUES (
  'portfolio_test_premium_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Léa Dubois',
  25,
  'premium',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cp3.jpg-bDYroREYAoSa4NByuLk5PULtyIWJX2.jpeg',
  'Actrice polyvalente spécialisée dans les rôles complexes et émotionnels. Talent exceptionnel pour les personnages profonds.',
  '6 ans',
  'Cinéma d''Auteur, Drame, Comédie',
  true,
  NOW()
);

-- Élément de test 2 - Acteur Élite
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at) VALUES (
  'portfolio_test_elite_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Marc Antoine',
  32,
  'elite',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cp2.jpg-R9zachVmq4bHRgGeeUkjOAPEB9mo3f.jpeg',
  'Comédien de formation classique, maître de l''art dramatique. Spécialiste du théâtre et du cinéma d''auteur.',
  '10 ans',
  'Théâtre Classique, Cinéma d''Auteur, Drame',
  true,
  NOW()
);

-- Élément de test 3 - Acteur Premium
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at) VALUES (
  'portfolio_test_premium2_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Emma Rousseau',
  28,
  'premium',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cp4.jpg-DI5re0Dg3sWflQwN6AKd0gapxSzsqj.jpeg',
  'Triple talent : chant, danse et jeu d''acteur exceptionnel. Spécialisée dans les comédies musicales et le théâtre.',
  '8 ans',
  'Comédie Musicale, Théâtre, Chant, Danse',
  true,
  NOW()
);

-- Élément de test 4 - Acteur Élite
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at) VALUES (
  'portfolio_test_elite2_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Alexandre Moreau',
  35,
  'elite',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cp3.jpg-bDYroREYAoSa4NByuLk5PULtyIWJX2.jpeg',
  'Acteur de caractère reconnu pour ses performances intenses. Spécialiste des rôles antagonistes et des personnages complexes.',
  '12 ans',
  'Drame, Thriller, Rôles de Caractère',
  true,
  NOW()
);

-- Élément de test 5 - Acteur Premium
INSERT INTO portfolio_items (id, name, age, category, image, description, experience, specialties, is_secret, created_at) VALUES (
  'portfolio_test_premium3_' || EXTRACT(EPOCH FROM NOW())::text,
  'Test - Sophie Laurent',
  23,
  'premium',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cp4.jpg-DI5re0Dg3sWflQwN6AKd0gapxSzsqj.jpeg',
  'Jeune actrice prometteuse avec un talent naturel pour la comédie. Énergique et charismatique sur scène.',
  '4 ans',
  'Comédie, Théâtre, Télévision',
  true,
  NOW()
);

-- Afficher les éléments créés
SELECT 
  id,
  name,
  age,
  category,
  specialties,
  experience,
  is_secret,
  created_at
FROM portfolio_items 
WHERE is_secret = true AND name LIKE 'Test%'
ORDER BY created_at DESC;

-- Vérifier le total des éléments secrets
SELECT 
  COUNT(*) as total_secret_items,
  COUNT(CASE WHEN category = 'premium' THEN 1 END) as premium_count,
  COUNT(CASE WHEN category = 'elite' THEN 1 END) as elite_count
FROM portfolio_items 
WHERE is_secret = true;

-- Instructions d'utilisation :
-- 1. Exécuter ce script dans la base de données
-- 2. Vérifier que les éléments sont bien créés avec is_secret = true
-- 3. Tester l'accès au portfolio secret avec une clé valide
-- 4. Vérifier que les images s'affichent correctement
-- 5. Tester le filtrage par catégorie
