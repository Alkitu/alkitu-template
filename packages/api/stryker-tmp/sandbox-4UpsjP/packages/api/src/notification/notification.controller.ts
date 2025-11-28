// @ts-nocheck
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { NotificationService } from './notification.service';
import {
  CreateNotificationDto,
  BulkMarkAsReadDto,
  BulkDeleteDto,
} from './dto/create-notification.dto';
import { NotificationPreferencesDto } from './dto/notification-preferences.dto';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new notification' })
  @ApiBody({
    type: CreateNotificationDto,
    description: 'Notification data',
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60d5ecb74f3b2c001c8b4567' },
        userId: { type: 'string', example: '60d5ecb74f3b2c001c8b4566' },
        message: { type: 'string', example: 'Welcome to Alkitu!' },
        type: { type: 'string', example: 'info' },
        link: { type: 'string', example: '/dashboard' },
        read: { type: 'boolean', example: false },
        createdAt: { type: 'string', example: '2024-06-29T12:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-06-29T12:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.createNotification(createNotificationDto);
  }

  @Get(':userId')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Get all notifications for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({
    status: 200,
    description: 'List of user notifications',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60d5ecb74f3b2c001c8b4567' },
          userId: { type: 'string', example: '60d5ecb74f3b2c001c8b4566' },
          message: { type: 'string', example: 'Welcome to Alkitu!' },
          type: { type: 'string', example: 'info' },
          link: { type: 'string', example: '/dashboard' },
          read: { type: 'boolean', example: false },
          createdAt: { type: 'string', example: '2024-06-29T12:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-06-29T12:00:00.000Z' },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async getUserNotifications(@Param('userId') userId: string) {
    return this.notificationService.getNotifications(userId);
  }

  @Patch(':id/read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiParam({
    name: 'id',
    description: 'Notification ID',
    example: '60d5ecb74f3b2c001c8b4567',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: '60d5ecb74f3b2c001c8b4567' },
        read: { type: 'boolean', example: true },
        updatedAt: { type: 'string', example: '2024-06-29T12:00:00.000Z' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @Get(':userId/count')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Get unread notification count for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({
    status: 200,
    description: 'Unread notification count',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number', example: 5 },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions',
  })
  async getUnreadCount(@Param('userId') userId: string) {
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  // Notification Preferences endpoints
  @Get(':userId/preferences')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Get notification preferences for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({
    status: 200,
    description: 'User notification preferences',
    type: NotificationPreferencesDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Preferences not found' })
  async getUserPreferences(@Param('userId') userId: string) {
    const preferences =
      await this.notificationService.getUserPreferences(userId);

    if (!preferences) {
      // Return default preferences if none exist
      return this.notificationService.getDefaultPreferences();
    }

    return preferences;
  }

  @Post(':userId/preferences')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Create or update notification preferences' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiBody({
    type: NotificationPreferencesDto,
    description: 'Notification preferences data',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
    type: NotificationPreferencesDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateUserPreferences(
    @Param('userId') userId: string,
    @Body() preferencesDto: NotificationPreferencesDto,
  ) {
    return this.notificationService.createOrUpdatePreferences(
      userId,
      preferencesDto,
    );
  }

  @Delete(':userId/preferences')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Reset user notification preferences to default' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({
    status: 200,
    description: 'Preferences reset successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Preferences not found' })
  async resetUserPreferences(@Param('userId') userId: string) {
    try {
      await this.notificationService.deletePreferences(userId);
      return { message: 'Preferences reset to default successfully' };
    } catch {
      return { message: 'No preferences found to reset' };
    }
  }

  @Patch(':userId/mark-all-read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Mark all notifications as read for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markAllAsRead(@Param('userId') userId: string) {
    return this.notificationService.markAllAsRead(userId);
  }

  @Delete(':userId/all')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Delete all notifications for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({ status: 200, description: 'All notifications deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteAllNotifications(@Param('userId') userId: string) {
    return this.notificationService.deleteAllNotifications(userId);
  }

  @Delete(':userId/read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Delete all read notifications for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({ status: 200, description: 'Read notifications deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteReadNotifications(@Param('userId') userId: string) {
    return this.notificationService.deleteReadNotifications(userId);
  }

  @Post('bulk/mark-read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Bulk mark notifications as read' })
  @ApiResponse({ status: 200, description: 'Notifications marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async bulkMarkAsRead(@Body() bulkMarkAsReadDto: BulkMarkAsReadDto) {
    return this.notificationService.bulkMarkAsRead(
      bulkMarkAsReadDto.notificationIds,
    );
  }

  @Delete('bulk/delete')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Bulk delete notifications' })
  @ApiResponse({ status: 200, description: 'Notifications deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async bulkDeleteNotifications(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.notificationService.bulkDelete(bulkDeleteDto.notificationIds);
  }

  @Delete(':userId/type/:type')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Delete notifications by type for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiParam({
    name: 'type',
    description: 'Notification type',
    example: 'info',
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications of specified type deleted',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async deleteNotificationsByType(
    @Param('userId') userId: string,
    @Param('type') type: string,
  ) {
    return this.notificationService.deleteNotificationsByType(userId, type);
  }

  @Get(':userId/stats')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({ summary: 'Get notification statistics for a user' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566',
  })
  @ApiResponse({
    status: 200,
    description: 'Notification statistics',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getNotificationStats(@Param('userId') userId: string) {
    return this.notificationService.getNotificationStats(userId);
  }
}
