// @ts-nocheck
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
} from '@nestjs/common';
import { BillingService } from './billing.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@ApiTags('billing')
@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new billing record',
    description:
      'Create a new billing record. Requires ADMIN or EMPLOYEE role.',
  })
  @ApiBody({
    type: CreateBillingDto,
    description: 'Billing record data',
  })
  @ApiResponse({
    status: 201,
    description: 'The billing record has been successfully created.',
    schema: {
      example: {
        id: '60d5ecb74f3b2c001c8b4567',
        userId: '60d5ecb74f3b2c001c8b4566',
        amount: 99.99,
        status: 'pending',
        createdAt: '2024-06-29T12:00:00.000Z',
        updatedAt: '2024-06-29T12:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  async create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.createBilling(createBillingDto);
  }

  @Get(':userId')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT)
  @ApiOperation({
    summary: 'Get all billing records for a user',
    description:
      'Retrieve all billing records for a specific user. Requires appropriate permissions.',
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID to get billing records for',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({
    status: 200,
    description: 'List of billing records for the user.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60d5ecb74f3b2c001c8b4567' },
          userId: { type: 'string', example: '60d5ecb74f3b2c001c8b4566' },
          amount: { type: 'number', example: 99.99 },
          status: { type: 'string', example: 'paid' },
          createdAt: { type: 'string', example: '2024-06-29T12:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-06-29T12:00:00.000Z' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findAll(@Param('userId') userId: string) {
    return this.billingService.getBillingRecords(userId);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @ApiOperation({
    summary: 'Update a billing record',
    description:
      'Update an existing billing record. Requires ADMIN or EMPLOYEE role.',
  })
  @ApiParam({
    name: 'id',
    description: 'Billing record ID to update',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @ApiBody({
    type: UpdateBillingDto,
    description: 'Updated billing record data',
  })
  @ApiResponse({
    status: 200,
    description: 'The billing record has been successfully updated.',
    schema: {
      example: {
        id: '60d5ecb74f3b2c001c8b4567',
        userId: '60d5ecb74f3b2c001c8b4566',
        amount: 149.99,
        status: 'paid',
        createdAt: '2024-06-29T12:00:00.000Z',
        updatedAt: '2024-06-29T12:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Billing record not found' })
  async update(
    @Param('id') id: string,
    @Body() updateBillingDto: UpdateBillingDto,
  ) {
    return this.billingService.updateBilling(id, updateBillingDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Delete a billing record',
    description: 'Delete a billing record. Requires ADMIN role only.',
  })
  @ApiParam({
    name: 'id',
    description: 'Billing record ID to delete',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @ApiResponse({
    status: 200,
    description: 'The billing record has been successfully deleted.',
    schema: {
      example: {
        message: 'Billing record deleted successfully',
        deletedId: '60d5ecb74f3b2c001c8b4567',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({ status: 404, description: 'Billing record not found' })
  async remove(@Param('id') id: string) {
    return this.billingService.deleteBilling(id);
  }
}
