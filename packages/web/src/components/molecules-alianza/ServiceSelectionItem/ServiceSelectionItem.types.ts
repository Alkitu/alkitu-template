export interface ServiceSelectionItemService {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string | null;
  iconColor?: string;
  categoryName: string;
}

export interface ServiceSelectionItemProps {
  service: ServiceSelectionItemService;
  isSelected: boolean;
  onSelect: (serviceId: string) => void;
  disabled?: boolean;
  className?: string;
}
