# Deploy en Render - Guía Paso a Paso

Esta guía cubre el deploy de alkitu-template en Render (Free Tier) usando **pnpm** como package manager.

## Pre-requisitos

- Cuenta en [Render.com](https://render.com)
- MongoDB Atlas configurado (free tier)
- Repositorio en GitHub
- Render CLI instalado (`brew install render`)

## Arquitectura de Deploy

```
render.yaml (Infrastructure as Code)
├── alkitu-api  (NestJS backend)  → https://alkitu-api.onrender.com
└── alkitu-web  (Next.js frontend) → https://alkitu-web.onrender.com
```

---

## Build Commands

Los build commands deben configurarse tanto en `render.yaml` como en el **dashboard de Render** (Settings > Build Command). El dashboard tiene prioridad sobre el yaml.

### alkitu-api

```bash
npm install -g pnpm@9 && NODE_ENV=development pnpm install --no-frozen-lockfile && pnpm exec prisma generate --schema=packages/api/prisma/schema.prisma && pnpm run build:shared && pnpm run build:api
```

### alkitu-web

```bash
npm install -g pnpm@9 && NODE_ENV=development pnpm install --no-frozen-lockfile && pnpm exec prisma generate --schema=packages/api/prisma/schema.prisma && pnpm run build:shared && pnpm run build:web
```

### Start Commands

- **API:** `bash scripts/start-api-production.sh`
- **Web:** `cd packages/web && pnpm start`

---

## Gotchas Importantes (pnpm + Render)

### 1. NODE_ENV=production omite devDependencies

Render configura `NODE_ENV=production` como env var. Esto hace que **pnpm skip devDependencies** (prisma, typescript, @types/*) que son necesarias para compilar.

**Fix:** Usar `NODE_ENV=development pnpm install` en el buildCommand. Solo afecta el install, el runtime sigue en production.

### 2. El script `prepare` puede abortar la instalación

`package.json` tiene un script `prepare` que ejecuta `git submodule update`. Si el submodule es un repo privado (como `design-system`), falla en Render y aborta `pnpm install` silenciosamente.

**Fix:** El script usa `|| true` para continuar si falla:
```json
"prepare": "git submodule update --init --recursive || true"
```

### 3. No usar `npx` para Prisma

`npx prisma generate` descarga la **última versión global** de Prisma (v7+), que tiene breaking changes. Siempre usar `pnpm exec prisma` para respetar la versión del lockfile.

### 4. No usar `--frozen-lockfile` si el lockfile puede estar desincronizado

Al cambiar el workspace (agregar/quitar packages), el lockfile queda desincronizado. `--frozen-lockfile` falla silenciosamente en pnpm sin instalar nada.

**Fix:** Usar `--no-frozen-lockfile` hasta que el lockfile esté estable.

### 5. Submodules privados no funcionan en Render

Render no tiene SSH keys para clonar repos privados. El submodule `design-system` no se clona y los workspace packages dentro de él no existen.

**Fix:** No incluir packages del submodule en `pnpm-workspace.yaml` para el deploy:
```yaml
packages:
  - 'packages/api'
  - 'packages/web'
  - 'packages/shared'
  - 'packages/mobile'
  # design-system packages se excluyen (repo privado)
```

### 6. Dependencias phantom con pnpm

pnpm tiene strict hoisting — cada package solo ve sus propias dependencias. Si un import funciona con npm pero no está declarado en package.json, falla con pnpm.

Dependencias que se tuvieron que agregar explícitamente a `packages/api`:
- `react` y `@types/react` (email templates JSX)
- `express` (tRPC adapters)
- `@types/multer` y `@types/express` (tipos para file upload)

### 7. Node.js version

Render usa la última versión de Node por defecto (v25+ bleeding edge). Pinear a LTS con `.node-version`:
```
22
```

### 8. El dashboard overrides render.yaml

Cambios en `render.yaml` **no se sincronizan automáticamente** al dashboard de Render. Si cambias el buildCommand en el yaml, debes cambiarlo también manualmente en Dashboard > Service > Settings > Build Command.

---

## Variables de Entorno

### Configuradas en render.yaml (automáticas)

| Variable | Servicio | Valor |
|---|---|---|
| `NODE_ENV` | ambos | `production` |
| `PORT` | ambos | `10000` |
| `JWT_EXPIRES_IN` | api | `7d` |
| `EMAIL_FROM` | api | `noreply@alkitu.com` |
| `CORS_ORIGINS` | api | URL del web service |
| `API_URL` | api | URL del api service |
| `APP_URL` | api | URL del web service |
| `FRONTEND_URL` | api | URL del web service |
| `NEXT_PUBLIC_API_URL` | web | URL del api service |
| `NEXT_PUBLIC_APP_URL` | web | URL del web service |
| `NEXT_TELEMETRY_DISABLED` | web | `1` |
| `VAPID_SUBJECT` | web | `mailto:admin@alkitu.com` |

### Configurar manualmente en Dashboard (secrets)

| Variable | Servicio | Descripción |
|---|---|---|
| `DATABASE_URL` | api | MongoDB Atlas connection string |
| `JWT_SECRET` | api | `openssl rand -base64 32` |
| `RESEND_API_KEY` | api | Desde resend.com |
| `GOOGLE_DRIVE_CLIENT_EMAIL` | api | Service account email |
| `GOOGLE_DRIVE_PRIVATE_KEY` | api | Service account key |
| `GOOGLE_DRIVE_PROJECT_ID` | api | GCP project ID |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | api | Carpeta raíz en Drive |
| `GOOGLE_CLIENT_ID` | api | OAuth (login con Google) |
| `GOOGLE_CLIENT_SECRET` | api | OAuth (login con Google) |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | web | `npx web-push generate-vapid-keys` |
| `VAPID_PRIVATE_KEY` | web | Del mismo comando |

---

## Troubleshooting

### Build falla sin output de pnpm install

**Causa:** `NODE_ENV=production` omitiendo devDependencies.
**Fix:** Agregar `NODE_ENV=development` antes de `pnpm install`.

### "Command prisma not found"

**Causa:** devDependencies no instaladas o `npx` usando versión global.
**Fix:** Usar `pnpm exec prisma` y asegurar que devDeps se instalan.

### "Prisma schema validation - url no longer supported"

**Causa:** `npx prisma` descargó Prisma v7 (breaking change).
**Fix:** Usar `pnpm exec prisma` que respeta la v6 del lockfile.

### Service Worker redirect loop en browser

**Causa:** Service worker cacheado de deploy anterior.
**Fix:** Abrir en ventana de incógnito o limpiar cache del browser.

### "Cannot connect to database"

1. Verificar `DATABASE_URL` en Environment Variables
2. Verificar IP Whitelist en MongoDB Atlas (`0.0.0.0/0`)
3. Verificar username/password en connection string

### DriveService crash al iniciar

**Causa:** Variables de Google Drive no configuradas.
**Fix:** Configurar `GOOGLE_DRIVE_CLIENT_EMAIL`, `GOOGLE_DRIVE_PRIVATE_KEY`, `GOOGLE_DRIVE_PROJECT_ID` en el dashboard.

---

## Free Tier Limitaciones

- Servicios se "duermen" después de 15 minutos de inactividad
- Primera carga tarda 30-60 segundos al despertar
- 512MB RAM por servicio
- 0.1 CPU compartida

---

## Checklist de Deploy

- [ ] `.node-version` con `22` en el repo
- [ ] `render.yaml` actualizado con pnpm commands
- [ ] Build commands actualizados en **dashboard** de Render
- [ ] `pnpm-workspace.yaml` sin packages de submodules privados
- [ ] Variables secretas configuradas en dashboard (API + Web)
- [ ] MongoDB Atlas IP whitelist incluye `0.0.0.0/0`
- [ ] Health check API funciona (`/health`)
- [ ] Frontend carga correctamente
- [ ] Clear build cache después de cambios importantes
