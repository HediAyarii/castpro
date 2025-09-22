#!/bin/bash

# Script de diagnostic pour les problèmes d'images sur VPS
# À exécuter sur votre serveur VPS

echo "🔍 DIAGNOSTIC - Chargement d'images lent sur VPS"
echo "================================================"

# 1. Vérifier l'espace disque
echo "📊 1. Espace disque disponible:"
df -h

# 2. Vérifier les performances du disque
echo -e "\n💾 2. Test de performance du disque:"
dd if=/dev/zero of=/tmp/test.img bs=1G count=1 oflag=dsync 2>&1 | grep -E "(copied|GB/s)"

# 3. Vérifier la mémoire disponible
echo -e "\n🧠 3. Mémoire disponible:"
free -h

# 4. Vérifier les processus Docker
echo -e "\n🐳 4. Statut des conteneurs Docker:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 5. Vérifier les logs de l'application
echo -e "\n📝 5. Logs récents de l'application:"
docker logs --tail=20 castprov29-app-1 2>/dev/null || echo "Conteneur non trouvé"

# 6. Vérifier la taille du dossier uploads
echo -e "\n📁 6. Taille du dossier uploads:"
if [ -d "./uploads" ]; then
    du -sh ./uploads
    echo "Nombre de fichiers: $(find ./uploads -type f | wc -l)"
else
    echo "❌ Dossier uploads non trouvé"
fi

# 7. Vérifier les permissions
echo -e "\n🔐 7. Permissions du dossier uploads:"
if [ -d "./uploads" ]; then
    ls -la ./uploads | head -5
else
    echo "❌ Dossier uploads non trouvé"
fi

# 8. Test de connectivité réseau
echo -e "\n🌐 8. Test de connectivité:"
curl -w "@-" -o /dev/null -s "http://localhost:3000/api/serve-image/test.jpg" <<< "
     time_namelookup:  %{time_namelookup}\n
        time_connect:  %{time_connect}\n
     time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
       time_redirect:  %{time_redirect}\n
  time_starttransfer:  %{time_starttransfer}\n
                     ----------\n
          time_total:  %{time_total}\n
"

# 9. Vérifier la configuration Docker
echo -e "\n🐳 9. Configuration Docker Compose:"
if [ -f "docker-compose.yml" ]; then
    echo "✅ docker-compose.yml trouvé"
    grep -A 5 -B 5 "volumes:" docker-compose.yml
else
    echo "❌ docker-compose.yml non trouvé"
fi

# 10. Recommandations
echo -e "\n💡 RECOMMANDATIONS:"
echo "==================="
echo "1. Vérifiez que le volume Docker pointe vers le bon dossier"
echo "2. Considérez l'utilisation d'un CDN (Cloudflare, AWS CloudFront)"
echo "3. Optimisez les images avec compression"
echo "4. Configurez un cache Redis pour les images"
echo "5. Utilisez un serveur web (Nginx) devant l'application"

echo -e "\n✅ Diagnostic terminé!"
