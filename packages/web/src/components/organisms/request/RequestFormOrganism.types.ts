import { CreateRequestInput, Request } from '@alkitu/shared';

/**
 * Props for RequestFormOrganism component
 */
export interface RequestFormOrganismProps {
  /**
   * Initial data for edit mode (if provided, form is in edit mode)
   */
  initialData?: Request;

  /**
   * Callback when form is submitted successfully
   */
  onSuccess?: (request: Request) => void;

  /**
   * Callback when form is cancelled
   */
  onCancel?: () => void;

  /**
   * Additional CSS classes
   */
  className?: string;
}

/**
 * Form data interface
 */
export interface RequestFormData {
  serviceId: string;
  locationId: string;
  executionDateTime: string;
  templateResponses: Record<string, unknown>;
  note?: Record<string, unknown>;
}
