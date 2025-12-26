# ALI-121: Email Templates & Automation - Technical Specification

## Issue Information
- **Jira Issue**: ALI-121
- **Type**: Task
- **Priority**: Medium
- **Status**: Discovery
- **Sprint**: Sprint 1 (37)
- **Created**: 2025-11-18
- **Updated**: 2025-11-23

## Overview

Este issue implementa el sistema de plantillas de email automatizadas ligadas a eventos del ciclo de vida de las solicitudes. Permite a los administradores crear y gestionar plantillas de correo que se envían automáticamente cuando se crea una solicitud (ON_REQUEST_CREATED) o cuando cambia su estado (ON_STATUS_CHANGED), con soporte para placeholders dinámicos que se reemplazan con datos reales de la solicitud.

## Database Schema

### TemplateTrigger Enum

```prisma
enum TemplateTrigger {
  ON_REQUEST_CREATED    // Triggered when a new request is created
  ON_STATUS_CHANGED     // Triggered when request status changes
}
```

### EmailTemplate Model

```prisma
model EmailTemplate {
  id        String          @id @default(auto()) @map("_id") @db.ObjectId

  // Template identification
  name      String          @unique  // Internal identifier (e.g., "request_created_notification")

  // Email content
  subject   String                   // Email subject line (supports placeholders)
  body      String                   // Email body content (supports placeholders, HTML allowed)

  // Trigger configuration
  trigger   TemplateTrigger          // When to send this email
  status    RequestStatus?           // Only for ON_STATUS_CHANGED - which status triggers this

  // Metadata
  active    Boolean         @default(true)  // Enable/disable template without deleting

  // Timestamps
  createdAt DateTime        @default(now())
  updatedAt DateTime        @updatedAt

  // Performance indexes
  @@index([trigger])                 // Filter templates by trigger type
  @@index([trigger, status])         // Filter by trigger + specific status
  @@index([active])                  // Only fetch active templates

  @@map("email_templates")
}
```

## Placeholder System

### Available Placeholders

Placeholders can be used in both `subject` and `body` fields. They will be replaced with actual data when sending emails.

#### Request Data
- `{{request.id}}` - Request ID
- `{{request.status}}` - Current status (PENDING, ONGOING, COMPLETED, CANCELLED)
- `{{request.executionDateTime}}` - Scheduled execution date/time
- `{{request.createdAt}}` - Request creation date/time
- `{{request.completedAt}}` - Completion date/time (if completed)

#### User Data (Client who created the request)
- `{{user.firstname}}` - Client first name
- `{{user.lastname}}` - Client last name
- `{{user.email}}` - Client email address
- `{{user.phone}}` - Client phone number

#### Service Data
- `{{service.name}}` - Service name (e.g., "Plumbing Repair")
- `{{service.category}}` - Service category name

#### Location Data
- `{{location.street}}` - Work location street
- `{{location.city}}` - Work location city
- `{{location.state}}` - Work location state
- `{{location.zipCode}}` - Work location ZIP code

#### Employee Data (if assigned)
- `{{employee.firstname}}` - Assigned employee first name
- `{{employee.lastname}}` - Assigned employee last name
- `{{employee.email}}` - Assigned employee email
- `{{employee.phone}}` - Assigned employee phone

#### Template Responses (dynamic based on service template)
- `{{templateResponses.field_id}}` - Any field from the request template
- Example: `{{templateResponses.issue_description}}`

### Example Template

```json
{
  "name": "request_created_client",
  "subject": "Request #{{request.id}} Received - {{service.name}}",
  "body": "Dear {{user.firstname}} {{user.lastname}},\n\nThank you for submitting your service request for {{service.name}}.\n\nRequest Details:\n- Service: {{service.name}}\n- Category: {{service.category}}\n- Location: {{location.street}}, {{location.city}}, {{location.state}} {{location.zipCode}}\n- Scheduled: {{request.executionDateTime}}\n\nYour request is currently {{request.status}} and will be processed shortly.\n\nBest regards,\nAlkitu Team",
  "trigger": "ON_REQUEST_CREATED",
  "status": null,
  "active": true
}
```

