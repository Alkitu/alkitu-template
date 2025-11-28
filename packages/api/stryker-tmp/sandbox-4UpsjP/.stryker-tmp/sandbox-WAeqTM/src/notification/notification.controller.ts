// @ts-nocheck
// 
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Controller, Get, Post, Patch, Param, Body, UseGuards, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/guards/roles.decorator';
import { UserRole } from '@prisma/client';
import { NotificationService } from './notification.service';
import { CreateNotificationDto, BulkMarkAsReadDto, BulkDeleteDto } from './dto/create-notification.dto';
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
  @ApiOperation({
    summary: 'Create a new notification'
  })
  @ApiBody({
    type: CreateNotificationDto,
    description: 'Notification data'
  })
  @ApiResponse({
    status: 201,
    description: 'Notification created successfully',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '60d5ecb74f3b2c001c8b4567'
        },
        userId: {
          type: 'string',
          example: '60d5ecb74f3b2c001c8b4566'
        },
        message: {
          type: 'string',
          example: 'Welcome to Alkitu!'
        },
        type: {
          type: 'string',
          example: 'info'
        },
        link: {
          type: 'string',
          example: '/dashboard'
        },
        read: {
          type: 'boolean',
          example: false
        },
        createdAt: {
          type: 'string',
          example: '2024-06-29T12:00:00.000Z'
        },
        updatedAt: {
          type: 'string',
          example: '2024-06-29T12:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions'
  })
  async create(@Body()
  createNotificationDto: CreateNotificationDto) {
    if (stryMutAct_9fa48("1485")) {
      {}
    } else {
      stryCov_9fa48("1485");
      return this.notificationService.createNotification(createNotificationDto);
    }
  }
  @Get(':userId')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Get all notifications for a user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiResponse({
    status: 200,
    description: 'List of user notifications',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '60d5ecb74f3b2c001c8b4567'
          },
          userId: {
            type: 'string',
            example: '60d5ecb74f3b2c001c8b4566'
          },
          message: {
            type: 'string',
            example: 'Welcome to Alkitu!'
          },
          type: {
            type: 'string',
            example: 'info'
          },
          link: {
            type: 'string',
            example: '/dashboard'
          },
          read: {
            type: 'boolean',
            example: false
          },
          createdAt: {
            type: 'string',
            example: '2024-06-29T12:00:00.000Z'
          },
          updatedAt: {
            type: 'string',
            example: '2024-06-29T12:00:00.000Z'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions'
  })
  async getUserNotifications(@Param('userId')
  userId: string) {
    if (stryMutAct_9fa48("1486")) {
      {}
    } else {
      stryCov_9fa48("1486");
      return this.notificationService.getNotifications(userId);
    }
  }
  @Patch(':id/read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Mark notification as read'
  })
  @ApiParam({
    name: 'id',
    description: 'Notification ID',
    example: '60d5ecb74f3b2c001c8b4567'
  })
  @ApiResponse({
    status: 200,
    description: 'Notification marked as read',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '60d5ecb74f3b2c001c8b4567'
        },
        read: {
          type: 'boolean',
          example: true
        },
        updatedAt: {
          type: 'string',
          example: '2024-06-29T12:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions'
  })
  @ApiResponse({
    status: 404,
    description: 'Notification not found'
  })
  async markAsRead(@Param('id')
  id: string) {
    if (stryMutAct_9fa48("1487")) {
      {}
    } else {
      stryCov_9fa48("1487");
      return this.notificationService.markAsRead(id);
    }
  }
  @Get(':userId/count')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Get unread notification count for a user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiResponse({
    status: 200,
    description: 'Unread notification count',
    schema: {
      type: 'object',
      properties: {
        count: {
          type: 'number',
          example: 5
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - insufficient permissions'
  })
  async getUnreadCount(@Param('userId')
  userId: string) {
    if (stryMutAct_9fa48("1488")) {
      {}
    } else {
      stryCov_9fa48("1488");
      const count = await this.notificationService.getUnreadCount(userId);
      return stryMutAct_9fa48("1489") ? {} : (stryCov_9fa48("1489"), {
        count
      });
    }
  }

  // Notification Preferences endpoints
  @Get(':userId/preferences')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Get notification preferences for a user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiResponse({
    status: 200,
    description: 'User notification preferences',
    type: NotificationPreferencesDto
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiResponse({
    status: 404,
    description: 'Preferences not found'
  })
  async getUserPreferences(@Param('userId')
  userId: string) {
    if (stryMutAct_9fa48("1490")) {
      {}
    } else {
      stryCov_9fa48("1490");
      const preferences = await this.notificationService.getUserPreferences(userId);
      if (stryMutAct_9fa48("1493") ? false : stryMutAct_9fa48("1492") ? true : stryMutAct_9fa48("1491") ? preferences : (stryCov_9fa48("1491", "1492", "1493"), !preferences)) {
        if (stryMutAct_9fa48("1494")) {
          {}
        } else {
          stryCov_9fa48("1494");
          // Return default preferences if none exist
          return this.notificationService.getDefaultPreferences();
        }
      }
      return preferences;
    }
  }
  @Post(':userId/preferences')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Create or update notification preferences'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiBody({
    type: NotificationPreferencesDto,
    description: 'Notification preferences data'
  })
  @ApiResponse({
    status: 200,
    description: 'Preferences updated successfully',
    type: NotificationPreferencesDto
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async updateUserPreferences(@Param('userId')
  userId: string, @Body()
  preferencesDto: NotificationPreferencesDto) {
    if (stryMutAct_9fa48("1495")) {
      {}
    } else {
      stryCov_9fa48("1495");
      return this.notificationService.createOrUpdatePreferences(userId, preferencesDto);
    }
  }
  @Delete(':userId/preferences')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Reset user notification preferences to default'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiResponse({
    status: 200,
    description: 'Preferences reset successfully'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  @ApiResponse({
    status: 404,
    description: 'Preferences not found'
  })
  async resetUserPreferences(@Param('userId')
  userId: string) {
    if (stryMutAct_9fa48("1496")) {
      {}
    } else {
      stryCov_9fa48("1496");
      try {
        if (stryMutAct_9fa48("1497")) {
          {}
        } else {
          stryCov_9fa48("1497");
          await this.notificationService.deletePreferences(userId);
          return stryMutAct_9fa48("1498") ? {} : (stryCov_9fa48("1498"), {
            message: stryMutAct_9fa48("1499") ? "" : (stryCov_9fa48("1499"), 'Preferences reset to default successfully')
          });
        }
      } catch {
        if (stryMutAct_9fa48("1500")) {
          {}
        } else {
          stryCov_9fa48("1500");
          return stryMutAct_9fa48("1501") ? {} : (stryCov_9fa48("1501"), {
            message: stryMutAct_9fa48("1502") ? "" : (stryCov_9fa48("1502"), 'No preferences found to reset')
          });
        }
      }
    }
  }
  @Patch(':userId/mark-all-read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Mark all notifications as read for a user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications marked as read'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async markAllAsRead(@Param('userId')
  userId: string) {
    if (stryMutAct_9fa48("1503")) {
      {}
    } else {
      stryCov_9fa48("1503");
      return this.notificationService.markAllAsRead(userId);
    }
  }
  @Delete(':userId/all')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Delete all notifications for a user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiResponse({
    status: 200,
    description: 'All notifications deleted'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async deleteAllNotifications(@Param('userId')
  userId: string) {
    if (stryMutAct_9fa48("1504")) {
      {}
    } else {
      stryCov_9fa48("1504");
      return this.notificationService.deleteAllNotifications(userId);
    }
  }
  @Delete(':userId/read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Delete all read notifications for a user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiResponse({
    status: 200,
    description: 'Read notifications deleted'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async deleteReadNotifications(@Param('userId')
  userId: string) {
    if (stryMutAct_9fa48("1505")) {
      {}
    } else {
      stryCov_9fa48("1505");
      return this.notificationService.deleteReadNotifications(userId);
    }
  }
  @Post('bulk/mark-read')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Bulk mark notifications as read'
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications marked as read'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async bulkMarkAsRead(@Body()
  bulkMarkAsReadDto: BulkMarkAsReadDto) {
    if (stryMutAct_9fa48("1506")) {
      {}
    } else {
      stryCov_9fa48("1506");
      return this.notificationService.bulkMarkAsRead(bulkMarkAsReadDto.notificationIds);
    }
  }
  @Delete('bulk/delete')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Bulk delete notifications'
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications deleted'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async bulkDeleteNotifications(@Body()
  bulkDeleteDto: BulkDeleteDto) {
    if (stryMutAct_9fa48("1507")) {
      {}
    } else {
      stryCov_9fa48("1507");
      return this.notificationService.bulkDelete(bulkDeleteDto.notificationIds);
    }
  }
  @Delete(':userId/type/:type')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Delete notifications by type for a user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiParam({
    name: 'type',
    description: 'Notification type',
    example: 'info'
  })
  @ApiResponse({
    status: 200,
    description: 'Notifications of specified type deleted'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async deleteNotificationsByType(@Param('userId')
  userId: string, @Param('type')
  type: string) {
    if (stryMutAct_9fa48("1508")) {
      {}
    } else {
      stryCov_9fa48("1508");
      return this.notificationService.deleteNotificationsByType(userId, type);
    }
  }
  @Get(':userId/stats')
  @Roles(UserRole.ADMIN, UserRole.EMPLOYEE, UserRole.CLIENT, UserRole.LEAD)
  @ApiOperation({
    summary: 'Get notification statistics for a user'
  })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @ApiResponse({
    status: 200,
    description: 'Notification statistics'
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized'
  })
  async getNotificationStats(@Param('userId')
  userId: string) {
    if (stryMutAct_9fa48("1509")) {
      {}
    } else {
      stryCov_9fa48("1509");
      return this.notificationService.getNotificationStats(userId);
    }
  }
}