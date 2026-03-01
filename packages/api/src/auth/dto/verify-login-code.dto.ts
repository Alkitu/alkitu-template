import { IsEmail, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyLoginCodeDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;

  @ApiProperty({
    description: '6-digit login code received via email',
    example: '123456',
  })
  @IsString({ message: 'Code is required' })
  @Length(6, 6, { message: 'Code must be exactly 6 digits' })
  code: string;
}
