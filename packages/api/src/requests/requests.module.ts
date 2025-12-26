import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma.service';
import { NotificationModule } from '../notification/notification.module';
import { EmailTemplateModule } from '../email-templates/email-template.module';

/**
 * Module for managing service requests lifecycle (ALI-119 + ALI-120 + ALI-121)
 * @module RequestsModule
 */
@Module({
  imports: [NotificationModule, EmailTemplateModule],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService],
  exports: [RequestsService],
})
export class RequestsModule {}
