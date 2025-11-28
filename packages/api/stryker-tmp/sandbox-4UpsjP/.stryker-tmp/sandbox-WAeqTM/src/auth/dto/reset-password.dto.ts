// @ts-nocheck
// 
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Password reset token received via email',
    example: 'abc123def456ghi789',
  })
  @IsString({ message: 'Token is required' })
  token: string;

  @ApiProperty({
    description: 'New password for the user account',
    example: 'NewSecurePassword123',
    minLength: 6,
  })
  @IsString({ message: 'New password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  newPassword: string;
}
