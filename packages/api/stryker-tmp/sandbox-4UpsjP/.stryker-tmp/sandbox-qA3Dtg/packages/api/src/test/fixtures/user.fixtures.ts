// @ts-nocheck
// 
import { User, UserRole, UserStatus } from '@prisma/client';

export const mockUser: Partial<User> = {
  id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  name: 'Test',
  lastName: 'User',
  password: '$2a$10$XcWcgHVNnqGfMhUd1NQ/nOeX1T3xNQfYeZ5DlKzQhHsGf8rP3Kv1C', // hashed "password123"
  contactNumber: '+1234567890',
  role: UserRole.CLIENT,
  status: UserStatus.ACTIVE,
  terms: true,
  isTwoFactorEnabled: false,
  emailVerified: null,
  image: '',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
  lastLogin: new Date('2024-01-01'),
  groupIds: [],
  tagIds: [],
  resourceIds: [],
};

export const mockAdminUser: Partial<User> = {
  ...mockUser,
  id: '507f1f77bcf86cd799439012',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
};

export const createUserFixture = (
  overrides: Partial<User> = {},
): Partial<User> => ({
  ...mockUser,
  ...overrides,
});

export const createUsersArray = (count: number): Partial<User>[] => {
  return Array.from({ length: count }, (_, index) =>
    createUserFixture({
      id: `507f1f77bcf86cd79943901${index}`,
      email: `user${index}@example.com`,
      name: `User${index}`,
    }),
  );
};
