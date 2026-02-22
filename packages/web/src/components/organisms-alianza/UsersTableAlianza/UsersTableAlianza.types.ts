export interface UserTableItem {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  phone: string | null;
  role: string;
}

export interface UsersTableAlianzaProps {
  users: UserTableItem[];
  lang: string;
  onEditUser?: (userId: string, email: string) => void;
  onDeleteUser?: (userId: string) => void;
  labels?: {
    user: string;
    role: string;
    phone: string;
    actions: string;
    edit: string;
    delete: string;
  };
  roleLabels?: Record<string, string | undefined>;
  className?: string;
}
