import { BadRequestException } from '@nestjs/common';
import { RequestStatus } from '@prisma/client';

/**
 * Valid status transitions for service requests (ALI-119)
 * State machine rules:
 * - PENDING → ONGOING (when assigned)
 * - PENDING → CANCELLED (cancelled before assignment)
 * - ONGOING → COMPLETED (work finished)
 * - ONGOING → CANCELLED (cancelled after assignment)
 * - COMPLETED → (terminal state, no transitions)
 * - CANCELLED → (terminal state, no transitions)
 */
const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  [RequestStatus.PENDING]: [RequestStatus.ONGOING, RequestStatus.CANCELLED],
  [RequestStatus.ONGOING]: [RequestStatus.COMPLETED, RequestStatus.CANCELLED],
  [RequestStatus.COMPLETED]: [], // Terminal state
  [RequestStatus.CANCELLED]: [], // Terminal state
};

/**
 * Validates if a status transition is allowed
 * @param currentStatus - The current request status
 * @param newStatus - The desired new status
 * @throws {BadRequestException} If transition is invalid
 */
export function validateStatusTransition(
  currentStatus: RequestStatus,
  newStatus: RequestStatus,
): void {
  // Same status is always allowed (no-op)
  if (currentStatus === newStatus) {
    return;
  }

  const allowedTransitions = VALID_TRANSITIONS[currentStatus];

  if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
    throw new BadRequestException(
      `Invalid status transition from ${currentStatus} to ${newStatus}. ` +
        `Allowed transitions from ${currentStatus}: ${allowedTransitions.length > 0 ? allowedTransitions.join(', ') : 'none (terminal state)'}`,
    );
  }
}

/**
 * Checks if a status is a terminal state (no further transitions allowed)
 * @param status - The status to check
 * @returns true if the status is terminal
 */
export function isTerminalStatus(status: RequestStatus): boolean {
  return (
    status === RequestStatus.COMPLETED || status === RequestStatus.CANCELLED
  );
}

/**
 * Gets all valid next statuses from the current status
 * @param currentStatus - The current status
 * @returns Array of valid next statuses
 */
export function getValidNextStatuses(
  currentStatus: RequestStatus,
): RequestStatus[] {
  return VALID_TRANSITIONS[currentStatus] || [];
}

/**
 * Validates business rules for status transitions
 * @param currentStatus - Current status
 * @param newStatus - Desired new status
 * @param assignedToId - Current assignedToId (if any)
 * @throws {BadRequestException} If business rules are violated
 */
export function validateStatusTransitionRules(
  currentStatus: RequestStatus,
  newStatus: RequestStatus,
  assignedToId?: string | null,
): void {
  // First validate the transition itself
  validateStatusTransition(currentStatus, newStatus);

  // Business rule: Can only transition to ONGOING if assigned to someone
  if (newStatus === RequestStatus.ONGOING && !assignedToId) {
    throw new BadRequestException(
      'Cannot set status to ONGOING without assigning to an employee first',
    );
  }

  // Business rule: PENDING → CANCELLED doesn't require assignment
  // Business rule: ONGOING → COMPLETED/CANCELLED requires assignment (implicitly checked above)
}
