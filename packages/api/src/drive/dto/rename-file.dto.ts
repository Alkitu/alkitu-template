import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RenameFileDto {
  @ApiProperty({ description: 'New name for the file or folder' })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  newName: string;
}
