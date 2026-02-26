import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InitResumableDto {
  @ApiProperty({ description: 'File name', example: 'video.mp4' })
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiProperty({ description: 'File size in bytes', example: 10485760 })
  @IsNumber()
  @IsPositive()
  fileSize!: number;

  @ApiProperty({ description: 'MIME type', example: 'video/mp4' })
  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @ApiProperty({
    description: 'Google Drive folder ID',
    example: '1abc123def456',
  })
  @IsString()
  @IsNotEmpty()
  folderId!: string;

  @ApiPropertyOptional({ description: 'File description' })
  @IsOptional()
  @IsString()
  description?: string;
}
