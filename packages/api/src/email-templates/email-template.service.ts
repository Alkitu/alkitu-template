import { Injectable, Logger, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaClient, EmailTemplate, TemplateTrigger, RequestStatus, Request, User, Service, WorkLocation } from '@prisma/client';
import prisma from '../../prisma/database';
import {
  CreateEmailTemplateInput,
  UpdateEmailTemplateInput,
  PlaceholderData,
  AVAILABLE_PLACEHOLDERS
} from '@alkitu/shared';
import { EmailService } from '../email/email.service';

// Type for Request with all necessary relations
export type RequestWithRelations = Request & {
  user: User;
  service: Service & { category: { name: string } };
  location: WorkLocation;
  assignedTo?: User | null;
  templateResponses?: Record<string, any> | null;
};

@Injectable()
export class EmailTemplateService {
  private readonly logger = new Logger(EmailTemplateService.name);
  private readonly prisma: PrismaClient;

  constructor(private readonly emailService: EmailService) {
    this.prisma = prisma;
  }

  /**
   * Initialize default email templates if none exist
   * Called on module initialization
   */
  async initializeDefaultTemplates(): Promise<void> {
    try {
      const existingCount = await this.prisma.emailTemplate.count();

      if (existingCount > 0) {
        this.logger.log(`Found ${existingCount} existing email templates, skipping initialization`);
        return;
      }

      this.logger.log('Initializing default email templates...');

      const defaultTemplates = this.getDefaultTemplates();

      for (const template of defaultTemplates) {
        await this.prisma.emailTemplate.create({
          data: template,
        });
      }

      this.logger.log(`✅ Successfully created ${defaultTemplates.length} default email templates`);
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
        throw new ConflictException(`Email template with name "${data.name}" already exists`);
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

      this.logger.log(`Created email template: ${template.name} (${template.id})`);
      return template;
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Failed to create email template: ${error.message}`, error.stack);
      throw new Error(`Failed to create email template: ${error.message}`);
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
      const where: any = {};

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
      this.logger.error(`Failed to fetch email templates: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch email templates: ${error.message}`);
    }
  }

  /**
   * Find one email template by ID
   */
  async findOne(id: string): Promise<EmailTemplate> {
    try {
      const template = await this.prisma.emailTemplate.findUnique({
        where: { id },
      });

      if (!template) {
        throw new NotFoundException(`Email template with ID "${id}" not found`);
      }

      return template;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to fetch email template ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to fetch email template: ${error.message}`);
    }
  }

  /**
   * Update an email template
   * Note: Cannot change trigger or status after creation
   */
  async update(id: string, data: UpdateEmailTemplateInput): Promise<EmailTemplate> {
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
          throw new ConflictException(`Email template with name "${data.name}" already exists`);
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

      this.logger.log(`Updated email template: ${template.name} (${template.id})`);
      return template;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      }
      this.logger.error(`Failed to update email template ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to update email template: ${error.message}`);
    }
  }

  /**
   * Delete an email template
   */
  async delete(id: string): Promise<void> {
    try {
      // Verify template exists
      await this.findOne(id);

      await this.prisma.emailTemplate.delete({
        where: { id },
      });

      this.logger.log(`Deleted email template: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Failed to delete email template ${id}: ${error.message}`, error.stack);
      throw new Error(`Failed to delete email template: ${error.message}`);
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
      const where: any = {
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
        `Failed to find templates for trigger ${trigger}: ${error.message}`,
        error.stack,
      );
      return []; // Return empty array instead of throwing - email failure shouldn't block operations
    }
  }

  /**
   * Replace placeholders in a template with actual data
   */
  replacePlaceholders(template: string, data: PlaceholderData): string {
    let result = template;

    // Replace request placeholders
    result = result.replace(/\{\{request\.id\}\}/g, data.request.id || '');
    result = result.replace(/\{\{request\.status\}\}/g, data.request.status || '');
    result = result.replace(
      /\{\{request\.executionDateTime\}\}/g,
      this.formatDateTime(data.request.executionDateTime) || '',
    );
    result = result.replace(
      /\{\{request\.createdAt\}\}/g,
      this.formatDateTime(data.request.createdAt) || '',
    );
    result = result.replace(
      /\{\{request\.completedAt\}\}/g,
      this.formatDateTime(data.request.completedAt) || '',
    );

    // Replace user placeholders
    result = result.replace(/\{\{user\.firstname\}\}/g, data.user.firstname || '');
    result = result.replace(/\{\{user\.lastname\}\}/g, data.user.lastname || '');
    result = result.replace(/\{\{user\.email\}\}/g, data.user.email || '');
    result = result.replace(/\{\{user\.phone\}\}/g, data.user.phone || '');

    // Replace service placeholders
    result = result.replace(/\{\{service\.name\}\}/g, data.service.name || '');
    result = result.replace(/\{\{service\.category\}\}/g, data.service.category || '');

    // Replace location placeholders
    result = result.replace(/\{\{location\.street\}\}/g, data.location.street || '');
    result = result.replace(/\{\{location\.city\}\}/g, data.location.city || '');
    result = result.replace(/\{\{location\.state\}\}/g, data.location.state || '');
    result = result.replace(/\{\{location\.zipCode\}\}/g, data.location.zip || '');

    // Replace employee placeholders (if assigned)
    if (data.employee) {
      result = result.replace(/\{\{employee\.firstname\}\}/g, data.employee.firstname || '');
      result = result.replace(/\{\{employee\.lastname\}\}/g, data.employee.lastname || '');
      result = result.replace(/\{\{employee\.email\}\}/g, data.employee.email || '');
      result = result.replace(/\{\{employee\.phone\}\}/g, data.employee.phone || '');
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
        const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        result = result.replace(regex, String(value || ''));
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

    return {
      subject: this.replacePlaceholders(template.subject, data),
      body: this.replacePlaceholders(template.body, data),
    };
  }

  /**
   * Get available placeholders
   */
  getAvailablePlaceholders() {
    return AVAILABLE_PLACEHOLDERS;
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
    } catch (error) {
      this.logger.warn(`Failed to format date: ${date}`);
      return String(date);
    }
  }

  /**
   * Get default email templates
   */
  private getDefaultTemplates() {
    return [
      {
        name: 'request_created_client',
        subject: 'Solicitud Recibida - {{service.name}}',
        body: `Estimado/a {{user.firstname}} {{user.lastname}},

Hemos recibido su solicitud de servicio.

Detalles del Servicio:
- Servicio: {{service.name}}
- Categoría: {{service.category}}
- Fecha Programada: {{request.executionDateTime}}

Ubicación:
{{location.street}}
{{location.city}}, {{location.state}} {{location.zipCode}}

ID de Solicitud: {{request.id}}
Estado: {{request.status}}

Revisaremos su solicitud y asignaremos un técnico en breve.

Saludos cordiales,
Equipo Alkitu`,
        trigger: 'ON_REQUEST_CREATED' as TemplateTrigger,
        status: null,
        active: true,
      },
      {
        name: 'request_ongoing_client',
        subject: 'Técnico Asignado - {{service.name}}',
        body: `Estimado/a {{user.firstname}},

¡Buenas noticias! Se ha asignado un técnico a su solicitud de servicio.

Técnico: {{employee.firstname}} {{employee.lastname}}
Teléfono: {{employee.phone}}
Email: {{employee.email}}

Servicio: {{service.name}}
Fecha Programada: {{request.executionDateTime}}
Ubicación: {{location.street}}, {{location.city}}

Su técnico se pondrá en contacto con usted en breve.

ID de Solicitud: {{request.id}}

Gracias,
Equipo Alkitu`,
        trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
        status: 'ONGOING' as RequestStatus,
        active: true,
      },
      {
        name: 'request_ongoing_employee',
        subject: 'Nueva Asignación - {{service.name}}',
        body: `Hola {{employee.firstname}},

Se te ha asignado una nueva solicitud de servicio.

Cliente: {{user.firstname}} {{user.lastname}}
Teléfono: {{user.phone}}
Email: {{user.email}}

Servicio: {{service.name}}
Categoría: {{service.category}}
Fecha Programada: {{request.executionDateTime}}

Ubicación:
{{location.street}}
{{location.city}}, {{location.state}} {{location.zipCode}}

ID de Solicitud: {{request.id}}

Por favor, contacta al cliente para confirmar la cita.

Saludos,
Equipo Alkitu`,
        trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
        status: 'ONGOING' as RequestStatus,
        active: true,
      },
      {
        name: 'request_completed_client',
        subject: 'Servicio Completado - {{service.name}}',
        body: `Estimado/a {{user.firstname}},

¡Su solicitud de servicio se ha completado exitosamente!

Servicio: {{service.name}}
Completado: {{request.completedAt}}
Técnico: {{employee.firstname}} {{employee.lastname}}

ID de Solicitud: {{request.id}}

Esperamos que esté satisfecho/a con nuestro servicio. No dude en solicitar otro servicio cuando lo necesite.

¡Gracias por elegir Alkitu!

Saludos cordiales,
Equipo Alkitu`,
        trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
        status: 'COMPLETED' as RequestStatus,
        active: true,
      },
      {
        name: 'request_cancelled_client',
        subject: 'Solicitud Cancelada - {{service.name}}',
        body: `Estimado/a {{user.firstname}},

Su solicitud de servicio ha sido cancelada.

Servicio: {{service.name}}
ID de Solicitud: {{request.id}}

Si no solicitó esta cancelación o tiene alguna pregunta, por favor contáctenos de inmediato.

Puede enviar una nueva solicitud en cualquier momento.

Saludos cordiales,
Equipo Alkitu`,
        trigger: 'ON_STATUS_CHANGED' as TemplateTrigger,
        status: 'CANCELLED' as RequestStatus,
        active: true,
      },
    ];
  }

  /**
   * Send an email using a template
   * Private helper method used by public email sending methods
   */
  private async sendTemplatedEmail(
    template: EmailTemplate,
    recipientEmail: string,
    data: PlaceholderData,
  ): Promise<void> {
    try {
      const subject = this.replacePlaceholders(template.subject, data);
      const body = this.replacePlaceholders(template.body, data);

      const result = await this.emailService.sendEmail({
        to: recipientEmail,
        subject,
        html: body,
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
        `Error sending template email ${template.name}: ${error.message}`,
        error.stack,
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
   * Send emails triggered by request creation (ON_REQUEST_CREATED)
   * Typically sends confirmation email to the client
   */
  async sendRequestCreatedEmails(request: RequestWithRelations): Promise<void> {
    try {
      this.logger.log(`Sending request created emails for request ${request.id}`);

      // Find all active templates for ON_REQUEST_CREATED trigger
      const templates = await this.findByTrigger('ON_REQUEST_CREATED');

      if (templates.length === 0) {
        this.logger.warn('No active templates found for ON_REQUEST_CREATED trigger');
        return;
      }

      const placeholderData = this.buildPlaceholderData(request);

      // Send emails in parallel
      await Promise.all(
        templates.map((template) =>
          this.sendTemplatedEmail(template, request.user.email, placeholderData),
        ),
      );

      this.logger.log(
        `Successfully processed ${templates.length} request created email(s) for request ${request.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending request created emails: ${error.message}`,
        error.stack,
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
      const templates = await this.findByTrigger('ON_STATUS_CHANGED', newStatus);

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
          await this.sendTemplatedEmail(template, request.user.email, placeholderData);
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
          await this.sendTemplatedEmail(template, request.user.email, placeholderData);
        }
      }

      this.logger.log(
        `Successfully processed ${templates.length} status changed email(s) for request ${request.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Error sending status changed emails: ${error.message}`,
        error.stack,
      );
      // Don't throw - email failure shouldn't block status updates
    }
  }
}
