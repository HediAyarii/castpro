# 🐧 GUIDE VPS UBUNTU - Optimisation des images

## 🚀 **Commandes à exécuter sur votre VPS Ubuntu**

### **1. Diagnostic complet**
```bash
# Se connecter à votre VPS
ssh votre-utilisateur@votre-ip-vps

# Naviguer vers le dossier de l'application
cd /chemin/vers/votre/app

# Rendre le script exécutable
chmod +x scripts/diagnose-ubuntu-vps.sh

# Exécuter le diagnostic
./scripts/diagnose-ubuntu-vps.sh
```

### **2. Vérifications essentielles**

#### **A. Espace disque**
```bash
# Vérifier l'espace disponible
df -h

# Si l'espace est faible (< 20% libre)
sudo apt autoremove
sudo apt autoclean
```

#### **B. Mémoire RAM**
```bash
# Vérifier la mémoire
free -h

# Si la mémoire est faible, ajouter du swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

#### **C. Docker et conteneurs**
```bash
# Vérifier les conteneurs
docker ps

# Vérifier les logs
docker logs --tail=50 nom-du-conteneur

# Redémarrer si nécessaire
docker-compose restart
```

### **3. Corrections spécifiques Ubuntu**

#### **A. Corriger la configuration Docker**
```bash
# Arrêter les conteneurs
docker-compose down

# Éditer docker-compose.yml
nano docker-compose.yml

# Modifier la section volumes:
volumes:
  - ./public/uploads:/app/public/uploads  # ✅ Bon chemin
  - ./public:/app/public                  # ✅ Dossier complet

# Redémarrer
docker-compose up -d
```

#### **B. Installer Nginx (Recommandé)**
```bash
# Installer Nginx
sudo apt update
sudo apt install nginx

# Créer la configuration
sudo nano /etc/nginx/sites-available/castpro

# Contenu de la configuration:
server {
    listen 80;
    server_name votre-domaine.com;
    
    # Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types image/jpeg image/png image/webp text/css application/javascript;
    
    # Cache des images
    location /api/serve-image/ {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 1y;
        proxy_cache_key "$scheme$request_method$host$request_uri";
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Activer le site
sudo ln -s /etc/nginx/sites-available/castpro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### **4. Optimisations système Ubuntu**

#### **A. Optimiser les performances**
```bash
# Installer des outils de monitoring
sudo apt install htop iotop nethogs sysstat

# Configurer les limites système
sudo nano /etc/security/limits.conf

# Ajouter ces lignes:
* soft nofile 65536
* hard nofile 65536
* soft nproc 65536
* hard nproc 65536

# Redémarrer pour appliquer
sudo reboot
```

#### **B. Optimiser Docker**
```bash
# Configurer Docker pour de meilleures performances
sudo nano /etc/docker/daemon.json

# Ajouter:
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Hard": 64000,
      "Name": "nofile",
      "Soft": 64000
    }
  }
}

# Redémarrer Docker
sudo systemctl restart docker
```

### **5. Monitoring en temps réel**

#### **A. Surveiller les performances**
```bash
# Terminal 1 - Monitoring système
htop

# Terminal 2 - Monitoring réseau
nethogs

# Terminal 3 - Monitoring disque
iotop

# Terminal 4 - Logs Docker
docker logs -f nom-du-conteneur
```

#### **B. Script de monitoring automatique**
```bash
# Créer un script de monitoring
nano monitor-performance.sh

# Contenu:
#!/bin/bash
while true; do
    echo "=== $(date) ==="
    echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
    echo "RAM: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
    echo "Disque: $(df -h / | awk 'NR==2{printf "%s", $5}')"
    echo "Docker: $(docker ps --format "table {{.Names}}\t{{.Status}}" | wc -l) conteneurs"
    echo "---"
    sleep 30
done

# Rendre exécutable
chmod +x monitor-performance.sh

# Lancer en arrière-plan
nohup ./monitor-performance.sh > performance.log &
```

### **6. Tests de performance**

#### **A. Test de chargement d'images**
```bash
# Test simple
curl -w "Temps total: %{time_total}s\n" -o /dev/null -s "http://localhost:3000/api/serve-image/test.jpg"

# Test avec différentes tailles
for size in 100 200 500 1000; do
    echo "Test image ${size}x${size}:"
    curl -w "Temps: %{time_total}s\n" -o /dev/null -s "http://localhost:3000/api/serve-image/test.jpg?w=$size"
done
```

#### **B. Test de charge**
```bash
# Installer Apache Bench
sudo apt install apache2-utils

# Test de charge sur les images
ab -n 100 -c 10 "http://localhost:3000/api/serve-image/test.jpg"
```

### **7. Solutions d'urgence**

#### **A. Si les images ne se chargent pas**
```bash
# Vérifier les permissions
sudo chown -R 1001:1001 ./public/uploads
sudo chmod -R 755 ./public/uploads

# Redémarrer Docker
docker-compose restart

# Vérifier les logs
docker logs nom-du-conteneur
```

#### **B. Si le serveur est lent**
```bash
# Libérer la mémoire
sudo sync
echo 3 | sudo tee /proc/sys/vm/drop_caches

# Redémarrer les services
sudo systemctl restart docker
sudo systemctl restart nginx
```

### **8. Configuration Cloudflare (Optionnel mais recommandé)**

#### **A. Configuration DNS**
1. Aller sur cloudflare.com
2. Ajouter votre domaine
3. Changer les DNS vers Cloudflare
4. Activer le proxy (nuage orange)

#### **B. Configuration Page Rules**
```
URL: votre-domaine.com/api/serve-image/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 1 month
```

### **9. Commandes de maintenance**

#### **A. Nettoyage régulier**
```bash
# Script de nettoyage
nano cleanup.sh

# Contenu:
#!/bin/bash
echo "🧹 Nettoyage du système..."
docker system prune -f
sudo apt autoremove -y
sudo apt autoclean
echo "✅ Nettoyage terminé"

# Programmer avec cron
crontab -e
# Ajouter: 0 2 * * * /chemin/vers/cleanup.sh
```

#### **B. Sauvegarde**
```bash
# Script de sauvegarde
nano backup.sh

# Contenu:
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
tar -czf "backup_$DATE.tar.gz" ./public/uploads ./docker-compose.yml
echo "✅ Sauvegarde créée: backup_$DATE.tar.gz"
```

---

## 📊 **Métriques de performance attendues**

### **Après optimisation:**
- **Temps de chargement d'image**: < 200ms
- **Taille des images**: Réduite de 50-60%
- **Charge CPU**: < 30%
- **Utilisation RAM**: < 70%
- **Espace disque**: Optimisé

### **Outils de monitoring recommandés:**
- `htop` - Monitoring CPU/RAM
- `iotop` - Monitoring disque
- `nethogs` - Monitoring réseau
- `docker stats` - Monitoring conteneurs

---

## 🚨 **En cas de problème**

1. **Exécuter le diagnostic**: `./scripts/diagnose-ubuntu-vps.sh`
2. **Vérifier les logs**: `docker logs nom-du-conteneur`
3. **Redémarrer les services**: `docker-compose restart`
4. **Vérifier l'espace disque**: `df -h`
5. **Contacter le support** avec les logs du diagnostic
