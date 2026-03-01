import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendLoginCodeDto {
  @ApiProperty({
    description: 'User email address to send login code',
    example: 'user@example.com',
  })
  @IsEmail({}, { message: 'Must be a valid email address' })
  email: string;
}
