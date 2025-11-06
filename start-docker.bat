@echo off
echo ========================================
echo   Iniciando Alkitu Template con Docker
echo ========================================
echo.

REM Verificar si Docker está corriendo
docker info >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no está corriendo. Por favor inicia Docker Desktop.
    pause
    exit /b 1
)

echo [1/6] Deteniendo contenedores existentes...
docker-compose -f docker-compose.dev.yml down >nul 2>&1

echo [2/6] Creando archivo .env si no existe...
if not exist .env (
    copy .env.template .env
    echo [INFO] Archivo .env creado desde .env.template
)

echo [3/6] Verificando archivos de configuración...
if not exist packages\api\prisma\schema.prisma (
    echo [ERROR] No se encontró schema.prisma. El proyecto puede no estar configurado correctamente.
    pause
    exit /b 1
)

echo [4/6] Construyendo imágenes de Docker...
docker-compose -f docker-compose.dev.yml build --no-cache

echo [5/6] Iniciando servicios...
docker-compose -f docker-compose.dev.yml up -d

echo [6/6] Esperando a que los servicios estén listos...
timeout /t 10 /nobreak >nul

echo.
echo ========================================
echo   ✓ Servicios iniciados correctamente
echo ========================================
echo.
echo Servicios disponibles:
echo   - Frontend:    http://localhost:3000
echo   - Backend API: http://localhost:3001
echo   - API Docs:    http://localhost:3001/api/docs
echo   - MongoDB:     mongodb://localhost:27017
echo   - Redis:       redis://localhost:6379
echo.
echo Comandos útiles:
echo   - Ver logs:     docker-compose -f docker-compose.dev.yml logs -f
echo   - Detener:      docker-compose -f docker-compose.dev.yml down
echo   - Reiniciar:    docker-compose -f docker-compose.dev.yml restart
echo.
pause