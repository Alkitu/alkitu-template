export interface ChatConversationItem {
  id: string;
  contactInfo?: {
    email?: string;
    name?: string;
  };
  status: string;
  lastMessageAt: string | Date;
}

export interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
}

export interface ChatConversationsTableAlianzaProps {
  conversations: ChatConversationItem[];
  onDelete?: (conversationId: string) => void;
  labels?: {
    id: string;
    email: string;
    name: string;
    status: string;
    lastMessage: string;
    actions: string;
  };
  className?: string;
  pagination?: PaginationProps;
}
