/**
 * Category Types (ALI-118)
 */

/**
 * Service category
 */
export interface Category {
  id: string;
  name: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

/**
 * Category with service count
 */
export interface CategoryWithCount extends Category {
  _count?: {
    services: number;
  };
}

/**
 * Category with services (populated)
 */
export interface CategoryWithServices extends Category {
  services: Array<{
    id: string;
    name: string;
    thumbnail?: string;
    createdAt: Date | string;
  }>;
}

/**
 * Input for creating a category
 */
export interface CreateCategoryInput {
  name: string;
}

/**
 * Input for updating a category
 */
export interface UpdateCategoryInput {
  name?: string;
}
