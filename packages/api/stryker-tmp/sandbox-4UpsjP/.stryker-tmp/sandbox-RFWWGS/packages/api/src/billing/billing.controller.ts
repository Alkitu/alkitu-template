// @ts-nocheck
// 
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@ApiTags('billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new billing record' })
  @ApiBody({ type: CreateBillingDto })
  @ApiResponse({
    status: 201,
    description: 'The billing record has been successfully created.',
  })
  async create(@Body() createBillingDto: CreateBillingDto) {
    return this.billingService.createBilling(createBillingDto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get all billing records for a user' })
  @ApiResponse({
    status: 200,
    description: 'List of billing records for the user.',
  })
  async findAll(@Param('userId') userId: string) {
    return this.billingService.getBillingRecords(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a billing record' })
  @ApiBody({ type: UpdateBillingDto })
  @ApiResponse({
    status: 200,
    description: 'The billing record has been successfully updated.',
  })
  async update(
    @Param('id') id: string,
    @Body() updateBillingDto: UpdateBillingDto,
  ) {
    return this.billingService.updateBilling(id, updateBillingDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a billing record' })
  @ApiResponse({
    status: 200,
    description: 'The billing record has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return this.billingService.deleteBilling(id);
  }
}
