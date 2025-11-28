// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - User Data Persistence Only
// packages/api/src/users/interfaces/user-repository.interface.ts

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UpdateUserTagsDto } from '../dto/update-user-tags.dto';
import { User } from '@prisma/client';

export interface IUserRepository {
  // Core CRUD Operations - Single Responsibility
  create(createUserDto: CreateUserDto): Promise<UserResponse>;
  findById(id: string): Promise<UserResponse | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<UserResponse[]>;
  findAllWithFilters(
    filterDto: FilterUsersDto,
  ): Promise<PaginatedUsersResponse>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse>;
  updateTags(
    id: string,
    updateUserTagsDto: UpdateUserTagsDto,
  ): Promise<UserResponseWithTags>;
  delete(id: string): Promise<void>;

  // Password-specific data operations (still data-related)
  updatePassword(id: string, hashedPassword: string): Promise<User>;
  markEmailAsVerified(id: string): Promise<EmailVerificationResponse>;
  updateLastLogin(id: string): Promise<void>;

  // Query operations for data retrieval
  exists(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  count(): Promise<number>;
  countByFilters(where: any): Promise<number>;
}

// Response Types - Data Transfer Objects
export interface UserResponse {
  id: string;
  email: string;
  name: string | null;
  lastName: string | null;
  contactNumber: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date | null;
}

export interface UserResponseWithTags extends UserResponse {
  tags: Array<{ id: string; name: string }>;
}

export interface EmailVerificationResponse {
  id: string;
  email: string;
  emailVerified: Date | null;
  name: string | null;
  lastName: string | null;
}

export interface PaginatedUsersResponse {
  users: UserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
