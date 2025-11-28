/**
 * Base Service Interface - LSP Compliant
 *
 * Defines the fundamental contract that all services must follow to ensure
 * Liskov Substitution Principle compliance throughout the application.
 */
// @ts-nocheck


/**
 * Standard error types that services can throw
 * This ensures LSP compliance by defining exactly which exceptions are allowed
 */
export interface ServiceError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, any>;
}

export class NotFoundError extends Error implements ServiceError {
  readonly code = 'NOT_FOUND';
  constructor(
    message: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error implements ServiceError {
  readonly code = 'VALIDATION_ERROR';
  constructor(
    message: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends Error implements ServiceError {
  readonly code = 'UNAUTHORIZED';
  constructor(
    message: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ServiceUnavailableError extends Error implements ServiceError {
  readonly code = 'SERVICE_UNAVAILABLE';
  constructor(
    message: string,
    public readonly details?: Record<string, any>,
  ) {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Base result type for service operations
 * Ensures consistent return patterns across all services
 */
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: ServiceError;
  metadata?: Record<string, any>;
}

/**
 * Validation result interface
 * Standardizes validation responses across all services
 */
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings?: string[];
}

/**
 * Base service interface that all services must implement
 *
 * This interface defines the fundamental contract that ensures:
 * - Consistent error handling (LSP: no strengthening of preconditions)
 * - Predictable return types (LSP: no weakening of postconditions)
 * - Standard lifecycle methods (LSP: behavioral consistency)
 */
export interface IBaseService {
  /**
   * Service identifier - must be unique and immutable
   */
  readonly serviceId: string;

  /**
   * Service version - for compatibility checking
   */
  readonly version: string;

  /**
   * Initialize the service
   *
   * LSP Contract:
   * - Must return ServiceResult with success=true when successful
   * - Must return ServiceResult with success=false and error when failed
   * - Must not throw exceptions (use ServiceResult.error instead)
   */
  initialize(): Promise<ServiceResult<void>>;

  /**
   * Check if service is healthy and operational
   *
   * LSP Contract:
   * - Must return boolean indicating service health
   * - Must not throw exceptions
   * - Must complete within reasonable time (< 5 seconds)
   */
  isHealthy(): Promise<boolean>;

  /**
   * Cleanup resources before service shutdown
   *
   * LSP Contract:
   * - Must return ServiceResult indicating cleanup status
   * - Must not throw exceptions
   * - Must be idempotent (safe to call multiple times)
   */
  cleanup(): Promise<ServiceResult<void>>;

  /**
   * Get service metadata and current status
   *
   * LSP Contract:
   * - Must return current service information
   * - Must not expose sensitive information
   * - Must not throw exceptions
   */
  getServiceInfo(): ServiceInfo;
}

/**
 * Service information interface
 */
export interface ServiceInfo {
  serviceId: string;
  version: string;
  status: 'initializing' | 'healthy' | 'degraded' | 'unhealthy' | 'stopped';
  uptime: number; // milliseconds
  lastHealthCheck: Date;
  dependencies: string[];
  capabilities: string[];
}

/**
 * Repository interface following LSP
 *
 * Defines a contract that all repository implementations must follow
 * without strengthening preconditions or weakening postconditions
 */
export interface IBaseRepository<T, K = string> extends IBaseService {
  /**
   * Find entity by ID
   *
   * LSP Contract:
   * - Returns null if entity not found (never throws NotFoundError)
   * - Returns entity if found
   * - Throws ValidationError only if id is invalid format
   * - Never throws other exceptions
   */
  findById(id: K): Promise<T | null>;

  /**
   * Find entities by criteria
   *
   * LSP Contract:
   * - Returns empty array if no entities match
   * - Returns array of matching entities
   * - Throws ValidationError only if criteria is invalid
   * - Never throws other exceptions
   */
  find(criteria: Partial<T>): Promise<T[]>;

  /**
   * Create new entity
   *
   * LSP Contract:
   * - Returns created entity with generated ID
   * - Throws ValidationError if data is invalid
   * - Never throws other exceptions
   * - Data must be validated before creation
   */
  create(data: Omit<T, 'id'>): Promise<T>;

  /**
   * Update existing entity
   *
   * LSP Contract:
   * - Returns updated entity if found and updated
   * - Returns null if entity not found
   * - Throws ValidationError if data is invalid
   * - Never throws other exceptions
   */
  update(id: K, data: Partial<T>): Promise<T | null>;

  /**
   * Delete entity by ID
   *
   * LSP Contract:
   * - Returns true if entity was found and deleted
   * - Returns false if entity was not found
   * - Never throws exceptions
   * - Must be idempotent
   */
  delete(id: K): Promise<boolean>;

  /**
   * Count entities matching criteria
   *
   * LSP Contract:
   * - Returns 0 if no entities match
   * - Returns positive number if entities match
   * - Never throws exceptions
   */
  count(criteria?: Partial<T>): Promise<number>;
}

/**
 * Authentication service interface following LSP
 *
 * Defines contracts that all authentication implementations must follow
 */
export interface IAuthenticationService extends IBaseService {
  /**
   * Authenticate user with credentials
   *
   * LSP Contract:
   * - Returns ServiceResult with user data if authentication successful
   * - Returns ServiceResult with error if authentication failed
   * - Never throws UnauthorizedError (use ServiceResult.error instead)
   * - Never throws other exceptions
   */
  authenticate(credentials: any): Promise<ServiceResult<any>>;

  /**
   * Validate token
   *
   * LSP Contract:
   * - Returns ServiceResult with decoded token if valid
   * - Returns ServiceResult with error if invalid
   * - Never throws exceptions
   */
  validateToken(token: string): Promise<ServiceResult<any>>;

  /**
   * Generate new token
   *
   * LSP Contract:
   * - Returns ServiceResult with new token if successful
   * - Returns ServiceResult with error if failed
   * - Never throws exceptions
   */
  generateToken(payload: any): Promise<ServiceResult<string>>;
}
