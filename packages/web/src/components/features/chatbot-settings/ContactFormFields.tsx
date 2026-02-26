'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/primitives/ui/button';
import { Checkbox } from '@/components/primitives/ui/checkbox';
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

const contactFormSchema = z.object({
  requireEmail: z.boolean(),
  requirePhone: z.boolean(),
  requireName: z.boolean(),
  requireCompany: z.boolean(),
  allowAnonymous: z.boolean(),
});

type ContactFormFieldsData = z.infer<typeof contactFormSchema>;

interface ContactFormFieldsProps {
  initialConfig: any;
}

export function ContactFormFields({ initialConfig }: ContactFormFieldsProps) {
  const queryClient = useQueryClient();
  const form = useForm<ContactFormFieldsData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      requireEmail: initialConfig.requireEmail || false,
      requirePhone: initialConfig.requirePhone || false,
      requireName: initialConfig.requireName || false,
      requireCompany: initialConfig.requireCompany || false,
      allowAnonymous: initialConfig.allowAnonymous || false,
    },
  });

  const updateConfigMutation = trpc.chatbotConfig.update.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbotConfig'] });
      toast.success('Chatbot contact form fields updated successfully.');
    },
    onError: (error) => {
      toast.error(`Failed to update contact form fields: ${error.message}`);
    },
  });

  const onSubmit = (data: ContactFormFieldsData) => {
    updateConfigMutation.mutate(data);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Contact Form Fields</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="requireEmail"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Require Email</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requirePhone"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Require Phone</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requireName"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Require Name</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="requireCompany"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Require Company</FormLabel>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="allowAnonymous"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Allow Anonymous Conversations</FormLabel>
                </div>
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
