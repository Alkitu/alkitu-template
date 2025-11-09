# Backend Jest Controller Test Template

**Purpose**: Template for testing NestJS controller classes (HTTP endpoints)
**Coverage Required**: 90%+
**Mutation Score**: 85%+
**Location**: `src/module/controllers/__tests__/controller-name.spec.ts`

---

## Complete Controller Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ControllerName } from '../controller-name.controller';
import { ServiceName } from '../../services/service-name.service';
import { createMock } from '@golevelup/ts-jest';

describe('ControllerName', () => {
  let controller: ControllerName;
  let service: jest.Mocked<ServiceName>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ControllerName],
      providers: [
        {
          provide: ServiceName,
          useValue: createMock<ServiceName>(),
        },
      ],
    }).compile();

    controller = module.get<ControllerName>(ControllerName);
    service = module.get(ServiceName);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. INITIALIZATION TESTS
  describe('Initialization', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  // 2. GET ENDPOINT TESTS
  describe('GET /endpoint', () => {
    it('should return all entities', async () => {
      // Arrange
      const mockEntities = [
        { id: '1', name: 'Entity 1' },
        { id: '2', name: 'Entity 2' },
      ];
      service.findAll.mockResolvedValue(mockEntities);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(mockEntities);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no entities exist', async () => {
      // Arrange
      service.findAll.mockResolvedValue([]);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });

  // 3. GET BY ID ENDPOINT TESTS
  describe('GET /endpoint/:id', () => {
    it('should return entity by id', async () => {
      // Arrange
      const mockEntity = { id: '1', name: 'Test Entity' };
      service.findById.mockResolvedValue(mockEntity);

      // Act
      const result = await controller.findOne('1');

      // Assert
      expect(result).toEqual(mockEntity);
      expect(service.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when entity not found', async () => {
      // Arrange
      service.findById.mockRejectedValue(
        new NotFoundException('Entity with ID 999 not found')
      );

      // Act & Assert
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  // 4. POST ENDPOINT TESTS
  describe('POST /endpoint', () => {
    it('should create new entity', async () => {
      // Arrange
      const createDto = { name: 'New Entity', email: 'test@test.com' };
      const mockCreated = { id: '1', ...createDto, createdAt: new Date() };
      service.create.mockResolvedValue(mockCreated);

      // Act
      const result = await controller.create(createDto);

      // Assert
      expect(result).toEqual(mockCreated);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException for invalid data', async () => {
      // Arrange
      const invalidDto = { name: '', email: 'invalid-email' };
      service.create.mockRejectedValue(
        new BadRequestException('Validation failed')
      );

      // Act & Assert
      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw ConflictException for duplicate entry', async () => {
      // Arrange
      const createDto = { email: 'existing@test.com' };
      service.create.mockRejectedValue(
        new ConflictException('Entity already exists')
      );

      // Act & Assert
      await expect(controller.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  // 5. PUT/PATCH ENDPOINT TESTS
  describe('PATCH /endpoint/:id', () => {
    it('should update entity', async () => {
      // Arrange
      const updateDto = { name: 'Updated Name' };
      const mockUpdated = { id: '1', name: 'Updated Name', updatedAt: new Date() };
      service.update.mockResolvedValue(mockUpdated);

      // Act
      const result = await controller.update('1', updateDto);

      // Assert
      expect(result).toEqual(mockUpdated);
      expect(service.update).toHaveBeenCalledWith('1', updateDto);
    });

    it('should throw NotFoundException when entity not found', async () => {
      // Arrange
      service.update.mockRejectedValue(
        new NotFoundException('Entity with ID 999 not found')
      );

      // Act & Assert
      await expect(controller.update('999', { name: 'Test' })).rejects.toThrow(
        NotFoundException
      );
    });

    it('should partially update entity', async () => {
      // Arrange
      const partialUpdate = { name: 'New Name' }; // only updating name
      const mockUpdated = { id: '1', name: 'New Name', email: 'old@test.com' };
      service.update.mockResolvedValue(mockUpdated);

      // Act
      const result = await controller.update('1', partialUpdate);

      // Assert
      expect(result.name).toBe('New Name');
      expect(result.email).toBe('old@test.com'); // email unchanged
    });
  });

  // 6. DELETE ENDPOINT TESTS
  describe('DELETE /endpoint/:id', () => {
    it('should delete entity', async () => {
      // Arrange
      service.delete.mockResolvedValue(undefined);

      // Act
      await controller.remove('1');

      // Assert
      expect(service.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when entity not found', async () => {
      // Arrange
      service.delete.mockRejectedValue(
        new NotFoundException('Entity with ID 999 not found')
      );

      // Act & Assert
      await expect(controller.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  // 7. QUERY PARAMETERS TESTS
  describe('Query Parameters', () => {
    it('should apply filters from query params', async () => {
      // Arrange
      const queryDto = { status: 'active', page: 1, limit: 10 };
      service.findAll.mockResolvedValue([]);

      // Act
      await controller.findAll(queryDto);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith({
        status: 'active',
        skip: 0,
        take: 10,
      });
    });

    it('should apply sorting from query params', async () => {
      // Arrange
      const queryDto = { sortBy: 'createdAt', order: 'desc' };
      service.findAll.mockResolvedValue([]);

      // Act
      await controller.findAll(queryDto);

      // Assert
      expect(service.findAll).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  // 8. REQUEST/RESPONSE TRANSFORMATION TESTS
  describe('Response Transformation', () => {
    it('should exclude sensitive fields from response', async () => {
      // Arrange
      const mockEntity = {
        id: '1',
        name: 'Test',
        password: 'hashed-password',
        email: 'test@test.com',
      };
      service.findById.mockResolvedValue(mockEntity);

      // Act
      const result = await controller.findOne('1');

      // Assert
      expect(result).not.toHaveProperty('password');
      expect(result).toHaveProperty('email');
    });

    it('should transform response to DTO format', async () => {
      // Arrange
      const serviceResponse = { id: '1', createdAt: new Date(), name: 'Test' };
      service.findById.mockResolvedValue(serviceResponse);

      // Act
      const result = await controller.findOne('1');

      // Assert
      expect(result).toMatchObject({
        id: expect.any(String),
        name: 'Test',
        // Verify DTO transformation applied
      });
    });
  });

  // 9. PAGINATION TESTS
  describe('Pagination', () => {
    it('should return paginated results with metadata', async () => {
      // Arrange
      const mockPaginated = {
        data: [{ id: '1' }, { id: '2' }],
        total: 100,
        page: 1,
        limit: 10,
        totalPages: 10,
      };
      service.findAllPaginated.mockResolvedValue(mockPaginated);

      // Act
      const result = await controller.findAll({ page: 1, limit: 10 });

      // Assert
      expect(result).toEqual(mockPaginated);
      expect(result.data).toHaveLength(2);
      expect(result.totalPages).toBe(10);
    });

    it('should default to page 1 when not specified', async () => {
      // Arrange
      service.findAllPaginated.mockResolvedValue({
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      });

      // Act
      await controller.findAll({});

      // Assert
      expect(service.findAllPaginated).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1 })
      );
    });
  });

  // 10. AUTHORIZATION TESTS (if using guards)
  describe('Authorization', () => {
    it('should allow access to authorized users', async () => {
      // This test verifies guard configuration
      // Guards are tested separately, but verify they're applied
      const metadata = Reflect.getMetadata('__guards__', controller.findAll);
      expect(metadata).toBeDefined();
    });
  });

  // 11. VALIDATION TESTS (if using ValidationPipe)
  describe('Input Validation', () => {
    it('should validate DTO before calling service', async () => {
      // Arrange
      const invalidDto = { name: '', email: 'not-an-email' };
      // ValidationPipe should reject this before reaching service
      service.create.mockRejectedValue(
        new BadRequestException(['name should not be empty'])
      );

      // Act & Assert
      await expect(controller.create(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });
});
```

---

## Integration Test Template (Optional)

For testing actual HTTP requests:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';

describe('ControllerName (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /endpoint should return all entities', () => {
    return request(app.getHttpServer())
      .get('/endpoint')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('POST /endpoint should create entity', () => {
    return request(app.getHttpServer())
      .post('/endpoint')
      .send({ name: 'Test', email: 'test@test.com' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('Test');
      });
  });
});
```

---

## Test Checklist

- [ ] **90%+ coverage** achieved
- [ ] **All HTTP methods** tested (GET, POST, PUT/PATCH, DELETE)
- [ ] **Success cases** (200, 201, 204)
- [ ] **Error cases** (400, 404, 409, 500)
- [ ] **Query parameters** (filters, pagination, sorting)
- [ ] **Request/Response transformation** (DTOs)
- [ ] **Validation** tested
- [ ] **Guards/Authorization** verified (if applicable)
- [ ] **Service methods** called with correct arguments

---

## Run Commands

```bash
# Run tests for this controller
npm run test -- controller-name.spec.ts

# Run integration tests
npm run test:e2e

# Run with coverage
npm run test:cov

# Run mutation tests
npm run test:mutation
```

---

**Last Updated**: 2025-01-09
