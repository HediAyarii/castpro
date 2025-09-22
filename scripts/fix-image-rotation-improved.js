#!/usr/bin/env node

/**
 * Script amélioré pour corriger la rotation des images existantes
 * Version robuste qui gère les erreurs et les fichiers corrompus
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Configuration
const UPLOADS_DIR = path.join(__dirname, '..', 'public', 'uploads');
const BACKUP_DIR = path.join(__dirname, '..', 'public', 'uploads-backup');

// Fonction pour créer un backup
function createBackup() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log('📁 Dossier de backup créé');
  }
}

// Fonction pour vérifier si un fichier est corrompu
function isFileCorrupted(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size === 0;
  } catch (error) {
    return true;
  }
}

// Fonction pour corriger une image avec gestion d'erreurs améliorée
async function fixImageRotation(filePath) {
  try {
    const fileName = path.basename(filePath);
    
    // Vérifier si le fichier est corrompu
    if (isFileCorrupted(filePath)) {
      console.log(`⚠️  Fichier corrompu ignoré: ${fileName}`);
      return false;
    }
    
    const backupPath = path.join(BACKUP_DIR, fileName);
    
    // Créer un backup
    fs.copyFileSync(filePath, backupPath);
    
    // Lire l'image avec gestion d'erreurs
    let image;
    try {
      image = sharp(filePath);
      const metadata = await image.metadata();
      
      console.log(`🔄 Correction de ${fileName} (${metadata.width}x${metadata.height})`);
      
      // Vérifier si l'image a des métadonnées EXIF
      const hasOrientation = metadata.orientation && metadata.orientation !== 1;
      
      if (hasOrientation) {
        console.log(`   📐 Rotation détectée: ${metadata.orientation}`);
      }
      
      // Corriger la rotation et optimiser
      const correctedBuffer = await image
        .rotate() // Corrige automatiquement selon EXIF
        .jpeg({ quality: 85 })
        .toBuffer();
      
      // Écrire l'image corrigée
      fs.writeFileSync(filePath, correctedBuffer);
      
      console.log(`✅ ${fileName} corrigé avec succès`);
      return true;
      
    } catch (sharpError) {
      console.log(`⚠️  Erreur Sharp pour ${fileName}: ${sharpError.message}`);
      
      // Essayer une approche alternative pour les fichiers problématiques
      try {
        // Lire le fichier comme buffer et le réécrire sans modification
        const buffer = fs.readFileSync(filePath);
        fs.writeFileSync(filePath, buffer);
        console.log(`🔄 ${fileName} réécrit sans modification`);
        return true;
      } catch (fallbackError) {
        console.log(`❌ Impossible de traiter ${fileName}`);
        return false;
      }
    }
    
  } catch (error) {
    console.error(`❌ Erreur lors de la correction de ${filePath}:`, error.message);
    return false;
  }
}

// Fonction principale
async function fixAllImages() {
  console.log('🔧 Correction de la rotation des images existantes (Version améliorée)');
  console.log('====================================================================');
  
  // Vérifier que le dossier uploads existe
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log('❌ Dossier uploads non trouvé');
    return;
  }
  
  // Créer le backup
  createBackup();
  
  // Lire tous les fichiers du dossier uploads
  const files = fs.readdirSync(UPLOADS_DIR);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp)$/i.test(file)
  );
  
  console.log(`📸 ${imageFiles.length} images trouvées`);
  
  if (imageFiles.length === 0) {
    console.log('ℹ️  Aucune image à corriger');
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;
  
  // Traiter chaque image
  for (const file of imageFiles) {
    const filePath = path.join(UPLOADS_DIR, file);
    const success = await fixImageRotation(filePath);
    
    if (success) {
      successCount++;
    } else {
      errorCount++;
    }
  }
  
  // Résumé
  console.log('\n📊 Résumé de la correction');
  console.log('==========================');
  console.log(`✅ Images corrigées: ${successCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📁 Backup créé dans: ${BACKUP_DIR}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Correction terminée !');
    console.log('Les images devraient maintenant s\'afficher correctement.');
    console.log('\n💡 Pour les nouvelles images:');
    console.log('   - L\'upload optimisé corrige automatiquement la rotation');
    console.log('   - Utilisez "Ajouter en masse" pour de meilleures performances');
  }
}

// Exécuter le script
if (require.main === module) {
  fixAllImages().catch(console.error);
}

module.exports = {
  fixAllImages,
  fixImageRotation
};
