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
import { IsBoolean, IsArray, IsString, IsEnum, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
const timeRegex = stryMutAct_9fa48("1458") ? /^([01]?[0-9]|2[0-3]):[0-5][^0-9]$/ : stryMutAct_9fa48("1457") ? /^([01]?[0-9]|2[0-3]):[^0-5][0-9]$/ : stryMutAct_9fa48("1456") ? /^([01]?[0-9]|2[^0-3]):[0-5][0-9]$/ : stryMutAct_9fa48("1455") ? /^([01]?[^0-9]|2[0-3]):[0-5][0-9]$/ : stryMutAct_9fa48("1454") ? /^([^01]?[0-9]|2[0-3]):[0-5][0-9]$/ : stryMutAct_9fa48("1453") ? /^([01][0-9]|2[0-3]):[0-5][0-9]$/ : stryMutAct_9fa48("1452") ? /^([01]?[0-9]|2[0-3]):[0-5][0-9]/ : stryMutAct_9fa48("1451") ? /([01]?[0-9]|2[0-3]):[0-5][0-9]$/ : (stryCov_9fa48("1451", "1452", "1453", "1454", "1455", "1456", "1457", "1458"), /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/);
export enum EmailFrequency {
  IMMEDIATE = 'immediate',
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}
export const NotificationPreferencesSchema = z.object(stryMutAct_9fa48("1459") ? {} : (stryCov_9fa48("1459"), {
  emailEnabled: z.boolean().default(stryMutAct_9fa48("1460") ? false : (stryCov_9fa48("1460"), true)),
  emailTypes: z.array(z.string()).default(stryMutAct_9fa48("1461") ? [] : (stryCov_9fa48("1461"), [stryMutAct_9fa48("1462") ? "" : (stryCov_9fa48("1462"), 'welcome'), stryMutAct_9fa48("1463") ? "" : (stryCov_9fa48("1463"), 'security'), stryMutAct_9fa48("1464") ? "" : (stryCov_9fa48("1464"), 'system')])),
  pushEnabled: z.boolean().default(stryMutAct_9fa48("1465") ? false : (stryCov_9fa48("1465"), true)),
  pushTypes: z.array(z.string()).default(stryMutAct_9fa48("1466") ? [] : (stryCov_9fa48("1466"), [stryMutAct_9fa48("1467") ? "" : (stryCov_9fa48("1467"), 'urgent'), stryMutAct_9fa48("1468") ? "" : (stryCov_9fa48("1468"), 'mentions'), stryMutAct_9fa48("1469") ? "" : (stryCov_9fa48("1469"), 'system')])),
  inAppEnabled: z.boolean().default(stryMutAct_9fa48("1470") ? false : (stryCov_9fa48("1470"), true)),
  inAppTypes: z.array(z.string()).default(stryMutAct_9fa48("1471") ? [] : (stryCov_9fa48("1471"), [stryMutAct_9fa48("1472") ? "" : (stryCov_9fa48("1472"), 'all')])),
  emailFrequency: z.enum(stryMutAct_9fa48("1473") ? [] : (stryCov_9fa48("1473"), [stryMutAct_9fa48("1474") ? "" : (stryCov_9fa48("1474"), 'immediate'), stryMutAct_9fa48("1475") ? "" : (stryCov_9fa48("1475"), 'hourly'), stryMutAct_9fa48("1476") ? "" : (stryCov_9fa48("1476"), 'daily'), stryMutAct_9fa48("1477") ? "" : (stryCov_9fa48("1477"), 'weekly')])).default(stryMutAct_9fa48("1478") ? "" : (stryCov_9fa48("1478"), 'immediate')),
  digestEnabled: z.boolean().default(stryMutAct_9fa48("1479") ? true : (stryCov_9fa48("1479"), false)),
  quietHoursEnabled: z.boolean().default(stryMutAct_9fa48("1480") ? true : (stryCov_9fa48("1480"), false)),
  quietHoursStart: z.string().regex(timeRegex, stryMutAct_9fa48("1481") ? "" : (stryCov_9fa48("1481"), 'Time must be in HH:mm format')).nullable().optional(),
  quietHoursEnd: z.string().regex(timeRegex, stryMutAct_9fa48("1482") ? "" : (stryCov_9fa48("1482"), 'Time must be in HH:mm format')).nullable().optional(),
  marketingEnabled: z.boolean().default(stryMutAct_9fa48("1483") ? true : (stryCov_9fa48("1483"), false)),
  promotionalEnabled: z.boolean().default(stryMutAct_9fa48("1484") ? true : (stryCov_9fa48("1484"), false))
}));
export class NotificationPreferencesDto {
  @ApiProperty({
    description: 'Enable email notifications',
    example: true,
    default: true
  })
  @IsBoolean()
  emailEnabled!: boolean;
  @ApiProperty({
    description: 'Types of email notifications to receive',
    type: [String],
    example: ['welcome', 'security', 'system'],
    default: ['welcome', 'security', 'system']
  })
  @IsArray()
  @IsString({
    each: true
  })
  emailTypes!: string[];
  @ApiProperty({
    description: 'Enable push notifications',
    example: true,
    default: true
  })
  @IsBoolean()
  pushEnabled!: boolean;
  @ApiProperty({
    description: 'Types of push notifications to receive',
    type: [String],
    example: ['urgent', 'mentions', 'system'],
    default: ['urgent', 'mentions', 'system']
  })
  @IsArray()
  @IsString({
    each: true
  })
  pushTypes!: string[];
  @ApiProperty({
    description: 'Enable in-app notifications',
    example: true,
    default: true
  })
  @IsBoolean()
  inAppEnabled!: boolean;
  @ApiProperty({
    description: 'Types of in-app notifications to receive',
    type: [String],
    example: ['all'],
    default: ['all']
  })
  @IsArray()
  @IsString({
    each: true
  })
  inAppTypes!: string[];
  @ApiProperty({
    description: 'Email notification frequency',
    enum: EmailFrequency,
    example: EmailFrequency.IMMEDIATE,
    default: EmailFrequency.IMMEDIATE
  })
  @IsEnum(EmailFrequency)
  emailFrequency!: EmailFrequency;
  @ApiProperty({
    description: 'Enable email digest',
    example: false,
    default: false
  })
  @IsBoolean()
  digestEnabled!: boolean;
  @ApiProperty({
    description: 'Enable quiet hours',
    example: false,
    default: false
  })
  @IsBoolean()
  quietHoursEnabled!: boolean;
  @ApiPropertyOptional({
    description: 'Quiet hours start time (HH:mm format)',
    example: '22:00',
    nullable: true
  })
  @IsOptional()
  @IsString()
  @Matches(timeRegex, {
    message: 'Time must be in HH:mm format'
  })
  quietHoursStart?: string | null;
  @ApiPropertyOptional({
    description: 'Quiet hours end time (HH:mm format)',
    example: '08:00',
    nullable: true
  })
  @IsOptional()
  @IsString()
  @Matches(timeRegex, {
    message: 'Time must be in HH:mm format'
  })
  quietHoursEnd?: string | null;
  @ApiProperty({
    description: 'Enable marketing notifications',
    example: false,
    default: false
  })
  @IsBoolean()
  marketingEnabled!: boolean;
  @ApiProperty({
    description: 'Enable promotional notifications',
    example: false,
    default: false
  })
  @IsBoolean()
  promotionalEnabled!: boolean;
}