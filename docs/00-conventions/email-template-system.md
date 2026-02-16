# Email Template System Convention

## Overview

The platform uses a **unified email template system** where ALL emails (auth, request lifecycle, notifications, marketing) are stored in the database and editable via the admin UI.

## Architecture

### DB-First with Fallback

```
EmailService.sendWelcomeEmail()
  → Try: renderTemplateFromDB("welcome", variables, locale)
  → If found: Use DB content
  → If not found: Fallback to hard-coded EmailTemplates class (deprecated)
```

### Template Categories

| Category | Trigger | Description |
|---|---|---|
| `REQUEST` | `ON_REQUEST_CREATED`, `ON_STATUS_CHANGED` | Request lifecycle emails |
| `AUTH` | `ON_AUTH_EVENT` | Welcome, verification, password reset |
| `NOTIFICATION` | `ON_NOTIFICATION` | General notifications |
| `MARKETING` | `ON_MANUAL` | Marketing/promotional emails |

### Multi-Language Support

Templates support multiple locales via the `localizations` array (MongoDB composite type):

```typescript
{
  subject: "Bienvenido, {{user.name}}!",     // Default locale (es)
  body: "<html>...</html>",
  defaultLocale: "es",
  localizations: [
    { locale: "en", subject: "Welcome, {{user.name}}!", body: "<html>...</html>" }
  ]
}
```

The system resolves content in this order:
1. If `locale` matches a `localizations` entry → use it
2. Otherwise → use `subject`/`body` (default locale)

### Template Slugs

Every template has a unique `slug` used for programmatic lookup:

| Slug | Category | Purpose |
|---|---|---|
| `welcome` | AUTH | Welcome email |
| `email_verification` | AUTH | Email verification |
| `password_reset` | AUTH | Password reset |
| `notification_general` | NOTIFICATION | General notification |
| `request_created_client` | REQUEST | Request created (to client) |
| `request_ongoing_client` | REQUEST | Technician assigned (to client) |
| `request_ongoing_employee` | REQUEST | New assignment (to employee) |
| `request_completed_client` | REQUEST | Request completed (to client) |
| `request_cancelled_client` | REQUEST | Request cancelled (to client) |

### Placeholder Variables

Variables use `{{key}}` syntax. Each category has its own set of available variables:

- **REQUEST**: `{{user.firstname}}`, `{{service.name}}`, `{{request.id}}`, `{{location.city}}`, etc.
- **AUTH**: `{{user.name}}`, `{{login.url}}`, `{{verification.url}}`, `{{reset.url}}`
- **NOTIFICATION**: `{{user.name}}`, `{{message}}`, `{{action.url}}`, `{{action.text}}`

### Reset to Default

Templates created by the migration script have `isDefault=true` with `defaultBody`/`defaultSubject` stored. Admins can "Reset to Default" to restore original content.

## Feature Flag

The `email-templates` feature flag controls **only the UI visibility**:

- **Flag OFF**: `/admin/settings/email-templates` redirects to feature-disabled page
- **Flag ON**: Editor page is accessible
- **Emails always use DB templates** regardless of flag state (the flag only gates the editor UI)

## Anti-Patterns

- **DO NOT** add new hard-coded templates to `email-templates.ts` — create them in the migration script instead
- **DO NOT** skip the `renderTemplateFromDB()` check in `EmailService` methods
- **DO NOT** hardcode locale strings — always pass the user's preferred locale

## Key Files

| File | Role |
|---|---|
| `packages/api/prisma/schema.prisma` | Template model with unified fields |
| `packages/api/src/email-templates/email-template.service.ts` | Core template CRUD + rendering |
| `packages/api/src/email/email.service.ts` | DB-first sending with fallback |
| `packages/api/src/scripts/migrate-email-templates-to-unified.ts` | Migration + seeding script |
| `packages/shared/src/types/email-template.ts` | Shared types + placeholder constants |
| `packages/web/src/app/[lang]/(private)/admin/settings/email-templates/page.tsx` | Editor UI |
