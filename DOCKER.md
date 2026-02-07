# 🐳 Guía de Docker - Alkitu Template

Esta guía explica cómo usar Docker para desarrollo y producción.

## 📋 Archivos Docker

```
alkitu-template/
├── docker-compose.dev.yml          # Desarrollo (ya existente)
├── docker-compose.prod.yml         # Producción (nuevo)
├── packages/
│   ├── api/
│   │   ├── Dockerfile              # Producción backend (nuevo)
│   │   └── Dockerfile.dev          # Desarrollo backend (existente)
│   └── web/
│       ├── Dockerfile              # Producción frontend (nuevo)
│       ├── Dockerfile.dev          # Desarrollo frontend (existente)
│       └── Dockerfile.storybook    # Storybook (existente)
└── scripts/
    └── docker-build.sh             # Helper script (nuevo)
```

## 🚀 Quick Start

### Desarrollo Local

```bash
# Iniciar todo (backend + frontend + MongoDB + Redis)
npm run dev:docker

# O usar docker-compose directamente
docker-compose -f docker-compose.dev.yml up
```

### Build para Producción

```bash
# Build backend
./scripts/docker-build.sh backend

# Build frontend
./scripts/docker-build.sh frontend

# Build ambos
./scripts/docker-build.sh all
```

### Probar Imágenes de Producción Localmente

```bash
# Test backend
./scripts/docker-build.sh test

# Ver imágenes construidas
./scripts/docker-build.sh images
```

### Deploy con Docker Compose (Producción)

```bash
# 1. Copiar variables de entorno
cp .env.production.example .env.production

# 2. Editar .env.production con tus valores
nano .env.production

# 3. Iniciar servicios
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# 4. Ver logs
docker-compose -f docker-compose.prod.yml logs -f

# 5. Verificar salud
curl http://localhost:3001/health
curl http://localhost:3000
```

## 🔧 Comandos Útiles

### Ver contenedores corriendo
```bash
docker ps
```

### Ver logs de un servicio específico
```bash
docker-compose -f docker-compose.prod.yml logs -f api
docker-compose -f docker-compose.prod.yml logs -f web
```

### Reiniciar un servicio
```bash
docker-compose -f docker-compose.prod.yml restart api
```

### Detener todo
```bash
docker-compose -f docker-compose.prod.yml down
```

### Detener y eliminar volúmenes
```bash
docker-compose -f docker-compose.prod.yml down -v
```

### Ejecutar comando en contenedor
```bash
# Backend shell
docker-compose -f docker-compose.prod.yml exec api sh

# Frontend shell
docker-compose -f docker-compose.prod.yml exec web sh
```

### Ver uso de recursos
```bash
docker stats
```

## 📊 Optimizaciones de las Imágenes

### Multi-stage Builds
Las imágenes usan multi-stage builds para optimización:

1. **Stage 1 (deps)**: Instala solo dependencias de producción
2. **Stage 2 (builder)**: Build de la aplicación
3. **Stage 3 (runner)**: Imagen final mínima con solo lo necesario

### Tamaño de Imágenes

```bash
# Ver tamaño de imágenes
docker images alkitu-*

# Ejemplo de tamaños optimizados:
# alkitu-api:latest    ~300MB
# alkitu-web:latest    ~200MB
```

### Seguridad

- ✅ Usa usuario no-root
- ✅ Alpine Linux (imagen mínima)
- ✅ Multi-stage builds (menos superficie de ataque)
- ✅ Health checks configurados
- ✅ Dumb-init para manejo correcto de señales

## 🔒 Variables de Entorno en Producción

**NUNCA** commitear archivos `.env` con datos sensibles.

### Para desarrollo local:
```bash
cp .env.example .env
```

### Para producción:
```bash
cp .env.production.example .env.production
# Editar con valores reales
```

### Usar secrets en producción:

**Docker Swarm:**
```bash
echo "secret-value" | docker secret create jwt_secret -
```

**Kubernetes:**
```bash
kubectl create secret generic app-secrets \
  --from-literal=jwt-secret=your-secret
```

**Cloud (Railway/Vercel):**
- Usar dashboard para configurar variables de entorno
- Nunca pasar secrets en el Dockerfile

## 🚨 Troubleshooting

### Error: "Cannot connect to Docker daemon"
```bash
# Verificar que Docker esté corriendo
docker info

# Reiniciar Docker Desktop (Mac/Windows)
```

### Error: "Port already in use"
```bash
# Ver qué está usando el puerto
lsof -i :3001

# Cambiar puerto en docker-compose.yml
ports:
  - "3002:3001"  # Host:Container
```

### Error: "No space left on device"
```bash
# Limpiar imágenes no usadas
docker system prune -a

# Limpiar volúmenes
docker volume prune
```

### Logs no aparecen
```bash
# Verificar que el contenedor esté corriendo
docker ps

# Ver logs con timestamp
docker-compose logs -f --timestamps api
```

## 📈 Monitoreo

### Health Checks

Las imágenes incluyen health checks:

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1
```

Ver estado de salud:
```bash
docker inspect --format='{{.State.Health.Status}}' container_name
```

### Métricas

Para monitoreo avanzado, considerar:
- **Prometheus** + **Grafana**
- **Datadog**
- **New Relic**

## 🔄 CI/CD con Docker

Ver `.github/workflows/deploy-production.yml` para ejemplo de CI/CD automático.

## 📚 Recursos

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Multi-stage Builds](https://docs.docker.com/build/building/multi-stage/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Security](https://docs.docker.com/engine/security/)
