// @ts-nocheck
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'Email verification token received via email',
    example: 'xyz789abc123def456',
  })
  @IsString({ message: 'Token is required' })
  token: string;
}
