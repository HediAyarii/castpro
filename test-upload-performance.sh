#!/bin/bash

# Script de test de performance d'upload
# Fichier: test-upload-performance.sh

echo "🚀 TEST DE PERFORMANCE UPLOAD"
echo "============================="

# Créer un fichier de test
echo "📁 Création d'un fichier de test..."
dd if=/dev/zero of=test-image.jpg bs=1M count=2 2>/dev/null

# Test d'upload
echo "📤 Test d'upload 2MB..."
echo "URL: https://castpro-tn.com/api/upload-bulk-optimized"
echo ""

# Mesurer le temps
start_time=$(date +%s.%N)

# Test avec curl
response=$(curl -s -w "HTTP_CODE:%{http_code};TIME_TOTAL:%{time_total};TIME_CONNECT:%{time_connect};TIME_STARTTRANSFER:%{time_starttransfer}" \
  -X POST \
  -F "files=@test-image.jpg" \
  -F "category=enfants" \
  -F "is_secret=false" \
  "https://castpro-tn.com/api/upload-bulk-optimized")

end_time=$(date +%s.%N)

# Extraire les métriques
http_code=$(echo "$response" | grep -o "HTTP_CODE:[0-9]*" | cut -d: -f2)
time_total=$(echo "$response" | grep -o "TIME_TOTAL:[0-9.]*" | cut -d: -f2)
time_connect=$(echo "$response" | grep -o "TIME_CONNECT:[0-9.]*" | cut -d: -f2)
time_starttransfer=$(echo "$response" | grep -o "TIME_STARTTRANSFER:[0-9.]*" | cut -d: -f2)

# Afficher les résultats
echo "📊 RÉSULTATS:"
echo "Code HTTP: $http_code"
echo "Temps total: ${time_total}s"
echo "Temps de connexion: ${time_connect}s"
echo "Temps de début transfert: ${time_starttransfer}s"

# Nettoyer
rm -f test-image.jpg

# Évaluation
if [ "$http_code" = "200" ]; then
    echo "✅ Upload réussi!"
    if (( $(echo "$time_total < 5" | bc -l) )); then
        echo "🚀 Performance EXCELLENTE (< 5s)"
    elif (( $(echo "$time_total < 10" | bc -l) )); then
        echo "👍 Performance BONNE (< 10s)"
    else
        echo "⚠️ Performance LENTE (> 10s)"
    fi
else
    echo "❌ Upload échoué (Code: $http_code)"
fi

echo "============================="
