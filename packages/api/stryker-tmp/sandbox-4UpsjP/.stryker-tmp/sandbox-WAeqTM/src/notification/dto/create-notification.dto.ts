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
import { z } from 'zod';
import { IsString, IsEnum, IsOptional, IsArray, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
export enum NotificationType {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
  CHAT_NEW_CONVERSATION = 'chat_new_conversation',
  CHAT_NEW_MESSAGE = 'chat_new_message',
}
export const CreateNotificationSchema = z.object(stryMutAct_9fa48("1438") ? {} : (stryCov_9fa48("1438"), {
  userId: stryMutAct_9fa48("1439") ? z.string().max(1, 'User ID is required') : (stryCov_9fa48("1439"), z.string().min(1, stryMutAct_9fa48("1440") ? "" : (stryCov_9fa48("1440"), 'User ID is required'))),
  message: stryMutAct_9fa48("1442") ? z.string().max(1, 'Message is required').max(500, 'Message is too long') : stryMutAct_9fa48("1441") ? z.string().min(1, 'Message is required').min(500, 'Message is too long') : (stryCov_9fa48("1441", "1442"), z.string().min(1, stryMutAct_9fa48("1443") ? "" : (stryCov_9fa48("1443"), 'Message is required')).max(500, stryMutAct_9fa48("1444") ? "" : (stryCov_9fa48("1444"), 'Message is too long'))),
  type: z.enum(stryMutAct_9fa48("1445") ? [] : (stryCov_9fa48("1445"), [NotificationType.INFO, NotificationType.WARNING, NotificationType.ERROR, NotificationType.SUCCESS, NotificationType.CHAT_NEW_CONVERSATION, NotificationType.CHAT_NEW_MESSAGE]), stryMutAct_9fa48("1446") ? {} : (stryCov_9fa48("1446"), {
    errorMap: stryMutAct_9fa48("1447") ? () => undefined : (stryCov_9fa48("1447"), () => stryMutAct_9fa48("1448") ? {} : (stryCov_9fa48("1448"), {
      message: stryMutAct_9fa48("1449") ? "" : (stryCov_9fa48("1449"), 'Type must be one of: info, warning, error, success, chat_new_conversation, chat_new_message')
    }))
  })).default(NotificationType.INFO),
  link: z.string().url(stryMutAct_9fa48("1450") ? "" : (stryCov_9fa48("1450"), 'Link must be a valid URL')).optional()
}));
export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID to send the notification to',
    example: '60d5ecb74f3b2c001c8b4566'
  })
  @IsString()
  userId!: string;
  @ApiProperty({
    description: 'Notification message content',
    example: 'Welcome to Alkitu! Your account has been created successfully.',
    maxLength: 500
  })
  @IsString()
  @MaxLength(500, {
    message: 'Message is too long'
  })
  message!: string;
  @ApiProperty({
    description: 'Type of notification',
    enum: NotificationType,
    example: NotificationType.INFO
  })
  @IsEnum(NotificationType)
  type!: NotificationType;
  @ApiPropertyOptional({
    description: 'Optional link to redirect when notification is clicked',
    example: '/dashboard'
  })
  @IsOptional()
  @IsUrl({}, {
    message: 'Link must be a valid URL'
  })
  link?: string;
}
export class BulkMarkAsReadDto {
  @ApiProperty({
    description: 'Array of notification IDs to mark as read',
    type: [String],
    example: ['60d5ecb74f3b2c001c8b4567', '60d5ecb74f3b2c001c8b4568']
  })
  @IsArray()
  @IsString({
    each: true
  })
  notificationIds!: string[];
}
export class BulkDeleteDto {
  @ApiProperty({
    description: 'Array of notification IDs to delete',
    type: [String],
    example: ['60d5ecb74f3b2c001c8b4567', '60d5ecb74f3b2c001c8b4568']
  })
  @IsArray()
  @IsString({
    each: true
  })
  notificationIds!: string[];
}
export class DeleteByTypeDto {
  @ApiProperty({
    description: 'Notification type to delete',
    enum: NotificationType,
    example: NotificationType.INFO
  })
  @IsEnum(NotificationType)
  type!: NotificationType;
}