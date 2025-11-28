// @ts-nocheck
// 
import {
  IBaseService,
  ServiceResult,
} from '../../common/interfaces/base-service.interface';

/**
 * Email Templates Interface - ISP Compliant
 *
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on email template management
 * - Separating template operations from sending and analytics
 * - Providing specialized interface for template operations
 * - Being easily testable with focused responsibilities
 */

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  category: string;
  variables: TemplateVariable[];
  status: 'draft' | 'active' | 'archived';
  version: number;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  metadata?: Record<string, any>;
}

export interface TemplateVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'url' | 'email';
  required: boolean;
  defaultValue?: any;
  description?: string;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

export interface TemplateData {
  name: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  category: string;
  variables: TemplateVariable[];
  metadata?: Record<string, any>;
}

export interface RenderedTemplate {
  subject: string;
  htmlContent: string;
  textContent?: string;
  renderedAt: Date;
  variables: Record<string, any>;
}

export interface TemplatePreview {
  subject: string;
  htmlContent: string;
  textContent?: string;
  missingVariables: string[];
  invalidVariables: Array<{ name: string; reason: string }>;
}

export interface TemplateVersion {
  id: string;
  templateId: string;
  version: number;
  subject: string;
  htmlContent: string;
  textContent?: string;
  variables: TemplateVariable[];
  createdAt: Date;
  createdBy: string;
  changeNotes?: string;
}

export interface TemplateValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  variableIssues: Array<{ variable: string; issue: string }>;
}

export interface TemplateFilters {
  category?: string;
  status?: 'draft' | 'active' | 'archived';
  createdBy?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  search?: string;
}

/**
 * Email Templates Service Interface
 *
 * ISP Contract:
 * - Only contains methods related to email template management
 * - Does not include email sending, analytics, or configuration
 * - Clients that only need template operations don't depend on unused methods
 * - Focused on template lifecycle management
 */
export interface IEmailTemplatesService extends IBaseService {
  /**
   * Create new email template
   *
   * ISP Compliance:
   * - Focused solely on template creation
   * - Does not handle email sending or analytics
   * - Single responsibility for template management
   */
  createTemplate(
    templateData: TemplateData,
  ): Promise<ServiceResult<EmailTemplate>>;

  /**
   * Update email template
   *
   * ISP Compliance:
   * - Focused on template modification
   * - Template management specific operation
   * - Does not affect email sending or analytics
   */
  updateTemplate(
    templateId: string,
    templateData: Partial<TemplateData>,
  ): Promise<ServiceResult<EmailTemplate>>;

  /**
   * Delete email template
   *
   * ISP Compliance:
   * - Focused on template deletion
   * - Template management specific operation
   * - Single responsibility for template removal
   */
  deleteTemplate(templateId: string): Promise<ServiceResult<void>>;

  /**
   * Get email template by ID
   *
   * ISP Compliance:
   * - Focused on template retrieval
   * - Template management specific data access
   * - Does not include usage analytics or sending data
   */
  getTemplate(templateId: string): Promise<ServiceResult<EmailTemplate>>;

  /**
   * List email templates with filtering
   *
   * ISP Compliance:
   * - Focused on template listing and search
   * - Template management specific operation
   * - Does not include sending or analytics data
   */
  listTemplates(
    filters?: TemplateFilters,
    page?: number,
    limit?: number,
  ): Promise<ServiceResult<{ templates: EmailTemplate[]; total: number }>>;

  /**
   * Render template with variables
   *
   * ISP Compliance:
   * - Specialized method for template rendering
   * - Template processing specific operation
   * - Focused on template data interpolation
   */
  renderTemplate(
    templateId: string,
    variables: Record<string, any>,
  ): Promise<ServiceResult<RenderedTemplate>>;

  /**
   * Preview template with sample data
   *
   * ISP Compliance:
   * - Template management specific preview functionality
   * - Focused on template development workflow
   * - Does not involve actual email sending
   */
  previewTemplate(
    templateId: string,
    sampleVariables?: Record<string, any>,
  ): Promise<ServiceResult<TemplatePreview>>;

  /**
   * Validate template content and variables
   *
   * ISP Compliance:
   * - Template management specific validation
   * - Focused on template quality assurance
   * - Single-purpose validation method
   */
  validateTemplate(
    templateData: TemplateData,
  ): Promise<ServiceResult<TemplateValidation>>;

  /**
   * Duplicate email template
   *
   * ISP Compliance:
   * - Template management specific operation
   * - Focused on template copying workflow
   * - Single responsibility for template duplication
   */
  duplicateTemplate(
    templateId: string,
    newName: string,
  ): Promise<ServiceResult<EmailTemplate>>;

  /**
   * Archive email template
   *
   * ISP Compliance:
   * - Template lifecycle management operation
   * - Focused on template status management
   * - Does not affect email sending capabilities
   */
  archiveTemplate(templateId: string): Promise<ServiceResult<EmailTemplate>>;

  /**
   * Restore archived template
   *
   * ISP Compliance:
   * - Template lifecycle management operation
   * - Focused on template status management
   * - Complementary to archive functionality
   */
  restoreTemplate(templateId: string): Promise<ServiceResult<EmailTemplate>>;

  /**
   * Get template version history
   *
   * ISP Compliance:
   * - Template management specific versioning
   * - Focused on template change history
   * - Does not include usage or sending history
   */
  getTemplateVersions(
    templateId: string,
  ): Promise<ServiceResult<TemplateVersion[]>>;

  /**
   * Restore template to specific version
   *
   * ISP Compliance:
   * - Template versioning specific operation
   * - Focused on template rollback functionality
   * - Single responsibility for version management
   */
  restoreTemplateVersion(
    templateId: string,
    version: number,
  ): Promise<ServiceResult<EmailTemplate>>;
}
