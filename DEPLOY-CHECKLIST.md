# ✅ Checklist de Deployment - Railway

Usa este checklist para desplegar tu aplicación paso a paso.

---

## 📋 Pre-Deployment (Antes de empezar)

### 1. Servicios Externos
- [ ] **MongoDB Atlas** configurado
  - [ ] Cluster creado
  - [ ] Usuario creado
  - [ ] Contraseña guardada segura
  - [ ] Database URL copiada
  - [ ] IP Whitelist: `0.0.0.0/0` (temporal)

- [ ] **Resend** (Email)
  - [ ] Cuenta creada
  - [ ] API Key generada
  - [ ] Dominio verificado (opcional)

- [ ] **Railway**
  - [ ] Cuenta creada (railway.app)
  - [ ] CLI instalado: `npm i -g @railway/cli`
  - [ ] Login exitoso: `railway login`

### 2. Repositorio
- [ ] Código en GitHub
- [ ] Branch `main` limpio
- [ ] Sin archivos `.env` commiteados
- [ ] `.gitignore` correcto

### 3. Secrets Generados
```bash
# JWT Secret
openssl rand -base64 32
# Copiar y guardar: ___________________

# VAPID Keys (Push Notifications)
npx web-push generate-vapid-keys
# Public: ___________________________
# Private: __________________________
```

---

## 🚀 Deployment - Paso a Paso

### Paso 1: Crear Proyecto Railway (5 min)

```bash
# Terminal
railway login
railway init
# Seguir wizard
```

- [ ] Proyecto creado
- [ ] Conectado a GitHub repo
- [ ] Railway detectó monorepo

**Dashboard URL:** https://railway.app/project/_______

---

### Paso 2: Deploy Backend (10 min)

#### 2.1 Crear Servicio
```bash
railway service create api
```

#### 2.2 Configurar en Dashboard

**Railway → Project → Service "api" → Settings:**

- [ ] **Name**: `api`
- [ ] **Root Directory**: `packages/api`
- [ ] **Build Command**: Auto-detectado
- [ ] **Start Command**: Auto-detectado

#### 2.3 Variables de Entorno

**Railway → Service "api" → Variables → Raw Editor:**

```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb+srv://USER:PASS@cluster.mongodb.net/alkitu
JWT_SECRET=<tu-jwt-secret-generado>
JWT_EXPIRES_IN=7d
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=noreply@tudominio.com
CORS_ORIGINS=https://${{web.RAILWAY_PUBLIC_DOMAIN}},${{RAILWAY_PUBLIC_DOMAIN}}
API_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
APP_URL=https://${{web.RAILWAY_PUBLIC_DOMAIN}}
```

- [ ] Variables pegadas
- [ ] Variables guardadas
- [ ] Deployment iniciado automáticamente

#### 2.4 Verificar Deploy

```bash
# Ver logs
railway logs --service api

# Esperar a ver: "Nest application successfully started"
```

- [ ] Build exitoso (verde)
- [ ] Container corriendo
- [ ] Health check OK

**Test:**
```bash
# Copiar URL del servicio
curl https://tu-api-XXXXX.up.railway.app/health
# Debe responder: {"status":"ok"}
```

- [ ] Health endpoint responde ✅

**API URL:** https://_____________________.up.railway.app

---

### Paso 3: Deploy Frontend (10 min)

#### 3.1 Crear Servicio
```bash
railway service create web
```

#### 3.2 Configurar en Dashboard

**Railway → Service "web" → Settings:**

- [ ] **Name**: `web`
- [ ] **Root Directory**: `packages/web`
- [ ] **Build Command**: Auto-detectado
- [ ] **Start Command**: Auto-detectado

#### 3.3 Variables de Entorno

**Railway → Service "web" → Variables → Raw Editor:**

```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_VAPID_PUBLIC_KEY=<tu-vapid-public-key>
VAPID_PRIVATE_KEY=<tu-vapid-private-key>
VAPID_SUBJECT=mailto:admin@tudominio.com
```

- [ ] Variables pegadas
- [ ] Variables guardadas
- [ ] Deployment iniciado

#### 3.4 Verificar Deploy

```bash
railway logs --service web
# Esperar: "server started on 0.0.0.0:3000"
```

- [ ] Build exitoso
- [ ] Container corriendo
- [ ] Sitio cargando

**Test:**
```bash
curl https://tu-web-XXXXX.up.railway.app
# Debe responder con HTML
```

- [ ] Web carga correctamente ✅

**Web URL:** https://_____________________.up.railway.app

---

### Paso 4: Configurar Redis (5 min) - Opcional

#### 4.1 Agregar Redis

**Railway → New Service → Database → Redis**

- [ ] Redis service creado
- [ ] `REDIS_URL` generada automáticamente

#### 4.2 Conectar al Backend

**Service "api" → Variables:**

```env
REDIS_URL=${{Redis.REDIS_URL}}
```

- [ ] Variable agregada
- [ ] Service redeployed

---

### Paso 5: Dominios Personalizados (10 min) - Opcional

#### 5.1 Backend

**Railway → Service "api" → Settings → Domains:**

- [ ] Click "Add Domain"
- [ ] Ingresar: `api.tudominio.com`
- [ ] Copiar CNAME target: `___________.up.railway.app`

**En tu DNS provider:**
```
Type: CNAME
Name: api
Target: ___________.up.railway.app
TTL: 300
```

