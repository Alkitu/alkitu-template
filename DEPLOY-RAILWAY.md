# 🚂 Deploy Completo en Railway - Guía Paso a Paso

Esta guía te llevará desde cero hasta tener tu aplicación completa funcionando en Railway.

## 📋 Pre-requisitos

- [ ] Cuenta en Railway.app (gratis para empezar)
- [ ] MongoDB Atlas configurado
- [ ] Repositorio en GitHub
- [ ] Railway CLI instalado

```bash
npm install -g @railway/cli
```

---

## 🎯 Arquitectura Final

```
Railway Project
├── 🔧 API Service (NestJS)     → api.tudominio.com
├── 🎨 Web Service (Next.js)    → tudominio.com
└── 🗄️  Redis Service (opcional) → Interno
```

---

## 📦 Paso 1: Crear Proyecto en Railway

### Opción A: Desde Dashboard (Recomendado para primera vez)

1. Ve a [railway.app](https://railway.app)
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Conecta tu repositorio `alkitu-template`
5. Railway detectará automáticamente el monorepo

### Opción B: Desde CLI

```bash
# Login
railway login

# Crear proyecto
railway init

# Conectar con repo
railway link
```

---

## 🔧 Paso 2: Configurar Backend (API)

### 2.1 Crear servicio de API

```bash
# Desde la raíz del proyecto
railway service create api

# Configurar directorio
railway service --name api
```

### 2.2 Configurar Build Settings en Railway Dashboard

1. Ve a tu proyecto en Railway
2. Click en el servicio **"api"**
3. Settings → Build & Deploy:

```
Root Directory: packages/api
Build Command:  npm install && npm run build
Start Command:  npm run start:prod
```

O si prefieres usar Docker:

```
Root Directory: packages/api
Dockerfile Path: packages/api/Dockerfile
```

### 2.3 Configurar Variables de Entorno

En Railway Dashboard → API Service → Variables:

```env
# Node
NODE_ENV=production
PORT=3001

# Database (MongoDB Atlas)
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/alkitu?retryWrites=true&w=majority

# JWT
JWT_SECRET=<genera-con-openssl-rand-base64-32>
JWT_EXPIRES_IN=7d

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@tudominio.com

# CORS (agrega tu dominio de Railway)
CORS_ORIGINS=${{RAILWAY_PUBLIC_DOMAIN}},${{Netlify.RAILWAY_PUBLIC_DOMAIN}}

# URLs
API_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
APP_URL=https://${{web.RAILWAY_PUBLIC_DOMAIN}}
```

**Tip:** Railway tiene variables especiales:
- `${{RAILWAY_PUBLIC_DOMAIN}}` = URL automática del servicio
- `${{web.RAILWAY_PUBLIC_DOMAIN}}` = URL del servicio "web"
- `${{api.RAILWAY_PUBLIC_DOMAIN}}` = URL del servicio "api"

### 2.4 Generar Prisma Client

Railway debe generar el Prisma Client durante el build. Verifica que tu `package.json` tenga:

```json
{
  "scripts": {
    "build": "prisma generate && nest build",
    "postinstall": "prisma generate"
  }
}
```

### 2.5 Configurar Dominio Personalizado (Opcional)

1. Railway Dashboard → API Service → Settings → Domains
2. Click **"Add Domain"**
3. Ingresa: `api.tudominio.com`
4. Configura DNS (CNAME):
   ```
   api.tudominio.com → CNAME → tu-proyecto.up.railway.app
   ```

---

## 🎨 Paso 3: Configurar Frontend (Web)

### 3.1 Crear servicio de Web

```bash
railway service create web
```

### 3.2 Configurar Build Settings

Railway Dashboard → Web Service → Settings → Build & Deploy:

**Opción A: Sin Docker (Más rápido)**
```
Root Directory: packages/web
Build Command:  npm install && npm run build
Start Command:  npm start
```

**Opción B: Con Docker**
```
Root Directory: packages/web
Dockerfile Path: packages/web/Dockerfile
```

### 3.3 Configurar Variables de Entorno

Railway Dashboard → Web Service → Variables:

```env
# Node
NODE_ENV=production
PORT=3000

# API Connection (usa la variable de Railway)
NEXT_PUBLIC_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}

# Next.js
NEXT_TELEMETRY_DISABLED=1

# Push Notifications (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<tu-public-key>
VAPID_PRIVATE_KEY=<tu-private-key>
VAPID_SUBJECT=mailto:admin@tudominio.com
```

**Generar VAPID keys:**
```bash
npx web-push generate-vapid-keys
```

### 3.4 Configurar Dominio Personalizado

1. Railway Dashboard → Web Service → Settings → Domains
2. Click **"Add Domain"**
3. Ingresa: `tudominio.com` y `www.tudominio.com`
4. Configura DNS:
   ```
   tudominio.com     → CNAME → tu-proyecto.up.railway.app
   www.tudominio.com → CNAME → tu-proyecto.up.railway.app
   ```

---

## 🗄️ Paso 4: Agregar Redis (Opcional pero Recomendado)

### 4.1 Crear servicio de Redis

Railway tiene Redis como template:

1. Railway Dashboard → **"New Service"**
2. Selecciona **"Database" → "Redis"**
3. Railway lo configurará automáticamente

### 4.2 Conectar Redis al Backend

Railway genera automáticamente la variable `REDIS_URL`.

En tu API service, agregar:
```env
REDIS_URL=${{Redis.REDIS_URL}}
```

Railway automáticamente referencia la URL del servicio Redis.

---

## 🚀 Paso 5: Deploy Inicial

### 5.1 Trigger Build

Railway automáticamente hace deploy cuando:
- Haces push a GitHub (main branch)
- Cambias variables de entorno
- Haces "Redeploy" manual

### 5.2 Verificar Deployment

```bash
# Ver logs en tiempo real
railway logs --service api
railway logs --service web

# O desde Dashboard
# Railway → Service → Deployments → Click en el deployment → Logs
```

### 5.3 Verificar Health

```bash
# Backend
curl https://tu-api.up.railway.app/health

# Frontend
curl https://tu-web.up.railway.app
```

---

## 🔄 Paso 6: Configurar CI/CD Automático

Railway hace deploy automático cuando haces push a GitHub, pero puedes customizarlo:

### 6.1 Railway.json (Opcional)

Crear en la raíz: `railway.json`

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 6.2 GitHub Actions (Opcional - para builds custom)

`.github/workflows/railway-deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Railway CLI
        run: npm i -g @railway/cli

      - name: Deploy API
        run: railway up --service api
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

      - name: Deploy Web
        run: railway up --service web
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

Para obtener `RAILWAY_TOKEN`:
```bash
railway login
railway token
# Copiar token y agregarlo a GitHub Secrets
```

---

## 📊 Paso 7: Monitoreo y Logs

### 7.1 Ver Métricas

Railway Dashboard → Service → Metrics:
- CPU usage
- Memory usage
- Network traffic
- Request count

### 7.2 Ver Logs

```bash
# CLI
railway logs --service api --tail 100

# Dashboard
Railway → Service → Deployments → Logs
```

### 7.3 Configurar Alertas (Opcional)

Railway permite webhooks para notificaciones:

1. Settings → Webhooks
2. Agregar URL de webhook (Slack, Discord, etc.)

---

## 🔒 Paso 8: Seguridad

### 8.1 MongoDB Atlas - IP Whitelist

Agregar IPs de Railway:

1. MongoDB Atlas → Network Access
2. Click **"Add IP Address"**
3. Railway no tiene IPs fijas, así que opciones:
   - **Opción A**: Allow from anywhere `0.0.0.0/0` (con autenticación fuerte)
   - **Opción B**: Usar Railway Private Networking + MongoDB Private Endpoint

### 8.2 Variables de Entorno Sensibles

Railway encripta automáticamente todas las variables.

Nunca commitear `.env` files:
```bash
# .gitignore
.env
.env.local
.env.production
.env.*.local
```

### 8.3 HTTPS

Railway configura HTTPS automáticamente con certificados SSL gratuitos.

---

## 💰 Paso 9: Costos y Billing

### Plan Gratuito (Trial)
- $5 de crédito gratis
- Suficiente para 1 semana de testing

### Plan Developer ($5/mes + usage)
- $5/mes base
- ~$0.000463/GB-hour RAM
- ~$0.000231/vCPU-hour

**Estimado para Alkitu:**
- API: ~$5-8/mes
- Web: ~$5-7/mes
- Redis: ~$2-3/mes
- **Total: ~$12-18/mes**

### Ver uso actual:
```bash
railway billing
```

---

## 🔄 Paso 10: Rollbacks y Versiones

### Rollback a versión anterior

Railway Dashboard:
1. Service → Deployments
2. Click en deployment anterior
3. **"Redeploy"**

O desde CLI:
```bash
railway redeploy --service api --id <deployment-id>
```

---

## 🐛 Troubleshooting

### Error: "Build Failed"

```bash
# Ver logs detallados
railway logs --service api --tail 500

# Verificar que el build funciona localmente
cd packages/api
npm install
npm run build
```

### Error: "Cannot connect to database"

1. Verificar `DATABASE_URL` en variables
2. Verificar IP whitelist en MongoDB Atlas
3. Verificar que la cadena de conexión es correcta

```bash
# Test conexión
railway run --service api npx prisma db pull
```

### Error: "Module not found"

Prisma Client no generado:

```bash
# Agregar a package.json
"postinstall": "prisma generate"
```

### Frontend muestra "Failed to fetch"

CORS mal configurado:

```env
# En API service
CORS_ORIGINS=https://${{web.RAILWAY_PUBLIC_DOMAIN}}
```

### Servicio se reinicia constantemente

1. Ver logs para encontrar error
2. Verificar health check endpoint funciona
3. Aumentar memoria si es necesario (Settings → Resources)

---

## ✅ Checklist Final

- [ ] API service deployed y saludable
- [ ] Web service deployed y saludable
- [ ] Redis conectado (si aplica)
- [ ] Variables de entorno configuradas
- [ ] Dominios personalizados configurados (opcional)
- [ ] MongoDB Atlas IP whitelist configurado
- [ ] CORS configurado correctamente
- [ ] Health checks funcionando
- [ ] Logs sin errores
- [ ] Costo estimado aceptable

---

## 🎉 ¡Listo!

Tu aplicación ahora está en producción en Railway.

**URLs de acceso:**
- Backend: `https://tu-api.up.railway.app`
- Frontend: `https://tu-web.up.railway.app`

**Siguiente:**
- Configurar dominio personalizado
- Configurar monitoreo (Sentry, LogRocket)
- Configurar backups de MongoDB
- Configurar alertas

---

## 📞 Soporte

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app)
