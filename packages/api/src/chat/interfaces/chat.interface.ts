import { Conversation, ChatMessage, ContactInfo } from '@prisma/client';
import type {
  StartConversationInput,
  SendMessageInput,
  GetConversationsInput,
  AssignConversationInput,
  UpdateStatusInput,
  ReplyToMessageInput,
  AddInternalNoteInput,
  MarkAsReadInput,
} from '../../trpc/schemas/chat.schemas';
import { ConversationStatus, Priority } from '@prisma/client';

export interface ConversationResult {
  conversation: Conversation;
  contactInfo: ContactInfo;
}

export interface MessageResult {
  message: ChatMessage;
}

// New specific types for create operations
export interface CreateContactInfoData {
  email?: string;
  phone?: string;
  name?: string;
  company?: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  userId?: string;
}

export interface CreateConversationData {
  contactInfoId: string;
  status: ConversationStatus;
  priority: Priority;
  source: string;
  assignedToId?: string;
  clientUserId?: string;
}

export interface CreateMessageData {
  conversationId: string;
  content: string;
  isFromVisitor: boolean;
  senderUserId?: string;
  metadata?: Record<string, any>;
}

export interface UpdateConversationData {
  status?: ConversationStatus;
  priority?: Priority;
  assignedToId?: string;
  internalNotes?: string;
  lastMessageAt?: Date;
}

export interface ConversationFindOptions {
  where?: {
    id?: string | { in: string[] };
    status?: ConversationStatus;
    priority?: Priority;
    assignedToId?: string;
    clientUserId?: string;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
    OR?: Array<{
      contactInfo?: {
        email?: { contains: string; mode: 'insensitive' };
        name?: { contains: string; mode: 'insensitive' };
      };
      messages?: {
        some?: {
          content?: { contains: string; mode: 'insensitive' };
        };
      };
    }>;
  };
  include?: {
    contactInfo?: boolean;
    messages?:
      | boolean
      | {
          orderBy?: { createdAt: 'asc' | 'desc' };
          take?: number;
        };
    assignedTo?: boolean;
  };
  skip?: number;
  take?: number;
  orderBy?: {
    createdAt?: 'asc' | 'desc';
    lastMessageAt?: 'asc' | 'desc';
  };
}

export interface ContactInfoFindOptions {
  where?: {
    id?: string;
    email?: string;
    createdAt?: {
      gte?: Date;
      lte?: Date;
    };
  };
  include?: {
    conversations?: boolean;
  };
}

export interface IChatService {
  startConversation(data: StartConversationInput): Promise<ConversationResult>;
  sendMessage(data: SendMessageInput): Promise<MessageResult>;
  getMessages(conversationId: string): Promise<ChatMessage[]>;
  getConversations(filter: GetConversationsInput): Promise<Conversation[]>;
  assignConversation(data: AssignConversationInput): Promise<Conversation>;
  updateStatus(data: UpdateStatusInput): Promise<Conversation>;
  replyToMessage(data: ReplyToMessageInput): Promise<MessageResult>;
  addInternalNote(data: AddInternalNoteInput): Promise<Conversation>;
  markAsRead(data: MarkAsReadInput): Promise<void>;
}

export interface IConversationRepository {
  create(data: CreateConversationData): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findAll(options: ConversationFindOptions): Promise<Conversation[]>;
  updateLastMessageTime(
    conversationId: string,
    lastMessageAt: Date,
  ): Promise<Conversation>;
  update(
    conversationId: string,
    data: UpdateConversationData,
  ): Promise<Conversation>;
}

export interface IMessageRepository {
  create(data: CreateMessageData): Promise<ChatMessage>;
  findByConversationId(conversationId: string): Promise<ChatMessage[]>;
}

export interface IContactInfoRepository {
  create(data: CreateContactInfoData): Promise<ContactInfo>;
  findByEmail(email: string): Promise<ContactInfo | null>;
  findByPhone(phone: string): Promise<ContactInfo | null>;
  findById(id: string): Promise<ContactInfo | null>;
  findAll(options: ContactInfoFindOptions): Promise<ContactInfo[]>;
}
