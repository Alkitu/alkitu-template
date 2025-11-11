import { NextRequest, NextResponse } from 'next/server';

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

// In a real application, you would store these in a database
// For now, we'll use a simple in-memory store
const subscriptions = new Map<string, PushSubscriptionData[]>();

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

    // Get existing subscriptions for user
    const userSubscriptions = subscriptions.get(userId) || [];

    // Check if subscription already exists
    const existingIndex = userSubscriptions.findIndex(
      (sub) => sub.endpoint === subscription.endpoint,
    );

    if (existingIndex >= 0) {
      // Update existing subscription
      userSubscriptions[existingIndex] = subscription;
    } else {
      // Add new subscription
      userSubscriptions.push(subscription);
    }

    // Store updated subscriptions
    subscriptions.set(userId, userSubscriptions);

    console.log(
      `Push subscription saved for user ${userId}:`,
      subscription.endpoint,
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Push subscription saved successfully',
        subscriptionCount: userSubscriptions.length,
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

    const userSubscriptions = subscriptions.get(userId) || [];

    return NextResponse.json({
      userId,
      subscriptions: userSubscriptions.map((sub) => ({
        endpoint: sub.endpoint,
        // Don't return the actual keys for security
        hasKeys: !!(sub.keys?.p256dh && sub.keys?.auth),
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

// Export the subscriptions for use in other API routes
export { subscriptions };
