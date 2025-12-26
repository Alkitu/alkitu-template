import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { PrismaService } from '../prisma.service';
import { PushNotificationService } from './push-notification.service';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, PushNotificationService, PrismaService],
  exports: [NotificationService, PushNotificationService],
})
export class NotificationModule {}
