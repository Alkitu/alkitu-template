# Guía de Uso del Sitemap - Alkitu Template

Esta guía explica cómo utilizar, mantener y actualizar el sitemap de la aplicación.

---

## 📖 Navegación del Sitemap

### Estructura del Sitemap

El sitemap está organizado jerárquicamente:

```
README.md (índice principal)
├── Rutas Públicas
│   ├── Autenticación (10 rutas)
│   └── Otras (2 rutas)
├── Rutas de ADMIN (25+ rutas)
│   ├── Dashboard
│   ├── Users
│   ├── Requests
│   ├── Catalog
│   ├── Chat
│   ├── Channels
│   ├── Notifications
│   ├── Settings
│   └── Email Templates
├── Rutas de CLIENT (7 rutas)
├── Rutas de EMPLOYEE (3 rutas)
└── Rutas Compartidas (7 rutas)
```

### Cómo Buscar una Ruta

1. **Por rol**: Usa el índice del README.md y navega a la sección del rol específico
2. **Por servicio**: Busca en las subsecciones (ej: "Chat", "Catalog", "Requests")
3. **Por URL**: Usa Ctrl+F (o Cmd+F) en el README.md para buscar la ruta exacta

---

## 🖼️ Visualización de Screenshots

### Formatos Disponibles

Todos los screenshots están en formato PNG con resolución 1920x1080.

### Visualización en Markdown

Los screenshots están embebidos en el README.md:
```markdown
![Descripción](screenshots/carpeta/nombre.png)
```

### Visualización en Navegador

Puedes abrir los archivos PNG directamente desde la carpeta `screenshots/`:
```
docs/sitemap/screenshots/admin/dashboard/index.png
```

---

## 🔄 Actualización del Sitemap

### Agregar Nueva Ruta

#### Paso 1: Identificar la ruta

```bash
# Ubicación en el proyecto
packages/web/src/app/[lang]/(private|public)/ruta/nueva/page.tsx
```

#### Paso 2: Capturar screenshot

**Manual**:
1. Iniciar servidor: `npm run dev`
2. Configurar navegador:
   - Idioma: Español
   - Tema: Light
   - Viewport: 1920x1080
3. Navegar a la ruta: `http://localhost:3000/es/ruta/nueva`
4. Tomar screenshot full-page
5. Guardar en carpeta apropiada: `screenshots/[rol]/[servicio]/nombre.png`

**Con Playwright**:
```typescript
// Usar Playwright MCP o script automatizado
await page.goto('http://localhost:3000/es/ruta/nueva');
await page.waitForLoadState('networkidle');
await page.screenshot({
  path: 'screenshots/rol/servicio/nombre.png',
  fullPage: true
});
```

#### Paso 3: Actualizar README.md

Agregar entrada en la tabla correspondiente:

```markdown
| # | Página | Ruta | Descripción | Screenshot |
|---|--------|------|-------------|------------|
| X | Nombre | `/es/ruta/nueva` | Descripción clara | ![Nombre](screenshots/rol/servicio/nombre.png) |
```

#### Paso 4: Actualizar contadores

Actualizar la sección "Resumen Estadístico" con los nuevos totales.

---

### Re-capturar Screenshots Existentes

Cuando una página cambie visualmente:

1. Navegar a la ruta
2. Capturar nuevo screenshot con el mismo nombre
3. Sobrescribir el archivo anterior
4. No es necesario actualizar el README.md (el link ya existe)

---

### Eliminar Ruta Obsoleta

Si una ruta ya no existe:

1. Eliminar la entrada de la tabla en README.md
2. Eliminar el screenshot correspondiente
3. Actualizar contadores en "Resumen Estadístico"
4. Agregar nota en el commit: `docs(sitemap): remove obsolete route /ruta/vieja`

---

## 🤖 Automatización con Scripts

### Script de Captura Masiva (Playwright)

Crear `scripts/capture-screenshots.ts`:

```typescript
import { chromium, Browser, Page } from 'playwright';

const routes = {
  public: [
    { path: '/es/auth/login', name: 'login' },
    { path: '/es/auth/register', name: 'register' },
    // ... más rutas
  ],
  admin: [
    { path: '/es/admin/dashboard', name: 'dashboard' },
    { path: '/es/admin/users', name: 'users-list' },
    // ... más rutas
  ],
  // ... otros roles
};

async function captureScreenshots() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    locale: 'es-ES',
    colorScheme: 'light'
  });

  // Capturar rutas públicas
  for (const route of routes.public) {
    const page = await context.newPage();
    await page.goto(`http://localhost:3000${route.path}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: `docs/sitemap/screenshots/public/${route.name}.png`,
      fullPage: true
    });
    await page.close();
  }

  // Capturar rutas protegidas con login
  // ... implementar login y captura por rol

  await browser.close();
}

