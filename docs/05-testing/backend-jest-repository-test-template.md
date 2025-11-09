# Backend Jest Repository Test Template

**Purpose**: Template for testing NestJS repository classes (data access layer)
**Coverage Required**: 90%+
**Mutation Score**: 85%+
**Location**: `src/module/repositories/__tests__/repository-name.spec.ts`

---

## Complete Repository Test Template

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryName } from '../repository-name.repository';
import { PrismaService } from '@/prisma/prisma.service';

describe('RepositoryName', () => {
  let repository: RepositoryName;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RepositoryName,
        {
          provide: PrismaService,
          useValue: {
            entity: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<RepositoryName>(RepositoryName);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // 1. FIND ONE TESTS
  describe('findById', () => {
    it('should return entity when found', async () => {
      // Arrange
      const mockEntity = { id: '1', name: 'Test', createdAt: new Date() };
      jest.spyOn(prisma.entity, 'findUnique').mockResolvedValue(mockEntity);

      // Act
      const result = await repository.findById('1');

      // Assert
      expect(result).toEqual(mockEntity);
      expect(prisma.entity.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should return null when not found', async () => {
      // Arrange
      jest.spyOn(prisma.entity, 'findUnique').mockResolvedValue(null);

      // Act
      const result = await repository.findById('999');

      // Assert
      expect(result).toBeNull();
    });

    it('should include relations when requested', async () => {
      // Arrange
      const mockEntity = {
        id: '1',
        name: 'Test',
        relations: [{ id: 'r1', name: 'Related' }],
      };
      jest.spyOn(prisma.entity, 'findUnique').mockResolvedValue(mockEntity);

      // Act
      const result = await repository.findById('1', { includeRelations: true });

      // Assert
      expect(result.relations).toBeDefined();
      expect(prisma.entity.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { relations: true },
      });
    });
  });

  // 2. FIND MANY TESTS
  describe('findAll', () => {
    it('should return all entities', async () => {
      // Arrange
      const mockEntities = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ];
      jest.spyOn(prisma.entity, 'findMany').mockResolvedValue(mockEntities);

      // Act
      const result = await repository.findAll();

      // Assert
      expect(result).toEqual(mockEntities);
      expect(result).toHaveLength(2);
    });

    it('should apply filters correctly', async () => {
      // Arrange
      const mockEntities = [{ id: '1', name: 'Active', status: 'active' }];
      jest.spyOn(prisma.entity, 'findMany').mockResolvedValue(mockEntities);

      // Act
      const result = await repository.findAll({ status: 'active' });

      // Assert
      expect(result).toHaveLength(1);
      expect(prisma.entity.findMany).toHaveBeenCalledWith({
        where: { status: 'active' },
      });
    });

    it('should apply pagination correctly', async () => {
      // Arrange
      jest.spyOn(prisma.entity, 'findMany').mockResolvedValue([]);

      // Act
      await repository.findAll({ skip: 10, take: 20 });

      // Assert
      expect(prisma.entity.findMany).toHaveBeenCalledWith({
        skip: 10,
        take: 20,
      });
    });

    it('should apply sorting correctly', async () => {
      // Arrange
      jest.spyOn(prisma.entity, 'findMany').mockResolvedValue([]);

      // Act
      await repository.findAll({ orderBy: { createdAt: 'desc' } });

      // Assert
      expect(prisma.entity.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  // 3. CREATE TESTS
  describe('create', () => {
    it('should create entity successfully', async () => {
      // Arrange
      const createData = { name: 'New Entity', email: 'test@test.com' };
      const mockCreated = { id: '1', ...createData, createdAt: new Date() };
      jest.spyOn(prisma.entity, 'create').mockResolvedValue(mockCreated);

      // Act
      const result = await repository.create(createData);

      // Assert
      expect(result).toEqual(mockCreated);
      expect(prisma.entity.create).toHaveBeenCalledWith({
        data: createData,
      });
    });

    it('should handle unique constraint violations', async () => {
      // Arrange
      const error = new Error('Unique constraint failed');
      (error as any).code = 'P2002';
      jest.spyOn(prisma.entity, 'create').mockRejectedValue(error);

      // Act & Assert
      await expect(repository.create({ email: 'duplicate@test.com' })).rejects.toThrow(
        'Unique constraint failed'
      );
    });
  });

  // 4. UPDATE TESTS
  describe('update', () => {
    it('should update entity successfully', async () => {
      // Arrange
      const updateData = { name: 'Updated Name' };
      const mockUpdated = { id: '1', name: 'Updated Name', updatedAt: new Date() };
      jest.spyOn(prisma.entity, 'update').mockResolvedValue(mockUpdated);

      // Act
      const result = await repository.update('1', updateData);

      // Assert
      expect(result).toEqual(mockUpdated);
      expect(prisma.entity.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
      });
    });

    it('should throw error when entity not found', async () => {
      // Arrange
      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      jest.spyOn(prisma.entity, 'update').mockRejectedValue(error);

      // Act & Assert
      await expect(repository.update('999', { name: 'Test' })).rejects.toThrow(
        'Record not found'
      );
    });
  });

  // 5. DELETE TESTS
  describe('delete', () => {
    it('should delete entity successfully', async () => {
      // Arrange
      const mockDeleted = { id: '1', name: 'Deleted' };
      jest.spyOn(prisma.entity, 'delete').mockResolvedValue(mockDeleted);

      // Act
      const result = await repository.delete('1');

      // Assert
      expect(result).toEqual(mockDeleted);
      expect(prisma.entity.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw error when entity not found', async () => {
      // Arrange
      const error = new Error('Record not found');
      (error as any).code = 'P2025';
      jest.spyOn(prisma.entity, 'delete').mockRejectedValue(error);

      // Act & Assert
      await expect(repository.delete('999')).rejects.toThrow('Record not found');
    });
  });

  // 6. SEARCH/QUERY TESTS
  describe('findByEmail', () => {
    it('should find entity by email', async () => {
      // Arrange
      const mockEntity = { id: '1', email: 'test@test.com', name: 'Test' };
      jest.spyOn(prisma.entity, 'findUnique').mockResolvedValue(mockEntity);

      // Act
      const result = await repository.findByEmail('test@test.com');

      // Assert
      expect(result).toEqual(mockEntity);
      expect(prisma.entity.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should return null for non-existent email', async () => {
      // Arrange
      jest.spyOn(prisma.entity, 'findUnique').mockResolvedValue(null);

      // Act
      const result = await repository.findByEmail('nonexistent@test.com');

      // Assert
      expect(result).toBeNull();
    });
  });

  // 7. COUNT TESTS
  describe('count', () => {
    it('should return total count', async () => {
      // Arrange
      jest.spyOn(prisma.entity, 'count').mockResolvedValue(42);

      // Act
      const result = await repository.count();

      // Assert
      expect(result).toBe(42);
    });

    it('should return filtered count', async () => {
      // Arrange
      jest.spyOn(prisma.entity, 'count').mockResolvedValue(10);

      // Act
      const result = await repository.count({ status: 'active' });

      // Assert
      expect(result).toBe(10);
      expect(prisma.entity.count).toHaveBeenCalledWith({
        where: { status: 'active' },
      });
    });
  });

  // 8. TRANSACTION TESTS
  describe('createMany', () => {
    it('should create multiple entities in transaction', async () => {
      // Arrange
      const entities = [
        { name: 'Entity 1', email: 'test1@test.com' },
        { name: 'Entity 2', email: 'test2@test.com' },
      ];
      jest.spyOn(prisma, '$transaction').mockResolvedValue([
        { id: '1', ...entities[0] },
        { id: '2', ...entities[1] },
      ]);

      // Act
      const result = await repository.createMany(entities);

      // Assert
      expect(result).toHaveLength(2);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  // 9. ERROR HANDLING TESTS
  describe('Error Handling', () => {
    it('should handle database connection errors', async () => {
      // Arrange
      const dbError = new Error('Connection timeout');
      jest.spyOn(prisma.entity, 'findMany').mockRejectedValue(dbError);

      // Act & Assert
      await expect(repository.findAll()).rejects.toThrow('Connection timeout');
    });

    it('should handle foreign key constraint violations', async () => {
      // Arrange
      const error = new Error('Foreign key constraint failed');
      (error as any).code = 'P2003';
      jest.spyOn(prisma.entity, 'delete').mockRejectedValue(error);

      // Act & Assert
      await expect(repository.delete('1')).rejects.toThrow(
        'Foreign key constraint failed'
      );
    });
  });

  // 10. COMPLEX QUERIES
  describe('Advanced Queries', () => {
    it('should handle complex where clauses', async () => {
      // Arrange
      jest.spyOn(prisma.entity, 'findMany').mockResolvedValue([]);

      // Act
      await repository.findAll({
        where: {
          AND: [{ status: 'active' }, { createdAt: { gte: new Date('2024-01-01') } }],
        },
      });

      // Assert
      expect(prisma.entity.findMany).toHaveBeenCalledWith({
        where: {
          AND: expect.arrayContaining([
            { status: 'active' },
            { createdAt: { gte: expect.any(Date) } },
          ]),
        },
      });
    });

    it('should handle nested includes', async () => {
      // Arrange
      jest.spyOn(prisma.entity, 'findUnique').mockResolvedValue({
        id: '1',
        relations: { nested: { data: 'test' } },
      });

      // Act
      await repository.findById('1', {
        include: { relations: { include: { nested: true } } },
      });

      // Assert
      expect(prisma.entity.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { relations: { include: { nested: true } } },
      });
    });
  });
});
```

---

## Test Checklist

- [ ] **90%+ coverage** achieved
- [ ] **CRUD operations** tested (Create, Read, Update, Delete)
- [ ] **Queries** tested (findById, findAll, findByEmail, etc.)
- [ ] **Filters** tested (where clauses, pagination, sorting)
- [ ] **Relations** tested (include, select)
- [ ] **Transactions** tested (if applicable)
- [ ] **Error cases** tested (not found, constraints, connection errors)
- [ ] **Prisma methods** called with correct arguments
- [ ] **Edge cases** covered (null, empty results)

---

## Run Commands

```bash
# Run tests for this repository
npm run test -- repository-name.spec.ts

# Run in watch mode
npm run test:tdd

# Run with coverage
npm run test:cov

# Run mutation tests
npm run test:mutation
```

---

**Last Updated**: 2025-01-09