## Business Logic

### Email Trigger Flow

#### ON_REQUEST_CREATED Flow
```
1. Client creates new Request via POST /requests
2. Request is saved to database with status=PENDING
3. System queries: EmailTemplate.findMany({ trigger: "ON_REQUEST_CREATED", active: true })
4. For each matching template:
   a. Fetch full request data with relations (user, service, location)
   b. Replace placeholders in subject and body
   c. Send email to user.email (client who created request)
   d. Log email sent (future: email_logs table)
5. Return created request to client
```

#### ON_STATUS_CHANGED Flow
```
1. Admin/Employee changes Request status via PUT /requests/:id/status
2. Old status stored temporarily for comparison
3. New status saved to database
4. System queries: EmailTemplate.findMany({
     trigger: "ON_STATUS_CHANGED",
     status: newStatus,
     active: true
   })
5. For each matching template:
   a. Fetch full request data with relations
   b. Replace placeholders
   c. Send email to user.email (client)
   d. If status=ONGOING and assignedTo exists, also send to employee.email
   e. Log email sent
6. Return updated request
```

### Business Rules

1. **Template Creation**: Only ADMINs can create/edit/delete email templates
2. **Trigger Validation**:
   - ON_REQUEST_CREATED templates MUST have `status = null`
   - ON_STATUS_CHANGED templates MUST have a valid `status` value
3. **Placeholder Validation**: System should warn if placeholder doesn't exist (optional validation)
4. **Active Flag**: Inactive templates are not triggered but remain in database
5. **Multiple Templates**: Multiple templates can have same trigger/status (all will be sent)
6. **Email Recipients**:
   - Always send to client (user.email)
   - For ONGOING status, also send to assigned employee if exists
7. **HTML Support**: Body field supports HTML for rich formatting
8. **Error Handling**: Email sending failures should not block request creation/updates

## API Endpoints

### Public Endpoints

#### List Email Templates (ADMIN only)
```
GET /email-templates
Authorization: Bearer {jwt}

Response: 200 OK
{
  "data": [
    {
      "id": "64a1b2c3d4e5f6g7h8i9j0k1",
      "name": "request_created_client",
      "subject": "Request #{{request.id}} Received",
      "trigger": "ON_REQUEST_CREATED",
      "status": null,
      "active": true,
      "createdAt": "2025-11-20T10:00:00Z",
      "updatedAt": "2025-11-20T10:00:00Z"
    },
    {
      "id": "64a1b2c3d4e5f6g7h8i9j0k2",
      "name": "request_completed",
      "subject": "Service Completed - {{service.name}}",
      "trigger": "ON_STATUS_CHANGED",
      "status": "COMPLETED",
      "active": true,
      "createdAt": "2025-11-20T10:05:00Z",
      "updatedAt": "2025-11-20T10:05:00Z"
    }
  ],
  "total": 2
}
```

#### Get Email Template Detail (ADMIN only)
```
GET /email-templates/:id
Authorization: Bearer {jwt}

Response: 200 OK
{
  "id": "64a1b2c3d4e5f6g7h8i9j0k1",
  "name": "request_created_client",
  "subject": "Request #{{request.id}} Received - {{service.name}}",
  "body": "Dear {{user.firstname}} {{user.lastname}},\n\nThank you...",
  "trigger": "ON_REQUEST_CREATED",
  "status": null,
  "active": true,
  "createdAt": "2025-11-20T10:00:00Z",
  "updatedAt": "2025-11-20T10:00:00Z"
}
```

