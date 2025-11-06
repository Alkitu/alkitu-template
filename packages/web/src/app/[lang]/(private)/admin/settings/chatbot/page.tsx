'use client';

import { useQuery } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { AppearanceForm } from '@/components/chatbot-settings/AppearanceForm';
import { ContactFormFields } from '@/components/chatbot-settings/ContactFormFields';
import { MessagesForm } from '@/components/chatbot-settings/MessagesForm';
import { Typography } from '@/components/atomic-design/atoms/typography';

export default function ChatbotSettingsPage() {
  const {
    data: config,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chatbotConfig'],
    queryFn: () => trpc.chatbotConfig.get.query(), // TODO: Implement this
  });

  if (isLoading) return <div>Loading settings...</div>;
  if (error) return <div>Error loading settings: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <Typography variant="h1" className="text-3xl font-bold mb-6">
        Chatbot Settings
      </Typography>
      <div className="space-y-8">
        <AppearanceForm initialConfig={config || {}} />
        <ContactFormFields initialConfig={config || {}} />
        <MessagesForm initialConfig={config || {}} />
      </div>
    </div>
  );
}
