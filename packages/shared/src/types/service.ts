/**
 * Service Types (ALI-118)
 */

import { RequestTemplate } from './request-template';
import { Category } from './category';

/**
 * Service with dynamic request template
 */
export interface Service {
  id: string;
  name: string;
  categoryId: string;
  thumbnail?: string | null;
  requestTemplate: RequestTemplate;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Service with category populated
 */
export interface ServiceWithCategory extends Service {
  category: {
    id: string;
    name: string;
  };
}

/**
 * Service with full category object
 */
export interface ServiceWithFullCategory extends Service {
  category: Category;
}

/**
 * Input for creating a service
 */
export interface CreateServiceInput {
  name: string;
  categoryId: string;
  thumbnail?: string;
  requestTemplate: RequestTemplate;
}

/**
 * Input for updating a service
 */
export interface UpdateServiceInput {
  name?: string;
  categoryId?: string;
  thumbnail?: string | null;
  requestTemplate?: RequestTemplate;
}

/**
 * Service list item (minimal fields for lists)
 */
export interface ServiceListItem {
  id: string;
  name: string;
  categoryId: string;
  thumbnail?: string | null;
  category?: {
    id: string;
    name: string;
  };
}
