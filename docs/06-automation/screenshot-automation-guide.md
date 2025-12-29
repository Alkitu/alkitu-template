# Screenshot Automation Guide

**Created**: 2025-12-27
**Purpose**: Automated screenshot generation for all implemented routes using Playwright + Cloudinary + JIRA integration

## 📋 Overview

This guide explains how to automatically generate screenshots for the 32 extra implemented routes and attach them to their corresponding JIRA tasks.

## 🎯 Automation Workflow

```
1. Create test users → npm run create:screenshot-users
2. Start development server → npm run dev
3. Run screenshot automation → (custom script)
4. Upload to Cloudinary → (automatic)
5. Comment on JIRA with images → (automatic)
6. Delete test users → npm run delete:screenshot-users
```

## 👥 Screenshot Test Users

Three users with different roles are created for comprehensive route coverage:

| Email | Password | Role | Purpose |
|-------|----------|------|---------|
| `screenshot-admin@alkitu.test` | `Screenshot123` | ADMIN | Admin routes (13 routes) |
| `screenshot-client@alkitu.test` | `Screenshot123` | CLIENT | Client routes (1 route) |
| `screenshot-employee@alkitu.test` | `Screenshot123` | EMPLOYEE | Shared routes (8 routes) |

**Note**: Public routes (10 routes) don't require authentication.

## 🚀 Quick Start

### 1. Create Screenshot Users

```bash
npm run create:screenshot-users
```

This will:
- Create 3 test users in the database
- Set `profileComplete=true` (skip onboarding)
- Set `emailVerified=true` (skip email verification)
- Print credentials (already in `.env`)

### 2. Verify Environment Variables

Check that `.env` contains:

```env
# Screenshot Users
SCREENSHOT_ADMIN_EMAIL="screenshot-admin@alkitu.test"
SCREENSHOT_ADMIN_PASSWORD="Screenshot123"
SCREENSHOT_CLIENT_EMAIL="screenshot-client@alkitu.test"
SCREENSHOT_CLIENT_PASSWORD="Screenshot123"
SCREENSHOT_EMPLOYEE_EMAIL="screenshot-employee@alkitu.test"
SCREENSHOT_EMPLOYEE_PASSWORD="Screenshot123"
```

### 3. Start Development Server

```bash
npm run dev
```

Verify:
- API: http://localhost:3001/health
- Frontend: http://localhost:3000

### 4. Run Screenshot Automation

**(To be implemented in next phase)**

```bash
npm run screenshots:capture
```

### 5. Clean Up

```bash
npm run delete:screenshot-users
```

## 📊 Routes by Role

### Public Routes (10) - No Authentication

1. ALI-182: `/{lang}/auth/forgot-password`
2. ALI-183: `/{lang}/auth/new-password`
3. ALI-184: `/{lang}/auth/email-login`
4. ALI-185: `/{lang}/auth/verify-login-code`
5. ALI-186: `/{lang}/auth/verify-email`
6. ALI-187: `/{lang}/auth/new-verification`
7. ALI-188: `/{lang}/auth/auth-error`
8. ALI-211: `/{lang}/design-system`
9. ALI-212: `/{lang}/test`
10. ALI-213: `/{lang}/unauthorized`

### Shared Routes (8) - Any Authenticated User

1. ALI-189: `/{lang}/dashboard`
2. ALI-190: `/{lang}/profile`
3. ALI-191: `/{lang}/onboarding`
4. ALI-192: `/{lang}/provider/work-locations`
5. ALI-193: `/{lang}/requests`
6. ALI-194: `/{lang}/requests/[id]`
7. ALI-195: `/{lang}/requests/new`
8. ALI-196: `/{lang}/requests/[serviceId]`
9. ALI-210: `/{lang}/chat/popup/:conversationId`

### Admin Routes (13) - ADMIN Role Required

1. ALI-197: `/{lang}/admin`
2. ALI-198: `/{lang}/admin/categories`
3. ALI-199: `/{lang}/admin/channels`
4. ALI-200: `/{lang}/admin/channels/[channelId]`
5. ALI-201: `/{lang}/admin/chat`
6. ALI-202: `/{lang}/admin/chat/[conversationId]`
7. ALI-203: `/{lang}/admin/chat/analytics`
8. ALI-204: `/{lang}/admin/notifications/analytics`
9. ALI-205: `/{lang}/admin/notifications/preferences`
10. ALI-206: `/{lang}/admin/settings`
11. ALI-207: `/{lang}/admin/settings/chatbot`
12. ALI-208: `/{lang}/admin/settings/theme`
13. ALI-209: `/{lang}/admin/users/create`

## 🔧 Technical Implementation

### User Creation Script

**Location**: `/scripts/create-screenshot-users.ts`

