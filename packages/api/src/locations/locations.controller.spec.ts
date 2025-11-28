import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { WorkLocation } from '@prisma/client';

describe('LocationsController (ALI-117)', () => {
  let controller: LocationsController;
  let service: jest.Mocked<LocationsService>;

  const mockUserId = '507f1f77bcf86cd799439011';
  const mockLocationId = '507f1f77bcf86cd799439012';

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

  const mockRequest = {
    user: {
      userId: mockUserId,
      email: 'test@example.com',
      role: 'CLIENT',
    },
  };

  const createLocationDto: CreateLocationDto = {
    street: '123 Main St',
    building: 'Suite 100',
    city: 'New York',
    zip: '10001',
    state: 'NY',
  };

  const updateLocationDto: UpdateLocationDto = {
    street: '456 Oak Ave',
    city: 'Brooklyn',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useValue: {
            create: jest.fn(),
            findAllByUser: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            count: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<LocationsController>(LocationsController);
    service = module.get<LocationsService>(
      LocationsService,
    ) as jest.Mocked<LocationsService>;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a location successfully', async () => {
      service.create.mockResolvedValue(mockLocation);

      const result = await controller.create(createLocationDto, mockRequest as any);

      expect(service.create).toHaveBeenCalledWith(mockUserId, createLocationDto);
      expect(result).toEqual(mockLocation);
    });

    it('should pass the authenticated user ID to service', async () => {
      service.create.mockResolvedValue(mockLocation);

      await controller.create(createLocationDto, mockRequest as any);

      expect(service.create).toHaveBeenCalledWith(
        mockRequest.user.userId,
        createLocationDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all locations for the authenticated user', async () => {
      const mockLocations = [
        mockLocation,
        { ...mockLocation, id: 'location2', street: '456 Oak Ave' },
      ];
      service.findAllByUser.mockResolvedValue(mockLocations);

      const result = await controller.findAll(mockRequest as any);

      expect(service.findAllByUser).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockLocations);
      expect(result).toHaveLength(2);
    });

    it('should return empty array if user has no locations', async () => {
      service.findAllByUser.mockResolvedValue([]);

      const result = await controller.findAll(mockRequest as any);

      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  describe('findOne', () => {
    it('should return a specific location by ID', async () => {
      service.findOne.mockResolvedValue(mockLocation);

      const result = await controller.findOne(mockLocationId, mockRequest as any);

      expect(service.findOne).toHaveBeenCalledWith(mockLocationId, mockUserId);
      expect(result).toEqual(mockLocation);
    });

    it('should pass both location ID and user ID to service', async () => {
      service.findOne.mockResolvedValue(mockLocation);

      await controller.findOne(mockLocationId, mockRequest as any);

      expect(service.findOne).toHaveBeenCalledWith(mockLocationId, mockUserId);
    });
  });

  describe('update', () => {
    it('should update a location successfully', async () => {
      const updatedLocation = { ...mockLocation, ...updateLocationDto };
      service.update.mockResolvedValue(updatedLocation);

      const result = await controller.update(
        mockLocationId,
        updateLocationDto,
        mockRequest as any,
      );

      expect(service.update).toHaveBeenCalledWith(
        mockLocationId,
        mockUserId,
        updateLocationDto,
      );
      expect(result).toEqual(updatedLocation);
    });

    it('should pass location ID, user ID, and DTO to service', async () => {
      const updatedLocation = { ...mockLocation, ...updateLocationDto };
      service.update.mockResolvedValue(updatedLocation);

      await controller.update(
        mockLocationId,
        updateLocationDto,
        mockRequest as any,
      );

      expect(service.update).toHaveBeenCalledWith(
        mockLocationId,
        mockRequest.user.userId,
        updateLocationDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a location successfully', async () => {
      service.remove.mockResolvedValue(mockLocation);

      const result = await controller.remove(mockLocationId, mockRequest as any);

      expect(service.remove).toHaveBeenCalledWith(mockLocationId, mockUserId);
      expect(result).toEqual(mockLocation);
    });

    it('should pass both location ID and user ID to service', async () => {
      service.remove.mockResolvedValue(mockLocation);

      await controller.remove(mockLocationId, mockRequest as any);

      expect(service.remove).toHaveBeenCalledWith(mockLocationId, mockUserId);
    });
  });

  describe('integration behavior', () => {
    it('should handle multiple operations in sequence', async () => {
      // Create
      service.create.mockResolvedValue(mockLocation);
      const created = await controller.create(createLocationDto, mockRequest as any);
      expect(created).toEqual(mockLocation);

      // Find all
      service.findAllByUser.mockResolvedValue([mockLocation]);
      const all = await controller.findAll(mockRequest as any);
      expect(all).toHaveLength(1);

      // Update
      const updatedLocation = { ...mockLocation, ...updateLocationDto };
      service.update.mockResolvedValue(updatedLocation);
      const updated = await controller.update(
        mockLocationId,
        updateLocationDto,
        mockRequest as any,
      );
      expect(updated.street).toBe(updateLocationDto.street);

      // Delete
      service.remove.mockResolvedValue(mockLocation);
      const deleted = await controller.remove(mockLocationId, mockRequest as any);
      expect(deleted).toEqual(mockLocation);
    });

    it('should always use authenticated user ID from request', async () => {
      const operations = [
        () => controller.create(createLocationDto, mockRequest as any),
        () => controller.findAll(mockRequest as any),
        () => controller.findOne(mockLocationId, mockRequest as any),
        () =>
          controller.update(
            mockLocationId,
            updateLocationDto,
            mockRequest as any,
          ),
        () => controller.remove(mockLocationId, mockRequest as any),
      ];

      service.create.mockResolvedValue(mockLocation);
      service.findAllByUser.mockResolvedValue([mockLocation]);
      service.findOne.mockResolvedValue(mockLocation);
      service.update.mockResolvedValue(mockLocation);
      service.remove.mockResolvedValue(mockLocation);

      for (const operation of operations) {
        await operation();
      }

      // Verify all service calls used the correct user ID
      expect(service.create).toHaveBeenCalledWith(
        mockUserId,
        expect.anything(),
      );
      expect(service.findAllByUser).toHaveBeenCalledWith(mockUserId);
      expect(service.findOne).toHaveBeenCalledWith(
        expect.anything(),
        mockUserId,
      );
      expect(service.update).toHaveBeenCalledWith(
        expect.anything(),
        mockUserId,
        expect.anything(),
      );
      expect(service.remove).toHaveBeenCalledWith(expect.anything(), mockUserId);
    });
  });
});
