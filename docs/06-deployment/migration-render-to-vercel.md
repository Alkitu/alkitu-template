# 🚀 Migración: Render → Vercel (Frontend)

Guía rápida para migrar tu frontend de Render a Vercel manteniendo el backend en Render.

---

## 🎯 Overview

**Situación Actual:**
```
Frontend → Render
Backend  → Render
```

**Después de Migración:**
```
Frontend → Vercel ✨ (3x más rápido, 50% más barato)
Backend  → Render (sin cambios)
```

**Tiempo estimado:** 15 minutos
**Downtime:** 0 minutos (deploy antes de cambiar DNS)
**Costo nuevo:** $7/mes (vs $14/mes actual)

---

## ✅ Pre-requisitos

- [ ] Frontend funcionando en Render
- [ ] Backend funcionando en Render
- [ ] Acceso a GitHub del repositorio
- [ ] URLs actuales guardadas:
  - Frontend Render: `https://alkitu-web-xxxx.onrender.com`
  - Backend Render: `https://alkitu-api-xxxx.onrender.com`

---

## 📋 Paso 1: Preparar Vercel (5 min)

### 1.1 Crear Cuenta

1. Ir a [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Elegir **"Continue with GitHub"**
4. Autorizar Vercel en GitHub

### 1.2 Instalar Vercel CLI (Opcional)

```bash
npm install -g vercel

# Login
vercel login
```

---

## 🚀 Paso 2: Deploy en Vercel (5 min)

### Opción A: Desde Dashboard (Recomendado)

1. **Vercel Dashboard** → **"Add New..."** → **"Project"**

2. **Import Git Repository:**
   - Buscar: `alkitu-template`
   - Click **"Import"**

3. **Configure Project:**
   ```
   Framework Preset: Next.js
   Root Directory: packages/web
   Build Command: npm run build (auto-detectado)
   Output Directory: .next (auto-detectado)
   Install Command: npm install (auto-detectado)
   ```

4. **Environment Variables:**
   Click **"Add"** y agregar:
   ```env
   NEXT_PUBLIC_API_URL=https://alkitu-api-xxxx.onrender.com
   NEXT_PUBLIC_APP_URL=https://alkitu-web-vercel.app
   NEXT_PUBLIC_VAPID_PUBLIC_KEY=BFn_7zAfVdbvwehLaJpRRk6xgyfvtF5tuVEx20OUZel--Xfi65ngn127oD6AueLthiYFC2GpmUJsiX13WKfTJuU
   VAPID_PRIVATE_KEY=P1X7sFOfuEUNNrtCFH72Jdw9VIIg70YPO9lyJecJYU4
   VAPID_SUBJECT=mailto:admin@alkitu.com
   NODE_ENV=production
   ```

   **IMPORTANTE:** Usar la URL del backend en Render (sin cambios)

5. Click **"Deploy"**

6. Esperar 2-3 minutos... ☕

7. **¡Listo!** Vercel te dará una URL:
   ```
   https://alkitu-template-xxxx.vercel.app
   ```

### Opción B: Desde CLI

```bash
# Ir a la carpeta del frontend
cd packages/web

# Deploy
vercel

# Seguir el wizard:
# - Set up and deploy? Yes
# - Which scope? (tu cuenta)
# - Link to existing project? No
# - Project name? alkitu-web
# - Directory? ./ (current)
# - Override settings? No

# Deploy a producción
vercel --prod
```

---

## 🔧 Paso 3: Actualizar Backend CORS (2 min)

Ahora que el frontend está en Vercel, actualiza el backend en Render:

1. **Render Dashboard** → Service **alkitu-api**
2. **Environment** tab
3. Actualizar `CORS_ORIGINS`:

   ```env
   # Agregar la nueva URL de Vercel
   CORS_ORIGINS=https://alkitu-template-xxxx.vercel.app,https://alkitu-web-xxxx.onrender.com
   ```

   **Nota:** Incluye ambas URLs (Vercel y Render) temporalmente

4. Click **"Save Changes"**
5. Render redeployará (1-2 min)

---

## ✅ Paso 4: Verificar (2 min)

### 4.1 Test Vercel Frontend

```bash
# Abrir en navegador
https://alkitu-template-xxxx.vercel.app

# Verificar:
✅ Página carga
✅ No errores en console (F12)
✅ Login funciona
✅ Peticiones API funcionan
```

### 4.2 Test CORS

```javascript
// En console del navegador (F12)
fetch('https://alkitu-api-xxxx.onrender.com/health')
  .then(r => r.json())
  .then(console.log)

// Debe responder sin errores CORS:
// {status: "ok", timestamp: "..."}
```

---

## 🌐 Paso 5: Dominio Custom (Opcional)

### Si tienes dominio (ej: app.tudominio.com):

1. **Vercel Dashboard** → Project → **"Settings"** → **"Domains"**
2. Click **"Add"**
3. Ingresar: `app.tudominio.com`
4. Vercel te dará las instrucciones DNS

**En tu DNS provider:**
```
Type: CNAME
Name: app
Target: cname.vercel-dns.com
TTL: 300
```

5. Esperar propagación (5-60 min)
6. SSL activado automáticamente ✅

### Actualizar Variables

**Vercel:**
```env
NEXT_PUBLIC_APP_URL=https://app.tudominio.com
```

**Render Backend:**
```env
CORS_ORIGINS=https://app.tudominio.com
APP_URL=https://app.tudominio.com
```

---

## 🗑️ Paso 6: Cleanup Render Frontend (Opcional)

Una vez que todo funciona en Vercel:

1. **Render Dashboard** → Service **alkitu-web**
2. **Settings** → Scroll down → **"Delete Service"**
3. Confirmar

**Ahorro:** $7/mes 💰

---

## 📊 Comparación Antes/Después

### ANTES (Todo en Render)
```
Frontend: $7/mes en Render
Backend:  $7/mes en Render
Total:    $14/mes

Performance:
- First Paint: 800ms
- Lighthouse: 75-85
- Image Optimization: Manual
```

### DESPUÉS (Vercel + Render)
```
Frontend: $0/mes en Vercel ✨
Backend:  $7/mes en Render
Total:    $7/mes

Performance:
- First Paint: 300ms (3x más rápido!)
- Lighthouse: 90-100
- Image Optimization: Automática
```

**Ahorro: $84/año + Mejor Performance 🎉**

---

## 🎨 Nuevas Features con Vercel

### 1. Image Optimization Automática

```jsx
// Tu código actual:
import Image from 'next/image'

<Image
  src="/screenshot.png"
  width={800}
  height={600}
/>

// Vercel automáticamente:
// ✅ Convierte a WebP/AVIF
// ✅ Optimiza tamaño
// ✅ Lazy loading
// ✅ Responsive images
```

### 2. Preview Deployments

```bash
# Cada Pull Request obtiene URL de preview automática
git checkout -b nueva-feature
git push origin nueva-feature

# Vercel crea: https://alkitu-template-git-nueva-feature.vercel.app
# Para testing antes de merge
```

### 3. Analytics

1. **Vercel Dashboard** → **"Analytics"**
2. Ver gratis:
   - Core Web Vitals
   - Real User Monitoring
   - Performance insights

### 4. Edge Functions (Avanzado)

```typescript
// middleware.ts - Corre en Edge (cerca del usuario)
export function middleware(request: NextRequest) {
  // A/B testing
  // Redirects
  // Authentication checks
}
```

---

## 🔄 Rollback (Si algo falla)

Si necesitas volver a Render:

### Opción 1: Mantener ambos (sin costo extra)

```
Frontend: Vercel (nueva URL)
Frontend: Render (URL vieja) - mantener activo temporalmente
Backend:  Render

CORS: Permitir ambas URLs
```

### Opción 2: Cambiar DNS de vuelta

Si usas dominio custom:
```
DNS → app.tudominio.com
Cambiar CNAME de vercel-dns.com → alkitu-web.onrender.com
```

Tiempo de rollback: ~5 minutos

---

## 🧪 Testing Checklist

- [ ] ✅ Frontend carga en Vercel
- [ ] ✅ No errores CORS
- [ ] ✅ Login funciona
- [ ] ✅ Imágenes cargan correctamente
- [ ] ✅ Peticiones API funcionan
- [ ] ✅ Temas cargan OK
- [ ] ✅ Forms funcionan
- [ ] ✅ Navigation funciona
- [ ] ✅ SSL activo (candado verde)
- [ ] ✅ Performance mejorada (test con Lighthouse)

---

## 📈 Monitoreo Post-Migración

### Vercel Analytics

```
Dashboard → Analytics → Real Experience Score

Métricas clave:
- First Contentful Paint < 500ms ✅
- Largest Contentful Paint < 2.5s ✅
- Cumulative Layout Shift < 0.1 ✅
```

### Logs

```
Vercel Dashboard → Deployments → [tu deploy] → Logs

Runtime Logs:
- Function invocations
- Errors
- Performance
```

---

## 💡 Tips y Mejores Prácticas

### 1. Variables de Entorno por Ambiente

```
Vercel → Settings → Environment Variables

Production:
- NEXT_PUBLIC_API_URL=https://api.tudominio.com

Preview:
- NEXT_PUBLIC_API_URL=https://api-staging.tudominio.com

Development:
- NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Cache Control

```javascript
// next.config.js
module.exports = {
  images: {
    minimumCacheTTL: 60, // Cache images 60 segundos
  },
}
```

### 3. Redirects

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-path',
        destination: '/new-path',
        permanent: true,
      },
    ]
  },
}
```

---

## 🆘 Troubleshooting

### Build Fails en Vercel

**Síntoma:** "Build failed" en Vercel

**Soluciones:**
```bash
# 1. Verificar Root Directory
Vercel → Settings → Root Directory
Debe ser: packages/web

# 2. Test build local
cd packages/web
npm run build

# 3. Verificar Node version
# En package.json agregar:
"engines": {
  "node": ">=18.0.0"
}
```

### CORS Errors después de migración

**Síntoma:** "CORS policy" en console

**Solución:**
```bash
# Backend Render → Environment
CORS_ORIGINS=https://alkitu-template-xxxx.vercel.app

# Sin trailing slash!
# Sin http (debe ser https)
```

### Environment Variables no funcionan

**Síntoma:** `undefined` en `process.env.NEXT_PUBLIC_API_URL`

**Solución:**
```bash
# Variables NEXT_PUBLIC_* deben:
# 1. Estar en Vercel Dashboard → Settings → Environment Variables
# 2. Empezar con NEXT_PUBLIC_
# 3. Redeploy después de agregar:

vercel --prod
```

### Imágenes no optimizan

**Síntoma:** Imágenes siguen pesadas

**Solución:**
```jsx
// Usar Next.js Image component
import Image from 'next/image'

// ✅ CORRECTO
<Image src="/photo.jpg" width={800} height={600} />

// ❌ INCORRECTO
<img src="/photo.jpg" />
```

---

## 📞 Soporte

### Vercel

- [Docs](https://vercel.com/docs)
- [Discord Community](https://vercel.com/discord)
- [Status Page](https://vercel-status.com)

### Render

- [Docs](https://render.com/docs)
- [Community Forum](https://community.render.com)
- [Status Page](https://status.render.com)

---

## ✅ Migration Complete!

**Felicidades, has migrado exitosamente!** 🎉

**Beneficios obtenidos:**
- ✅ 50% ahorro ($84/año)
- ✅ 3x mejor performance
- ✅ Image optimization automática
- ✅ Preview deployments
- ✅ Analytics incluidos
- ✅ Mejor Core Web Vitals (SEO)

**Siguiente paso:** Monitorear performance y disfrutar del ahorro 💰

---

## 🔜 Próximas Optimizaciones

1. **Edge Functions** para auth middleware
2. **ISR** (Incremental Static Regeneration) para páginas
3. **A/B Testing** con Edge Middleware
4. **Web Vitals** monitoring y optimización
5. **CDN optimizations** adicionales

Ver: `vercel-advanced-optimizations.md` (próximamente)
