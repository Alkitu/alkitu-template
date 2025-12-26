# ALI-121: Frontend Development Guide

**Purpose**: Step-by-step guide for implementing email templates frontend
**Target Audience**: Frontend developers
**Prerequisites**: Next.js, tRPC, Radix UI knowledge

---

## Step 1: Email Templates List Page

### 1.1 Create Page File

**File**: `packages/web/src/app/[lang]/(private)/admin/email-templates/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useTranslations } from '@/context/TranslationsContext';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { Plus } from 'lucide-react';
import { EmailTemplateListOrganism } from '@/components/organisms/EmailTemplateListOrganism';
import { EmailTemplateFormDialog } from '@/components/organisms/EmailTemplateFormDialog';

export default function EmailTemplatesPage() {
  const t = useTranslations('emailTemplates');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const { data: templates, isLoading, refetch } = trpc.emailTemplate.getAll.useQuery();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground">{t('description')}</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t('actions.create')}
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <EmailTemplateListOrganism
          templates={templates || []}
          onEdit={(template) => {
            // Open edit dialog
          }}
          onDelete={async (id) => {
            await trpc.emailTemplate.delete.mutate({ id });
            refetch();
          }}
          onTest={(template) => {
            // Open test dialog
          }}
        />
      )}

      <EmailTemplateFormDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
```

---

## Step 2: Email Template List Organism

### 2.1 Create Organism Component

**File**: `packages/web/src/components/organisms/EmailTemplateListOrganism.tsx`

```typescript
import { EmailTemplate, TemplateTrigger } from '@prisma/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/primitives/ui/table';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/primitives/ui/button';
import { Edit, Trash2, Send } from 'lucide-react';

interface Props {
  templates: EmailTemplate[];
  onEdit: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
  onTest: (template: EmailTemplate) => void;
}

export function EmailTemplateListOrganism({ templates, onEdit, onDelete, onTest }: Props) {
  const getTriggerBadge = (trigger: TemplateTrigger) => {
    const colors = {
      ON_REQUEST_CREATED: 'bg-blue-500',
      ON_STATUS_CHANGED: 'bg-orange-500',
    };
    return <Badge className={colors[trigger]}>{trigger}</Badge>;
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Trigger</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Active</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">{template.name}</TableCell>
              <TableCell>{template.subject}</TableCell>
              <TableCell>{getTriggerBadge(template.trigger)}</TableCell>
              <TableCell>{template.status || 'All'}</TableCell>
              <TableCell>
                {template.active ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="secondary">Inactive</Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onTest(template)}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDelete(template.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

---

## Step 3: Email Template Form Dialog

### 3.1 Create Form Dialog Organism

**File**: `packages/web/src/components/organisms/EmailTemplateFormDialog.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/ui/form';
import { Input } from '@/components/primitives/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { Switch } from '@/components/primitives/ui/switch';
import { Button } from '@/components/primitives/ui/button';
import { RichTextEditor } from '@/components/molecules/RichTextEditor';
import { PlaceholderPaletteMolecule } from '@/components/molecules/PlaceholderPaletteMolecule';
import { EmailPreviewMolecule } from '@/components/molecules/EmailPreviewMolecule';

const formSchema = z.object({
  name: z.string().min(3).max(100),
  subject: z.string().min(5).max(200),
  body: z.string().min(10).max(10000),
  trigger: z.enum(['ON_REQUEST_CREATED', 'ON_STATUS_CHANGED']),
  status: z.enum(['PENDING', 'ONGOING', 'COMPLETED', 'CANCELLED']).optional(),
  active: z.boolean().default(true),
});

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template?: EmailTemplate; // For edit mode
}

