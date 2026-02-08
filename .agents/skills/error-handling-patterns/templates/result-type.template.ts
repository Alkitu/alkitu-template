/**
 * Result Type Template
 *
 * Production-ready Result type for explicit error handling in TypeScript.
 * Alternative to throwing exceptions for expected errors.
 *
 * Usage:
 * 1. Copy this file to your project (e.g., src/types/result.ts)
 * 2. Use Result<T, E> for operations that can fail
 * 3. Pattern match with if (result.ok) { ... } else { ... }
 * 4. Chain operations with map, flatMap, mapErr
 */

// ============================================================================
// Core Result Type
// ============================================================================

/**
 * Result type representing success or failure
 * @template T Success value type
 * @template E Error type (defaults to Error)
 */
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

// ============================================================================
// Constructor Functions
// ============================================================================

/**
 * Create a successful Result
 */
export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

/**
 * Create a failed Result
 */
export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

// ============================================================================
// Pattern Matching Helpers
// ============================================================================

/**
 * Match on Result with explicit handlers
 *
 * @example
 * const message = match(result, {
 *   ok: (value) => `Success: ${value}`,
 *   err: (error) => `Error: ${error.message}`,
 * });
 */
export function match<T, E, R>(
  result: Result<T, E>,
  handlers: {
    ok: (value: T) => R;
    err: (error: E) => R;
  },
): R {
  if (result.ok) {
    return handlers.ok(result.value);
  }
  return handlers.err(result.error);
}

// ============================================================================
// Transformation Functions
// ============================================================================

/**
 * Map the success value
 *
 * @example
 * const doubled = map(result, (x) => x * 2);
 */
export function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U,
): Result<U, E> {
  if (result.ok) {
    return Ok(fn(result.value));
  }
  return result;
}

/**
 * Map the error value
 *
 * @example
 * const friendlyError = mapErr(result, (err) => `Failed: ${err.message}`);
 */
export function mapErr<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F,
): Result<T, F> {
  if (!result.ok) {
    return Err(fn(result.error));
  }
  return result;
}

/**
 * FlatMap (bind/chain) - for chaining operations that return Result
 *
 * @example
 * const result = flatMap(parseJSON(jsonString), (data) => validate(data));
 */
export function flatMap<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>,
): Result<U, E> {
  if (result.ok) {
    return fn(result.value);
  }
  return result;
}

/**
 * Alias for flatMap (common in functional programming)
 */
export const chain = flatMap;
export const andThen = flatMap;

// ============================================================================
// Unwrapping Functions
// ============================================================================

/**
 * Unwrap the value or throw the error
 * Use with caution - defeats the purpose of Result type
 *
 * @example
 * const value = unwrap(result); // Throws if error
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value;
  }
  throw result.error;
}

/**
 * Unwrap the value or return a default
 *
 * @example
 * const value = unwrapOr(result, 0); // Returns 0 if error
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (result.ok) {
    return result.value;
  }
  return defaultValue;
}

/**
 * Unwrap the value or compute a default from the error
 *
 * @example
 * const value = unwrapOrElse(result, (err) => console.error(err) || 0);
 */
export function unwrapOrElse<T, E>(
  result: Result<T, E>,
  fn: (error: E) => T,
): T {
  if (result.ok) {
    return result.value;
  }
  return fn(result.error);
}

// ============================================================================
// Querying Functions
// ============================================================================

/**
 * Check if Result is Ok
 */
export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok === true;
}

/**
 * Check if Result is Err
 */
export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return result.ok === false;
}

// ============================================================================
// Combining Results
// ============================================================================

/**
 * Combine multiple Results into one
 * Returns Ok with array of values if all are Ok
 * Returns first Err if any are Err
 *
 * @example
 * const result = all([result1, result2, result3]);
 * // Result<[T1, T2, T3], E>
 */
export function all<T extends readonly Result<any, any>[]>(
  results: T,
): Result<
  { [K in keyof T]: T[K] extends Result<infer U, any> ? U : never },
  T[number] extends Result<any, infer E> ? E : never
