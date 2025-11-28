// @ts-nocheck
// 
import { IsString } from 'class-validator';

export class VerifyEmailDto {
  @IsString({ message: 'El token es requerido' })
  token: string;
}
