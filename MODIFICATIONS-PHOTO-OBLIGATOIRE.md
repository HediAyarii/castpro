# 📸 MODIFICATIONS PHOTO OBLIGATOIRE ET COMPRESSION ULTRA-AGRESSIVE

## 🎯 **OBJECTIF**
- **Photo obligatoire** : Le formulaire de rendez-vous exige maintenant une photo
- **Compression ultra-agressive** : Les images sont compressées à maximum 100KB
- **Stockage en base** : L'image compressée est stockée directement en base64 dans la base de données

## 🔧 **MODIFICATIONS APPORTÉES**

### **1. Formulaire de rendez-vous (`app/page.tsx`)**
- ✅ Photo rendue **obligatoire** avec `required` et validation
- ✅ Affichage de la taille du fichier en temps réel
- ✅ Message d'information sur la compression automatique
- ✅ Validation côté client pour s'assurer qu'une photo est fournie

### **2. API d'upload (`app/api/upload-candidate-photo/route.ts`)**
- ✅ **Compression ultra-agressive** : Qualité 60%, taille max 400x400px
- ✅ **Cible 100KB maximum** : Compression progressive jusqu'à atteindre 100KB
- ✅ **Rotation automatique** : Correction EXIF pour éviter les images tournées
- ✅ **Retour base64** : L'image compressée est retournée en base64

### **3. Base de données (`lib/database.ts`)**
- ✅ Nouvelle colonne `photo_compressed` pour stocker l'image en base64
- ✅ Colonne `photo_url` conservée pour compatibilité
- ✅ Index créé pour optimiser les requêtes

### **4. Interface admin (`app/login/page.tsx`)**
- ✅ Affichage prioritaire de l'image compressée (base64)
- ✅ Fallback sur `photo_url` si `photo_compressed` n'existe pas
- ✅ Interface mise à jour pour gérer les deux types de stockage

## 📊 **PERFORMANCE**

### **Avant :**
- Images de 5-10MB stockées sur le disque
- Chargement lent des images
- Pas de compression

### **Après :**
- Images compressées à **100KB maximum**
- Stockage direct en base de données
- Chargement instantané
- **Réduction de 95% de la taille** des images

## 🚀 **DÉPLOIEMENT**

### **1. Sur le VPS :**
```bash
# 1. Mettre à jour le code
git pull origin main

# 2. Exécuter la migration
chmod +x migrate-add-compressed-photo.sh
./migrate-add-compressed-photo.sh

# 3. Redémarrer l'application
sudo docker compose restart app
```

### **2. Vérification :**
```bash
# Vérifier que la colonne existe
sudo docker exec castpro-postgres-1 psql -U postgres -d castpro -c "\d appointments"

# Tester l'upload d'une photo
curl -X POST -F "photo=@test.jpg" -F "appointmentId=test123" https://castpro-tn.com/api/upload-candidate-photo
```

## 🔍 **TESTS**

### **Test de compression :**
1. Uploader une image de 5MB
2. Vérifier qu'elle est compressée à ~100KB
3. Vérifier que l'image s'affiche correctement dans l'admin

### **Test de validation :**
1. Essayer de soumettre le formulaire sans photo
2. Vérifier que le message d'erreur s'affiche
3. Uploader une photo et vérifier que le formulaire se soumet

## 📝 **NOTES IMPORTANTES**

- **Photo obligatoire** : Impossible de prendre un rendez-vous sans photo
- **Compression automatique** : Toutes les images sont compressées à 100KB max
- **Stockage hybride** : Image compressée en base + fichier sur disque
- **Compatibilité** : Les anciens rendez-vous sans photo continuent de fonctionner
- **Performance** : Chargement instantané des photos dans l'admin

## 🎨 **INTERFACE UTILISATEUR**

### **Formulaire :**
- Label avec astérisque rouge : "Photo de profil *"
- Affichage de la taille en temps réel
- Message informatif sur la compression
- Validation obligatoire

### **Admin :**
- Photo affichée en priorité depuis la base64
- Fallback sur l'URL si nécessaire
- Taille réduite pour économiser l'espace
