/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true; // No roles specified, allow access
    }

    const { user } = context.switchToHttp().getRequest();

    console.log('RolesGuard - User object:', user);
    console.log('RolesGuard - User role:', user?.role);

    if (!user || !user.role) {
      console.log('RolesGuard - User or role is undefined, denying access');
      return false;
    }

    return requiredRoles.some((role) => user.role === role);
  }
}
