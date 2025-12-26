import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { ChannelType, ChannelRole, UserRole } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({
    description: 'Name of the channel',
    example: 'general',
  })
  @IsString()
  @IsOptional() // Optional for DMs
  name?: string;

  @ApiPropertyOptional({
    description: 'Description of the channel',
    example: 'General discussion for the team',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Type of the channel',
    enum: ChannelType,
    example: ChannelType.PUBLIC,
  })
  @IsEnum(ChannelType)
  type: ChannelType;

  @ApiPropertyOptional({
    description: 'Initial members to add (user IDs)',
    example: ['60d5ecb74f3b2c001c8b4566'],
  })
  @IsOptional()
  @IsArray()
  members?: string[];

  @ApiPropertyOptional({
    description: 'Roles allowed to access this channel (if public/private)',
    enum: UserRole,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UserRole, { each: true })
  allowedRoles?: UserRole[];
}

export class AddMemberDto {
  @ApiProperty({
    description: 'Channel ID',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  channelId: string;

  @ApiProperty({
    description: 'User ID to add',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @IsString()
  userId: string;

  @ApiPropertyOptional({
    description: 'Role of the member',
    enum: ChannelRole,
    example: ChannelRole.MEMBER,
  })
  @IsOptional()
  @IsEnum(ChannelRole)
  role?: ChannelRole;
}

export class SendChannelMessageDto {
  @ApiProperty({
    description: 'Channel ID to send message to',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @IsString()
  channelId: string;

  @ApiProperty({
    description: 'Message content',
    example: 'Hello team!',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Attachments',
    example: [{ type: 'image', url: '...' }],
  })
  @IsOptional()
  attachments?: any;

  @ApiPropertyOptional({
    description: 'Thread parent ID',
    example: '60d5ecb74f3b2c001c8b4568',
  })
  @IsOptional()
  @IsString()
  parentId?: string;
}
