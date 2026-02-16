import type { FormSettings } from '@alkitu/shared';

export interface SelectableService {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string | null;
  iconColor?: string;
  categoryId: string;
  categoryName: string;
  formSettings?: FormSettings;
  fieldCount?: number;
}

export interface CategoryGroup {
  categoryId: string;
  categoryName: string;
  services: SelectableService[];
}

export interface CategorizedServiceSelectorProps {
  services: SelectableService[];
  selectedServiceId: string | null;
  onServiceSelect: (service: SelectableService) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
  noResultsText?: string;
  emptyText?: string;
  className?: string;
}