#### Create Email Template (ADMIN only)
```
POST /email-templates
Authorization: Bearer {jwt}
Content-Type: application/json

Request Body:
{
  "name": "request_cancelled",
  "subject": "Request Cancelled - {{service.name}}",
  "body": "Dear {{user.firstname}},\n\nYour request for {{service.name}} has been cancelled.",
  "trigger": "ON_STATUS_CHANGED",
  "status": "CANCELLED",
  "active": true
}

Validation:
- name: required, 2-100 chars, unique
- subject: required, 1-200 chars
- body: required, 10-10000 chars
- trigger: required, must be valid TemplateTrigger
- status: required if trigger=ON_STATUS_CHANGED, null if trigger=ON_REQUEST_CREATED
- active: optional, defaults to true

Response: 201 Created
{
  "id": "64a1b2c3d4e5f6g7h8i9j0k3",
  "name": "request_cancelled",
  ...
}

Errors:
- 400 Bad Request: Validation failed
- 409 Conflict: Template name already exists
```

#### Update Email Template (ADMIN only)
```
PUT /email-templates/:id
Authorization: Bearer {jwt}
Content-Type: application/json

Request Body (all optional):
{
  "name": "request_cancelled_updated",
  "subject": "Updated subject",
  "body": "Updated body",
  "active": false
}

Note: Cannot change trigger or status after creation

Response: 200 OK

Errors:
- 400 Bad Request: Validation failed
- 404 Not Found: Template doesn't exist
- 409 Conflict: Name already used by another template
```

#### Delete Email Template (ADMIN only)
```
DELETE /email-templates/:id
Authorization: Bearer {jwt}

Response: 200 OK
{
  "message": "Email template deleted successfully"
}

Errors:
- 404 Not Found: Template doesn't exist
```

#### Test Email Template (ADMIN only)
```
POST /email-templates/:id/test
Authorization: Bearer {jwt}
Content-Type: application/json

Request Body:
{
  "requestId": "64a1b2c3d4e5f6g7h8i9j0k4",  // Use real request data for placeholders
  "recipient": "test@example.com"            // Override recipient for testing
}

Response: 200 OK
{
  "success": true,
  "preview": {
    "subject": "Request #12345 Received - Plumbing Repair",
    "body": "Dear John Doe,\n\nThank you for submitting...",
    "recipient": "test@example.com"
  },
  "message": "Test email sent successfully"
}

Errors:
- 404 Not Found: Template or request doesn't exist
- 500 Server Error: Email sending failed
```

### Internal Service Methods

#### EmailTemplateService

```typescript
class EmailTemplateService {
  // CRUD operations
  create(dto: CreateEmailTemplateDto): Promise<EmailTemplate>
  findAll(): Promise<EmailTemplate[]>
  findOne(id: string): Promise<EmailTemplate>
  update(id: string, dto: UpdateEmailTemplateDto): Promise<EmailTemplate>
  remove(id: string): Promise<void>

  // Trigger-based queries
  findByTrigger(trigger: TemplateTrigger, status?: RequestStatus): Promise<EmailTemplate[]>

  // Email sending (integrates with EmailService)
  sendRequestCreatedEmails(request: Request): Promise<void>
  sendStatusChangedEmails(request: Request, newStatus: RequestStatus): Promise<void>

  // Preview & testing
  previewTemplate(templateId: string, requestId: string): Promise<{ subject: string; body: string }>
  testTemplate(templateId: string, requestId: string, recipient: string): Promise<void>

  // Placeholder replacement
  private replacePlaceholders(template: string, data: RequestEmailData): string
}
```

#### EmailService (Email Provider Integration)

```typescript
class EmailService {
  // Core email sending (uses Resend or similar)
  sendEmail(to: string, subject: string, body: string): Promise<void>

  // Batch sending
  sendBulkEmails(emails: Array<{ to: string; subject: string; body: string }>): Promise<void>
}
```

## Frontend Components (Atomic Design)

### Atoms

