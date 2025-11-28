// @ts-nocheck
// 
import { IBaseService, ServiceResult } from '../../common/interfaces/base-service.interface';

/**
 * User Management Interface - ISP Compliant
 * 
 * This interface follows the Interface Segregation Principle by:
 * - Focusing solely on user CRUD operations
 * - Not mixing unrelated concerns like profiles or subscriptions
 * - Providing a clear, focused contract for user management clients
 * - Being easily mockable and testable
 */

export interface UserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin' | 'moderator';
  isActive?: boolean;
  metadata?: Record<string, any>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export interface UserFilters {
  role?: 'user' | 'admin' | 'moderator';
  isActive?: boolean;
  createdAfter?: Date;
  createdBefore?: Date;
  search?: string;
}

export interface UserListResult {
  users: User[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * User Management Service Interface
 * 
 * ISP Contract:
 * - Only contains methods related to basic user CRUD operations
 * - Does not include profile, subscription, or analytics methods
 * - Clients that only need user management don't depend on unused methods
 * - Easy to implement, test, and mock
 */
export interface IUserManagementService extends IBaseService {
  /**
   * Create a new user
   * 
   * ISP Compliance:
   * - Single responsibility: user creation only
   * - No side effects like profile creation or subscription setup
   * - Clean, focused method signature
   */
  createUser(userData: UserData): Promise<ServiceResult<User>>;

  /**
   * Update user basic information
   * 
   * ISP Compliance:
   * - Only updates basic user fields (email, name, role, status)
   * - Does not handle profile or subscription updates
   * - Focused on core user entity
   */
  updateUser(userId: string, updates: Partial<UserData>): Promise<ServiceResult<User>>;

  /**
   * Delete a user
   * 
   * ISP Compliance:
   * - Simple user deletion operation
   * - Does not handle related data cleanup (profiles, subscriptions)
   * - Focused single responsibility
   */
  deleteUser(userId: string): Promise<ServiceResult<void>>;

  /**
   * Get user by ID
   * 
   * ISP Compliance:
   * - Simple user retrieval
   * - Returns only core user data
   * - No profile or subscription data included
   */
  getUserById(userId: string): Promise<ServiceResult<User>>;

  /**
   * Get user by email
   * 
   * ISP Compliance:
   * - Focused on user lookup by email
   * - Common operation for authentication flows
   * - Returns only core user data
   */
  getUserByEmail(email: string): Promise<ServiceResult<User>>;

  /**
   * List users with filtering and pagination
   * 
   * ISP Compliance:
   * - Focused on user listing functionality
   * - Includes basic filtering and pagination
   * - Does not include complex analytics or reporting
   */
  listUsers(filters?: UserFilters, page?: number, limit?: number): Promise<ServiceResult<UserListResult>>;

  /**
   * Check if user exists
   * 
   * ISP Compliance:
   * - Simple existence check
   * - Useful for validation scenarios
   * - Focused single-purpose method
   */
  userExists(userId: string): Promise<ServiceResult<boolean>>;

  /**
   * Check if email is available
   * 
   * ISP Compliance:
   * - Focused on email availability checking
   * - Useful for registration and update validation
   * - Single-purpose method
   */
  isEmailAvailable(email: string): Promise<ServiceResult<boolean>>;
}