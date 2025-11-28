// @ts-nocheck
// 
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';
import { createNotificationRouter } from './routers/notification.router';
import { billingRouter } from './routers/billing.router';
import { createUserRouter } from './routers/user.router';
import { t } from './trpc';

@Injectable()
export class TrpcRouter {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private emailService: EmailService,
    private notificationService: NotificationService,
  ) {}

  get appRouter() {
    return t.router({
      hello: t.procedure
        .input(z.object({ name: z.string() }))
        .query(({ input }) => {
          return {
            greeting: `Hello ${input.name}!`,
          };
        }),
      notification: createNotificationRouter(this.notificationService), // Incluir el router de notificaciones
      billing: billingRouter, // Incluir el router de facturación
      user: createUserRouter(this.usersService, this.emailService), // Incluir el router de usuario con servicios
    });
  }
}

export type AppRouter = TrpcRouter['appRouter'];
