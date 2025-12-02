/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
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
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
 * Controller for managing services with dynamic templates (ALI-118)
 * @class ServicesController
 */
@ApiTags('services')
@Controller('services')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * Create a new service (ADMIN only)
   * @route POST /services
   */
  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new service (ADMIN only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Service created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request template structure',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Category not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - ADMIN role required',
  })
  create(@Body() createServiceDto: CreateServiceDto, @Request() req) {
    return this.servicesService.create(createServiceDto, req.user?.userId);
  }

  /**
   * Get all services (optionally filter by category)
   * @route GET /services
   */
  @Get()
  @ApiOperation({ summary: 'Get all services (optionally filter by category)' })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter services by category ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Services retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.servicesService.findAll(categoryId);
  }

  /**
   * Get service by ID
   * @route GET /services/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service retrieved successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  /**
   * Update a service (ADMIN only)
   * @route PATCH /services/:id
   */
  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update a service (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request template structure',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service or category not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - ADMIN role required',
  })
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req,
  ) {
    return this.servicesService.update(id, updateServiceDto, req.user?.userId);
  }

  /**
   * Delete a service (ADMIN only)
   * @route DELETE /services/:id
   */
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a service (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Service deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - ADMIN role required',
  })
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
