import { BadRequestException } from '@nestjs/common';
import { RequestStatus } from '@prisma/client';
import {
  validateStatusTransition,
  validateStatusTransitionRules,
  isTerminalStatus,
  getValidNextStatuses,
} from './status-transition.validator';

describe('Status Transition Validator (ALI-119)', () => {
  describe('validateStatusTransition', () => {
    it('should allow PENDING → ONGOING transition', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.PENDING, RequestStatus.ONGOING),
      ).not.toThrow();
    });

    it('should allow PENDING → CANCELLED transition', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.PENDING, RequestStatus.CANCELLED),
      ).not.toThrow();
    });

    it('should allow ONGOING → COMPLETED transition', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.ONGOING, RequestStatus.COMPLETED),
      ).not.toThrow();
    });

    it('should allow ONGOING → CANCELLED transition', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.ONGOING, RequestStatus.CANCELLED),
      ).not.toThrow();
    });

    it('should allow same status transition (no-op)', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.PENDING, RequestStatus.PENDING),
      ).not.toThrow();
      expect(() =>
        validateStatusTransition(RequestStatus.ONGOING, RequestStatus.ONGOING),
      ).not.toThrow();
    });

    it('should throw BadRequestException for PENDING → COMPLETED', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.PENDING, RequestStatus.COMPLETED),
      ).toThrow(BadRequestException);
      expect(() =>
        validateStatusTransition(RequestStatus.PENDING, RequestStatus.COMPLETED),
      ).toThrow('Invalid status transition from PENDING to COMPLETED');
    });

    it('should throw BadRequestException for ONGOING → PENDING', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.ONGOING, RequestStatus.PENDING),
      ).toThrow(BadRequestException);
      expect(() =>
        validateStatusTransition(RequestStatus.ONGOING, RequestStatus.PENDING),
      ).toThrow('Invalid status transition from ONGOING to PENDING');
    });

    it('should throw BadRequestException for COMPLETED → any status (terminal state)', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.COMPLETED, RequestStatus.PENDING),
      ).toThrow(BadRequestException);
      expect(() =>
        validateStatusTransition(RequestStatus.COMPLETED, RequestStatus.PENDING),
      ).toThrow('none (terminal state)');

      expect(() =>
        validateStatusTransition(RequestStatus.COMPLETED, RequestStatus.ONGOING),
      ).toThrow(BadRequestException);

      expect(() =>
        validateStatusTransition(RequestStatus.COMPLETED, RequestStatus.CANCELLED),
      ).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for CANCELLED → any status (terminal state)', () => {
      expect(() =>
        validateStatusTransition(RequestStatus.CANCELLED, RequestStatus.PENDING),
      ).toThrow(BadRequestException);
      expect(() =>
        validateStatusTransition(RequestStatus.CANCELLED, RequestStatus.PENDING),
      ).toThrow('none (terminal state)');

      expect(() =>
        validateStatusTransition(RequestStatus.CANCELLED, RequestStatus.ONGOING),
      ).toThrow(BadRequestException);

      expect(() =>
        validateStatusTransition(RequestStatus.CANCELLED, RequestStatus.COMPLETED),
      ).toThrow(BadRequestException);
    });
  });

  describe('isTerminalStatus', () => {
    it('should return true for COMPLETED status', () => {
      expect(isTerminalStatus(RequestStatus.COMPLETED)).toBe(true);
    });

    it('should return true for CANCELLED status', () => {
      expect(isTerminalStatus(RequestStatus.CANCELLED)).toBe(true);
    });

    it('should return false for PENDING status', () => {
      expect(isTerminalStatus(RequestStatus.PENDING)).toBe(false);
    });

    it('should return false for ONGOING status', () => {
      expect(isTerminalStatus(RequestStatus.ONGOING)).toBe(false);
    });
  });

  describe('getValidNextStatuses', () => {
    it('should return [ONGOING, CANCELLED] for PENDING', () => {
      const validStatuses = getValidNextStatuses(RequestStatus.PENDING);
      expect(validStatuses).toEqual([
        RequestStatus.ONGOING,
        RequestStatus.CANCELLED,
      ]);
    });

    it('should return [COMPLETED, CANCELLED] for ONGOING', () => {
      const validStatuses = getValidNextStatuses(RequestStatus.ONGOING);
      expect(validStatuses).toEqual([
        RequestStatus.COMPLETED,
        RequestStatus.CANCELLED,
      ]);
    });

    it('should return [] for COMPLETED (terminal state)', () => {
      const validStatuses = getValidNextStatuses(RequestStatus.COMPLETED);
      expect(validStatuses).toEqual([]);
    });

    it('should return [] for CANCELLED (terminal state)', () => {
      const validStatuses = getValidNextStatuses(RequestStatus.CANCELLED);
      expect(validStatuses).toEqual([]);
    });
  });

  describe('validateStatusTransitionRules', () => {
    it('should allow PENDING → ONGOING with assignedToId', () => {
      expect(() =>
        validateStatusTransitionRules(
          RequestStatus.PENDING,
          RequestStatus.ONGOING,
          'employee-id-123',
        ),
      ).not.toThrow();
    });

    it('should throw BadRequestException for PENDING → ONGOING without assignedToId', () => {
      expect(() =>
        validateStatusTransitionRules(
          RequestStatus.PENDING,
          RequestStatus.ONGOING,
          null,
        ),
      ).toThrow(BadRequestException);
      expect(() =>
        validateStatusTransitionRules(
          RequestStatus.PENDING,
          RequestStatus.ONGOING,
          null,
        ),
      ).toThrow('Cannot set status to ONGOING without assigning to an employee first');
    });

    it('should allow PENDING → CANCELLED without assignedToId', () => {
      expect(() =>
        validateStatusTransitionRules(
          RequestStatus.PENDING,
          RequestStatus.CANCELLED,
          null,
        ),
      ).not.toThrow();
    });

    it('should allow ONGOING → COMPLETED with assignedToId', () => {
      expect(() =>
        validateStatusTransitionRules(
          RequestStatus.ONGOING,
          RequestStatus.COMPLETED,
          'employee-id-123',
        ),
      ).not.toThrow();
    });

    it('should allow ONGOING → CANCELLED with assignedToId', () => {
      expect(() =>
        validateStatusTransitionRules(
          RequestStatus.ONGOING,
          RequestStatus.CANCELLED,
          'employee-id-123',
        ),
      ).not.toThrow();
    });

    it('should throw BadRequestException for invalid base transition', () => {
      expect(() =>
        validateStatusTransitionRules(
          RequestStatus.COMPLETED,
          RequestStatus.PENDING,
          'employee-id-123',
        ),
      ).toThrow(BadRequestException);
    });

    it('should allow same status transition (no-op)', () => {
      expect(() =>
        validateStatusTransitionRules(
          RequestStatus.PENDING,
          RequestStatus.PENDING,
          null,
        ),
      ).not.toThrow();
    });
  });
});
