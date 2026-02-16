import {
  IsString,
  IsBoolean,
  IsOptional,
  IsEnum,
  IsNumber,
} from 'class-validator';
import { ConversationStatus, Priority } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StartConversationDto {
  @ApiPropertyOptional({
    description: 'Visitor email address',
    example: 'visitor@example.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'Visitor phone number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Visitor name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: 'Visitor company',
    example: 'Acme Corp',
  })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({
    description: 'Initial message to start the conversation',
    example: 'Hello, I need help with my account',
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({
    description: 'Source of the conversation',
    example: 'website',
    default: 'website',
  })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({
    description: 'Visitor IP address',
    example: '192.168.1.1',
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({
    description: 'Visitor user agent',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({
    description: 'ID of the authenticated user starting the conversation',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @IsOptional()
  @IsString()
  userId?: string;
}

export class SendMessageDto {
  @ApiProperty({
    description: 'Conversation ID to send message to',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Thank you for contacting us!',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Whether the message is from a visitor or agent',
    example: false,
  })
  @IsBoolean()
  isFromVisitor: boolean;

  @ApiPropertyOptional({
    description: 'User ID of the sender (for agent messages)',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @IsOptional()
  @IsString()
  senderUserId?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the message',
    example: { attachments: [], priority: 'normal' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

export class GetMessagesDto {
  @ApiProperty({
    description: 'Conversation ID to get messages from',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  conversationId: string;
}

export class GetConversationsDto {
  @ApiPropertyOptional({
    description: 'Filter by conversation status',
    enum: ConversationStatus,
    example: ConversationStatus.OPEN,
  })
  @IsOptional()
  @IsEnum(ConversationStatus)
  status?: ConversationStatus;

  @ApiPropertyOptional({
    description: 'Filter by conversation priority',
    enum: Priority,
    example: Priority.NORMAL,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiPropertyOptional({
    description: 'Search in conversation content',
    example: 'help with account',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class AssignConversationDto {
  @ApiProperty({
    description: 'Conversation ID to assign',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'User ID to assign the conversation to',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @IsString()
  assignedToId: string;
}

export class UpdateStatusDto {
  @ApiProperty({
    description: 'Conversation ID to update',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'New conversation status',
    enum: ConversationStatus,
    example: ConversationStatus.RESOLVED,
  })
  @IsEnum(ConversationStatus)
  status: ConversationStatus;
}

export class ReplyToMessageDto {
  @ApiProperty({
    description: 'Conversation ID to reply to',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'Reply message content',
    example: 'I can help you with that!',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'User ID of the agent replying',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @IsString()
  senderUserId: string;
}

export class AddInternalNoteDto {
  @ApiProperty({
    description: 'Conversation ID to add note to',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'Internal note content (not visible to visitors)',
    example: 'Customer seems frustrated, handle with care',
  })
  @IsString()
  note: string;
}

export class MarkAsReadDto {
  @ApiProperty({
    description: 'Conversation ID to mark as read',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  conversationId: string;

  @ApiProperty({
    description: 'User ID marking the conversation as read',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @IsString()
  userId: string;
}

export class MarkAsDeliveredDto {
  @ApiProperty({
    description: 'Conversation ID to mark as delivered',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  conversationId: string;

  @ApiPropertyOptional({
    description: 'Whether marking as visitor or agent',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isVisitor?: boolean;
}
