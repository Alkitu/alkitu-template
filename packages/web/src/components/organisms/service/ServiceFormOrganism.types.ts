import type { Service } from '@/components/molecules/service';

/**
 * ServiceFormOrganism Props (ALI-118)
 */
export interface ServiceFormOrganismProps {
  /** Optional className for custom styling */
  className?: string;

  /** Initial form data for editing (if undefined, form is in create mode) */
  initialData?: Service;

  /** Callback when service is successfully created/updated */
  onSuccess?: (service: Service) => void;

  /** Callback when operation fails */
  onError?: (error: string) => void;

  /** Callback when cancel button is clicked */
  onCancel?: () => void;

  /** Show cancel button */
  showCancel?: boolean;
}

/**
 * Service form data (ALI-118)
 */
export interface ServiceFormData {
  name: string;
  categoryId: string;
  thumbnail?: string;
  requestTemplate: any; // JSON object
}
