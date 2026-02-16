# React Email Hybrid Architecture

## Overview

The email system uses a **hybrid approach** where React Email provides the layout wrapper (header, footer, branding, Tailwind styling) while the inner content (subject, body with `{{placeholders}}`) stays DB-editable from the admin UI.

## Architecture

### Flow

```
Admin edits body content in DB (inner HTML only, not full document)
  → replacePlaceholders() substitutes {{variables}}
  → BaseEmailLayout React component wraps the rendered content
  → @react-email/render converts to final HTML
  → Resend sends via html field
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `BaseEmailLayout` | `packages/api/src/email/templates/BaseEmailLayout.tsx` | Server-side React Email layout wrapper |
| `EmailRendererService` | `packages/api/src/email/services/email-renderer.service.ts` | NestJS service that renders emails with layout |
| `EmailPreviewShell` | `packages/web/.../email-templates/components/EmailPreviewShell.tsx` | Frontend preview wrapper (mirrors backend layout) |

### EmailRendererService Methods

- **`isLegacyFullDocument(body)`**: Detects full HTML documents (backward compat)
- **`extractInnerContent(fullHtml)`**: Strips document wrapper, keeps admin-editable content
- **`renderWithLayout(innerHtml, locale?, previewText?)`**: Wraps content in layout and renders to HTML

## Rules

1. **DB templates store inner content only** — no `<!DOCTYPE>`, `<html>`, `<head>`, `<body>` tags
2. **BaseEmailLayout provides**: brand header, container, footer (copyright, links)
3. **Admin-editable parts**: colored status headers, content sections, tables, CTAs
4. **Frontend preview must match backend**: `EmailPreviewShell` mirrors `BaseEmailLayout`
5. **Backward compatibility**: `isLegacyFullDocument()` auto-detects and extracts full HTML docs
6. **Fallback safety**: If rendering fails, raw body HTML is sent to avoid blocking delivery

## Anti-patterns

- Do not store full HTML documents in DB templates (use inner content only)
- Do not duplicate header/footer in each template body
- Do not use different layout structure between frontend preview and backend rendering
- Do not skip the layout wrapper for email sending

## Template Content Format

Templates should contain only the status-specific content:

```html
<!-- Header (status-specific) -->
<div style="background-color: #667eea; ...">
    <h1>Solicitud Recibida</h1>
</div>
<!-- Content -->
<div style="padding: 35px 30px;">
    <p>Estimado/a <strong>{{user.firstname}}</strong>,</p>
    <!-- ... template content ... -->
</div>
```

The `BaseEmailLayout` automatically wraps this with:
- `<Html>`, `<Head>`, `<Preview>` tags
- Tailwind CSS support
- Brand header ("Alkitu")
- White container with max-width 600px
- Footer with copyright and links

## Migration

Run the migration script to convert existing full-HTML templates:

```bash
cd packages/api
npx ts-node -r tsconfig-paths/register src/scripts/migrate-templates-to-inner-content.ts
```
