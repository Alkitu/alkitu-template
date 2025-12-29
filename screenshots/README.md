# Screenshots Directory

This directory contains screenshots of all 32 extra implemented routes, organized by category.

## 📁 Directory Structure

```
screenshots/
├── 01-authentication-extended/  (7 screenshots)
│   ├── ALI-182-forgot-password.png
│   ├── ALI-183-new-password.png
│   ├── ALI-184-magic-link-login.png
│   ├── ALI-185-login-code-verification.png
│   ├── ALI-186-email-verification-request.png
│   ├── ALI-187-new-verification.png
│   └── ALI-188-authentication-error.png
│
├── 02-shared-infrastructure/  (8 screenshots)
│   ├── ALI-189-universal-dashboard.png
│   ├── ALI-190-shared-profile.png
│   ├── ALI-191-shared-onboarding.png
│   ├── ALI-192-work-locations.png
│   ├── ALI-193-shared-requests-list.png
│   ├── ALI-194-shared-request-detail.png
│   ├── ALI-195-shared-new-request.png
│   └── ALI-196-service-request.png
│
├── 03-admin-advanced/  (13 screenshots)
│   ├── ALI-197-admin-home.png
│   ├── ALI-198-categories-management.png
│   ├── ALI-199-channels-list.png
│   ├── ALI-200-channel-detail.png
│   ├── ALI-201-chat-management.png
│   ├── ALI-202-chat-conversation.png
│   ├── ALI-203-chat-analytics.png
│   ├── ALI-204-notification-analytics.png
│   ├── ALI-205-notification-preferences.png
│   ├── ALI-206-admin-settings.png
│   ├── ALI-207-chatbot-settings.png
│   ├── ALI-208-theme-settings.png
│   └── ALI-209-create-user.png
│
├── 04-system-utilities/  (4 screenshots)
│   ├── ALI-210-chat-popup.png
│   ├── ALI-211-design-system.png
│   ├── ALI-212-test-page.png
│   └── ALI-213-unauthorized.png
│
├── manifest.json              # Capture metadata
└── cloudinary-manifest.json   # Upload metadata
```

## 🚀 Quick Start

### Step 1: Create Screenshot Users
```bash
npm run create:screenshot-users
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Generate Capture Instructions
```bash
npm run screenshots:capture
```

This will create directories and show you the URLs to capture using Playwright MCP.

### Step 4: Capture Screenshots with Claude Code

Ask Claude Code to capture screenshots using Playwright MCP tools. Example:

```
Please capture screenshots of all routes using the instructions from
the screenshots:capture script output. Use Playwright MCP to:
1. Navigate to each URL
2. Authenticate when needed (credentials in .env)
3. Take screenshot and save to the specified path
```

### Step 5: Upload to Cloudinary
```bash
npm run screenshots:upload
```

This will show you the Cloudinary MCP commands to upload each file.

### Step 6: Ask Claude Code to Execute Uploads

Copy the upload commands and ask Claude Code to execute them.

### Step 7: Clean Up
```bash
npm run delete:screenshot-users
```

## 📋 Manifest Files

### `manifest.json`
Contains metadata about captured screenshots:
- Capture timestamp
- Route URLs
- File paths
- Authentication requirements

### `cloudinary-manifest.json`
Contains Cloudinary upload results:
- Upload timestamp
- Cloudinary URLs
- Public IDs
- Upload status

## 🔑 Authentication

Screenshots use these test users (from `.env`):

- **Admin routes**: `screenshot-admin@alkitu.test` / `Screenshot123`
- **Client routes**: `screenshot-client@alkitu.test` / `Screenshot123`
- **Shared routes**: Any authenticated user

## ☁️ Cloudinary Organization

Screenshots are organized in Cloudinary with this structure:

```
alkitu-screenshots/
├── 01-authentication-extended/
├── 02-shared-infrastructure/
├── 03-admin-advanced/
└── 04-system-utilities/
```

Each image is tagged with:
- `alkitu`
- `screenshot`
- Category (e.g., `01-authentication-extended`)
- ALI number (e.g., `ALI-182`)

## 📝 Notes

- Screenshots are captured at 1920x1080 resolution
- PNG format for best quality
- Wait 2 seconds after navigation for page load
- Test IDs in URLs (e.g., `test-id`) are placeholders
- Some dynamic routes may show empty states

## 🔗 Related Documentation

- [Screenshot Automation Guide](/docs/06-automation/screenshot-automation-guide.md)
- [JIRA Tasks Summary](/docs/04-product/jira-tasks-updates-summary.md)
- [Route Data](/docs/04-product/extra-routes-jira-data.ts)
