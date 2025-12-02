/**
 * Request Types (ALI-119)
 */

import { Service } from './service';
import { User } from './user';
import { WorkLocation } from './location';

/**
 * Request status enum
 */
export enum RequestStatus {
  PENDING = 'PENDING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Service request with full lifecycle management
 */
export interface Request {
  id: string;
  userId: string;
  serviceId: string;
  locationId: string;
  assignedToId?: string | null;
  executionDateTime: Date | string;
  templateResponses: Record<string, unknown>;
  note?: Record<string, unknown> | null;
  status: RequestStatus;
  cancellationRequested: boolean;
  cancellationRequestedAt?: Date | string | null;
  completedAt?: Date | string | null;
  deletedAt?: Date | string | null;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Request with populated user (creator)
 */
export interface RequestWithUser extends Request {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    company?: string | null;
  };
}

/**
 * Request with populated service
 */
export interface RequestWithService extends Request {
  service: {
    id: string;
    name: string;
    categoryId: string;
  };
}

/**
 * Request with populated location
 */
export interface RequestWithLocation extends Request {
  location: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    building?: string | null;
    tower?: string | null;
    floor?: string | null;
    unit?: string | null;
  };
}

/**
 * Request with populated assigned employee
 */
export interface RequestWithAssignee extends Request {
  assignedTo?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
}

/**
 * Request with all relations populated (full detail view)
 */
export interface RequestDetail extends Request {
  user: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    company?: string | null;
  };
  service: {
    id: string;
    name: string;
    categoryId: string;
    category: {
      id: string;
      name: string;
    };
  };
  location: {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    building?: string | null;
    tower?: string | null;
    floor?: string | null;
    unit?: string | null;
  };
  assignedTo?: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
  } | null;
}

/**
 * Request list item (minimal fields for lists)
 */
export interface RequestListItem {
  id: string;
  userId: string;
  serviceId: string;
  locationId: string;
  assignedToId?: string | null;
  executionDateTime: Date | string;
  status: RequestStatus;
  createdAt: Date | string;
  service?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    firstname: string;
    lastname: string;
    company?: string | null;
  };
  assignedTo?: {
    id: string;
    firstname: string;
    lastname: string;
  } | null;
}

/**
 * Input for creating a request
 */
export interface CreateRequestInput {
  serviceId: string;
  locationId: string;
  executionDateTime: Date | string;
  templateResponses: Record<string, unknown>;
  note?: Record<string, unknown>;
}

/**
 * Input for updating a request
 */
export interface UpdateRequestInput {
  locationId?: string;
  executionDateTime?: Date | string;
  templateResponses?: Record<string, unknown>;
  note?: Record<string, unknown> | null;
  status?: RequestStatus;
  assignedToId?: string | null;
}

/**
 * Input for assigning a request to an employee
 */
export interface AssignRequestInput {
  assignedToId: string;
}

/**
 * Input for requesting cancellation
 */
export interface RequestCancellationInput {
  reason?: string;
}

/**
 * Input for completing a request
 */
export interface CompleteRequestInput {
  notes?: string;
}

/**
 * Request query filters
 */
export interface RequestQueryFilters {
  status?: RequestStatus;
  userId?: string;
  serviceId?: string;
  assignedToId?: string;
  startDate?: Date | string;
  endDate?: Date | string;
}
