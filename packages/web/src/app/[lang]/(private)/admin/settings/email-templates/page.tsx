'use client';

import { useCallback, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import { Skeleton } from '@/components/primitives/ui/skeleton';
import { Button } from '@/components/primitives/ui/button';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';
import { EmailTemplate, GroupedEmailTemplates } from '@alkitu/shared';
import { TemplateGrid } from './components/TemplateGrid';
import { SendAllTestEmailsDialog } from './components/SendAllTestEmailsDialog';
import { Send } from 'lucide-react';

export default function EmailTemplatesPage() {
  const router = useRouter();
  const { lang } = useParams();
  const [testDialogOpen, setTestDialogOpen] = useState(false);

  // Queries
  const {
    data: groups,
    isLoading,
    refetch,
  } = trpc.emailTemplate.getGroupedByCategory.useQuery();

  // Mutation: only used for toggling active on list page
  const updateMutation = trpc.emailTemplate.update.useMutation();

  const handleEdit = useCallback((template: EmailTemplate) => {
    router.push(`/${lang}/admin/settings/email-templates/${template.id}`);
  }, [router, lang]);

  const handleToggleActive = useCallback(async (template: EmailTemplate) => {
    try {
      await updateMutation.mutateAsync({
        id: template.id,
        data: { active: !template.active },
      });
      toast.success(`Template ${!template.active ? 'activated' : 'deactivated'}`);
      await refetch();
    } catch (error) {
      handleApiError(error);
    }
  }, [updateMutation, refetch]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 container mx-auto max-w-7xl">
        <AdminPageHeader
          title="Email Templates"
          description="Customize email templates for all platform communications"
          backHref={`/${lang}/admin/settings`}
          backLabel="Back to Settings"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
             <Skeleton key={i} className="h-[200px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 container mx-auto max-w-7xl pb-20">
      <AdminPageHeader
        title="Email Templates"
        description="Customize email templates for all platform communications"
        backHref={`/${lang}/admin/settings`}
        backLabel="Back to Settings"
        actions={
          <Button variant="outline" onClick={() => setTestDialogOpen(true)}>
            <Send className="mr-2 size-4" />
            Send All Test Emails
          </Button>
        }
      />

      <TemplateGrid
         groups={(groups as unknown as GroupedEmailTemplates[]) || []}
         onEdit={handleEdit}
         onToggleActive={handleToggleActive}
      />

      <SendAllTestEmailsDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
      />
    </div>
  );
}