export function EmailTemplateFormDialog({ open, onClose, onSuccess, template }: Props) {
  const [showPreview, setShowPreview] = useState(false);
  const createMutation = trpc.emailTemplate.create.useMutation();
  const updateMutation = trpc.emailTemplate.update.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: template || {
      name: '',
      subject: '',
      body: '',
      trigger: 'ON_REQUEST_CREATED',
      active: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (template) {
        await updateMutation.mutateAsync({ id: template.id, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      onSuccess();
      onClose();
      form.reset();
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  const insertPlaceholder = (placeholder: string) => {
    const currentBody = form.getValues('body');
    form.setValue('body', currentBody + ` {{${placeholder}}}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {template ? 'Edit Email Template' : 'Create Email Template'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4">
          {/* Form (left side, 2 columns) */}
          <div className="col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Template Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="request_created_notification" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Subject</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Request Confirmation - {{service.name}}" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Body</FormLabel>
                      <FormControl>
                        <RichTextEditor
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Enter email content with placeholders..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="trigger"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trigger</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select trigger" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ON_REQUEST_CREATED">Request Created</SelectItem>
                          <SelectItem value="ON_STATUS_CHANGED">Status Changed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('trigger') === 'ON_STATUS_CHANGED' && (
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="All statuses" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="ONGOING">Ongoing</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="CANCELLED">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <FormLabel>Active</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable this template
                        </p>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-2">
                  <Button type="submit" disabled={createMutation.isLoading || updateMutation.isLoading}>
                    {template ? 'Update' : 'Create'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowPreview(!showPreview)}>
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                </div>
              </form>
            </Form>

            {showPreview && (
              <div className="mt-4">
                <EmailPreviewMolecule
                  subject={form.getValues('subject')}
                  body={form.getValues('body')}
                />
              </div>
            )}
          </div>

          {/* Placeholder Palette (right side, 1 column) */}
          <div className="col-span-1">
            <PlaceholderPaletteMolecule onSelectPlaceholder={insertPlaceholder} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Step 4: Placeholder Palette Molecule

### 4.1 Create Placeholder Palette

**File**: `packages/web/src/components/molecules/PlaceholderPaletteMolecule.tsx`

```typescript
import { useState } from 'react';
import { Badge } from '@/components/atoms/badge';
import { Button } from '@/components/primitives/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onSelectPlaceholder: (placeholder: string) => void;
}

export function PlaceholderPaletteMolecule({ onSelectPlaceholder }: Props) {
  const [category, setCategory] = useState<string>('request');

  const placeholders = {
    request: [
      { key: 'request.id', label: 'Request ID' },
      { key: 'request.status', label: 'Status' },
      { key: 'request.executionDateTime', label: 'Execution Date' },
      { key: 'request.createdAt', label: 'Created At' },
      { key: 'request.completedAt', label: 'Completed At' },
    ],
    user: [
      { key: 'user.firstname', label: 'First Name' },
      { key: 'user.lastname', label: 'Last Name' },
      { key: 'user.email', label: 'Email' },
      { key: 'user.phone', label: 'Phone' },
    ],
    service: [
      { key: 'service.name', label: 'Service Name' },
      { key: 'service.category', label: 'Category' },
    ],
    location: [
      { key: 'location.street', label: 'Street' },
      { key: 'location.city', label: 'City' },
      { key: 'location.state', label: 'State' },
      { key: 'location.zipCode', label: 'ZIP Code' },
    ],
    employee: [
      { key: 'employee.firstname', label: 'First Name' },
      { key: 'employee.lastname', label: 'Last Name' },
      { key: 'employee.email', label: 'Email' },
      { key: 'employee.phone', label: 'Phone' },
    ],
  };

  const handleCopy = (placeholder: string) => {
    navigator.clipboard.writeText(`{{${placeholder}}}`);
    toast.success('Placeholder copied to clipboard');
  };

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-3">Available Placeholders</h3>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.keys(placeholders).map((cat) => (
          <Badge
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Badge>
        ))}
      </div>

      {/* Placeholder list */}
      <div className="space-y-2">
        {placeholders[category as keyof typeof placeholders].map((placeholder) => (
          <div
            key={placeholder.key}
            className="flex justify-between items-center p-2 border rounded hover:bg-accent cursor-pointer"
            onClick={() => onSelectPlaceholder(placeholder.key)}
          >
            <div>
              <p className="text-sm font-medium">{placeholder.label}</p>
              <code className="text-xs text-muted-foreground">
                {`{{${placeholder.key}}}`}
              </code>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy(placeholder.key);
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Step 5: Email Preview Molecule

### 5.1 Create Email Preview

**File**: `packages/web/src/components/molecules/EmailPreviewMolecule.tsx`

```typescript
import { Card } from '@/components/primitives/Card';

interface Props {
  subject: string;
  body: string;
}

export function EmailPreviewMolecule({ subject, body }: Props) {
  // Sample data for preview
  const sampleData = {
    'request.id': 'REQ-12345',
    'request.status': 'PENDING',
    'request.executionDateTime': '2025-12-27 10:00 AM',
    'request.createdAt': '2025-12-26 2:30 PM',
    'user.firstname': 'John',
    'user.lastname': 'Doe',
    'user.email': 'john.doe@example.com',
    'service.name': 'Emergency Plumbing',
    'location.city': 'New York',
    // ... other sample data
  };

  const replacePlaceholders = (text: string): string => {
    let result = text;
    Object.entries(sampleData).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value);
    });
    return result;
  };

  const previewSubject = replacePlaceholders(subject);
  const previewBody = replacePlaceholders(body);

  return (
    <Card className="p-4">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">Email Preview (with sample data)</p>
      </div>

      <div className="border rounded-lg p-4 bg-white">
        <div className="mb-4 pb-4 border-b">
          <p className="text-sm text-muted-foreground mb-1">Subject:</p>
          <p className="font-semibold">{previewSubject}</p>
        </div>

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: previewBody }}
        />
      </div>
    </Card>
  );
}
```

---

## Step 6: Rich Text Editor Molecule

### 6.1 Create Rich Text Editor (Using Tiptap)

**File**: `packages/web/src/components/molecules/RichTextEditor.tsx`

```typescript
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Button } from '@/components/primitives/ui/button';
import { Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg">
      {/* Toolbar */}
      <div className="border-b p-2 flex gap-2">
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading') ? 'bg-accent' : ''}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[200px]"
      />
    </div>
  );
}
```

**Install Tiptap**:
```bash
npm install @tiptap/react @tiptap/starter-kit
```

---

## Step 7: Test Email Dialog

### 7.1 Create Test Email Dialog

**File**: `packages/web/src/components/organisms/TestEmailDialog.tsx`

```typescript
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/lib/trpc';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/primitives/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/ui/form';
import { Input } from '@/components/primitives/ui/input';
import { Button } from '@/components/primitives/ui/button';
import { toast } from 'sonner';

const formSchema = z.object({
  recipientEmail: z.string().email(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  template: EmailTemplate;
}

export function TestEmailDialog({ open, onClose, template }: Props) {
  const sendTestMutation = trpc.emailTemplate.sendTestEmail.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientEmail: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await sendTestMutation.mutateAsync({
        templateId: template.id,
        testData: {
          request: {
            id: 'TEST-123',
            status: 'PENDING',
            executionDateTime: new Date(),
            createdAt: new Date(),
          },
          user: {
            firstname: 'Test',
            lastname: 'User',
            email: data.recipientEmail,
            phone: '+1234567890',
          },
          service: { name: 'Test Service', category: 'Test Category' },
          location: { street: '123 Main St', city: 'City', state: 'State', zipCode: '12345' },
        },
      });

      toast.success('Test email sent successfully');
      onClose();
      form.reset();
    } catch (error) {
      toast.error('Failed to send test email');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send Test Email</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="recipientEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="test@example.com" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={sendTestMutation.isLoading}>
              Send Test Email
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## Step 8: Translations

### 8.1 Add English Translations

**File**: `packages/web/src/locales/en/common.json`

```json
{
  "emailTemplates": {
    "title": "Email Templates",
    "description": "Manage automated email templates for request lifecycle events",
    "fields": {
      "name": "Template Name",
      "subject": "Email Subject",
      "body": "Email Body",
      "trigger": "Trigger",
      "status": "Status",
      "active": "Active"
    },
    "triggers": {
      "ON_REQUEST_CREATED": "Request Created",
      "ON_STATUS_CHANGED": "Status Changed"
    },
    "actions": {
      "create": "Create Template",
      "edit": "Edit Template",
      "delete": "Delete Template",
      "test": "Send Test Email"
    },
    "placeholders": {
      "title": "Available Placeholders",
      "request": "Request Data",
      "user": "User Data",
      "service": "Service Data",
      "location": "Location Data",
      "employee": "Employee Data"
    }
  }
}
```

### 8.2 Add Spanish Translations

**File**: `packages/web/src/locales/es/common.json`

```json
{
  "emailTemplates": {
    "title": "Plantillas de Email",
    "description": "Gestionar plantillas de correo automatizadas para eventos del ciclo de vida de solicitudes",
    "fields": {
      "name": "Nombre de Plantilla",
      "subject": "Asunto del Email",
      "body": "Cuerpo del Email",
      "trigger": "Disparador",
      "status": "Estado",
      "active": "Activo"
    },
    "triggers": {
      "ON_REQUEST_CREATED": "Solicitud Creada",
      "ON_STATUS_CHANGED": "Estado Cambiado"
    },
    "actions": {
      "create": "Crear Plantilla",
      "edit": "Editar Plantilla",
      "delete": "Eliminar Plantilla",
      "test": "Enviar Email de Prueba"
    },
    "placeholders": {
      "title": "Placeholders Disponibles",
      "request": "Datos de Solicitud",
      "user": "Datos de Usuario",
      "service": "Datos de Servicio",
      "location": "Datos de Ubicación",
      "employee": "Datos de Empleado"
    }
  }
}
```

---

## Step 9: Component Testing

### 9.1 Test Email Template Form

**File**: `packages/web/src/components/organisms/__tests__/EmailTemplateFormDialog.test.tsx`

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailTemplateFormDialog } from '../EmailTemplateFormDialog';

describe('EmailTemplateFormDialog', () => {
  it('should render form fields', () => {
    render(<EmailTemplateFormDialog open={true} onClose={() => {}} onSuccess={() => {}} />);

    expect(screen.getByLabelText(/Template Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Body/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<EmailTemplateFormDialog open={true} onClose={() => {}} onSuccess={() => {}} />);

    fireEvent.click(screen.getByText(/Create/i));

    await waitFor(() => {
      expect(screen.getByText(/Template name is required/i)).toBeInTheDocument();
    });
  });

  it('should insert placeholder on click', () => {
    render(<EmailTemplateFormDialog open={true} onClose={() => {}} onSuccess={() => {}} />);

    fireEvent.click(screen.getByText(/request.id/i));

    const bodyField = screen.getByLabelText(/Email Body/i);
    expect(bodyField).toHaveValue(expect.stringContaining('{{request.id}}'));
  });
});
```

**Run Tests**:
```bash
npm run test EmailTemplateFormDialog.test
```

---

## Troubleshooting

**Issue**: Placeholder not inserted correctly
- Check cursor position in rich text editor
- Verify placeholder format: `{{category.field}}`

**Issue**: Preview not updating
- Check if `showPreview` state is working
- Verify `form.watch()` is watching correct fields

**Issue**: Form validation errors
- Check Zod schema matches form fields
- Verify `zodResolver` is properly configured

---

**Document Version**: 1.0
**Last Updated**: 2025-12-26
