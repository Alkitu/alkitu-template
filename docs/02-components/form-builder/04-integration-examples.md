# Form Builder Integration Examples

**Last Updated**: February 10, 2026

---

## Table of Contents

1. [Service Creation Page](#service-creation-page)
2. [Form Template CRUD](#form-template-crud)
3. [Request Submission Flow](#request-submission-flow)
4. [Multi-Step Form](#multi-step-form)
5. [Form Preview](#form-preview)
6. [Auto-Save](#auto-save)
7. [Form Templates Library](#form-templates-library)

---

## Service Creation Page

Complete example of integrating FormBuilder into service creation flow.

```tsx
// app/[lang]/(private)/admin/catalog/services/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import { trpc } from '@/lib/trpc';
import type { FormSettings } from '@alkitu/shared';

export default function CreateServicePage() {
  const router = useRouter();
  const [step, setStep] = useState<'basic' | 'form' | 'review'>('basic');

  // Basic service info
  const [serviceName, setServiceName] = useState('');
  const [categoryId, setCategoryId] = useState('');

  // Form settings
  const [formSettings, setFormSettings] = useState<FormSettings>({
    title: 'Service Request Form',
    description: 'Please fill out this form to request the service',
    fields: [],
    submitButtonText: 'Submit Request',
    supportedLocales: ['en', 'es'],
    defaultLocale: 'en',
    i18n: {},
  });

  // tRPC mutations
  const createFormTemplate = trpc.formTemplate.create.useMutation();
  const createService = trpc.service.create.useMutation();

  const handleSubmit = async () => {
    try {
      // Step 1: Create form template
      const template = await createFormTemplate.mutateAsync({
        name: `${serviceName} Form`,
        description: `Form for ${serviceName} service`,
        formSettings,
        category: 'service',
        isActive: true,
      });

      // Step 2: Create service with form template
      const service = await createService.mutateAsync({
        name: serviceName,
        categoryId,
        formTemplateIds: [template.id],
      });

      // Step 3: Redirect to service page
      router.push(`/admin/catalog/services/${service.id}`);
    } catch (error) {
      console.error('Failed to create service:', error);
      alert('Failed to create service. Please try again.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Service</h1>

      {/* Progress Steps */}
      <div className="flex items-center mb-8">
        <Step number={1} label="Basic Info" active={step === 'basic'} />
        <Divider />
        <Step number={2} label="Request Form" active={step === 'form'} />
        <Divider />
        <Step number={3} label="Review" active={step === 'review'} />
      </div>

      {/* Step 1: Basic Info */}
      {step === 'basic' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Service Name</label>
            <input
              type="text"
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              placeholder="e.g., Home Cleaning"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Select a category</option>
              <option value="cleaning">Cleaning</option>
              <option value="maintenance">Maintenance</option>
              <option value="consulting">Consulting</option>
            </select>
          </div>

          <button
            onClick={() => setStep('form')}
            disabled={!serviceName || !categoryId}
            className="px-6 py-2 bg-blue-600 text-white rounded-md"
          >
            Next: Configure Form
          </button>
        </div>
      )}

      {/* Step 2: Form Builder */}
      {step === 'form' && (
        <div>
          <FormBuilder
            formSettings={formSettings}
            onChange={setFormSettings}
            supportedLocales={['en', 'es']}
            defaultLocale="en"
          />

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep('basic')}
              className="px-6 py-2 border rounded-md"
            >
              Back
            </button>
            <button
              onClick={() => setStep('review')}
              disabled={formSettings.fields.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md"
            >
              Next: Review
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 'review' && (
        <div className="space-y-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Service Details</h3>
            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="font-medium">Name:</dt>
                <dd>{serviceName}</dd>
              </div>
              <div>
                <dt className="font-medium">Category:</dt>
                <dd>{categoryId}</dd>
              </div>
            </dl>
          </div>

          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Request Form</h3>
            <dl className="space-y-2">
              <div>
                <dt className="font-medium">Title:</dt>
                <dd>{formSettings.title}</dd>
              </div>
              <div>
                <dt className="font-medium">Fields:</dt>
                <dd>{formSettings.fields.length} fields configured</dd>
              </div>
              <div>
                <dt className="font-medium">Languages:</dt>
                <dd>{formSettings.supportedLocales.join(', ')}</dd>
              </div>
            </dl>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setStep('form')}
              className="px-6 py-2 border rounded-md"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={createFormTemplate.isPending || createService.isPending}
              className="px-6 py-2 bg-green-600 text-white rounded-md"
            >
              {createFormTemplate.isPending || createService.isPending
                ? 'Creating...'
                : 'Create Service'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Form Template CRUD

Example CRUD pages for Form Templates.

```tsx
// app/[lang]/(private)/admin/form-templates/page.tsx
'use client';

import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import type { FormSettings } from '@alkitu/shared';

export default function FormTemplatesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [formSettings, setFormSettings] = useState<FormSettings>(defaultFormSettings);

  // Queries
  const { data: templates, refetch } = trpc.formTemplate.getAll.useQuery({
    page: 1,
    limit: 20,
  });

  // Mutations
  const createTemplate = trpc.formTemplate.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreating(false);
      setFormSettings(defaultFormSettings);
    },
  });

  const handleCreate = async () => {
    await createTemplate.mutateAsync({
      name: formSettings.title,
      description: formSettings.description,
      formSettings,
      category: 'general',
    });
  };

  if (isCreating) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create Form Template</h1>
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 border rounded-md"
          >
            Cancel
          </button>
        </div>

        <FormBuilder
          formSettings={formSettings}
          onChange={setFormSettings}
          supportedLocales={['en', 'es']}
          defaultLocale="en"
        />

        <button
          onClick={handleCreate}
          disabled={createTemplate.isPending}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md"
        >
          {createTemplate.isPending ? 'Creating...' : 'Create Template'}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form Templates</h1>
        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          + New Template
        </button>
      </div>

      <div className="grid gap-4">
        {templates?.items.map(template => (
          <div key={template.id} className="border rounded-lg p-4">
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              {template.formSettings.fields.length} fields •
              {template.formSettings.supportedLocales.join(', ')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Request Submission Flow

Example of rendering forms for end users to submit requests.

```tsx
// app/[lang]/(private)/client/requests/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { RequestTemplateRenderer } from '@/components/organisms-alianza/RequestTemplateRenderer';

export default function CreateRequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('serviceId');

  const [submitting, setSubmitting] = useState(false);

  // Load service with form template
  const { data: service } = trpc.service.getById.useQuery({ id: serviceId! });
  const { data: formTemplate } = trpc.formTemplate.getById.useQuery(
    { id: service?.formTemplateIds[0]! },
    { enabled: !!service?.formTemplateIds[0] }
  );

  // Mutation
  const createRequest = trpc.request.create.useMutation();

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSubmitting(true);

    try {
      await createRequest.mutateAsync({
        serviceId: serviceId!,
        formData: data,
        status: 'PENDING',
      });

      router.push('/client/requests?success=true');
    } catch (error) {
      console.error('Failed to submit request:', error);
      alert('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!formTemplate) {
    return <div>Loading form...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{formTemplate.name}</h1>

      <RequestTemplateRenderer
        template={formTemplate.formSettings}
        onSubmit={handleSubmit}
        submitButtonText={formTemplate.formSettings.submitButtonText}
        disabled={submitting}
      />
    </div>
  );
}
```

---

## Multi-Step Form

Example of building a multi-step form with groups.

```tsx
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import { createDefaultField } from '@/components/features/form-builder/lib/field-helpers';

function MultiStepFormExample() {
  const [formSettings, setFormSettings] = useState<FormSettings>({
    title: 'Customer Onboarding',
    fields: [
      // Step 1: Personal Info
      {
        ...createDefaultField('group'),
        label: 'Step 1: Personal Information',
        groupOptions: {
          showStepNumber: true,
          description: 'Tell us about yourself',
        },
        fields: [
          createDefaultField('text', { label: 'Full Name', validation: { required: true } }),
          createDefaultField('email', { label: 'Email', validation: { required: true } }),
          createDefaultField('phone', { label: 'Phone Number' }),
        ],
      },
      // Step 2: Address
      {
        ...createDefaultField('group'),
        label: 'Step 2: Address',
        groupOptions: {
          showStepNumber: true,
        },
        fields: [
          createDefaultField('text', { label: 'Street Address', validation: { required: true } }),
          createDefaultField('text', { label: 'City', validation: { required: true } }),
          createDefaultField('text', { label: 'ZIP Code', validation: { required: true } }),
        ],
      },
      // Step 3: Preferences
      {
        ...createDefaultField('group'),
        label: 'Step 3: Preferences',
        groupOptions: {
          showStepNumber: true,
        },
        fields: [
          createDefaultField('select', { label: 'Preferred Contact Method' }),
          createDefaultField('toggle', { label: 'Subscribe to Newsletter' }),
        ],
      },
    ],
    submitButtonText: 'Complete Onboarding',
    supportedLocales: ['en'],
    defaultLocale: 'en',
  });

  return <FormBuilder formSettings={formSettings} onChange={setFormSettings} />;
}
```

---

## Form Preview

Example of preview mode for form templates.

```tsx
import { useState } from 'react';
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import { RequestTemplateRenderer } from '@/components/organisms-alianza/RequestTemplateRenderer';

function FormPreviewExample() {
  const [formSettings, setFormSettings] = useState<FormSettings>({...});
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');

  return (
    <div>
      {/* Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode('edit')}
          className={mode === 'edit' ? 'bg-blue-600 text-white' : 'border'}
        >
          Edit
        </button>
        <button
          onClick={() => setMode('preview')}
          className={mode === 'preview' ? 'bg-blue-600 text-white' : 'border'}
        >
          Preview
        </button>
      </div>

      {/* Content */}
      {mode === 'edit' ? (
        <FormBuilder formSettings={formSettings} onChange={setFormSettings} />
      ) : (
        <RequestTemplateRenderer
          template={formSettings}
          onSubmit={data => console.log('Preview submission:', data)}
        />
      )}
    </div>
  );
}
```

---

## Auto-Save

Example of auto-saving form templates.

```tsx
import { useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { FormBuilder } from '@/components/features/form-builder/organisms/FormBuilder';
import { trpc } from '@/lib/trpc';

function AutoSaveFormExample({ templateId }: { templateId: string }) {
  const [formSettings, setFormSettings] = useState<FormSettings>({...});
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Mutation
  const updateTemplate = trpc.formTemplate.update.useMutation({
    onSuccess: () => setSaveStatus('saved'),
    onError: () => setSaveStatus('error'),
  });

  // Debounced auto-save (1 second delay)
  const debouncedSave = useDebouncedCallback(
    async (settings: FormSettings) => {
      setSaveStatus('saving');

      try {
        await updateTemplate.mutateAsync({
          id: templateId,
          formSettings: settings,
        });
      } catch (error) {
        console.error('Auto-save failed:', error);
      }
    },
    1000
  );

  // Auto-save on changes
  const handleChange = useCallback((settings: FormSettings) => {
    setFormSettings(settings);
    debouncedSave(settings);
  }, [debouncedSave]);

  return (
    <div>
      {/* Save Status Indicator */}
      <div className="flex items-center gap-2 mb-4">
        {saveStatus === 'saving' && (
          <span className="text-gray-600">Saving...</span>
        )}
        {saveStatus === 'saved' && (
          <span className="text-green-600">✓ All changes saved</span>
        )}
        {saveStatus === 'error' && (
          <span className="text-red-600">Failed to save. Retrying...</span>
        )}
      </div>

      <FormBuilder formSettings={formSettings} onChange={handleChange} />
    </div>
  );
}
```

---

## Form Templates Library

Example of browsing and selecting form templates.

```tsx
import { trpc } from '@/lib/trpc';

function FormTemplatesLibrary() {
  const { data: templates } = trpc.formTemplate.getAll.useQuery({
    page: 1,
    limit: 50,
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTemplates = templates?.items.filter(
    t => selectedCategory === 'all' || t.category === selectedCategory
  );

  const handleSelectTemplate = (template: FormTemplate) => {
    // Clone template and create new form
    const newFormSettings = {
      ...template.formSettings,
      title: `${template.formSettings.title} (Copy)`,
      fields: template.formSettings.fields.map(field => ({
        ...field,
        id: generateFieldId(), // New IDs
      })),
    };

    // Use newFormSettings to create a new form
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Form Templates Library</h2>

      {/* Category Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedCategory('all')}
          className={selectedCategory === 'all' ? 'bg-blue-600 text-white' : 'border'}
        >
          All
        </button>
        <button
          onClick={() => setSelectedCategory('contact')}
          className={selectedCategory === 'contact' ? 'bg-blue-600 text-white' : 'border'}
        >
          Contact Forms
        </button>
        <button
          onClick={() => setSelectedCategory('survey')}
          className={selectedCategory === 'survey' ? 'bg-blue-600 text-white' : 'border'}
        >
          Surveys
        </button>
        <button
          onClick={() => setSelectedCategory('intake')}
          className={selectedCategory === 'intake' ? 'bg-blue-600 text-white' : 'border'}
        >
          Intake Forms
        </button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates?.map(template => (
          <div key={template.id} className="border rounded-lg p-4 hover:shadow-lg transition">
            <h3 className="font-semibold">{template.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{template.description}</p>

            <div className="text-xs text-gray-500 mb-4">
              {template.formSettings.fields.length} fields •
              {template.formSettings.supportedLocales.join(', ')}
            </div>

            <button
              onClick={() => handleSelectTemplate(template)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm"
            >
              Use This Template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Next Steps

- Review [Best Practices](./03-best-practices.md) for optimization tips
- Check [Architecture Overview](./01-architecture-overview.md) for system design
- Read [Component Usage Guide](./02-component-usage-guide.md) for API details

---

**Need more examples?** Check the comprehensive test suites or Storybook stories for additional patterns.
