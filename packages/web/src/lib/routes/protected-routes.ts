import { UserRole } from '@alkitu/shared/enums/user-role.enum';

type ProtectedRoute = {
  path: string;
  roles: UserRole[];
};

export const PROTECTED_ROUTES: ProtectedRoute[] = [
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