#### TriggerBadgeAtom
```typescript
interface TriggerBadgeAtomProps {
  trigger: TemplateTrigger;
  status?: RequestStatus;
  size?: 'sm' | 'md' | 'lg';
}

// Visual representation:
// ON_REQUEST_CREATED → Blue badge "Request Created"
// ON_STATUS_CHANGED + COMPLETED → Green badge "Status: Completed"
// ON_STATUS_CHANGED + CANCELLED → Red badge "Status: Cancelled"
```

#### ActiveToggleAtom
```typescript
interface ActiveToggleAtomProps {
  active: boolean;
  onChange: (active: boolean) => void;
  disabled?: boolean;
}

// Toggle switch for active/inactive state
```

#### PlaceholderChipAtom
```typescript
interface PlaceholderChipAtomProps {
  placeholder: string;
  onClick?: () => void;
}

// Clickable chip displaying placeholder like "{{user.firstname}}"
// Used in placeholder helper palette
```

### Molecules

#### EmailTemplateCardMolecule
```typescript
interface EmailTemplateCardMoleculeProps {
  template: {
    id: string;
    name: string;
    subject: string;
    trigger: TemplateTrigger;
    status?: RequestStatus;
    active: boolean;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onTest?: () => void;
  onToggleActive?: (active: boolean) => void;
}

// Displays:
// - Template name
// - Subject (truncated)
// - Trigger badge
// - Active toggle
// - Action buttons (Edit, Test, Delete)
```

#### PlaceholderPaletteMolecule
```typescript
interface PlaceholderPaletteMoleculeProps {
  onInsert: (placeholder: string) => void;
}

// Grouped placeholder chips:
// - Request Data (5 placeholders)
// - User Data (4 placeholders)
// - Service Data (2 placeholders)
// - Location Data (4 placeholders)
// - Employee Data (4 placeholders)
// - Template Responses (dynamic)
```

#### EmailPreviewMolecule
```typescript
interface EmailPreviewMoleculeProps {
  subject: string;
  body: string;
  renderAsHtml?: boolean;
}

// Preview card showing:
// - Email header (To, From, Subject)
// - Body (HTML rendered or plain text)
```

### Organisms

#### EmailTemplateFormOrganism
```typescript
interface EmailTemplateFormOrganismProps {
  initialData?: EmailTemplate;
  onSubmit: (data: CreateEmailTemplateDto | UpdateEmailTemplateDto) => void;
  onCancel?: () => void;
  loading?: boolean;
}

// Multi-section form:
// Section 1: Basic Info
//   - Name input
//   - Trigger selector (radio: ON_REQUEST_CREATED, ON_STATUS_CHANGED)
//   - Status selector (dropdown, only shown if trigger=ON_STATUS_CHANGED)
//   - Active toggle
//
// Section 2: Email Content
//   - Subject input (with placeholder palette)
//   - Body textarea (with placeholder palette, markdown/HTML editor)
//   - Character counts
//
// Section 3: Preview
//   - Live preview with sample data
//   - Test email button
//
// Validation:
//   - Name required, unique
//   - Subject required
//   - Body required
//   - Status required if trigger=ON_STATUS_CHANGED
```

#### EmailTemplateListOrganism
```typescript
interface EmailTemplateListOrganismProps {
  onEdit?: (template: EmailTemplate) => void;
  onDelete?: (templateId: string) => void;
}

// Features:
// - Filter by trigger type (tabs: All, Request Created, Status Changed)
// - Filter by status (if Status Changed selected)
// - Filter by active/inactive
// - Sort by name, created date, updated date
// - Grid/List view toggle
// - Bulk actions (activate/deactivate multiple)
// - Empty state with call-to-action
```

#### EmailTestDialogOrganism
```typescript
interface EmailTestDialogOrganismProps {
  templateId: string;
  onClose: () => void;
  onSend: (requestId: string, recipient: string) => void;
}

// Dialog form:
// - Request selector (dropdown of recent requests)
// - Recipient email input (defaults to current user email)
// - Live preview of email with selected request data
// - Send test button
// - Loading state
```

## Frontend Pages

