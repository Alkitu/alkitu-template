// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - User Domain Events Only
// packages/api/src/users/services/user-events.service.ts

import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import {
  IUserEvents,
  UserEvent,
  UserEventType,
  UserCreatedEvent,
  UserUpdatedEvent,
  UserDeletedEvent,
} from '../interfaces/user-events.interface';

@Injectable()
export class UserEventsService implements IUserEvents {
  // In a real implementation, you would inject an event bus or message queue
  // For now, we'll use console logging and could extend to integrate with
  // services like Redis, RabbitMQ, or AWS EventBridge

  async publishUserCreated(user: User): Promise<void> {
    const event: UserCreatedEvent = {
      type: UserEventType.USER_CREATED,
      userId: user.id,
      data: {
        user,
        welcomeEmailSent: false, // This would be set by the notification service
      },
      timestamp: new Date(),
      metadata: {
        source: 'user-service',
        version: '1.0',
      },
    };

    await this.publishEvent(event);
  }

  async publishUserUpdated(
    user: User,
    previousData?: Partial<User>,
  ): Promise<void> {
    const changedFields = this.getChangedFields(user, previousData);

    const event: UserUpdatedEvent = {
      type: UserEventType.USER_UPDATED,
      userId: user.id,
      data: {
        user,
        previousData: previousData || {},
        changedFields,
      },
      timestamp: new Date(),
      metadata: {
        source: 'user-service',
        version: '1.0',
        changedFieldsCount: changedFields.length,
      },
    };

    await this.publishEvent(event);
  }

  async publishUserDeleted(
    userId: string,
    userData?: Partial<User>,
  ): Promise<void> {
    const event: UserDeletedEvent = {
      type: UserEventType.USER_DELETED,
      userId,
      data: {
        deletedUserId: userId,
        userData,
        cascade: true, // Assuming cascade delete
      },
      timestamp: new Date(),
      metadata: {
        source: 'user-service',
        version: '1.0',
      },
    };

    await this.publishEvent(event);
  }

  async publishUserPasswordChanged(userId: string): Promise<void> {
    const event: UserEvent = {
      type: UserEventType.PASSWORD_CHANGED,
      userId,
      data: {
        securityEvent: true,
        requiresNotification: true,
      },
      timestamp: new Date(),
      metadata: {
        source: 'user-authentication-service',
        version: '1.0',
        securityLevel: 'high',
      },
    };

    await this.publishEvent(event);
  }

  async publishUserEmailVerified(userId: string): Promise<void> {
    const event: UserEvent = {
      type: UserEventType.EMAIL_VERIFIED,
      userId,
      data: {
        verificationCompleted: true,
        accountActivated: true,
      },
      timestamp: new Date(),
      metadata: {
        source: 'user-service',
        version: '1.0',
      },
    };

    await this.publishEvent(event);
  }

  async publishUserLoggedIn(userId: string): Promise<void> {
    const event: UserEvent = {
      type: UserEventType.USER_LOGGED_IN,
      userId,
      data: {
        loginTimestamp: new Date(),
        sessionStarted: true,
      },
      timestamp: new Date(),
      metadata: {
        source: 'user-authentication-service',
        version: '1.0',
      },
    };

    await this.publishEvent(event);
  }

  async publishUserRoleChanged(
    userId: string,
    oldRole: string,
    newRole: string,
  ): Promise<void> {
    const event: UserEvent = {
      type: UserEventType.ROLE_CHANGED,
      userId,
      data: {
        oldRole,
        newRole,
        securityEvent: true,
        requiresAudit: true,
      },
      timestamp: new Date(),
      metadata: {
        source: 'user-service',
        version: '1.0',
        securityLevel: 'high',
      },
    };

    await this.publishEvent(event);
  }

  async publishUserBulkOperation(
    operation: string,
    userIds: string[],
    metadata?: any,
  ): Promise<void> {
    const event: UserEvent = {
      type: UserEventType.BULK_OPERATION,
      userId: 'system', // Bulk operations are system-level
      data: {
        operation,
        userIds,
        affectedCount: userIds.length,
        bulkOperationMetadata: metadata,
      },
      timestamp: new Date(),
      metadata: {
        source: 'user-bulk-service',
        version: '1.0',
        operationType: operation,
      },
    };

    await this.publishEvent(event);
  }

  // Private helper methods
  private async publishEvent(event: UserEvent): Promise<void> {
    // In a real implementation, this would:
    // 1. Serialize the event
    // 2. Publish to message queue (Redis, RabbitMQ, etc.)
    // 3. Handle failures and retries
    // 4. Ensure event ordering if needed

    console.log(`[USER EVENT] ${event.type}:`, {
      userId: event.userId,
      timestamp: event.timestamp,
      data: event.data,
      metadata: event.metadata,
    });

    // Simulate async event publishing
    await new Promise((resolve) => setTimeout(resolve, 10));

    // In production, you might want to:
    // - Store events in an event store
    // - Publish to multiple subscribers
    // - Handle event versioning
    // - Implement event replay capabilities
  }

  private getChangedFields(current: User, previous?: Partial<User>): string[] {
    if (!previous) return [];

    const changedFields: string[] = [];

    // Iterate over the keys of the current user object
    for (const key in current) {
      // Ensure the key exists in previous and the values are different
      if (
        Object.prototype.hasOwnProperty.call(previous, key) &&
        current[key] !== previous[key]
      ) {
        changedFields.push(key);
      }
    }

    return changedFields;
  }
}
