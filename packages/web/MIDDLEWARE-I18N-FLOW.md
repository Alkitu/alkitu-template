# 🌍 Middleware I18n Flow - Comportamiento Esperado

## ✅ Comportamiento Correcto

### Escenario 1: Visitar ruta con locale explícito
```
Usuario visita: http://localhost:3000/en
                └─> Guarda cookie NEXT_LOCALE=en
                └─> Continúa a /en

Usuario visita: http://localhost:3000/es/dashboard
                └─> Guarda cookie NEXT_LOCALE=es
                └─> Continúa a /es/dashboard
```

### Escenario 2: Visitar ruta SIN locale (con cookie guardada)
```
Usuario previamente visitó: /en (cookie NEXT_LOCALE=en guardada)

Usuario ahora visita: http://localhost:3000/auth/login
                     └─> Lee cookie NEXT_LOCALE=en
                     └─> Redirecciona a /en/auth/login ✅

Usuario ahora visita: http://localhost:3000/dashboard
                     └─> Lee cookie NEXT_LOCALE=en
                     └─> Redirecciona a /en/dashboard ✅
```

### Escenario 3: Visitar ruta SIN locale (sin cookie)
```
Usuario nunca ha visitado el sitio (no hay cookie)

Usuario visita: http://localhost:3000/auth/login
               └─> No encuentra cookie
               └─> Usa DEFAULT_LOCALE="es"
               └─> Redirecciona a /es/auth/login ✅

Usuario visita: http://localhost:3000/
               └─> No encuentra cookie
               └─> Usa DEFAULT_LOCALE="es"
               └─> Redirecciona a /es/ ✅
```

## 🔧 Cambios Aplicados

### 1. Cookie Configuration (CRÍTICO)
```typescript
// ❌ ANTES (bloqueaba cookies en navegación)
sameSite: "strict"

// ✅ AHORA (permite cookies en navegación GET)
sameSite: "lax"
httpOnly: false  // Permite acceso desde cliente
secure: process.env.NODE_ENV === 'production'
```

**Por qué:** `sameSite: "strict"` bloqueaba el envío de cookies en navegaciones normales, causando que el middleware no pudiera leer la preferencia de idioma guardada.

### 2. Validación de Cookie
```typescript
// ✅ Valida que el locale de la cookie sea soportado
const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
const isValidCookieLocale = cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale);
let currentLocale = isValidCookieLocale ? cookieLocale : DEFAULT_LOCALE;
```

### 3. Logs Mejorados
```typescript
console.log(`[I18N] 🌍 Path: ${pathname}`);
console.log(`[I18N] 🍪 Cookie locale: ${cookieLocale || 'none'}`);
console.log(`[I18N] ✅ Current locale: ${currentLocale}`);
console.log(`[I18N] 🔄 Redirecting: ${pathname} → ${newPathname}`);
console.log(`[I18N] 💾 Cookie set: ${COOKIE_NAME}=${currentLocale}`);
```

## 🔄 Orden de Ejecución de Middlewares

```typescript
// proxy.ts
export default chain([withAuthMiddleware, withI18nMiddleware]);
```

**Orden de ejecución** (usando `reduceRight`):
1. ✅ **withI18nMiddleware** - Se ejecuta PRIMERO
   - Detecta locale de URL o cookie
   - Redirecciona si falta locale en URL
   - Setea cookie NEXT_LOCALE

2. ✅ **withAuthMiddleware** - Se ejecuta DESPUÉS
   - Solo se ejecuta si i18n NO redireccionó
   - Verifica autenticación
   - Usa la cookie NEXT_LOCALE para redirects de login

## 🧪 Testing Manual

### Test 1: Guardar preferencia
```bash
1. Abrir http://localhost:3000/en
2. Verificar en DevTools → Application → Cookies:
   - NEXT_LOCALE=en ✅
3. Verificar en consola:
   - [I18N] 💾 Cookie set: NEXT_LOCALE=en ✅
```

### Test 2: Usar preferencia guardada
```bash
1. Con cookie NEXT_LOCALE=en activa
2. Visitar http://localhost:3000/auth/login
3. Verificar redirección a /en/auth/login ✅
4. Verificar en consola:
   - [I18N] 🍪 Cookie locale: en ✅
   - [I18N] 🔄 Redirecting: /auth/login → /en/auth/login ✅
```

### Test 3: Sin cookie (default)
```bash
1. Limpiar cookies en DevTools
2. Visitar http://localhost:3000/auth/login
3. Verificar redirección a /es/auth/login ✅
4. Verificar en consola:
   - [I18N] 🍪 Cookie locale: none ✅
   - [I18N] ✅ Current locale: es ✅
   - [I18N] 🔄 Redirecting: /auth/login → /es/auth/login ✅
```

### Test 4: Cambiar idioma
```bash
1. Con cookie NEXT_LOCALE=es
2. Visitar http://localhost:3000/en/dashboard
3. Verificar que cookie cambia a NEXT_LOCALE=en ✅
4. Visitar http://localhost:3000/settings
5. Verificar redirección a /en/settings ✅
```

## 📝 Notas Importantes

- ✅ La implementación sigue las mejores prácticas de Next.js 15
- ✅ No se requiere root layout (es un anti-pattern)
- ✅ El patrón `[lang]/layout.tsx` es el correcto
- ✅ La cookie persiste por 1 año
- ✅ Compatible con navegación del cliente y servidor

## 🐛 Troubleshooting

### La cookie no persiste
- ✅ Verificar que `sameSite: "lax"` (NO "strict")
- ✅ Verificar que no estés usando modo incógnito
- ✅ Verificar que el dominio sea correcto (localhost)

### Las redirecciones no funcionan
- ✅ Verificar logs en consola `[I18N]`
- ✅ Verificar que el matcher en proxy.ts incluya la ruta
- ✅ Verificar que no haya caché del navegador (Ctrl+Shift+R)

### El locale no cambia
- ✅ Verificar que la URL tenga /es o /en
- ✅ Verificar que el locale esté en SUPPORTED_LOCALES
- ✅ Limpiar cookies y volver a probar
