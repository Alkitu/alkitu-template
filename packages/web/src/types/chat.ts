// Tipos compartidos para el sistema de chat
// Estos tipos deben coincidir con los del backend/Prisma

export type ConversationStatus = 'OPEN' | 'IN_PROGRESS' | 'WAITING_CUSTOMER' | 'RESOLVED' | 'CLOSED';

export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export type MessageRole = 'VISITOR' | 'AGENT' | 'SYSTEM';

export interface ChatMessage {
  id: string;
  conversationId: string;
  content: string;
  role: MessageRole;
  createdAt: Date;
  readAt?: Date;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  priority: Priority;
  assignedToId?: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  messages: ChatMessage[];
  contactInfo?: ContactInfo;
  internalNotes?: string;
  tags?: string[];
}

export interface ContactInfo {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  company?: string;
  source?: string;
  metadata?: Record<string, any>;
}

export interface ConversationFilters {
  status?: ConversationStatus;
  priority?: Priority;
  assignedToId?: string;
  search?: string;
  dateFrom?: Date;
  dateTo?: Date;
  tags?: string[];
}

export interface ChatAnalytics {
  totalConversations: number;
  openConversations: number;
  averageResponseTime: number;
  customerSatisfaction: number;
  totalMessages: number;
  agentMetrics: {
    agentId: string;
    agentName: string;
    conversationsHandled: number;
    averageResponseTime: number;
    customerRating: number;
  }[];
}