### /admin/email-templates (List Page)
- Uses `EmailTemplateListOrganism`
- ADMIN only (protected route)
- Add new template button → opens form
- Click template card → opens detail/edit

### /admin/email-templates/new (Create Page)
- Uses `EmailTemplateFormOrganism`
- ADMIN only
- Multi-step wizard or single form
- Redirects to list on success

### /admin/email-templates/[id] (Edit Page)
- Uses `EmailTemplateFormOrganism` with initialData
- ADMIN only
- Preview panel on right side
- Test email button
- Delete confirmation

### /admin/email-templates/[id]/test (Test Dialog)
- Modal/Dialog overlay
- Uses `EmailTestDialogOrganism`
- Select request from dropdown
- Send test email to custom recipient

## Validation Rules

### CreateEmailTemplateDto
```typescript
{
  name: string (required, 2-100 chars, unique, lowercase_with_underscores),
  subject: string (required, 1-200 chars),
  body: string (required, 10-10000 chars),
  trigger: TemplateTrigger (required),
  status: RequestStatus (required if trigger=ON_STATUS_CHANGED, null otherwise),
  active: boolean (optional, defaults to true)
}
```

### UpdateEmailTemplateDto
```typescript
{
  name: string (optional, 2-100 chars, unique),
  subject: string (optional, 1-200 chars),
  body: string (optional, 10-10000 chars),
  active: boolean (optional)
}

Note: trigger and status cannot be updated after creation
```

### Template Name Rules
- Only lowercase letters, numbers, and underscores
- Must start with letter
- Examples: `request_created_client`, `status_completed_notification`

## Test Requirements

### Backend Unit Tests (95%+ coverage)

#### EmailTemplateService Tests (~35 tests)
- **CRUD Operations** (15 tests):
  - Create: success, duplicate name, validation errors, database errors
  - FindAll: with results, empty, filtered by trigger, database errors
  - FindOne: success, not found, database errors
  - Update: success, not found, duplicate name, validation errors
  - Remove: success, not found, database errors

- **Trigger Logic** (10 tests):
  - findByTrigger: ON_REQUEST_CREATED, ON_STATUS_CHANGED without status
  - findByTrigger: ON_STATUS_CHANGED with specific status
  - findByTrigger: only active templates
  - findByTrigger: empty results

- **Email Sending** (10 tests):
  - sendRequestCreatedEmails: finds templates, replaces placeholders, sends to client
  - sendStatusChangedEmails: finds templates by status, sends to client
  - sendStatusChangedEmails: sends to employee if ONGOING and assigned
  - Email sending failure handling (continues processing, logs error)

#### Placeholder Replacement Tests (~15 tests)
- Replace all request placeholders
- Replace all user placeholders
- Replace all service placeholders
- Replace all location placeholders
- Replace all employee placeholders (when assigned)
- Replace templateResponses placeholders
- Handle missing data gracefully (replace with empty string)
- Handle nested placeholders
- Preserve non-placeholder text

### Frontend Component Tests (90%+ coverage)

#### Molecules (6 tests)
- EmailTemplateCardMolecule: rendering, actions, active toggle
- PlaceholderPaletteMolecule: placeholder groups, insert callback
- EmailPreviewMolecule: plain text rendering, HTML rendering

#### Organisms (12 tests)
- EmailTemplateFormOrganism: create mode, edit mode, validation, trigger/status logic
- EmailTemplateListOrganism: filtering, sorting, CRUD actions, empty state
- EmailTestDialogOrganism: request selection, preview, send test

### E2E Tests (15+ scenarios)

#### Template Management (6 tests)
1. ✅ Create ON_REQUEST_CREATED template
2. ✅ Create ON_STATUS_CHANGED template with status
3. ✅ Edit template content
4. ✅ Toggle template active/inactive
5. ✅ Delete template
6. ✅ Validation: status required for ON_STATUS_CHANGED

