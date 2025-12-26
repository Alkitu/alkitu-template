import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../prisma.service';
import { UsersService } from '../users/users.service';
import { EmailService } from '../email/email.service';
import { NotificationService } from '../notification/notification.service';
import { createNotificationRouter } from './routers/notification.router';
import { billingRouter } from './routers/billing.router';
import { createUserRouter } from './routers/user.router';
import { chatRouter } from './routers/chat.router';
import { chatbotConfigRouter } from './routers/chatbot-config.router';
import { createThemeRouter } from './routers/theme.router';
import { createEmailTemplateRouter } from './routers/email-template.router';
import { t } from './trpc';
import { ChatbotConfigService } from '../chatbot-config/chatbot-config.service';
import { ThemeService } from '../theme/theme.service';
import { EmailTemplateService } from '../email-templates/email-template.service';

@Injectable()
export class TrpcRouter {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private emailService: EmailService,
    private notificationService: NotificationService,
    private chatbotConfigService: ChatbotConfigService,
    private themeService: ThemeService,
    private emailTemplateService: EmailTemplateService,
  ) {}

  appRouter() {
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
      chat: chatRouter, // Incluir el router de chat
      chatbotConfig: chatbotConfigRouter, // Incluir el router de configuración del chatbot
      theme: createThemeRouter(this.themeService), // Incluir el router de temas
      emailTemplate: createEmailTemplateRouter(this.emailTemplateService), // ALI-121: Router de email templates
    });
  }
}

export type AppRouter = ReturnType<TrpcRouter['appRouter']>;
