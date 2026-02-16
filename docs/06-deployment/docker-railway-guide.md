# 🐳 Docker Deployment en Railway - Guía Completa

Deploy completo usando Docker containers en Railway para frontend y backend.

---

## 📦 Prerequisitos

Tu proyecto ya tiene:
- ✅ `packages/api/Dockerfile` - Backend (NestJS)
- ✅ `packages/web/Dockerfile` - Frontend (Next.js)
- ✅ `docker-compose.prod.yml` - Configuración producción
- ✅ MongoDB Atlas configurado

---

## 🚀 Opción A: Frontend en Vercel + Backend en Railway (RECOMENDADO)

### Backend en Railway (con Docker)

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Crear proyecto
railway init

# 4. Deploy backend con Docker
cd packages/api
railway up

# Railway detectará automáticamente tu Dockerfile
```

**Variables de entorno en Railway Dashboard:**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb+srv://user:pass@cluster.mongodb.net/alkitu
JWT_SECRET=your-secret-here
RESEND_API_KEY=re_xxxxx
CORS_ORIGINS=https://your-app.vercel.app
API_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
```

### Frontend en Vercel (sin Docker)

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
cd packages/web
vercel

# Vercel hace deployment nativo de Next.js (no usa Docker)
```

**Variables en Vercel Dashboard:**
```env
NEXT_PUBLIC_API_URL=https://your-api.up.railway.app
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## 🚀 Opción B: Todo en Railway con Docker

Ambos servicios usando Docker en Railway.

### 1️⃣ Crear Proyecto Railway

```bash
railway login
railway init
```

### 2️⃣ Deploy Backend con Docker

```bash
# Crear servicio para API
railway service create api

# Deploy desde packages/api
cd packages/api
railway up
```

**Railway detectará automáticamente `Dockerfile`**

**Variables de entorno (Railway Dashboard → Service "api" → Variables):**
```env
NODE_ENV=production
PORT=3001
DATABASE_URL=mongodb+srv://alkitu:password@cluster.mongodb.net/TEMPLATE
JWT_SECRET=your-jwt-secret-32-chars
JWT_EXPIRES_IN=7d
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=info@yourdomain.com
CORS_ORIGINS=https://${{web.RAILWAY_PUBLIC_DOMAIN}}
API_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
APP_URL=https://${{web.RAILWAY_PUBLIC_DOMAIN}}
```

### 3️⃣ Deploy Frontend con Docker

```bash
# Volver a la raíz
cd ../..

# Crear servicio para Web
railway service create web

# Deploy desde packages/web
cd packages/web
railway up
```

**Railway detectará automáticamente `Dockerfile`**

**Variables de entorno (Railway Dashboard → Service "web" → Variables):**
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_API_URL=https://${{api.RAILWAY_PUBLIC_DOMAIN}}
NEXT_PUBLIC_APP_URL=https://${{RAILWAY_PUBLIC_DOMAIN}}
NEXT_TELEMETRY_DISABLED=1
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:admin@yourdomain.com
```

### 4️⃣ Verificar Deployment

```bash
# Ver logs del backend
railway logs --service api

# Ver logs del frontend
railway logs --service web

# Test health check
curl https://your-api-xxxxx.up.railway.app/health
```

---

## 🚀 Opción C: Render (todo con Docker)

Similar a Railway, pero con Render.

### Backend en Render

1. Ir a [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Configurar:
   ```
   Name: alkitu-api
   Root Directory: packages/api
   Environment: Docker
   Docker Command: (auto-detected from Dockerfile)
   ```

### Frontend en Render

1. New → Web Service
2. Configurar:
   ```
   Name: alkitu-web
   Root Directory: packages/web
   Environment: Docker
   Docker Command: (auto-detected from Dockerfile)
   ```

---

## 🐳 Verificar Dockerfiles

### Backend Dockerfile (`packages/api/Dockerfile`)

```bash
# Verificar que existe
ls -lh packages/api/Dockerfile

# Ver contenido
cat packages/api/Dockerfile
```

### Frontend Dockerfile (`packages/web/Dockerfile`)

```bash
# Verificar que existe
ls -lh packages/web/Dockerfile

# Ver contenido
cat packages/web/Dockerfile
```

---

## 🧪 Testing Local con Docker

Antes de deployar, prueba localmente:

```bash
# Build y run backend
cd packages/api
docker build -t alkitu-api .
docker run -p 3001:3001 --env-file ../../.env alkitu-api

# Build y run frontend
cd ../web
docker build -t alkitu-web .
docker run -p 3000:3000 --env-file ../../.env alkitu-web

# O usa docker-compose
cd ../..
docker-compose -f docker-compose.prod.yml up
```

---

## 📊 Comparación de Opciones

| Característica | Vercel+Railway | Todo Railway | Render |
|---------------|----------------|--------------|--------|
| **Frontend CDN** | ✅ Vercel (más rápido) | ❌ Railway | ❌ Render |
| **Docker Support** | ✅ Backend only | ✅ Ambos | ✅ Ambos |
| **Facilidad** | 🟢 Fácil | 🟢 Muy fácil | 🟡 Media |
| **Costo/mes** | $5-15 | $10-20 | $7-15 |
| **CI/CD** | ✅ Auto | ✅ Auto | ✅ Auto |
| **Dominios custom** | ✅ Fácil | ✅ Fácil | ✅ Fácil |

---

## 🔒 Seguridad en Producción

### Checklist Docker Security

- [ ] No exponer secrets en Dockerfile
- [ ] Usar `.dockerignore` para excluir archivos sensibles
- [ ] Usar multi-stage builds para reducir tamaño
- [ ] Ejecutar como non-root user
- [ ] Escanear imágenes con `docker scan`

### Variables de Entorno

```bash
# ❌ MAL - Hardcoded en Dockerfile
ENV JWT_SECRET=my-secret

# ✅ BIEN - Usar variables de entorno del platform
# Railway/Render inyectan las variables automáticamente
```

---

## 🆘 Troubleshooting

### Build Fails

```bash
# Ver logs de build
railway logs --service api --tail 100

# Build localmente para debug
cd packages/api
docker build -t test-api .
```

### Container Crashes

```bash
# Ver logs de runtime
railway logs --service api --follow

# Verificar variables de entorno
railway variables --service api
```

### Cannot Connect to Database

```bash
# Verificar DATABASE_URL
railway variables --service api | grep DATABASE_URL

# Test conexión desde container
railway run --service api npx prisma db pull
```

---

## 📞 Recursos

- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Docker](https://nextjs.org/docs/deployment#docker-image)
- [NestJS Docker](https://docs.nestjs.com/faq/serverless)

---

## ✅ Deployment Checklist

- [ ] Dockerfiles testeados localmente
- [ ] Variables de entorno configuradas
- [ ] MongoDB Atlas configurado
- [ ] CORS configurado correctamente
- [ ] Health endpoints funcionando
- [ ] Dominios custom configurados (opcional)
- [ ] Monitoring configurado (Sentry, etc.)
- [ ] Backups de database automáticos

**¡Tu aplicación con Docker está lista para producción!** 🚀
