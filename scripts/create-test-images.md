# Création d'Images de Test pour le Portfolio

## Problème Identifié
Les images ne s'affichent pas correctement dans l'interface admin et publique. Il faut créer des images de test pour vérifier le système.

## Solution 1: Créer des Images de Test Manuellement

### Étape 1: Créer des Images Simples
1. Utilisez un éditeur d'image (Paint, GIMP, Photoshop)
2. Créez des images 400x300 pixels
3. Ajoutez du texte pour identifier l'image
4. Sauvegardez en JPG ou PNG

### Étape 2: Placer les Images
Placez les images dans le dossier `public/uploads/` avec ces noms :
- `test_main_001.jpg` - Image pour portfolio principal
- `test_secret_001.jpg` - Image pour portfolio secret

## Solution 2: Utiliser des Images Placeholder en Ligne

### Remplacer les Chemins d'Images dans la Base
```sql
-- Mettre à jour les éléments existants avec des images placeholder
UPDATE portfolio_items 
SET image = 'https://via.placeholder.com/400x300/cccccc/666666?text=Portfolio+Principal'
WHERE is_secret = false;

UPDATE portfolio_items 
SET image = 'https://via.placeholder.com/400x300/ffcccc/666666?text=Portfolio+Secret'
WHERE is_secret = true;
```

## Solution 3: Créer des Images Programmatiquement

### Script Node.js pour Générer des Images
```javascript
// scripts/generate-test-images.js
const fs = require('fs');
const path = require('path');

// Créer des images SVG simples
const createSVG = (text, color = '#cccccc') => `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="${color}"/>
  <text x="200" y="150" font-family="Arial" font-size="24" fill="#666666" text-anchor="middle">${text}</text>
</svg>
`;

const uploadsDir = path.join(__dirname, '../public/uploads');

// Créer le dossier s'il n'existe pas
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Créer les images de test
const images = [
  { name: 'test_main_001.svg', text: 'Portfolio Principal', color: '#cccccc' },
  { name: 'test_secret_001.svg', text: 'Portfolio Secret', color: '#ffcccc' }
];

images.forEach(img => {
  const svg = createSVG(img.text, img.color);
  fs.writeFileSync(path.join(uploadsDir, img.name), svg);
  console.log(`Image créée: ${img.name}`);
});
```

## Solution 4: Utiliser des Images d'Exemple

### Télécharger des Images d'Exemple
```bash
# Dans le dossier public/uploads
curl -o test_main_001.jpg "https://via.placeholder.com/400x300/cccccc/666666?text=Portfolio+Principal"
curl -o test_secret_001.jpg "https://via.placeholder.com/400x300/ffcccc/666666?text=Portfolio+Secret"
```

## Vérification

### 1. Vérifier que les Images Existent
```bash
ls -la public/uploads/
```

### 2. Tester l'Affichage
1. Aller dans l'interface admin
2. Vérifier que les images s'affichent dans la grille
3. Tester l'interface publique

### 3. Vérifier les Chemins dans la Base
```sql
SELECT id, name, image, is_secret FROM portfolio_items;
```

## Résolution des Problèmes

### Si les Images ne S'affichent Toujours Pas
1. Vérifier les permissions du dossier uploads
2. Vérifier que les chemins dans la base sont corrects
3. Vérifier la console du navigateur pour les erreurs 404
4. Tester avec des images externes (placeholder.com)

### Logs de Débogage
Ajouter dans la console du navigateur :
```javascript
// Dans l'interface admin
console.log('Portfolio items:', portfolioItems);
console.log('Secret portfolio:', secretPortfolio);

// Dans l'interface publique
console.log('Talents:', talents);
console.log('Secret talents:', secretTalents);
```
