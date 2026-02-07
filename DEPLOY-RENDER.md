# 🎨 Deploy Completo en Render - Guía Paso a Paso

Esta guía te llevará desde cero hasta tener tu aplicación funcionando en Render (Free Tier).

## 📋 Pre-requisitos

- [x] Cuenta en Render.com (gratis para empezar)
- [x] MongoDB Atlas configurado (free tier)
- [x] Repositorio en GitHub
- [x] Render CLI instalado ✅

## ⚠️ Importante: Free Tier Limitaciones

**Recuerda:**
- ✅ Free tier **PERMANENTE** (no expira)
- ✅ 2 servicios gratis (API + Web)
- ⚠️ Servicios se "duermen" después de **15 minutos** de inactividad
- ⚠️ Primera carga tarda **30-60 segundos** al despertar
- ✅ Cargas siguientes son instantáneas (mientras esté activo)

**Ideal para:**
- 🎓 Proyectos de aprendizaje
- 📱 Portfolios personales
- 🧪 Demos y prototipos
- 🏃 Testing antes de producción

---

## 🚀 Paso 1: Autenticación

```bash
# Login en Render (abrirá navegador)
render login

# Verificar autenticación
render whoami
```

---

## 🔑 Paso 2: Generar Secrets

Necesitas generar varios secrets antes de deployar:

### 2.1 JWT Secret

```bash
# Generar JWT secret
openssl rand -base64 32

# Copiar y guardar (lo necesitarás en Paso 4)
```

### 2.2 VAPID Keys (Push Notifications)

```bash
# Generar VAPID keys
cd packages/web
npx web-push generate-vapid-keys

# Copiar ambas keys:
# - Public Key: para NEXT_PUBLIC_VAPID_PUBLIC_KEY
# - Private Key: para VAPID_PRIVATE_KEY
```

### 2.3 MongoDB Atlas Setup

Si aún no tienes MongoDB Atlas configurado:

1. Ir a https://cloud.mongodb.com
2. Crear cluster M0 (Free):
   ```
   Provider: AWS
   Region: us-east-1 (cerca de Render Oregon)
   Cluster Tier: M0 Sandbox (FREE)
   ```
3. **Database Access** → Crear usuario:
   ```
   Username: alkitu_user
   Password: <genera-password-seguro>
   Database User Privileges: Read and write to any database
   ```
4. **Network Access** → Add IP Address:
   ```
   IP Address: 0.0.0.0/0
   Comment: Allow from anywhere (Render)
   ```
5. **Connect** → Copiar connection string:
   ```
   mongodb+srv://alkitu_user:<password>@cluster.mongodb.net/alkitu?retryWrites=true&w=majority
   ```

### 2.4 Resend API Key

Si aún no tienes Resend configurado:

1. Ir a https://resend.com
2. Sign up (free tier: 100 emails/día)
3. **API Keys** → Create API Key
4. Copiar y guardar el key: `re_xxxxxxxxxxxx`

---

## 📦 Paso 3: Deploy con Blueprint

Render detectará automáticamente el archivo `render.yaml` que ya creamos.

### Opción A: Deploy desde Dashboard (Recomendado)

1. Ve a https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Conecta tu repositorio: `alkitu-template`
4. Render detectará `render.yaml` automáticamente
5. Click **"Apply"**

### Opción B: Deploy desde CLI

```bash
# Desde la raíz del proyecto
render blueprint launch

# Seguir el wizard
```

**⚠️ IMPORTANTE:** Los servicios se crearán pero fallarán inicialmente porque faltan las variables secretas. Esto es normal, las configuraremos en el siguiente paso.

---

## 🔐 Paso 4: Configurar Variables Secretas

Ahora debes agregar las variables secretas que marcamos como `sync: false` en el `render.yaml`.

### 4.1 Configurar API Service

1. Dashboard → **alkitu-api** → **Environment**
2. Agregar variables:

