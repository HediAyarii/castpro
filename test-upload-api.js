#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Test de l\'API d\'upload CastPro...\n');

// Test 1: Vérifier la connectivité de base
async function testBasicConnectivity() {
  console.log('1️⃣ Test de connectivité de base...');
  
  try {
    const response = await fetch('http://localhost:3000/api/appointments');
    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ API accessible - ${data.length} rendez-vous trouvés`);
    } else {
      console.log(`   ❌ Erreur API: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Erreur de connexion: ${error.message}`);
  }
}

// Test 2: Tester l'upload simple
async function testSimpleUpload() {
  console.log('\n2️⃣ Test d\'upload simple...');
  
  try {
    // Créer un fichier de test simple
    const testImagePath = path.join(__dirname, 'test-image.txt');
    fs.writeFileSync(testImagePath, 'Test image content');
    
    const formData = new FormData();
    const file = new File(['Test image content'], 'test-image.txt', { type: 'text/plain' });
    formData.append('file', file);
    
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    const responseText = await response.text();
    console.log(`   Response preview: ${responseText.substring(0, 100)}...`);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log(`   ✅ Upload réussi: ${data.success ? 'Oui' : 'Non'}`);
      } catch (parseError) {
        console.log(`   ❌ Réponse non-JSON: ${parseError.message}`);
      }
    } else {
      console.log(`   ❌ Erreur upload: ${response.status}`);
    }
    
    // Nettoyer
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.log(`   ❌ Erreur test upload: ${error.message}`);
  }
}

// Test 3: Tester l'upload en masse
async function testBulkUpload() {
  console.log('\n3️⃣ Test d\'upload en masse...');
  
  try {
    const formData = new FormData();
    
    // Créer des fichiers de test
    const file1 = new File(['Test image 1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['Test image 2'], 'test2.txt', { type: 'text/plain' });
    
    formData.append('files', file1);
    formData.append('files', file2);
    formData.append('category', 'jeunes');
    formData.append('is_secret', 'false');
    
    const response = await fetch('http://localhost:3000/api/upload-bulk', {
      method: 'POST',
      body: formData
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    
    const responseText = await response.text();
    console.log(`   Response preview: ${responseText.substring(0, 200)}...`);
    
    if (response.ok) {
      try {
        const data = JSON.parse(responseText);
        console.log(`   ✅ Upload en masse réussi: ${data.success ? 'Oui' : 'Non'}`);
        console.log(`   📊 Fichiers uploadés: ${data.summary?.uploaded || 0}`);
        console.log(`   ❌ Erreurs: ${data.summary?.failed || 0}`);
      } catch (parseError) {
        console.log(`   ❌ Réponse non-JSON: ${parseError.message}`);
      }
    } else {
      console.log(`   ❌ Erreur upload en masse: ${response.status}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Erreur test upload en masse: ${error.message}`);
  }
}

// Test 4: Vérifier les logs Docker
async function checkDockerLogs() {
  console.log('\n4️⃣ Vérification des logs Docker...');
  
  const { exec } = require('child_process');
  
  return new Promise((resolve) => {
    exec('docker-compose logs app --tail=10', (error, stdout, stderr) => {
      if (error) {
        console.log(`   ❌ Erreur Docker: ${error.message}`);
      } else {
        console.log(`   📋 Logs récents:`);
        console.log(`   ${stdout.split('\n').slice(0, 5).join('\n   ')}`);
      }
      resolve();
    });
  });
}

// Exécuter tous les tests
async function runAllTests() {
  await testBasicConnectivity();
  await testSimpleUpload();
  await testBulkUpload();
  await checkDockerLogs();
  
  console.log('\n✅ Tests terminés!');
  console.log('\n💡 Solutions possibles:');
  console.log('   1. Redémarrer les conteneurs: docker-compose down && docker-compose up -d --build');
  console.log('   2. Vérifier la base de données: docker-compose logs postgres');
  console.log('   3. Vérifier les permissions: ls -la public/uploads/');
  console.log('   4. Exécuter le script de correction: scripts/fix-upload-problem.sql');
}

runAllTests().catch(console.error);


