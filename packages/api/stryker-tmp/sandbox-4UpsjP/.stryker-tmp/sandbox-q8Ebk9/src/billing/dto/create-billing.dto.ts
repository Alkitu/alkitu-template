// @ts-nocheck
// 
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';

export class CreateBillingDto {
  @IsString()
  userId!: string;

  @IsString()
  plan!: string;

  @IsString()
  status!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;

  @IsDateString()
  startDate!: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
