import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface UnsubscribeRequest {
  userId?: string;
  endpoint: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: UnsubscribeRequest = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return NextResponse.json(
        { error: 'Missing endpoint' },
        { status: 400 },
      );
    }

    // Mark subscription as inactive instead of deleting
    // This preserves audit trail and allows for reactivation
    const result = await prisma.pushSubscription.updateMany({
      where: { endpoint },
      data: { active: false },
    });

    const removedCount = result.count;

    // Count remaining active subscriptions for user if userId provided
    let remainingCount = 0;
    if (body.userId) {
      remainingCount = await prisma.pushSubscription.count({
        where: { userId: body.userId, active: true },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Push subscription removed successfully',
        removedCount,
        remainingCount,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to remove push subscription' },
      { status: 500 },
    );
  }
}
