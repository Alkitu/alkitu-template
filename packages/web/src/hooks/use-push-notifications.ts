'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/trpc-error-handler';

interface UsePushNotificationsProps {
  userId: string;
  enabled?: boolean;
  vapidPublicKey?: string;
}

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function usePushNotifications({
  userId,
  enabled = true,
  vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
}: UsePushNotificationsProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] =
    useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Check if push notifications are supported
  useEffect(() => {
    const checkSupport = () => {
      const supported =
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window;

      setIsSupported(supported);

      if (supported) {
        setPermission(Notification.permission);
      }
    };

    checkSupport();
  }, []);

  // Register service worker
  const registerServiceWorker = useCallback(async () => {
    if (!isSupported) {
      throw new Error('Push notifications are not supported');
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }, [isSupported]);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported in this browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        toast.success('Push notifications enabled!');
        return true;
      } else if (result === 'denied') {
        setError(
          'Push notifications were denied. Please enable them in your browser settings.',
        );
        toast.error('Push notifications denied');
        return false;
      } else {
        setError('Push notification permission not granted');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setError('Failed to request notification permission');
      return false;
    }
  }, [isSupported]);

  // Save subscription to server
  const saveSubscriptionToServer = useCallback(
    async (subscription: PushSubscription) => {
      const subscriptionData: PushSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')),
          auth: arrayBufferToBase64(subscription.getKey('auth')),
        },
      };

      const response = await fetch('/api/notifications/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscription: subscriptionData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save push subscription to server');
      }
    },
    [userId],
  );

  // Remove subscription from server
  const removeSubscriptionFromServer = useCallback(
    async (subscription: PushSubscription) => {
      const response = await fetch('/api/notifications/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          endpoint: subscription.endpoint,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove push subscription from server');
      }
    },
    [userId],
  );

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!enabled || !userId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Request permission first
      const permissionGranted = await requestPermission();
      if (!permissionGranted) {
        return;
      }

      // Register service worker
      const registration = await registerServiceWorker();

      // Check if already subscribed
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setSubscription(existingSubscription);
        setIsSubscribed(true);
        await saveSubscriptionToServer(existingSubscription);
        return;
      }

      // Create new subscription
      if (!vapidPublicKey) {
        throw new Error('VAPID public key is not configured');
      }

      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
      });

      setSubscription(newSubscription);
      setIsSubscribed(true);

      // Save subscription to server
      await saveSubscriptionToServer(newSubscription);

      toast.success('Successfully subscribed to push notifications!');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to subscribe to push notifications',
      );
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    enabled,
    userId,
    vapidPublicKey,
    requestPermission,
    registerServiceWorker,
    saveSubscriptionToServer,
  ]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!subscription) return;

    setIsLoading(true);
    setError(null);

    try {
      // Unsubscribe from browser
      await subscription.unsubscribe();

      // Remove subscription from server
      await removeSubscriptionFromServer(subscription);

      setSubscription(null);
      setIsSubscribed(false);

      toast.success('Successfully unsubscribed from push notifications');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to unsubscribe',
      );
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  }, [subscription, removeSubscriptionFromServer]);

  // Test push notification
  const testNotification = useCallback(async () => {
    if (!isSubscribed) {
      toast.error('Please subscribe to push notifications first');
      return;
    }

    try {
      const response = await fetch('/api/notifications/push/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      toast.success('Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      handleApiError(error);
    }
  }, [isSubscribed, userId]);

  // Check subscription status on mount
  useEffect(() => {
    const checkSubscription = async () => {
      if (!isSupported || !enabled) return;

      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          const existingSubscription =
            await registration.pushManager.getSubscription();
          if (existingSubscription) {
            setSubscription(existingSubscription);
            setIsSubscribed(true);
          }
        }
      } catch (error) {
        console.error('Error checking subscription status:', error);
      }
    };

    checkSubscription();
  }, [isSupported, enabled]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscription,
    error,
    subscribe,
    unsubscribe,
    testNotification,
    requestPermission,
  };
}

// Utility functions
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function arrayBufferToBase64(buffer: ArrayBuffer | null): string {
  if (!buffer) return '';

  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}