> {
  const values: any[] = [];

  for (const result of results) {
    if (!result.ok) {
      return result as any;
    }
    values.push(result.value);
  }

  return Ok(values as any);
}

/**
 * Return first Ok result, or last Err if all are Err
 *
 * @example
 * const result = any([tryMethod1(), tryMethod2(), tryMethod3()]);
 */
export function any<T, E>(results: Result<T, E>[]): Result<T, E> {
  let lastErr: Result<T, E> | undefined;

  for (const result of results) {
    if (result.ok) {
      return result;
    }
    lastErr = result;
  }

  return lastErr || Err(new Error('No results provided') as any);
}

// ============================================================================
// Async Result Helpers
// ============================================================================

/**
 * Wrap an async operation in a Result
 *
 * @example
 * const result = await fromAsync(async () => {
 *   const response = await fetch('/api/data');
 *   return response.json();
 * });
 */
export async function fromAsync<T>(
  fn: () => Promise<T>,
): Promise<Result<T, Error>> {
  try {
    const value = await fn();
    return Ok(value);
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Wrap a sync operation in a Result
 *
 * @example
 * const result = fromSync(() => JSON.parse(jsonString));
 */
export function fromSync<T>(fn: () => T): Result<T, Error> {
  try {
    const value = fn();
    return Ok(value);
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)));
  }
}

/**
 * Convert a Promise to a Result
 *
 * @example
 * const result = await fromPromise(fetch('/api/data'));
 */
export async function fromPromise<T>(
  promise: Promise<T>,
): Promise<Result<T, Error>> {
  try {
    const value = await promise;
    return Ok(value);
  } catch (error) {
    return Err(error instanceof Error ? error : new Error(String(error)));
  }
}

// ============================================================================
// Convenience Type Guards
// ============================================================================

/**
 * Type guard for successful Result
 */
export function assertOk<T, E>(result: Result<T, E>): asserts result is { ok: true; value: T } {
  if (!result.ok) {
    throw result.error;
  }
}

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example 1: Basic usage with type safety
 *
 * function parseJSON<T>(json: string): Result<T, SyntaxError> {
 *   try {
 *     const value = JSON.parse(json) as T;
 *     return Ok(value);
 *   } catch (error) {
 *     return Err(error as SyntaxError);
 *   }
 * }
 *
 * const result = parseJSON<User>(userJson);
 * if (result.ok) {
 *   console.log(result.value.name); // Type-safe access
 * } else {
 *   console.error('Parse failed:', result.error.message);
 * }
 */

/**
 * Example 2: Chaining operations
 *
 * const result = flatMap(
 *   parseJSON<User>(jsonString),
 *   (user) => validateUser(user)
 * );
 *
 * function validateUser(user: User): Result<User, ValidationError> {
 *   if (!user.email) {
 *     return Err(new ValidationError('Email is required'));
 *   }
 *   return Ok(user);
 * }
 */

/**
 * Example 3: Async operations
 *
 * async function fetchUser(id: string): Promise<Result<User, Error>> {
 *   return fromAsync(async () => {
 *     const response = await fetch(`/api/users/${id}`);
 *     if (!response.ok) {
 *       throw new Error(`HTTP ${response.status}`);
 *     }
 *     return response.json();
 *   });
 * }
 *
 * const result = await fetchUser('123');
 * const user = unwrapOr(result, null);
 */

/**
 * Example 4: Pattern matching
 *
 * const message = match(result, {
 *   ok: (user) => `Welcome, ${user.name}!`,
 *   err: (error) => `Error: ${error.message}`,
 * });
 */

/**
 * Example 5: Combining multiple results
 *
 * const result = all([
 *   parseJSON<User>(userJson),
 *   parseJSON<Settings>(settingsJson),
 *   parseJSON<Preferences>(preferencesJson),
 * ]);
 *
 * if (result.ok) {
 *   const [user, settings, preferences] = result.value;
 *   // All parsed successfully
 * }
 */

/**
 * Example 6: Fallback with any
 *
 * const result = any([
 *   tryFetchFromCache(id),
 *   tryFetchFromDatabase(id),
 *   tryFetchFromAPI(id),
 * ]);
 * // Returns first successful result, or last error
 */
