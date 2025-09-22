# Guide de déploiement des optimisations upload
# Fichier: DEPLOY-UPLOAD-OPTIMIZATIONS.md

## 🚀 **OPTIMISATIONS UPLOAD RAPIDES - DÉPLOIEMENT**

### **✅ Modifications apportées au code :**

#### **1. API d'upload optimisée** (`app/api/upload-bulk-optimized/route.ts`)
- ✅ Compression agressive (75% qualité)
- ✅ Redimensionnement automatique (1200px max)
- ✅ Traitement parallèle avec Promise.allSettled
- ✅ Limite de 10 fichiers par batch
- ✅ Timeout de 30 secondes max

#### **2. Docker Compose optimisé** (`docker-compose.yml`)
- ✅ Variables d'environnement pour performance
- ✅ Volume mapping corrigé (`./public/uploads:/app/public/uploads`)
- ✅ Limites de fichiers et timeouts

#### **3. Composant frontend optimisé** (`components/ui/bulk-upload-optimized.tsx`)
- ✅ Limite de 10 fichiers affichée
- ✅ Messages d'optimisation mis à jour

### **📦 Fichiers à déployer sur le VPS :**

#### **1. Code application (déjà modifié)**
```bash
# Ces fichiers sont déjà optimisés dans votre projet :
- app/api/upload-bulk-optimized/route.ts
- docker-compose.yml
- components/ui/bulk-upload-optimized.tsx
```

#### **2. Script de test**
```bash
# Copier sur le VPS pour tester
- test-upload-performance.sh
```

### **🔧 Commandes de déploiement :**

#### **Sur votre PC :**
```bash
# 1. Construire l'application optimisée
npm run build

# 2. Créer l'archive
tar -czf upload-optimizations.tar.gz \
  app/api/upload-bulk-optimized/route.ts \
  docker-compose.yml \
  components/ui/bulk-upload-optimized.tsx \
  test-upload-performance.sh \
  DEPLOY-UPLOAD-OPTIMIZATIONS.md
```

#### **Sur le VPS :**
```bash
# 1. Transférer les fichiers
scp upload-optimizations.tar.gz ubuntu@votre-vps:/home/ubuntu/castpro/castpro/

# 2. Se connecter au VPS
ssh ubuntu@votre-vps

# 3. Aller dans le dossier du projet
cd /home/ubuntu/castpro/castpro/

# 4. Extraire les fichiers
tar -xzf upload-optimizations.tar.gz

# 5. Rendre le script exécutable
chmod +x test-upload-performance.sh

# 6. Redémarrer Docker avec la nouvelle configuration
sudo docker compose down
sudo docker compose up -d --build

# 7. Attendre que les services démarrent
sleep 30

# 8. Tester les performances
./test-upload-performance.sh
```

### **⚙️ Configuration Nginx (optionnelle) :**

Si vous voulez optimiser Nginx aussi, ajoutez ces lignes dans `/etc/nginx/sites-available/castpro` :

```nginx
# Optimisations pour uploads rapides
client_max_body_size 50m;
client_body_timeout 60s;
client_header_timeout 60s;
client_body_buffer_size 128k;

# Redémarrer Nginx
sudo systemctl reload nginx
```

### **📊 Résultats attendus :**

#### **Avant optimisation :**
- ⏱️ 10-30 secondes pour 10 images
- 📊 Compression basique (85% qualité)
- 🔄 Traitement séquentiel
- 📏 Images non redimensionnées

#### **Après optimisation :**
- ⚡ 2-5 secondes pour 10 images
- 📊 Compression agressive (75% qualité)
- 🔄 Traitement parallèle
- 📏 Images redimensionnées (1200px max)
- 🚀 **Amélioration de 80%**

### **🔍 Vérification :**

#### **1. Tester l'upload :**
```bash
./test-upload-performance.sh
```

#### **2. Vérifier les logs :**
```bash
sudo docker logs castpro-app-1 --tail=20
```

#### **3. Vérifier les fichiers uploadés :**
```bash
ls -la public/uploads/
du -sh public/uploads/
```

### **🚨 Dépannage :**

#### **Si upload toujours lent :**
1. Vérifier la bande passante : `speedtest-cli`
2. Vérifier les logs Docker : `sudo docker logs castpro-app-1`
3. Vérifier l'espace disque : `df -h`
4. Vérifier la RAM : `free -h`

#### **Si erreurs de permissions :**
```bash
sudo chown -R ubuntu:ubuntu /home/ubuntu/castpro/castpro/public/uploads
sudo chmod -R 755 /home/ubuntu/castpro/castpro/public/uploads
```

#### **Si erreurs Docker :**
```bash
sudo docker compose down
sudo docker system prune -f
sudo docker compose up -d --build
```

### **📈 Monitoring :**

#### **Script de monitoring simple :**
```bash
#!/bin/bash
echo "=== MONITORING UPLOADS ==="
echo "Date: $(date)"
echo "RAM utilisée:"
free -h | grep Mem
echo "Espace disque uploads:"
du -sh /home/ubuntu/castpro/castpro/public/uploads/
echo "Nombre de fichiers:"
ls -1 /home/ubuntu/castpro/castpro/public/uploads/ | wc -l
echo "Docker containers:"
docker ps --format "table {{.Names}}\t{{.Status}}"
echo "========================="
```

### **🎯 Objectif :**
Réduire le temps d'upload de **10-30 secondes** à **2-5 secondes** pour 10 images, soit une amélioration de **80%**.
