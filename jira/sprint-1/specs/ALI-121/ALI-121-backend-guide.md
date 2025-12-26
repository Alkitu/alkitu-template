# ALI-121: Backend Development Guide

**Purpose**: Step-by-step guide for implementing email templates backend
**Target Audience**: Backend developers
**Prerequisites**: NestJS, Prisma, Resend API knowledge

---

## Step 1: Prisma Schema Setup

### 1.1 Add Enum and Model

**File**: `packages/api/prisma/schema.prisma`

```prisma
// Email template trigger types
enum TemplateTrigger {
  ON_REQUEST_CREATED
  ON_STATUS_CHANGED
}

// Email template model
model EmailTemplate {
  id        String          @id @default(auto()) @map("_id") @db.ObjectId
  name      String          @unique
  subject   String
  body      String
  trigger   TemplateTrigger
  status    RequestStatus?
  active    Boolean         @default(true)
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  @@index([trigger])
  @@index([trigger, status])
  @@index([active])
  @@map("email_templates")
}
```

### 1.2 Run Migration

```bash
cd packages/api
npx prisma migrate dev --name add-email-templates
npx prisma generate
```

**Verify**: Open Prisma Studio and check EmailTemplate model exists

---

## Step 2: Create Email Template Service

### 2.1 Create Module Structure

```bash
cd packages/api/src
mkdir email-templates
touch email-templates/email-template.module.ts
touch email-templates/email-template.service.ts
touch email-templates/email-template.service.spec.ts
touch email-templates/dto/create-email-template.dto.ts
touch email-templates/dto/update-email-template.dto.ts
```

### 2.2 Implement Service

**File**: `packages/api/src/email-templates/email-template.service.ts`

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Resend } from 'resend';
import { CreateEmailTemplateDto, UpdateEmailTemplateDto } from './dto';
import { EmailTemplate, TemplateTrigger, RequestStatus } from '@prisma/client';

interface PlaceholderData {
  request: {
    id: string;
    status: RequestStatus;
    executionDateTime: Date;
    createdAt: Date;
    completedAt?: Date | null;
  };
  user: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string | null;
  };
  service: {
    name: string;
    category: string;
  };
  location: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  employee?: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string | null;
  } | null;
  templateResponses?: Record<string, any>;
}

@Injectable()
export class EmailTemplateService {
  private resend: Resend;

