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
import { RequestsService } from './requests.service';
import {
  CreateRequestDto,
  UpdateRequestDto,
  AssignRequestDto,
  RequestCancellationDto,
  CompleteRequestDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole, RequestStatus } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

/**
 * Controller for managing service requests lifecycle (ALI-119)
 * @class RequestsController
 */
@ApiTags('requests')
@Controller('requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  /**
   * Create a new service request (CLIENT only)
   * @route POST /requests
   */
  @Post()
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Create a new service request (CLIENT only)' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Request created successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid request data or execution date in the past',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Service or location not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - CLIENT role required',
  })
  create(@Body() createRequestDto: CreateRequestDto, @Request() req) {
    return this.requestsService.create(createRequestDto, req.user?.userId);
  }

  /**
   * Get all requests (with filters and role-based access)
   * @route GET /requests
   */
  @Get()
  @ApiOperation({
    summary:
      'Get all requests (role-based: CLIENTs see own, EMPLOYEEs see assigned/unassigned, ADMINs see all)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RequestStatus,
    description: 'Filter by request status',
  })
  @ApiQuery({
    name: 'serviceId',
    required: false,
    description: 'Filter by service ID',
  })
  @ApiQuery({
    name: 'assignedToId',
    required: false,
    description: 'Filter by assigned employee ID',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Filter by execution start date (ISO 8601)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'Filter by execution end date (ISO 8601)',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  findAll(
    @Query('status') status?: RequestStatus,
    @Query('serviceId') serviceId?: string,
    @Query('assignedToId') assignedToId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Request() req?: any,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (serviceId) filters.serviceId = serviceId;
    if (assignedToId) filters.assignedToId = assignedToId;
    if (startDate) filters.startDate = new Date(startDate);
    if (endDate) filters.endDate = new Date(endDate);

    return this.requestsService.findAll(
      req.user?.userId,
      req.user?.role,
      filters,
    );
  }

  /**
   * Get a specific request by ID (with role-based access)
   * @route GET /requests/:id
   */
  @Get(':id')
  @ApiOperation({
    summary:
      'Get a specific request by ID (role-based access: own requests, assigned requests, or all)',
  })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request details',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found or access denied',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  findOne(@Param('id') id: string, @Request() req) {
    return this.requestsService.findOne(id, req.user?.userId, req.user?.role);
  }

  /**
   * Update a request (role-based permissions)
   * @route PATCH /requests/:id
   */
  @Patch(':id')
  @ApiOperation({
    summary:
      'Update a request (CLIENTs can update own PENDING requests, EMPLOYEEs/ADMINs can update assigned requests)',
  })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request updated successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid update data or business rule violation',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  update(
    @Param('id') id: string,
    @Body() updateRequestDto: UpdateRequestDto,
    @Request() req,
  ) {
    return this.requestsService.update(
      id,
      updateRequestDto,
      req.user?.userId,
      req.user?.role,
    );
  }

  /**
   * Delete a request (soft delete, ADMIN only or CLIENT for PENDING)
   * @route DELETE /requests/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary:
      'Delete a request (soft delete, ADMIN can delete any, CLIENTs can delete own PENDING requests)',
  })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Request deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  remove(@Param('id') id: string, @Request() req) {
    return this.requestsService.remove(id, req.user?.userId, req.user?.role);
  }

  /**
   * Assign a request to an employee (EMPLOYEE/ADMIN only)
   * @route POST /requests/:id/assign
   */
  @Post(':id/assign')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiOperation({
    summary:
      'Assign a request to an employee and change status to ONGOING (EMPLOYEE/ADMIN only)',
  })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request assigned successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid assignment data or request not in PENDING status',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request or employee not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - EMPLOYEE/ADMIN role required',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  assign(
    @Param('id') id: string,
    @Body() assignRequestDto: AssignRequestDto,
    @Request() req,
  ) {
    return this.requestsService.assign(
      id,
      assignRequestDto,
      req.user?.userId,
      req.user?.role,
    );
  }

  /**
   * Request cancellation of a request
   * @route POST /requests/:id/cancel
   */
  @Post(':id/cancel')
  @ApiOperation({
    summary:
      'Request cancellation (auto-approved for PENDING or by ADMIN, requires approval for ONGOING)',
  })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Cancellation requested successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Cannot cancel request in current status',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - can only cancel own requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  requestCancellation(
    @Param('id') id: string,
    @Body() cancellationDto: RequestCancellationDto,
    @Request() req,
  ) {
    return this.requestsService.requestCancellation(
      id,
      cancellationDto,
      req.user?.userId,
      req.user?.role,
    );
  }

  /**
   * Complete a request (EMPLOYEE/ADMIN only)
   * @route POST /requests/:id/complete
   */
  @Post(':id/complete')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN)
  @ApiOperation({
    summary:
      'Complete a request and change status to COMPLETED (EMPLOYEE/ADMIN only)',
  })
  @ApiParam({ name: 'id', description: 'Request ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request completed successfully',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Request not in ONGOING status',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Request not found',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Forbidden - can only complete assigned requests',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  complete(
    @Param('id') id: string,
    @Body() completeDto: CompleteRequestDto,
    @Request() req,
  ) {
    return this.requestsService.complete(
      id,
      completeDto,
      req.user?.userId,
      req.user?.role,
    );
  }

  /**
   * Get total count of requests (with role-based filtering)
   * @route GET /requests/stats/count
   */
  @Get('stats/count')
  @ApiOperation({
    summary: 'Get total count of requests (role-based: own, assigned, or all)',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: RequestStatus,
    description: 'Filter by request status',
  })
  @ApiQuery({
    name: 'serviceId',
    required: false,
    description: 'Filter by service ID',
  })
  @ApiQuery({
    name: 'assignedToId',
    required: false,
    description: 'Filter by assigned employee ID',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Request count',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized',
  })
  count(
    @Query('status') status?: RequestStatus,
    @Query('serviceId') serviceId?: string,
    @Query('assignedToId') assignedToId?: string,
    @Request() req?: any,
  ) {
    const filters: any = {};
    if (status) filters.status = status;
    if (serviceId) filters.serviceId = serviceId;
    if (assignedToId) filters.assignedToId = assignedToId;

    return this.requestsService.count(
      req.user?.userId,
      req.user?.role,
      filters,
    );
  }
}
