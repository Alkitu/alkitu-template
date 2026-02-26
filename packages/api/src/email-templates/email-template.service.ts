import {
  Injectable,
  Logger,
  NotFoundException,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  Optional,
} from '@nestjs/common';
import {
  EmailTemplate,
  TemplateTrigger,
  RequestStatus,
  Request,
  User,
  Service,
  WorkLocation,
  TemplateCategory,
  LocalizedEmailContent,
} from '@prisma/client';
import {
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
  PlaceholderData,
  AVAILABLE_PLACEHOLDERS,
  PLACEHOLDERS_BY_CATEGORY,
} from '@alkitu/shared';
import { EmailService, escapeHtml } from '../email/email.service';
import { EmailRendererService } from '../email/services/email-renderer.service';
import { PrismaService } from '../prisma.service';
import {
  getDefaultTemplateDefinitions,
  loadTemplateBody,
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  type SupportedLocale,
} from './templates';

/** Safely extract error message from unknown catch values */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'Unknown error';
}

/** Safely extract error stack from unknown catch values */
function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) return error.stack;
  return undefined;
}

// Type for Request with all necessary relations
export type RequestWithRelations = Request & {
  user: User;
  service: Service & { category: { name: string } };
  location: WorkLocation;
  assignedTo?: User | null;
  templateResponses?: Record<string, unknown> | null;
};

@Injectable()
export class EmailTemplateService {
  private readonly logger = new Logger(EmailTemplateService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly prisma: PrismaService,
    @Optional() private readonly emailRendererService?: EmailRendererService,
  ) {}

  /**
   * Initialize default email templates if none exist
   * Called on module initialization
   */
  async initializeDefaultTemplates(): Promise<void> {
    try {
      const existingCount = await this.prisma.emailTemplate.count();

      if (existingCount > 0) {
        this.logger.log(
          `Found ${existingCount} existing email templates, skipping initialization`,
        );

        // Backfill slug for existing templates that don't have one set
        const templatesWithoutSlug = await this.prisma.emailTemplate.findMany({
          where: { slug: null },
          select: { id: true, name: true },
        });

        if (templatesWithoutSlug.length > 0) {
          this.logger.log(
            `Backfilling slug for ${templatesWithoutSlug.length} templates...`,
          );
          for (const t of templatesWithoutSlug) {
            try {
              await this.prisma.emailTemplate.update({
                where: { id: t.id },
                data: { slug: t.name },
              });
              this.logger.log(`Backfilled slug="${t.name}" for template ${t.id}`);
            } catch (err) {
              this.logger.warn(
                `Could not backfill slug for template ${t.id} (${t.name}): ${getErrorMessage(err)}`,
              );
            }
          }
        }
      } else {
        this.logger.log('Initializing default email templates...');

        const definitions = getDefaultTemplateDefinitions();

        for (const def of definitions) {
          // Load body from HTML file for the default locale
          const defaultBody = loadTemplateBody(def.name, DEFAULT_LOCALE);
          const defaultSubject = def.subjects[DEFAULT_LOCALE];

          // Build localizations for non-default locales
          const localizations: { locale: string; subject: string; body: string }[] = [];
          for (const locale of SUPPORTED_LOCALES) {
            if (locale === DEFAULT_LOCALE) continue;
            try {
              localizations.push({
                locale,
                subject: def.subjects[locale as SupportedLocale] ?? defaultSubject,
                body: loadTemplateBody(def.name, locale as SupportedLocale),
              });
            } catch (err) {
              this.logger.warn(
                `Could not load ${locale} template for ${def.name}: ${getErrorMessage(err)}`,
              );
            }
          }

          await this.prisma.emailTemplate.create({
            data: {
              name: def.name,
              slug: def.name,
              subject: defaultSubject,
              body: defaultBody,
              trigger: def.trigger,
              status: def.status,
              active: def.active,
              defaultLocale: DEFAULT_LOCALE,
              defaultBody,
              defaultSubject,
              isDefault: true,
              localizations,
            },
          });
        }

        this.logger.log(
          `✅ Successfully created ${definitions.length} default email templates with i18n support`,
        );
      }

      // Ensure the email-templates feature flag exists
      await this.prisma.featureFlag.upsert({
        where: { key: 'email-templates' },
        update: {},
        create: {
          key: 'email-templates',
          name: 'Email Templates Editor',
          description:
            'UI to customize email templates. Emails are always sent from DB regardless of this flag.',
          category: 'addon',
          status: 'DISABLED',
          icon: 'Mail',
          badge: 'New',
          sortOrder: 10,
        },
      });
    } catch (error) {
      this.logger.error('Failed to initialize default email templates', error);
      // Don't throw - initialization failure shouldn't prevent app startup
    }
  }

