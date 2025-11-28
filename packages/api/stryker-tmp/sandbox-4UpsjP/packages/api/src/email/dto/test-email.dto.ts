// @ts-nocheck
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class TestEmailDto {
  @IsEmail({}, { message: 'Must be a valid email address' })
  to: string;

  @IsIn(['welcome', 'reset', 'verification', 'notification'], {
    message: 'Type must be one of: welcome, reset, verification, notification',
  })
  type: 'welcome' | 'reset' | 'verification' | 'notification';

  @IsOptional()
  @IsString()
  userName?: string;
}
