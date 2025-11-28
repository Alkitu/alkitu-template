// @ts-nocheck
// 
import { IsString, IsBoolean, IsOptional, IsEnum, IsArray, IsNumber } from 'class-validator';
import { ConversationStatus, Priority } from '@prisma/client';

export class StartConversationDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class SendMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;

  @IsBoolean()
  isFromVisitor: boolean;

  @IsOptional()
  @IsString()
  senderUserId?: string;

  @IsOptional()
  metadata?: any;
}

export class GetMessagesDto {
  @IsString()
  conversationId: string;
}

export class GetConversationsDto {
  @IsOptional()
  @IsEnum(ConversationStatus)
  status?: ConversationStatus;

  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class AssignConversationDto {
  @IsString()
  conversationId: string;

  @IsString()
  assignedToId: string;
}

export class UpdateStatusDto {
  @IsString()
  conversationId: string;

  @IsEnum(ConversationStatus)
  status: ConversationStatus;
}

export class ReplyToMessageDto {
  @IsString()
  conversationId: string;

  @IsString()
  content: string;

  @IsString()
  senderUserId: string;
}

export class AddInternalNoteDto {
  @IsString()
  conversationId: string;

  @IsString()
  note: string;
}

export class MarkAsReadDto {
  @IsString()
  conversationId: string;

  @IsString()
  userId: string;
}
