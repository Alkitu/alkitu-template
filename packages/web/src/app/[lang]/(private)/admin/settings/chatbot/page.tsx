'use client';

import { trpc } from '@/lib/trpc';
import { AppearanceForm } from '@/components/features/chatbot-settings/AppearanceForm';
import { ContactFormFields } from '@/components/features/chatbot-settings/ContactFormFields';
import { MessagesForm } from '@/components/features/chatbot-settings/MessagesForm';
import { Typography } from '@/components/atoms/typography';
import { AdminPageHeader } from '@/components/molecules/admin-page-header';

export default function ChatbotSettingsPage() {
  const {
    data: config,
    isLoading,
    error,
  } = trpc.chatbotConfig.get.useQuery();

  if (isLoading) return <div>Loading settings...</div>;
  if (error) return <div>Error loading settings: {error.message}</div>;

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title="Chatbot Settings"
        description="Configure chatbot appearance and behavior"
        backHref={`/admin/settings`}
        backLabel="Back to Settings"
      />
      <div className="space-y-8">
        <AppearanceForm initialConfig={config || {}} />
        <ContactFormFields initialConfig={config || {}} />
        <MessagesForm initialConfig={config || {}} />
      </div>
    </div>
  );
}
