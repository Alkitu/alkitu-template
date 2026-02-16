'use client';

import { useState, useCallback, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import type { EmailTemplate } from '@alkitu/shared';
import { TemplateEditorForm } from '../components/TemplateEditorForm';
import { TemplatePreview } from '../components/TemplatePreview';
import { Split } from 'lucide-react';

export default function EditEmailTemplatePage() {
  const { lang, id } = useParams();
  const templateId = id as string;

  const [locale, setLocale] = useState('es');
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Query: fetch single template by ID
  const {
    data: template,
    isLoading,
    refetch,
  } = trpc.emailTemplate.getById.useQuery(
    { id: templateId },
    { enabled: !!templateId },
  );

  // Cast template data to our shared type
  const templateData = template as unknown as EmailTemplate | undefined;

  // Query: get variables for the template's category
  const { data: variables } = trpc.emailTemplate.getVariablesByCategory.useQuery(
    { category: templateData?.category ?? 'REQUEST' },
    { enabled: !!templateData },
  );

  // Mutations
  const updateMutation = trpc.emailTemplate.update.useMutation();
  const updateLocalizationMutation = trpc.emailTemplate.updateLocalization.useMutation();
  const resetMutation = trpc.emailTemplate.resetToDefault.useMutation();

  // Load template content into editor when template loads or locale changes
  useEffect(() => {
    if (!templateData) return;

    if (locale === templateData.defaultLocale || locale === 'es') {
      setEditSubject(templateData.subject);
      setEditBody(templateData.body);
    } else {
      const localized = templateData.localizations?.find((l) => l.locale === locale);
      if (localized) {
        setEditSubject(localized.subject);
        setEditBody(localized.body);
      } else {
        setEditSubject(templateData.subject);
        setEditBody(templateData.body);
      }
    }

    if (!isInitialized) setIsInitialized(true);
  }, [templateData, locale, isInitialized]);

  const handleSave = useCallback(async () => {
    if (!templateData) return;

    try {
      if (locale === templateData.defaultLocale || locale === 'es') {
        await updateMutation.mutateAsync({
          id: templateData.id,
          data: { subject: editSubject, body: editBody },
        });
      } else {
        await updateLocalizationMutation.mutateAsync({
          id: templateData.id,
          locale,
          subject: editSubject,
          body: editBody,
        });
      }

      toast.success('Template saved successfully');
      await refetch();
    } catch (error) {
      handleApiError(error);
    }
  }, [templateData, locale, editSubject, editBody, updateMutation, updateLocalizationMutation, refetch]);

  const handleReset = useCallback(async () => {
    if (!templateData) return;

    if (!window.confirm('Are you sure you want to reset this template to its default content? This cannot be undone.')) {
      return;
    }

    try {
      await resetMutation.mutateAsync({ id: templateData.id });
      toast.success('Template reset to default');
      const result = await refetch();

      if (result.data) {
        setEditSubject(result.data.subject);
        setEditBody(result.data.body);
      }
    } catch (error) {
      handleApiError(error);
    }
  }, [templateData, resetMutation, refetch]);

  const handleToggleActive = useCallback(async () => {
    if (!templateData) return;

    try {
      await updateMutation.mutateAsync({
        id: templateData.id,
        data: { active: !templateData.active },
      });
      toast.success(`Template ${!templateData.active ? 'activated' : 'deactivated'}`);
      await refetch();
    } catch (error) {
      handleApiError(error);
    }
  }, [templateData, updateMutation, refetch]);

  const isSaving = updateMutation.isPending || updateLocalizationMutation.isPending || resetMutation.isPending;

  if (isLoading || (!isInitialized && !templateData)) {
    return (
      <div className="p-6 space-y-6 container mx-auto max-w-7xl">
        <AdminPageHeader
          title="Edit Email Template"
          description="Loading template..."
          backHref={`/${lang}/admin/settings/email-templates`}
          backLabel="Back to Email Templates"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[500px] rounded-xl" />
          <Skeleton className="h-[500px] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!templateData) {
    return (
      <div className="p-6 space-y-4 container mx-auto max-w-7xl">
        <AdminPageHeader
          title="Template Not Found"
          description="The email template could not be found."
          backHref={`/${lang}/admin/settings/email-templates`}
          backLabel="Back to Email Templates"
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 container mx-auto max-w-7xl pb-20">
      <AdminPageHeader
        title={templateData.name}
        description={templateData.description || 'Edit this email template'}
        backHref={`/${lang}/admin/settings/email-templates`}
        backLabel="Back to Email Templates"
      />

      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Split className="h-4 w-4" />
        <span>Editor & Preview</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Editor */}
        <div className="min-h-[500px]">
          <TemplateEditorForm
            template={templateData}
            locale={locale}
            onLocaleChange={setLocale}
            subject={editSubject}
            body={editBody}
            onSubjectChange={setEditSubject}
            onBodyChange={setEditBody}
            onSave={handleSave}
            onReset={handleReset}
            onToggleActive={handleToggleActive}
            isSaving={isSaving}
            variables={variables || templateData.variables || []}
          />
        </div>

        {/* Right: Preview */}
        <div className="min-h-[500px]">
          <TemplatePreview subject={editSubject} body={editBody} />
        </div>
      </div>
    </div>
  );
}
