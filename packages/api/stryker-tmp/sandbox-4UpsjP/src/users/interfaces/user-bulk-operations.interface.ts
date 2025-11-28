// @ts-nocheck
// ✅ SRP COMPLIANT: Single Responsibility - Bulk Operations Only
// packages/api/src/users/interfaces/user-bulk-operations.interface.ts

import {
  BulkDeleteUsersDto,
  BulkUpdateRoleDto,
  BulkUpdateStatusDto,
} from '../dto/bulk-users.dto';
// UserRole and UserStatus types are available but not directly used in interfaces
// They are used in the imported DTOs

export interface IUserBulkOperations {
  // Bulk Operations - Single Responsibility
  bulkDeleteUsers(
    bulkDeleteDto: BulkDeleteUsersDto,
  ): Promise<BulkOperationResult>;
  bulkUpdateRole(
    bulkUpdateRoleDto: BulkUpdateRoleDto,
  ): Promise<BulkOperationResult>;
  bulkUpdateStatus(
    bulkUpdateStatusDto: BulkUpdateStatusDto,
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