Features:
- Creates users with fixed, simple credentials
- Sets `profileComplete=true` to skip onboarding
- Sets `emailVerified=true` to skip verification
- Idempotent (safe to run multiple times)
- Uses bcrypt for password hashing

### User Deletion Script

**Location**: `/scripts/delete-screenshot-users.ts`

Features:
- Deletes only screenshot test users
- Cascade deletion of related records
- Safe to run even if users don't exist

### Authentication Flow

For automated screenshots, the script will:

1. **Public Routes**: Navigate directly (no auth needed)
2. **Authenticated Routes**:
   - Login via API with credentials from `.env`
   - Store JWT token
   - Include token in subsequent requests
   - Navigate to protected routes

## 📸 Cloudinary Integration

### Configuration Needed

Add to `.env`:

```env
# Cloudinary (for screenshot hosting)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Workflow

1. **Capture**: Playwright takes screenshot → saves locally
2. **Upload**: Upload to Cloudinary → get public URL
3. **Comment**: Add JIRA comment with image in Markdown

Example JIRA comment:
```markdown
## Screenshot

![Route Screenshot](https://res.cloudinary.com/.../screenshot.png)

**Captured**: 2025-12-27
**Environment**: Development (localhost:3000)
**User Role**: ADMIN
**Browser**: Chromium
```

## 🎨 Screenshot Best Practices

### Viewport Settings

```typescript
{
  width: 1920,
  height: 1080,
  deviceScaleFactor: 1
}
```

### File Naming Convention

```
{ali}-{route-slug}-{timestamp}.png

Examples:
- ALI-182-forgot-password-20251227-143022.png
- ALI-197-admin-dashboard-20251227-143045.png
```

### Image Optimization

- Format: PNG (lossless)
- Max width: 1920px
- Compression: Cloudinary auto-optimization
- Alt text: Route name + ALI number

## 🔍 Troubleshooting

### Users Already Exist

```bash
# Delete existing users first
npm run delete:screenshot-users

# Then create new ones
npm run create:screenshot-users
```

### Authentication Fails

1. Verify `.env` credentials match database
2. Check if users exist: `npm run db:shell`
3. Run: `db.users.find({ email: /screenshot/ })`
4. Verify JWT_SECRET is set in API `.env`

### Routes Not Loading

1. Verify development server is running: `npm run dev`
2. Check API health: http://localhost:3001/health
3. Check frontend: http://localhost:3000
4. Review browser console for errors

### Cloudinary Upload Fails

1. Verify credentials in `.env`
2. Test Cloudinary connection
3. Check file size limits (max 10MB for free tier)
4. Verify upload preset configuration

## 📝 Next Steps

### Phase 2: Screenshot Capture Script

Create `/scripts/capture-screenshots.ts`:
- Playwright automation
- Route navigation logic
- Authentication handling
- Screenshot capture
- File naming and organization

### Phase 3: Cloudinary Upload

Create `/scripts/upload-screenshots.ts`:
- Cloudinary integration
- Batch upload
- URL collection
- Error handling

### Phase 4: JIRA Integration

Create `/scripts/attach-to-jira.ts`:
- JIRA API integration
- Comment creation with images
- Batch processing
- Success reporting

### Phase 5: End-to-End Automation

Create `/scripts/full-screenshot-workflow.ts`:
- Orchestrate all phases
- Progress reporting
- Error recovery
- Summary report

## 📚 Related Documentation

- [JIRA Tasks Created Summary](/docs/04-product/jira-tasks-created-summary.md)
- [JIRA Tasks Updates Summary](/docs/04-product/jira-tasks-updates-summary.md)
- [Extra Routes Data](/docs/04-product/extra-routes-jira-data.ts)
- [Playwright MCP Documentation](https://github.com/anthropics/claude-mcp-servers/tree/main/src/playwright)
- [Cloudinary Upload API](https://cloudinary.com/documentation/upload_images)
- [JIRA REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)

## ✅ Checklist

Before running screenshot automation:

- [ ] Screenshot users created (`npm run create:screenshot-users`)
- [ ] Environment variables configured in `.env`
- [ ] Development server running (`npm run dev`)
- [ ] API health check passes (http://localhost:3001/health)
- [ ] Frontend loads (http://localhost:3000)
- [ ] Cloudinary credentials configured (optional for local testing)
- [ ] JIRA API token configured (for attaching to tasks)

After screenshot automation:

- [ ] Review generated screenshots
- [ ] Verify Cloudinary uploads
- [ ] Check JIRA comments
- [ ] Delete test users (`npm run delete:screenshot-users`)
- [ ] Clean up local screenshot files

---

**Last Updated**: 2025-12-27
**Maintained By**: Development Team
**Status**: Phase 1 Complete (User Management Scripts)
