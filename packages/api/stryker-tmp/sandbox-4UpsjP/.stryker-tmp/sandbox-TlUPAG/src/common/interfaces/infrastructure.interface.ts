// @ts-nocheck
// 
import { ServiceResult } from './base-service.interface';

/**
 * Infrastructure Interfaces - DIP Compliant
 * 
 * These interfaces follow the Dependency Inversion Principle by:
 * - Providing abstractions for infrastructure concerns
 * - Allowing high-level modules to depend on abstractions
 * - Enabling different implementations without changing business logic
 * - Supporting dependency injection and testing
 */

// =============================================================================
// LOGGING ABSTRACTIONS
// =============================================================================

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose'
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  operation?: string;
  metadata?: Record<string, any>;
}

export interface ILogger {
  error(message: string, error?: Error, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  debug(message: string, context?: LogContext): void;
  verbose(message: string, context?: LogContext): void;
}

// =============================================================================
// DATABASE ABSTRACTIONS
// =============================================================================

export interface DatabaseConnection {
  isConnected: boolean;
  database: string;
  host: string;
  port: number;
}

export interface QueryOptions {
  timeout?: number;
  retries?: number;
  transaction?: boolean;
}

export interface IDatabase {
  connect(): Promise<ServiceResult<DatabaseConnection>>;
  disconnect(): Promise<ServiceResult<void>>;
  isHealthy(): Promise<boolean>;
  
  // Basic CRUD operations
  findOne<T>(collection: string, filter: Record<string, any>, options?: QueryOptions): Promise<ServiceResult<T | null>>;
  findMany<T>(collection: string, filter: Record<string, any>, options?: QueryOptions): Promise<ServiceResult<T[]>>;
  insertOne<T>(collection: string, document: T, options?: QueryOptions): Promise<ServiceResult<T>>;
  updateOne<T>(collection: string, filter: Record<string, any>, update: Partial<T>, options?: QueryOptions): Promise<ServiceResult<T | null>>;
  deleteOne(collection: string, filter: Record<string, any>, options?: QueryOptions): Promise<ServiceResult<boolean>>;
  
  // Transaction support
  startTransaction(): Promise<ServiceResult<string>>; // Returns transaction ID
  commitTransaction(transactionId: string): Promise<ServiceResult<void>>;
  rollbackTransaction(transactionId: string): Promise<ServiceResult<void>>;
}

// =============================================================================
// CACHE ABSTRACTIONS
// =============================================================================

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  tags?: string[]; // Cache tags for invalidation
}

export interface ICache {
  get<T>(key: string): Promise<ServiceResult<T | null>>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<ServiceResult<void>>;
  delete(key: string): Promise<ServiceResult<boolean>>;
  clear(): Promise<ServiceResult<void>>;
  
  // Bulk operations
  getMany<T>(keys: string[]): Promise<ServiceResult<Record<string, T | null>>>;
  setMany<T>(entries: Record<string, T>, options?: CacheOptions): Promise<ServiceResult<void>>;
  deleteMany(keys: string[]): Promise<ServiceResult<number>>;
  
  // Cache management
  invalidateByTags(tags: string[]): Promise<ServiceResult<number>>;
  exists(key: string): Promise<ServiceResult<boolean>>;
  ttl(key: string): Promise<ServiceResult<number>>; // Returns remaining TTL in seconds
}

// =============================================================================
// FILE STORAGE ABSTRACTIONS
// =============================================================================

export interface FileMetadata {
  filename: string;
  size: number;
  mimeType: string;
  uploadedAt: Date;
  etag?: string;
  url?: string;
}

export interface UploadOptions {
  public?: boolean;
  maxAge?: number;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface IFileStorage {
  upload(key: string, data: Buffer, options?: UploadOptions): Promise<ServiceResult<FileMetadata>>;
  download(key: string): Promise<ServiceResult<{ data: Buffer; metadata: FileMetadata }>>;
  delete(key: string): Promise<ServiceResult<boolean>>;
  exists(key: string): Promise<ServiceResult<boolean>>;
  getMetadata(key: string): Promise<ServiceResult<FileMetadata>>;
  
  // URL generation
  getSignedUrl(key: string, expiresIn?: number): Promise<ServiceResult<string>>;
  getPublicUrl(key: string): Promise<ServiceResult<string>>;
  
  // Bulk operations
  deleteMany(keys: string[]): Promise<ServiceResult<number>>;
  listFiles(prefix?: string, limit?: number): Promise<ServiceResult<FileMetadata[]>>;
}

// =============================================================================
// CONFIGURATION ABSTRACTIONS
// =============================================================================

export interface IConfigurationProvider {
  get<T>(key: string, defaultValue?: T): T;
  getString(key: string, defaultValue?: string): string;
  getNumber(key: string, defaultValue?: number): number;
  getBoolean(key: string, defaultValue?: boolean): boolean;
  getObject<T>(key: string, defaultValue?: T): T;
  
  // Environment-specific configurations
  isDevelopment(): boolean;
  isProduction(): boolean;
  isTesting(): boolean;
  
