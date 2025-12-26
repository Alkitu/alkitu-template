# ALI-121: Email Templates & Automation - Implementation Plan

**Status**: Ready for Implementation
**Estimated Duration**: 5-7 days
**Dependencies**: ALI-119 (Requests), ALI-120 (Notifications)

---

## Phase 1: Database & Schema Setup (Day 1)

### 1.1 Create Prisma Schema

**File**: `packages/api/prisma/schema.prisma`

**Tasks**:
- ✅ Add `TemplateTrigger` enum
  ```prisma
  enum TemplateTrigger {
    ON_REQUEST_CREATED
    ON_STATUS_CHANGED
  }
  ```

- ✅ Add `EmailTemplate` model with fields:
  - id, name (unique), subject, body
  - trigger, status (optional)
  - active (Boolean, default true)
  - createdAt, updatedAt
  - Indexes: [trigger], [trigger, status], [active]

**Migration**:
```bash
cd packages/api
npx prisma migrate dev --name add-email-templates
npx prisma generate
```

**Validation**:
- Run `npx prisma studio` and verify EmailTemplate model exists
- Check indexes created in MongoDB

**Estimated Time**: 1 hour

---

### 1.2 Create Shared Types & Schemas

**File**: `packages/shared/src/types/email-template.ts`

**Tasks**:
- Define `TemplateTrigger` type
- Define `EmailTemplateData` interface
- Define `PlaceholderData` interface (request, user, service, location, employee, templateResponses)

**File**: `packages/shared/src/schemas/email-template.ts`

**Tasks**:
- Create `createEmailTemplateSchema` with Zod:
  - name: string().min(3).max(100)
  - subject: string().min(5).max(200)
  - body: string().min(10).max(10000)
  - trigger: enum(TemplateTrigger)
  - status: optional RequestStatus enum
  - active: boolean().default(true)

- Create `updateEmailTemplateSchema` (partial of create schema)
- Create `sendTestEmailSchema` (emailTemplateId, testData)

**Validation**:
- Run `npm run type-check` in packages/shared
- Write 10 schema validation tests (valid/invalid cases)

**Estimated Time**: 2 hours

---

### 1.3 Seed Default Templates

**File**: `packages/api/prisma/seed-email-templates.ts`

**Tasks**:
- Create 5 default email templates:
  1. **Request Created** (ON_REQUEST_CREATED)
     - Subject: "Request Confirmation - {{service.name}}"
     - Body: "Hello {{user.firstname}}, your request for {{service.name}} has been created..."

  2. **Request Assigned** (ON_STATUS_CHANGED, status: ONGOING)
     - Subject: "Your Request Has Been Assigned"
     - Body: "{{employee.firstname}} {{employee.lastname}} has been assigned to your request..."

  3. **Request Completed** (ON_STATUS_CHANGED, status: COMPLETED)
     - Subject: "Request Completed - {{service.name}}"
     - Body: "Your request has been completed on {{request.completedAt}}..."

  4. **Request Cancelled** (ON_STATUS_CHANGED, status: CANCELLED)
     - Subject: "Request Cancellation Notification"
     - Body: "Your request for {{service.name}} has been cancelled..."

  5. **Status Update** (ON_STATUS_CHANGED, status: null - generic)
     - Subject: "Request Status Update"
     - Body: "Your request status has been updated to {{request.status}}..."

**Run Seed**:
```bash
npm run db:seed
```

**Validation**:
- Open Prisma Studio and verify 5 templates created
- Check placeholder syntax is correct

**Estimated Time**: 2 hours

---

## Phase 2: Backend Implementation (Days 2-3)

### 2.1 Email Template Service

**File**: `packages/api/src/email-templates/email-template.service.ts`

**Methods to Implement**:

