import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma.service';
import { NotificationModule } from '../notification/notification.module';

/**
 * Module for managing service requests lifecycle (ALI-119 + ALI-120)
 * @module RequestsModule
 */
@Module({
  imports: [NotificationModule],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
  exports: [RequestsService],
})
export class RequestsModule {}
