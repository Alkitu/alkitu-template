import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import webpush from 'web-push';

interface TestNotificationRequest {
  userId: string;
}

// Configure web-push with VAPID keys from environment
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@alkitu.com';

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
}

export async function POST(request: NextRequest) {
  try {
    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json(
        { error: 'VAPID keys not configured. Set NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.' },
        { status: 503 },
      );
    }

    const body: TestNotificationRequest = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }

    // Get user's active push subscriptions from database
    const userSubscriptions = await prisma.pushSubscription.findMany({
      where: { userId, active: true },
    });

    if (userSubscriptions.length === 0) {
      return NextResponse.json(
        { error: 'No push subscriptions found for user' },
        { status: 404 },
      );
    }

    // Create test notification payload
    const notificationPayload = {
      title: 'Test Notification',
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
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        };

        await webpush.sendNotification(
          pushSubscription,
          JSON.stringify(notificationPayload),
        );

        return { success: true, endpoint: subscription.endpoint };
      } catch (error) {
        // Deactivate expired subscriptions (410 Gone)
        if (error instanceof webpush.WebPushError && error.statusCode === 410) {
          await prisma.pushSubscription.update({
            where: { id: subscription.id },
            data: { active: false },
          });
        }
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
  } catch {
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 },
    );
  }
}