captureScreenshots();
```

Ejecutar:
```bash
npx ts-node scripts/capture-screenshots.ts
```

---

## 🧪 Validación del Sitemap

### Checklist de Validación

Usar esta checklist antes de cada commit al sitemap:

- [ ] Todas las rutas en README.md tienen screenshot
- [ ] Todos los screenshots existen en el filesystem
- [ ] No hay links rotos en README.md
- [ ] Screenshots están en español
- [ ] Screenshots están en modo light
- [ ] Nombres de archivos siguen convención (kebab-case)
- [ ] Carpetas están organizadas por rol/servicio
- [ ] Contadores en "Resumen Estadístico" son correctos
- [ ] Fecha de "Última actualización" es actual

### Script de Validación

Crear `scripts/validate-sitemap.ts`:

```typescript
import fs from 'fs';
import path from 'path';

function validateSitemap() {
  const readmePath = 'docs/sitemap/README.md';
  const screenshotsDir = 'docs/sitemap/screenshots';

  // Leer README.md
  const readme = fs.readFileSync(readmePath, 'utf-8');

  // Extraer todos los paths de screenshots del markdown
  const screenshotPaths = readme.match(/!\[.*?\]\((screenshots\/.*?\.png)\)/g);

  if (!screenshotPaths) {
    console.error('❌ No screenshots found in README.md');
    return;
  }

  let missingFiles = 0;
  let foundFiles = 0;

  screenshotPaths.forEach(match => {
    const pathMatch = match.match(/screenshots\/(.*?\.png)/);
    if (pathMatch) {
      const relativePath = pathMatch[1];
      const fullPath = path.join('docs/sitemap/screenshots', relativePath);

      if (fs.existsSync(fullPath)) {
        foundFiles++;
      } else {
        console.error(`❌ Missing: ${fullPath}`);
        missingFiles++;
      }
    }
  });

  console.log(`\n📊 Validation Results:`);
  console.log(`✅ Found: ${foundFiles} screenshots`);
  console.log(`❌ Missing: ${missingFiles} screenshots`);

  if (missingFiles === 0) {
    console.log('\n🎉 All screenshots are present!');
  } else {
    console.log('\n⚠️ Some screenshots are missing. Please update.');
  }
}

validateSitemap();
```

Ejecutar:
```bash
npx ts-node scripts/validate-sitemap.ts
```

---

## 🎯 Convenciones de Nombres

### Archivos de Screenshots

Usar **kebab-case** para nombres de archivos:

✅ **Correcto**:
- `login.png`
- `users-list.png`
- `create-request.png`
- `detail-[id].png`

❌ **Incorrecto**:
- `Login.png` (PascalCase)
- `users_list.png` (snake_case)
- `createRequest.png` (camelCase)

### Carpetas

Usar nombres descriptivos y en minúsculas:

✅ **Correcto**:
- `screenshots/admin/dashboard/`
- `screenshots/client/requests/`
- `screenshots/public/auth/`

❌ **Incorrecto**:
- `screenshots/Admin/Dashboard/`
- `screenshots/client-requests/`

### Rutas Dinámicas

Para rutas con parámetros dinámicos, usar placeholder:

```
detail-[id].png
conversation-[conversationId].png
user-[email].png
```

---

## 📋 Tareas Comunes

### Actualizar Después de Refactor UI

1. Identificar rutas afectadas
2. Re-capturar screenshots de esas rutas
3. Verificar que los links sigan funcionando
4. Commit: `docs(sitemap): update screenshots after UI refactor`

### Actualizar Después de Nueva Feature

1. Crear carpeta si es nuevo servicio
2. Capturar screenshots de nuevas rutas
3. Agregar entradas en README.md
4. Actualizar contadores
5. Commit: `docs(sitemap): add screenshots for [feature-name]`

### Revisar Sitemap Trimestral

Cada 3 meses, hacer revisión completa:

1. Verificar que todas las rutas sigan existiendo
2. Re-capturar screenshots para reflejar cambios UI
3. Eliminar rutas obsoletas
4. Agregar rutas nuevas que falten
5. Validar con script de validación
6. Commit: `docs(sitemap): quarterly update Q[X] 2026`

---

## 🚨 Troubleshooting

### Screenshots no se visualizan en GitHub

**Problema**: Los paths relativos no funcionan en GitHub.

**Solución**: Usar paths relativos desde la raíz del documento:
```markdown
![Login](screenshots/public/auth/login.png)
```

### Screenshots desactualizados

**Problema**: La UI cambió pero los screenshots son viejos.

**Solución**: Re-capturar y sobrescribir los archivos PNG.

### Ruta nueva no aparece

**Problema**: Agregaste una ruta pero no aparece en el sitemap.

**Solución**:
1. Agregar entrada en la tabla correspondiente del README.md
2. Capturar y guardar screenshot
3. Verificar que el path del screenshot sea correcto

---

## 📚 Referencias

- **Playwright Docs**: https://playwright.dev/docs/screenshots
- **Markdown Images**: https://www.markdownguide.org/basic-syntax/#images
- **Atomic Design**: Ver `/docs/00-conventions/atomic-design-architecture.md`

---

## 🤝 Contribución

Para contribuir al sitemap:

1. Fork el repositorio
2. Crear branch: `docs/sitemap-update-[descripción]`
3. Hacer cambios siguiendo esta guía
4. Ejecutar script de validación
5. Crear PR con descripción clara de cambios

---

**Última actualización**: 2026-02-09
**Mantenedores**: Alkitu Development Team
