export interface ServiceTableItem {
  id: string;
  name: string;
  category: string;
  status: 'ACTIVE' | 'INACTIVE';
  questionsCount: number;
}

export interface ServicesTableAlianzaProps {
  services: ServiceTableItem[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  labels?: {
    service: string;
    category: string;
    status: string;
    questions: string;
    actions: string;
    edit: string;
    delete: string;
    active: string;
    inactive: string;
  };
  className?: string;
}
