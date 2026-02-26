'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createEmailTemplateSchema } from '@alkitu/shared/schemas';
import type {
  EmailTemplateFormOrganismProps,
  EmailTemplateFormData,
} from './EmailTemplateFormOrganism.types';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/ui/input';
import { Textarea } from '@/components/primitives/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/primitives/ui/select';
import { Label } from '@/components/primitives/ui/label';
import { Switch } from '@/components/primitives/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card';
import { AlertCircle, Eye, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/primitives/ui/alert';
import { PlaceholderPaletteMolecule } from '@/components/molecules/placeholder-palette';
import { useEffect, useState } from 'react';

/**
 * EmailTemplateFormOrganism
 *
 * Form organism for creating and editing email templates with validation,
 * preview functionality, and placeholder insertion helpers.
 *
 * @component
 * @example
 * ```tsx
 * <EmailTemplateFormOrganism
 *   initialData={template}
 *   onSuccess={(template) => console.log('Saved:', template)}
 *   onCancel={() => router.back()}
 * />
 * ```
 */
export function EmailTemplateFormOrganism({
  initialData,
  onSuccess,
  onError,
  onCancel,
  showCancel = true,
  submitText,
  cancelText,
  showPreview = true,
}: EmailTemplateFormOrganismProps) {
  const isEditMode = !!initialData;
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EmailTemplateFormData>({
    resolver: zodResolver(createEmailTemplateSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          subject: initialData.subject,
          body: initialData.body,
          trigger: initialData.trigger,
          status: initialData.status,
          active: initialData.active,
        }
      : {
          active: true,
          trigger: 'ON_REQUEST_CREATED',
        },
  });

  // Watch trigger to conditionally show status field
  const selectedTrigger = watch('trigger');

  // tRPC mutations
  const createMutation = trpc.emailTemplate.create.useMutation();
  const updateMutation = trpc.emailTemplate.update.useMutation();

  // Fetch available placeholders
  const { data: placeholders } = trpc.emailTemplate.getAvailablePlaceholders.useQuery();

  // Reset status field when trigger changes
  useEffect(() => {
    if (selectedTrigger === 'ON_REQUEST_CREATED') {
      setValue('status', null);
    }
  }, [selectedTrigger, setValue]);

  // Form submit handler
  const onSubmit = async (data: EmailTemplateFormData) => {
    try {
      if (isEditMode && initialData) {
        // Update existing template
        const result = await updateMutation.mutateAsync({
          id: initialData.id,
          data: {
            name: data.name,
            subject: data.subject,
            body: data.body,
            active: data.active,
          },
        });
        onSuccess?.(result as any);
      } else {
        // Create new template
        const result = await createMutation.mutateAsync(data);
        onSuccess?.(result as any);
      }
    } catch (error) {
      onError?.(error as Error);
    }
  };

  // Insert placeholder at cursor position in textarea
  const insertPlaceholder = (placeholder: string, field: 'subject' | 'body') => {
    const currentValue = watch(field) || '';
    setValue(field, currentValue + placeholder);
  };

  // Loading state
  const isLoading = isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Template' : 'Create New Template'}</CardTitle>
          <CardDescription>
            {isEditMode
              ? 'Update the email template details below'
              : 'Create a new email template with dynamic placeholders'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Template Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., request_created_client"
              disabled={isEditMode} // Cannot change name in edit mode
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Must start with a letter and contain only lowercase letters, numbers, and
              underscores. Suffix with _client or _employee to determine recipient.
            </p>
          </div>

          {/* Trigger */}
          <div className="space-y-2">
            <Label id="trigger-label" htmlFor="trigger">
              Trigger Event <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedTrigger}
              onValueChange={(value) => setValue('trigger', value as any)}
              disabled={isEditMode} // Cannot change trigger in edit mode
            >
              <SelectTrigger id="trigger" aria-labelledby="trigger-label">
                <SelectValue placeholder="Select a trigger event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ON_REQUEST_CREATED">
                  When Request is Created
                </SelectItem>
                <SelectItem value="ON_STATUS_CHANGED">
                  When Status Changes
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.trigger && (
              <p className="text-sm text-red-500">{errors.trigger.message}</p>
            )}
          </div>

          {/* Status (conditional - only for ON_STATUS_CHANGED) */}
          {selectedTrigger === 'ON_STATUS_CHANGED' && (
            <div className="space-y-2">
              <Label id="status-label" htmlFor="status">
                Target Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch('status') || undefined}
                onValueChange={(value) => setValue('status', value as any)}
                disabled={isEditMode} // Cannot change status in edit mode
              >
                <SelectTrigger id="status" aria-labelledby="status-label">
                  <SelectValue placeholder="Select target status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                This template will be sent when a request transitions to this status.
              </p>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">
              Email Subject <span className="text-red-500">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="e.g., Your Request #{{request.id}} has been created"
              {...register('subject')}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject.message}</p>
            )}
            <div className="flex flex-wrap gap-1 mt-2">
              {placeholders?.request.slice(0, 3).map((placeholder) => (
                <Button
                  key={placeholder}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => insertPlaceholder(placeholder, 'subject')}
                  className="text-xs"
                >
                  {placeholder}
                </Button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="space-y-2">
            <Label htmlFor="body">
              Email Body <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="body"
              placeholder="Hello {{user.firstname}},&#10;&#10;Your service request has been created successfully..."
              rows={12}
              className="font-mono text-sm"
              {...register('body')}
            />
            {errors.body && (
              <p className="text-sm text-red-500">{errors.body.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Use placeholders like {'{'}
              {'{'}request.id{'}'} {'}'} to insert dynamic data. See the Placeholder
              Palette below for all available placeholders.
            </p>
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label id="active-label" htmlFor="active" className="text-base">
                Active
              </Label>
              <p className="text-sm text-muted-foreground">
                {watch('active')
                  ? 'This template will be sent automatically'
                  : 'This template will not be sent (draft mode)'}
              </p>
            </div>
            <Switch
              id="active"
              aria-labelledby="active-label"
              checked={watch('active')}
              onCheckedChange={(checked) => setValue('active', checked)}
            />
          </div>

          {/* Error Display */}
          {(createMutation.error || updateMutation.error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {createMutation.error?.message || updateMutation.error?.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Success Display */}
          {(createMutation.isSuccess || updateMutation.isSuccess) && (
            <Alert className="bg-green-50 text-green-900 border-green-200">
              <AlertDescription>
                Template {isEditMode ? 'updated' : 'created'} successfully!
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Placeholder Palette */}
      {placeholders && (
        <Card>
          <CardHeader>
            <CardTitle>Placeholder Palette</CardTitle>
            <CardDescription>
              Click any placeholder to insert it into the body field
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlaceholderPaletteMolecule
              placeholders={placeholders}
              onPlaceholderClick={(placeholder) => insertPlaceholder(placeholder, 'body')}
              enableCopy
              columns={5}
            />
          </CardContent>
        </Card>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3">
        {showCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelText || 'Cancel'}
          </Button>
        )}

        {showPreview && (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreviewModal(true)}
            disabled={isLoading || !watch('subject') || !watch('body')}
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {submitText || (isEditMode ? 'Update Template' : 'Create Template')}
        </Button>
      </div>
    </form>
  );
}
