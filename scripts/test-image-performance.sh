#!/bin/bash

# Script de test de performance des images sur VPS Ubuntu
# À exécuter sur votre serveur

echo "🚀 TEST DE PERFORMANCE - Images en bulk"
echo "======================================"

# 1. Tester le chargement d'une image
echo "📸 1. Test d'une image individuelle:"
curl -w "Temps: %{time_total}s\n" -o /dev/null -s "http://localhost:3000/api/serve-image/portfolio_main_enfants_1758501085009_vho3c1t4dus.jpeg"

# 2. Tester plusieurs images en parallèle
echo -e "\n📸 2. Test de 5 images en parallèle:"
for i in {1..5}; do
    curl -w "Image $i: %{time_total}s\n" -o /dev/null -s "http://localhost:3000/api/serve-image/portfolio_main_enfants_1758501085009_vho3c1t4dus.jpeg" &
done
wait

# 3. Tester avec différentes tailles
echo -e "\n📸 3. Test avec paramètres d'optimisation:"
curl -w "Image optimisée (w=500): %{time_total}s\n" -o /dev/null -s "http://localhost:3000/api/serve-image/portfolio_main_enfants_1758501085009_vho3c1t4dus.jpeg?w=500&q=85"

# 4. Vérifier les ressources système
echo -e "\n💻 4. Ressources système pendant le test:"
echo "CPU: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)%"
echo "RAM: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"

# 5. Vérifier les logs Docker
echo -e "\n📝 5. Logs récents de l'application:"
sudo docker logs --tail=10 castpro-app-1

echo -e "\n✅ Test terminé!"