```env
# Database
DATABASE_URL=mongodb+srv://alkitu_user:TU_PASSWORD@cluster.mongodb.net/alkitu?retryWrites=true&w=majority

# JWT (generado en Paso 2.1)
JWT_SECRET=tu-jwt-secret-generado-con-openssl

# Resend (generado en Paso 2.4)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

3. Click **"Save Changes"**
4. El servicio se redespleará automáticamente

### 4.2 Configurar Web Service

1. Dashboard → **alkitu-web** → **Environment**
2. Agregar variables:

```env
# VAPID Keys (generadas en Paso 2.2)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=tu-vapid-public-key
VAPID_PRIVATE_KEY=tu-vapid-private-key
```

3. Click **"Save Changes"**
4. El servicio se redespleará automáticamente

---

## 🔍 Paso 5: Verificar Deployment

### 5.1 Ver Logs en Tiempo Real

**Desde CLI:**
```bash
# Ver logs de API
render logs alkitu-api --tail

# Ver logs de Web
render logs alkitu-web --tail
```

**Desde Dashboard:**
```
Dashboard → Service → Logs (pestaña)
```

### 5.2 Verificar Health Checks

**API:**
```bash
# Copiar URL de alkitu-api desde dashboard
curl https://alkitu-api-xxxx.onrender.com/health

# Debe responder:
# {"status":"ok","timestamp":"..."}
```

**Web:**
```bash
# Copiar URL de alkitu-web desde dashboard
curl https://alkitu-web-xxxx.onrender.com

# Debe responder con HTML de Next.js
```

**⚠️ Primera Carga:** Si el servicio está "dormido", esperarás 30-60 segundos. Esto es normal en free tier.

### 5.3 Verificar en Navegador

1. Abrir URL del frontend: `https://alkitu-web-xxxx.onrender.com`
2. **Primera carga:** Puede tardar 30-60s (servicio despertando)
3. **Cargas siguientes:** Instantáneas
4. Verificar que carga correctamente sin errores de CORS

---

## 🌐 Paso 6: Dominio Personalizado (Opcional)

### 6.1 Agregar Dominio Custom

**Para Frontend:**
1. Dashboard → **alkitu-web** → **Settings** → **Custom Domains**
2. Click **"Add Custom Domain"**
3. Ingresar: `tudominio.com`
4. Render te dará un CNAME target

**Para Backend:**
1. Dashboard → **alkitu-api** → **Settings** → **Custom Domains**
2. Click **"Add Custom Domain"**
3. Ingresar: `api.tudominio.com`
4. Copiar CNAME target

### 6.2 Configurar DNS

En tu proveedor de DNS (GoDaddy, Namecheap, Cloudflare, etc.):

```
# Frontend
Type: CNAME
Name: @  (o tudominio.com)
Target: alkitu-web-xxxx.onrender.com
TTL: 300

# Backend
Type: CNAME
Name: api
Target: alkitu-api-xxxx.onrender.com
TTL: 300
```

### 6.3 Actualizar CORS

Una vez que el dominio esté activo:

1. Dashboard → **alkitu-api** → **Environment**
2. Actualizar `CORS_ORIGINS`:
   ```env
   CORS_ORIGINS=https://tudominio.com,https://www.tudominio.com
   ```
3. Save Changes

---

## 🔄 CI/CD Automático

Render hace deploy automático cuando haces push a GitHub:

```bash
# Hacer cambios
git add .
git commit -m "feat: nueva funcionalidad"
git push origin main

# Render detectará el cambio y desplegará automáticamente
# Ver progreso en Dashboard o:
render logs alkitu-api --tail
```

---

## 📊 Monitoreo

### Ver Métricas

Dashboard → Service → Metrics:
- CPU usage
- Memory usage
- Request count
- Response times

### Configurar Alertas (Opcional)

Dashboard → Service → Settings → Notifications:
- Email on deploy failure
- Slack/Discord webhooks

---

## 💤 Gestionar el "Sleep" del Free Tier

### Opción 1: Aceptar el Sleep (Recomendado para Free)

- ✅ Cumple con Terms of Service
- ✅ Costo: $0
- ⚠️ Primera carga: 30-60s

### Opción 2: Upgrade a Starter ($7/mes por servicio)

