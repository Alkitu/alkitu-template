/**
 * NestJS Controller Template
 *
 * Production-ready NestJS REST controller following Alkitu Template patterns.
 * Includes CRUD operations, guards, Swagger documentation, and rate limiting.
 *
 * Usage:
 * 1. Copy this template to packages/api/src/your-module/your-module.controller.ts
 * 2. Update the resource name and module imports
 * 3. Create corresponding service and DTOs
 * 4. Register controller in module
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle, SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';

// Import service and DTOs
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { FilterResourcesDto } from './dto/filter-resources.dto';

// ============================================================================
// Controller Definition
// ============================================================================

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  // ==========================================================================
  // CREATE - POST /resources
  // ==========================================================================

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiResponse({
    status: 201,
    description: 'Resource successfully created',
    schema: {
      example: {
        id: '60d5ecb74f3b2c001c8b4566',
        name: 'Example Resource',
        description: 'Resource description',
        status: 'ACTIVE',
        userId: '60d5ecb74f3b2c001c8b4567',
        createdAt: '2024-06-29T12:00:00.000Z',
        updatedAt: '2024-06-29T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
    schema: {
      example: {
        message: ['name must be a string', 'status must be a valid enum value'],
        error: 'Bad Request',
        statusCode: 400,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Authentication required',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Resource already exists',
  })
  async create(
    @Body() createResourceDto: CreateResourceDto,
    @Request() req: { user: { id: string } },
  ) {
    return this.resourcesService.create(createResourceDto, req.user.id);
  }

  // ==========================================================================
  // READ - GET /resources (List with pagination)
  // ==========================================================================

  @Get()
  @SkipThrottle() // No rate limit for public read endpoint
  @ApiOperation({ summary: 'Get all resources with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['ACTIVE', 'ARCHIVED', 'DRAFT'],
    description: 'Filter by status',
  })
  @ApiQuery({ name: 'search', required: false, type: String, description: 'Search term' })
  @ApiResponse({
    status: 200,
    description: 'Resources retrieved successfully',
    schema: {
      example: {
        items: [
          {
            id: '60d5ecb74f3b2c001c8b4566',
            name: 'Example Resource',
            description: 'Resource description',
            status: 'ACTIVE',
            userId: '60d5ecb74f3b2c001c8b4567',
            user: {
              id: '60d5ecb74f3b2c001c8b4567',
              email: 'user@example.com',
              firstname: 'John',
              lastname: 'Doe',
            },
            createdAt: '2024-06-29T12:00:00.000Z',
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 100,
          totalPages: 5,
          hasNext: true,
          hasPrev: false,
        },
      },
    },
  })
  async findAll(@Query() filterDto: FilterResourcesDto) {
    return this.resourcesService.findAll(filterDto);
  }

  // ==========================================================================
  // READ - GET /resources/:id (Single resource)
  // ==========================================================================

  @Get(':id')
  @ApiOperation({ summary: 'Get a single resource by ID' })
  @ApiParam({ name: 'id', type: String, description: 'Resource ID' })
  @ApiResponse({
    status: 200,
    description: 'Resource found',
    schema: {
      example: {
        id: '60d5ecb74f3b2c001c8b4566',
        name: 'Example Resource',
        description: 'Resource description',
        status: 'ACTIVE',
        userId: '60d5ecb74f3b2c001c8b4567',
        user: {
          id: '60d5ecb74f3b2c001c8b4567',
          email: 'user@example.com',
          firstname: 'John',
          lastname: 'Doe',
        },
        createdAt: '2024-06-29T12:00:00.000Z',
        updatedAt: '2024-06-29T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found',
    schema: {
      example: {
        message: 'Resource with ID 60d5ecb74f3b2c001c8b4566 not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  // ==========================================================================
  // UPDATE - PATCH /resources/:id (Partial update)
  // ==========================================================================

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update a resource (partial update)' })
  @ApiParam({ name: 'id', type: String, description: 'Resource ID' })
  @ApiResponse({
    status: 200,
    description: 'Resource successfully updated',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({
    status: 404,
    description: 'Resource not found',
  })
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.resourcesService.update(id, updateResourceDto, req.user);
  }

  // ==========================================================================
  // UPDATE - PUT /resources/:id (Full replacement)
  // ==========================================================================

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Replace a resource (full update)' })
  @ApiParam({ name: 'id', type: String, description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource successfully replaced' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async replace(
    @Param('id') id: string,
    @Body() createResourceDto: CreateResourceDto,
    @Request() req: { user: { id: string; role: string } },
  ) {
    return this.resourcesService.replace(id, createResourceDto, req.user);
  }

  // ==========================================================================
  // DELETE - DELETE /resources/:id
  // ==========================================================================

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN) // Only admins can delete
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Delete a resource (soft delete)' })
  @ApiParam({ name: 'id', type: String, description: 'Resource ID' })
  @ApiResponse({ status: 204, description: 'Resource successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async remove(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    await this.resourcesService.remove(id, req.user.id);
  }

  // ==========================================================================
  // CUSTOM ACTIONS
  // ==========================================================================

  /**
   * Archive a resource
   * POST /resources/:id/archive
   */
  @Post(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Archive a resource' })
  @ApiParam({ name: 'id', type: String, description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource successfully archived' })
  @ApiResponse({ status: 400, description: 'Resource already archived' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async archive(
    @Param('id') id: string,
    @Body() body: { reason?: string },
    @Request() req: { user: { id: string } },
  ) {
    return this.resourcesService.archive(id, body.reason, req.user.id);
  }

  /**
   * Restore an archived resource
   * POST /resources/:id/restore
   */
  @Post(':id/restore')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Restore an archived resource' })
  @ApiParam({ name: 'id', type: String, description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource successfully restored' })
  @ApiResponse({ status: 400, description: 'Resource is not archived' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async restore(
    @Param('id') id: string,
    @Request() req: { user: { id: string } },
  ) {
    return this.resourcesService.restore(id, req.user.id);
  }

  /**
   * Assign resource to users
   * POST /resources/:id/assign
   */
  @Post(':id/assign')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Assign resource to users' })
  @ApiParam({ name: 'id', type: String, description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource successfully assigned' })
  @ApiResponse({ status: 400, description: 'Invalid user IDs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async assign(
    @Param('id') id: string,
    @Body() body: { assignedToIds: string[]; notify?: boolean },
    @Request() req: { user: { id: string } },
  ) {
    return this.resourcesService.assign(
      id,
      body.assignedToIds,
      body.notify ?? true,
      req.user.id,
    );
  }

  // ==========================================================================
  // STATISTICS / ANALYTICS
  // ==========================================================================

  /**
   * Get resource statistics
   * GET /resources/stats/overview
   */
  @Get('stats/overview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get resource statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
    schema: {
      example: {
        total: 100,
        active: 75,
        archived: 20,
        draft: 5,
        byCategory: {
          'Category 1': 30,
          'Category 2': 40,
          'Category 3': 30,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getStats() {
    return this.resourcesService.getStats();
  }

  /**
   * Get user's resources count
   * GET /resources/stats/user-count
   */
  @Get('stats/user-count')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get count of resources owned by current user' })
  @ApiResponse({
    status: 200,
    description: 'Count retrieved successfully',
    schema: {
      example: {
        total: 15,
        active: 10,
        archived: 3,
        draft: 2,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUserCount(@Request() req: { user: { id: string } }) {
    return this.resourcesService.getUserResourceCount(req.user.id);
  }

  // ==========================================================================
  // BULK OPERATIONS
  // ==========================================================================

  /**
   * Bulk delete resources
   * POST /resources/bulk/delete
   */
  @Post('bulk/delete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk delete resources (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Resources deleted successfully',
    schema: {
      example: {
        deleted: 5,
        failed: 0,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin access required' })
  async bulkDelete(
    @Body() body: { ids: string[] },
    @Request() req: { user: { id: string } },
  ) {
    return this.resourcesService.bulkDelete(body.ids, req.user.id);
  }

  /**
   * Bulk update resource status
   * POST /resources/bulk/update-status
   */
  @Post('bulk/update-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Bulk update resource status' })
  @ApiResponse({
    status: 200,
    description: 'Resources updated successfully',
    schema: {
      example: {
        updated: 10,
        failed: 0,
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async bulkUpdateStatus(
    @Body() body: { ids: string[]; status: string },
    @Request() req: { user: { id: string } },
  ) {
    return this.resourcesService.bulkUpdateStatus(body.ids, body.status, req.user.id);
  }
}

// ============================================================================
// Module Registration
// ============================================================================

/**
 * Register controller in module:
 *
 * import { Module } from '@nestjs/common';
 * import { ResourcesController } from './resources.controller';
 * import { ResourcesService } from './resources.service';
 * import { PrismaModule } from '../prisma/prisma.module';
 *
 * @Module({
 *   imports: [PrismaModule],
 *   controllers: [ResourcesController],
 *   providers: [ResourcesService],
 *   exports: [ResourcesService],
 * })
 * export class ResourcesModule {}
 */