```typescript
@Injectable()
export class EmailTemplateService {
  // CRUD Operations
  async create(dto: CreateEmailTemplateDto): Promise<EmailTemplate>
  async findAll(filters?: { trigger?, status?, active? }): Promise<EmailTemplate[]>
  async findOne(id: string): Promise<EmailTemplate>
  async update(id: string, dto: UpdateEmailTemplateDto): Promise<EmailTemplate>
  async delete(id: string): Promise<void>

  // Template Selection
  async getTemplateForTrigger(
    trigger: TemplateTrigger,
    status?: RequestStatus
  ): Promise<EmailTemplate | null>

  // Placeholder Replacement
  async replacePlaceholders(
    template: EmailTemplate,
    data: PlaceholderData
  ): Promise<{ subject: string; body: string }>

  // Email Sending
  async sendEmail(
    template: EmailTemplate,
    recipientEmail: string,
    data: PlaceholderData
  ): Promise<void>

  // Testing
  async sendTestEmail(
    templateId: string,
    testData: PlaceholderData
  ): Promise<void>
}
```

**Implementation Details**:

**Placeholder Replacement Logic**:
```typescript
private replacePlaceholders(template: string, data: PlaceholderData): string {
  let result = template;

  // Replace request data
  result = result.replace(/\{\{request\.id\}\}/g, data.request.id);
  result = result.replace(/\{\{request\.status\}\}/g, data.request.status);
  result = result.replace(/\{\{request\.executionDateTime\}\}/g,
    formatDateTime(data.request.executionDateTime));

  // Replace user data
  result = result.replace(/\{\{user\.firstname\}\}/g, data.user.firstname);
  result = result.replace(/\{\{user\.lastname\}\}/g, data.user.lastname);
  // ... continue for all placeholders

  // Replace template responses (dynamic)
  if (data.templateResponses) {
    Object.entries(data.templateResponses).forEach(([key, value]) => {
      const placeholder = `{{templateResponses.${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
  }

  return result;
}
```

**Resend Integration**:
```typescript
import { Resend } from 'resend';

async sendEmail(template: EmailTemplate, recipientEmail: string, data: PlaceholderData) {
  const { subject, body } = await this.replacePlaceholders(template, data);

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'Alkitu <noreply@alkitu.com>',
    to: recipientEmail,
    subject: subject,
    html: body,
  });
}
```

**Validation**:
- Write 20 unit tests for EmailTemplateService
- Test placeholder replacement with all 19 placeholders
- Test email sending (mock Resend)
- Test template selection logic

**Estimated Time**: 6-8 hours

---

### 2.2 Integration with RequestsService

**File**: `packages/api/src/requests/requests.service.ts`

**Integration Points**:

**1. After Request Creation** (line ~150):
```typescript
// Existing notification logic
...

// NEW: Email notification
try {
  const emailTemplate = await this.emailTemplateService.getTemplateForTrigger(
    TemplateTrigger.ON_REQUEST_CREATED
  );

  if (emailTemplate && emailTemplate.active) {
    await this.emailTemplateService.sendEmail(
      emailTemplate,
      createdRequest.user.email,
      this.buildPlaceholderData(createdRequest)
    );
  }
} catch (error) {
  this.logger.error('Failed to send email notification', error);
  // Don't fail request creation if email fails
}
```

**2. After Status Change** (line ~600):
```typescript
// After status update
const statusTemplate = await this.emailTemplateService.getTemplateForTrigger(
  TemplateTrigger.ON_STATUS_CHANGED,
  updatedRequest.status
);

