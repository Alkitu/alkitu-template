// @ts-nocheck
// 
import { Conversation, ChatMessage, ContactInfo, ConversationStatus, Priority } from '@prisma/client';
import { StartConversationDto, SendMessageDto, GetConversationsDto, AssignConversationDto, UpdateStatusDto, ReplyToMessageDto, AddInternalNoteDto, MarkAsReadDto } from '../dto/chat.dto';

export interface ConversationResult {
  conversation: Conversation;
  contactInfo: ContactInfo;
}

export interface MessageResult {
  message: ChatMessage;
}

export interface IChatService {
  startConversation(data: StartConversationDto): Promise<ConversationResult>;
  sendMessage(data: SendMessageDto): Promise<MessageResult>;
  getMessages(conversationId: string): Promise<ChatMessage[]>;
  getConversations(filter: GetConversationsDto): Promise<Conversation[]>;
  assignConversation(data: AssignConversationDto): Promise<Conversation>;
  updateStatus(data: UpdateStatusDto): Promise<Conversation>;
  replyToMessage(data: ReplyToMessageDto): Promise<ChatMessage>;
  addInternalNote(data: AddInternalNoteDto): Promise<Conversation>;
  markAsRead(data: MarkAsReadDto): Promise<void>;
}

export interface IConversationRepository {
  create(data: any): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  findAll(filter: any): Promise<Conversation[]>;
  updateLastMessageTime(conversationId: string, lastMessageAt: Date): Promise<Conversation>;
  update(conversationId: string, data: any): Promise<Conversation>;
}

export interface IMessageRepository {
  create(data: any): Promise<ChatMessage>;
  findByConversationId(conversationId: string): Promise<ChatMessage[]>;
}

export interface IContactInfoRepository {
  create(data: any): Promise<ContactInfo>;
  findByEmail(email: string): Promise<ContactInfo | null>;
  findById(id: string): Promise<ContactInfo | null>;
}
