import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { LocationsService } from './locations.service';
import { CreateLocationDto, UpdateLocationDto } from './dto';
import { UserRole } from '@alkitu/shared/enums/user-role.enum';

interface AuthenticatedRequest {
  user: {
    userId: string;
    email: string;
    role: string;
    [key: string]: any;
  };
}

/**
 * Locations Controller (ALI-117)
 * Handles HTTP requests for work location management
 */
@ApiTags('locations')
@Controller('locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  /**
   * Create a new work location for the authenticated user
   * POST /locations
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new work location (ALI-117)' })
  @ApiResponse({
    status: 201,
    description: 'Location successfully created',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async create(
    @Body() createLocationDto: CreateLocationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.locationsService.create(req.user.userId, createLocationDto);
  }

  /**
   * Get all locations for the authenticated user
   * GET /locations
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get all work locations for current user (ALI-117)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user locations',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Req() req: AuthenticatedRequest) {
    return this.locationsService.findAllByUser(req.user.userId);
  }

  /**
   * Get all locations for a specific user (Admin only)
   * GET /locations/user/:userId
   */
  @Get('user/:userId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get locations for a specific user (Admin only)' })
  @ApiParam({ name: 'userId', description: 'Target user ID' })
  @ApiResponse({
    status: 200,
    description: 'List of user locations',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin only' })
  async findAllByUserId(@Param('userId') userId: string) {
    return this.locationsService.findAllByUser(userId);
  }

  /**
   * Get a specific location by ID
   * GET /locations/:id
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a specific work location by ID (ALI-117)' })
  @ApiParam({
    name: 'id',
    description: 'Location ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Location details',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the location owner',
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.locationsService.findOne(id, req.user.userId);
  }

  /**
   * Update a location
   * PUT /locations/:id
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a work location (ALI-117)' })
  @ApiParam({
    name: 'id',
    description: 'Location ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Location successfully updated',
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the location owner',
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.locationsService.update(id, req.user.userId, updateLocationDto, req.user.role as UserRole);
  }

  /**
   * Delete a location
   * DELETE /locations/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a work location (ALI-117)' })
  @ApiParam({
    name: 'id',
    description: 'Location ID',
    example: '507f1f77bcf86cd799439011',
  })
  @ApiResponse({
    status: 200,
    description: 'Location successfully deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Not the location owner',
  })
  @ApiResponse({ status: 404, description: 'Location not found' })
  async remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.locationsService.remove(id, req.user.userId, req.user.role as UserRole);
  }
}
