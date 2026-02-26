import { z } from 'zod';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client'; // ALI-120: Import from Prisma
// ALI-120: Define NotificationDataSchema locally to avoid import issues
const RequestNotificationDataSchema = z.object({
  requestId: z.string(),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  clientId: z.string().optional(),
  clientName: z.string().optional(),
  employeeId: z.string().optional(),
  employeeName: z.string().optional(),
  previousStatus: z
    .enum(['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'])
    .optional(),
  newStatus: z
    .enum(['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED'])
    .optional(),
  cancellationReason: z.string().optional(),
  completionNotes: z.string().optional(),
});

const GenericNotificationDataSchema = z.object({
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const NotificationDataSchema = z.union([
  GenericNotificationDataSchema,
  RequestNotificationDataSchema,
]);

// Re-export NotificationType for convenience
export { NotificationType };

export const CreateNotificationSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  message: z
    .string()
    .min(1, 'Message is required')
    .max(500, 'Message is too long'),
  type: z.nativeEnum(NotificationType).default(NotificationType.INFO), // ALI-120: Use nativeEnum
  link: z.string().url('Link must be a valid URL').optional().or(z.literal('')),
  data: NotificationDataSchema.optional(), // ALI-120: Add structured data field
});

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID to send the notification to',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Notification message content',
    example: 'Welcome to Alkitu! Your account has been created successfully.',
    maxLength: 500,
  })
  @IsString()
  @MaxLength(500, { message: 'Message is too long' })
  message!: string;

  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.INFO,
  })
  @IsEnum(NotificationType)
  type!: NotificationType;

  @ApiPropertyOptional({
    description: 'Optional link to redirect when notification is clicked',
    example: '/dashboard',
  })
  @IsOptional()
  @IsUrl({}, { message: 'Link must be a valid URL' })
  link?: string;

  @ApiPropertyOptional({
    description:
      'Structured notification payload (requestId, status changes, context, etc.)',
    example: {
      requestId: '507f1f77bcf86cd799439011',
      serviceName: 'Plumbing Repair',
      clientName: 'John Doe',
    },
  })
  @IsOptional()
  data?: Record<string, unknown>; // ALI-120: Structured data payload
}

export class BulkMarkAsReadDto {
  @ApiProperty({
    description: 'Array of notification IDs to mark as read',
    type: [String],
    example: ['60d5ecb74f3b2c001c8b4567', '60d5ecb74f3b2c001c8b4568'],
  })
  @IsArray()
  @IsString({ each: true })
  notificationIds!: string[];
}

export class BulkDeleteDto {
  @ApiProperty({
    description: 'Array of notification IDs to delete',
    type: [String],
    example: ['60d5ecb74f3b2c001c8b4567', '60d5ecb74f3b2c001c8b4568'],
  })
  @IsArray()
  @IsString({ each: true })
  notificationIds!: string[];
}

export class DeleteByTypeDto {
  @ApiProperty({
    description: 'Notification type to delete',
    enum: NotificationType,
    example: NotificationType.INFO,
  })
  @IsEnum(NotificationType)
  type!: NotificationType;
}