  /**
   * Create a new email template
   */
  async create(data: CreateEmailTemplateInput): Promise<EmailTemplate> {
    try {
      // Validate trigger + status combination
      this.validateTriggerStatusCombination(data.trigger, data.status);

      // Check for duplicate name
      const existing = await this.prisma.emailTemplate.findUnique({
        where: { name: data.name },
      });

      if (existing) {
        throw new ConflictException(
          `Email template with name "${data.name}" already exists`,
        );
      }

      const template = await this.prisma.emailTemplate.create({
        data: {
          name: data.name,
          subject: data.subject,
          body: data.body,
          trigger: data.trigger as TemplateTrigger,
          status: data.status as RequestStatus | null,
          active: data.active ?? true,
        },
      });

      this.logger.log(
        `Created email template: ${template.name} (${template.id})`,
      );
      return template;
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to create email template: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      throw new InternalServerErrorException(
        `Failed to create email template: ${getErrorMessage(error)}`,
      );
    }
  }

  /**
   * Find all email templates with optional filters
   */
  async findAll(filters?: {
    trigger?: TemplateTrigger;
    status?: RequestStatus;
    active?: boolean;
    search?: string;
  }): Promise<EmailTemplate[]> {
    try {
      const where: Record<string, unknown> = {};

      if (filters?.trigger) {
        where.trigger = filters.trigger;
      }

      if (filters?.status) {
        where.status = filters.status;
      }

      if (filters?.active !== undefined) {
        where.active = filters.active;
      }

      if (filters?.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { subject: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const templates = await this.prisma.emailTemplate.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });

      return templates;
    } catch (error) {
      this.logger.error(
        `Failed to fetch email templates: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      throw new Error(
        `Failed to fetch email templates: ${getErrorMessage(error)}`,
      );
    }
  }

  /**
   * Find one email template by ID
   */
  async findOne(id: string): Promise<EmailTemplate> {
    try {
      const template = (await this.prisma.emailTemplate.findUnique({
        where: { id },
      })) as EmailTemplate | null;

      if (!template) {
        throw new NotFoundException(`Email template with id "${id}" not found`);
      }

      return template;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch email template ${id}: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      throw new Error(
        `Failed to fetch email template: ${getErrorMessage(error)}`,
      );
    }
  }

  /**
   * Update an email template
   * Note: Cannot change trigger or status after creation
   */
  async update(
    id: string,
    data: UpdateEmailTemplateInput,
  ): Promise<EmailTemplate> {
    try {
      // Verify template exists
      await this.findOne(id);

      // Check for duplicate name if changing name
      if (data.name) {
        const existing = await this.prisma.emailTemplate.findFirst({
          where: {
            name: data.name,
            id: { not: id },
          },
        });

        if (existing) {
          throw new ConflictException(
            `Email template with name "${data.name}" already exists`,
          );
        }
      }

      const template = await this.prisma.emailTemplate.update({
        where: { id },
        data: {
          name: data.name,
          subject: data.subject,
          body: data.body,
          active: data.active,
        },
      });

      this.logger.log(
        `Updated email template: ${template.name} (${template.id})`,
      );
      return template;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      this.logger.error(
        `Failed to update email template ${id}: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      throw new InternalServerErrorException(
        `Failed to update email template: ${getErrorMessage(error)}`,
      );
    }
  }

  /**
   * Delete an email template
   */
  async delete(id: string): Promise<EmailTemplate> {
    try {
      // Verify template exists
      await this.findOne(id);

      const deleted = await this.prisma.emailTemplate.delete({
        where: { id },
      });

      this.logger.log(`Deleted email template: ${id}`);
      return deleted;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(
        `Failed to delete email template ${id}: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      throw new InternalServerErrorException(
        `Failed to delete email template: ${getErrorMessage(error)}`,
      );
    }
  }

  /**
   * Find templates by trigger and optional status
   * Used to find which templates to send for a given event
   */
  async findByTrigger(
    trigger: TemplateTrigger,
    status?: RequestStatus,
  ): Promise<EmailTemplate[]> {
    try {
      const where: Record<string, unknown> = {
        trigger,
        active: true, // Only return active templates
      };

      // For ON_STATUS_CHANGED, filter by status
      if (trigger === 'ON_STATUS_CHANGED' && status) {
        where.status = status;
      }

      const templates = await this.prisma.emailTemplate.findMany({
        where,
      });

      return templates;
    } catch (error) {
      this.logger.error(
        `Failed to find templates for trigger ${trigger}: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      return []; // Return empty array instead of throwing - email failure shouldn't block operations
    }
  }

  /**
   * Replace placeholders in a template with actual data.
   * All values are HTML-escaped to prevent XSS attacks.
   */
  replacePlaceholders(template: string, data: PlaceholderData): string {
    let result = template;

    // Replace request placeholders
    result = result.replace(/\{\{request\.id\}\}/g, escapeHtml(data.request.id || ''));
    result = result.replace(
      /\{\{request\.status\}\}/g,
      escapeHtml(data.request.status || ''),
    );
    result = result.replace(
      /\{\{request\.executionDateTime\}\}/g,
      escapeHtml(this.formatDateTime(data.request.executionDateTime) || ''),
    );
    result = result.replace(
      /\{\{request\.createdAt\}\}/g,
      escapeHtml(this.formatDateTime(data.request.createdAt) || ''),
    );
    result = result.replace(
      /\{\{request\.completedAt\}\}/g,
      escapeHtml(this.formatDateTime(data.request.completedAt) || ''),
    );

    // Replace user placeholders
    result = result.replace(
      /\{\{user\.firstname\}\}/g,
      escapeHtml(data.user.firstname || ''),
    );
    result = result.replace(
      /\{\{user\.lastname\}\}/g,
      escapeHtml(data.user.lastname || ''),
    );
    result = result.replace(/\{\{user\.email\}\}/g, escapeHtml(data.user.email || ''));
    result = result.replace(/\{\{user\.phone\}\}/g, escapeHtml(data.user.phone || ''));

    // Replace service placeholders
    result = result.replace(/\{\{service\.name\}\}/g, escapeHtml(data.service.name || ''));
    result = result.replace(
      /\{\{service\.category\}\}/g,
      escapeHtml(data.service.category || ''),
    );

    // Replace location placeholders
    result = result.replace(
      /\{\{location\.street\}\}/g,
      escapeHtml(data.location.street || ''),
    );
    result = result.replace(
      /\{\{location\.city\}\}/g,
      escapeHtml(data.location.city || ''),
    );
    result = result.replace(
      /\{\{location\.state\}\}/g,
      escapeHtml(data.location.state || ''),
    );
    result = result.replace(
      /\{\{location\.zipCode\}\}/g,
      escapeHtml(data.location.zip || ''),
    );

    // Replace employee placeholders (if assigned)
    if (data.employee) {
      result = result.replace(
        /\{\{employee\.firstname\}\}/g,
        escapeHtml(data.employee.firstname || ''),
      );
      result = result.replace(
        /\{\{employee\.lastname\}\}/g,
        escapeHtml(data.employee.lastname || ''),
      );
      result = result.replace(
        /\{\{employee\.email\}\}/g,
        escapeHtml(data.employee.email || ''),
      );
      result = result.replace(
        /\{\{employee\.phone\}\}/g,
        escapeHtml(data.employee.phone || ''),
      );
    } else {
      // Replace with empty strings if no employee assigned
      result = result.replace(/\{\{employee\.firstname\}\}/g, '');
      result = result.replace(/\{\{employee\.lastname\}\}/g, '');
      result = result.replace(/\{\{employee\.email\}\}/g, '');
      result = result.replace(/\{\{employee\.phone\}\}/g, '');
    }

    // Replace templateResponses placeholders (dynamic)
    if (data.templateResponses) {
      Object.entries(data.templateResponses).forEach(([key, value]) => {
        const placeholder = `{{templateResponses.${key}}}`;
        const regex = new RegExp(
          placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
          'g',
        );
        result = result.replace(regex, escapeHtml(String(value || '')));
      });
    }

    return result;
  }

  /**
   * Preview a template with placeholder data
   */
  async previewTemplate(
    templateId: string,
    data: PlaceholderData,
  ): Promise<{ subject: string; body: string }> {
    const template = await this.findOne(templateId);
    const subject = this.replacePlaceholders(template.subject, data);
    const rawBody = this.replacePlaceholders(template.body, data);

    // Wrap in React Email layout for preview to match production output
    const body = this.emailRendererService
      ? await this.emailRendererService.renderWithLayout(rawBody, template.defaultLocale, subject)
      : rawBody;

    return { subject, body };
  }

  /**
   * Get available placeholders
   */
  getAvailablePlaceholders() {
    return AVAILABLE_PLACEHOLDERS;
  }

  /**
   * Render an email template by slug with locale support
   * Looks up template by slug, applies localization if available, and replaces placeholders
   */
  async renderBySlug(
    slug: string,
    variables: Record<string, string>,
    locale?: string,
  ): Promise<{ subject: string; body: string } | null> {
    try {
      const template = (await this.prisma.emailTemplate.findUnique({
        where: { slug },
      })) as EmailTemplate | null;

      if (!template || !template.active) {
        this.logger.warn(`Template with slug "${slug}" not found or inactive`);
        return null;
      }

      let subject = template.subject;
      let body = template.body;

      // Check for localized content
      if (
        locale &&
        locale !== template.defaultLocale &&
        template.localizations
      ) {
        const localized = (
          template.localizations as LocalizedEmailContent[]
        ).find((l) => l.locale === locale);
        if (localized) {
          subject = localized.subject;
          body = localized.body;
        }
      }

      // Replace all {{key}} placeholders (escape values to prevent XSS)
      for (const [key, value] of Object.entries(variables)) {
        const regex = new RegExp(
          `\\{\\{${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\}\\}`,
          'g',
        );
        const safeValue = escapeHtml(value);
        subject = subject.replace(regex, safeValue);
        body = body.replace(regex, safeValue);
      }

      return { subject, body };
    } catch (error) {
      this.logger.error(
        `Failed to render template by slug "${slug}": ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      return null;
    }
  }

  /**
   * Reset a template to its default content
   * Copies defaultSubject → subject and defaultBody → body
   */
  async resetToDefault(id: string): Promise<EmailTemplate> {
    const template = await this.findOne(id);

    if (
      !template.isDefault ||
      !template.defaultBody ||
      !template.defaultSubject
    ) {
      throw new BadRequestException(
        'This template does not have default content to reset to',
      );
    }

    const updated = (await this.prisma.emailTemplate.update({
      where: { id },
      data: {
        subject: template.defaultSubject,
        body: template.defaultBody,
      },
    })) as EmailTemplate;

    this.logger.log(`Reset template "${template.name}" to default content`);
    return updated;
  }

  /**
   * Update or insert a localized version of a template
   */
  async updateLocalization(
    id: string,
    locale: string,
    subject: string,
    body: string,
  ): Promise<EmailTemplate> {
    const template = await this.findOne(id);

    const localizations =
      (template.localizations as LocalizedEmailContent[]) || [];
    const existingIndex = localizations.findIndex((l) => l.locale === locale);

    if (existingIndex >= 0) {
      localizations[existingIndex] = { locale, subject, body };
    } else {
      localizations.push({ locale, subject, body });
    }

    const updated = (await this.prisma.emailTemplate.update({
      where: { id },
      data: { localizations: localizations as any },
    })) as EmailTemplate;

    this.logger.log(
      `Updated localization "${locale}" for template "${template.name}"`,
    );
    return updated;
  }

  /**
   * Get available placeholder variables by template category
   */
  getVariablesByCategory(category: TemplateCategory): string[] {
    return PLACEHOLDERS_BY_CATEGORY[category] || [];
  }

  /**
   * Find all templates grouped by category
   */
  async findAllGroupedByCategory() {
    const templates = (await this.prisma.emailTemplate.findMany({
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    })) as EmailTemplate[];

    const categoryLabels: Record<string, string> = {
      REQUEST: 'Request Lifecycle',
      AUTH: 'Authentication',
      NOTIFICATION: 'Notifications',
      MARKETING: 'Marketing',
    };

    const grouped = new Map<string, EmailTemplate[]>();
    for (const template of templates) {
      const cat = template.category || 'REQUEST';
      if (!grouped.has(cat)) {
        grouped.set(cat, []);
      }
      grouped.get(cat)!.push(template);
    }

    return Array.from(grouped.entries()).map(
      ([category, categoryTemplates]) => ({
        category,
        label: categoryLabels[category] || category,
        templates: categoryTemplates,
      }),
    );
  }

  /**
   * Validate trigger + status combination
   */
  private validateTriggerStatusCombination(
    trigger: string,
    status?: string | null,
  ): void {
    if (trigger === 'ON_STATUS_CHANGED' && !status) {
      throw new BadRequestException(
        'Status is required when trigger is ON_STATUS_CHANGED',
      );
    }

    if (trigger === 'ON_REQUEST_CREATED' && status) {
      throw new BadRequestException(
        'Status must be null when trigger is ON_REQUEST_CREATED',
      );
    }
  }

  /**
   * Format date/time for display
   */
  private formatDateTime(date: Date | string | null | undefined): string {
    if (!date) return '';

    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      this.logger.warn(`Failed to format date: ${String(date)}`);
      return String(date);
    }
  }

  private async sendTemplatedEmail(
    template: EmailTemplate,
    recipientEmail: string,
    data: PlaceholderData,
  ): Promise<void> {
    try {
      const subject = this.replacePlaceholders(template.subject, data);
      const rawBody = this.replacePlaceholders(template.body, data);

      // Wrap in React Email layout if renderer is available
      const html = this.emailRendererService
        ? await this.emailRendererService.renderWithLayout(rawBody, template.defaultLocale, subject)
        : rawBody;

      const result = await this.emailService.sendEmail({
        to: recipientEmail,
        subject,
        html,
      });

      if (!result.success) {
        this.logger.error(
          `Failed to send template email ${template.name} to ${recipientEmail}: ${result.error}`,
        );
        throw new Error(`Email sending failed: ${result.error}`);
      }

      this.logger.log(
        `Successfully sent template email ${template.name} to ${recipientEmail} (messageId: ${result.messageId})`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending template email ${template.name}: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      // Don't throw - email failure shouldn't block request operations
    }
  }

  /**
   * Build PlaceholderData from a Request with relations
   */
  private buildPlaceholderData(request: RequestWithRelations): PlaceholderData {
    return {
      request: {
        id: request.id,
        status: request.status,
        executionDateTime: request.executionDateTime,
        createdAt: request.createdAt,
        completedAt: request.completedAt,
      },
      user: {
        firstname: request.user.firstname,
        lastname: request.user.lastname,
        email: request.user.email,
        phone: request.user.phone,
      },
      service: {
        name: request.service.name,
        category: request.service.category.name,
      },
      location: {
        street: request.location.street,
        city: request.location.city,
        state: request.location.state,
        zip: request.location.zip,
      },
      employee: request.assignedTo
        ? {
            firstname: request.assignedTo.firstname,
            lastname: request.assignedTo.lastname,
            email: request.assignedTo.email,
            phone: request.assignedTo.phone,
          }
        : null,
      templateResponses: request.templateResponses,
    };
  }

  /**
   * Generate sample placeholder data for test emails
   */
  private generateSamplePlaceholderData(): PlaceholderData {
    return {
      request: {
        id: 'REQ-2024-00123',
        status: 'IN_PROGRESS',
        executionDateTime: new Date('2024-03-15T10:00:00Z'),
        createdAt: new Date('2024-03-10T14:30:00Z'),
        completedAt: new Date('2024-03-15T16:45:00Z'),
      },
      user: {
        firstname: 'Maria',
        lastname: 'Garcia',
        email: 'maria.garcia@example.com',
        phone: '+1 (305) 555-0147',
      },
      service: {
        name: 'Deep Cleaning',
        category: 'Cleaning Services',
      },
      location: {
        street: '1250 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        zip: '33139',
      },
      employee: {
        firstname: 'Carlos',
        lastname: 'Rodriguez',
        email: 'carlos.rodriguez@example.com',
        phone: '+1 (305) 555-0198',
      },
      templateResponses: {
        preferredTime: 'Morning (8am - 12pm)',
        specialInstructions: 'Please use eco-friendly products',
      },
    };
  }

  /**
   * Send all active email templates as test emails to a recipient.
   * Each template is rendered with sample data and sent with [TEST] prefix.
   */
  async sendAllTestEmails(recipient: string): Promise<{
    totalSent: number;
    totalFailed: number;
    results: Array<{
      templateId: string;
      templateName: string;
      category: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const templates = await this.findAll({ active: true });
    const sampleData = this.generateSamplePlaceholderData();
    const results: Array<{
      templateId: string;
      templateName: string;
      category: string;
      success: boolean;
      error?: string;
    }> = [];

    // Extra replacements for AUTH/NOTIFICATION templates that use non-standard placeholders
    const extraReplacements: Record<string, string> = {
      // Auth templates
      '{{loginUrl}}': 'https://app.example.com/login',
      '{{resetUrl}}': 'https://app.example.com/reset-password?token=sample',
      '{{verificationUrl}}': 'https://app.example.com/verify-email?token=sample',
      '{{registrationDate}}': new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      // Notification templates
      '{{notification.title}}': 'New Service Update',
      '{{notification.message}}': 'Your request REQ-2024-00123 has been updated. A technician has been assigned and will arrive at the scheduled time.',
      '{{notification.actionUrl}}': 'https://app.example.com/requests/REQ-2024-00123',
      '{{notification.actionText}}': 'View Details',
      // Misc
      '{{year}}': String(new Date().getFullYear()),
    };

    for (const template of templates) {
      try {
        // Replace standard placeholders (same approach as sendTemplatedEmail)
        let subject = this.replacePlaceholders(template.subject, sampleData);
        let rawBody = this.replacePlaceholders(template.body, sampleData);

        // Post-process remaining {{...}} tokens for AUTH/NOTIFICATION templates
        for (const [token, value] of Object.entries(extraReplacements)) {
          const regex = new RegExp(
            token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
            'g',
          );
          rawBody = rawBody.replace(regex, escapeHtml(value));
          subject = subject.replace(regex, escapeHtml(value));
        }

        // Wrap in React Email layout if renderer is available (same as sendTemplatedEmail)
        let html = rawBody;
        if (this.emailRendererService) {
          try {
            html = await this.emailRendererService.renderWithLayout(
              rawBody,
              template.defaultLocale,
              subject,
            );
          } catch (renderError) {
            this.logger.warn(
              `Layout render failed for template "${template.name}", sending raw HTML: ${getErrorMessage(renderError)}`,
            );
          }
        }

        const result = await this.emailService.sendEmail({
          to: recipient,
          subject: `[TEST] ${subject}`,
          html,
        });

        results.push({
          templateId: template.id,
          templateName: template.name,
          category: template.category || 'REQUEST',
          success: result.success,
          error: result.error,
        });
      } catch (error) {
        results.push({
          templateId: template.id,
          templateName: template.name,
          category: template.category || 'REQUEST',
          success: false,
          error: getErrorMessage(error),
        });
      }

      // 250ms delay between sends to respect Resend rate limits
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    const totalSent = results.filter((r) => r.success).length;
    const totalFailed = results.filter((r) => !r.success).length;

    this.logger.log(
      `Test emails sent to ${recipient}: ${totalSent} succeeded, ${totalFailed} failed out of ${templates.length} templates`,
    );

    return { totalSent, totalFailed, results };
  }

  /**
   * Send emails triggered by request creation (ON_REQUEST_CREATED)
   * Typically sends confirmation email to the client
   */
  async sendRequestCreatedEmails(request: RequestWithRelations): Promise<void> {
    try {
      this.logger.log(
        `Sending request created emails for request ${request.id}`,
      );

      // Find all active templates for ON_REQUEST_CREATED trigger
      const templates = await this.findByTrigger('ON_REQUEST_CREATED');

      if (templates.length === 0) {
        this.logger.warn(
          'No active templates found for ON_REQUEST_CREATED trigger',
        );
        return;
      }

      const placeholderData = this.buildPlaceholderData(request);

      // Send emails in parallel, determining recipient based on template name
      await Promise.all(
        templates.map((template) => {
          // Determine recipient based on template naming convention
          let recipientEmail: string | null = null;

          if (template.name.endsWith('_client')) {
            recipientEmail = request.user.email;
          } else if (template.name.endsWith('_employee')) {
            recipientEmail = request.assignedTo?.email || null;
          } else {
            // Default to client if no suffix matches
            recipientEmail = request.user.email;
          }

          // Only send if we have a valid recipient
          if (recipientEmail) {
            return this.sendTemplatedEmail(
              template,
              recipientEmail,
              placeholderData,
            );
          }
        }),
      );

      this.logger.log(
        `Successfully processed ${templates.length} request created email(s) for request ${request.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending request created emails: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      // Don't throw - email failure shouldn't block request creation
    }
  }

  /**
   * Send emails triggered by request status change (ON_STATUS_CHANGED)
   * Sends different emails to client and employee based on new status
   */
  async sendStatusChangedEmails(
    request: RequestWithRelations,
    newStatus: RequestStatus,
  ): Promise<void> {
    try {
      this.logger.log(
        `Sending status changed emails for request ${request.id}, new status: ${newStatus}`,
      );

      // Find all active templates for this status change
      const templates = await this.findByTrigger(
        'ON_STATUS_CHANGED',
        newStatus,
      );

      if (templates.length === 0) {
        this.logger.warn(
          `No active templates found for ON_STATUS_CHANGED trigger with status ${newStatus}`,
        );
        return;
      }

      const placeholderData = this.buildPlaceholderData(request);

      // Determine recipients based on template naming convention
      // Templates ending with "_client" go to the client
      // Templates ending with "_employee" go to the assigned employee
      for (const template of templates) {
        if (template.name.endsWith('_client')) {
          // Send to client
          await this.sendTemplatedEmail(
            template,
            request.user.email,
            placeholderData,
          );
        } else if (template.name.endsWith('_employee')) {
          // Send to employee (if assigned)
          if (request.assignedTo) {
            await this.sendTemplatedEmail(
              template,
              request.assignedTo.email,
              placeholderData,
            );
          } else {
            this.logger.warn(
              `Skipping template ${template.name} - no employee assigned to request ${request.id}`,
            );
          }
        } else {
          // Default: send to client
          await this.sendTemplatedEmail(
            template,
            request.user.email,
            placeholderData,
          );
        }
      }

      this.logger.log(
        `Successfully processed ${templates.length} status changed email(s) for request ${request.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending status changed emails: ${getErrorMessage(error)}`,
        getErrorStack(error),
      );
      // Don't throw - email failure shouldn't block status updates
    }
  }
}
