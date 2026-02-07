#!/bin/bash
set -e

# Script para iniciar la API en producción
# Busca el archivo main.js compilado y lo ejecuta

echo "🔍 Buscando archivo main.js compilado..."

# Posibles ubicaciones del archivo compilado
LOCATIONS=(
  "packages/api/dist/api/src/main.js"
  "packages/api/dist/src/main.js"
  "dist/api/src/main.js"
  "packages/api/dist/main.js"
)

FOUND=false
for location in "${LOCATIONS[@]}"; do
  if [ -f "$location" ]; then
    echo "✅ Encontrado en: $location"
    echo "🚀 Iniciando aplicación..."
    exec node "$location"
    FOUND=true
    break
  fi
done

if [ "$FOUND" = false ]; then
  echo "❌ Error: No se encontró main.js en ninguna ubicación esperada"
  echo "📁 Contenido del directorio:"
  ls -la packages/api/dist/ 2>/dev/null || echo "packages/api/dist/ no existe"
  find . -name "main.js" -type f 2>/dev/null | grep -v node_modules | head -10 || echo "No se encontró main.js"
  exit 1
fi
