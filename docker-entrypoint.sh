#!/bin/sh

# Wait for PostgreSQL to be ready using a simple connection test
echo "Waiting for PostgreSQL to be ready..."

# Function to test PostgreSQL connection
test_postgres() {
  # Try to connect to PostgreSQL using psql
  PGPASSWORD=postgres psql -h postgres -p 5432 -U postgres -d castpro -c "SELECT 1;" > /dev/null 2>&1
  return $?
}

# Wait until PostgreSQL is ready
until test_postgres; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

# Start the application
exec node server.js
