// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - User Domain Events Only
// packages/api/src/users/interfaces/user-events.interface.ts

import { User } from '@prisma/client';

export interface IUserEvents {
  // User Domain Events - Single Responsibility
  publishUserCreated(user: User): Promise<void>;
  publishUserUpdated(user: User, previousData?: Partial<User>): Promise<void>;
  publishUserDeleted(userId: string, userData?: Partial<User>): Promise<void>;
  publishUserPasswordChanged(userId: string): Promise<void>;
  publishUserEmailVerified(userId: string): Promise<void>;
  publishUserLoggedIn(userId: string): Promise<void>;
  publishUserRoleChanged(
    userId: string,
    oldRole: string,
    newRole: string,
  ): Promise<void>;
  publishUserBulkOperation(
    operation: string,
    userIds: string[],
    metadata?: any,
  ): Promise<void>;
}

// Event Data Types
export interface UserEvent {
  type: UserEventType;
  userId: string;
  data: any;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export enum UserEventType {
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  PASSWORD_CHANGED = 'user.password.changed',
  EMAIL_VERIFIED = 'user.email.verified',
  USER_LOGGED_IN = 'user.logged.in',
  ROLE_CHANGED = 'user.role.changed',
  BULK_OPERATION = 'user.bulk.operation',
}

export interface UserCreatedEvent extends UserEvent {
  type: UserEventType.USER_CREATED;
  data: {
    user: User;
    welcomeEmailSent?: boolean;
  };
}

export interface UserUpdatedEvent extends UserEvent {
  type: UserEventType.USER_UPDATED;
  data: {
    user: User;
    previousData: Partial<User>;
    changedFields: string[];
  };
}

export interface UserDeletedEvent extends UserEvent {
  type: UserEventType.USER_DELETED;
  data: {
    deletedUserId: string;
    userData?: Partial<User>;
    cascade?: boolean;
  };
}
