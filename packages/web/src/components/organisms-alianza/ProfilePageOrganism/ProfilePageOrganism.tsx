'use client';

import React from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useTranslations, useTranslationContext } from '@/context/TranslationsContext';
import { useRouter, usePathname } from 'next/navigation';
import { AdminPageHeader } from '@/components/molecules-alianza/AdminPageHeader';
import {
  TabsAlianza,
  type TabItem,
} from '@/components/molecules-alianza/TabsAlianza';
import { UserProfileForm } from '@/components/molecules-alianza/UserProfileForm';
import { ChangePasswordForm } from '@/components/molecules-alianza/ChangePasswordForm';
import { UserPreferencesForm } from '@/components/molecules-alianza/UserPreferencesForm';
import { LocationListOrganism } from '@/components/organisms/location';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/primitives/Card';
import { User, Shield, Settings, MapPin } from 'lucide-react';
import { useGlobalTheme } from '@/hooks/useGlobalTheme';
import { applyThemePreference } from '@/hooks/use-sync-user-preferences';
import type { ProfilePageOrganismProps } from './ProfilePageOrganism.types';
import type { UserPreferencesFormValues } from '@/components/molecules-alianza/UserPreferencesForm/UserPreferencesForm.types';

/**
 * ProfilePageOrganism — Alianza Organism
 *
 * Orchestrates user profile management with tabs:
 * Profile, Security, Preferences, and optionally Locations (CLIENT).
 *
 * Handles all tRPC data fetching and mutations internally.
 */
export const ProfilePageOrganism: React.FC<ProfilePageOrganismProps> = ({
  showLocations = false,
}) => {
  const t = useTranslations('profile');
  const { setLocale } = useTranslationContext();
  const router = useRouter();
  const pathname = usePathname();
  const utils = trpc.useUtils();
  const { setThemeMode } = useGlobalTheme();

  const {
    data: user,
    isLoading,
    isError,
    refetch,
  } = trpc.user.me.useQuery();



  const updateProfileMutation = trpc.user.updateMyProfile.useMutation({
    onSuccess: () => {
      toast.success(t('toast.profileUpdated'));
      refetch();
    },
    onError: () => {
      toast.error(t('toast.profileError'));
    },
  });

  const changePasswordMutation = trpc.user.changeMyPassword.useMutation({
    onSuccess: () => {
      toast.success(t('toast.passwordChanged'));
    },
    onError: (error) => {
      const message = error.message.includes('Invalid current password')
        ? t('toast.wrongPassword')
        : t('toast.passwordError');
      toast.error(message);
    },
  });

  const updatePreferencesMutation = trpc.user.updateMyPreferences.useMutation();

  const handlePreferencesSubmit = async (values: UserPreferencesFormValues) => {
    try {
      await updatePreferencesMutation.mutateAsync(values);

      // Apply theme immediately (localStorage + CSS class + React state)
      applyThemePreference(values.theme);
      setThemeMode(values.theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : values.theme as 'light' | 'dark');

      // Invalidate cache so the new page loads fresh data from DB
      await utils.user.me.invalidate();

      // Apply language if changed: update cookie + context + navigate
      const currentLang = pathname.split('/').filter(Boolean)[0];
      if (values.language !== currentLang) {
        setLocale(values.language);
        const newPath = pathname.replace(
          `/${currentLang}`,
          `/${values.language}`,
        );
        toast.success(t('toast.preferencesUpdated'));
        router.push(newPath);
        return;
      }

      toast.success(t('toast.preferencesUpdated'));
    } catch {
      toast.error(t('toast.preferencesError'));
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <AdminPageHeader title={t('title')} loading />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="p-6">
        <AdminPageHeader title={t('title')} />
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {t('error.loadFailed')}
          </CardContent>
        </Card>
      </div>
    );
  }

  const isClient = user.role === 'CLIENT';

  const tabs: TabItem[] = [
    {
      value: 'profile',
      label: t('tabs.info'),
      icon: <User className="h-4 w-4" />,
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('tabs.info')}
            </CardTitle>
            <CardDescription>{t('sections.profileDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <UserProfileForm
              defaultValues={{
                firstname: user.firstname || '',
                lastname: user.lastname || '',
                phone: (user as any).phone || '',
                company: (user as any).company || '',
                address: (user as any).address || '',
                contactPerson: (user as any).contactPerson || undefined,
              }}
              onSubmit={(values) => updateProfileMutation.mutate(values)}
              loading={updateProfileMutation.isPending}
              role={user.role}
              email={user.email}
              t={t}
            />
          </CardContent>
        </Card>
      ),
    },
    {
      value: 'security',
      label: t('tabs.security'),
      icon: <Shield className="h-4 w-4" />,
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('tabs.security')}
            </CardTitle>
            <CardDescription>{t('sections.securityDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm
              onSubmit={(values) => changePasswordMutation.mutate(values)}
              loading={changePasswordMutation.isPending}
              t={t}
            />
          </CardContent>
        </Card>
      ),
    },
    {
      value: 'preferences',
      label: t('tabs.preferences'),
      icon: <Settings className="h-4 w-4" />,
      content: (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t('tabs.preferences')}
            </CardTitle>
            <CardDescription>
              {t('sections.preferencesDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserPreferencesForm
              defaultValues={{
                theme: ((user as any).theme as 'light' | 'dark' | 'system') || 'system',
                language: ((user as any).language as 'es' | 'en') || 'es',
              }}
              onSubmit={handlePreferencesSubmit}
              loading={updatePreferencesMutation.isPending}
              t={t}
            />
          </CardContent>
        </Card>
      ),
    },
    ...(showLocations && isClient
      ? [
          {
            value: 'locations',
            label: t('tabs.locations'),
            icon: <MapPin className="h-4 w-4" />,
            content: (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('tabs.locations')}
                  </CardTitle>
                  <CardDescription>
                    {t('sections.locationsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <LocationListOrganism showAddButton />
                </CardContent>
              </Card>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="p-6 space-y-6">
      <AdminPageHeader
        title={t('title')}
        description={t('description')}
      />
      <TabsAlianza tabs={tabs} />
    </div>
  );
};

ProfilePageOrganism.displayName = 'ProfilePageOrganism';
