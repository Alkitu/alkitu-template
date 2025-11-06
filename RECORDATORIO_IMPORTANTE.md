# ⚠️ RECORDATORIO CRÍTICO ⚠️

## PUERTO DE DESARROLLO

**SIEMPRE USAR LOCALHOST:3000 - NO 3002**

Este proyecto usa Docker y el puerto correcto es:
- ✅ http://localhost:3000
- ❌ http://localhost:3002

**NUNCA usar npm run dev:web directamente**
**SIEMPRE usar Docker con npm run dev**

## Comandos correctos:
- `npm run dev` (usa Docker)
- `npm run dev:docker` (usa Docker)
- URL: http://localhost:3000

## URLs importantes:
- Theme Editor: http://localhost:3000/es/admin/settings/themes-3.0
- Dashboard: http://localhost:3000/es/admin

**LEER ESTE RECORDATORIO ANTES DE CUALQUIER COMANDO DE DESARROLLO**