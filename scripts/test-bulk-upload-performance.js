#!/usr/bin/env node

/**
 * Script de test de performance pour l'upload en bulk
 * Compare l'ancienne version vs la nouvelle version optimisée
 */

const fs = require('fs');
const path = require('path');

// Configuration du test
const TEST_CONFIG = {
  baseUrl: 'http://localhost:3000',
  testFiles: [
    'test-image-1.jpg',
    'test-image-2.jpg', 
    'test-image-3.jpg',
    'test-image-4.jpg',
    'test-image-5.jpg'
  ],
  category: 'jeunes',
  isSecret: false
};

// Fonction pour créer des fichiers de test
function createTestFiles() {
  console.log('📁 Création des fichiers de test...');
  
  const testDir = path.join(__dirname, 'test-images');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  
  // Créer des fichiers JPEG de test (1MB chacun)
  const testFiles = [];
  for (let i = 1; i <= 5; i++) {
    const fileName = `test-image-${i}.jpg`;
    const filePath = path.join(testDir, fileName);
    
    // Créer un fichier JPEG minimal (1MB)
    const buffer = Buffer.alloc(1024 * 1024, 0xFF); // 1MB de données
    fs.writeFileSync(filePath, buffer);
    testFiles.push(filePath);
  }
  
  console.log(`✅ ${testFiles.length} fichiers de test créés`);
  return testFiles;
}

// Fonction pour tester l'upload classique
async function testClassicUpload(files) {
  console.log('\n🐌 Test de l\'upload classique...');
  
  const formData = new FormData();
  files.forEach(filePath => {
    const file = fs.readFileSync(filePath);
    const blob = new Blob([file], { type: 'image/jpeg' });
    formData.append('files', blob, path.basename(filePath));
  });
  formData.append('category', TEST_CONFIG.category);
  formData.append('is_secret', TEST_CONFIG.isSecret.toString());
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/upload-bulk`, {
      method: 'POST',
      body: formData
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Upload classique réussi en ${duration}ms`);
      console.log(`   - Fichiers uploadés: ${result.summary?.uploaded || 0}`);
      console.log(`   - Erreurs: ${result.summary?.failed || 0}`);
      return { success: true, duration, result };
    } else {
      const error = await response.text();
      console.log(`❌ Upload classique échoué: ${error}`);
      return { success: false, duration, error };
    }
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`❌ Erreur upload classique: ${error.message}`);
    return { success: false, duration, error: error.message };
  }
}

// Fonction pour tester l'upload optimisé
async function testOptimizedUpload(files) {
  console.log('\n🚀 Test de l\'upload optimisé...');
  
  const formData = new FormData();
  files.forEach(filePath => {
    const file = fs.readFileSync(filePath);
    const blob = new Blob([file], { type: 'image/jpeg' });
    formData.append('files', blob, path.basename(filePath));
  });
  formData.append('category', TEST_CONFIG.category);
  formData.append('is_secret', TEST_CONFIG.isSecret.toString());
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/upload-bulk-optimized`, {
      method: 'POST',
      body: formData
    });
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ Upload optimisé réussi en ${duration}ms`);
      console.log(`   - Fichiers uploadés: ${result.summary?.uploaded || 0}`);
      console.log(`   - Erreurs: ${result.summary?.failed || 0}`);
      console.log(`   - Temps moyen par fichier: ${result.summary?.averageTimePerFile || 0}ms`);
      
      // Afficher les statistiques de compression
      if (result.uploadedFiles && result.uploadedFiles.length > 0) {
        const avgCompression = result.uploadedFiles.reduce((acc, file) => 
          acc + (file.compressionRatio || 0), 0) / result.uploadedFiles.length;
        console.log(`   - Compression moyenne: ${Math.round(avgCompression)}%`);
      }
      
      return { success: true, duration, result };
    } else {
      const error = await response.text();
      console.log(`❌ Upload optimisé échoué: ${error}`);
      return { success: false, duration, error };
    }
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;
    console.log(`❌ Erreur upload optimisé: ${error.message}`);
    return { success: false, duration, error: error.message };
  }
}

// Fonction principale de test
async function runPerformanceTest() {
  console.log('🧪 Test de performance - Upload en Bulk');
  console.log('==========================================');
  
  // Vérifier que le serveur est démarré
  try {
    const response = await fetch(`${TEST_CONFIG.baseUrl}/api/upload-bulk`);
    if (!response.ok) {
      throw new Error('Serveur non accessible');
    }
  } catch (error) {
    console.log('❌ Erreur: Le serveur Next.js n\'est pas démarré');
    console.log('   Veuillez démarrer le serveur avec: npm run dev');
    process.exit(1);
  }
  
  // Créer les fichiers de test
  const testFiles = createTestFiles();
  
  // Tests de performance
  const classicResult = await testClassicUpload(testFiles);
  const optimizedResult = await testOptimizedUpload(testFiles);
  
  // Comparaison des résultats
  console.log('\n📊 Comparaison des performances');
  console.log('================================');
  
  if (classicResult.success && optimizedResult.success) {
    const improvement = ((classicResult.duration - optimizedResult.duration) / classicResult.duration) * 100;
    console.log(`⏱️  Temps classique: ${classicResult.duration}ms`);
    console.log(`⏱️  Temps optimisé: ${optimizedResult.duration}ms`);
    console.log(`📈 Amélioration: ${improvement > 0 ? '+' : ''}${Math.round(improvement)}%`);
    
    if (improvement > 0) {
      console.log(`🎉 L'upload optimisé est ${Math.round(improvement)}% plus rapide !`);
    } else {
      console.log(`⚠️  L'upload optimisé est ${Math.round(Math.abs(improvement))}% plus lent`);
    }
  } else {
    console.log('❌ Impossible de comparer - erreurs dans les tests');
  }
  
  // Nettoyage
  console.log('\n🧹 Nettoyage des fichiers de test...');
  const testDir = path.join(__dirname, 'test-images');
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
    console.log('✅ Fichiers de test supprimés');
  }
  
  console.log('\n✨ Test terminé !');
}

// Exécuter le test
if (require.main === module) {
  runPerformanceTest().catch(console.error);
}

module.exports = {
  runPerformanceTest,
  testClassicUpload,
  testOptimizedUpload
};
