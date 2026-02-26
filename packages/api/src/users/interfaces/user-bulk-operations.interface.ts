// ✅ SRP COMPLIANT: Single Responsibility - Bulk Operations Only
// packages/api/src/users/interfaces/user-bulk-operations.interface.ts

import type {
  BulkDeleteUsersInput,
  BulkUpdateRoleInput,
  BulkUpdateStatusInput,
} from '../../trpc/schemas/user.schemas';

export interface IUserBulkOperations {
  // Bulk Operations - Single Responsibility
  bulkDeleteUsers(
    bulkDeleteDto: BulkDeleteUsersInput,
  ): Promise<BulkOperationResult>;
  bulkUpdateRole(
    bulkUpdateRoleDto: BulkUpdateRoleInput,
  ): Promise<BulkOperationResult>;
  bulkUpdateStatus(
    bulkUpdateStatusDto: BulkUpdateStatusInput,
  ): Promise<BulkOperationResult>;
  bulkUpdateField(
    userIds: string[],
    field: string,
    value: any,
  ): Promise<BulkOperationResult>;

  // Validation for bulk operations
  validateUserIds(userIds: string[]): Promise<string[]>; // Returns valid user IDs
  validateBulkOperationPermissions(
    userIds: string[],
    operation: string,
  ): Promise<boolean>;
}

// Bulk Operations Response Types
export interface BulkOperationResult {
  success: boolean;
  message: string;
  affectedCount: number;
  errors?: string[];
  validUserIds?: string[];
  invalidUserIds?: string[];
}

export interface BulkUpdateRequest {
  userIds: string[];
  updates: Record<string, any>;
  validatePermissions?: boolean;
}

export interface BulkDeleteRequest {
  userIds: string[];
  force?: boolean; // Skip certain validations
  cascade?: boolean; // Delete related data
}
