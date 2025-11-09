# Backend Jest Contract Test Template

**Purpose**: Template for contract testing (interface compliance)
**Coverage Required**: 100% (all interface methods must be tested)
**Mutation Score**: 90%+
**Location**: `src/module/services/__tests__/service-name.contract.spec.ts`

---

## What is Contract Testing?

Contract tests verify that:
1. Implementation classes correctly implement their interfaces
2. All interface methods are present and work as specified
3. Method signatures match the interface
4. Return types are correct
5. Exceptions are thrown as specified

**This ensures SOLID principles compliance**, specifically:
- **Liskov Substitution Principle**: Any implementation can substitute the interface
- **Interface Segregation Principle**: Interfaces are properly defined

---

## Complete Contract Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { IServiceName } from '../interfaces/service-name.interface';
import { ServiceNameImpl } from '../service-name.service';
import { createMock } from '@golevelup/ts-jest';

describe('IServiceName Contract', () => {
  let service: IServiceName;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'IServiceName',
          useClass: ServiceNameImpl,
        },
        // Mock all dependencies
        {
          provide: 'IDependency',
          useValue: createMock(),
        },
      ],
    }).compile();

    service = module.get<IServiceName>('IServiceName');
  });

  describe('Contract Compliance', () => {
    it('should implement all interface methods', () => {
      // Verify all methods from interface exist on implementation
      expect(service.methodOne).toBeDefined();
      expect(service.methodTwo).toBeDefined();
      expect(service.methodThree).toBeDefined();

      // Verify methods are functions
      expect(typeof service.methodOne).toBe('function');
      expect(typeof service.methodTwo).toBe('function');
      expect(typeof service.methodThree).toBe('function');
    });

    it('should be an instance of the interface type', () => {
      // TypeScript compile-time check (no runtime verification needed)
      const _typeCheck: IServiceName = service;
      expect(_typeCheck).toBe(service);
    });
  });

  // TEST EACH INTERFACE METHOD

  describe('methodOne()', () => {
    it('should return expected type', async () => {
      // Arrange
      const input = { id: '1', name: 'Test' };

      // Act
      const result = await service.methodOne(input);

      // Assert
      expect(result).toBeDefined();
      expect(typeof result).toBe('object'); // or specific type
      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('name');
    });

    it('should accept valid input as per interface', async () => {
      // Verify method accepts input defined in interface
      const validInput = { id: '1', name: 'Valid' };

      await expect(service.methodOne(validInput)).resolves.toBeDefined();
    });

    it('should throw specified exception for invalid input', async () => {
      // If interface specifies exceptions, verify they are thrown
      const invalidInput = null;

      await expect(service.methodOne(invalidInput)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('methodTwo()', () => {
    it('should return array of expected type', async () => {
      // Act
      const result = await service.methodTwo();

      // Assert
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('id');
      }
    });

    it('should accept optional parameters', async () => {
      // If method has optional params per interface
      await expect(service.methodTwo({ filter: 'active' })).resolves.toBeDefined();
      await expect(service.methodTwo()).resolves.toBeDefined();
    });
  });

  describe('methodThree()', () => {
    it('should return void/undefined as specified', async () => {
      // Act
      const result = await service.methodThree('1');

      // Assert
      expect(result).toBeUndefined(); // if interface specifies void
    });

    it('should handle required parameters', async () => {
      // Verify required params are enforced
      await expect(service.methodThree('required-id')).resolves.toBeUndefined();
    });
  });

  // BEHAVIOR VERIFICATION (beyond signatures)

  describe('Behavioral Contracts', () => {
    it('should not modify input objects (immutability)', async () => {
      // Arrange
      const input = { id: '1', data: 'original' };
      const inputCopy = { ...input };

      // Act
      await service.methodOne(input);

      // Assert
      expect(input).toEqual(inputCopy);
    });

    it('should handle null/undefined per interface specification', async () => {
      // If interface allows null
      if (/* interface allows null */ true) {
        await expect(service.methodOne(null)).resolves.toBeDefined();
      } else {
        await expect(service.methodOne(null)).rejects.toThrow();
      }
    });

    it('should return consistent results for same input', async () => {
      // Idempotency test
      const input = { id: '1' };

      const result1 = await service.methodOne(input);
      const result2 = await service.methodOne(input);

      expect(result1).toEqual(result2);
    });
  });

  // EXCEPTION CONTRACTS

  describe('Exception Handling Contracts', () => {
    it('should throw NotFoundException as per interface', async () => {
      // If interface specifies NotFoundException for certain conditions
      await expect(service.methodOne({ id: 'non-existent' })).rejects.toThrow(
        NotFoundException
      );
    });

    it('should throw ConflictException as per interface', async () => {
      // If interface specifies ConflictException
      await expect(service.methodOne({ id: 'duplicate' })).rejects.toThrow(
        ConflictException
      );
    });

    it('should throw BadRequestException for invalid input', async () => {
      // If interface specifies validation
      await expect(service.methodOne({ id: '', name: '' })).rejects.toThrow(
        BadRequestException
      );
    });
  });

  // ASYNC CONTRACTS

  describe('Async Behavior Contracts', () => {
    it('should return Promise for async methods', () => {
      // Verify methods return promises
      const result = service.methodOne({ id: '1' });
      expect(result).toBeInstanceOf(Promise);
    });

    it('should handle concurrent calls correctly', async () => {
      // Verify implementation can handle parallel calls
      const calls = [
        service.methodOne({ id: '1' }),
        service.methodOne({ id: '2' }),
        service.methodOne({ id: '3' }),
      ];

      const results = await Promise.all(calls);

      expect(results).toHaveLength(3);
      expect(results[0]).toBeDefined();
      expect(results[1]).toBeDefined();
      expect(results[2]).toBeDefined();
    });
  });

  // STATE CONTRACTS (if stateful)

  describe('State Management Contracts', () => {
    it('should maintain state correctly across method calls', async () => {
      // If interface implies stateful behavior
      await service.methodOne({ id: '1', data: 'first' });
      const result = await service.methodTwo();

      expect(result).toContainEqual(
        expect.objectContaining({ id: '1', data: 'first' })
      );
    });

    it('should isolate state between instances', async () => {
      // Create second instance
      const module2 = await Test.createTestingModule({
        providers: [
          { provide: 'IServiceName', useClass: ServiceNameImpl },
          { provide: 'IDependency', useValue: createMock() },
        ],
      }).compile();
      const service2 = module2.get<IServiceName>('IServiceName');

      // Modify first instance
      await service.methodOne({ id: '1', data: 'instance1' });

      // Verify second instance not affected
      const result2 = await service2.methodTwo();
      expect(result2).not.toContainEqual(
        expect.objectContaining({ data: 'instance1' })
      );
    });
  });

  // DEPENDENCY CONTRACTS

  describe('Dependency Injection Contracts', () => {
    it('should accept interface dependencies', () => {
      // Verify service accepts dependency injection
      expect(service).toBeDefined();
      // No need to test dependency implementation here
      // Only verify injection works
    });

    it('should work with mocked dependencies', async () => {
      // Verify service works with mock dependencies (already using mocks)
      const result = await service.methodOne({ id: '1' });
      expect(result).toBeDefined();
    });
  });
});
```

---

## Example Interface

```typescript
// interfaces/service-name.interface.ts
export interface IServiceName {
  /**
   * Retrieves entity by ID
   * @param input - Object containing entity ID
   * @returns Entity object
   * @throws NotFoundException when entity doesn't exist
   * @throws BadRequestException when input is invalid
   */
  methodOne(input: { id: string; name?: string }): Promise<EntityDto>;

  /**
   * Retrieves all entities with optional filtering
   * @param filter - Optional filter criteria
   * @returns Array of entities
   */
  methodTwo(filter?: { status?: string }): Promise<EntityDto[]>;

  /**
   * Deletes entity by ID
   * @param id - Entity ID
   * @throws NotFoundException when entity doesn't exist
   */
  methodThree(id: string): Promise<void>;
}
```

---

## Contract Test Checklist

- [ ] **All interface methods** have contract tests
- [ ] **Method signatures** verified (parameters, return types)
- [ ] **Exceptions** specified in interface are tested
- [ ] **Async behavior** verified (returns Promise)
- [ ] **Input validation** per interface specification
- [ ] **Output types** match interface
- [ ] **Behavioral contracts** tested (immutability, idempotency)
- [ ] **Concurrent calls** handled correctly
- [ ] **Dependency injection** works as expected
- [ ] **100% coverage** of interface methods

---

## Why Contract Tests Matter

1. **Liskov Substitution**: Any implementation can replace another
2. **Interface Compliance**: Implementations match specifications
3. **Breaking Changes**: Catch interface violations early
4. **Documentation**: Tests document expected behavior
5. **Refactoring Safety**: Change implementation without breaking contract

---

## Run Commands

```bash
# Run contract tests
npm run test -- *.contract.spec.ts

# Run with coverage (should be 100% for interface)
npm run test:cov -- *.contract.spec.ts

# Run mutation tests
npm run test:mutation

# Verify SOLID compliance
npm run test:solid
```

---

**Last Updated**: 2025-01-09
