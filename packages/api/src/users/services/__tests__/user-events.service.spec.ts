// ✅ Testing Agent: UserEventsService Simplified Tests
// packages/api/src/users/services/__tests__/user-events.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { UserEventsService } from '../user-events.service';
import { UserRole, UserStatus } from '@prisma/client';

describe('UserEventsService', () => {
  let service: UserEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEventsService],
    }).compile();

    service = module.get<UserEventsService>(UserEventsService);
  });

  describe('publishUserCreated', () => {
    it('should publish user created event successfully', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstname: 'Test User',
        lastname: 'Last',
        phone: '+1234567890',
        company: null,
        address: null,
        profileComplete: false,
        contactPerson: null,
        role: UserRole.CLIENT,
        status: UserStatus.VERIFIED,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        emailVerified: null,
        image: null,
        terms: true,
        isTwoFactorEnabled: false,
        groupIds: [],
        tagIds: [],
        resourceIds: [],
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserCreated(mockUser);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.created:'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle user with minimal data', async () => {
      // Arrange
      const mockUser = {
        id: 'user-minimal',
        email: 'minimal@example.com',
        firstname: null,
        lastname: null,
        phone: null,
        company: null,
        address: null,
        profileComplete: false,
        contactPerson: null,
        role: UserRole.USER,
        status: UserStatus.VERIFIED,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        emailVerified: null,
        image: null,
        terms: true,
        isTwoFactorEnabled: false,
        groupIds: [],
        tagIds: [],
        resourceIds: [],
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserCreated(mockUser);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.created:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('publishUserUpdated', () => {
    it('should publish user updated event successfully', async () => {
      // Arrange
      const currentUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstname: 'Test User',
        lastname: 'Last',
        phone: '+1234567890',
        company: null,
        address: null,
        profileComplete: false,
        contactPerson: null,
        role: UserRole.CLIENT,
        status: UserStatus.VERIFIED,
        password: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null,
        emailVerified: null,
        image: null,
        terms: true,
        isTwoFactorEnabled: false,
        groupIds: [],
        tagIds: [],
        resourceIds: [],
      };

      const previousData = {
        id: 'user-123',
        email: 'old@example.com',
        firstname: 'Old User',
        lastname: 'Old',
        phone: '+0987654321',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserUpdated(currentUser, previousData);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.updated:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('publishUserDeleted', () => {
    it('should publish user deleted event successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const deletedUserData = {
        id: 'user-123',
        email: 'deleted@example.com',
        firstname: 'Deleted User',
        lastname: 'Last',
        phone: '+1234567890',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserDeleted(userId, deletedUserData);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.deleted:'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle deletion without user data', async () => {
      // Arrange
      const userId = 'user-123';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserDeleted(userId);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.deleted:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('publishUserLoggedIn', () => {
    it('should publish user logged in event successfully', async () => {
      // Arrange
      const userId = 'user-123';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserLoggedIn(userId);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.logged.in:'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle empty user ID', async () => {
      // Arrange
      const userId = '';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserLoggedIn(userId);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.logged.in:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('publishUserPasswordChanged', () => {
    it('should publish password changed event successfully', async () => {
      // Arrange
      const userId = 'user-123';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserPasswordChanged(userId);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.password.changed:'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle admin user password change', async () => {
      // Arrange
      const userId = 'admin-123';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserPasswordChanged(userId);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.password.changed:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('publishUserEmailVerified', () => {
    it('should publish email verified event successfully', async () => {
      // Arrange
      const userId = 'user-123';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserEmailVerified(userId);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.email.verified:'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle mobile user email verification', async () => {
      // Arrange
      const userId = 'mobile-user-123';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserEmailVerified(userId);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.email.verified:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('publishUserRoleChanged', () => {
    it('should publish role changed event successfully', async () => {
      // Arrange
      const userId = 'user-123';
      const oldRole = 'CLIENT';
      const newRole = 'ADMIN';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserRoleChanged(userId, oldRole, newRole);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.role.changed:'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle role downgrade', async () => {
      // Arrange
      const userId = 'user-123';
      const oldRole = 'ADMIN';
      const newRole = 'CLIENT';

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserRoleChanged(userId, oldRole, newRole);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.role.changed:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('publishUserBulkOperation', () => {
    it('should publish bulk operation event successfully', async () => {
      // Arrange
      const operation = 'bulk_delete';
      const userIds = ['user-1', 'user-2', 'user-3'];
      const metadata = {
        performedBy: 'admin-123',
        reason: 'cleanup',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserBulkOperation(operation, userIds, metadata);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.bulk.operation:'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle bulk role update operation', async () => {
      // Arrange
      const operation = 'bulk_role_update';
      const userIds = ['user-1', 'user-2'];
      const metadata = {
        performedBy: 'admin-456',
        fromRole: 'USER',
        toRole: 'CLIENT',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserBulkOperation(operation, userIds, metadata);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.bulk.operation:'),
      );

      consoleSpy.mockRestore();
    });

    it('should handle empty user list', async () => {
      // Arrange
      const operation = 'bulk_delete';
      const userIds = [];
      const metadata = {
        performedBy: 'admin-123',
        reason: 'test',
      };

      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserBulkOperation(operation, userIds, metadata);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.bulk.operation:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle null user data gracefully', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserCreated(null as any);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        '[USER EVENT] Invalid user data - skipping user.created event',
      );

      consoleSpy.mockRestore();
    });

    it('should handle undefined user data gracefully', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserCreated(undefined as any);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        '[USER EVENT] Invalid user data - skipping user.created event',
      );

      consoleSpy.mockRestore();
    });

    it('should handle very long user IDs', async () => {
      // Arrange
      const longUserId = 'a'.repeat(1000);
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      await service.publishUserLoggedIn(longUserId);

      // Assert
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.logged.in:'),
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent events', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const promises = Array.from({ length: 10 }, (_, i) =>
        service.publishUserLoggedIn(`user-${i}`),
      );

      await Promise.all(promises);

      // Assert
      expect(consoleSpy).toHaveBeenCalledTimes(10);

      consoleSpy.mockRestore();
    });

    it('should complete events quickly', async () => {
      // Arrange
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      // Act
      const start = Date.now();
      await service.publishUserLoggedIn('performance-test-user');
      const duration = Date.now() - start;

      // Assert
      expect(duration).toBeLessThan(100); // Should complete within 100ms
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('[USER EVENT] user.logged.in:'),
      );

      consoleSpy.mockRestore();
    });
  });
});
