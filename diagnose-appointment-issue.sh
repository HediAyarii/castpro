#!/bin/bash

echo "🔍 Diagnosing CastPro appointment API issues..."

# Check if containers are running
echo "📊 Container status:"
sudo docker-compose ps

echo ""
echo "🔍 Checking database connection from app container:"
sudo docker exec castpro-app-1 node -e "
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testDB() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT COUNT(*) FROM appointments');
    console.log('✅ Database connection successful');
    console.log('📊 Appointments count:', result.rows[0].count);
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
  process.exit(0);
}

testDB();
"

echo ""
echo "🔍 Checking API endpoint accessibility:"
curl -X GET http://localhost:3000/api/appointments -H "Content-Type: application/json" -w "\nStatus: %{http_code}\n" || echo "❌ API not accessible"

echo ""
echo "🔍 Testing appointment creation via API:"
curl -X POST http://localhost:3000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test_'$(date +%s)'",
    "nom": "Test",
    "prenom": "User", 
    "telephone1": "123456789",
    "telephone2": "",
    "date": "2024-01-01",
    "time": "10:00:00",
    "status": "pending",
    "createdAt": "'$(date -Iseconds)'"
  }' \
  -w "\nStatus: %{http_code}\n" || echo "❌ POST request failed"

echo ""
echo "🔍 Checking application logs for errors:"
sudo docker-compose logs app --tail=20

echo ""
echo "✅ Diagnosis complete!"

