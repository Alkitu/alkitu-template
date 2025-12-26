import type { EmailTemplate } from '@alkitu/shared/types';
import type { CreateEmailTemplateInput } from '@alkitu/shared/schemas';

export interface EmailTemplateFormOrganismProps {
  /**
   * Initial data for editing an existing template
   * If not provided, the form will be in create mode
   */
  initialData?: EmailTemplate | null;

  /**
   * Callback when the form is successfully submitted
   */
  onSuccess?: (template: EmailTemplate) => void;

  /**
   * Callback when there's an error submitting the form
   */
  onError?: (error: Error) => void;

  /**
   * Callback when the cancel button is clicked
   */
  onCancel?: () => void;

  /**
   * Whether to show the cancel button
   * @default true
   */
  showCancel?: boolean;

  /**
   * Custom submit button text
   */
  submitText?: string;

  /**
   * Custom cancel button text
   */
  cancelText?: string;

  /**
   * Whether to show the preview button
   * @default true
   */
  showPreview?: boolean;
}

export type EmailTemplateFormData = CreateEmailTemplateInput;
