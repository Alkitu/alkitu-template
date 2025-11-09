# Backend Jest Service Test Template

**Purpose**: Template for testing NestJS service classes (business logic layer)
**Coverage Required**: 95%+
**Mutation Score**: 90%+ for critical services
**Location**: `src/module/services/__tests__/service-name.spec.ts`

---

## Complete Service Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceName } from '../service-name.service';
import { IRepository } from '../../repositories/interfaces/repository.interface';
import { Logger } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('ServiceName', () => {
  let service: ServiceName;
  let repository: jest.Mocked<IRepository>;
  let logger: jest.Mocked<Logger>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceName,
        {
          provide: 'IRepository',
          useValue: createMock<IRepository>(),
        },
        {
          provide: Logger,
          useValue: createMock<Logger>(),
        },
      ],
    }).compile();

    service = module.get<ServiceName>(ServiceName);
    repository = module.get('IRepository');
    logger = module.get(Logger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. INITIALIZATION TESTS
  describe('Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should have required dependencies injected', () => {
      expect(repository).toBeDefined();
      expect(logger).toBeDefined();
    });
  });

  // 2. HAPPY PATH TESTS
  describe('methodName', () => {
    it('should return expected result with valid input', async () => {
      // Arrange
      const inputData = { id: '1', name: 'Test' };
      const expectedResult = { id: '1', name: 'Test', status: 'active' };
      repository.findById.mockResolvedValue(inputData);

      // Act
      const result = await service.methodName('1');

      // Assert
      expect(result).toEqual(expectedResult);
      expect(repository.findById).toHaveBeenCalledWith('1');
      expect(repository.findById).toHaveBeenCalledTimes(1);
    });

    it('should process data correctly', async () => {
      // Arrange
      const mockData = { value: 100 };
      repository.getData.mockResolvedValue(mockData);

      // Act
      const result = await service.methodName();

      // Assert
      expect(result.value).toBe(100);
      expect(result.processed).toBe(true);
    });
  });

  // 3. ERROR HANDLING TESTS
  describe('Error Handling', () => {
    it('should throw NotFoundException when entity not found', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.methodName('999')).rejects.toThrow(
        'Entity with ID 999 not found'
      );
    });

    it('should throw ConflictException for duplicate entries', async () => {
      // Arrange
      repository.findByEmail.mockResolvedValue({ id: '1', email: 'test@test.com' });

      // Act & Assert
      await expect(
        service.createEntity({ email: 'test@test.com' })
      ).rejects.toThrow('Entity already exists');
    });

    it('should log error and rethrow on repository failure', async () => {
      // Arrange
      const error = new Error('Database connection failed');
      repository.save.mockRejectedValue(error);

      // Act & Assert
      await expect(service.saveEntity({ data: 'test' })).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to save entity',
        expect.any(Object)
      );
    });
  });

  // 4. VALIDATION TESTS
  describe('Validation', () => {
    it('should throw BadRequestException for invalid input', async () => {
      // Act & Assert
      await expect(service.methodName(null)).rejects.toThrow('Invalid input');
    });

    it('should validate required fields', async () => {
      // Arrange
      const invalidData = { name: '' }; // missing required field

      // Act & Assert
      await expect(service.createEntity(invalidData)).rejects.toThrow(
        'Name is required'
      );
    });
  });

  // 5. BUSINESS LOGIC TESTS
  describe('Business Logic', () => {
    it('should apply business rules correctly', async () => {
      // Arrange
      const entity = { id: '1', price: 100, quantity: 5 };
      repository.findById.mockResolvedValue(entity);

      // Act
      const result = await service.calculateTotal('1');

      // Assert
      expect(result.total).toBe(500); // price * quantity
      expect(result.tax).toBe(50); // 10% tax
      expect(result.grandTotal).toBe(550);
    });

    it('should handle edge cases in calculations', async () => {
      // Arrange
      const entity = { id: '1', price: 0, quantity: 100 };
      repository.findById.mockResolvedValue(entity);

      // Act
      const result = await service.calculateTotal('1');

      // Assert
      expect(result.total).toBe(0);
      expect(result.tax).toBe(0);
    });
  });

  // 6. DEPENDENCY INTERACTION TESTS
  describe('Dependency Interactions', () => {
    it('should call repository with correct parameters', async () => {
      // Arrange
      const createData = { name: 'Test', email: 'test@test.com' };
      repository.create.mockResolvedValue({ id: '1', ...createData });

      // Act
      await service.createEntity(createData);

      // Assert
      expect(repository.create).toHaveBeenCalledWith({
        name: 'Test',
        email: 'test@test.com',
      });
    });

    it('should call multiple dependencies in correct order', async () => {
      // Arrange
      const callOrder: string[] = [];
      repository.findById.mockImplementation(async () => {
        callOrder.push('repository.findById');
        return { id: '1' };
      });
      repository.update.mockImplementation(async () => {
        callOrder.push('repository.update');
        return { id: '1', updated: true };
      });

      // Act
      await service.updateEntity('1', { data: 'new' });

      // Assert
      expect(callOrder).toEqual(['repository.findById', 'repository.update']);
    });
  });

  // 7. ASYNC OPERATIONS TESTS
  describe('Async Operations', () => {
    it('should handle concurrent operations correctly', async () => {
      // Arrange
      repository.findById.mockResolvedValue({ id: '1', name: 'Test' });

      // Act
      const results = await Promise.all([
        service.methodName('1'),
        service.methodName('1'),
        service.methodName('1'),
      ]);

      // Assert
      expect(results).toHaveLength(3);
      expect(repository.findById).toHaveBeenCalledTimes(3);
    });

    it('should handle timeout scenarios', async () => {
      // Arrange
      repository.findById.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({ id: '1' }), 5000))
      );

      // Act & Assert
      await expect(
        Promise.race([
          service.methodName('1'),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), 100)
          ),
        ])
      ).rejects.toThrow('Timeout');
    });
  });

  // 8. LOGGING TESTS
  describe('Logging', () => {
    it('should log important operations', async () => {
      // Arrange
      const data = { id: '1', name: 'Test' };
      repository.create.mockResolvedValue(data);

      // Act
      await service.createEntity(data);

      // Assert
      expect(logger.log).toHaveBeenCalledWith(
        'Entity created successfully',
        expect.any(Object)
      );
    });

    it('should log errors with context', async () => {
      // Arrange
      const error = new Error('Test error');
      repository.findById.mockRejectedValue(error);

      // Act
      try {
        await service.methodName('1');
      } catch (e) {
        // Expected error
      }

      // Assert
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed'),
        expect.objectContaining({ error })
      );
    });
  });

  // 9. EDGE CASES
  describe('Edge Cases', () => {
    it('should handle empty arrays', async () => {
      // Arrange
      repository.findAll.mockResolvedValue([]);

      // Act
      const result = await service.getAll();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it('should handle null values', async () => {
      // Arrange
      repository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.methodName('999')).rejects.toThrow();
    });

    it('should handle very large datasets', async () => {
      // Arrange
      const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
        id: `${i}`,
        name: `Item ${i}`,
      }));
      repository.findAll.mockResolvedValue(largeDataset);

      // Act
      const result = await service.processLargeDataset();

      // Assert
      expect(result).toBeDefined();
      expect(result.processed).toBe(10000);
    });
  });

  // 10. TRANSACTION TESTS (if applicable)
  describe('Transactions', () => {
    it('should rollback on error', async () => {
      // Arrange
      repository.beginTransaction.mockResolvedValue(undefined);
      repository.create.mockRejectedValue(new Error('Insert failed'));
      repository.rollback.mockResolvedValue(undefined);

      // Act & Assert
      await expect(service.createWithTransaction({ data: 'test' })).rejects.toThrow();
      expect(repository.rollback).toHaveBeenCalled();
    });

    it('should commit on success', async () => {
      // Arrange
      repository.beginTransaction.mockResolvedValue(undefined);
      repository.create.mockResolvedValue({ id: '1', data: 'test' });
      repository.commit.mockResolvedValue(undefined);

      // Act
      await service.createWithTransaction({ data: 'test' });

      // Assert
      expect(repository.commit).toHaveBeenCalled();
    });
  });
});
```

---

## Test Checklist

- [ ] **95%+ coverage** achieved (lines, branches, functions, statements)
- [ ] **Happy path** tested (expected behavior)
- [ ] **Error cases** tested (NotFoundException, ConflictException, etc.)
- [ ] **Validation** tested (invalid inputs)
- [ ] **Business logic** tested (calculations, rules)
- [ ] **Dependencies** mocked correctly
- [ ] **Async operations** handled
- [ ] **Logging** verified
- [ ] **Edge cases** covered (null, empty, large datasets)
- [ ] **Transactions** tested (if applicable)

---

## Run Commands

```bash
# Run tests for this service
npm run test -- service-name.spec.ts

# Run in watch mode (TDD)
npm run test:tdd

# Run with coverage
npm run test:cov

# Run mutation tests
npm run test:mutation

# Run all quality gates
npm run quality:gates
```

---

**Last Updated**: 2025-01-09
