#!/bin/bash

echo "🚀 Setting up CastPro database on VPS..."

# Check if PostgreSQL container is running
if ! sudo docker ps | grep -q "castpro-postgres-1"; then
    echo "❌ PostgreSQL container is not running. Starting it..."
    sudo docker-compose up -d postgres
    sleep 10
fi

echo "🔍 Checking if castpro database exists..."
DB_EXISTS=$(sudo docker exec castpro-postgres-1 psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='castpro'")

if [ "$DB_EXISTS" != "1" ]; then
    echo "📦 Creating castpro database..."
    sudo docker exec castpro-postgres-1 psql -U postgres -c "CREATE DATABASE castpro;"
    echo "✅ Database created successfully!"
else
    echo "✅ Database already exists!"
fi

echo "🔧 Setting up database schema..."
if [ -f "scripts/00-init-database.sql" ]; then
    sudo docker cp scripts/00-init-database.sql castpro-postgres-1:/tmp/
    sudo docker exec castpro-postgres-1 psql -U postgres -d castpro -f /tmp/00-init-database.sql
    echo "✅ Database schema created successfully!"
else
    echo "❌ Script scripts/00-init-database.sql not found!"
    exit 1
fi

echo "🔍 Verifying tables..."
TABLE_COUNT=$(sudo docker exec castpro-postgres-1 psql -U postgres -d castpro -tAc "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "📊 Found $TABLE_COUNT tables in the database"

echo "🔍 Verifying admin user..."
ADMIN_EXISTS=$(sudo docker exec castpro-postgres-1 psql -U postgres -d castpro -tAc "SELECT COUNT(*) FROM users WHERE username = 'admin';")
if [ "$ADMIN_EXISTS" = "1" ]; then
    echo "✅ Admin user exists!"
else
    echo "❌ Admin user not found!"
fi

echo "🔄 Restarting application..."
sudo docker-compose restart app

echo "✅ Database setup complete!"
echo "🌐 Your application should now be accessible at your VPS IP:3000"

