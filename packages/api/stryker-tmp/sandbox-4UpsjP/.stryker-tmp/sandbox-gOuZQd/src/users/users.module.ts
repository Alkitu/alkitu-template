// @ts-nocheck
// 
import { Module, forwardRef } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';
import { NotificationModule } from '../notification/notification.module';
import { AuthModule } from '../auth/auth.module';

// ✅ SOLID Services Import
import {
  UserRepositoryService,
  UserAuthenticationService,
  UserAnalyticsService,
  UserEventsService,
  UserFacadeService,
} from './services';

@Module({
  imports: [NotificationModule, forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    // ✅ SOLID Architecture Services
    UserRepositoryService,
    UserAuthenticationService,
    UserAnalyticsService,
    UserEventsService,
    UserFacadeService,
    
    // Legacy service (maintained for gradual migration)
    UsersService,
    
    // Infrastructure
    PrismaService,
  ],
  exports: [
    // ✅ Primary export - SOLID Facade for backward compatibility
    UserFacadeService,
    
    // Individual SOLID services for direct access
    UserRepositoryService,
    UserAuthenticationService,
    UserAnalyticsService,
    UserEventsService,
    
    // Legacy service (maintained for compatibility)
    UsersService,
  ],
})
export class UsersModule {}