  constructor(private prisma: PrismaService) {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  // CRUD Operations
  async create(dto: CreateEmailTemplateDto): Promise<EmailTemplate> {
    return this.prisma.emailTemplate.create({
      data: dto,
    });
  }

  async findAll(filters?: {
    trigger?: TemplateTrigger;
    status?: RequestStatus;
    active?: boolean;
  }): Promise<EmailTemplate[]> {
    return this.prisma.emailTemplate.findMany({
      where: {
        ...(filters?.trigger && { trigger: filters.trigger }),
        ...(filters?.status && { status: filters.status }),
        ...(filters?.active !== undefined && { active: filters.active }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string): Promise<EmailTemplate> {
    const template = await this.prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Email template with ID ${id} not found`);
    }

    return template;
  }

  async update(id: string, dto: UpdateEmailTemplateDto): Promise<EmailTemplate> {
    await this.findOne(id); // Check exists

    return this.prisma.emailTemplate.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string): Promise<void> {
    await this.findOne(id); // Check exists

    await this.prisma.emailTemplate.delete({
      where: { id },
    });
  }

  // Template Selection
  async getTemplateForTrigger(
    trigger: TemplateTrigger,
    status?: RequestStatus,
  ): Promise<EmailTemplate | null> {
    // First, try to find specific template for trigger + status
    if (status) {
      const specificTemplate = await this.prisma.emailTemplate.findFirst({
        where: { trigger, status, active: true },
      });

      if (specificTemplate) return specificTemplate;
    }

    // Fallback to generic template (trigger only, status = null)
    return this.prisma.emailTemplate.findFirst({
      where: { trigger, status: null, active: true },
    });
  }

  // Placeholder Replacement
  private replacePlaceholders(template: string, data: PlaceholderData): string {
    let result = template;

    // Request data
    result = result.replace(/\{\{request\.id\}\}/g, data.request.id);
    result = result.replace(/\{\{request\.status\}\}/g, data.request.status);
    result = result.replace(
      /\{\{request\.executionDateTime\}\}/g,
      this.formatDateTime(data.request.executionDateTime),
    );
    result = result.replace(
      /\{\{request\.createdAt\}\}/g,
      this.formatDateTime(data.request.createdAt),
    );
    result = result.replace(
      /\{\{request\.completedAt\}\}/g,
      data.request.completedAt
        ? this.formatDateTime(data.request.completedAt)
        : 'N/A',
    );

    // User data
    result = result.replace(/\{\{user\.firstname\}\}/g, data.user.firstname);
    result = result.replace(/\{\{user\.lastname\}\}/g, data.user.lastname);
    result = result.replace(/\{\{user\.email\}\}/g, data.user.email);
    result = result.replace(/\{\{user\.phone\}\}/g, data.user.phone || 'N/A');

    // Service data
    result = result.replace(/\{\{service\.name\}\}/g, data.service.name);
    result = result.replace(/\{\{service\.category\}\}/g, data.service.category);

    // Location data
    result = result.replace(/\{\{location\.street\}\}/g, data.location.street);
    result = result.replace(/\{\{location\.city\}\}/g, data.location.city);
    result = result.replace(/\{\{location\.state\}\}/g, data.location.state);
    result = result.replace(/\{\{location\.zipCode\}\}/g, data.location.zipCode);

    // Employee data (if assigned)
    if (data.employee) {
      result = result.replace(/\{\{employee\.firstname\}\}/g, data.employee.firstname);
      result = result.replace(/\{\{employee\.lastname\}\}/g, data.employee.lastname);
      result = result.replace(/\{\{employee\.email\}\}/g, data.employee.email);
      result = result.replace(/\{\{employee\.phone\}\}/g, data.employee.phone || 'N/A');
    } else {
      // Remove employee placeholders if no employee assigned
      result = result.replace(/\{\{employee\.\w+\}\}/g, 'N/A');
    }

    // Template responses (dynamic)
    if (data.templateResponses) {
      Object.entries(data.templateResponses).forEach(([key, value]) => {
        const placeholder = `{{templateResponses.${key}}}`;
        result = result.replace(
          new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
          String(value),
        );
      });
    }

    return result;
  }

  private formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  }

  // Email Sending
  async sendEmail(
    template: EmailTemplate,
    recipientEmail: string,
    data: PlaceholderData,
  ): Promise<void> {
    const subject = this.replacePlaceholders(template.subject, data);
    const body = this.replacePlaceholders(template.body, data);

    await this.resend.emails.send({
      from: 'Alkitu <noreply@alkitu.com>',
      to: recipientEmail,
      subject: subject,
      html: body,
    });
  }

  // Test Email
  async sendTestEmail(
    templateId: string,
    testData: PlaceholderData,
  ): Promise<void> {
    const template = await this.findOne(templateId);

    await this.sendEmail(template, testData.user.email, testData);
  }
}
```

---

## Step 3: Create DTOs

### 3.1 Create DTO

**File**: `packages/api/src/email-templates/dto/create-email-template.dto.ts`

```typescript
import { z } from 'zod';
import { TemplateTrigger, RequestStatus } from '@prisma/client';

export const createEmailTemplateSchema = z.object({
  name: z.string().min(3).max(100),
  subject: z.string().min(5).max(200),
  body: z.string().min(10).max(10000),
  trigger: z.nativeEnum(TemplateTrigger),
  status: z.nativeEnum(RequestStatus).optional(),
  active: z.boolean().default(true),
});

export type CreateEmailTemplateDto = z.infer<typeof createEmailTemplateSchema>;
```

### 3.2 Update DTO

**File**: `packages/api/src/email-templates/dto/update-email-template.dto.ts`

```typescript
import { createEmailTemplateSchema } from './create-email-template.dto';

export const updateEmailTemplateSchema = createEmailTemplateSchema.partial();

export type UpdateEmailTemplateDto = z.infer<typeof updateEmailTemplateSchema>;
```

---

## Step 4: Create Module

**File**: `packages/api/src/email-templates/email-template.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { EmailTemplateService } from './email-template.service';
import { PrismaService } from '../prisma.service';

@Module({
  providers: [EmailTemplateService, PrismaService],
  exports: [EmailTemplateService],
})
export class EmailTemplateModule {}
```

**Register in AppModule**:

```typescript
@Module({
  imports: [
    // ... other modules
    EmailTemplateModule,
  ],
})
export class AppModule {}
```

---

## Step 5: Integrate with RequestsService

**File**: `packages/api/src/requests/requests.service.ts`

### 5.1 Inject EmailTemplateService

```typescript
import { EmailTemplateService } from '../email-templates/email-template.service';
import { TemplateTrigger } from '@prisma/client';

@Injectable()
export class RequestsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private emailTemplateService: EmailTemplateService, // NEW
  ) {}
}
```

### 5.2 Add Helper Method

```typescript
private buildPlaceholderData(request: RequestWithRelations): PlaceholderData {
  return {
    request: {
      id: request.id,
      status: request.status,
      executionDateTime: request.executionDateTime,
      createdAt: request.createdAt,
      completedAt: request.completedAt,
    },
    user: {
      firstname: request.user.firstname,
      lastname: request.user.lastname,
      email: request.user.email,
      phone: request.user.phone,
    },
    service: {
      name: request.service.name,
      category: request.service.category.name,
    },
    location: {
      street: request.location.street,
      city: request.location.city,
      state: request.location.state,
      zipCode: request.location.zipCode,
    },
    employee: request.assignedTo ? {
      firstname: request.assignedTo.firstname,
      lastname: request.assignedTo.lastname,
      email: request.assignedTo.email,
      phone: request.assignedTo.phone,
    } : null,
    templateResponses: request.templateResponses,
  };
}
```

### 5.3 Trigger Email on Request Creation

**Location**: `requests.service.ts:create()` (after notification code)

```typescript
// Send email notification
try {
  const emailTemplate = await this.emailTemplateService.getTemplateForTrigger(
    TemplateTrigger.ON_REQUEST_CREATED,
  );

  if (emailTemplate && emailTemplate.active) {
    const placeholderData = this.buildPlaceholderData(createdRequest);
    await this.emailTemplateService.sendEmail(
      emailTemplate,
      createdRequest.user.email,
      placeholderData,
    );
  }
} catch (error) {
  this.logger.error('Failed to send email notification on request creation', error);
  // Don't fail request creation if email fails
}
```

### 5.4 Trigger Email on Status Change

**Location**: `requests.service.ts:updateStatus()` (after status update)

```typescript
// Send email notification for status change
try {
  const emailTemplate = await this.emailTemplateService.getTemplateForTrigger(
    TemplateTrigger.ON_STATUS_CHANGED,
    updatedRequest.status,
  );

  if (emailTemplate && emailTemplate.active) {
    const placeholderData = this.buildPlaceholderData(updatedRequest);
    await this.emailTemplateService.sendEmail(
      emailTemplate,
      updatedRequest.user.email,
      placeholderData,
    );
  }
} catch (error) {
  this.logger.error('Failed to send email notification on status change', error);
  // Don't fail status update if email fails
}
```

---

## Step 6: Create tRPC Router

**File**: `packages/api/src/trpc/routers/email-template.router.ts`

```typescript
import { z } from 'zod';
import { t } from '../trpc';
import { EmailTemplateService } from '../../email-templates/email-template.service';
import {
  createEmailTemplateSchema,
  updateEmailTemplateSchema,
} from '../../email-templates/dto';
import { TemplateTrigger, RequestStatus } from '@prisma/client';

export const createEmailTemplateRouter = (
  emailTemplateService: EmailTemplateService,
) =>
  t.router({
    create: t.procedure
      .input(createEmailTemplateSchema)
      .mutation(({ input }) => emailTemplateService.create(input)),

    getAll: t.procedure
      .input(
        z.object({
          trigger: z.nativeEnum(TemplateTrigger).optional(),
          status: z.nativeEnum(RequestStatus).optional(),
          active: z.boolean().optional(),
        }).optional(),
      )
      .query(({ input }) => emailTemplateService.findAll(input)),

    getOne: t.procedure
      .input(z.object({ id: z.string() }))
      .query(({ input }) => emailTemplateService.findOne(input.id)),

    update: t.procedure
      .input(
        z.object({
          id: z.string(),
          data: updateEmailTemplateSchema,
        }),
      )
      .mutation(({ input }) =>
        emailTemplateService.update(input.id, input.data),
      ),

    delete: t.procedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => emailTemplateService.delete(input.id)),

    sendTestEmail: t.procedure
      .input(
        z.object({
          templateId: z.string(),
          testData: z.object({
            request: z.object({
              id: z.string(),
              status: z.nativeEnum(RequestStatus),
              executionDateTime: z.date(),
              createdAt: z.date(),
              completedAt: z.date().optional(),
            }),
            user: z.object({
              firstname: z.string(),
              lastname: z.string(),
              email: z.string().email(),
              phone: z.string().optional(),
            }),
            // ... other fields
          }),
        }),
      )
      .mutation(({ input }) =>
        emailTemplateService.sendTestEmail(input.templateId, input.testData),
      ),

    getAvailablePlaceholders: t.procedure.query(() => ({
      request: ['id', 'status', 'executionDateTime', 'createdAt', 'completedAt'],
      user: ['firstname', 'lastname', 'email', 'phone'],
      service: ['name', 'category'],
      location: ['street', 'city', 'state', 'zipCode'],
      employee: ['firstname', 'lastname', 'email', 'phone'],
      templateResponses: ['*'],
    })),
  });
```

**Register in main tRPC router**:

```typescript
export const appRouter = t.router({
  // ... other routers
  emailTemplate: emailTemplateRouter,
});
```

---

## Step 7: Testing

### 7.1 Create Unit Tests

**File**: `packages/api/src/email-templates/email-template.service.spec.ts`

```typescript
import { Test } from '@nestjs/testing';
import { EmailTemplateService } from './email-template.service';
import { PrismaService } from '../prisma.service';

describe('EmailTemplateService', () => {
  let service: EmailTemplateService;
  let prisma: MockType<PrismaService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmailTemplateService,
        { provide: PrismaService, useFactory: mockPrismaService },
      ],
    }).compile();

    service = module.get(EmailTemplateService);
    prisma = module.get(PrismaService);
  });

  describe('create', () => {
    it('should create email template', async () => {
      const dto = {
        name: 'test_template',
        subject: 'Test Subject',
        body: 'Test Body',
        trigger: TemplateTrigger.ON_REQUEST_CREATED,
        active: true,
      };

      prisma.emailTemplate.create.mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);

      expect(result).toMatchObject(dto);
      expect(prisma.emailTemplate.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('replacePlaceholders', () => {
    it('should replace all placeholders correctly', () => {
      const template = 'Hello {{user.firstname}} {{user.lastname}}, your request {{request.id}} for {{service.name}} is {{request.status}}.';
      const data = {
        request: { id: '123', status: 'PENDING', ... },
        user: { firstname: 'John', lastname: 'Doe', ... },
        service: { name: 'Plumbing', category: 'Home' },
        // ... other data
      };

      const result = service['replacePlaceholders'](template, data);

      expect(result).toBe('Hello John Doe, your request 123 for Plumbing is PENDING.');
    });
  });

  // ... 18 more tests
});
```

**Run Tests**:
```bash
npm run test email-template.service.spec
```

---

## Step 8: Seed Default Templates

**File**: `packages/api/prisma/seed-email-templates.ts`

```typescript
import { PrismaClient, TemplateTrigger, RequestStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEmailTemplates() {
  const templates = [
    {
      name: 'request_created',
      subject: 'Request Confirmation - {{service.name}}',
      body: `
        <h1>Request Confirmation</h1>
        <p>Hello {{user.firstname}},</p>
        <p>Your request for <strong>{{service.name}}</strong> has been successfully created.</p>
        <p><strong>Request ID:</strong> {{request.id}}</p>
        <p><strong>Scheduled Date:</strong> {{request.executionDateTime}}</p>
        <p><strong>Location:</strong> {{location.street}}, {{location.city}}, {{location.state}} {{location.zipCode}}</p>
        <p>Thank you for choosing Alkitu!</p>
      `,
      trigger: TemplateTrigger.ON_REQUEST_CREATED,
      status: null,
      active: true,
    },
    // ... 4 more templates
  ];

  for (const template of templates) {
    await prisma.emailTemplate.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
  }

  console.log('Email templates seeded successfully');
}

seedEmailTemplates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

**Run Seed**:
```bash
npm run db:seed
```

---

## Environment Variables

**File**: `.env`

```bash
# Resend API
RESEND_API_KEY=re_xxxxxxxxxxxx
```

---

## Testing Email Sending

### Using Resend Test Mode

```typescript
// In development, use test mode
const resend = new Resend(process.env.RESEND_API_KEY, {
  mode: process.env.NODE_ENV === 'development' ? 'test' : 'production',
});
```

### Manual Test via tRPC

```typescript
// In Postman or tRPC client
await trpc.emailTemplate.sendTestEmail.mutate({
  templateId: 'template_id_here',
  testData: {
    request: {
      id: 'test-123',
      status: 'PENDING',
      executionDateTime: new Date(),
      createdAt: new Date(),
    },
    user: {
      firstname: 'John',
      lastname: 'Doe',
      email: 'your-test-email@example.com',
      phone: '+1234567890',
    },
    service: { name: 'Plumbing', category: 'Home' },
    location: { street: '123 Main St', city: 'City', state: 'State', zipCode: '12345' },
  },
});
```

---

## Troubleshooting

**Issue**: Email not sent
- Check Resend API key is valid
- Check Resend dashboard for delivery logs
- Check console logs for error messages
- Verify `active` field is `true` on template

**Issue**: Placeholders not replaced
- Check placeholder syntax: `{{category.field}}`
- Check data structure matches PlaceholderData interface
- Check regex escaping in replacePlaceholders method

**Issue**: Template not found
- Check trigger and status match exactly
- Check template `active` is `true`
- Check database has template with matching criteria

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
