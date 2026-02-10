# 🚀 Guía de Deployment - Alkitu Template

Esta guía cubre diferentes opciones de deployment para tu aplicación Alkitu.

## 📋 Tabla de Contenidos

1. [Opción A: Vercel + Railway (RECOMENDADA)](#opción-a-vercel--railway-recomendada)
2. [Opción B: Todo en Railway](#opción-b-todo-en-railway)
3. [Opción C: AWS ECS con Docker](#opción-c-aws-ecs-con-docker)
4. [Opción D: Google Cloud Run](#opción-d-google-cloud-run)
5. [Opción E: Render](#opción-e-render)

---

## Opción A: Vercel + Railway (RECOMENDADA)

**✅ Pros:**
- Frontend ultrarrápido en Vercel (CDN global)
- Backend en Railway con soporte Docker completo
- Fácil configuración
- Excelente para equipos pequeños

**📦 Servicios:**
- **Frontend (Next.js)**: Vercel
- **Backend (NestJS)**: Railway
- **Database**: MongoDB Atlas (ya configurado)

### 1️⃣ Deploy Backend en Railway

```bash
# 1. Instalar Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Crear nuevo proyecto
railway init

# 4. Ir a la carpeta del backend
cd packages/api

# 5. Deploy
railway up

# 6. Agregar variables de entorno en Railway Dashboard
# https://railway.app/dashboard -> Variables
```

**Variables de entorno necesarias en Railway:**
```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your-secret
RESEND_API_KEY=re_...
CORS_ORIGINS=https://your-app.vercel.app
PORT=3001
```

**Configurar dominio personalizado:**
1. Railway Dashboard → Settings → Domains
2. Agregar: `api.tudominio.com`
3. Configurar DNS (CNAME): `api` → `tu-proyecto.up.railway.app`

### 2️⃣ Deploy Frontend en Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Ir a la carpeta del frontend
cd packages/web

# 3. Deploy
vercel

# 4. Seguir el wizard de deployment
# - Link to existing project? No
# - Project name: alkitu-web
# - Directory: ./packages/web
# - Framework: Next.js
```

**Variables de entorno necesarias en Vercel:**
```env
NEXT_PUBLIC_API_URL=https://api.tudominio.com
NEXT_PUBLIC_APP_URL=https://tudominio.com
```

**Configurar en Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Agregar las variables arriba
3. Redeploy: `vercel --prod`

**Configurar dominio:**
1. Vercel Dashboard → Settings → Domains
2. Agregar tu dominio
3. Configurar DNS según instrucciones

---

## Opción B: Todo en Railway

**✅ Pros:**
- Todo en un solo lugar
- Soporte Docker completo
- Fácil de gestionar

```bash
# 1. Login
railway login

# 2. Crear proyecto
railway init

# 3. Crear servicio para Backend
railway service create api
cd packages/api
railway up

# 4. Crear servicio para Frontend
railway service create web
cd ../web
railway up

# 5. Configurar variables de entorno para cada servicio
# Railway Dashboard → Variables
```

**Variables backend (api):**
```env
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your-secret
RESEND_API_KEY=re_...
PORT=3001
```

**Variables frontend (web):**
```env
NEXT_PUBLIC_API_URL=https://api-tu-proyecto.up.railway.app
NEXT_PUBLIC_APP_URL=https://web-tu-proyecto.up.railway.app
PORT=3000
```

---

## Opción C: AWS ECS con Docker

**✅ Pros:**
- Máximo control
- Escalabilidad empresarial
- Integración con servicios AWS

### Requisitos:
- AWS CLI instalado
- Docker instalado
- Cuenta AWS

### 1️⃣ Configurar ECR (Elastic Container Registry)

```bash
# 1. Autenticar Docker con ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com

# 2. Crear repositorios
aws ecr create-repository --repository-name alkitu-api
aws ecr create-repository --repository-name alkitu-web

# 3. Build y push backend
cd packages/api
docker build -t alkitu-api -f Dockerfile ../..
docker tag alkitu-api:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/alkitu-api:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/alkitu-api:latest

# 4. Build y push frontend
cd ../web
docker build -t alkitu-web -f Dockerfile ../..
docker tag alkitu-web:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/alkitu-web:latest
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/alkitu-web:latest
```

### 2️⃣ Crear Task Definitions

Ver archivos en: `infrastructure/aws/`

### 3️⃣ Crear servicios ECS

```bash
# Crear cluster
aws ecs create-cluster --cluster-name alkitu-cluster

# Crear servicios (usar AWS Console o CLI)
```

---

## Opción D: Google Cloud Run

```bash
# 1. Autenticar
gcloud auth login

# 2. Configurar proyecto
gcloud config set project tu-proyecto-id

# 3. Build y deploy backend
cd packages/api
gcloud builds submit --tag gcr.io/tu-proyecto-id/alkitu-api
gcloud run deploy alkitu-api \
  --image gcr.io/tu-proyecto-id/alkitu-api \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated

# 4. Build y deploy frontend
cd ../web
gcloud builds submit --tag gcr.io/tu-proyecto-id/alkitu-web
gcloud run deploy alkitu-web \
  --image gcr.io/tu-proyecto-id/alkitu-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

---

## Opción E: Render

**✅ Pros:**
- Fácil de usar
- Free tier generoso
- CI/CD automático

### 1️⃣ Deploy Backend

1. Ir a [render.com](https://render.com)
2. New → Web Service
3. Conectar repositorio GitHub
4. Configurar:
   - **Name**: alkitu-api
   - **Root Directory**: packages/api
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
   - **Docker**: Usar Dockerfile

### 2️⃣ Deploy Frontend

1. New → Web Service
2. Configurar:
   - **Name**: alkitu-web
   - **Root Directory**: packages/web
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

---

## 🔒 Seguridad en Producción

### Checklist de Seguridad:

- [ ] Usar HTTPS en todos los endpoints
- [ ] Configurar CORS correctamente
- [ ] Cambiar todos los secrets (JWT_SECRET, etc.)
- [ ] Usar variables de entorno, nunca hardcodear secrets
- [ ] Habilitar rate limiting
- [ ] Configurar CSP (Content Security Policy)
- [ ] Habilitar HSTS
- [ ] Usar MongoDB Atlas con IP whitelist
- [ ] Configurar backups automáticos de BD
- [ ] Monitoreo y alertas (Sentry, LogRocket, etc.)

### Headers de Seguridad (ya configurados en vercel.json):

```json
{
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "origin-when-cross-origin"
}
```

---

## 📊 Monitoreo

### Herramientas recomendadas:

- **Error Tracking**: [Sentry](https://sentry.io)
- **Logging**: [Better Stack](https://betterstack.com) / [LogTail](https://logtail.com)
- **Performance**: [Vercel Analytics](https://vercel.com/analytics)
- **Uptime**: [UptimeRobot](https://uptimerobot.com)

---

## 🔄 CI/CD Automático

### GitHub Actions (Ejemplo)

Ver archivo: `.github/workflows/deploy.yml`

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🆘 Troubleshooting

### Error: "Cannot connect to database"
- Verificar DATABASE_URL
- Verificar IP whitelist en MongoDB Atlas
- Verificar que el servicio tenga acceso a internet

### Error: "CORS policy"
- Verificar CORS_ORIGINS incluye tu frontend
- Verificar protocolo (http vs https)

### Error: "Module not found"
- Verificar que `npm install` se ejecutó correctamente
- Verificar que Prisma Client se generó: `npx prisma generate`

### Error de build en Vercel
- Verificar `vercel.json` apunta a la carpeta correcta
- Verificar variables de entorno configuradas

---

## 📞 Soporte

Para más ayuda, consultar:
- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Railway](https://docs.railway.app)
- [Documentación de NestJS](https://docs.nestjs.com)
- [Documentación de Next.js](https://nextjs.org/docs)
