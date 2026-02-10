import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { PrismaService } from '../prisma.service';
import { NotificationModule } from '../notification/notification.module';
import { EmailTemplateModule } from '../email-templates/email-template.module';
import { AccessControlModule } from '../access-control/access-control.module';
import { RequestStatusChangedHook } from './hooks/request-status-changed.hook';

/**
 * Module for managing service requests lifecycle (ALI-119 + ALI-120 + ALI-121)
 * @module RequestsModule
 */
@Module({
  imports: [NotificationModule, EmailTemplateModule, AccessControlModule],
  controllers: [RequestsController],
  providers: [RequestsService, PrismaService, RequestStatusChangedHook],
  exports: [RequestsService, RequestStatusChangedHook],
})
export class RequestsModule {}
