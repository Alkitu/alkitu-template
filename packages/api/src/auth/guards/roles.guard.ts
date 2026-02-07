/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole as PrismaUserRole } from '@prisma/client';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';
import { hasRole } from '@alkitu/shared/rbac/role-hierarchy';

/**
 * NestJS Guard for Role-Based Access Control
 *
 * Uses role hierarchy system where:
 * - ADMIN inherits all roles (ADMIN, EMPLOYEE, CLIENT, LEAD)
 * - EMPLOYEE inherits CLIENT permissions
 * - LEAD inherits CLIENT permissions
 *
 * @example
 * ```typescript
 * @Controller('users')
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * export class UsersController {
 *   @Get()
 *   @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
 *   findAll() { ... }
 * }
 * ```
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<PrismaUserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user || !user.role) {
      return false;
    }

    // Convert Prisma enum to shared enum for hierarchy checking
    const userRole = user.role as unknown as UserRole;
    const sharedRequiredRoles = requiredRoles.map(
      (role) => role as unknown as UserRole,
    );

    // Use hierarchy-aware role checking
    return hasRole(userRole, sharedRequiredRoles);
  }
}
