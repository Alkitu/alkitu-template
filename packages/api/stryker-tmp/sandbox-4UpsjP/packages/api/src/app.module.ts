// @ts-nocheck
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma.service';
import { AuthModule } from './auth/auth.module';
import { TrpcModule } from './trpc/trpc.module';
import { EmailModule } from './email/email.module';
import { NotificationModule } from './notification/notification.module';
// import { BillingModule } from './billing/billing.module';
import { HealthModule } from './health/health.module';
import { WebSocketModule } from './websocket/websocket.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TrpcModule,
    EmailModule,
    NotificationModule,
    HealthModule,
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
