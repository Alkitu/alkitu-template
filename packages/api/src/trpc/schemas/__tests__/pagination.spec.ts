import { describe, it, expect } from '@jest/globals';
import {
  paginationSchema,
  sortingSchema,
  paginatedSortingSchema,
  createPaginatedResponse,
  calculatePagination,
  type PaginationMeta,
} from '../common.schemas';
import { z } from 'zod';

/**
 * Tests for Pagination Schemas and Utilities
 *
 * Validates that pagination works correctly with proper defaults,
 * limits, and metadata calculations.
 */
describe('Pagination Schemas and Utilities', () => {
  describe('paginationSchema', () => {
    it('should validate valid pagination input', () => {
      const validInput = { page: 1, limit: 20 };
      const result = paginationSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ page: 1, limit: 20 });
      }
    });

    it('should use default values when not provided', () => {
      const result = paginationSchema.parse({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
    });

    it('should reject page less than 1', () => {
      const invalidInput = { page: 0, limit: 20 };
      const result = paginationSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should reject limit less than 1', () => {
      const invalidInput = { page: 1, limit: 0 };
      const result = paginationSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should reject limit greater than 100', () => {
      const invalidInput = { page: 1, limit: 101 };
      const result = paginationSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });

    it('should accept limit of exactly 100', () => {
      const validInput = { page: 1, limit: 100 };
      const result = paginationSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.limit).toBe(100);
      }
    });

    it('should accept valid page numbers', () => {
      const validPages = [1, 5, 10, 100, 1000];

      validPages.forEach((page) => {
        const result = paginationSchema.safeParse({ page, limit: 20 });
        expect(result.success).toBe(true);
      });
    });
  });

  describe('sortingSchema', () => {
    it('should validate valid sorting input', () => {
      const validInput = { sortBy: 'createdAt', sortOrder: 'desc' as const };
      const result = sortingSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({ sortBy: 'createdAt', sortOrder: 'desc' });
      }
    });

    it('should use default values when not provided', () => {
      const result = sortingSchema.parse({});

      expect(result.sortBy).toBe('createdAt');
      expect(result.sortOrder).toBe('desc');
    });

    it('should accept asc order', () => {
      const validInput = { sortBy: 'name', sortOrder: 'asc' as const };
      const result = sortingSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sortOrder).toBe('asc');
      }
    });

    it('should accept desc order', () => {
      const validInput = { sortBy: 'name', sortOrder: 'desc' as const };
      const result = sortingSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sortOrder).toBe('desc');
      }
    });

    it('should reject invalid sort order', () => {
      const invalidInput = { sortBy: 'name', sortOrder: 'invalid' };
      const result = sortingSchema.safeParse(invalidInput);

      expect(result.success).toBe(false);
    });
  });

  describe('paginatedSortingSchema', () => {
    it('should combine pagination and sorting schemas', () => {
      const validInput = {
        page: 2,
        limit: 50,
        sortBy: 'email',
        sortOrder: 'asc' as const,
      };
      const result = paginatedSortingSchema.safeParse(validInput);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          page: 2,
          limit: 50,
          sortBy: 'email',
          sortOrder: 'asc',
        });
      }
    });

    it('should use all default values when not provided', () => {
      const result = paginatedSortingSchema.parse({});

      expect(result.page).toBe(1);
      expect(result.limit).toBe(20);
      expect(result.sortBy).toBe('createdAt');
      expect(result.sortOrder).toBe('desc');
    });

    it('should validate all constraints from both schemas', () => {
      const invalidInputs = [
        { page: 0, limit: 20, sortBy: 'name', sortOrder: 'asc' as const }, // Invalid page
        { page: 1, limit: 101, sortBy: 'name', sortOrder: 'asc' as const }, // Invalid limit
        { page: 1, limit: 20, sortBy: 'name', sortOrder: 'invalid' }, // Invalid sortOrder
      ];

      invalidInputs.forEach((input) => {
        const result = paginatedSortingSchema.safeParse(input);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('calculatePagination', () => {
    it('should calculate skip and take for first page', () => {
      const result = calculatePagination(1, 20);

      expect(result).toEqual({
        skip: 0,
        take: 20,
      });
    });

    it('should calculate skip and take for second page', () => {
      const result = calculatePagination(2, 20);

      expect(result).toEqual({
        skip: 20,
        take: 20,
      });
    });

    it('should calculate skip and take for arbitrary page', () => {
      const result = calculatePagination(5, 25);

      expect(result).toEqual({
        skip: 100, // (5-1) * 25
        take: 25,
      });
    });

    it('should handle different page sizes', () => {
      const testCases = [
        { page: 1, limit: 10, expected: { skip: 0, take: 10 } },
        { page: 3, limit: 50, expected: { skip: 100, take: 50 } },
        { page: 10, limit: 5, expected: { skip: 45, take: 5 } },
      ];

      testCases.forEach(({ page, limit, expected }) => {
        const result = calculatePagination(page, limit);
        expect(result).toEqual(expected);
      });
    });

    it('should handle maximum limit of 100', () => {
      const result = calculatePagination(1, 100);

      expect(result).toEqual({
        skip: 0,
        take: 100,
      });
    });
  });

  describe('createPaginatedResponse', () => {
    it('should create paginated response with correct metadata', () => {
      const items = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ];
      const params = { page: 1, limit: 20, total: 50 };

      const result = createPaginatedResponse(items, params);

      expect(result).toEqual({
        items,
        pagination: {
          page: 1,
          limit: 20,
          total: 50,
          totalPages: 3,
          hasNext: true,
          hasPrev: false,
        },
      });
    });

    it('should calculate totalPages correctly', () => {
      const testCases = [
        { total: 50, limit: 20, expectedPages: 3 },
        { total: 100, limit: 20, expectedPages: 5 },
        { total: 19, limit: 20, expectedPages: 1 },
        { total: 20, limit: 20, expectedPages: 1 },
        { total: 21, limit: 20, expectedPages: 2 },
      ];

      testCases.forEach(({ total, limit, expectedPages }) => {
        const result = createPaginatedResponse([], { page: 1, limit, total });
        expect(result.pagination.totalPages).toBe(expectedPages);
      });
    });

    it('should set hasNext correctly', () => {
      // Has next page
      let result = createPaginatedResponse([], {
        page: 1,
        limit: 20,
        total: 50,
      });
      expect(result.pagination.hasNext).toBe(true);

      // No next page
      result = createPaginatedResponse([], { page: 3, limit: 20, total: 50 });
      expect(result.pagination.hasNext).toBe(false);

      // Last page
      result = createPaginatedResponse([], { page: 5, limit: 20, total: 100 });
      expect(result.pagination.hasNext).toBe(false);
    });

    it('should set hasPrev correctly', () => {
      // First page - no previous
      let result = createPaginatedResponse([], {
        page: 1,
        limit: 20,
        total: 50,
      });
      expect(result.pagination.hasPrev).toBe(false);

      // Second page - has previous
      result = createPaginatedResponse([], { page: 2, limit: 20, total: 50 });
      expect(result.pagination.hasPrev).toBe(true);

      // Middle page - has previous
      result = createPaginatedResponse([], { page: 3, limit: 20, total: 100 });
      expect(result.pagination.hasPrev).toBe(true);
    });

    it('should handle empty results', () => {
      const result = createPaginatedResponse([], {
        page: 1,
        limit: 20,
        total: 0,
      });

      expect(result).toEqual({
        items: [],
        pagination: {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false,
        },
      });
    });

    it('should handle single page results', () => {
      const items = [{ id: 1 }, { id: 2 }, { id: 3 }];
      const result = createPaginatedResponse(items, {
        page: 1,
        limit: 20,
        total: 3,
      });

      expect(result.pagination).toEqual({
        page: 1,
        limit: 20,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should preserve item data', () => {
      interface TestItem {
        id: number;
        name: string;
        nested: { value: string };
      }

      const items: TestItem[] = [
        { id: 1, name: 'Test', nested: { value: 'data' } },
      ];

      const result = createPaginatedResponse(items, {
        page: 1,
        limit: 20,
        total: 1,
      });

      expect(result.items).toEqual(items);
      expect(result.items[0].nested.value).toBe('data');
    });

    it('should work with different data types', () => {
      // Test with strings
      const stringResult = createPaginatedResponse(['a', 'b', 'c'], {
        page: 1,
        limit: 20,
        total: 3,
      });
      expect(stringResult.items).toEqual(['a', 'b', 'c']);

      // Test with numbers
      const numberResult = createPaginatedResponse([1, 2, 3], {
        page: 1,
        limit: 20,
        total: 3,
      });
      expect(numberResult.items).toEqual([1, 2, 3]);

      // Test with complex objects
      const objectResult = createPaginatedResponse(
        [{ id: 1, data: { nested: true } }],
        { page: 1, limit: 20, total: 1 },
      );
      expect(objectResult.items[0].data.nested).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should work together for typical pagination flow', () => {
      // Parse input
      const input = paginatedSortingSchema.parse({
        page: 2,
        limit: 10,
        sortBy: 'email',
        sortOrder: 'asc',
      });

      // Calculate skip/take
      const { skip, take } = calculatePagination(input.page, input.limit);

      // Simulate database query
      const allItems = Array.from({ length: 25 }, (_, i) => ({
        id: i + 1,
        email: `user${i + 1}@example.com`,
      }));
      const items = allItems.slice(skip, skip + take);

      // Create response
      const response = createPaginatedResponse(items, {
        page: input.page,
        limit: input.limit,
        total: allItems.length,
      });

      expect(response.items).toHaveLength(10);
      expect(response.items[0].id).toBe(11); // Second page starts at item 11
      expect(response.pagination).toEqual({
        page: 2,
        limit: 10,
        total: 25,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    it('should handle edge case: last page with partial results', () => {
      const input = paginatedSortingSchema.parse({ page: 3, limit: 10 });
      const { skip, take } = calculatePagination(input.page, input.limit);

      // 25 total items, last page has 5 items
      const allItems = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }));
      const items = allItems.slice(skip, skip + take);

      const response = createPaginatedResponse(items, {
        page: input.page,
        limit: input.limit,
        total: allItems.length,
      });

      expect(response.items).toHaveLength(5);
      expect(response.pagination.hasNext).toBe(false);
      expect(response.pagination.hasPrev).toBe(true);
    });

    it('should handle edge case: requesting page beyond available data', () => {
      const input = paginatedSortingSchema.parse({ page: 10, limit: 20 });
      const { skip } = calculatePagination(input.page, input.limit);

      // Only 50 items, but requesting page 10
      const allItems = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));
      const items = allItems.slice(skip); // Will be empty

      const response = createPaginatedResponse(items, {
        page: input.page,
        limit: input.limit,
        total: allItems.length,
      });

      expect(response.items).toHaveLength(0);
      expect(response.pagination.totalPages).toBe(3); // 50 / 20 = 2.5 -> 3 pages
      expect(response.pagination.hasNext).toBe(false);
    });
  });

  describe('Type Safety', () => {
    it('should infer correct types from schemas', () => {
      const paginationInput = paginationSchema.parse({ page: 1, limit: 20 });
      const sortingInput = sortingSchema.parse({
        sortBy: 'name',
        sortOrder: 'asc',
      });
      const combinedInput = paginatedSortingSchema.parse({
        page: 1,
        limit: 20,
        sortBy: 'name',
        sortOrder: 'asc',
      });

      // TypeScript will catch type errors at compile time
      expect(typeof paginationInput.page).toBe('number');
      expect(typeof paginationInput.limit).toBe('number');
      expect(typeof sortingInput.sortBy).toBe('string');
      expect(typeof sortingInput.sortOrder).toBe('string');
      expect(typeof combinedInput.page).toBe('number');
    });

    it('should type response correctly', () => {
      interface User {
        id: string;
        name: string;
      }

      const users: User[] = [{ id: '1', name: 'Test' }];
      const response = createPaginatedResponse(users, {
        page: 1,
        limit: 20,
        total: 1,
      });

      // TypeScript ensures items have correct type
      expect(response.items[0].id).toBe('1');
      expect(response.items[0].name).toBe('Test');
      expect(response.pagination.page).toBe(1);
    });
  });
});