if (statusTemplate && statusTemplate.active) {
  await this.emailTemplateService.sendEmail(
    statusTemplate,
    updatedRequest.user.email,
    this.buildPlaceholderData(updatedRequest)
  );
}
```

**Helper Method**:
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

**Validation**:
- Write 8 integration tests for email triggers
- Test request creation → Email sent
- Test status change → Email sent
- Test inactive template → No email sent
- Test email failure → Request still succeeds

**Estimated Time**: 4 hours

---

### 2.3 tRPC Router

**File**: `packages/api/src/trpc/routers/email-template.router.ts`

**Endpoints**:

```typescript
export const emailTemplateRouter = t.router({
  // CRUD
  create: t.procedure
    .input(createEmailTemplateSchema)
    .mutation(({ input }) => emailTemplateService.create(input)),

  getAll: t.procedure
    .input(z.object({
      trigger: z.nativeEnum(TemplateTrigger).optional(),
      status: z.nativeEnum(RequestStatus).optional(),
      active: z.boolean().optional(),
    }))
    .query(({ input }) => emailTemplateService.findAll(input)),

  getOne: t.procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => emailTemplateService.findOne(input.id)),

  update: t.procedure
    .input(z.object({
      id: z.string(),
      data: updateEmailTemplateSchema,
    }))
    .mutation(({ input }) => emailTemplateService.update(input.id, input.data)),

  delete: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => emailTemplateService.delete(input.id)),

  // Testing
  sendTestEmail: t.procedure
    .input(sendTestEmailSchema)
    .mutation(({ input }) =>
      emailTemplateService.sendTestEmail(input.templateId, input.testData)
    ),

  // Utilities
  getAvailablePlaceholders: t.procedure
    .query(() => ({
      request: ['id', 'status', 'executionDateTime', 'createdAt', 'completedAt'],
      user: ['firstname', 'lastname', 'email', 'phone'],
      service: ['name', 'category'],
      location: ['street', 'city', 'state', 'zipCode'],
      employee: ['firstname', 'lastname', 'email', 'phone'],
      templateResponses: ['*'],
    })),
});
```

**Validation**:
- Test all 8 endpoints with Postman/tRPC client
- Verify input validation with invalid data
- Test RBAC (only ADMIN can manage templates)

**Estimated Time**: 3 hours

---

## Phase 3: Frontend Implementation (Days 4-5)

### 3.1 Admin Email Templates Page

**File**: `packages/web/src/app/[lang]/(private)/admin/email-templates/page.tsx`

**Features**:
- Table view of all email templates
- Filters: Trigger type, Status, Active/Inactive
- Actions: Create, Edit, Delete, Test Email
- Visual indicators for active/inactive templates

**Components Used**:
- `<EmailTemplateListOrganism />`
- `<EmailTemplateFiltersMolecule />`
- `<CreateEmailTemplateButton />`

**Estimated Time**: 4 hours

---

### 3.2 Email Template Form

**Component**: `<EmailTemplateFormOrganism />`

**Features**:
- Form fields: name, subject, body (rich text), trigger, status, active
- Placeholder palette sidebar (click to insert)
- Live preview of email with sample data
- Validation: Zod schema on client-side
- Submit: Create or update via tRPC

**Sub-components**:
- `<PlaceholderPaletteMolecule />` - Clickable placeholder list
- `<EmailPreviewMolecule />` - Live HTML preview with sample data
- `<RichTextEditorMolecule />` - WYSIWYG editor for email body

**Estimated Time**: 6 hours

---

### 3.3 Test Email Dialog

**Component**: `<TestEmailDialogOrganism />`

**Features**:
- Input: Recipient email address
- Auto-fill sample data for all placeholders
- Send test email button
- Success/error feedback

**Estimated Time**: 2 hours

---

## Phase 4: Testing (Day 6)

### 4.1 Backend Unit Tests

**Test Files**:
- `email-template.service.spec.ts` (20 tests)
  - CRUD operations
  - Placeholder replacement (all 19 placeholders)
  - Template selection logic
  - Email sending (mocked Resend)

- `requests.service.spec.ts` (8 new tests)
  - Email sent on request creation
  - Email sent on status change
  - Inactive template → No email
  - Email failure → Request succeeds

**Coverage Target**: 95%+

**Estimated Time**: 4 hours

---

### 4.2 Frontend Component Tests

**Test Files**:
- `EmailTemplateFormOrganism.test.tsx` (10 tests)
  - Form validation
  - Placeholder insertion
  - Submit (create/update)
  - Error handling

- `PlaceholderPaletteMolecule.test.tsx` (5 tests)
  - Click to copy placeholder
  - Filter placeholders by category
  - Display all 19 placeholders

**Coverage Target**: 90%+

**Estimated Time**: 3 hours

---

### 4.3 E2E Tests

**File**: `packages/web/tests/e2e/ali-121-email-templates.spec.ts`

**Scenarios** (12 tests):
1. Admin creates email template
2. Admin edits email template
3. Admin deletes email template
4. Admin sends test email
5. Admin filters templates by trigger
6. CLIENT creates request → Email sent (verify in email service logs)
7. ADMIN assigns request → Email sent (status change)
8. ADMIN completes request → Email sent
9. Inactive template → No email sent
10. Template with placeholders → Placeholders replaced correctly
11. Template without matching status → Fallback to generic template
12. Email service failure → Request still succeeds

**Estimated Time**: 4 hours

---

## Phase 5: Documentation & Polish (Day 7)

### 5.1 Update API Documentation

**Tasks**:
- Add EmailTemplate model to Swagger/OpenAPI
- Document all tRPC endpoints
- Add placeholder system documentation
- Create example templates JSON

**Estimated Time**: 2 hours

---

### 5.2 Add Translations

**Files**:
- `packages/web/src/locales/en/common.json`
- `packages/web/src/locales/es/common.json`

**Keys**:
- emailTemplates.title, .description
- emailTemplates.fields.name, .subject, .body, .trigger, .status, .active
- emailTemplates.triggers.ON_REQUEST_CREATED, .ON_STATUS_CHANGED
- emailTemplates.actions.create, .edit, .delete, .test
- emailTemplates.placeholders.request, .user, .service, .location, .employee

**Estimated Time**: 1 hour

---

### 5.3 Create User Guide

**File**: `docs/06-features/email-templates-guide.md`

**Content**:
- How to create an email template
- Placeholder syntax and examples
- Trigger configuration
- Testing emails
- Troubleshooting common issues

**Estimated Time**: 2 hours

---

## Dependencies & Prerequisites

**Required**:
- ✅ ALI-119 (Requests) - Complete
- ✅ Resend account and API key
- ✅ Database migration tooling (Prisma)

**Optional**:
- ALI-120 (Notifications) - Can work independently, but email notifications complement in-app notifications

---

## Risk Assessment

**High Risk**:
- Email delivery failures (mitigation: error handling, retry logic)
- Placeholder replacement edge cases (mitigation: comprehensive testing)

**Medium Risk**:
- Rich text editor complexity (mitigation: use established library like Tiptap)
- HTML email rendering across email clients (mitigation: use email templates tested across clients)

**Low Risk**:
- Database schema changes (backward compatible migration)
- tRPC endpoint creation (standard pattern)

---

## Success Criteria

**Backend**:
- ✅ EmailTemplate model created and seeded with 5 default templates
- ✅ EmailTemplateService implemented with all methods
- ✅ Integration with RequestsService (2 trigger points)
- ✅ 28 backend tests passing (95%+ coverage)

**Frontend**:
- ✅ Admin email templates page with CRUD operations
- ✅ Email template form with placeholder palette and preview
- ✅ Test email functionality working
- ✅ 15 frontend component tests passing (90%+ coverage)

**E2E**:
- ✅ 12 E2E tests passing (complete user flows)

**Documentation**:
- ✅ API documentation updated
- ✅ User guide created
- ✅ Translations complete (EN + ES)

---

## Post-Implementation Tasks

1. Monitor email delivery rates (Resend dashboard)
2. Collect feedback from admins on template usability
3. Consider additional triggers (e.g., ON_REQUEST_CANCELLED)
4. Evaluate need for email scheduling (send at specific time)
5. Add email analytics (open rate, click rate)

---

**Total Estimated Time**: 5-7 days
**Team Size**: 1-2 developers
**Recommended Start Date**: After ALI-120 verification complete

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
