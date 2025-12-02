import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { PrismaService } from '../prisma.service';
import { Service } from '@prisma/client';
import * as validator from './validators/request-template.validator';

// Mock the validator module
jest.mock('./validators/request-template.validator');

describe('ServicesService (ALI-118)', () => {
  let service: ServicesService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockServiceId = '507f1f77bcf86cd799439011';
  const mockCategoryId = '507f1f77bcf86cd799439012';
  const mockOtherCategoryId = '507f1f77bcf86cd799439013';
  const mockUserId = '507f1f77bcf86cd799439020';

  const mockRequestTemplate = {
    version: '1.0',
    fields: [
      {
        id: 'issue_description',
        type: 'textarea' as const,
        label: 'Describe the Issue',
        required: true,
      },
    ],
  };

  const mockService: Service = {
    id: mockServiceId,
    name: 'Emergency Plumbing',
    categoryId: mockCategoryId,
    thumbnail: 'https://example.com/plumbing.jpg',
    requestTemplate: mockRequestTemplate,
    deletedAt: null,
    createdBy: mockUserId,
    updatedBy: mockUserId,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const mockServiceWithCategory = {
    ...mockService,
    category: {
      id: mockCategoryId,
      name: 'Plumbing',
    },
  };

  const mockCategory = {
    id: mockCategoryId,
    name: 'Plumbing',
    deletedAt: null,
    createdBy: mockUserId,
    updatedBy: mockUserId,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const createServiceDto = {
    name: 'Electrical Repair',
    categoryId: mockCategoryId,
    thumbnail: 'https://example.com/electrical.jpg',
    requestTemplate: mockRequestTemplate,
  };

  const updateServiceDto = {
    name: 'Updated Service Name',
    categoryId: mockOtherCategoryId,
  };

  beforeEach(async () => {
    const mockPrismaService = {
      category: {
        findFirst: jest.fn().mockResolvedValue(mockCategory),
        findUnique: jest.fn().mockResolvedValue(mockCategory),
      },
      service: {
        create: jest.fn().mockResolvedValue(mockServiceWithCategory),
        findMany: jest.fn().mockResolvedValue([mockServiceWithCategory]),
        findFirst: jest.fn().mockResolvedValue(mockServiceWithCategory),
        findUnique: jest.fn().mockResolvedValue(mockServiceWithCategory),
        update: jest
          .fn()
          .mockResolvedValue({ ...mockServiceWithCategory, ...updateServiceDto }),
        delete: jest.fn().mockResolvedValue(mockService),
        count: jest.fn().mockResolvedValue(1),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ServicesService>(ServicesService);
    prismaService = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;

    jest.clearAllMocks();
    // Reset the mock validator
    (validator.validateRequestTemplate as jest.Mock).mockClear();
  });

  describe('create', () => {
    it('should create a service successfully', async () => {
      const result = await service.create(createServiceDto, mockUserId);

      expect(prismaService.category.findFirst).toHaveBeenCalledWith({
        where: { id: createServiceDto.categoryId, deletedAt: null },
      });
      expect(validator.validateRequestTemplate).toHaveBeenCalledWith(
        createServiceDto.requestTemplate,
      );
      expect(prismaService.service.create).toHaveBeenCalledWith({
        data: {
          ...createServiceDto,
          createdBy: mockUserId,
          updatedBy: mockUserId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(mockServiceWithCategory);
    });

    it('should throw NotFoundException if category not found', async () => {
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.create(createServiceDto, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createServiceDto, mockUserId)).rejects.toThrow(
        `Category with ID "${createServiceDto.categoryId}" not found`,
      );

      expect(prismaService.service.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if requestTemplate is invalid', async () => {
      (validator.validateRequestTemplate as jest.Mock).mockImplementation(() => {
        throw new BadRequestException('Invalid template structure');
      });

      await expect(service.create(createServiceDto, mockUserId)).rejects.toThrow(
        BadRequestException,
      );

      expect(prismaService.service.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      // Reset validator mock from previous test (mockReset clears implementation)
      (validator.validateRequestTemplate as jest.Mock).mockReset();

      prismaService.service.create = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(createServiceDto, mockUserId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all services', async () => {
      const result = await service.findAll();

      expect(prismaService.service.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { name: 'asc' },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual([mockServiceWithCategory]);
    });

    it('should return services filtered by categoryId', async () => {
      const result = await service.findAll(mockCategoryId);

      expect(prismaService.service.findMany).toHaveBeenCalledWith({
        where: { categoryId: mockCategoryId, deletedAt: null },
        orderBy: { name: 'asc' },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual([mockServiceWithCategory]);
    });

    it('should return empty array if no services exist', async () => {
      prismaService.service.findMany = jest.fn().mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.service.findMany = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a service with its category', async () => {
      const result = await service.findOne(mockServiceId);

      expect(prismaService.service.findFirst).toHaveBeenCalledWith({
        where: { id: mockServiceId, deletedAt: null },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(mockServiceWithCategory);
    });

    it('should throw NotFoundException if service not found', async () => {
      prismaService.service.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.findOne(mockServiceId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.findOne(mockServiceId)).rejects.toThrow(
        `Service with ID "${mockServiceId}" not found`,
      );
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.service.findFirst = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.findOne(mockServiceId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('update', () => {
    it('should update a service successfully', async () => {
      const updatedService = { ...mockServiceWithCategory, ...updateServiceDto };
      prismaService.service.update = jest.fn().mockResolvedValue(updatedService);

      const result = await service.update(mockServiceId, updateServiceDto, mockUserId);

      expect(prismaService.service.update).toHaveBeenCalledWith({
        where: { id: mockServiceId },
        data: {
          ...updateServiceDto,
          updatedBy: mockUserId,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedService);
    });

    it('should throw NotFoundException if service not found', async () => {
      prismaService.service.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.update(mockServiceId, updateServiceDto, mockUserId),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if new category not found', async () => {
      prismaService.category.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.update(mockServiceId, { categoryId: mockOtherCategoryId }, mockUserId),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.update(mockServiceId, { categoryId: mockOtherCategoryId }, mockUserId),
      ).rejects.toThrow(
        `Category with ID "${mockOtherCategoryId}" not found`,
      );

      expect(prismaService.service.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if new requestTemplate is invalid', async () => {
      (validator.validateRequestTemplate as jest.Mock).mockImplementation(() => {
        throw new BadRequestException('Invalid template structure');
      });

      const dtoWithTemplate = {
        requestTemplate: { version: '1.0', fields: [] }, // Invalid - no fields
      };

      await expect(
        service.update(mockServiceId, dtoWithTemplate, mockUserId),
      ).rejects.toThrow(BadRequestException);

      expect(prismaService.service.update).not.toHaveBeenCalled();
    });

    it('should not validate template if not provided in update', async () => {
      await service.update(mockServiceId, { name: 'New Name' }, mockUserId);

      expect(validator.validateRequestTemplate).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.service.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.update(mockServiceId, updateServiceDto, mockUserId),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should soft delete a service successfully', async () => {
      prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
      prismaService.service.update = jest.fn().mockResolvedValue(mockService);

      const result = await service.remove(mockServiceId);

      expect(prismaService.service.update).toHaveBeenCalledWith({
        where: { id: mockServiceId },
        data: { deletedAt: expect.any(Date) },
      });
      expect(result).toEqual(mockService);
    });

    it('should throw NotFoundException if service not found', async () => {
      prismaService.service.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.remove(mockServiceId)).rejects.toThrow(
        NotFoundException,
      );

      expect(prismaService.service.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
      prismaService.service.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.remove(mockServiceId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('count', () => {
    it('should return the total number of services', async () => {
      prismaService.service.count = jest.fn().mockResolvedValue(25);

      const result = await service.count();

      expect(prismaService.service.count).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toBe(25);
    });

    it('should return services count filtered by categoryId', async () => {
      prismaService.service.count = jest.fn().mockResolvedValue(10);

      const result = await service.count(mockCategoryId);

      expect(prismaService.service.count).toHaveBeenCalledWith({
        where: { categoryId: mockCategoryId, deletedAt: null },
      });
      expect(result).toBe(10);
    });

    it('should return 0 if no services exist', async () => {
      prismaService.service.count = jest.fn().mockResolvedValue(0);

      const result = await service.count();

      expect(result).toBe(0);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.service.count = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.count()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
