import { UserRole } from '@alkitu/shared/enums/user-role.enum';

type ProtectedRoute = {
  path: string;
  roles: UserRole[];
};

export const PROTECTED_ROUTES: ProtectedRoute[] = [
  // Shared routes (all authenticated users)
  {
    path: '/profile',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD],
  },
  {
    path: '/locations',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD],
  },
  {
    path: '/requests',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT],
  },
  {
    path: '/requests/new',
    roles: [UserRole.CLIENT], // Only clients can create requests
  },
  {
    path: '/requests/[id]',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT],
  },
  // Client routes
  {
    path: '/client/dashboard',
    roles: [UserRole.CLIENT],
  },
  {
    path: '/client/requests/new',
    roles: [UserRole.CLIENT],
  },
  {
    path: '/client/requests',
    roles: [UserRole.CLIENT],
  },
  {
    path: '/client/notifications',
    roles: [UserRole.CLIENT],
  },
  {
    path: '/client/profile',
    roles: [UserRole.CLIENT],
  },
  {
    path: '/client/onboarding',
    roles: [UserRole.CLIENT],
  },
  {
    path: '/client',
    roles: [UserRole.CLIENT],
  },
  // Employee routes
  {
    path: '/employee/dashboard',
    roles: [UserRole.EMPLOYEE],
  },
  {
    path: '/employee/requests',
    roles: [UserRole.EMPLOYEE],
  },
  {
    path: '/employee/notifications',
    roles: [UserRole.EMPLOYEE],
  },
  {
    path: '/employee',
    roles: [UserRole.EMPLOYEE],
  },
  // Admin routes
  {
    path: '/admin/users',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/users/create',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/companies',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/companies/create',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/chat',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/notifications',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/messaging',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/email-management',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/security',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/data-protection',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/billing',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/settings',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/requests',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/email-templates',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin/dashboard',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/admin',
    roles: [UserRole.ADMIN],
  },
  // Legacy dashboard routes (if still needed)
  {
    path: '/dashboard/users',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/dashboard/users/create',
    roles: [UserRole.ADMIN],
  },
  {
    path: '/dashboard',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD],
  },
  {
    path: '/dashboard/profile',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD],
  },
  {
    path: '/dashboard/settings',
    roles: [UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD],
  },
];
