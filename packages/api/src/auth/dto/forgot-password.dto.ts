import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'User email address to send password reset link',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;
}
