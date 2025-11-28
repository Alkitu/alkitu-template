import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { PrismaService } from '../prisma.service';
import { WorkLocation } from '@prisma/client';

describe('LocationsService (ALI-117)', () => {
  let service: LocationsService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUserId = '507f1f77bcf86cd799439011';
  const mockLocationId = '507f1f77bcf86cd799439012';
  const mockOtherUserId = '507f1f77bcf86cd799439999';

  const mockLocation: WorkLocation = {
    id: mockLocationId,
    userId: mockUserId,
    street: '123 Main St',
    building: 'Suite 100',
    tower: null,
    floor: null,
    unit: null,
    city: 'New York',
    zip: '10001',
    state: 'NY',
    createdAt: new Date('2024-01-01T00:00:00Z'),
  };

  const mockUser = {
    id: mockUserId,
    email: 'test@example.com',
    firstname: 'Test',
    lastname: 'User',
  };

  const createLocationDto = {
    street: '123 Main St',
    building: 'Suite 100',
    city: 'New York',
    zip: '10001',
    state: 'NY',
  };

  const updateLocationDto = {
    street: '456 Oak Ave',
    city: 'Brooklyn',
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn().mockResolvedValue(mockUser),
      },
      workLocation: {
        create: jest.fn().mockResolvedValue(mockLocation),
        findMany: jest.fn().mockResolvedValue([mockLocation]),
        findUnique: jest.fn().mockResolvedValue(mockLocation),
        update: jest
          .fn()
          .mockResolvedValue({ ...mockLocation, ...updateLocationDto }),
        delete: jest.fn().mockResolvedValue(mockLocation),
        count: jest.fn().mockResolvedValue(1),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    prismaService = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a location successfully', async () => {
      const result = await service.create(mockUserId, createLocationDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(prismaService.workLocation.create).toHaveBeenCalledWith({
        data: {
          ...createLocationDto,
          userId: mockUserId,
        },
      });
      expect(result).toEqual(mockLocation);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.create(mockUserId, createLocationDto),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.create(mockUserId, createLocationDto),
      ).rejects.toThrow(`User with ID ${mockUserId} not found`);
    });

    it('should throw BadRequestException on database error', async () => {
      (prismaService.workLocation.create as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.create(mockUserId, createLocationDto),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.create(mockUserId, createLocationDto),
      ).rejects.toThrow('Failed to create location');
    });
  });

  describe('findAllByUser', () => {
    it('should return all locations for a user', async () => {
      const mockLocations = [mockLocation, { ...mockLocation, id: 'location2' }];
      (prismaService.workLocation.findMany as jest.Mock).mockResolvedValue(
        mockLocations,
      );

      const result = await service.findAllByUser(mockUserId);

      expect(prismaService.workLocation.findMany).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockLocations);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if user has no locations', async () => {
      (prismaService.workLocation.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAllByUser(mockUserId);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should throw BadRequestException on database error', async () => {
      (prismaService.workLocation.findMany as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.findAllByUser(mockUserId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.findAllByUser(mockUserId)).rejects.toThrow(
        'Failed to fetch locations',
      );
    });
  });

  describe('findOne', () => {
    it('should return a location if user owns it', async () => {
      const result = await service.findOne(mockLocationId, mockUserId);

      expect(prismaService.workLocation.findUnique).toHaveBeenCalledWith({
        where: { id: mockLocationId },
      });
      expect(result).toEqual(mockLocation);
    });

    it('should throw NotFoundException if location does not exist', async () => {
      (prismaService.workLocation.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.findOne(mockLocationId, mockUserId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.findOne(mockLocationId, mockUserId),
      ).rejects.toThrow(`Location with ID ${mockLocationId} not found`);
    });

    it('should throw ForbiddenException if user does not own the location', async () => {
      (prismaService.workLocation.findUnique as jest.Mock).mockResolvedValue(
        mockLocation,
      );

      await expect(
        service.findOne(mockLocationId, mockOtherUserId),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.findOne(mockLocationId, mockOtherUserId),
      ).rejects.toThrow(
        'You do not have permission to access this location',
      );
    });

    it('should throw BadRequestException on database error', async () => {
      (prismaService.workLocation.findUnique as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.findOne(mockLocationId, mockUserId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a location successfully', async () => {
      const updatedLocation = { ...mockLocation, ...updateLocationDto };
      (prismaService.workLocation.update as jest.Mock).mockResolvedValue(
        updatedLocation,
      );

      const result = await service.update(
        mockLocationId,
        mockUserId,
        updateLocationDto,
      );

      expect(prismaService.workLocation.findUnique).toHaveBeenCalledWith({
        where: { id: mockLocationId },
      });
      expect(prismaService.workLocation.update).toHaveBeenCalledWith({
        where: { id: mockLocationId },
        data: updateLocationDto,
      });
      expect(result).toEqual(updatedLocation);
    });

    it('should throw NotFoundException if location does not exist', async () => {
      (prismaService.workLocation.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.update(mockLocationId, mockUserId, updateLocationDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the location', async () => {
      await expect(
        service.update(mockLocationId, mockOtherUserId, updateLocationDto),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException on database error during update', async () => {
      (prismaService.workLocation.update as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.update(mockLocationId, mockUserId, updateLocationDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should delete a location successfully', async () => {
      const result = await service.remove(mockLocationId, mockUserId);

      expect(prismaService.workLocation.findUnique).toHaveBeenCalledWith({
        where: { id: mockLocationId },
      });
      expect(prismaService.workLocation.delete).toHaveBeenCalledWith({
        where: { id: mockLocationId },
      });
      expect(result).toEqual(mockLocation);
    });

    it('should throw NotFoundException if location does not exist', async () => {
      (prismaService.workLocation.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      await expect(
        service.remove(mockLocationId, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user does not own the location', async () => {
      await expect(
        service.remove(mockLocationId, mockOtherUserId),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException on database error during delete', async () => {
      (prismaService.workLocation.delete as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(
        service.remove(mockLocationId, mockUserId),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('count', () => {
    it('should return count of locations for a user', async () => {
      (prismaService.workLocation.count as jest.Mock).mockResolvedValue(5);

      const result = await service.count(mockUserId);

      expect(prismaService.workLocation.count).toHaveBeenCalledWith({
        where: { userId: mockUserId },
      });
      expect(result).toBe(5);
    });

    it('should return 0 if user has no locations', async () => {
      (prismaService.workLocation.count as jest.Mock).mockResolvedValue(0);

      const result = await service.count(mockUserId);

      expect(result).toBe(0);
    });

    it('should throw BadRequestException on database error', async () => {
      (prismaService.workLocation.count as jest.Mock).mockRejectedValue(
        new Error('Database error'),
      );

      await expect(service.count(mockUserId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.count(mockUserId)).rejects.toThrow(
        'Failed to count locations',
      );
    });
  });
});
