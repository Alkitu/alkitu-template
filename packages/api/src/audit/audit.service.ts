import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

/**
 * Audit Entry Interface
 */
export interface AuditEntry {
  action: string; // CREATE_USER, UPDATE_ROLE, TOGGLE_FEATURE, DELETE_REQUEST
  resourceType: string; // USER, REQUEST, FEATURE_FLAG, COMPANY
  resourceId: string;
  userId: string;
  metadata?: Record<string, any>;
}

/**
 * Audit Service
 *
 * Logs all sensitive operations for security and compliance.
 *
 * @example
 * ```typescript
 * // Log a role change
 * await auditService.log({
 *   action: 'UPDATE_ROLE',
 *   resourceType: 'USER',
 *   resourceId: userId,
 *   userId: adminId,
 *   metadata: { oldRole: 'CLIENT', newRole: 'EMPLOYEE' },
 * });
 * ```
 */
@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log an audit entry
   *
   * @param entry - Audit entry details
   */
  async log(entry: AuditEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          action: entry.action,
          resourceType: entry.resourceType,
          resourceId: entry.resourceId,
          userId: entry.userId,
          metadata: entry.metadata || {},
          timestamp: new Date(),
        },
      });

      console.log(
        `[AUDIT] ${entry.action} on ${entry.resourceType}:${entry.resourceId} by user:${entry.userId}`,
      );
    } catch (error) {
      // Don't fail the operation if audit logging fails
      // But log the error for investigation
      console.error('[AUDIT] Failed to log audit entry:', error);
    }
  }

  /**
   * Get audit logs for a specific resource
   *
   * @param resourceType - Type of resource (USER, REQUEST, etc.)
   * @param resourceId - ID of the resource
   * @param limit - Maximum number of logs to return
   */
  async getResourceLogs(
    resourceType: string,
    resourceId: string,
    limit = 50,
  ): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      where: {
        resourceType,
        resourceId,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Get audit logs for a specific user's actions
   *
   * @param userId - ID of the user who performed actions
   * @param limit - Maximum number of logs to return
   */
  async getUserActions(userId: string, limit = 50): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }

  /**
   * Get recent audit logs across all resources
   *
   * @param limit - Maximum number of logs to return
   */
  async getRecentLogs(limit = 100): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });
  }

  /**
   * Search audit logs by action
   *
   * @param action - Action to search for (e.g., 'UPDATE_ROLE')
   * @param limit - Maximum number of logs to return
   */
  async searchByAction(action: string, limit = 50): Promise<any[]> {
    return this.prisma.auditLog.findMany({
      where: {
        action,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstname: true,
            lastname: true,
            role: true,
          },
        },
      },
    });
  }
}
