#!/bin/bash

# Script para generar todos los secrets necesarios para deployment
# Uso: ./scripts/generate-secrets.sh

set -e

echo "🔐 Generando secrets para deployment..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. JWT Secret
echo -e "${BLUE}1. Generando JWT Secret...${NC}"
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}JWT_SECRET=${JWT_SECRET}${NC}"
echo ""

# 2. VAPID Keys
echo -e "${BLUE}2. Generando VAPID Keys (Push Notifications)...${NC}"
cd packages/web

# Verificar si web-push está instalado
if ! npm list web-push &> /dev/null; then
  echo -e "${YELLOW}Instalando web-push...${NC}"
  npm install --save-dev web-push
fi

# Generar keys y capturar output
VAPID_OUTPUT=$(npx web-push generate-vapid-keys)

# Extraer public y private keys del output
VAPID_PUBLIC=$(echo "$VAPID_OUTPUT" | grep "Public Key:" | cut -d':' -f2 | tr -d ' ')
VAPID_PRIVATE=$(echo "$VAPID_OUTPUT" | grep "Private Key:" | cut -d':' -f2 | tr -d ' ')

echo -e "${GREEN}NEXT_PUBLIC_VAPID_PUBLIC_KEY=${VAPID_PUBLIC}${NC}"
echo -e "${GREEN}VAPID_PRIVATE_KEY=${VAPID_PRIVATE}${NC}"
echo ""

cd ../..

# 3. Guardar en archivo .env.secrets (para referencia)
echo -e "${BLUE}3. Guardando secrets en .env.secrets...${NC}"

cat > .env.secrets <<EOF
# ⚠️ IMPORTANTE: NO commitear este archivo
# Estos son secrets generados para tu deployment
# Cópialos a Render/Railway Dashboard

# ============================================
# JWT Configuration
# ============================================
JWT_SECRET=${JWT_SECRET}
JWT_EXPIRES_IN=7d

# ============================================
# Push Notifications (VAPID)
# ============================================
NEXT_PUBLIC_VAPID_PUBLIC_KEY=${VAPID_PUBLIC}
VAPID_PRIVATE_KEY=${VAPID_PRIVATE}
VAPID_SUBJECT=mailto:admin@alkitu.com

# ============================================
# Database (MongoDB Atlas)
# ============================================
# Reemplaza con tu connection string de MongoDB Atlas:
DATABASE_URL=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/alkitu?retryWrites=true&w=majority

# ============================================
# Email Service (Resend)
# ============================================
# Obtén tu API key en: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@alkitu.com

# ============================================
# URLs (se configuran automáticamente en Render/Railway)
# ============================================
# Render:
# CORS_ORIGINS=https://alkitu-web-xxxx.onrender.com
# API_URL=https://alkitu-api-xxxx.onrender.com
# APP_URL=https://alkitu-web-xxxx.onrender.com

# Railway:
# CORS_ORIGINS=\${{web.RAILWAY_PUBLIC_DOMAIN}}
# API_URL=https://\${{RAILWAY_PUBLIC_DOMAIN}}
# APP_URL=https://\${{web.RAILWAY_PUBLIC_DOMAIN}}
EOF

echo -e "${GREEN}✅ Secrets guardados en .env.secrets${NC}"
echo ""

# 4. Agregar a .gitignore si no está
if ! grep -q ".env.secrets" .gitignore 2>/dev/null; then
  echo ".env.secrets" >> .gitignore
  echo -e "${GREEN}✅ .env.secrets agregado a .gitignore${NC}"
else
  echo -e "${YELLOW}⚠️  .env.secrets ya está en .gitignore${NC}"
fi

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}✅ Secrets generados exitosamente!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""
echo -e "${YELLOW}📋 Siguiente paso:${NC}"
echo ""
echo "1. Revisar el archivo: ${BLUE}.env.secrets${NC}"
echo "2. Copiar los valores a tu dashboard de deployment:"
echo "   - Render: Dashboard → Service → Environment"
echo "   - Railway: Dashboard → Service → Variables"
echo ""
echo "3. No olvides configurar también:"
echo "   - DATABASE_URL (MongoDB Atlas)"
echo "   - RESEND_API_KEY (Resend.com)"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE: Nunca commitees .env.secrets a Git${NC}"
echo ""
