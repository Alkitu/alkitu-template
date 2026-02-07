import { UserRole } from '../enums/user-role.enum';

/**
 * Role Hierarchy System
 *
 * Defines which permissions each role inherits.
 *
 * - ADMIN: Full platform access, inherits all roles
 * - EMPLOYEE: Request management, inherits CLIENT permissions
 * - CLIENT: Own requests only
 * - LEAD: Limited admin capabilities, inherits CLIENT permissions
 *
 * @example
 * ```typescript
 * // Check if ADMIN can access EMPLOYEE routes
 * hasRole(UserRole.ADMIN, [UserRole.EMPLOYEE]) // true
 *
 * // Check if CLIENT can access ADMIN routes
 * hasRole(UserRole.CLIENT, [UserRole.ADMIN]) // false
 * ```
 */
export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  [UserRole.ADMIN]: [
    UserRole.ADMIN,
    UserRole.EMPLOYEE,
    UserRole.CLIENT,
    UserRole.LEAD,
  ],
  [UserRole.EMPLOYEE]: [UserRole.EMPLOYEE, UserRole.CLIENT],
  [UserRole.CLIENT]: [UserRole.CLIENT],
  [UserRole.LEAD]: [UserRole.LEAD, UserRole.CLIENT],
};

/**
 * Check if a user role has permission (considering hierarchy)
 *
 * @param userRole - The role of the current user
 * @param requiredRoles - Array of roles that are allowed
 * @returns true if user has permission, false otherwise
 *
 * @example
 * ```typescript
 * // ADMIN accessing EMPLOYEE route
 * hasRole(UserRole.ADMIN, [UserRole.EMPLOYEE]) // true
 *
 * // EMPLOYEE accessing ADMIN route
 * hasRole(UserRole.EMPLOYEE, [UserRole.ADMIN]) // false
 *
 * // Multiple allowed roles
 * hasRole(UserRole.CLIENT, [UserRole.ADMIN, UserRole.CLIENT]) // true
 * ```
 */
export function hasRole(userRole: UserRole, requiredRoles: UserRole[]): boolean {
  const userPermissions = ROLE_HIERARCHY[userRole] || [userRole];
  return requiredRoles.some((required) => userPermissions.includes(required));
}

/**
 * Get all roles that a user can access (including inherited roles)
 *
 * @param userRole - The role of the current user
 * @returns Array of all accessible roles
 *
 * @example
 * ```typescript
 * getAccessibleRoles(UserRole.ADMIN)
 * // Returns: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD]
 *
 * getAccessibleRoles(UserRole.CLIENT)
 * // Returns: [UserRole.CLIENT]
 * ```
 */
export function getAccessibleRoles(userRole: UserRole): UserRole[] {
  return ROLE_HIERARCHY[userRole] || [userRole];
}

/**
 * Check if a role is higher in hierarchy than another role
 *
 * @param userRole - The role to check
 * @param targetRole - The role to compare against
 * @returns true if userRole is higher or equal to targetRole
 *
 * @example
 * ```typescript
 * isRoleHigherOrEqual(UserRole.ADMIN, UserRole.EMPLOYEE) // true
 * isRoleHigherOrEqual(UserRole.CLIENT, UserRole.ADMIN) // false
 * ```
 */
export function isRoleHigherOrEqual(userRole: UserRole, targetRole: UserRole): boolean {
  const userPermissions = ROLE_HIERARCHY[userRole] || [userRole];
  return userPermissions.includes(targetRole);
}
