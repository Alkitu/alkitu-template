// @ts-nocheck
// 
import { PrismaServiceMock, resetAllMocks } from '../../test/mocks/prisma.mock';
import { mockUser, createUserFixture } from '../../test/fixtures/user.fixtures';
import { NotificationService } from '@/notification/notification.service';
import * as bcrypt from 'bcryptjs';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaServiceMock,
        {
          provide: NotificationService,
          useValue: {
            createNotification: jest.fn().mockResolvedValue({}),
            sendNotification: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);

    resetAllMocks();
  });

  describe('create', () => {
    const createUserDto = {
      email: 'test@example.com',
      name: 'Test',
      lastName: 'User',
      password: 'password123',
      contactNumber: '+1234567890',
      terms: true,
    };

    it('should create a user successfully', async () => {
      const hashedPassword = 'hashed_password';
      const createdUser = createUserFixture({
        ...createUserDto,
        password: hashedPassword,
      });

      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(null); // User doesn't exist
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      PrismaServiceMock.useValue.user.create.mockResolvedValue(createdUser as any);

      const result = await service.create(createUserDto);

      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(
        createUserDto.password,
        10,
      );
      expect(PrismaServiceMock.useValue.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
          name: createUserDto.name,
          lastName: createUserDto.lastName,
          contactNumber: createUserDto.contactNumber,
          terms: createUserDto.terms,
        },
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          contactNumber: true,
          role: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(createdUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(mockUser as any);

      await expect(service.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.create(createUserDto)).rejects.toThrow(
        `An account with email ${createUserDto.email} already exists. Please use a different email or try logging in.`,
      );
      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(PrismaServiceMock.useValue.user.create).not.toHaveBeenCalled();
    });
  });

  describe('bulkUpdateStatus', () => {
    it('should update the status of multiple users', async () => {
      const userIds = ['1', '2'];
      const status = UserStatus.SUSPENDED;
      const bulkUpdateStatusDto = { userIds, status };

      PrismaServiceMock.useValue.user.findMany.mockResolvedValue(userIds.map(id => ({ id })) as any);
      PrismaServiceMock.useValue.user.updateMany.mockResolvedValue({ count: userIds.length } as any);

      const result = await service.bulkUpdateStatus(bulkUpdateStatusDto);

      expect(PrismaServiceMock.useValue.user.findMany).toHaveBeenCalledWith({
        where: { id: { in: userIds } },
        select: { id: true },
      });
      expect(PrismaServiceMock.useValue.user.updateMany).toHaveBeenCalledWith({
        where: { id: { in: userIds } },
        data: { status },
      });
      expect(result).toEqual({
        message: `Successfully updated status to ${status} for ${userIds.length} users`,
        updatedCount: userIds.length,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        mockUser,
        createUserFixture({ id: '2', email: 'user2@example.com' }),
      ];
      PrismaServiceMock.useValue.user.findMany.mockResolvedValue(users as any);

      const result = await service.findAll();

      expect(PrismaServiceMock.useValue.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          contactNumber: true,
          role: true,
          createdAt: true,
          lastLogin: true,
        },
      });
      expect(result).toEqual(users);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await service.findOne(mockUser.id!);

      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          contactNumber: true,
          role: true,
          createdAt: true,
          lastLogin: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const nonexistentId = 'nonexistent';
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(null);

      await expect(service.findOne(nonexistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(nonexistentId)).rejects.toThrow(
        `User with ID ${nonexistentId} not found`,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(mockUser as any);

      const result = await service.findByEmail(mockUser.email!);

      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    const updateDto = { name: 'Updated Name' };

    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateDto };

      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(mockUser as any);
      PrismaServiceMock.useValue.user.update.mockResolvedValue(updatedUser as any);

      const result = await service.update(mockUser.id!, updateDto);

      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(PrismaServiceMock.useValue.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: updateDto,
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          contactNumber: true,
          role: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      const nonexistentId = 'nonexistent';
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(null);

      await expect(service.update(nonexistentId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(nonexistentId, updateDto)).rejects.toThrow(
        `User with ID ${nonexistentId} not found`,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(mockUser as any);
      PrismaServiceMock.useValue.user.delete.mockResolvedValue(mockUser as any);

      const result = await service.remove(mockUser.id!);

      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(PrismaServiceMock.useValue.user.delete).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual({ message: 'User deleted successfully' });
    });

    it('should throw NotFoundException if user not found', async () => {
      const nonexistentId = 'nonexistent';
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(null);

      await expect(service.remove(nonexistentId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.remove(nonexistentId)).rejects.toThrow(
        `User with ID ${nonexistentId} not found`,
      );
    });
  });

  describe('validateUser', () => {
    const loginDto = { email: 'test@example.com', password: 'password123' };

    it('should validate user with correct credentials', async () => {
      const userWithPassword = { ...mockUser, password: 'hashedPassword' };
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(
        userWithPassword as any,
      );
      mockedBcrypt.compare.mockResolvedValue(true as never);
      PrismaServiceMock.useValue.user.update.mockResolvedValue(mockUser as any);

      const result = await service.validateUser(loginDto);

      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        'hashedPassword',
      );
      expect(PrismaServiceMock.useValue.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLogin: expect.any(Date) },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...expectedResult } = userWithPassword;
      expect(result).toEqual(expectedResult);
    });

    it('should return null for invalid email', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(null);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const userWithPassword = { ...mockUser, password: 'hashedPassword' };
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(
        userWithPassword as any,
      );
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(loginDto);

      expect(result).toBeNull();
    });
  });

  describe('updateTags', () => {
    const userId = 'user123';
    const tagIds = ['tag1', 'tag2'];
    const updateUserTagsDto = { tagIds };

    it('should update user tags successfully', async () => {
      const userWithTags = { ...mockUser, tagIds: tagIds, tags: tagIds.map(id => ({ id, name: `Tag ${id}` })) };

      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(mockUser as any);
      PrismaServiceMock.useValue.tag.findMany.mockResolvedValue(tagIds.map(id => ({ id })) as any);
      PrismaServiceMock.useValue.user.update.mockResolvedValue(userWithTags as any);

      const result = await service.updateTags(userId, updateUserTagsDto);

      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(PrismaServiceMock.useValue.tag.findMany).toHaveBeenCalledWith({ where: { id: { in: tagIds } }, select: { id: true } });
      expect(PrismaServiceMock.useValue.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          tagIds: { set: tagIds },
        },
        select: {
          id: true,
          email: true,
          name: true,
          lastName: true,
          contactNumber: true,
          role: true,
          createdAt: true,
          tags: { select: { id: true, name: true } },
        },
      });
      expect(result).toEqual(userWithTags);
    });

    it('should throw NotFoundException if user not found', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(null);

      await expect(service.updateTags(userId, updateUserTagsDto)).rejects.toThrow(NotFoundException);
      await expect(service.updateTags(userId, updateUserTagsDto)).rejects.toThrow(`User with ID ${userId} not found`);
    });

    it('should throw BadRequestException if one or more tag IDs are invalid', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(mockUser as any);
      PrismaServiceMock.useValue.tag.findMany.mockResolvedValue([ { id: 'tag1' } ] as any); // Only one tag exists

      await expect(service.updateTags(userId, updateUserTagsDto)).rejects.toThrow(BadRequestException);
      await expect(service.updateTags(userId, updateUserTagsDto)).rejects.toThrow('One or more tag IDs are invalid');
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const hashedPassword = 'newHashedPassword';
      const updatedUser = { ...mockUser, password: hashedPassword };

      PrismaServiceMock.useValue.user.update.mockResolvedValue(updatedUser as any);

      const result = await service.updatePassword(mockUser.id!, hashedPassword);

      expect(PrismaServiceMock.useValue.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { password: hashedPassword },
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('changePassword', () => {
    const userId = 'user123';
    const currentPassword = 'oldPassword123';
    const newPassword = 'newPassword123!';
    const hashedPassword = 'hashedNewPassword';
    const userWithPassword = { ...mockUser, password: 'hashedOldPassword' };

    it('should change user password successfully', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(userWithPassword as any);
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      PrismaServiceMock.useValue.user.update.mockResolvedValue({ ...userWithPassword, password: hashedPassword } as any);

      const result = await service.changePassword(userId, { currentPassword, newPassword });

      expect(PrismaServiceMock.useValue.user.findUnique).toHaveBeenCalledWith({ where: { id: userId } });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(currentPassword, userWithPassword.password);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(PrismaServiceMock.useValue.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { password: hashedPassword },
      });
      expect(result).toEqual({ message: 'Password changed successfully' });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(null);

      await expect(service.changePassword(userId, { currentPassword, newPassword })).rejects.toThrow(UnauthorizedException);
    });

    it('should throw BadRequestException if current password is invalid', async () => {
      PrismaServiceMock.useValue.user.findUnique.mockResolvedValue(userWithPassword as any);
      mockedBcrypt.compare.mockResolvedValue(false as never);

      await expect(service.changePassword(userId, { currentPassword, newPassword })).rejects.toThrow(BadRequestException);
      await expect(service.changePassword(userId, { currentPassword, newPassword })).rejects.toThrow('Invalid current password');
    });
  });

  describe('markEmailAsVerified', () => {
    it('should mark email as verified', async () => {
      const verifiedUser = {
        ...mockUser,
        emailVerified: new Date(),
      };

      PrismaServiceMock.useValue.user.update.mockResolvedValue(verifiedUser as any);

      const result = await service.markEmailAsVerified(mockUser.id!);

      expect(PrismaServiceMock.useValue.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { emailVerified: expect.any(Date) },
        select: {
          id: true,
          email: true,
          emailVerified: true,
          name: true,
          lastName: true,
        },
      });
      expect(result).toEqual(verifiedUser);
    });
  });
});
