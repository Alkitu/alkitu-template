// @ts-nocheck
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email: string;
}
