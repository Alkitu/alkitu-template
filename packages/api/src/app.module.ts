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
import { ChatModule } from './chat/chat.module';
import { ChatbotConfigModule } from './chatbot-config/chatbot-config.module';
import { ThemeModule } from './theme/theme.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    TrpcModule,
    EmailModule,
    NotificationModule,
    HealthModule,
    WebSocketModule,
    ChatModule,
    ChatbotConfigModule,
    ThemeModule,
    LocationsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
