// @ts-nocheck
// 
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from './websocket.gateway';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    NotificationModule,
  ],
  providers: [NotificationGateway],
  exports: [NotificationGateway],
})
export class WebSocketModule {}
