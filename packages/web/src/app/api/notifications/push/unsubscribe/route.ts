import { NextRequest, NextResponse } from 'next/server';
import { subscriptions } from '../subscribe/route';

interface UnsubscribeRequest {
  userId: string;
  endpoint: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UnsubscribeRequest = await request.json();
    const { userId, endpoint } = body;

    if (!userId || !endpoint) {
      return NextResponse.json(
        { error: 'Missing userId or endpoint' },
        { status: 400 },
      );
    }

    // Get existing subscriptions for user
    const userSubscriptions = subscriptions.get(userId) || [];

    // Find and remove the subscription
    const updatedSubscriptions = userSubscriptions.filter(
      (sub) => sub.endpoint !== endpoint,
    );

    // Update stored subscriptions
    if (updatedSubscriptions.length === 0) {
      subscriptions.delete(userId);
    } else {
      subscriptions.set(userId, updatedSubscriptions);
    }

    const removedCount = userSubscriptions.length - updatedSubscriptions.length;

    console.log(`Push subscription removed for user ${userId}:`, endpoint);

    return NextResponse.json(
      {
        success: true,
        message: 'Push subscription removed successfully',
        removedCount,
        remainingCount: updatedSubscriptions.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error removing push subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove push subscription' },
      { status: 500 },
    );
  }
}
