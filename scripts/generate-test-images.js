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
  console.log('Dossier uploads créé');
}

// Créer les images de test
const images = [
  { name: 'test_main_001.svg', text: 'Portfolio Principal', color: '#cccccc' },
  { name: 'test_secret_001.svg', text: 'Portfolio Secret', color: '#ffcccc' },
  { name: 'test_main_002.svg', text: 'Marie Dubois', color: '#cccccc' },
  { name: 'test_secret_002.svg', text: 'Sophie Secret', color: '#ffcccc' }
];

images.forEach(img => {
  const svg = createSVG(img.text, img.color);
  fs.writeFileSync(path.join(uploadsDir, img.name), svg);
  console.log(`Image créée: ${img.name}`);
});

console.log('\nImages de test créées avec succès !');
console.log('Vous pouvez maintenant tester le système de portfolio.');
