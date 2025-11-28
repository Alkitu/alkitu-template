// @ts-nocheck
// 
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

/**
 * Test Email DTO - OCP Extension Example
 * 
 * Notice: Adding 'marketing' type demonstrates OCP compliance.
 * The email system can handle this new type without any modifications
 * to existing controllers or services.
 */
export class TestEmailDto {
  @IsEmail({}, { message: 'Must be a valid email address' })
  to: string;

  @IsIn(['welcome', 'reset', 'verification', 'notification', 'marketing'], {
    message: 'Type must be one of: welcome, reset, verification, notification, marketing',
  })
  type: 'welcome' | 'reset' | 'verification' | 'notification' | 'marketing';

  @IsOptional()
  @IsString()
  userName?: string;
}