- [ ] DNS configurado
- [ ] Propagado (puede tomar 5-60 min)
- [ ] SSL activado automáticamente

#### 5.2 Frontend

**Railway → Service "web" → Settings → Domains:**

- [ ] Agregar: `tudominio.com`
- [ ] Agregar: `www.tudominio.com`
- [ ] Copiar CNAME targets

**En tu DNS provider:**
```
# Dominio raíz (si soporta CNAME)
Type: CNAME
Name: @
Target: ___________.up.railway.app

# www subdomain
Type: CNAME
Name: www
Target: ___________.up.railway.app
```

- [ ] DNS configurado
- [ ] Propagado
- [ ] SSL activado

**Si tu DNS NO soporta CNAME en root:**
```
# Usar A records (IP puede cambiar)
Type: A
Name: @
Value: <IP de Railway>
```

---

### Paso 6: Actualizar CORS (5 min)

Ahora que tienes dominios, actualizar CORS:

**Service "api" → Variables:**

```env
CORS_ORIGINS=https://tudominio.com,https://www.tudominio.com,https://api.tudominio.com
```

- [ ] CORS actualizado con dominios finales
- [ ] Service redeployed

---

### Paso 7: Configurar MongoDB IP Whitelist (5 min)

**MongoDB Atlas → Network Access:**

Opción A (Fácil):
- [ ] IP Address: `0.0.0.0/0`
- [ ] Comment: "Railway - Allow from anywhere"

Opción B (Más seguro - requiere plan Railway Pro):
- [ ] Usar Railway Private Networking
- [ ] IPs específicas de Railway

---

## 🧪 Testing Completo

### Test 1: Backend Health
```bash
curl https://api.tudominio.com/health
# Esperado: {"status":"ok","timestamp":"..."}
```
- [ ] ✅ Responde correctamente

### Test 2: Backend Database
```bash
# Desde Railway CLI
railway run --service api npx prisma db pull
```
- [ ] ✅ Conecta a MongoDB

### Test 3: Frontend Loading
```bash
curl -I https://tudominio.com
# Esperado: HTTP/2 200
```
- [ ] ✅ Responde 200 OK

### Test 4: Frontend → Backend
1. Abrir: `https://tudominio.com`
2. Login
3. Verificar que funciona

- [ ] ✅ Frontend se comunica con backend
- [ ] ✅ No hay errores CORS en console
- [ ] ✅ Login funciona
- [ ] ✅ Tema carga correctamente

### Test 5: Email (Resend)
1. Usar "Forgot Password" o registro
2. Verificar que llega email

- [ ] ✅ Emails se envían

---

## 📊 Post-Deployment

### Monitoreo

- [ ] Configurar **Sentry** para error tracking
  ```bash
  npm install @sentry/nextjs @sentry/node
  ```

- [ ] Configurar **Uptime Monitor** (UptimeRobot)
  - [ ] Monitor: `https://api.tudominio.com/health`
  - [ ] Monitor: `https://tudominio.com`

- [ ] Configurar alertas Railway
  - [ ] Webhook para Slack/Discord

### Backups

- [ ] **MongoDB Atlas**: Configurar backups automáticos
  - Atlas → Backup → Enable Cloud Backup
  - Retention: 7 días

- [ ] **Railway**: Configurar snapshots (plan Pro)

### Documentation

- [ ] Documentar URLs finales
  - API: ___________________________
  - Web: ___________________________
  - Admin: _________________________

- [ ] Documentar credenciales (en password manager)
  - Railway login
  - MongoDB Atlas
  - Resend
  - Dominios

---

## 💰 Billing Setup

- [ ] Agregar método de pago en Railway
- [ ] Configurar límite de gasto (opcional)
- [ ] Configurar alertas de billing

**Presupuesto estimado:** $15-20/mes

---

## 🔄 CI/CD Automático (Opcional)

Si quieres deploy automático en cada push:

- [ ] Railway ya lo hace automáticamente
- [ ] Solo hacer push a `main` branch
- [ ] Railway detecta cambios y redeploys

**Test:**
```bash
git commit -m "test: ci/cd"
git push origin main

# Verificar en Railway Dashboard que deploy se inicia
```

---

## ✅ Deployment Completado

Si todos los checks están ✅, tu aplicación está en producción!

**URLs Finales:**
- 🌐 Frontend: https://tudominio.com
- 🔧 Backend API: https://api.tudominio.com
- 📊 Railway Dashboard: https://railway.app/project/...

**Siguiente:**
1. Monitorear logs primeros días
2. Verificar costos semanalmente
3. Configurar backups
4. Compartir con usuarios para testing
5. Celebrar 🎉

---

## 🆘 Si Algo Falla

### Build Fails
```bash
# Ver logs detallados
railway logs --service api --tail 500

# Verificar localmente
cd packages/api
npm install
npm run build
```

### Cannot Connect to DB
1. Verificar `DATABASE_URL`
2. Verificar IP whitelist
3. Test conexión:
   ```bash
   railway run --service api npx prisma db pull
   ```

### CORS Errors
1. Verificar `CORS_ORIGINS` incluye URL del frontend
2. Verificar protocolo (https vs http)

### Servicio Se Reinicia
1. Ver logs para error
2. Verificar health endpoint
3. Aumentar memoria si necesario

**Soporte:**
- Railway Discord: https://discord.gg/railway
- Railway Docs: https://docs.railway.app
- Esta documentación: `DEPLOY-RAILWAY.md`
