/**
 * Service Types (ALI-118 + Form Template Migration)
 */

import { Category } from './category';
import { FormTemplate } from './form-template.types';

/**
 * Service with FormTemplate relation
 */
export interface Service {
  id: string;
  name: string;
  categoryId: string;
  thumbnail?: string | null;
  iconColor?: string | null;
  formTemplateIds: string[];
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
 * Service with FormTemplates populated
 */
export interface ServiceWithFormTemplates extends Service {
  formTemplates: FormTemplate[];
}

/**
 * Service with both category and form templates populated
 */
export interface ServiceWithRelations extends Service {
  category: {
    id: string;
    name: string;
  };
  formTemplates: FormTemplate[];
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
  iconColor?: string;
  formTemplateIds: string[];
}

/**
 * Input for updating a service
 */
export interface UpdateServiceInput {
  name?: string;
  categoryId?: string;
  thumbnail?: string | null;
  iconColor?: string | null;
  formTemplateIds?: string[];
}

/**
 * Service list item (minimal fields for lists)
 */
export interface ServiceListItem {
  id: string;
  name: string;
  categoryId: string;
  thumbnail?: string | null;
  iconColor?: string | null;
  category?: {
    id: string;
    name: string;
  };
}
