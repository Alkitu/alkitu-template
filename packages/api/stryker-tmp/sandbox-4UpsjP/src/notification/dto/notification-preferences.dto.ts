// @ts-nocheck
import { z } from 'zod';
import { IsBoolean, IsArray, IsString, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

export enum EmailFrequency {
  IMMEDIATE = 'immediate',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly'
}

export const NotificationPreferencesSchema = z.object({
  emailEnabled: z.boolean().default(true),
  emailTypes: z.array(z.string()).default(['welcome', 'security', 'system']),

  pushEnabled: z.boolean().default(true),
  pushTypes: z.array(z.string()).default(['urgent', 'mentions', 'system']),

  inAppEnabled: z.boolean().default(true),
  inAppTypes: z.array(z.string()).default(['all']),

  emailFrequency: z
    .enum(['immediate', 'hourly', 'daily', 'weekly'])
    .default('immediate'),
  digestEnabled: z.boolean().default(false),

  quietHoursEnabled: z.boolean().default(false),
  quietHoursStart: z
    .string()
    .regex(timeRegex, 'Time must be in HH:mm format')
    .nullable()
    .optional(),
  quietHoursEnd: z
    .string()
    .regex(timeRegex, 'Time must be in HH:mm format')
    .nullable()
    .optional(),

  marketingEnabled: z.boolean().default(false),
  promotionalEnabled: z.boolean().default(false),
});

export class NotificationPreferencesDto {
  @ApiProperty({
    description: 'Enable email notifications',
    example: true,
    default: true
  })
  @IsBoolean()
  emailEnabled!: boolean;

  @ApiProperty({
    description: 'Types of email notifications to receive',
    type: [String],
    example: ['welcome', 'security', 'system'],
    default: ['welcome', 'security', 'system']
  })
  @IsArray()
  @IsString({ each: true })
  emailTypes!: string[];

  @ApiProperty({
    description: 'Enable push notifications',
    example: true,
    default: true
  })
  @IsBoolean()
  pushEnabled!: boolean;

  @ApiProperty({
    description: 'Types of push notifications to receive',
    type: [String],
    example: ['urgent', 'mentions', 'system'],
    default: ['urgent', 'mentions', 'system']
  })
  @IsArray()
  @IsString({ each: true })
  pushTypes!: string[];

  @ApiProperty({
    description: 'Enable in-app notifications',
    example: true,
    default: true
  })
  @IsBoolean()
  inAppEnabled!: boolean;

  @ApiProperty({
    description: 'Types of in-app notifications to receive',
    type: [String],
    example: ['all'],
    default: ['all']
  })
  @IsArray()
  @IsString({ each: true })
  inAppTypes!: string[];

  @ApiProperty({
    description: 'Email notification frequency',
    enum: EmailFrequency,
    example: EmailFrequency.IMMEDIATE,
    default: EmailFrequency.IMMEDIATE
  })
  @IsEnum(EmailFrequency)
  emailFrequency!: EmailFrequency;

  @ApiProperty({
    description: 'Enable email digest',
    example: false,
    default: false
  })
  @IsBoolean()
  digestEnabled!: boolean;

  @ApiProperty({
    description: 'Enable quiet hours',
    example: false,
    default: false
  })
  @IsBoolean()
  quietHoursEnabled!: boolean;

  @ApiPropertyOptional({
    description: 'Quiet hours start time (HH:mm format)',
    example: '22:00',
    nullable: true
  })
  @IsOptional()
  @IsString()
  @Matches(timeRegex, { message: 'Time must be in HH:mm format' })
  quietHoursStart?: string | null;

  @ApiPropertyOptional({
    description: 'Quiet hours end time (HH:mm format)',
    example: '08:00',
    nullable: true
  })
  @IsOptional()
  @IsString()
  @Matches(timeRegex, { message: 'Time must be in HH:mm format' })
  quietHoursEnd?: string | null;

  @ApiProperty({
    description: 'Enable marketing notifications',
    example: false,
    default: false
  })
  @IsBoolean()
  marketingEnabled!: boolean;

  @ApiProperty({
    description: 'Enable promotional notifications',
    example: false,
    default: false
  })
  @IsBoolean()
  promotionalEnabled!: boolean;
}
