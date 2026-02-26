'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/primitives/ui/button';
import { Textarea } from '@/components/primitives/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/ui/form';
import { useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

const messagesSchema = z.object({
  welcomeMessage: z.string().min(1, 'Welcome message cannot be empty.'),
  offlineMessage: z.string().min(1, 'Offline message cannot be empty.'),
  thankYouMessage: z.string().min(1, 'Thank you message cannot be empty.'),
});

type MessagesFormData = z.infer<typeof messagesSchema>;

interface MessagesFormProps {
  initialConfig: any;
}

export function MessagesForm({ initialConfig }: MessagesFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<MessagesFormData>({
    resolver: zodResolver(messagesSchema),
    defaultValues: {
      welcomeMessage:
        initialConfig.welcomeMessage || 'Hi there! How can we help you today?',
      offlineMessage:
        initialConfig.offlineMessage ||
        "We are currently offline. Please leave a message and we'll get back to you.",
      thankYouMessage:
        initialConfig.thankYouMessage ||
        "Thank you for your message! We'll get back to you shortly.",
    },
  });

  const updateConfigMutation = trpc.chatbotConfig.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbotConfig'] });
      toast.success('Chatbot messages updated successfully.');
    },
    onError: (error) => {
      toast.error(`Failed to update messages: ${error.message}`);
    },
  });

  const onSubmit = (data: MessagesFormData) => {
    updateConfigMutation.mutate(data);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="welcomeMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Welcome Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Welcome message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="offlineMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offline Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Offline message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="thankYouMessage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thank You Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Thank you message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={updateConfigMutation.isPending}>
            Save Changes
          </Button>
        </form>
      </Form>
    </div>
  );
}
