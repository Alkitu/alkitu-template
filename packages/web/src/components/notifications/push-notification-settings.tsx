'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/atomic-design/molecules/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/atomic-design/atoms/badge';
import { Alert, AlertDescription } from '@/components/atomic-design/atoms/alert';
import { Separator } from '@/components/atomic-design/atoms/separator';
import { useTranslations } from '@/context/TranslationContext';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import {
  Bell,
  BellOff,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Settings,
  TestTube,
  Shield,
  Info,
} from 'lucide-react';

interface PushNotificationSettingsProps {
  userId: string;
  enabled?: boolean;
}

const PushNotificationSettings: React.FC<PushNotificationSettingsProps> = ({
  userId,
  enabled = true,
}) => {
  const t = useTranslations('notifications');
  const {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe,
    testNotification,
    requestPermission,
  } = usePushNotifications({ userId, enabled });

  const getPermissionBadge = () => {
    switch (permission) {
      case 'granted':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            {t('preferences.push.granted')}
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="destructive">
            <AlertCircle className="w-3 h-3 mr-1" />
            {t('preferences.push.denied')}
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <AlertCircle className="w-3 h-3 mr-1" />
            {t('preferences.push.default')}
          </Badge>
        );
    }
  };

  const getSubscriptionBadge = () => {
    if (isSubscribed) {
      return (
        <Badge variant="default" className="bg-blue-100 text-blue-800">
          <Bell className="w-3 h-3 mr-1" />
          {t('preferences.push.active')}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          <BellOff className="w-3 h-3 mr-1" />
          {t('preferences.push.inactive')}
        </Badge>
      );
    }
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            {t('preferences.push.browserSettings')}
          </CardTitle>
          <CardDescription>
            {t('preferences.push.browserDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Push notifications are not supported in your browser. Please use a
              modern browser like Chrome, Firefox, or Safari.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          {t('preferences.push.browserSettings')}
        </CardTitle>
        <CardDescription>
          {t('preferences.push.browserDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('preferences.push.status')}
              </span>
              {getPermissionBadge()}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {t('preferences.push.subscription')}
              </span>
              {getSubscriptionBadge()}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Browser Support:</span>
              <span className="ml-2 text-green-600">✓ Supported</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Service Worker:</span>
              <span className="ml-2 text-green-600">✓ Ready</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Permission Request */}
        {permission === 'default' && (
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              To receive push notifications, you need to grant permission in
              your browser.
            </AlertDescription>
          </Alert>
        )}

        {/* Denied Permission Help */}
        {permission === 'denied' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {t('preferences.push.blocked')}
              <br />
              {t('preferences.push.blockedStep1')}
              <br />
              {t('preferences.push.blockedStep2')}
              <br />
              {t('preferences.push.blockedStep3')}
            </AlertDescription>
          </Alert>
        )}

        {/* Preferences Disabled Info */}
        {!enabled && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {t('preferences.push.disabledInfo')}
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {permission === 'default' && (
            <Button
              onClick={requestPermission}
              disabled={isLoading}
              variant="default"
              className="flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Request Permission
            </Button>
          )}

          {permission === 'granted' && enabled && (
            <>
              {!isSubscribed ? (
                <Button
                  onClick={subscribe}
                  disabled={isLoading}
                  variant="default"
                  className="flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  {isLoading
                    ? 'Subscribing...'
                    : t('preferences.push.subscribe')}
                </Button>
              ) : (
                <Button
                  onClick={unsubscribe}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <BellOff className="w-4 h-4" />
                  {isLoading
                    ? 'Unsubscribing...'
                    : t('preferences.push.unsubscribe')}
                </Button>
              )}

              {isSubscribed && (
                <Button
                  onClick={testNotification}
                  disabled={isLoading}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <TestTube className="w-4 h-4" />
                  {isLoading
                    ? 'Sending...'
                    : t('preferences.push.testNotification')}
                </Button>
              )}
            </>
          )}

          {permission === 'granted' && (
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => {
                // Open browser notification settings
                if ('Notification' in window) {
                  // This will prompt the user to check browser settings
                  alert(
                    'To manage detailed notification settings, please check your browser settings under Privacy & Security → Notifications.',
                  );
                }
              }}
            >
              <Settings className="w-4 h-4" />
              Browser Settings
            </Button>
          )}
        </div>

        {/* Additional Information */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Note:</strong> Push notifications require an active internet
            connection and work even when this tab is not open.
          </p>
          <p>
            You can manage notification permissions anytime through your browser
            settings or by clicking the lock icon in the address bar.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PushNotificationSettings;
