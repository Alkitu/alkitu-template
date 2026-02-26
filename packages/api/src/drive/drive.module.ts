import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DriveController } from './drive.controller';
import { DriveService } from './drive.service';
import { DriveFolderService } from './drive-folder.service';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [AuthModule],
  controllers: [DriveController],
  providers: [DriveService, DriveFolderService, PrismaService],
  exports: [DriveService, DriveFolderService],
})
export class DriveModule {}