#### Email Automation (5 tests)
7. ✅ Email sent when request created (verify template used)
8. ✅ Email sent when status changed to ONGOING
9. ✅ Email sent when status changed to COMPLETED
10. ✅ Employee receives email when assigned (ONGOING)
11. ✅ Inactive templates not triggered

#### Placeholder System (4 tests)
12. ✅ All placeholders replaced correctly in subject
13. ✅ All placeholders replaced correctly in body
14. ✅ Missing placeholders handled gracefully
15. ✅ templateResponses placeholders work with dynamic fields

## Security Considerations

1. **Authentication**: All endpoints require valid JWT with ADMIN role
2. **Authorization**: Only ADMINs can manage email templates
3. **Input Validation**:
   - Subject/body length limits prevent abuse
   - Template name validation prevents injection
   - HTML sanitization in body (prevent XSS)
4. **Email Sending**:
   - Verify recipient email format
   - Rate limiting on test email endpoint (5/minute)
   - Log all sent emails for audit
5. **Placeholder Injection**: No user-controlled placeholders (only system data)
6. **Error Handling**: Don't expose internal errors in email sending failures

## Performance Optimizations

1. **Database Indexes**:
   - Index on `trigger` for fast template queries
   - Compound index on `trigger + status` for status-specific lookups
   - Index on `active` to exclude inactive templates
   - Index on `name` for uniqueness checks

