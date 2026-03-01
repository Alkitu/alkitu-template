'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Button } from '@/components/molecules-alianza/Button';
import { Badge } from '@/components/atoms-alianza/Badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/primitives/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import type { ConnectedAccountsCardProps } from './ConnectedAccountsCard.types';

/** Google SVG icon (same as AuthCardWrapper SocialSection) */
const GoogleIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/** Known provider configs — extend here for future providers */
const PROVIDER_CONFIG: Record<
  string,
  { label: string; translationKey: string; icon: React.ReactNode }
> = {
  google: {
    label: 'Google',
    translationKey: 'accounts.google',
    icon: <GoogleIcon />,
  },
};

const KNOWN_PROVIDERS = Object.keys(PROVIDER_CONFIG);

/**
 * ConnectedAccountsCard — Alianza Molecule
 *
 * Displays linked OAuth providers and allows connecting/disconnecting them.
 * Uses tRPC to fetch/manage linked accounts.
 */
export const ConnectedAccountsCard: React.FC<ConnectedAccountsCardProps> = ({
  t,
}) => {
  const searchParams = useSearchParams();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.account.getLinkedAccounts.useQuery();

  const unlinkMutation = trpc.account.unlinkAccount.useMutation({
    onSuccess: () => {
      toast.success(t('accounts.disconnectSuccess'));
      utils.account.getLinkedAccounts.invalidate();
    },
    onError: (error) => {
      const message = error.message.includes('only sign-in method')
        ? t('accounts.cannotDisconnect')
        : t('accounts.error');
      toast.error(message);
    },
  });

  // Show success toast when redirected after linking
  useEffect(() => {
    const linked = searchParams.get('linked');
    if (linked) {
      toast.success(t('accounts.connectSuccess'));
      // Clean URL without triggering navigation
      const url = new URL(window.location.href);
      url.searchParams.delete('linked');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams, t]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const accounts = data?.accounts ?? [];
  const hasPassword = data?.hasPassword ?? false;

  // Build a map of provider → account for quick lookup
  const accountByProvider = new Map(
    accounts.map((acc) => [acc.provider, acc]),
  );

  // Can the user disconnect? Only if they have a password OR more than 1 account
  const canDisconnect = hasPassword || accounts.length > 1;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <div className="space-y-4">
      {KNOWN_PROVIDERS.map((provider) => {
        const config = PROVIDER_CONFIG[provider];
        const linkedAccount = accountByProvider.get(provider);
        const isConnected = !!linkedAccount;

        return (
          <div
            key={provider}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            {/* Provider info */}
            <div className="flex items-center gap-3">
              {config.icon}
              <div className="flex flex-col">
                <span className="font-medium text-foreground">
                  {t(config.translationKey)}
                </span>
                {isConnected ? (
                  <Badge variant="success" size="sm">
                    {t('accounts.connected')}
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {t('accounts.notConnected')}
                  </span>
                )}
              </div>
            </div>

            {/* Action button */}
            {isConnected ? (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!canDisconnect || unlinkMutation.isPending}
                    title={!canDisconnect ? t('accounts.cannotDisconnect') : undefined}
                  >
                    {unlinkMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      t('accounts.disconnect')
                    )}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {t('accounts.disconnectConfirmTitle')}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      {t('accounts.disconnectConfirmDescription')}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t('accounts.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        unlinkMutation.mutate({ accountId: linkedAccount.id })
                      }
                    >
                      {t('accounts.disconnect')}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  window.location.href = `${apiUrl}/auth/${provider}?link=true`;
                }}
              >
                {t('accounts.connect')}
              </Button>
            )}
          </div>
        );
      })}

      {/* Helper text when the only auth method cannot be removed */}
      {!canDisconnect && accounts.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {t('accounts.cannotDisconnect')}
        </p>
      )}
    </div>
  );
};

ConnectedAccountsCard.displayName = 'ConnectedAccountsCard';
