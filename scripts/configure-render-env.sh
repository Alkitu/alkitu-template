#!/bin/bash

# Script para configurar variables de entorno en Render usando la API
# Uso: ./scripts/configure-render-env.sh

set -e

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔐 Configurando variables de entorno en Render...${NC}"
echo ""

# 1. Obtener API Key
echo -e "${YELLOW}Primero necesitas tu Render API Key:${NC}"
echo ""
echo "1. Ve a: https://dashboard.render.com/u/settings#api-keys"
echo "2. Click en 'Create API Key'"
echo "3. Copia el key"
echo ""
read -p "Pega tu Render API Key aquí: " RENDER_API_KEY

if [ -z "$RENDER_API_KEY" ]; then
  echo -e "${RED}❌ Error: API Key es requerida${NC}"
  exit 1
fi

echo ""
echo -e "${BLUE}📦 Obteniendo servicios...${NC}"

# 2. Obtener lista de servicios
SERVICES_RESPONSE=$(curl -s -X GET \
  https://api.render.com/v1/services \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Accept: application/json")

# 3. Extraer IDs de servicios
API_SERVICE_ID=$(echo "$SERVICES_RESPONSE" | grep -o '"id":"srv-[^"]*"' | grep -i "alkitu-api" | head -1 | cut -d'"' -f4)
WEB_SERVICE_ID=$(echo "$SERVICES_RESPONSE" | grep -o '"id":"srv-[^"]*"' | grep -i "alkitu-web" | head -1 | cut -d'"' -f4)

if [ -z "$API_SERVICE_ID" ]; then
  echo -e "${RED}❌ No se encontró el servicio alkitu-api${NC}"
  echo "Servicios disponibles:"
  echo "$SERVICES_RESPONSE" | grep -o '"name":"[^"]*"' | cut -d'"' -f4
  exit 1
fi

if [ -z "$WEB_SERVICE_ID" ]; then
  echo -e "${RED}❌ No se encontró el servicio alkitu-web${NC}"
  exit 1
fi

echo -e "${GREEN}✅ alkitu-api: $API_SERVICE_ID${NC}"
echo -e "${GREEN}✅ alkitu-web: $WEB_SERVICE_ID${NC}"
echo ""

# 4. Configurar variables de alkitu-api
echo -e "${BLUE}Configurando alkitu-api...${NC}"

# DATABASE_URL
curl -s -X PUT \
  "https://api.render.com/v1/services/$API_SERVICE_ID/env-vars/DATABASE_URL" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "mongodb+srv://alkitu:Al123kitu.com@alkitu.bfid3.mongodb.net/TEMPLATE?retryWrites=true&w=majority&appName=alkitu"
  }' > /dev/null

echo -e "${GREEN}✅ DATABASE_URL configurada${NC}"

# JWT_SECRET
curl -s -X PUT \
  "https://api.render.com/v1/services/$API_SERVICE_ID/env-vars/JWT_SECRET" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "Om1Vv7WYInmaegoAhwCQVdVgQaraVz+DZtvnh91rMok="
  }' > /dev/null

echo -e "${GREEN}✅ JWT_SECRET configurada${NC}"

# RESEND_API_KEY
curl -s -X PUT \
  "https://api.render.com/v1/services/$API_SERVICE_ID/env-vars/RESEND_API_KEY" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "re_ZKzycuZM_PtsuwufhWHbotyPCf4toRfQU"
  }' > /dev/null

echo -e "${GREEN}✅ RESEND_API_KEY configurada${NC}"
echo ""

# 5. Configurar variables de alkitu-web
echo -e "${BLUE}Configurando alkitu-web...${NC}"

# NEXT_PUBLIC_VAPID_PUBLIC_KEY
curl -s -X PUT \
  "https://api.render.com/v1/services/$WEB_SERVICE_ID/env-vars/NEXT_PUBLIC_VAPID_PUBLIC_KEY" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "BFn_7zAfVdbvwehLaJpRRk6xgyfvtF5tuVEx20OUZel--Xfi65ngn127oD6AueLthiYFC2GpmUJsiX13WKfTJuU"
  }' > /dev/null

echo -e "${GREEN}✅ NEXT_PUBLIC_VAPID_PUBLIC_KEY configurada${NC}"

# VAPID_PRIVATE_KEY
curl -s -X PUT \
  "https://api.render.com/v1/services/$WEB_SERVICE_ID/env-vars/VAPID_PRIVATE_KEY" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "P1X7sFOfuEUNNrtCFH72Jdw9VIIg70YPO9lyJecJYU4"
  }' > /dev/null

echo -e "${GREEN}✅ VAPID_PRIVATE_KEY configurada${NC}"
echo ""

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ Variables configuradas exitosamente!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${YELLOW}📋 Siguiente paso:${NC}"
echo ""
echo "Los servicios se redesplegarán automáticamente en ~3-5 minutos"
echo ""
echo "Monitorear progreso:"
echo "1. Dashboard → alkitu-api → Logs"
echo "2. Dashboard → alkitu-web → Logs"
echo ""
echo "Esperar a ver:"
echo "- API: 'Nest application successfully started'"
echo "- Web: 'server started on 0.0.0.0:10000'"
echo ""
