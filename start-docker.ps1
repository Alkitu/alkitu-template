Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "  Iniciando Alkitu Template con Docker"    -ForegroundColor Cyan
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host ""

# Verificar si Docker está corriendo
try {
    docker info | Out-Null
} catch {
    Write-Host "[ERROR] Docker no está corriendo. Por favor inicia Docker Desktop." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[1/6] Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml down 2>$null

Write-Host "[2/6] Creando archivo .env si no existe..." -ForegroundColor Yellow
if (!(Test-Path .env)) {
    Copy-Item .env.template .env
    Write-Host "[INFO] Archivo .env creado desde .env.template" -ForegroundColor Green
}

Write-Host "[3/6] Verificando archivos de configuración..." -ForegroundColor Yellow
if (!(Test-Path packages\api\prisma\schema.prisma)) {
    Write-Host "[ERROR] No se encontró schema.prisma. El proyecto puede no estar configurado correctamente." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[4/6] Construyendo imágenes de Docker..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml build --no-cache

Write-Host "[5/6] Iniciando servicios..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up -d

Write-Host "[6/6] Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "========================================"  -ForegroundColor Green
Write-Host "  ✓ Servicios iniciados correctamente"     -ForegroundColor Green
Write-Host "========================================"  -ForegroundColor Green
Write-Host ""
Write-Host "Servicios disponibles:" -ForegroundColor Cyan
Write-Host "  - Frontend:    http://localhost:3000"    -ForegroundColor White
Write-Host "  - Backend API: http://localhost:3001"    -ForegroundColor White
Write-Host "  - API Docs:    http://localhost:3001/api/docs" -ForegroundColor White
Write-Host "  - MongoDB:     mongodb://localhost:27017" -ForegroundColor White
Write-Host "  - Redis:       redis://localhost:6379"   -ForegroundColor White
Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Cyan
Write-Host "  - Ver logs:     docker-compose -f docker-compose.dev.yml logs -f"  -ForegroundColor White
Write-Host "  - Detener:      docker-compose -f docker-compose.dev.yml down"     -ForegroundColor White
Write-Host "  - Reiniciar:    docker-compose -f docker-compose.dev.yml restart"  -ForegroundColor White
Write-Host ""
Read-Host "Presiona Enter para salir"