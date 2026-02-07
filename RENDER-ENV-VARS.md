# 🔐 Variables de Entorno para Render - Alkitu

**⚠️ IMPORTANTE:** Este archivo contiene credenciales sensibles. NO commitear a Git.

---

## 📦 Service: alkitu-api (Backend)

### Variables a Agregar en Render Dashboard

Dashboard → alkitu-api → Environment → Add Environment Variable

Copia y pega estas variables **UNA POR UNA**:

#### DATABASE_URL
```
mongodb+srv://alkitu:Al123kitu.com@alkitu.bfid3.mongodb.net/TEMPLATE?retryWrites=true&w=majority&appName=alkitu
```

#### JWT_SECRET
```
Om1Vv7WYInmaegoAhwCQVdVgQaraVz+DZtvnh91rMok=
```

#### RESEND_API_KEY
```
re_ZKzycuZM_PtsuwufhWHbotyPCf4toRfQU
```

### Resumen - Variables API (copiar todas juntas)

Si prefieres copiar todas de una vez en el "Bulk Edit":

```env
DATABASE_URL=mongodb+srv://alkitu:Al123kitu.com@alkitu.bfid3.mongodb.net/TEMPLATE?retryWrites=true&w=majority&appName=alkitu
JWT_SECRET=Om1Vv7WYInmaegoAhwCQVdVgQaraVz+DZtvnh91rMok=
RESEND_API_KEY=re_ZKzycuZM_PtsuwufhWHbotyPCf4toRfQU
```

---

## 🎨 Service: alkitu-web (Frontend)

### Variables a Agregar en Render Dashboard

Dashboard → alkitu-web → Environment → Add Environment Variable

Copia y pega estas variables **UNA POR UNA**:

#### NEXT_PUBLIC_VAPID_PUBLIC_KEY
```
BFn_7zAfVdbvwehLaJpRRk6xgyfvtF5tuVEx20OUZel--Xfi65ngn127oD6AueLthiYFC2GpmUJsiX13WKfTJuU
```

#### VAPID_PRIVATE_KEY
```
P1X7sFOfuEUNNrtCFH72Jdw9VIIg70YPO9lyJecJYU4
```

### Resumen - Variables Web (copiar todas juntas)

Si prefieres copiar todas de una vez en el "Bulk Edit":

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BFn_7zAfVdbvwehLaJpRRk6xgyfvtF5tuVEx20OUZel--Xfi65ngn127oD6AueLthiYFC2GpmUJsiX13WKfTJuU
VAPID_PRIVATE_KEY=P1X7sFOfuEUNNrtCFH72Jdw9VIIg70YPO9lyJecJYU4
```

---

## 📋 Checklist de Deployment

### Paso 1: Deploy Blueprint
- [ ] Ir a https://dashboard.render.com
- [ ] New + → Blueprint
- [ ] Conectar repo: alkitu-template
- [ ] Click "Apply"

### Paso 2: Configurar alkitu-api
- [ ] Dashboard → alkitu-api → Environment
- [ ] Agregar las 3 variables de arriba ⬆️
- [ ] Click "Save Changes"
- [ ] Esperar a que se redespliegue (3-5 min)

### Paso 3: Configurar alkitu-web
- [ ] Dashboard → alkitu-web → Environment
- [ ] Agregar las 2 variables de arriba ⬆️
- [ ] Click "Save Changes"
- [ ] Esperar a que se redespliegue (3-5 min)

### Paso 4: Verificar
- [ ] alkitu-api → Logs → Ver "Nest application successfully started"
- [ ] alkitu-web → Logs → Ver "server started on 0.0.0.0:10000"
- [ ] Probar health: `https://alkitu-api-xxxx.onrender.com/health`
- [ ] Abrir web: `https://alkitu-web-xxxx.onrender.com`

---

## 🔍 Troubleshooting

### Si el API falla al conectar a MongoDB:

1. Verificar que el IP whitelist en MongoDB Atlas permite: `0.0.0.0/0`
2. Verificar que la DATABASE_URL no tenga espacios extra
3. Verificar usuario/password son correctos

### Si hay errores de CORS:

1. Esperar a que ambos servicios estén deployed
2. Las URLs se configuran automáticamente con `${{service.RAILWAY_PUBLIC_DOMAIN}}`
3. Si persiste, verificar los logs del API

### Si el servicio tarda mucho en cargar:

- Es normal en free tier (sleep automático)
- Primera carga: 30-60 segundos
- Cargas siguientes: Instantáneas (mientras esté activo <15min)

---

## 📞 Soporte

Si tienes problemas:
1. Revisar logs en Dashboard → Service → Logs
2. Consultar `DEPLOY-RENDER.md` para troubleshooting detallado
3. Render Community: https://community.render.com

---

**🎉 Una vez completado, tendrás:**
- ✅ Backend API funcionando en Render
- ✅ Frontend Web funcionando en Render
- ✅ Costo: $0/mes (free tier)
- ✅ SSL automático
- ✅ Deployments automáticos en cada push
