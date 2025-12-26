import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { PrismaService } from '../prisma.service';
import { NotificationService } from '../notification/notification.service';
import { Request, RequestStatus, UserRole } from '@prisma/client';

describe('RequestsService (ALI-119)', () => {
  let service: RequestsService;
  let prismaService: jest.Mocked<PrismaService>;

  const mockRequestId = '507f1f77bcf86cd799439011';
  const mockUserId = '507f1f77bcf86cd799439020';
  const mockEmployeeId = '507f1f77bcf86cd799439021';
  const mockServiceId = '507f1f77bcf86cd799439012';
  const mockLocationId = '507f1f77bcf86cd799439013';

  const futureDate = new Date(Date.now() + 86400000); // Tomorrow

  const mockService = {
    id: mockServiceId,
    name: 'Emergency Plumbing',
    categoryId: '507f1f77bcf86cd799439014',
    deletedAt: null,
    requestTemplate: { version: '1.0', fields: [] },
  };

  const mockLocation = {
    id: mockLocationId,
    userId: mockUserId,
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
  };

  const mockRequest: Request = {
    id: mockRequestId,
    userId: mockUserId,
    serviceId: mockServiceId,
    locationId: mockLocationId,
    assignedToId: null,
    executionDateTime: futureDate,
    templateResponses: { issue: 'Leaking pipe' },
    note: null,
    status: RequestStatus.PENDING,
    cancellationRequested: false,
    cancellationRequestedAt: null,
    completedAt: null,
    deletedAt: null,
    createdBy: mockUserId,
    updatedBy: mockUserId,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  };

  const mockRequestWithRelations = {
    ...mockRequest,
    user: {
      id: mockUserId,
      firstname: 'John',
      lastname: 'Doe',
      email: 'john@example.com',
      company: 'ACME Corp',
    },
    service: {
      id: mockServiceId,
      name: 'Emergency Plumbing',
      categoryId: '507f1f77bcf86cd799439014',
      category: {
        id: '507f1f77bcf86cd799439014',
        name: 'Plumbing',
      },
    },
    location: {
      id: mockLocationId,
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      building: null,
      tower: null,
      floor: null,
      unit: null,
    },
    assignedTo: null,
  };

  const mockEmployee = {
    id: mockEmployeeId,
    role: UserRole.EMPLOYEE,
  };

  const createRequestDto = {
    serviceId: mockServiceId,
    locationId: mockLocationId,
    executionDateTime: futureDate.toISOString(),
    templateResponses: { issue: 'Leaking pipe' },
  };

  beforeEach(async () => {
    const mockPrismaService = {
      service: {
        findFirst: jest.fn().mockResolvedValue(mockService),
      },
      workLocation: {
        findFirst: jest.fn().mockResolvedValue(mockLocation),
      },
      user: {
        findUnique: jest.fn().mockResolvedValue(mockEmployee),
        findMany: jest.fn().mockResolvedValue([]),
      },
      request: {
        create: jest.fn().mockResolvedValue(mockRequestWithRelations),
        findMany: jest.fn().mockResolvedValue([mockRequestWithRelations]),
        findFirst: jest.fn().mockResolvedValue(mockRequestWithRelations),
        update: jest.fn().mockResolvedValue(mockRequestWithRelations),
        count: jest.fn().mockResolvedValue(1),
      },
    };

    const mockNotificationService = {
      createNotification: jest.fn().mockResolvedValue({ id: 'notification-id' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    prismaService = module.get<PrismaService>(
      PrismaService,
    ) as jest.Mocked<PrismaService>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a request successfully', async () => {
      const result = await service.create(createRequestDto, mockUserId);

      expect(prismaService.service.findFirst).toHaveBeenCalledWith({
        where: { id: mockServiceId, deletedAt: null },
      });
      expect(prismaService.workLocation.findFirst).toHaveBeenCalledWith({
        where: { id: mockLocationId, userId: mockUserId },
      });
      expect(prismaService.request.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          serviceId: mockServiceId,
          locationId: mockLocationId,
          executionDateTime: expect.any(Date),
          templateResponses: { issue: 'Leaking pipe' },
          note: undefined,
          status: RequestStatus.PENDING,
          createdBy: mockUserId,
          updatedBy: mockUserId,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockRequestWithRelations);
    });

    it('should throw NotFoundException if service not found', async () => {
      prismaService.service.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.create(createRequestDto, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createRequestDto, mockUserId)).rejects.toThrow(
        `Service with ID "${mockServiceId}" not found`,
      );

      expect(prismaService.request.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if location not found or does not belong to user', async () => {
      prismaService.workLocation.findFirst = jest.fn().mockResolvedValue(null);

      await expect(service.create(createRequestDto, mockUserId)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(createRequestDto, mockUserId)).rejects.toThrow(
        'not found or does not belong to you',
      );

      expect(prismaService.request.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if execution date is in the past', async () => {
      const pastDto = {
        ...createRequestDto,
        executionDateTime: new Date(Date.now() - 86400000).toISOString(),
      };

      await expect(service.create(pastDto, mockUserId)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(pastDto, mockUserId)).rejects.toThrow(
        'Execution date must be in the future',
      );

      expect(prismaService.request.create).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.request.create = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.create(createRequestDto, mockUserId)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all requests for CLIENT (only their own)', async () => {
      const result = await service.findAll(mockUserId, UserRole.CLIENT);

      expect(prismaService.request.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null, userId: mockUserId },
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
      expect(result).toEqual([mockRequestWithRelations]);
    });

    it('should return requests for EMPLOYEE (assigned or unassigned)', async () => {
      const result = await service.findAll(mockEmployeeId, UserRole.EMPLOYEE);

      expect(prismaService.request.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          OR: [{ assignedToId: mockEmployeeId }, { assignedToId: null }],
        },
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
      expect(result).toEqual([mockRequestWithRelations]);
    });

    it('should return all requests for ADMIN', async () => {
      const result = await service.findAll(mockUserId, UserRole.ADMIN);

      expect(prismaService.request.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
      expect(result).toEqual([mockRequestWithRelations]);
    });

    it('should apply status filter', async () => {
      await service.findAll(mockUserId, UserRole.ADMIN, {
        status: RequestStatus.PENDING,
      });

      expect(prismaService.request.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null, status: RequestStatus.PENDING },
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });

    it('should apply date filters', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      await service.findAll(mockUserId, UserRole.ADMIN, {
        startDate,
        endDate,
      });

      expect(prismaService.request.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          executionDateTime: { gte: startDate, lte: endDate },
        },
        orderBy: { createdAt: 'desc' },
        include: expect.any(Object),
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.request.findMany = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.findAll(mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return request for owner (CLIENT)', async () => {
      const result = await service.findOne(
        mockRequestId,
        mockUserId,
        UserRole.CLIENT,
      );

      expect(prismaService.request.findFirst).toHaveBeenCalledWith({
        where: { id: mockRequestId, deletedAt: null },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockRequestWithRelations);
    });

    it('should throw NotFoundException if CLIENT tries to access another user request', async () => {
      const otherUserId = '507f1f77bcf86cd799439099';

      await expect(
        service.findOne(mockRequestId, otherUserId, UserRole.CLIENT),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return request for assigned EMPLOYEE', async () => {
      const assignedRequest = {
        ...mockRequestWithRelations,
        assignedToId: mockEmployeeId,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(assignedRequest);

      const result = await service.findOne(
        mockRequestId,
        mockEmployeeId,
        UserRole.EMPLOYEE,
      );

      expect(result).toEqual(assignedRequest);
    });

    it('should throw NotFoundException if EMPLOYEE tries to access non-assigned request', async () => {
      const assignedRequest = {
        ...mockRequestWithRelations,
        assignedToId: 'different-employee-id',
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(assignedRequest);

      await expect(
        service.findOne(mockRequestId, mockEmployeeId, UserRole.EMPLOYEE),
      ).rejects.toThrow(NotFoundException);
    });

    it('should return any request for ADMIN', async () => {
      const result = await service.findOne(
        mockRequestId,
        'any-admin-id',
        UserRole.ADMIN,
      );

      expect(result).toEqual(mockRequestWithRelations);
    });

    it('should throw NotFoundException if request not found', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.findOne(mockRequestId, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.request.findFirst = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.findOne(mockRequestId, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    const updateDto = {
      note: { type: 'doc', content: [] },
    };

    it('should update request successfully for owner (CLIENT, PENDING status)', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      const result = await service.update(
        mockRequestId,
        updateDto,
        mockUserId,
        UserRole.CLIENT,
      );

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          ...updateDto,
          updatedBy: mockUserId,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockRequestWithRelations);
    });

    it('should throw NotFoundException if request not found', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.update(mockRequestId, updateDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if CLIENT tries to update non-owned request', async () => {
      const otherUserId = '507f1f77bcf86cd799439099';
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      await expect(
        service.update(mockRequestId, updateDto, otherUserId, UserRole.CLIENT),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.update(mockRequestId, updateDto, otherUserId, UserRole.CLIENT),
      ).rejects.toThrow('You can only update your own requests');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if CLIENT tries to update non-PENDING request', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      await expect(
        service.update(mockRequestId, updateDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.update(mockRequestId, updateDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow('You can only update requests in PENDING status');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if CLIENT tries to change status', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      const dtoWithStatus = { status: RequestStatus.ONGOING };

      await expect(
        service.update(mockRequestId, dtoWithStatus, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.update(mockRequestId, dtoWithStatus, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow('You cannot change status or assignment as a client');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if execution date is in the past', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      const pastDto = {
        executionDateTime: new Date(Date.now() - 86400000).toISOString(),
      };

      await expect(
        service.update(mockRequestId, pastDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.update(mockRequestId, pastDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow('Execution date must be in the future');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should update status and set completedAt when status is COMPLETED', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
        assignedToId: mockEmployeeId,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      const statusUpdate = { status: RequestStatus.COMPLETED };

      await service.update(
        mockRequestId,
        statusUpdate,
        mockEmployeeId,
        UserRole.EMPLOYEE,
      );

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          status: RequestStatus.COMPLETED,
          completedAt: expect.any(Date),
          updatedBy: mockEmployeeId,
        },
        include: expect.any(Object),
      });
    });

    it('should throw BadRequestException for invalid status transition', async () => {
      const completedRequest = {
        ...mockRequest,
        status: RequestStatus.COMPLETED,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(completedRequest);

      const invalidUpdate = { status: RequestStatus.PENDING };

      await expect(
        service.update(
          mockRequestId,
          invalidUpdate,
          mockUserId,
          UserRole.ADMIN,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
      prismaService.request.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.update(mockRequestId, updateDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should soft delete request for owner (CLIENT, PENDING status)', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
      prismaService.request.update = jest.fn().mockResolvedValue(mockRequest);

      await service.remove(mockRequestId, mockUserId, UserRole.CLIENT);

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException if request not found', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.remove(mockRequestId, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if CLIENT tries to delete non-owned request', async () => {
      const otherUserId = '507f1f77bcf86cd799439099';
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      await expect(
        service.remove(mockRequestId, otherUserId, UserRole.CLIENT),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.remove(mockRequestId, otherUserId, UserRole.CLIENT),
      ).rejects.toThrow('You can only delete your own requests');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if CLIENT tries to delete non-PENDING request', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      await expect(
        service.remove(mockRequestId, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.remove(mockRequestId, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow('You can only delete requests in PENDING status');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should allow ADMIN to delete any request', async () => {
      const otherUserRequest = {
        ...mockRequest,
        userId: 'other-user-id',
        status: RequestStatus.ONGOING,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(otherUserRequest);
      prismaService.request.update = jest
        .fn()
        .mockResolvedValue(otherUserRequest);

      await service.remove(mockRequestId, 'admin-id', UserRole.ADMIN);

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
      prismaService.request.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.remove(mockRequestId, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('assign', () => {
    const assignDto = { assignedToId: mockEmployeeId };

    it('should assign request to employee successfully', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      const result = await service.assign(
        mockRequestId,
        assignDto,
        mockEmployeeId,
        UserRole.EMPLOYEE,
      );

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockEmployeeId },
        select: { id: true, role: true },
      });
      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          assignedToId: mockEmployeeId,
          status: RequestStatus.ONGOING,
          updatedBy: mockEmployeeId,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockRequestWithRelations);
    });

    it('should throw ForbiddenException if CLIENT tries to assign', async () => {
      await expect(
        service.assign(mockRequestId, assignDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.assign(mockRequestId, assignDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow('Only employees and admins can assign requests');

      expect(prismaService.request.findFirst).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if request not found', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.assign(mockRequestId, assignDto, mockEmployeeId, UserRole.EMPLOYEE),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if request is not PENDING', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      await expect(
        service.assign(mockRequestId, assignDto, mockEmployeeId, UserRole.EMPLOYEE),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.assign(mockRequestId, assignDto, mockEmployeeId, UserRole.EMPLOYEE),
      ).rejects.toThrow('Can only assign requests in PENDING status');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if assignee not found', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
      prismaService.user.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.assign(mockRequestId, assignDto, mockEmployeeId, UserRole.EMPLOYEE),
      ).rejects.toThrow(NotFoundException);
      await expect(
        service.assign(mockRequestId, assignDto, mockEmployeeId, UserRole.EMPLOYEE),
      ).rejects.toThrow(`User with ID "${mockEmployeeId}" not found`);

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if assignee is not EMPLOYEE or ADMIN', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
      prismaService.user.findUnique = jest.fn().mockResolvedValue({
        id: mockEmployeeId,
        role: UserRole.CLIENT,
      });

      await expect(
        service.assign(mockRequestId, assignDto, mockEmployeeId, UserRole.ADMIN),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.assign(mockRequestId, assignDto, mockEmployeeId, UserRole.ADMIN),
      ).rejects.toThrow('Can only assign to users with EMPLOYEE or ADMIN role');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
      prismaService.request.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.assign(mockRequestId, assignDto, mockEmployeeId, UserRole.EMPLOYEE),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('requestCancellation', () => {
    const cancellationDto = { reason: 'No longer needed' };

    it('should auto-approve cancellation for PENDING requests', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      const result = await service.requestCancellation(
        mockRequestId,
        cancellationDto,
        mockUserId,
        UserRole.CLIENT,
      );

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          cancellationRequested: true,
          cancellationRequestedAt: expect.any(Date),
          updatedBy: mockUserId,
          status: RequestStatus.CANCELLED,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockRequestWithRelations);
    });

    it('should request cancellation for ONGOING requests (needs approval)', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      await service.requestCancellation(
        mockRequestId,
        cancellationDto,
        mockUserId,
        UserRole.CLIENT,
      );

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          cancellationRequested: true,
          cancellationRequestedAt: expect.any(Date),
          updatedBy: mockUserId,
        },
        include: expect.any(Object),
      });
    });

    it('should auto-approve cancellation for ADMIN regardless of status', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      await service.requestCancellation(
        mockRequestId,
        cancellationDto,
        'admin-id',
        UserRole.ADMIN,
      );

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          cancellationRequested: true,
          cancellationRequestedAt: expect.any(Date),
          updatedBy: 'admin-id',
          status: RequestStatus.CANCELLED,
        },
        include: expect.any(Object),
      });
    });

    it('should throw NotFoundException if request not found', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.requestCancellation(
          mockRequestId,
          cancellationDto,
          mockUserId,
          UserRole.CLIENT,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if user tries to cancel non-owned request', async () => {
      const otherUserId = '507f1f77bcf86cd799439099';
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      await expect(
        service.requestCancellation(
          mockRequestId,
          cancellationDto,
          otherUserId,
          UserRole.CLIENT,
        ),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.requestCancellation(
          mockRequestId,
          cancellationDto,
          otherUserId,
          UserRole.CLIENT,
        ),
      ).rejects.toThrow('You can only request cancellation of your own requests');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if request is already COMPLETED', async () => {
      const completedRequest = {
        ...mockRequest,
        status: RequestStatus.COMPLETED,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(completedRequest);

      await expect(
        service.requestCancellation(
          mockRequestId,
          cancellationDto,
          mockUserId,
          UserRole.CLIENT,
        ),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.requestCancellation(
          mockRequestId,
          cancellationDto,
          mockUserId,
          UserRole.CLIENT,
        ),
      ).rejects.toThrow('Cannot cancel request with status COMPLETED');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if request is already CANCELLED', async () => {
      const cancelledRequest = {
        ...mockRequest,
        status: RequestStatus.CANCELLED,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(cancelledRequest);

      await expect(
        service.requestCancellation(
          mockRequestId,
          cancellationDto,
          mockUserId,
          UserRole.CLIENT,
        ),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.requestCancellation(
          mockRequestId,
          cancellationDto,
          mockUserId,
          UserRole.CLIENT,
        ),
      ).rejects.toThrow('Cannot cancel request with status CANCELLED');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
      prismaService.request.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.requestCancellation(
          mockRequestId,
          cancellationDto,
          mockUserId,
          UserRole.CLIENT,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('complete', () => {
    const completeDto = { notes: 'All issues resolved' };

    it('should complete request successfully', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
        assignedToId: mockEmployeeId,
        note: null,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      const result = await service.complete(
        mockRequestId,
        completeDto,
        mockEmployeeId,
        UserRole.EMPLOYEE,
      );

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          status: RequestStatus.COMPLETED,
          completedAt: expect.any(Date),
          updatedBy: mockEmployeeId,
          note: {
            completionNotes: 'All issues resolved',
          },
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockRequestWithRelations);
    });

    it('should throw ForbiddenException if CLIENT tries to complete', async () => {
      await expect(
        service.complete(mockRequestId, completeDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.complete(mockRequestId, completeDto, mockUserId, UserRole.CLIENT),
      ).rejects.toThrow('Only employees and admins can complete requests');

      expect(prismaService.request.findFirst).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if request not found', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(null);

      await expect(
        service.complete(
          mockRequestId,
          completeDto,
          mockEmployeeId,
          UserRole.EMPLOYEE,
        ),
      ).rejects.toThrow(NotFoundException);

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if request is not ONGOING', async () => {
      prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);

      await expect(
        service.complete(
          mockRequestId,
          completeDto,
          mockEmployeeId,
          UserRole.EMPLOYEE,
        ),
      ).rejects.toThrow(BadRequestException);
      await expect(
        service.complete(
          mockRequestId,
          completeDto,
          mockEmployeeId,
          UserRole.EMPLOYEE,
        ),
      ).rejects.toThrow('Can only complete requests in ONGOING status');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should throw ForbiddenException if EMPLOYEE tries to complete non-assigned request', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
        assignedToId: 'different-employee-id',
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      await expect(
        service.complete(
          mockRequestId,
          completeDto,
          mockEmployeeId,
          UserRole.EMPLOYEE,
        ),
      ).rejects.toThrow(ForbiddenException);
      await expect(
        service.complete(
          mockRequestId,
          completeDto,
          mockEmployeeId,
          UserRole.EMPLOYEE,
        ),
      ).rejects.toThrow('You can only complete requests assigned to you');

      expect(prismaService.request.update).not.toHaveBeenCalled();
    });

    it('should allow ADMIN to complete any ONGOING request', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
        assignedToId: 'different-employee-id',
        note: null,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);

      await service.complete(mockRequestId, completeDto, 'admin-id', UserRole.ADMIN);

      expect(prismaService.request.update).toHaveBeenCalledWith({
        where: { id: mockRequestId },
        data: {
          status: RequestStatus.COMPLETED,
          completedAt: expect.any(Date),
          updatedBy: 'admin-id',
          note: {
            completionNotes: 'All issues resolved',
          },
        },
        include: expect.any(Object),
      });
    });

    it('should throw InternalServerErrorException on database error', async () => {
      const ongoingRequest = {
        ...mockRequest,
        status: RequestStatus.ONGOING,
        assignedToId: mockEmployeeId,
      };
      prismaService.request.findFirst = jest
        .fn()
        .mockResolvedValue(ongoingRequest);
      prismaService.request.update = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(
        service.complete(
          mockRequestId,
          completeDto,
          mockEmployeeId,
          UserRole.EMPLOYEE,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('count', () => {
    it('should return count for CLIENT (only their own)', async () => {
      prismaService.request.count = jest.fn().mockResolvedValue(5);

      const result = await service.count(mockUserId, UserRole.CLIENT);

      expect(prismaService.request.count).toHaveBeenCalledWith({
        where: { deletedAt: null, userId: mockUserId },
      });
      expect(result).toBe(5);
    });

    it('should return count for EMPLOYEE (assigned or unassigned)', async () => {
      prismaService.request.count = jest.fn().mockResolvedValue(10);

      const result = await service.count(mockEmployeeId, UserRole.EMPLOYEE);

      expect(prismaService.request.count).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          OR: [{ assignedToId: mockEmployeeId }, { assignedToId: null }],
        },
      });
      expect(result).toBe(10);
    });

    it('should return count for ADMIN (all requests)', async () => {
      prismaService.request.count = jest.fn().mockResolvedValue(25);

      const result = await service.count('admin-id', UserRole.ADMIN);

      expect(prismaService.request.count).toHaveBeenCalledWith({
        where: { deletedAt: null },
      });
      expect(result).toBe(25);
    });

    it('should apply filters', async () => {
      prismaService.request.count = jest.fn().mockResolvedValue(3);

      const result = await service.count(mockUserId, UserRole.CLIENT, {
        status: RequestStatus.PENDING,
        serviceId: mockServiceId,
      });

      expect(prismaService.request.count).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
          userId: mockUserId,
          status: RequestStatus.PENDING,
          serviceId: mockServiceId,
        },
      });
      expect(result).toBe(3);
    });

    it('should return 0 if no requests exist', async () => {
      prismaService.request.count = jest.fn().mockResolvedValue(0);

      const result = await service.count(mockUserId, UserRole.CLIENT);

      expect(result).toBe(0);
    });

    it('should throw InternalServerErrorException on database error', async () => {
      prismaService.request.count = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.count(mockUserId, UserRole.CLIENT)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('Notification Integration (ALI-120)', () => {
    let mockNotificationService: any;

    beforeEach(() => {
      mockNotificationService = {
        createNotification: jest.fn().mockResolvedValue({ id: 'notification-id' }),
      };
      (service as any).notificationService = mockNotificationService;
      (service as any).getAdminUserIds = jest
        .fn()
        .mockResolvedValue(['admin-1', 'admin-2']);
    });

    describe('Request Creation Notifications', () => {
      it('should send notification to client when request is created', async () => {
        prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
        prismaService.workLocation.findFirst = jest
          .fn()
          .mockResolvedValue(mockLocation);
        prismaService.request.create = jest
          .fn()
          .mockResolvedValue(mockRequestWithRelations);

        await service.create(createRequestDto, mockUserId);

        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: mockUserId,
            type: 'REQUEST_CREATED',
            message: expect.stringContaining('created successfully'),
            data: expect.objectContaining({
              requestId: mockRequestId,
              serviceName: 'Emergency Plumbing',
            }),
          }),
        );
      });

      it('should send notifications to all admins when request is created', async () => {
        prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
        prismaService.workLocation.findFirst = jest
          .fn()
          .mockResolvedValue(mockLocation);
        prismaService.request.create = jest
          .fn()
          .mockResolvedValue(mockRequestWithRelations);

        await service.create(createRequestDto, mockUserId);

        // Should call getAdminUserIds
        expect((service as any).getAdminUserIds).toHaveBeenCalled();

        // Should send to each admin (3 total: 1 client + 2 admins)
        expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(3);
      });

      it('should not fail request creation if notification fails', async () => {
        prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
        prismaService.workLocation.findFirst = jest
          .fn()
          .mockResolvedValue(mockLocation);
        prismaService.request.create = jest
          .fn()
          .mockResolvedValue(mockRequestWithRelations);
        mockNotificationService.createNotification = jest
          .fn()
          .mockRejectedValue(new Error('Notification service unavailable'));

        const result = await service.create(createRequestDto, mockUserId);

        expect(result).toEqual(mockRequestWithRelations);
      });

      it('should log error if notification service fails', async () => {
        const loggerSpy = jest.spyOn((service as any).logger, 'error');
        prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
        prismaService.workLocation.findFirst = jest
          .fn()
          .mockResolvedValue(mockLocation);
        prismaService.request.create = jest
          .fn()
          .mockResolvedValue(mockRequestWithRelations);
        mockNotificationService.createNotification = jest
          .fn()
          .mockRejectedValue(new Error('Notification service error'));

        await service.create(createRequestDto, mockUserId);

        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('Failed to send request creation notifications'),
        );
      });
    });

    describe('Request Assignment Notifications', () => {
      it('should send notification to assigned employee', async () => {
        const assignedRequest = {
          ...mockRequestWithRelations,
          assignedToId: mockEmployeeId,
          status: RequestStatus.ONGOING,
        };

        prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
        prismaService.user.findUnique = jest.fn().mockResolvedValue(mockEmployee);
        prismaService.request.update = jest.fn().mockResolvedValue(assignedRequest);

        await service.assign(mockRequestId, { assignedToId: mockEmployeeId }, mockUserId, UserRole.ADMIN);

        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: mockEmployeeId,
            type: 'REQUEST_ASSIGNED',
            message: expect.stringContaining('assigned'),
          }),
        );
      });

      it('should send notification to request creator on assignment', async () => {
        const assignedRequest = {
          ...mockRequestWithRelations,
          assignedToId: mockEmployeeId,
          status: RequestStatus.ONGOING,
        };

        prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
        prismaService.user.findUnique = jest.fn().mockResolvedValue(mockEmployee);
        prismaService.request.update = jest.fn().mockResolvedValue(assignedRequest);

        await service.assign(mockRequestId, { assignedToId: mockEmployeeId }, mockUserId, UserRole.ADMIN);

        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: mockUserId,
            type: 'REQUEST_ASSIGNED',
          }),
        );
      });

      it('should log error if notification fails but complete assignment', async () => {
        const loggerSpy = jest.spyOn((service as any).logger, 'error');
        const assignedRequest = {
          ...mockRequestWithRelations,
          assignedToId: mockEmployeeId,
          status: RequestStatus.ONGOING,
        };

        prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
        prismaService.user.findUnique = jest.fn().mockResolvedValue(mockEmployee);
        prismaService.request.update = jest.fn().mockResolvedValue(assignedRequest);
        mockNotificationService.createNotification = jest
          .fn()
          .mockRejectedValue(new Error('Notification error'));

        const result = await service.assign(mockRequestId, { assignedToId: mockEmployeeId }, mockUserId, UserRole.ADMIN);

        expect(result).toEqual(assignedRequest);
        expect(loggerSpy).toHaveBeenCalledWith(
          expect.stringContaining('Failed to send assignment notifications'),
        );
      });
    });

    describe('Cancellation Request Notifications', () => {
      it('should send cancellation notification to client for PENDING requests', async () => {
        const cancelledRequest = {
          ...mockRequestWithRelations,
          status: RequestStatus.CANCELLED,
        };

        prismaService.request.findFirst = jest.fn().mockResolvedValue(mockRequest);
        prismaService.request.update = jest.fn().mockResolvedValue(cancelledRequest);

        await service.requestCancellation(
          mockRequestId,
          { reason: 'Test reason' },
          mockUserId,
          UserRole.CLIENT,
        );

        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: mockUserId,
            type: 'REQUEST_CANCELLED',
            message: expect.stringContaining('cancelled'),
          }),
        );
      });

      it('should send cancellation request notification to admins for ONGOING requests', async () => {
        const ongoingRequest = {
          ...mockRequest,
          status: RequestStatus.ONGOING,
        };
        const updatedRequest = {
          ...mockRequestWithRelations,
          status: RequestStatus.ONGOING,
          cancellationRequested: true,
        };

        prismaService.request.findFirst = jest.fn().mockResolvedValue(ongoingRequest);
        prismaService.request.update = jest.fn().mockResolvedValue(updatedRequest);

        await service.requestCancellation(
          mockRequestId,
          { reason: 'Test reason' },
          mockUserId,
          UserRole.CLIENT,
        );

        // Should call getAdminUserIds
        expect((service as any).getAdminUserIds).toHaveBeenCalled();

        // Should send to admins (2 admins)
        expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(2);
      });

      it('should send cancellation request notification to employee for ONGOING requests', async () => {
        const ongoingRequest = {
          ...mockRequest,
          status: RequestStatus.ONGOING,
          assignedToId: mockEmployeeId,
        };
        const updatedRequest = {
          ...mockRequestWithRelations,
          status: RequestStatus.ONGOING,
          assignedToId: mockEmployeeId,
          cancellationRequested: true,
        };

        prismaService.request.findFirst = jest.fn().mockResolvedValue(ongoingRequest);
        prismaService.request.update = jest.fn().mockResolvedValue(updatedRequest);

        await service.requestCancellation(
          mockRequestId,
          { reason: 'Test reason' },
          mockUserId,
          UserRole.CLIENT,
        );

        // Should send to admins + employee (3 total)
        expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(3);
      });

      it('should not send employee notification if request unassigned', async () => {
        const ongoingRequest = {
          ...mockRequest,
          status: RequestStatus.ONGOING,
          assignedToId: null,
        };
        const updatedRequest = {
          ...mockRequestWithRelations,
          status: RequestStatus.ONGOING,
          assignedToId: null,
          cancellationRequested: true,
        };

        prismaService.request.findFirst = jest.fn().mockResolvedValue(ongoingRequest);
        prismaService.request.update = jest.fn().mockResolvedValue(updatedRequest);

        await service.requestCancellation(
          mockRequestId,
          { reason: 'Test reason' },
          mockUserId,
          UserRole.CLIENT,
        );

        // Should only send to admins (2 total)
        expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(2);
      });
    });

    describe('Completion Notifications', () => {
      it('should send completion notification to client', async () => {
        const ongoingRequest = {
          ...mockRequest,
          status: RequestStatus.ONGOING,
          assignedToId: mockEmployeeId,
        };
        const completedRequest = {
          ...mockRequestWithRelations,
          status: RequestStatus.COMPLETED,
        };

        prismaService.request.findFirst = jest.fn().mockResolvedValue(ongoingRequest);
        prismaService.request.update = jest.fn().mockResolvedValue(completedRequest);

        await service.complete(
          mockRequestId,
          { notes: 'Work completed successfully' },
          mockEmployeeId,
          UserRole.EMPLOYEE,
        );

        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            userId: mockUserId,
            type: 'REQUEST_COMPLETED',
            message: expect.stringContaining('completed'),
          }),
        );
      });

      it('should include completion notes in notification data', async () => {
        const ongoingRequest = {
          ...mockRequest,
          status: RequestStatus.ONGOING,
          assignedToId: mockEmployeeId,
        };
        const completedRequest = {
          ...mockRequestWithRelations,
          status: RequestStatus.COMPLETED,
        };
        const completionNotes = 'Work completed successfully';

        prismaService.request.findFirst = jest.fn().mockResolvedValue(ongoingRequest);
        prismaService.request.update = jest.fn().mockResolvedValue(completedRequest);

        await service.complete(
          mockRequestId,
          { notes: completionNotes },
          mockEmployeeId,
          UserRole.EMPLOYEE,
        );

        expect(mockNotificationService.createNotification).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              completionNotes: completionNotes,
            }),
          }),
        );
      });
    });

    describe('Error Handling', () => {
      it('should handle NotificationService being unavailable', async () => {
        (service as any).notificationService = null;

        prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
        prismaService.workLocation.findFirst = jest
          .fn()
          .mockResolvedValue(mockLocation);
        prismaService.request.create = jest
          .fn()
          .mockResolvedValue(mockRequestWithRelations);

        // Should not throw, just complete the operation
        await expect(service.create(createRequestDto, mockUserId)).resolves.toBeDefined();
      });

      it('should handle getAdminUserIds returning empty array', async () => {
        (service as any).getAdminUserIds = jest.fn().mockResolvedValue([]);

        prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
        prismaService.workLocation.findFirst = jest
          .fn()
          .mockResolvedValue(mockLocation);
        prismaService.request.create = jest
          .fn()
          .mockResolvedValue(mockRequestWithRelations);

        await service.create(createRequestDto, mockUserId);

        // Should still send client notification (1 call)
        expect(mockNotificationService.createNotification).toHaveBeenCalledTimes(1);
      });

      it('should properly log all notification errors', async () => {
        const loggerSpy = jest.spyOn((service as any).logger, 'error');
        mockNotificationService.createNotification = jest
          .fn()
          .mockRejectedValue(new Error('Test error'));

        prismaService.service.findFirst = jest.fn().mockResolvedValue(mockService);
        prismaService.workLocation.findFirst = jest
          .fn()
          .mockResolvedValue(mockLocation);
        prismaService.request.create = jest
          .fn()
          .mockResolvedValue(mockRequestWithRelations);

        await service.create(createRequestDto, mockUserId);

        expect(loggerSpy).toHaveBeenCalled();
        expect(loggerSpy.mock.calls[0][0]).toContain('Failed to send');
      });
    });
  });
});
