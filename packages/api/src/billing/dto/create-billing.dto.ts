import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsPositive,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum BillingStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export class CreateBillingDto {
  @ApiProperty({
    description: 'User ID for the billing record',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @IsString()
  userId!: string;

  @ApiProperty({
    description: 'Billing plan name',
    example: 'Premium Plan',
  })
  @IsString()
  plan!: string;

  @ApiProperty({
    description: 'Billing status',
    enum: BillingStatus,
    example: BillingStatus.PENDING,
  })
  @IsEnum(BillingStatus)
  status!: BillingStatus;

  @ApiProperty({
    description: 'Billing amount',
    example: 99.99,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount!: number;

  @ApiProperty({
    description: 'Currency code',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  currency!: string;

  @ApiProperty({
    description: 'Billing period start date',
    example: '2024-01-01T00:00:00.000Z',
  })
  @IsDateString()
  startDate!: Date;

  @ApiPropertyOptional({
    description: 'Billing period end date',
    example: '2024-01-31T23:59:59.999Z',
  })
  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Payment method used',
    example: 'credit_card',
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Transaction ID from payment processor',
    example: 'txn_1234567890',
  })
  @IsOptional()
  @IsString()
  transactionId?: string;
}
