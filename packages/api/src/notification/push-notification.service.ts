import { Injectable, Logger } from '@nestjs/common';
import * as webPush from 'web-push';
import { PrismaService } from '../prisma.service';

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: any;
  actions?: Array<{ action: string; title: string }>;
}

export interface PushResult {
  sent: number;
  failed: number;
}

/**
 * ALI-120: Push Notification Service
 * Handles sending Web Push notifications to users via registered subscriptions
 */
@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  constructor(private readonly prisma: PrismaService) {
    // Configure VAPID details for Web Push
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@alkitu.com';
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

    if (!vapidPublicKey || !vapidPrivateKey) {
      this.logger.warn(
        'VAPID keys not configured. Push notifications will not work.',
      );
      this.logger.warn('Generate keys with: npx web-push generate-vapid-keys');
    } else {
      webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
      this.logger.log('Push notification service initialized with VAPID keys');
    }
  }

  /**
   * Send push notification to a specific user
   * Sends to all active subscriptions for the user
   *
   * @param userId - User ID to send notification to
   * @param payload - Notification payload
   * @returns Object with sent and failed counts
   */
  async sendToUser(
    userId: string,
    payload: PushNotificationPayload,
  ): Promise<PushResult> {
    // Fetch all active subscriptions for user
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId, active: true },
    });

    if (subscriptions.length === 0) {
      this.logger.warn(`No active push subscriptions for user ${userId}`);
      return { sent: 0, failed: 0 };
    }

    // Build full notification payload
    const notificationPayload = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      badge: payload.badge || '/favicon.ico',
      data: payload.data || {},
      actions: payload.actions || [],
      vibrate: [200, 100, 200],
      requireInteraction: false,
      tag: payload.data?.notificationType || 'default',
    });

    let sent = 0;
    let failed = 0;

    // Send to all subscriptions
    for (const sub of subscriptions) {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          notificationPayload,
        );
        sent++;
        this.logger.debug(
          `Push sent to device ${sub.deviceType || 'unknown'} for user ${userId}`,
        );
      } catch (error: any) {
        failed++;

        // Handle expired/invalid subscriptions (410 Gone)
        if (error.statusCode === 410) {
          await this.prisma.pushSubscription.update({
            where: { id: sub.id },
            data: { active: false },
          });
          this.logger.warn(
            `Deactivated expired subscription: ${sub.endpoint.substring(0, 50)}...`,
          );
        } else {
          this.logger.error(
            `Failed to send push to ${sub.endpoint.substring(0, 50)}...:`,
            error.message,
          );
        }
      }
    }

    this.logger.log(
      `Push notification sent to user ${userId}: ${sent} sent, ${failed} failed`,
    );

    return { sent, failed };
  }

  /**
   * Send push notification to multiple users
   *
   * @param userIds - Array of user IDs
   * @param payload - Notification payload
   * @returns Object with total sent and failed counts
   */
  async sendToUsers(
    userIds: string[],
    payload: PushNotificationPayload,
  ): Promise<PushResult> {
    let totalSent = 0;
    let totalFailed = 0;

    for (const userId of userIds) {
      const result = await this.sendToUser(userId, payload);
      totalSent += result.sent;
      totalFailed += result.failed;
    }

    this.logger.log(
      `Batch push sent to ${userIds.length} users: ${totalSent} sent, ${totalFailed} failed`,
    );

    return { sent: totalSent, failed: totalFailed };
  }

  /**
   * Check if a user has any active push subscriptions
   *
   * @param userId - User ID to check
   * @returns True if user has at least one active subscription
   */
  async hasActiveSubscriptions(userId: string): Promise<boolean> {
    const count = await this.prisma.pushSubscription.count({
      where: { userId, active: true },
    });
    return count > 0;
  }

  /**
   * Get count of active subscriptions for a user
   *
   * @param userId - User ID to check
   * @returns Number of active subscriptions
   */
  async getActiveSubscriptionCount(userId: string): Promise<number> {
    return await this.prisma.pushSubscription.count({
      where: { userId, active: true },
    });
  }

  /**
   * Deactivate all subscriptions for a user
   * Useful for logout or user deletion
   *
   * @param userId - User ID
   */
  async deactivateUserSubscriptions(userId: string): Promise<number> {
    const result = await this.prisma.pushSubscription.updateMany({
      where: { userId, active: true },
      data: { active: false },
    });

    this.logger.log(
      `Deactivated ${result.count} subscriptions for user ${userId}`,
    );

    return result.count;
  }
}
