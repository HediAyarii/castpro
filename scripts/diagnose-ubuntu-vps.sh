#!/bin/bash

# Script de diagnostic spécifique pour VPS Ubuntu
# À exécuter sur votre serveur Ubuntu

echo "🐧 DIAGNOSTIC VPS UBUNTU - Chargement d'images lent"
echo "=================================================="

# 1. Informations système
echo "💻 1. Informations système:"
echo "OS: $(lsb_release -d | cut -f2)"
echo "Kernel: $(uname -r)"
echo "Architecture: $(uname -m)"

# 2. Vérifier l'espace disque
echo -e "\n📊 2. Espace disque disponible:"
df -h | grep -E "(Filesystem|/dev/)"

# 3. Vérifier les performances du disque (SSD/HDD)
echo -e "\n💾 3. Type de disque et performances:"
if command -v lsblk &> /dev/null; then
    lsblk -d -o NAME,ROTA,SIZE,MODEL
    echo "ROTA=0 = SSD, ROTA=1 = HDD"
fi

# Test de performance disque
echo -e "\n⚡ Test de performance disque:"
dd if=/dev/zero of=/tmp/test.img bs=1G count=1 oflag=dsync 2>&1 | grep -E "(copied|GB/s)" || echo "Test non disponible"

# 4. Vérifier la mémoire
echo -e "\n🧠 4. Mémoire disponible:"
free -h

# 5. Vérifier les processus Docker
echo -e "\n🐳 5. Statut des conteneurs Docker:"
if command -v docker &> /dev/null; then
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    echo "❌ Docker non installé"
fi

# 6. Vérifier Docker Compose
echo -e "\n🐳 6. Statut Docker Compose:"
if command -v docker-compose &> /dev/null; then
    docker-compose ps
elif command -v docker &> /dev/null && docker compose version &> /dev/null; then
    docker compose ps
else
    echo "❌ Docker Compose non disponible"
fi

# 7. Vérifier les logs de l'application
echo -e "\n📝 7. Logs récents de l'application:"
APP_CONTAINER=$(docker ps --format "{{.Names}}" | grep -E "(app|castpro)" | head -1)
if [ ! -z "$APP_CONTAINER" ]; then
    echo "Conteneur trouvé: $APP_CONTAINER"
    docker logs --tail=20 "$APP_CONTAINER" 2>/dev/null
else
    echo "❌ Conteneur d'application non trouvé"
fi

# 8. Vérifier la taille du dossier uploads
echo -e "\n📁 8. Dossier uploads:"
if [ -d "./uploads" ]; then
    echo "Taille: $(du -sh ./uploads | cut -f1)"
    echo "Nombre de fichiers: $(find ./uploads -type f | wc -l)"
    echo "Premiers fichiers:"
    ls -la ./uploads | head -5
elif [ -d "./public/uploads" ]; then
    echo "Taille: $(du -sh ./public/uploads | cut -f1)"
    echo "Nombre de fichiers: $(find ./public/uploads -type f | wc -l)"
    echo "Premiers fichiers:"
    ls -la ./public/uploads | head -5
else
    echo "❌ Dossier uploads non trouvé"
fi

# 9. Vérifier les permissions
echo -e "\n🔐 9. Permissions:"
if [ -d "./uploads" ]; then
    ls -la ./uploads | head -3
elif [ -d "./public/uploads" ]; then
    ls -la ./public/uploads | head -3
fi

# 10. Test de connectivité réseau
echo -e "\n🌐 10. Test de connectivité réseau:"
if command -v curl &> /dev/null; then
    echo "Test de latence vers localhost:"
    curl -w "@-" -o /dev/null -s "http://localhost:3000/api/serve-image/test.jpg" <<< "
         time_namelookup:  %{time_namelookup}\n
            time_connect:  %{time_connect}\n
         time_appconnect:  %{time_appconnect}\n
        time_pretransfer:  %{time_pretransfer}\n
           time_redirect:  %{time_redirect}\n
      time_starttransfer:  %{time_starttransfer}\n
                         ----------\n
              time_total:  %{time_total}\n
    " 2>/dev/null || echo "❌ Application non accessible sur le port 3000"
else
    echo "❌ curl non installé"
fi

# 11. Vérifier la configuration réseau
echo -e "\n🌐 11. Configuration réseau:"
echo "Ports ouverts:"
ss -tuln | grep -E ":3000|:80|:443"

# 12. Vérifier les ressources système
echo -e "\n📈 12. Utilisation des ressources:"
echo "CPU:"
top -bn1 | grep "Cpu(s)" | head -1
echo "Mémoire:"
free | grep -E "(Mem|Swap)"

# 13. Vérifier les logs système
echo -e "\n📋 13. Logs système récents:"
if command -v journalctl &> /dev/null; then
    journalctl --since "1 hour ago" | grep -i "docker\|error\|fail" | tail -5
else
    echo "❌ journalctl non disponible"
fi

# 14. Recommandations spécifiques Ubuntu
echo -e "\n💡 RECOMMANDATIONS SPÉCIFIQUES UBUNTU:"
echo "========================================"
echo "1. Installer Nginx comme reverse proxy:"
echo "   sudo apt update && sudo apt install nginx"
echo ""
echo "2. Optimiser les performances système:"
echo "   sudo apt install htop iotop nethogs"
echo ""
echo "3. Configurer le swap si nécessaire:"
echo "   sudo swapon --show"
echo ""
echo "4. Vérifier les limites système:"
echo "   ulimit -a"
echo ""
echo "5. Installer des outils de monitoring:"
echo "   sudo apt install sysstat"

echo -e "\n✅ Diagnostic Ubuntu terminé!"
