import type { DynamicField } from '@/components/molecules/dynamic-form';

/**
 * Request Template structure (ALI-118)
 */
export interface RequestTemplate {
  version: string;
  fields: DynamicField[];
}

/**
 * RequestTemplateRenderer Props (ALI-118)
 */
export interface RequestTemplateRendererProps {
  /** Request template configuration */
  template: RequestTemplate;

  /** Optional className for custom styling */
  className?: string;

  /** Callback when form is successfully submitted */
  onSubmit?: (data: Record<string, any>) => void | Promise<void>;

  /** Callback when submission fails */
  onError?: (error: string) => void;

  /** Submit button text */
  submitButtonText?: string;

  /** Show cancel button */
  showCancel?: boolean;

  /** Callback when cancel button is clicked */
  onCancel?: () => void;

  /** Disabled state */
  disabled?: boolean;

  /** Initial form data for editing */
  initialData?: Record<string, any>;
}
