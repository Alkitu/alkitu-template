// @ts-nocheck
// 
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class BulkDeleteUsersDto {
  @ApiProperty({ description: 'Array of user IDs to delete', type: [String] })
  @IsArray()
  @IsString({ each: true })
  userIds!: string[];
}

export class BulkUpdateRoleDto {
  @ApiProperty({ description: 'Array of user IDs to update', type: [String] })
  @IsArray()
  @IsString({ each: true })
  userIds!: string[];

  @ApiProperty({ enum: UserRole, description: 'New role to assign' })
  @IsEnum(UserRole)
  role!: UserRole;
}

export class BulkUpdateStatusDto {
  @ApiProperty({ description: 'Array of user IDs to update', type: [String] })
  @IsArray()
  @IsString({ each: true })
  userIds!: string[];

  @ApiProperty({ enum: UserStatus, description: 'Status to set' })
  @IsEnum(UserStatus)
  status!: UserStatus;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'User ID to reset password for' })
  @IsString()
  userId!: string;

  @ApiPropertyOptional({
    description: 'Send email notification to user',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  sendEmail?: boolean = true;
}

export class AdminChangePasswordDto {
  @ApiProperty({ description: 'User ID to change password for' })
  @IsString()
  userId!: string;

  @ApiProperty({ description: 'New password to set' })
  @IsString()
  newPassword!: string;
}

export class SendMessageDto {
  @ApiProperty({ description: 'User ID to send message to' })
  @IsString()
  userId!: string;

  @ApiProperty({ description: 'Message to send' })
  @IsString()
  message!: string;
}

export class AnonymizeUserDto {
  @ApiProperty({ description: 'User ID to anonymize' })
  @IsString()
  userId!: string;
}

export class ImpersonateUserDto {
  @ApiProperty({ description: 'Admin user ID performing impersonation' })
  @IsString()
  adminId!: string;

  @ApiProperty({ description: 'Target user ID to impersonate' })
  @IsString()
  targetUserId!: string;
}
