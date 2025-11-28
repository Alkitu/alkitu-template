// @ts-nocheck
import { z } from 'zod';
import { IsString, IsEnum, IsOptional, IsArray, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  CHAT_NEW_CONVERSATION = 'chat_new_conversation',
  CHAT_NEW_MESSAGE = 'chat_new_message'
}

export const CreateNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message is too long'),
  type: z
    .enum([NotificationType.INFO, NotificationType.WARNING, NotificationType.ERROR, NotificationType.SUCCESS, NotificationType.CHAT_NEW_CONVERSATION, NotificationType.CHAT_NEW_MESSAGE], {
      errorMap: () => ({
        message: 'Type must be one of: info, warning, error, success, chat_new_conversation, chat_new_message',
      }),
    })
    .default(NotificationType.INFO),
  link: z.string().url('Link must be a valid URL').optional(),
});

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID to send the notification to',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Notification message content',
    example: 'Welcome to Alkitu! Your account has been created successfully.',
    maxLength: 500
  })
  @IsString()
  @MaxLength(500, { message: 'Message is too long' })
  message!: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.INFO
  })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiPropertyOptional({
    description: 'Optional link to redirect when notification is clicked',
    example: '/dashboard'
  })
  @IsOptional()
  @IsUrl({}, { message: 'Link must be a valid URL' })
  link?: string;
}

export class BulkMarkAsReadDto {
  @ApiProperty({
    description: 'Array of notification IDs to mark as read',
    type: [String],
    example: ['60d5ecb74f3b2c001c8b4567', '60d5ecb74f3b2c001c8b4568']
  })
  @IsArray()
  @IsString({ each: true })
  notificationIds!: string[];
}

export class BulkDeleteDto {
  @ApiProperty({
    description: 'Array of notification IDs to delete',
    type: [String],
    example: ['60d5ecb74f3b2c001c8b4567', '60d5ecb74f3b2c001c8b4568']
  })
  @IsArray()
  @IsString({ each: true })
  notificationIds!: string[];
}

export class DeleteByTypeDto {
  @ApiProperty({
    description: 'Notification type to delete',
    enum: NotificationType,
    example: NotificationType.INFO
  })
  @IsEnum(NotificationType)
  type!: NotificationType;
}
