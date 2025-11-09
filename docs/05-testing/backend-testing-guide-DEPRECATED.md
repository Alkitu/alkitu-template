# Backend Testing Guide

Complete guide for testing NestJS backend services using TDD methodology.

## Overview

This guide follows the **RED-GREEN-REFACTOR-VALIDATE** cycle with:
- **Jest**: Unit and integration tests
- **Stryker**: Mutation testing (85%+ score required)
- **Supertest**: API endpoint testing
- **MongoDB Memory Server**: Database testing

## TDD Workflow

```
🔴 RED      → Write failing test first
🟢 GREEN    → Write minimal code to pass
🔵 REFACTOR → Improve code while keeping tests green
✅ VALIDATE → Run mutation tests to verify test quality
```

## Standards

- **Coverage**: 95%+ for services, 90%+ globally
- **Mutation Score**: 85%+ (enforced by Stryker)
- **Test Speed**: <10s for full suite (optimized)

## Test Structure

### Service Testing Example

```typescript
// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { createMock } from '@golevelup/ts-jest';

describe('UserService', () => {
  let service: UserService;
  let repository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: createMock<UserRepository>(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get(UserRepository);
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const userData = { email: 'test@test.com', password: 'pass123' };
      repository.create.mockResolvedValue({ id: '1', ...userData });

      const result = await service.createUser(userData);

      expect(result).toHaveProperty('id');
      expect(repository.create).toHaveBeenCalledWith(userData);
    });

    it('should throw ConflictException for duplicate email', async () => {
      const userData = { email: 'exists@test.com', password: 'pass123' };
      repository.findByEmail.mockResolvedValue({ id: '1', ...userData });

      await expect(service.createUser(userData)).rejects.toThrow('User already exists');
    });
  });
});
```

## Commands

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# Mutation testing
npm run test:mutation

# Quality gates (all checks)
npm run quality:gates
```

## Related Documentation

- [Testing Strategy and Frameworks](/docs/00-conventions/testing-strategy-and-frameworks.md)
- [Frontend Testing Guide](./frontend-testing-guide.md)

---

**Last Updated:** 2025-01-09
