import * as fs from 'fs';
import * as path from 'path';
import { TemplateTrigger, RequestStatus } from '@prisma/client';

/**
 * Supported locales for email templates
 */
export const SUPPORTED_LOCALES = ['es', 'en'] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Default locale for email templates
 */
export const DEFAULT_LOCALE: SupportedLocale = 'es';

/**
 * Template definition — metadata + subjects per locale (bodies loaded from HTML files)
 */
export interface TemplateDefinition {
  name: string;
  subjects: Record<SupportedLocale, string>;
  trigger: TemplateTrigger;
  status: RequestStatus | null;
  active: boolean;
}

/**
 * Mapping from template name → HTML file basename (without extension)
 */
const TEMPLATE_FILE_MAP: Record<string, string> = {
  // Auth templates
  welcome: 'welcome',
  email_verification: 'email-verification',
  password_reset: 'password-reset',
  login_code: 'login-code',
  // Notification templates
  notification_general: 'notification-general',
  // Request lifecycle templates
  request_created_client: 'request-created-client',
  request_ongoing_client: 'request-ongoing-client',
  request_ongoing_employee: 'request-ongoing-employee',
  request_completed_client: 'request-completed-client',
  request_cancelled_client: 'request-cancelled-client',
};

/**
 * Load an HTML template file for a given template name and locale.
 * Replaces `{{year}}` with the current year.
 */
export function loadTemplateBody(
  templateName: string,
  locale: SupportedLocale = DEFAULT_LOCALE,
): string {
  const fileName = TEMPLATE_FILE_MAP[templateName];
  if (!fileName) {
    throw new Error(`Unknown template: ${templateName}`);
  }

  const filePath = path.join(__dirname, locale, `${fileName}.html`);

  if (!fs.existsSync(filePath)) {
    // Fallback to default locale if the requested locale file doesn't exist
    const fallbackPath = path.join(
      __dirname,
      DEFAULT_LOCALE,
      `${fileName}.html`,
    );
    if (!fs.existsSync(fallbackPath)) {
      throw new Error(
        `Template file not found: ${filePath} (fallback also missing: ${fallbackPath})`,
      );
    }
    return fs
      .readFileSync(fallbackPath, 'utf-8')
      .replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
  }

  return fs
    .readFileSync(filePath, 'utf-8')
    .replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
}

/**
 * Get all default template definitions with metadata and subjects per locale.
 * The HTML bodies are NOT included here — use `loadTemplateBody()` to get them.
 */
export function getDefaultTemplateDefinitions(): TemplateDefinition[] {
  return [
    // Auth templates
    {
      name: 'welcome',
      subjects: {
        es: '¡Bienvenido a Alkitu, {{user.firstname}}!',
        en: 'Welcome to Alkitu, {{user.firstname}}!',
      },
      trigger: 'ON_AUTH_EVENT' as TemplateTrigger,
      status: null,
      active: true,
    },
    {
      name: 'email_verification',
      subjects: {
        es: 'Verifica tu email en Alkitu',
        en: 'Verify your email on Alkitu',
      },
      trigger: 'ON_AUTH_EVENT' as TemplateTrigger,
      status: null,
      active: true,
    },
    {
      name: 'password_reset',
      subjects: {
        es: 'Restablecer tu contraseña de Alkitu',
        en: 'Reset your Alkitu password',
      },
      trigger: 'ON_AUTH_EVENT' as TemplateTrigger,
      status: null,
      active: true,
    },
    {
      name: 'login_code',
      subjects: {
        es: 'Tu código de acceso a Alkitu',
        en: 'Your Alkitu login code',
      },
      trigger: 'ON_AUTH_EVENT' as TemplateTrigger,
      status: null,
      active: true,
    },
    // Notification templates
    {
      name: 'notification_general',
      subjects: {
        es: '{{notification.title}}',
        en: '{{notification.title}}',
      },
      trigger: 'ON_NOTIFICATION' as TemplateTrigger,
      status: null,
      active: true,
    },
    // Request lifecycle templates
    {
      name: 'request_created_client',
      subjects: {
        es: 'Solicitud Recibida - {{service.name}}',
        en: 'Request Received - {{service.name}}',
      },
      trigger: 'ON_REQUEST_CREATED' as TemplateTrigger,
      status: null,
      active: true,
    },
    {
      name: 'request_ongoing_client',
      subjects: {
        es: 'Técnico Asignado - {{service.name}}',
        en: 'Technician Assigned - {{service.name}}',
      },
      trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
      status: 'ONGOING' as RequestStatus,
      active: true,
    },
    {
      name: 'request_ongoing_employee',
      subjects: {
        es: 'Nueva Asignación - {{service.name}}',
        en: 'New Assignment - {{service.name}}',
      },
      trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
      status: 'ONGOING' as RequestStatus,
      active: true,
    },
    {
      name: 'request_completed_client',
      subjects: {
        es: 'Servicio Completado - {{service.name}}',
        en: 'Service Completed - {{service.name}}',
      },
      trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
      status: 'COMPLETED' as RequestStatus,
      active: true,
    },
    {
      name: 'request_cancelled_client',
      subjects: {
        es: 'Solicitud Cancelada - {{service.name}}',
        en: 'Request Cancelled - {{service.name}}',
      },
      trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
      status: 'CANCELLED' as RequestStatus,
      active: true,
    },
  ];
}

/**
 * Get the list of available template names
 */
export function getAvailableTemplateNames(): string[] {
  return Object.keys(TEMPLATE_FILE_MAP);
}
