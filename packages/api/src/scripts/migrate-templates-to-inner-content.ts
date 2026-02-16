/**
 * Migration Script: Convert email templates from full HTML documents to inner-content-only format.
 *
 * This script:
 * 1. Fetches all EmailTemplate records from DB
 * 2. For each template where body starts with <!DOCTYPE or <html>:
 *    - Extracts inner content (strips DOCTYPE, html, head, body tags, outer wrapper, common footer)
 *    - Updates body, defaultBody, and localizations[].body
 * 3. Logs each migrated template
 *
 * Usage: npx ts-node -r tsconfig-paths/register src/scripts/migrate-templates-to-inner-content.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isLegacyFullDocument(body: string): boolean {
  const trimmed = body.trim().toLowerCase();
  return trimmed.startsWith('<!doctype') || trimmed.startsWith('<html');
}

function extractInnerContent(fullHtml: string): string {
  let content = fullHtml;

  // Remove DOCTYPE
  content = content.replace(/<!DOCTYPE[^>]*>/i, '');
  // Remove <html> tags
  content = content.replace(/<html[^>]*>/i, '');
  content = content.replace(/<\/html>/i, '');
  // Remove <head>...</head> entirely
  content = content.replace(/<head[\s\S]*?<\/head>/i, '');
  // Remove <body> tags but keep content
  content = content.replace(/<body[^>]*>/i, '');
  content = content.replace(/<\/body>/i, '');
  // Remove the hidden preheader div (display:none)
  content = content.replace(/<div[^>]*display:\s*none[^>]*>[\s\S]*?<\/div>/i, '');
  // Remove outermost container div
  const outerDivMatch = content.match(
    /^\s*<div[^>]*max-width:\s*600px[^>]*>([\s\S]*)<\/div>\s*$/i,
  );
  if (outerDivMatch) {
    content = outerDivMatch[1];
  }
  // Remove common footer
  content = content.replace(
    /\s*<!--\s*Footer\s*-->[\s\S]*?<div[^>]*background-color:\s*#f7fafc[^>]*>[\s\S]*?<\/div>\s*$/i,
    '',
  );
  if (content.includes('Todos los derechos reservados') || content.includes('All rights reserved')) {
    content = content.replace(
      /\s*<div[^>]*background-color:\s*#f7fafc[^>]*padding[^>]*border-top[^>]*>[\s\S]*?(?:derechos reservados|rights reserved)[\s\S]*?<\/div>\s*$/i,
      '',
    );
  }
  return content.trim();
}

async function main() {
  console.log('🔄 Starting email template migration to inner-content format...\n');

  const templates = await prisma.emailTemplate.findMany();
  let migratedCount = 0;

  for (const template of templates) {
    const updates: Record<string, unknown> = {};
    let needsUpdate = false;

    // Check body
    if (template.body && isLegacyFullDocument(template.body)) {
      updates.body = extractInnerContent(template.body);
      needsUpdate = true;
    }

    // Check defaultBody
    if (template.defaultBody && isLegacyFullDocument(template.defaultBody)) {
      updates.defaultBody = extractInnerContent(template.defaultBody);
      needsUpdate = true;
    }

    // Check localizations
    if (template.localizations && Array.isArray(template.localizations)) {
      const localizations = template.localizations as Array<{
        locale: string;
        subject: string;
        body: string;
      }>;
      let localizationsChanged = false;

      const updatedLocalizations = localizations.map((loc) => {
        if (loc.body && isLegacyFullDocument(loc.body)) {
          localizationsChanged = true;
          return { ...loc, body: extractInnerContent(loc.body) };
        }
        return loc;
      });

      if (localizationsChanged) {
        updates.localizations = updatedLocalizations;
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      await prisma.emailTemplate.update({
        where: { id: template.id },
        data: updates,
      });
      migratedCount++;
      console.log(`  ✅ Migrated: ${template.name} (${template.id})`);
    } else {
      console.log(`  ⏭️  Skipped (already inner-content): ${template.name}`);
    }
  }

  console.log(`\n✨ Migration complete! ${migratedCount}/${templates.length} templates migrated.`);
}

main()
  .catch((error) => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
