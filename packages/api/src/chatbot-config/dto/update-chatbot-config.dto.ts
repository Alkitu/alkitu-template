import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsObject,
  IsInt,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateChatbotConfigDto {
  @ApiPropertyOptional({
    description: 'Primary color for the chat widget',
    example: '#007ee6',
  })
  @IsOptional()
  @IsString()
  primaryColor?: string;

  @ApiPropertyOptional({
    description: 'Text color for the chat widget',
    example: '#FFFFFF',
  })
  @IsOptional()
  @IsString()
  textColor?: string;

  @ApiPropertyOptional({
    description: 'Background color for the chat widget',
    example: '#222222',
  })
  @IsOptional()
  @IsString()
  backgroundColor?: string;

  @ApiPropertyOptional({
    description: 'Border radius for the chat widget',
    example: 8,
  })
  @IsOptional()
  @IsInt()
  borderRadius?: number;

  @ApiPropertyOptional({
    description: 'Widget position on the page',
    example: 'bottom-right',
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Auto-open chat widget',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  autoOpen?: boolean;

  @ApiPropertyOptional({
    description: 'Auto-open delay in milliseconds',
    example: 5000,
  })
  @IsOptional()
  @IsInt()
  autoOpenDelay?: number;

  @ApiPropertyOptional({
    description: 'Enable offline mode',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  offlineMode?: boolean;

  @ApiPropertyOptional({
    description: 'Require email from visitors',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  requireEmail?: boolean;

  @ApiPropertyOptional({
    description: 'Require phone from visitors',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  requirePhone?: boolean;

  @ApiPropertyOptional({
    description: 'Require name from visitors',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  requireName?: boolean;

  @ApiPropertyOptional({
    description: 'Require company from visitors',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  requireCompany?: boolean;

  @ApiPropertyOptional({
    description: 'Allow anonymous chat',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  allowAnonymous?: boolean;

  @ApiPropertyOptional({
    description: 'Welcome message shown to visitors',
    example: 'Hi there! How can we help you today?',
  })
  @IsOptional()
  @IsString()
  welcomeMessage?: string;

  @ApiPropertyOptional({
    description: 'Offline message',
    example:
      "We are currently offline. Please leave a message and we'll get back to you.",
  })
  @IsOptional()
  @IsString()
  offlineMessage?: string;

  @ApiPropertyOptional({
    description: 'Thank you message',
    example: "Thank you for your message! We'll get back to you shortly.",
  })
  @IsOptional()
  @IsString()
  thankYouMessage?: string;

  @ApiPropertyOptional({
    description: 'Enable business hours',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  businessHoursEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Timezone for business hours',
    example: 'America/New_York',
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Weekly schedule configuration',
    example: {
      monday: { start: '09:00', end: '17:00' },
      tuesday: { start: '09:00', end: '17:00' },
      wednesday: { start: '09:00', end: '17:00' },
      thursday: { start: '09:00', end: '17:00' },
      friday: { start: '09:00', end: '17:00' },
      saturday: null,
      sunday: null,
    },
  })
  @IsOptional()
  @IsObject()
  schedule?: any;

  @ApiPropertyOptional({
    description: 'Rate limit for messages per window',
    example: 5,
  })
  @IsOptional()
  @IsInt()
  rateLimitMessages?: number;

  @ApiPropertyOptional({
    description: 'Rate limit window in seconds',
    example: 60,
  })
  @IsOptional()
  @IsInt()
  rateLimitWindow?: number;

  @ApiPropertyOptional({
    description: 'Keywords to block for spam prevention',
    type: [String],
    example: ['spam', 'viagra', 'casino'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  blockSpamKeywords?: string[];
}
