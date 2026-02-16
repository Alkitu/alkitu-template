# 🚀 Guía Completa: Deployment en Render (Full Stack)

Guía paso a paso para deployar Frontend + Backend en Render usando Docker.

---

## 📋 Tabla de Contenidos

1. [Pre-requisitos](#pre-requisitos)
2. [Configuración Inicial](#configuración-inicial)
3. [Deploy Backend (API)](#deploy-backend-api)
4. [Deploy Frontend (Web)](#deploy-frontend-web)
5. [Configurar Dominios](#configurar-dominios)
6. [Variables de Entorno](#variables-de-entorno)
7. [Verificación](#verificación)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

```
Frontend (Next.js) → Render Web Service (Docker)
Backend (NestJS)   → Render Web Service (Docker)
Database           → MongoDB Atlas
```

**Tiempo estimado:** 30 minutos
**Costo:** $7-14/mes

---

## 📦 Pre-requisitos

### 1. Servicios Externos

- [ ] **MongoDB Atlas** configurado
  - Cluster creado
  - Usuario y contraseña guardados
  - Database URL copiada
  - IP Whitelist: `0.0.0.0/0` (permitir desde cualquier IP)

- [ ] **Resend** (Email)
  - Cuenta creada en [resend.com](https://resend.com)
  - API Key generada
  - Email FROM configurado

- [ ] **Render**
  - Cuenta creada en [render.com](https://render.com)
  - GitHub conectado

### 2. Secrets Generados

```bash
# JWT Secret
openssl rand -base64 32
# Guardar: _______________________________

# VAPID Keys (Push Notifications)
npx web-push generate-vapid-keys
# Public: _______________________________
# Private: ______________________________
```

### 3. Repositorio

- [ ] Código en GitHub
- [ ] Branch `main` limpio
- [ ] Sin archivos `.env` commiteados
- [ ] Dockerfiles presentes:
  - `packages/api/Dockerfile`
  - `packages/web/Dockerfile`

---

## 🚀 Configuración Inicial

### 1. Verificar Dockerfiles

```bash
# Verificar que existen
ls -lh packages/api/Dockerfile
ls -lh packages/web/Dockerfile

# Test build local (opcional pero recomendado)
cd packages/api
docker build -t test-api .

cd ../web
docker build -t test-web .
```

### 2. Preparar Variables de Entorno

Crea un archivo temporal `render-env-vars.txt` con tus variables:

```env
# Backend (API) Variables
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/TEMPLATE
JWT_SECRET=your-generated-jwt-secret-32-chars
JWT_EXPIRES_IN=7d
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=info@yourdomain.com
CORS_ORIGINS=https://your-web-service.onrender.com
API_URL=https://your-api-service.onrender.com
APP_URL=https://your-web-service.onrender.com

# Frontend (Web) Variables
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://your-api-service.onrender.com
NEXT_PUBLIC_APP_URL=https://your-web-service.onrender.com
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:admin@yourdomain.com
```

---

## 🔧 Deploy Backend (API)

### 1. Crear Web Service en Render

1. Login en [dashboard.render.com](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Conectar tu repositorio GitHub
4. Click **"Connect"** en tu repositorio `alkitu-template`

### 2. Configurar Servicio Backend

**Basic Settings:**
```
Name: alkitu-api
Region: Oregon (US West) o Frankfurt (EU)
Branch: main
Root Directory: packages/api
```

**Build & Deploy:**
```
Runtime: Docker
Docker Command: (dejar vacío, usa Dockerfile)
```

**Instance Type:**
```
Free: Free (con sleep después 15 min inactividad)
Starter: $7/mes (recomendado para producción)
```

### 3. Variables de Entorno (Backend)

En **Environment Variables**, agregar en modo **"Secret File"** o una por una:

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb+srv://alkitu:PASSWORD@cluster.mongodb.net/TEMPLATE?retryWrites=true&w=majority
JWT_SECRET=Om1Vv7WYInmaegoAhwCQVdVgQaraVz+DZtvnh91rMok=
JWT_EXPIRES_IN=7d
RESEND_API_KEY=re_ZKzycuZM_PtsuwufhWHbotyPCf4toRfQU
EMAIL_FROM=info@alkitu.com
```

**CORS_ORIGINS - IMPORTANTE:**
```env
# Temporalmente usa *
CORS_ORIGINS=*

# Después del deploy del frontend, actualiza con URL real:
CORS_ORIGINS=https://alkitu-web-XXXX.onrender.com
```

**API_URL y APP_URL:**
```env
# Usa la URL que Render te dará (ver después del deploy)
API_URL=https://alkitu-api-XXXX.onrender.com
APP_URL=https://alkitu-web-XXXX.onrender.com
```

### 4. Deploy Backend

1. Click **"Create Web Service"**
2. Render empezará a:
   - Clonar repo
   - Build Docker image (5-10 min)
   - Deploy container
3. Esperar a que el status sea **"Live"** ✅

### 5. Verificar Backend

```bash
# Copiar la URL que Render te dio (ej: alkitu-api-xxxx.onrender.com)
curl https://alkitu-api-xxxx.onrender.com/health

# Debe responder:
{"status":"ok","timestamp":"..."}
```

**🎉 Backend deployado exitosamente!**

Guarda tu URL: `https://alkitu-api-______.onrender.com`

---

## 🎨 Deploy Frontend (Web)

### 1. Crear Web Service en Render

1. En Render Dashboard, click **"New +"** → **"Web Service"**
2. Seleccionar el mismo repositorio
3. Click **"Connect"**

### 2. Configurar Servicio Frontend

**Basic Settings:**
```
Name: alkitu-web
Region: Oregon (US West) o Frankfurt (EU) - MISMO que API
Branch: main
Root Directory: packages/web
```

**Build & Deploy:**
```
Runtime: Docker
Docker Command: (dejar vacío, usa Dockerfile)
```

**Instance Type:**
```
Free: Free (con sleep) - OK para testing
Starter: $7/mes - Recomendado para producción
```

### 3. Variables de Entorno (Frontend)

En **Environment Variables**:

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://alkitu-api-XXXX.onrender.com
NEXT_PUBLIC_APP_URL=https://alkitu-web-XXXX.onrender.com
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BFn_7zAfVdbvwehLaJpRRk6xgyfvtF5tuVEx20OUZel--Xfi65ngn127oD6AueLthiYFC2GpmUJsiX13WKfTJuU
VAPID_PRIVATE_KEY=P1X7sFOfuEUNNrtCFH72Jdw9VIIg70YPO9lyJecJYU4
VAPID_SUBJECT=mailto:admin@alkitu.com
```

**IMPORTANTE:**
- Reemplaza `NEXT_PUBLIC_API_URL` con la URL del backend que guardaste
- La URL del frontend la sabrás después del deploy

### 4. Deploy Frontend

1. Click **"Create Web Service"**
2. Render empezará a:
   - Clonar repo
   - Build Docker image (5-10 min)
   - Deploy container
3. Esperar a que el status sea **"Live"** ✅

### 5. Verificar Frontend

```bash
# Abrir en navegador
https://alkitu-web-xxxx.onrender.com

# Debe cargar tu aplicación Next.js
```

**🎉 Frontend deployado exitosamente!**

Guarda tu URL: `https://alkitu-web-______.onrender.com`

---

## 🔄 Actualizar CORS (IMPORTANTE)

Ahora que tienes ambas URLs, actualiza el backend:

### 1. Ir a Backend Service

1. Dashboard → **alkitu-api**
2. **Environment** tab
3. Actualizar `CORS_ORIGINS`:

```env
# Reemplazar * con la URL real del frontend
CORS_ORIGINS=https://alkitu-web-XXXX.onrender.com
```

4. Click **"Save Changes"**
5. Render redeployará automáticamente

### 2. Verificar CORS

```bash
# En el navegador, abrir:
https://alkitu-web-xxxx.onrender.com

# Abrir DevTools (F12) → Console
# NO debe haber errores de CORS
```

---

## 🌐 Configurar Dominios Custom (Opcional)

### Backend: api.tudominio.com

1. **Render Dashboard** → Service **alkitu-api** → **Settings**
2. Scroll a **"Custom Domains"**
3. Click **"Add Custom Domain"**
4. Ingresar: `api.tudominio.com`
5. Render te dará un **CNAME target**

**En tu DNS provider (Cloudflare, Namecheap, etc):**
```
Type: CNAME
Name: api
Target: alkitu-api-xxxx.onrender.com
TTL: 300 (5 min)
```

6. Esperar propagación DNS (5-60 min)
7. Render activará SSL automáticamente ✅

### Frontend: app.tudominio.com

1. **Render Dashboard** → Service **alkitu-web** → **Settings**
2. **"Custom Domains"** → **"Add Custom Domain"**
3. Ingresar: `app.tudominio.com`
4. Configurar DNS igual que arriba

**DNS:**
```
Type: CNAME
Name: app
Target: alkitu-web-xxxx.onrender.com
TTL: 300
```

### Actualizar Variables con Dominios Custom

**Backend:**
```env
API_URL=https://api.tudominio.com
APP_URL=https://app.tudominio.com
CORS_ORIGINS=https://app.tudominio.com
```

**Frontend:**
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://app.tudominio.com
```

---

## ✅ Verificación Completa

### 1. Health Checks

```bash
# Backend
curl https://api.tudominio.com/health
# Expected: {"status":"ok"}

# Frontend
curl -I https://app.tudominio.com
# Expected: HTTP/2 200
```

### 2. Test End-to-End

1. Abrir: `https://app.tudominio.com`
2. Intentar login
3. Verificar que:
   - ✅ No hay errores CORS en console
   - ✅ Peticiones API funcionan
   - ✅ Login exitoso
   - ✅ Temas cargan correctamente

### 3. MongoDB Connection

```bash
# Desde Render Shell (Dashboard → Service → Shell tab)
npx prisma db pull

# Should connect successfully
```

---

## 📊 Monitoring

### Logs

**Ver logs en tiempo real:**
```
Dashboard → Service → Logs tab
```

**Backend logs:**
- Buscar: "Nest application successfully started"
- Buscar errores: "ERROR", "FATAL"

**Frontend logs:**
- Buscar: "server started on 0.0.0.0:3000"
- Buscar warnings

### Metrics

**Dashboard → Service → Metrics:**
- CPU usage
- Memory usage
- Request rate
- Response time

**Alerts recomendados:**
- CPU > 80% por 5 min
- Memory > 90% por 5 min
- Service down

---

## 🔧 Troubleshooting

### Backend no inicia

**Síntoma:** Service status = "Deploy failed"

**Soluciones:**
```bash
# 1. Verificar logs
Dashboard → alkitu-api → Logs

# 2. Verificar Dockerfile existe
ls packages/api/Dockerfile

# 3. Test build local
cd packages/api
docker build -t test .

# 4. Verificar variables de entorno
# Especialmente DATABASE_URL
```

### Frontend no carga

**Síntoma:** 502 Bad Gateway o página en blanco

**Soluciones:**
```bash
# 1. Verificar logs
Dashboard → alkitu-web → Logs

# 2. Verificar NEXT_PUBLIC_API_URL está correcto
# 3. Verificar que backend está "Live"
# 4. Test CORS con fetch en console:
fetch('https://api.tudominio.com/health')
```

### CORS Errors

**Síntoma:** "CORS policy: No 'Access-Control-Allow-Origin'"

**Soluciones:**
```bash
# Backend → Environment → CORS_ORIGINS
# Debe incluir la URL exacta del frontend:
CORS_ORIGINS=https://alkitu-web-xxxx.onrender.com

# NO usar:
CORS_ORIGINS=http://... (debe ser https)
CORS_ORIGINS=...onrender.com/ (sin trailing slash)
```

### Cannot Connect to Database

**Síntoma:** "Connection timeout" en logs

**Soluciones:**
```bash
# 1. MongoDB Atlas → Network Access
# Permitir desde cualquier IP:
0.0.0.0/0

# 2. Verificar DATABASE_URL
# Formato correcto:
mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority

# 3. Verificar usuario y contraseña
# No usar caracteres especiales sin escapar
```

### Service Sleeps (Free Tier)

**Síntoma:** Service demora 30s-1min en responder primera request

**Causa:** Free tier duerme después 15 min inactividad

**Soluciones:**
```bash
# Opción 1: Upgrade a Starter ($7/mes)
Dashboard → Service → Settings → Instance Type → Starter

# Opción 2: Ping service cada 10 min
# Usar cron job externo (cron-job.org)
curl https://alkitu-api-xxxx.onrender.com/health
```

### Build Fails

**Síntoma:** "Build failed" en logs

**Soluciones:**
```bash
# 1. Verificar Root Directory está correcto
Dashboard → Service → Settings → Root Directory
packages/api  # o packages/web

# 2. Test build local
docker build -t test packages/api

# 3. Verificar package.json existe
ls packages/api/package.json

# 4. Verificar dependencies instaladas
# En Dockerfile debe tener: npm install
```

---

## 💰 Costos Estimados

### Free Tier (Development)
```
Backend: Free (con sleep)
Frontend: Free (con sleep)
Total: $0/mes

⚠️ No recomendado para producción
```

### Starter (Production)
```
Backend: $7/mes (always on)
Frontend: $7/mes (always on)
Total: $14/mes

✅ Recomendado para producción
```

### Standard (Scale)
```
Backend: $25/mes (más RAM, CPU dedicado)
Frontend: $25/mes
Total: $50/mes

Para apps con mucho tráfico
```

---

## 🔒 Seguridad en Producción

### Checklist

- [ ] Usar HTTPS en todos los endpoints
- [ ] CORS configurado con URLs específicas (no `*`)
- [ ] Secrets fuertes (JWT_SECRET 32+ caracteres)
- [ ] Variables de entorno, no hardcodear secrets
- [ ] MongoDB IP whitelist configurado
- [ ] SSL activado (automático en Render)
- [ ] Backups de database automáticos (MongoDB Atlas)
- [ ] Rate limiting habilitado (ya configurado en NestJS)

### Headers de Seguridad

Render configura automáticamente:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

---

## 🔄 CI/CD Automático

**Render hace deploy automático cuando:**
- ✅ Haces push a branch `main`
- ✅ Merge de pull request
- ✅ Detecta cambios en `packages/api` o `packages/web`

**Desactivar auto-deploy:**
```
Dashboard → Service → Settings → Auto-Deploy
Toggle OFF si quieres deploy manual
```

---

## 📞 Recursos

- [Render Docs](https://render.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NestJS Deployment](https://docs.nestjs.com/faq/serverless)

---

## ✅ Checklist Final

- [ ] Backend deployed y "Live"
- [ ] Frontend deployed y "Live"
- [ ] CORS configurado correctamente
- [ ] Variables de entorno completas
- [ ] Health check responde OK
- [ ] Login funciona
- [ ] No errores en console
- [ ] MongoDB conectado
- [ ] SSL activado (candado en navegador)
- [ ] Dominios custom configurados (opcional)
- [ ] Monitoring activado

**¡Tu aplicación está en producción!** 🎉

---

## 🚀 Siguiente: Migración a Vercel (Opcional)

Cuando estés listo para optimizar performance y reducir costos:

📄 Ver: `migration-render-to-vercel.md`

**Beneficios:**
- 50% más barato ($7 vs $14)
- 3x mejor performance
- Image optimization automática
- Migración: 15 minutos
