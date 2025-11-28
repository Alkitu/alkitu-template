// @ts-nocheck
// 
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Test Email DTO - OCP Extension Example
 *
 * Notice: Adding 'marketing' type demonstrates OCP compliance.
 * The email system can handle this new type without any modifications
 * to existing controllers or services.
 */
export class TestEmailDto {
  @ApiProperty({
    description: 'Recipient email address',
    example: 'test@example.com',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  to: string;

  @ApiProperty({
    description: 'Type of email to send',
    enum: ['welcome', 'reset', 'verification', 'notification', 'marketing'],
    example: 'welcome',
  })
  @IsIn(['welcome', 'reset', 'verification', 'notification', 'marketing'], {
    message:
      'Type must be one of: welcome, reset, verification, notification, marketing',
  })
  type: 'welcome' | 'reset' | 'verification' | 'notification' | 'marketing';

  @ApiPropertyOptional({
    description: 'User name for personalization',
    example: 'John Doe',
    default: 'Test User',
  })
  @IsOptional()
  @IsString()
  userName?: string;
}