  // Dynamic configuration
  refresh(): Promise<ServiceResult<void>>;
  watch(key: string, callback: (newValue: any, oldValue: any) => void): void;
}

// =============================================================================
// EVENT BUS ABSTRACTIONS
// =============================================================================

export interface EventMetadata {
  eventId: string;
  timestamp: Date;
  source: string;
  version: string;
  correlationId?: string;
}

export interface DomainEvent<TData = any> {
  type: string;
  data: TData;
  metadata: EventMetadata;
}

export interface EventHandler<TEvent extends DomainEvent = DomainEvent> {
  handle(event: TEvent): Promise<ServiceResult<void>>;
}

export interface IEventBus {
  publish<TData>(eventType: string, data: TData, metadata?: Partial<EventMetadata>): Promise<ServiceResult<void>>;
  subscribe<TEvent extends DomainEvent>(eventType: string, handler: EventHandler<TEvent>): Promise<ServiceResult<void>>;
  unsubscribe(eventType: string, handler: EventHandler): Promise<ServiceResult<void>>;
  
  // Bulk operations
  publishMany(events: DomainEvent[]): Promise<ServiceResult<void>>;
  
  // Event store operations (optional)
  getEvents(correlationId: string): Promise<ServiceResult<DomainEvent[]>>;
  replay(fromTimestamp: Date, toTimestamp?: Date): Promise<ServiceResult<number>>;
}

// =============================================================================
// HTTP CLIENT ABSTRACTIONS
// =============================================================================

export interface HttpRequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  validateStatus?: (status: number) => boolean;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface IHttpClient {
  get<T>(url: string, options?: HttpRequestOptions): Promise<ServiceResult<HttpResponse<T>>>;
  post<T, D = any>(url: string, data?: D, options?: HttpRequestOptions): Promise<ServiceResult<HttpResponse<T>>>;
  put<T, D = any>(url: string, data?: D, options?: HttpRequestOptions): Promise<ServiceResult<HttpResponse<T>>>;
  patch<T, D = any>(url: string, data?: D, options?: HttpRequestOptions): Promise<ServiceResult<HttpResponse<T>>>;
  delete<T>(url: string, options?: HttpRequestOptions): Promise<ServiceResult<HttpResponse<T>>>;
  
  // Request interceptors
  interceptRequest(interceptor: (config: HttpRequestOptions) => HttpRequestOptions): void;
  interceptResponse<T>(interceptor: (response: HttpResponse<T>) => HttpResponse<T>): void;
}

// =============================================================================
// QUEUE ABSTRACTIONS
// =============================================================================

export interface QueueJob<TData = any> {
  id: string;
  type: string;
  data: TData;
  priority: number;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  processedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  error?: string;
}

export interface QueueOptions {
  priority?: number;
  delay?: number; // Delay in milliseconds
  maxAttempts?: number;
  backoff?: 'exponential' | 'linear' | number;
}

export interface JobProcessor<TData = any> {
  process(job: QueueJob<TData>): Promise<ServiceResult<void>>;
}

export interface IQueue {
  add<TData>(jobType: string, data: TData, options?: QueueOptions): Promise<ServiceResult<QueueJob<TData>>>;
  process<TData>(jobType: string, processor: JobProcessor<TData>): Promise<ServiceResult<void>>;
  
  // Job management
  getJob(jobId: string): Promise<ServiceResult<QueueJob | null>>;
  removeJob(jobId: string): Promise<ServiceResult<boolean>>;
  retryJob(jobId: string): Promise<ServiceResult<QueueJob>>;
  
  // Queue management
  pause(): Promise<ServiceResult<void>>;
  resume(): Promise<ServiceResult<void>>;
  clear(): Promise<ServiceResult<number>>;
  
  // Monitoring
  getJobCounts(): Promise<ServiceResult<{ waiting: number; active: number; completed: number; failed: number }>>;
  getFailedJobs(limit?: number): Promise<ServiceResult<QueueJob[]>>;
}

// =============================================================================
// METRICS AND MONITORING ABSTRACTIONS
// =============================================================================

export interface MetricLabels {
  [key: string]: string | number;
}

export interface IMetrics {
  // Counters
  incrementCounter(name: string, labels?: MetricLabels): void;
  decrementCounter(name: string, labels?: MetricLabels): void;
  
  // Gauges
  setGauge(name: string, value: number, labels?: MetricLabels): void;
  incrementGauge(name: string, value?: number, labels?: MetricLabels): void;
  decrementGauge(name: string, value?: number, labels?: MetricLabels): void;
  
  // Histograms
  recordHistogram(name: string, value: number, labels?: MetricLabels): void;
  
  // Timing
  startTimer(name: string, labels?: MetricLabels): () => void; // Returns function to end timer
  recordDuration(name: string, duration: number, labels?: MetricLabels): void;
  
  // Custom metrics
  recordCustomMetric(name: string, value: number, type: 'counter' | 'gauge' | 'histogram', labels?: MetricLabels): void;
}