2. **Email Sending**:
   - Async email sending (don't block request creation)
   - Batch email sending if multiple templates match
   - Queue system for large volumes (future: Bull/Redis)

3. **Caching**:
   - Cache active templates in memory (5-minute TTL)
   - Invalidate cache on template CRUD operations

4. **Frontend**:
   - Debounce live preview updates (500ms)
   - Lazy load template list (pagination)
   - Virtual scrolling for placeholder palette

## Integration Points

### With Other Issues

- **ALI-119 (Service Requests)**:
  - Trigger ON_REQUEST_CREATED emails when POST /requests succeeds
  - Trigger ON_STATUS_CHANGED emails when PUT /requests/:id/status succeeds
  - Provide request data for placeholder replacement

- **ALI-115 (User Authentication)**:
  - Fetch user data for placeholders
  - Send emails to user.email addresses

- **ALI-117 (Work Locations)**:
  - Fetch location data for placeholders

- **ALI-118 (Services Catalog)**:
  - Fetch service and category data for placeholders

- **Email Service Provider**:
  - Integrate with Resend API
  - Handle email delivery status
  - Track bounces/failures (future)

- **Future: ALI-120 (Push Notifications)**:
  - Coordinate email + push notification for same events

## Implementation Plan

### Phase 1: Backend Foundation (4 hours)
1. Create EmailTemplate model in Prisma schema
2. Generate migrations
3. Create EmailTemplateService with CRUD methods
4. Create placeholder replacement logic
5. Write 35 unit tests (95%+ coverage)
6. Create EmailTemplateController with REST endpoints

### Phase 2: Email Integration (3 hours)
1. Create EmailService wrapper for Resend
2. Implement sendRequestCreatedEmails method
3. Implement sendStatusChangedEmails method
4. Integrate with RequestsService (ALI-119)
5. Add email sending to request creation flow
6. Add email sending to status change flow
7. Write 15 integration tests

### Phase 3: Frontend CRUD (4 hours)
1. Create atoms: TriggerBadgeAtom, ActiveToggleAtom, PlaceholderChipAtom
2. Create molecules: EmailTemplateCardMolecule, PlaceholderPaletteMolecule, EmailPreviewMolecule
3. Create organisms: EmailTemplateFormOrganism, EmailTemplateListOrganism
4. Create API routes for proxy
5. Create admin pages (list, create, edit)
6. Write 18 component tests

### Phase 4: Testing & Preview (2 hours)
1. Implement test email endpoint
2. Create EmailTestDialogOrganism
3. Add live preview to form
4. Write 15 E2E tests
5. Manual testing of email delivery

### Phase 5: Documentation & Polish (1 hour)
1. Add Swagger docs for all endpoints
2. Create admin user guide
3. Document placeholder system
4. Create default template examples

**Total Estimated Time**: 14 hours

## Default Email Templates

### 1. Request Created (Client)
```
Name: request_created_client
Trigger: ON_REQUEST_CREATED
Subject: Service Request Received - {{service.name}}
Body:
Dear {{user.firstname}} {{user.lastname}},

Thank you for submitting your service request.

Service Details:
- Service: {{service.name}}
- Category: {{service.category}}
- Scheduled Date: {{request.executionDateTime}}

Location:
{{location.street}}
{{location.city}}, {{location.state}} {{location.zipCode}}

Request ID: {{request.id}}
Status: {{request.status}}

We will review your request and assign a technician shortly.

Best regards,
Alkitu Team
```

### 2. Request Assigned (Client)
```
Name: request_ongoing_client
Trigger: ON_STATUS_CHANGED
Status: ONGOING
Subject: Technician Assigned - {{service.name}}
Body:
Dear {{user.firstname}},

Good news! A technician has been assigned to your service request.

Technician: {{employee.firstname}} {{employee.lastname}}
Phone: {{employee.phone}}
Email: {{employee.email}}

Service: {{service.name}}
Scheduled: {{request.executionDateTime}}
Location: {{location.street}}, {{location.city}}

Your technician will contact you shortly.

Request ID: {{request.id}}

Thank you,
Alkitu Team
```

### 3. Request Assigned (Employee)
```
Name: request_ongoing_employee
Trigger: ON_STATUS_CHANGED
Status: ONGOING
Subject: New Assignment - {{service.name}}
Body:
Hi {{employee.firstname}},

You have been assigned a new service request.

Client: {{user.firstname}} {{user.lastname}}
Phone: {{user.phone}}
Email: {{user.email}}

Service: {{service.name}}
Category: {{service.category}}
Scheduled: {{request.executionDateTime}}

Location:
{{location.street}}
{{location.city}}, {{location.state}} {{location.zipCode}}

Request ID: {{request.id}}

Please contact the client to confirm the appointment.

Best regards,
Alkitu Team
```

### 4. Request Completed (Client)
```
Name: request_completed_client
Trigger: ON_STATUS_CHANGED
Status: COMPLETED
Subject: Service Completed - {{service.name}}
Body:
Dear {{user.firstname}},

Your service request has been completed successfully!

Service: {{service.name}}
Completed: {{request.completedAt}}
Technician: {{employee.firstname}} {{employee.lastname}}

Request ID: {{request.id}}

We hope you're satisfied with our service. Please feel free to submit another request anytime.

Thank you for choosing Alkitu!

Best regards,
Alkitu Team
```

### 5. Request Cancelled (Client)
```
Name: request_cancelled_client
Trigger: ON_STATUS_CHANGED
Status: CANCELLED
Subject: Service Request Cancelled - {{service.name}}
Body:
Dear {{user.firstname}},

Your service request has been cancelled.

Service: {{service.name}}
Request ID: {{request.id}}

If you did not request this cancellation or have any questions, please contact us immediately.

You can submit a new request at any time.

Best regards,
Alkitu Team
```

## Environment Variables

### Backend (.env)
```bash
# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Email Configuration
EMAIL_FROM_ADDRESS=noreply@alkitu.com
EMAIL_FROM_NAME=Alkitu Service Platform
EMAIL_REPLY_TO=support@alkitu.com

# Email Feature Flags
EMAIL_ENABLED=true
EMAIL_DEBUG_MODE=false  # Log emails instead of sending (dev)
```

### Frontend (.env.local)
```bash
# No additional variables needed
```

## Error Handling

### Email Sending Failures

**Strategy**: Continue processing, log error, don't block request operations

```typescript
async sendRequestCreatedEmails(request: Request): Promise<void> {
  try {
    const templates = await this.findByTrigger('ON_REQUEST_CREATED');

    for (const template of templates) {
      try {
        const subject = this.replacePlaceholders(template.subject, request);
        const body = this.replacePlaceholders(template.body, request);
        await this.emailService.sendEmail(request.user.email, subject, body);
        this.logger.log(`Email sent: ${template.name} to ${request.user.email}`);
      } catch (emailError) {
        this.logger.error(`Failed to send email ${template.name}:`, emailError);
        // Continue to next template - don't throw
      }
    }
  } catch (error) {
    this.logger.error('Failed to fetch email templates:', error);
    // Don't throw - email failure shouldn't block request creation
  }
}
```

### Template Validation

**Invalid placeholders**: Warn in logs but don't fail validation
**Missing data**: Replace with empty string
**Circular references**: Not possible with current placeholder system

## Future Enhancements

### Short-term
- Rich text editor for email body (WYSIWYG)
- Email preview with real request data (not just test)
- Template variables (define custom placeholders)
- Email delivery tracking (sent, delivered, opened, clicked)

### Medium-term
- Template versioning
- A/B testing for email templates
- Scheduled email sending (delay by X hours)
- Email localization (multi-language templates)
- Attachment support (PDF invoices, receipts)

### Long-term
- Visual template builder (drag-and-drop blocks)
- Template analytics (open rate, click rate)
- Smart sending (optimal time based on user behavior)
- Email sequences (multi-step automated flows)
- Integration with marketing tools (Mailchimp, SendGrid)

## Monitoring & Observability

### Metrics to Track
- Email templates created/updated/deleted
- Emails sent per trigger type
- Email sending success/failure rate
- Email delivery time (queue → sent)
- Placeholder replacement errors
- Most-used templates

### Logging
```typescript
// Success
this.logger.log(`Email sent successfully: template=${templateName}, recipient=${email}, requestId=${requestId}`);

// Failure
this.logger.error(`Email sending failed: template=${templateName}, error=${error.message}`, error.stack);

// Placeholder warning
this.logger.warn(`Unknown placeholder detected: ${placeholder} in template ${templateName}`);
```

### Alerting
- Alert if email failure rate > 10% in 1 hour
- Alert if no emails sent for ON_REQUEST_CREATED in 24 hours (might indicate broken integration)

## Testing Checklist

### Backend
- [ ] All CRUD operations work
- [ ] Trigger validation enforces status rules
- [ ] Duplicate name detection works
- [ ] findByTrigger returns correct templates
- [ ] Placeholder replacement works for all field types
- [ ] Email sending integrates with Resend
- [ ] Email failures don't block request operations
- [ ] Inactive templates not triggered

### Frontend
- [ ] Template list displays all templates
- [ ] Filter by trigger/status works
- [ ] Create template form validates correctly
- [ ] Edit template preserves data
- [ ] Delete confirmation works
- [ ] Active toggle updates immediately
- [ ] Placeholder palette inserts correctly
- [ ] Live preview updates on content change
- [ ] Test email sends successfully

### Integration
- [ ] Email sent on request creation
- [ ] Email sent on status change to ONGOING
- [ ] Email sent on status change to COMPLETED
- [ ] Email sent on status change to CANCELLED
- [ ] Employee receives email when assigned
- [ ] All placeholders replaced correctly
- [ ] Multiple templates with same trigger all send

## References

- [Jira Issue](https://alkitu.atlassian.net/browse/ALI-121)
- [ALI-119 Spec](../ALI-119/ALI-119-spec.md) (Request lifecycle integration)
- [Resend API Documentation](https://resend.com/docs)
- [Prisma Schema](../../../packages/api/prisma/schema.prisma)
- [Email Best Practices](https://www.litmus.com/blog/email-best-practices)

## Approval & Sign-off

**Technical Review**: [ ] Approved
**Business Review**: [ ] Approved
**Security Review**: [ ] Approved
**Ready for Implementation**: [ ] Yes

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
**Author**: Luis Eduardo Urdaneta Martucci
