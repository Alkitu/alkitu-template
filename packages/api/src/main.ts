import { config } from 'dotenv';
config(); // Load environment variables

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { TrpcService } from './trpc/trpc.service';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  const allowedOrigins = [
    process.env.APP_URL,
    process.env.FRONTEND_URL,
    process.env.CORS_ORIGINS,
    'http://localhost:3000',
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global validation pipe with Zod
  app.useGlobalPipes(new ZodValidationPipe());

  // Global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Alkitu API')
    .setDescription(
      `
      # Alkitu API Documentation
      
      This is the comprehensive API documentation for the Alkitu application backend.
      
      ## Features
      - **Authentication & Authorization**: JWT-based authentication with role-based access control
      - **User Management**: Complete CRUD operations for user accounts
      - **Email Services**: Automated email notifications, password resets, and verifications
      - **Notifications**: Real-time notification system for users
      - **Health Monitoring**: System health check endpoints
      
      ## Authentication
      Most endpoints require authentication. Use the 'Authorize' button to add your JWT token.
      
      ## User Roles
      - **ADMIN**: Full system access
      - **EMPLOYEE**: Staff access with user management capabilities
      - **CLIENT**: Client access with limited permissions
      - **USER**: Basic user access
      - **MODERATOR**: Content moderation capabilities
      
      ## Environment
      - Base URL: ${process.env.API_URL || 'http://localhost:3001'}
      - Frontend URL: ${process.env.APP_URL || process.env.FRONTEND_URL || 'http://localhost:3000'}
    `,
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('health', 'System health check endpoints')
    .addTag('auth', 'Authentication and authorization endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('notifications', 'Notification system endpoints')
    .addTag('email', 'Email service endpoints (development)')
    .addTag('billing', 'Billing and subscription management endpoints')
    .addTag('chat', 'Live chat and conversation management endpoints')
    .addTag('chatbot-config', 'Chatbot configuration and settings endpoints')
    .addTag(
      'websocket',
      'WebSocket connection management and monitoring endpoints',
    )

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Alkitu API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { 
        background-color: #1976d2; 
      }
      .swagger-ui .topbar-wrapper img {
        content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzE5NzZkMiIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiPkE8L3RleHQ+Cjwvc3ZnPgo=');
      }
    `,
  });

  const trpcService = app.get(TrpcService);
  trpcService.applyMiddleware(app);

  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger docs available at: ${await app.getUrl()}/api/docs`);
}
void bootstrap();
