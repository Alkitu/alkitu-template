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
import { channelsRouter } from './routers/channels.router';
import { createThemeRouter } from './routers/theme.router';
import { createEmailTemplateRouter } from './routers/email-template.router';
import { createRequestRouter } from './routers/request.router';
import { createServiceRouter } from './routers/service.router';
import { createCategoryRouter } from './routers/category.router';
import { createLocationRouter } from './routers/location.router';
import { createAccountRouter } from './routers/account.router';
import { createFeatureFlagsRouter } from './routers/feature-flags.router';
import { createFormTemplateRouter } from './routers/form-template.router';
import { t } from './trpc';
import { ChatbotConfigService } from '../chatbot-config/chatbot-config.service';
import { ThemeService } from '../theme/theme.service';
import { EmailTemplateService } from '../email-templates/email-template.service';
import { FeatureFlagsService } from '../feature-flags/feature-flags.service';
import { CounterService } from '../counter/counter.service';
import { DriveFolderService } from '../drive/drive-folder.service';
import { DriveService } from '../drive/drive.service';

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
    private featureFlagsService: FeatureFlagsService,
    private counterService: CounterService,
    private driveFolderService: DriveFolderService,
    private driveService: DriveService,
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
      user: createUserRouter(this.usersService, this.emailService, this.driveFolderService, this.driveService), // Incluir el router de usuario con servicios
      chat: chatRouter, // Incluir el router de chat
      channels: channelsRouter, // Channels router
      chatbotConfig: chatbotConfigRouter, // Incluir el router de configuración del chatbot
      theme: createThemeRouter(this.themeService), // Incluir el router de temas
      emailTemplate: createEmailTemplateRouter(this.emailTemplateService), // ALI-121: Router de email templates
      request: createRequestRouter(this.prisma, this.notificationService, this.emailTemplateService, this.counterService, this.driveFolderService, this.driveService), // ALI-119: Router de solicitudes (requests)
      service: createServiceRouter(this.prisma, this.driveFolderService), // Service catalog router
      category: createCategoryRouter(this.prisma), // Category catalog router with stats
      location: createLocationRouter(this.prisma), // Work location router
      account: createAccountRouter(this.prisma), // Connected accounts router (link/unlink OAuth)
      featureFlags: createFeatureFlagsRouter(this.featureFlagsService), // Feature flags router
      formTemplate: createFormTemplateRouter(this.prisma), // Form template router (Advanced Form Builder)
    });
  }
}

export type AppRouter = ReturnType<TrpcRouter['appRouter']>;
