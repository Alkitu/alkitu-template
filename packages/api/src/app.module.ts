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
import { CategoriesModule } from './categories/categories.module';
import { ServicesModule } from './services/services.module';
import { RequestsModule } from './requests/requests.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    // Global rate limiting: Disabled for E2E tests (very high limit)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 60 seconds
        limit: 999999, // Effectively disabled for E2E tests
        skipIf: () => process.env.NODE_ENV === 'test', // Skip throttling entirely for tests
      },
    ]),
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
    CategoriesModule,
    ServicesModule,
    RequestsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    // Apply throttler globally (DISABLED FOR E2E TESTS)
    // {
    //   provide: APP_GUARD,
    //   useClass: ThrottlerGuard,
    // },
  ],
  exports: [PrismaService],
})
export class AppModule {}
