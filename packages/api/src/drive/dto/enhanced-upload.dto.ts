import {
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  IsNumber,
  IsPositive,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class UploadFileDto {
  @ApiProperty({ description: 'File name', example: 'document.pdf' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Base64 encoded file data' })
  @IsString()
  @IsNotEmpty()
  data!: string;

  @ApiProperty({
    description: 'MIME type',
    example: 'application/pdf',
  })
  @IsString()
  @IsNotEmpty()
  mimeType!: string;

  @ApiProperty({ description: 'File size in bytes', example: 1024 })
  @IsNumber()
  @IsPositive()
  size!: number;
}

export class EnhancedUploadDto {
  @ApiProperty({
    description: 'Google Drive folder ID',
    example: '1abc123def456',
  })
  @IsString()
  @IsNotEmpty()
  folderId!: string;

  @ApiProperty({
    description: 'Array of files to upload',
    type: [UploadFileDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UploadFileDto)
  files!: UploadFileDto[];
}
