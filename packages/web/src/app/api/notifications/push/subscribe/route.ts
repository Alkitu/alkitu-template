import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

interface SubscribeRequest {
  userId: string;
  subscription: PushSubscriptionData;
}

/**
 * Detect device type from user agent string
 */
function detectDeviceType(userAgent: string | null): string | undefined {
  if (!userAgent) return undefined;

  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export async function POST(request: NextRequest) {
  try {
    const body: SubscribeRequest = await request.json();
    const { userId, subscription } = body;

    if (!userId || !subscription) {
      return NextResponse.json(
        { error: 'Missing userId or subscription data' },
        { status: 400 },
      );
    }

    // Validate subscription data
    if (
      !subscription.endpoint ||
      !subscription.keys?.p256dh ||
      !subscription.keys?.auth
    ) {
      return NextResponse.json(
        { error: 'Invalid subscription data' },
        { status: 400 },
      );
    }

    // Get user agent for device type detection
    const userAgent = request.headers.get('user-agent');
    const deviceType = detectDeviceType(userAgent);

    // Upsert subscription in database
    const pushSubscription = await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        active: true,
        updatedAt: new Date(),
      },
      create: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: userAgent || undefined,
        deviceType,
        active: true,
      },
    });

    console.log(
      `Push subscription saved for user ${userId}:`,
      subscription.endpoint,
    );

    // Count active subscriptions for user
    const subscriptionCount = await prisma.pushSubscription.count({
      where: { userId, active: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Push subscription saved successfully',
        subscriptionCount,
        subscription: {
          id: pushSubscription.id,
          endpoint: pushSubscription.endpoint,
          deviceType: pushSubscription.deviceType,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error saving push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save push subscription' },
      { status: 500 },
    );
  }
}

// Get subscriptions for a user (for admin/debugging purposes)
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 },
      );
    }

    // Fetch active subscriptions from database
    const userSubscriptions = await prisma.pushSubscription.findMany({
      where: { userId, active: true },
      select: {
        id: true,
        endpoint: true,
        deviceType: true,
        userAgent: true,
        createdAt: true,
        updatedAt: true,
        // Don't return the actual keys for security
      },
    });

    return NextResponse.json({
      userId,
      subscriptions: userSubscriptions.map((sub) => ({
        id: sub.id,
        endpoint: sub.endpoint,
        deviceType: sub.deviceType,
        userAgent: sub.userAgent,
        createdAt: sub.createdAt,
        updatedAt: sub.updatedAt,
        hasKeys: true, // If it exists in DB, it has keys
      })),
      count: userSubscriptions.length,
    });
  } catch (error) {
    console.error('Error getting push subscriptions:', error);
    return NextResponse.json(
      { error: 'Failed to get push subscriptions' },
      { status: 500 },
    );
  }
}
