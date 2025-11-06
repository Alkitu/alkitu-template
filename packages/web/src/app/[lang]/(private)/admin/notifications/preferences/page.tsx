'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/atomic-design/atoms/typography';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslations } from '@/context/TranslationContext';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import PushNotificationSettings from '@/components/notifications/push-notification-settings';
import {
  Bell,
  Save,
  RotateCcw,
  Clock,
  Mail,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { toast } from 'sonner';

// Test user ID - En una aplicación real, esto vendría de la sesión del usuario
const TEST_USER_ID = '6861ea1a1c0cf932169adce4';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;

const preferencesSchema = z.object({
  emailEnabled: z.boolean(),
  emailTypes: z.array(z.string()),
  pushEnabled: z.boolean(),
  pushTypes: z.array(z.string()),
  inAppEnabled: z.boolean(),
  inAppTypes: z.array(z.string()),
  emailFrequency: z.enum(['immediate', 'hourly', 'daily', 'weekly']),
  digestEnabled: z.boolean(),
  quietHoursEnabled: z.boolean(),
  quietHoursStart: z
    .string()
    .regex(timeRegex, 'Time must be in HH:mm format')
    .nullable(),
  quietHoursEnd: z
    .string()
    .regex(timeRegex, 'Time must be in HH:mm format')
    .nullable(),
  marketingEnabled: z.boolean(),
  promotionalEnabled: z.boolean(),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

export default function NotificationPreferencesPage() {
  const t = useTranslations('notifications');

  // Get notification types with translations
  const getNotificationTypes = () => [
    {
      id: 'welcome',
      label: t('preferences.notificationTypes.welcome.label'),
      description: t('preferences.notificationTypes.welcome.description'),
    },
    {
      id: 'security',
      label: t('preferences.notificationTypes.security.label'),
      description: t('preferences.notificationTypes.security.description'),
    },
    {
      id: 'system',
      label: t('preferences.notificationTypes.system.label'),
      description: t('preferences.notificationTypes.system.description'),
    },
    {
      id: 'urgent',
      label: t('preferences.notificationTypes.urgent.label'),
      description: t('preferences.notificationTypes.urgent.description'),
    },
    {
      id: 'mentions',
      label: t('preferences.notificationTypes.mentions.label'),
      description: t('preferences.notificationTypes.mentions.description'),
    },
    {
      id: 'reports',
      label: t('preferences.notificationTypes.reports.label'),
      description: t('preferences.notificationTypes.reports.description'),
    },
    {
      id: 'features',
      label: t('preferences.notificationTypes.features.label'),
      description: t('preferences.notificationTypes.features.description'),
    },
  ];

  // tRPC hooks
  const {
    data: preferences,
    isLoading: loading,
    refetch,
  } = trpc.notification.getUserPreferences.useQuery({ // TODO: Implement this
    userId: TEST_USER_ID,
  });

  const updatePreferences =
    trpc.notification.createOrUpdatePreferences.useMutation({ // TODO: Implement this
      onSuccess: () => {
        toast.success(t('preferences.successUpdate'));
        refetch();
      },
      onError: (error) => {
        console.error('Error updating preferences:', error);
        toast.error(t('preferences.errorUpdate'));
      },
    });

  const deletePreferences = trpc.notification.deletePreferences.useMutation({ // TODO: Implement this
    onSuccess: () => {
      toast.success(t('preferences.successReset'));
      refetch();
    },
    onError: (error) => { // TODO: Implement this
      console.error('Error resetting preferences:', error);
      toast.error(t('preferences.errorReset'));
    },
  });

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      emailEnabled: true,
      emailTypes: ['welcome', 'security', 'system'],
      pushEnabled: true,
      pushTypes: ['urgent', 'mentions', 'system'],
      inAppEnabled: true,
      inAppTypes: ['all'],
      emailFrequency: 'immediate',
      digestEnabled: false,
      quietHoursEnabled: false,
      quietHoursStart: null,
      quietHoursEnd: null,
      marketingEnabled: false,
      promotionalEnabled: false,
    },
  });

  // Load preferences into form when data changes
  useEffect(() => {
    if (preferences) {
      form.reset({
        emailEnabled: preferences.emailEnabled,
        emailTypes: preferences.emailTypes || [],
        pushEnabled: preferences.pushEnabled,
        pushTypes: preferences.pushTypes || [],
        inAppEnabled: preferences.inAppEnabled,
        inAppTypes: preferences.inAppTypes || [],
        emailFrequency: preferences.emailFrequency as
          | 'immediate'
          | 'hourly'
          | 'daily'
          | 'weekly',
        digestEnabled: preferences.digestEnabled,
        quietHoursEnabled: preferences.quietHoursEnabled,
        quietHoursStart: preferences.quietHoursStart,
        quietHoursEnd: preferences.quietHoursEnd,
        marketingEnabled: preferences.marketingEnabled,
        promotionalEnabled: preferences.promotionalEnabled,
      });
    }
  }, [preferences, form]);

  const onSubmit = async (data: PreferencesFormData) => {
    updatePreferences.mutate({
      userId: TEST_USER_ID,
      preferences: data,
    });
  };

  const resetToDefaults = async () => {
    deletePreferences.mutate({
      userId: TEST_USER_ID,
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  const notificationTypes = getNotificationTypes();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="w-8 h-8" />
            {t('preferences.title')}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t('preferences.subtitle')}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={resetToDefaults}
          disabled={deletePreferences.isPending}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {deletePreferences.isPending
            ? t('preferences.resetting')
            : t('preferences.resetToDefaults')}
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                {t('preferences.email.title')}
              </CardTitle>
              <CardDescription>
                {t('preferences.email.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="emailEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('preferences.email.enable')}
                      </FormLabel>
                      <FormDescription>
                        {t('preferences.email.enableDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('emailEnabled') && (
                <>
                  <FormField
                    control={form.control}
                    name="emailFrequency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('preferences.email.frequency')}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  'preferences.email.selectFrequency',
                                )}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="immediate">
                              {t('preferences.email.immediate')}
                            </SelectItem>
                            <SelectItem value="hourly">
                              {t('preferences.email.hourly')}
                            </SelectItem>
                            <SelectItem value="daily">
                              {t('preferences.email.daily')}
                            </SelectItem>
                            <SelectItem value="weekly">
                              {t('preferences.email.weekly')}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {t('preferences.email.frequencyDescription')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emailTypes"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">
                            {t('preferences.email.types')}
                          </FormLabel>
                          <FormDescription>
                            {t('preferences.email.typesDescription')}
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {notificationTypes.map((type) => (
                            <FormField
                              key={type.id}
                              control={form.control}
                              name="emailTypes"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={type.id}
                                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(type.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                type.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== type.id,
                                                ),
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                      <FormLabel className="font-medium">
                                        {type.label}
                                      </FormLabel>
                                      <FormDescription className="text-sm">
                                        {type.description}
                                      </FormDescription>
                                    </div>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Push Notifications - Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                {t('preferences.push.title')}
              </CardTitle>
              <CardDescription>
                {t('preferences.push.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="pushEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('preferences.push.enable')}
                      </FormLabel>
                      <FormDescription>
                        {t('preferences.push.enableDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('pushEnabled') && (
                <FormField
                  control={form.control}
                  name="pushTypes"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">
                          {t('preferences.push.types')}
                        </FormLabel>
                        <FormDescription>
                          {t('preferences.push.typesDescription')}
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {notificationTypes.map((type) => (
                          <FormField
                            key={type.id}
                            control={form.control}
                            name="pushTypes"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={type.id}
                                  className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(type.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([
                                              ...field.value,
                                              type.id,
                                            ])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== type.id,
                                              ),
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <div className="space-y-1 leading-none">
                                    <FormLabel className="font-medium">
                                      {type.label}
                                    </FormLabel>
                                    <FormDescription className="text-sm">
                                      {type.description}
                                    </FormDescription>
                                  </div>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          {/* Push Notifications - Browser Settings */}
          <PushNotificationSettings
            userId={TEST_USER_ID}
            enabled={form.watch('pushEnabled')}
          />

          {/* In-App Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                {t('preferences.inApp.title')}
              </CardTitle>
              <CardDescription>
                {t('preferences.inApp.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="inAppEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('preferences.inApp.enable')}
                      </FormLabel>
                      <FormDescription>
                        {t('preferences.inApp.enableDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Quiet Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                {t('preferences.quietHours.title')}
              </CardTitle>
              <CardDescription>
                {t('preferences.quietHours.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="quietHoursEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('preferences.quietHours.enable')}
                      </FormLabel>
                      <FormDescription>
                        {t('preferences.quietHours.enableDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch('quietHoursEnabled') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="quietHoursStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t('preferences.quietHours.start')}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="09:00"
                            type="time"
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('preferences.quietHours.format')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="quietHoursEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('preferences.quietHours.end')}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="18:00"
                            type="time"
                            value={field.value || ''}
                            onChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          {t('preferences.quietHours.format')}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Marketing & Promotional */}
          <Card>
            <CardHeader>
              <CardTitle>{t('preferences.marketing.title')}</CardTitle>
              <CardDescription>
                {t('preferences.marketing.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="marketingEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('preferences.marketing.marketing')}
                      </FormLabel>
                      <FormDescription>
                        {t('preferences.marketing.marketingDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="promotionalEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        {t('preferences.marketing.promotional')}
                      </FormLabel>
                      <FormDescription>
                        {t('preferences.marketing.promotionalDescription')}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updatePreferences.isPending}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {updatePreferences.isPending
                ? t('preferences.saving')
                : t('preferences.savePreferences')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
