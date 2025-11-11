'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/primitives/ui/button';
import { Input } from '@/components/primitives/Input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/primitives/ui/form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/trpc';
import { toast } from '@/components/primitives/ui/use-toast';

const appearanceSchema = z.object({
  primaryColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  textColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  backgroundColor: z
    .string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color'),
  borderRadius: z.number().int().min(0).max(20),
  position: z.enum(['bottom-right', 'bottom-left']),
});

type AppearanceFormData = z.infer<typeof appearanceSchema>;

interface AppearanceFormProps {
  initialConfig: any;
}

export function AppearanceForm({ initialConfig }: AppearanceFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: {
      primaryColor: initialConfig.primaryColor || '#007ee6',
      textColor: initialConfig.textColor || '#FFFFFF',
      backgroundColor: initialConfig.backgroundColor || '#222222',
      borderRadius: initialConfig.borderRadius || 8,
      position: initialConfig.position || 'bottom-right',
    },
  });

  const updateConfigMutation = useMutation({
    mutationFn: (data: Partial<AppearanceFormData>) =>
      trpc.chatbotConfig.update.mutate(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatbotConfig'] });
      toast({
        title: 'Success',
        description: 'Chatbot appearance updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update appearance: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: AppearanceFormData) => {
    updateConfigMutation.mutate(data);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Appearance</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="textColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="borderRadius"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Border Radius</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="block w-full p-2 border rounded-md"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                  </select>
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
