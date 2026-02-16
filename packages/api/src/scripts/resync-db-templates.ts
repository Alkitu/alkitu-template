/**
 * Re-sync all DB email templates with the correct HTML from template files.
 *
 * This script:
 * 1. Reads all EmailTemplate records from the DB
 * 2. For each template that has a matching HTML file, updates:
 *    - body (default locale content)
 *    - defaultBody (reset-to-default content)
 *    - localizations[].body (each locale's content)
 *    - subject / defaultSubject (from template definitions)
 *    - localizations[].subject
 *
 * Usage: npx ts-node -r tsconfig-paths/register src/scripts/resync-db-templates.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const TEMPLATE_FILE_MAP: Record<string, string> = {
  // Auth templates
  welcome: 'welcome',
  email_verification: 'email-verification',
  password_reset: 'password-reset',
  // Notification templates
  notification_general: 'notification-general',
  // Request lifecycle templates
  request_created_client: 'request-created-client',
  request_ongoing_client: 'request-ongoing-client',
  request_ongoing_employee: 'request-ongoing-employee',
  request_completed_client: 'request-completed-client',
  request_cancelled_client: 'request-cancelled-client',
};

const TEMPLATE_SUBJECTS: Record<string, Record<string, string>> = {
  welcome: {
    es: '¡Bienvenido a Alkitu, {{user.firstname}}!',
    en: 'Welcome to Alkitu, {{user.firstname}}!',
  },
  email_verification: {
    es: 'Verifica tu email en Alkitu',
    en: 'Verify your email on Alkitu',
  },
  password_reset: {
    es: 'Restablecer tu contraseña de Alkitu',
    en: 'Reset your Alkitu password',
  },
  notification_general: {
    es: '{{notification.title}}',
    en: '{{notification.title}}',
  },
  request_created_client: {
    es: 'Solicitud Recibida - {{service.name}}',
    en: 'Request Received - {{service.name}}',
  },
  request_ongoing_client: {
    es: 'Técnico Asignado - {{service.name}}',
    en: 'Technician Assigned - {{service.name}}',
  },
  request_ongoing_employee: {
    es: 'Nueva Asignación - {{service.name}}',
    en: 'New Assignment - {{service.name}}',
  },
  request_completed_client: {
    es: 'Servicio Completado - {{service.name}}',
    en: 'Service Completed - {{service.name}}',
  },
  request_cancelled_client: {
    es: 'Solicitud Cancelada - {{service.name}}',
    en: 'Request Cancelled - {{service.name}}',
  },
};

const SUPPORTED_LOCALES = ['es', 'en'];
const DEFAULT_LOCALE = 'es';

function loadHtml(templateName: string, locale: string): string | null {
  const fileName = TEMPLATE_FILE_MAP[templateName];
  if (!fileName) return null;

  const filePath = path.join(
    __dirname,
    '..',
    'email-templates',
    'templates',
    locale,
    `${fileName}.html`,
  );

  if (!fs.existsSync(filePath)) return null;

  return fs
    .readFileSync(filePath, 'utf-8')
    .replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
}

async function main() {
  console.log('🔄 Re-syncing DB email templates with HTML files...\n');

  const templates = await prisma.emailTemplate.findMany();
  console.log(`Found ${templates.length} templates in DB.\n`);

  let updated = 0;
  let skipped = 0;

  for (const tpl of templates) {
    const fileName = TEMPLATE_FILE_MAP[tpl.name];
    if (!fileName) {
      console.log(`⏭️  ${tpl.name} — no matching HTML file, skipping`);
      skipped++;
      continue;
    }

    // Load default locale body
    const defaultBody = loadHtml(tpl.name, DEFAULT_LOCALE);
    if (!defaultBody) {
      console.log(
        `⚠️  ${tpl.name} — could not load ${DEFAULT_LOCALE} HTML, skipping`,
      );
      skipped++;
      continue;
    }

    // Load subjects
    const subjects = TEMPLATE_SUBJECTS[tpl.name];
    const defaultSubject = subjects?.[DEFAULT_LOCALE] ?? tpl.subject;

    // Build localizations
    const localizations: { locale: string; subject: string; body: string }[] =
      [];
    for (const locale of SUPPORTED_LOCALES) {
      if (locale === DEFAULT_LOCALE) continue;
      const locBody = loadHtml(tpl.name, locale);
      if (locBody) {
        localizations.push({
          locale,
          subject: subjects?.[locale] ?? defaultSubject,
          body: locBody,
        });
      }
    }

    await prisma.emailTemplate.update({
      where: { id: tpl.id },
      data: {
        body: defaultBody,
        defaultBody,
        subject: defaultSubject,
        defaultSubject,
        localizations,
        isDefault: true,
      },
    });

    console.log(
      `✅ ${tpl.name} — updated (body + ${localizations.length} localizations)`,
    );
    updated++;
  }

  console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped`);
  console.log('Done!');
}

main()
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
