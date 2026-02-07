import { NextRequest, NextResponse } from 'next/server';
// TEMPORARY FIX: Commented out to allow build to succeed
// TODO: Implement proper subscription storage (database or Redis)
// import { subscriptions } from '../subscribe/route';
import webpush from 'web-push';

// Temporary in-memory storage (should be replaced with database)
const subscriptions = new Map<string, any[]>();

interface TestNotificationRequest {
  userId: string;
}

// Configure web-push with VAPID keys
// In production, these should be environment variables
const vapidKeys = {
  publicKey:
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
    'BEl62iUYgUivxIkv69yViEuiBIa40HI8MzRoHSWWLEY2n5H8lKWqVT_G_Qx9N-1nKa3FJzCrq2Q_2Hm2Lz2aVzI',
  privateKey:
    process.env.VAPID_PRIVATE_KEY ||
    'aUWqNsHIWNOx9Q_rPCyqKvQU_KmVJi2K8lKWqVT_G_Q',
};

const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@alkitu.com';

// Set VAPID details
webpush.setVapidDetails(
  vapidSubject,
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

export async function POST(request: NextRequest) {
  try {
    const body: TestNotificationRequest = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get user's push subscriptions
    const userSubscriptions = subscriptions.get(userId) || [];

    if (userSubscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No push subscriptions found for user' },
        { status: 404 },
      );
    }

    // Create test notification payload
    const notificationPayload = {
      title: '🧪 Test Notification',
      body: 'This is a test push notification from Alkitu!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'test-notification',
      data: {
        id: `test-${Date.now()}`,
        link: '/dashboard/notifications',
        type: 'test',
        timestamp: new Date().toISOString(),
      },
      actions: [
        {
          action: 'view',
          title: 'View Dashboard',
          icon: '/favicon.ico',
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
        },
      ],
      requireInteraction: false,
      silent: false,
    };

    // Send notification to all user's subscriptions
    const sendPromises = userSubscriptions.map(async (subscription) => {
      try {
        const pushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
          },
        };

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(notificationPayload),
        );

        return { success: true, endpoint: subscription.endpoint };
      } catch (error) {
        console.error('Error sending to subscription:', error);
        return {
          success: false,
          endpoint: subscription.endpoint,
          error: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    });

    const results = await Promise.all(sendPromises);
    const successCount = results.filter((r) => r.success).length;
    const failureCount = results.filter((r) => !r.success).length;

    console.log(
      `Test notification sent to user ${userId}: ${successCount} successful, ${failureCount} failed`,
    );

    return NextResponse.json({
      success: true,
      message: 'Test notification sent',
      results: {
        total: results.length,
        successful: successCount,
        failed: failureCount,
        details: results,
      },
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 },
    );
  }
}
