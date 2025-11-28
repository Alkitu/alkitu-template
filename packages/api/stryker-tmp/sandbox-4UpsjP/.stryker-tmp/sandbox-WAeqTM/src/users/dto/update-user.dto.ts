// @ts-nocheck
// 
import { z } from 'zod';
import { UserRole, UserStatus } from '@prisma/client';
import { IsString, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export const UpdateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .optional(),
  contactNumber: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'User first name',
    example: 'John',
    minLength: 2
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name?: string;

  @ApiPropertyOptional({
    description: 'User last name',
    example: 'Doe',
    minLength: 2
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Last name must be at least 2 characters' })
  lastName?: string;

  @ApiPropertyOptional({
    description: 'User contact number',
    example: '+1234567890'
  })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiPropertyOptional({
    description: 'User role',
    enum: UserRole,
    example: UserRole.USER
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'User status',
    enum: UserStatus,
    example: UserStatus.ACTIVE
  })
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
