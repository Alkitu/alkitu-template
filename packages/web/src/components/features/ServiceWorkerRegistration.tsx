'use client';

import { useEffect } from 'react';

/**
 * Service Worker Registration Component
 * Automatically registers the service worker for push notifications and PWA support
 * ALI-120: Auto-registration for Web Push Notifications
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log(
            'Service Worker registered successfully:',
            registration.scope,
          );

          // Check for updates periodically
          setInterval(
            () => {
              registration.update();
            },
            60 * 60 * 1000,
          ); // Check every hour
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    } else if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'development'
    ) {
      console.log(
        'Service Worker registration skipped in development mode for better debugging experience',
      );
      console.log('Run in production mode to test service worker functionality');
    }
  }, []);

  return null; // This component doesn't render anything
}
