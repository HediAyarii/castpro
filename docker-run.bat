@echo off
echo 🚀 Starting CastPro Application with Docker...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Build and start the application
echo 📦 Building and starting containers...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if services are running
echo 🔍 Checking service status...
docker-compose ps

echo.
echo ✅ CastPro Application is now running!
echo.
echo 🌐 Application: http://localhost:3000
echo 🗄️  Database: localhost:5432
echo 📊 pgAdmin: http://localhost:8080
echo.
echo 📋 Useful commands:
echo    View logs: docker-compose logs -f
echo    Stop services: docker-compose down
echo    Restart services: docker-compose restart
echo    View status: docker-compose ps
echo.
echo 🔑 pgAdmin credentials:
echo    Email: admin@castpro.com
echo    Password: admin2024
echo.
echo 🗄️  Database credentials:
echo    Host: localhost
echo    Port: 5432
echo    Database: castpro
echo    Username: postgres
echo    Password: postgres
echo.
pause
