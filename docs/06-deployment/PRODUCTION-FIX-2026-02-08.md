# Production Dashboard Fix - February 8, 2026

## 🔴 Issues Found

Your production dashboard at `https://alkitu-web.onrender.com` was experiencing critical errors after login:

### 1. **tRPC 404 Errors**
All tRPC API calls were failing with 404:
```
/api/trpc/chatbotConfig.get,theme.getCompanyThemes → 404
/api/trpc/user.me → 404
```

**Root Cause**: The frontend was trying to call `/api/trpc` (a Next.js route), but no proxy route existed. The API is deployed as a separate Render service.

### 2. **React Hydration Error #300**
Users saw "Something went wrong" with React error #300.

**Root Cause**: Server-side rendering expected theme data, but client-side couldn't fetch it due to tRPC 404s, causing HTML mismatch.

### 3. **CORS Blocking**
The API's CORS configuration used `FRONTEND_URL`, but Render only provided `APP_URL`.

**Root Cause**: CORS defaulted to `http://localhost:3000`, blocking production requests from `https://alkitu-web.onrender.com`.

---

## ✅ Fixes Applied

### Fix 1: TrpcProvider Configuration
**File**: `packages/web/src/context/providers/TrpcProvider.tsx`

**Before**:
```typescript
url: process.env.NODE_ENV === 'production'
  ? '/api/trpc'  // ❌ No route exists
  : 'http://localhost:3001/trpc',
```

**After**:
```typescript
url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/trpc`,
// ✅ Uses environment variable pointing to API service
```

### Fix 2: CORS Configuration
**File**: `packages/api/src/main.ts`

**Before**:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  // ❌ FRONTEND_URL not set in production
});
```

**After**:
```typescript
const allowedOrigins = [
  process.env.APP_URL,
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGINS,
  'http://localhost:3000',
].filter(Boolean);

app.enableCors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  // ✅ Checks multiple environment variables
});
```

### Fix 3: Render Environment Variables
**File**: `render.yaml`

**Added**:
```yaml
- key: FRONTEND_URL
  fromService:
    type: web
    name: alkitu-web
    envVarKey: RENDER_EXTERNAL_URL
```

---

## 🚀 Deployment Instructions

### Step 1: Commit and Push Changes

```bash
git add packages/web/src/context/providers/TrpcProvider.tsx
git add packages/api/src/main.ts
git add render.yaml

git commit -m "$(cat <<'EOF'
fix(production): resolve tRPC 404 and CORS issues on Render

Critical production fixes:
- Use NEXT_PUBLIC_API_URL in TrpcProvider for direct API connection
- Update CORS to accept APP_URL, FRONTEND_URL, and CORS_ORIGINS
- Add FRONTEND_URL environment variable to render.yaml

Fixes:
- ❌ tRPC endpoints returning 404
- ❌ React hydration error #300
- ❌ CORS blocking production requests

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

git push origin main
```

### Step 2: Verify Render Deployment

1. **Check Build Logs**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Open `alkitu-api` service → "Logs"
   - Verify build succeeds and shows:
     ```
     Application is running on: https://alkitu-api.onrender.com
     ```

2. **Check Environment Variables**:
   - `alkitu-api` service → "Environment"
   - Verify `FRONTEND_URL` is automatically populated with the web service URL
   - Should be: `https://alkitu-web.onrender.com`

3. **Test API Health**:
   ```bash
   curl https://alkitu-api.onrender.com/health
   ```
   Expected: `{"status":"ok","database":"connected"}`

### Step 3: Verify Frontend Deployment

1. **Check Build Logs**:
   - Open `alkitu-web` service → "Logs"
   - Verify `NEXT_PUBLIC_API_URL` is set during build:
     ```
     NEXT_PUBLIC_API_URL=https://alkitu-api.onrender.com
     ```

2. **Test Dashboard**:
   - Visit: `https://alkitu-web.onrender.com/es/admin/dashboard`
   - Login with admin credentials
   - Dashboard should load **without errors**

### Step 4: Verify in Browser Console

Open browser DevTools (F12) → Console tab:

**Before (Errors)**:
```
❌ /api/trpc/user.me → 404
❌ React error #300
❌ CORS policy blocked
```

**After (Success)**:
```
✅ tRPC requests succeed
✅ No hydration errors
✅ Dashboard loads correctly
```

---

## 🧪 Testing Checklist

- [ ] API health endpoint responds: `https://alkitu-api.onrender.com/health`
- [ ] CORS allows frontend domain (check Network tab for no CORS errors)
- [ ] tRPC requests succeed (no 404 errors)
- [ ] Login redirects to dashboard successfully
- [ ] Dashboard loads without React errors
- [ ] Theme system works (colors load correctly)
- [ ] No console errors in browser DevTools

---

## 🔍 Troubleshooting

### If tRPC Still Returns 404:

1. **Check API logs**:
   ```bash
   # In Render dashboard, check alkitu-api logs
   ```
   Look for: "Application is running on: https://..."

2. **Verify environment variable**:
   - In `alkitu-web` service → Environment
   - `NEXT_PUBLIC_API_URL` should be set to API service URL

3. **Rebuild frontend**:
   - Manual redeploy from Render dashboard (forces rebuild with correct env vars)

### If CORS Errors Persist:

1. **Check API logs** for CORS configuration:
   ```
   # Should show:
   Allowed origins: ['https://alkitu-web.onrender.com', ...]
   ```

2. **Verify `FRONTEND_URL` environment variable** in `alkitu-api` service

3. **Check browser Network tab**:
   - Look for `Access-Control-Allow-Origin` header in API responses

### If Hydration Errors Continue:

1. **Check for missing data** in Server Components
2. **Verify tRPC queries are succeeding** (check Network tab)
3. **Look for conditional rendering** that differs between server/client

---

## 📊 What Changed in Production

### Before:
```
Frontend (Next.js)       Backend (NestJS)
Port: 10000              Port: 10000
Domain: alkitu-web       Domain: alkitu-api

tRPC Client → /api/trpc → ❌ 404 (no route)
CORS: localhost:3000 → ❌ Blocks production
```

### After:
```
Frontend (Next.js)       Backend (NestJS)
Port: 10000              Port: 10000
Domain: alkitu-web       Domain: alkitu-api

tRPC Client → https://alkitu-api.onrender.com/trpc → ✅
CORS: alkitu-web.onrender.com → ✅ Allowed
```

---

## 🎯 Key Learnings

1. **Monorepo Deployment**: When deploying frontend and backend as separate services, clients must use the backend's full URL, not relative paths.

2. **Environment Variables**:
   - `NEXT_PUBLIC_*` variables must be available **at build time** in Next.js
   - Render's `fromService` automatically populates service URLs

3. **CORS Configuration**: Always check environment variable names match between configuration files and actual deployment.

4. **tRPC in Production**: Client should use `NEXT_PUBLIC_API_URL` for direct connection when frontend/backend are separate services.

---

## 📚 Related Documentation

- [Render Environment Variables](https://render.com/docs/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [tRPC Client Configuration](https://trpc.io/docs/client/react)
- [NestJS CORS](https://docs.nestjs.com/security/cors)

---

**Status**: ✅ **FIXED** - Ready for deployment
**Date**: February 8, 2026
**Fixed By**: Claude Sonnet 4.5
