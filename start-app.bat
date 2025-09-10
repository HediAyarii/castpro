@echo off
echo Starting CastPro Application with Docker...

echo.
echo Stopping any existing containers...
docker-compose down -v

echo.
echo Building and starting services...
docker-compose up --build

echo.
echo Application started!
echo - Website: http://localhost:3000
echo - pgAdmin: http://localhost:8080
echo - Database: localhost:5432
echo.
echo Press any key to stop the application...
pause

echo.
echo Stopping application...
docker-compose down