```
Dashboard → Service → Settings → Plan
→ Upgrade to Starter

Beneficios:
- ✅ Sin sleep automático
- ✅ Arranque inmediato
- ✅ 0.5 CPU (vs 0.1 en free)

Costo:
API: $7/mes
Web: $7/mes (o gratis si usas Static Site)
Total: $7-14/mes
```

### Opción 3: Ping Service (⚠️ No Recomendado)

**NO hagas esto** - viola Terms of Service de Render:
```bash
# ❌ NO USAR
# Hacer ping cada 10min para mantener despierto
# Render puede suspender tu cuenta
```

---

## 🐛 Troubleshooting

### Error: "Build Failed"

```bash
# Ver logs detallados
render logs alkitu-api --tail 100

# Causas comunes:
# 1. Faltan dependencies en package.json
# 2. TypeScript errors
# 3. Prisma schema incorrecta

# Verificar localmente:
cd packages/api
npm ci
npx prisma generate
npm run build
```

### Error: "Cannot connect to database"

1. Verificar `DATABASE_URL` en Environment Variables
2. Verificar IP Whitelist en MongoDB Atlas (debe ser `0.0.0.0/0`)
3. Verificar username/password en connection string
4. Test desde CLI:
   ```bash
   render shell alkitu-api
   # Dentro del shell:
   npx prisma db pull
   ```

### Error: "CORS policy"

1. Verificar `CORS_ORIGINS` en API service
2. Debe incluir URL exacta del frontend (con https://)
3. Sin trailing slash
4. Ejemplo correcto: `https://alkitu-web-xxxx.onrender.com`

### Servicio "Dormido" - Carga Lenta

Esto es **normal** en free tier:
- Primera carga: 30-60s
- Solución 1: Aceptarlo (para demos/portfolio)
- Solución 2: Upgrade to Starter ($7/mes, sin sleep)

---

## 💰 Costos

### Free Tier (Actual)

```
API Service:      $0/mes
Web Service:      $0/mes
MongoDB Atlas:    $0/mes (M0 free tier)
Resend:           $0/mes (100 emails/día)
------------------------
TOTAL:            $0/mes ✅
```

**Limitaciones:**
- Sleep después 15min inactividad
- 512MB RAM por servicio
- 0.1 CPU compartida

### Si Upgrades a Starter

```
API (Starter):    $7/mes
Web (Starter):    $7/mes
MongoDB Atlas:    $0/mes
Resend:           $0/mes
------------------------
TOTAL:            $14/mes

Beneficios:
- Sin sleep
- 0.5 CPU
- Mejor performance
```

---

## ✅ Checklist Final

- [ ] Render CLI instalado y autenticado
- [ ] JWT secret generado
- [ ] VAPID keys generadas
- [ ] MongoDB Atlas configurado (IP whitelist 0.0.0.0/0)
- [ ] Resend API key obtenida
- [ ] Blueprint deployed (render.yaml aplicado)
- [ ] Variables secretas configuradas en API service
- [ ] Variables secretas configuradas en Web service
- [ ] Health check API funciona
- [ ] Frontend carga correctamente
- [ ] Sin errores de CORS
- [ ] Logs sin errores críticos

---

## 🎉 ¡Listo!

Tu aplicación está en producción en Render Free Tier.

**URLs de acceso:**
- Backend: `https://alkitu-api-xxxx.onrender.com`
- Frontend: `https://alkitu-web-xxxx.onrender.com`

**Siguiente:**
- Probar funcionalidad completa
- Monitorear logs primeros días
- Decidir si upgradelar a Starter cuando tengas usuarios reales

---

## 📞 Soporte

- [Render Docs](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)
- [Support](https://render.com/support)

---

## 🔄 Migrar a Railway Después (si lo necesitas)

Si decides que necesitas mejor performance:

1. Seguir `DEPLOY-RAILWAY.md`
2. Configurar servicios en Railway
3. Actualizar DNS
4. Eliminar servicios de Render

Railway ventajas vs Render Free:
- ✅ Sin sleep ($12-18/mes)
- ✅ Redis incluido
- ✅ Mejor CPU/RAM
- ✅ Arranque inmediato
