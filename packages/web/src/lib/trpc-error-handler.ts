import { TRPCClientError } from '@trpc/client';
import { toast } from 'sonner';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

/**
 * Centralized tRPC Error Handler for Frontend
 *
 * Handles tRPC errors with proper user-friendly messages and actions.
 * Maps tRPC error codes to appropriate toast notifications and navigation.
 *
 * Usage:
 * - Use in tRPC mutation/query onError callbacks
 * - Provides consistent UX across the application
 * - Handles authentication redirects automatically
 *
 * @param error - The tRPC client error
 * @param router - Next.js router instance (optional, for redirects)
 * @param customMessages - Optional custom error messages (overrides defaults)
 *
 * @example
 * ```typescript
 * const mutation = trpc.user.updateProfile.useMutation({
 *   onError: (error) => handleTRPCError(error, router),
 *   onSuccess: () => toast.success('Profile updated!')
 * });
 * ```
 */
export function handleTRPCError(
  error: TRPCClientError<any>,
  router?: AppRouterInstance,
  customMessages?: Partial<Record<TRPCErrorCode, string>>,
) {
  const errorCode = error.data?.code as TRPCErrorCode | undefined;

  // Use custom message if provided, otherwise use default
  const getMessage = (code: TRPCErrorCode, defaultMsg: string) => {
    return customMessages?.[code] || defaultMsg;
  };

  switch (errorCode) {
    case 'UNAUTHORIZED':
      toast.error(getMessage('UNAUTHORIZED', 'Your session has expired. Please log in again.'));
      // Redirect to login page after short delay
      setTimeout(() => {
        router?.push('/login');
      }, 1500);
      break;

    case 'FORBIDDEN':
      toast.error(getMessage('FORBIDDEN', 'You do not have permission to perform this action.'));
      break;

    case 'NOT_FOUND':
      toast.error(getMessage('NOT_FOUND', 'The requested resource was not found.'));
      break;

    case 'CONFLICT':
      toast.error(getMessage('CONFLICT', 'This resource already exists. Please use a different value.'));
      break;

    case 'BAD_REQUEST':
      toast.error(getMessage('BAD_REQUEST', 'Invalid request. Please check your input and try again.'));
      break;

    case 'TIMEOUT':
      toast.error(getMessage('TIMEOUT', 'Request timed out. Please try again.'));
      break;

    case 'TOO_MANY_REQUESTS':
      toast.error(getMessage('TOO_MANY_REQUESTS', 'Too many requests. Please slow down and try again later.'));
      break;

    case 'INTERNAL_SERVER_ERROR':
      toast.error(getMessage('INTERNAL_SERVER_ERROR', 'An unexpected error occurred. Please try again later.'));
      break;

    case 'PARSE_ERROR':
      toast.error(getMessage('PARSE_ERROR', 'Invalid data format. Please check your input.'));
      break;

    default:
      // Fallback for unknown error codes
      toast.error(error.message || 'An error occurred. Please try again.');
  }
}

/**
 * Extract user-friendly field names from Prisma error metadata
 * Useful for CONFLICT errors (P2002) to show which field has duplicate value
 *
 * @param error - The tRPC client error
 * @returns Formatted field names or null
 *
 * @example
 * ```typescript
 * const fields = extractConflictFields(error);
 * if (fields) {
 *   toast.error(`A user with this ${fields} already exists`);
 * }
 * ```
 */
export function extractConflictFields(error: TRPCClientError<any>): string | null {
  const cause = error.data?.cause as any;

  if (cause?.fields && Array.isArray(cause.fields)) {
    return cause.fields.join(', ');
  }

  return null;
}

/**
 * Check if error is a specific tRPC error code
 * Useful for conditional error handling
 *
 * @example
 * ```typescript
 * if (isTRPCErrorCode(error, 'UNAUTHORIZED')) {
 *   // Handle authentication error specifically
 * }
 * ```
 */
export function isTRPCErrorCode(
  error: unknown,
  code: TRPCErrorCode,
): error is TRPCClientError<any> {
  return (
    error instanceof Object &&
    'data' in error &&
    (error as any).data?.code === code
  );
}

/**
 * Enhanced error handler with field-specific messages
 * Shows which specific field caused the conflict for better UX
 *
 * @example
 * ```typescript
 * const mutation = trpc.user.register.useMutation({
 *   onError: (error) => handleTRPCErrorWithFields(error, router),
 * });
 * ```
 */
export function handleTRPCErrorWithFields(
  error: TRPCClientError<any>,
  router?: AppRouterInstance,
) {
  // Special handling for CONFLICT errors to show field details
  if (isTRPCErrorCode(error, 'CONFLICT')) {
    const fields = extractConflictFields(error);
    if (fields) {
      toast.error(`A resource with this ${fields} already exists.`);
      return;
    }
  }

  // Fall back to standard error handling
  handleTRPCError(error, router);
}

/**
 * tRPC Error Codes
 * Based on @trpc/server error codes
 */
export type TRPCErrorCode =
  | 'PARSE_ERROR'
  | 'BAD_REQUEST'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'METHOD_NOT_SUPPORTED'
  | 'TIMEOUT'
  | 'CONFLICT'
  | 'PRECONDITION_FAILED'
  | 'PAYLOAD_TOO_LARGE'
  | 'UNPROCESSABLE_CONTENT'
  | 'TOO_MANY_REQUESTS'
  | 'CLIENT_CLOSED_REQUEST'
  | 'INTERNAL_SERVER_ERROR';

/**
 * Error message templates for common operations
 * Use these for consistent messaging across the app
 */
export const ERROR_MESSAGES = {
  CREATE: {
    CONFLICT: 'This item already exists',
    BAD_REQUEST: 'Invalid data provided',
    UNAUTHORIZED: 'You must be logged in to create this',
    FORBIDDEN: 'You do not have permission to create this',
  },
  UPDATE: {
    NOT_FOUND: 'Item not found',
    CONFLICT: 'Cannot update - this value is already in use',
    UNAUTHORIZED: 'You must be logged in to update this',
    FORBIDDEN: 'You do not have permission to update this',
  },
  DELETE: {
    NOT_FOUND: 'Item not found',
    UNAUTHORIZED: 'You must be logged in to delete this',
    FORBIDDEN: 'You do not have permission to delete this',
  },
  FETCH: {
    NOT_FOUND: 'Item not found',
    UNAUTHORIZED: 'You must be logged in to view this',
    FORBIDDEN: 'You do not have permission to view this',
  },
} as const;

/**
 * Get operation-specific error message
 *
 * @example
 * ```typescript
 * const message = getOperationErrorMessage('CREATE', 'CONFLICT');
 * // Returns: "This item already exists"
 * ```
 */
export function getOperationErrorMessage(
  operation: keyof typeof ERROR_MESSAGES,
  code: TRPCErrorCode,
): string | undefined {
  return ERROR_MESSAGES[operation][code as keyof typeof ERROR_MESSAGES[typeof operation]];
}
