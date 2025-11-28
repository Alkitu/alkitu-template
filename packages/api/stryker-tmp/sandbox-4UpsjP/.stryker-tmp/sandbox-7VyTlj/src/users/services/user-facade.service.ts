// @ts-nocheck
// 
// ✅ SOLID COMPLIANT: Facade Pattern - Maintains backward compatibility
// packages/api/src/users/services/user-facade.service.ts
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
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UpdateUserTagsDto } from '../dto/update-user-tags.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { BulkDeleteUsersDto, BulkUpdateRoleDto, BulkUpdateStatusDto, ResetPasswordDto } from '../dto/bulk-users.dto';
import { UserRepositoryService } from './user-repository.service';
import { UserAuthenticationService } from './user-authentication.service';
import { UserAnalyticsService } from './user-analytics.service';
import { UserEventsService } from './user-events.service';
import { NotificationService } from '../../notification/notification.service';

/**
 * ✅ SOLID COMPLIANT: Facade Pattern Implementation
 *
 * This service maintains backward compatibility with the original UserService
 * while delegating responsibilities to specialized SRP-compliant services.
 *
 * Benefits:
 * - Maintains existing API contracts
 * - Enables gradual migration to SOLID architecture
 * - Provides single entry point for user operations
 * - Coordinates between specialized services
 */
@Injectable()
export class UserFacadeService {
  constructor(private userRepository: UserRepositoryService, private userAuthentication: UserAuthenticationService, private userAnalytics: UserAnalyticsService, private userEvents: UserEventsService, private notificationService: NotificationService) {}

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async create(createUserDto: CreateUserDto) {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      const {
        password,
        ...userData
      } = createUserDto;

      // Hash password using authentication service
      const hashedPassword = await this.userAuthentication.hashPassword(password);

      // Create user using repository service
      const user = await this.userRepository.create(stryMutAct_9fa48("1") ? {} : (stryCov_9fa48("1"), {
        ...userData,
        password: hashedPassword
      }));

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("4") ? fullUser.success || fullUser.data : (stryCov_9fa48("4"), fullUser.success && fullUser.data)) {
        if (stryMutAct_9fa48("5")) {
          {}
        } else {
          stryCov_9fa48("5");
          // Publish user created event
          await this.userEvents.publishUserCreated(fullUser.data);
        }
      }

      // Create welcome notification (optional, don't fail if it fails)
      try {
        if (stryMutAct_9fa48("6")) {
          {}
        } else {
          stryCov_9fa48("6");
          await this.notificationService.createNotification(stryMutAct_9fa48("7") ? {} : (stryCov_9fa48("7"), {
            userId: user.id,
            message: `Welcome to Alkitu, ${stryMutAct_9fa48("11") ? user.name && user.email : (stryCov_9fa48("11"), user.name || user.email)}!`,
            type: 'info',
            link: '/dashboard'
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("14")) {
          {}
        } else {
          stryCov_9fa48("14");
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log('Warning: Could not create welcome notification:', errorMessage);
        }
      }
      return user;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAll() {
    if (stryMutAct_9fa48("17")) {
      {}
    } else {
      stryCov_9fa48("17");
      return this.userRepository.findAll();
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAllWithFilters(filterDto: FilterUsersDto) {
    if (stryMutAct_9fa48("18")) {
      {}
    } else {
      stryCov_9fa48("18");
      return this.userRepository.findAllWithFilters(filterDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findOne(id: string) {
    if (stryMutAct_9fa48("19")) {
      {}
    } else {
      stryCov_9fa48("19");
      return this.userRepository.findById(id);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findByEmail(email: string) {
    if (stryMutAct_9fa48("20")) {
      {}
    } else {
      stryCov_9fa48("20");
      return this.userRepository.findByEmail(email);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (stryMutAct_9fa48("21")) {
      {}
    } else {
      stryCov_9fa48("21");
      // Get previous data for events
      const previousUserResult = await this.userRepository.findById(id);
      const previousUser = previousUserResult.success ? previousUserResult.data : undefined;

      // Update user
      const updatedUserResult = await this.userRepository.update(id, updateUserDto);
      const updatedUser = updatedUserResult.success ? updatedUserResult.data : undefined;
      if (stryMutAct_9fa48("24") ? updatedUser || previousUser : (stryCov_9fa48("24"), updatedUser && previousUser)) {
        if (stryMutAct_9fa48("25")) {
          {}
        } else {
          stryCov_9fa48("25");
          // Publish user updated event
          await this.userEvents.publishUserUpdated(updatedUser, previousUser);
        }
      }
      return updatedUser;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updateTags(id: string, updateUserTagsDto: UpdateUserTagsDto) {
    if (stryMutAct_9fa48("26")) {
      {}
    } else {
      stryCov_9fa48("26");
      return this.userRepository.updateTags(id, updateUserTagsDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async remove(id: string) {
    if (stryMutAct_9fa48("27")) {
      {}
    } else {
      stryCov_9fa48("27");
      // Get user data before deletion for events
      const userResult = await this.userRepository.findById(id);
      const user = userResult.success ? userResult.data : undefined;

      // Check if user exists
      if (stryMutAct_9fa48("28") ? user : (stryCov_9fa48("28"), !user)) {
        if (stryMutAct_9fa48("31")) {
          {}
        } else {
          stryCov_9fa48("31");
          throw new Error('User not found');
        }
      }

      // Delete user
      const deleteResult = await this.userRepository.delete(id);
      if (stryMutAct_9fa48("33") ? deleteResult.success : (stryCov_9fa48("33"), !deleteResult.success)) {
        if (stryMutAct_9fa48("36")) {
          {}
        } else {
          stryCov_9fa48("36");
          throw new Error(stryMutAct_9fa48("39") ? deleteResult.error?.message && 'Failed to delete user' : (stryCov_9fa48("39"), (stryMutAct_9fa48("40") ? deleteResult.error.message : (stryCov_9fa48("40"), deleteResult.error?.message)) || 'Failed to delete user'));
        }
      }

      // Publish user deleted event
      await this.userEvents.publishUserDeleted(id, user);

      // Return success message for backward compatibility
      return stryMutAct_9fa48("42") ? {} : (stryCov_9fa48("42"), {
        message: 'User deleted successfully'
      });
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async validateUser(loginDto: LoginUserDto) {
    if (stryMutAct_9fa48("44")) {
      {}
    } else {
      stryCov_9fa48("44");
      const authenticatedUser = await this.userAuthentication.validateUser(loginDto);
      if (authenticatedUser) {
        if (stryMutAct_9fa48("47")) {
          {}
        } else {
          stryCov_9fa48("47");
          // Publish login event
          await this.userEvents.publishUserLoggedIn(authenticatedUser.id);
        }
      }
      return authenticatedUser;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updatePassword(id: string, hashedPassword: string) {
    if (stryMutAct_9fa48("48")) {
      {}
    } else {
      stryCov_9fa48("48");
      return this.userRepository.updatePassword(id, hashedPassword);
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    if (stryMutAct_9fa48("49")) {
      {}
    } else {
      stryCov_9fa48("49");
      await this.userAuthentication.changePassword(id, changePasswordDto);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(id);
      return stryMutAct_9fa48("50") ? {} : (stryCov_9fa48("50"), {
        message: 'Password changed successfully'
      });
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async markEmailAsVerified(id: string) {
    if (stryMutAct_9fa48("52")) {
      {}
    } else {
      stryCov_9fa48("52");
      const result = await this.userRepository.markEmailAsVerified(id);

      // Publish email verified event
      await this.userEvents.publishUserEmailVerified(id);
      return result;
    }
  }

  // ✅ SRP: Delegates to UserAnalyticsService
  async getUserStats() {
    if (stryMutAct_9fa48("53")) {
      {}
    } else {
      stryCov_9fa48("53");
      return this.userAnalytics.getUserStats();
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async adminChangePassword(userId: string, newPassword: string) {
    if (stryMutAct_9fa48("54")) {
      {}
    } else {
      stryCov_9fa48("54");
      const hashedPassword = await this.userAuthentication.hashPassword(newPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async anonymizeUser(userId: string) {
    if (stryMutAct_9fa48("55")) {
      {}
    } else {
      stryCov_9fa48("55");
      const anonymizedData = stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
        name: 'Anonymous User',
        lastName: 'Anonymous',
        email: `anonymous_${userId}@example.com`,
        contactNumber: undefined // Use undefined instead of null for UpdateUserDto
      });
      const userResult = await this.userRepository.update(userId, anonymizedData);
      const user = userResult.success ? userResult.data : undefined;

      // Publish user updated event
      if (user) {
        if (stryMutAct_9fa48("62")) {
          {}
        } else {
          stryCov_9fa48("62");
          await this.userEvents.publishUserUpdated(user, stryMutAct_9fa48("63") ? {} : (stryCov_9fa48("63"), {
            id: userId
          }));
        }
      }
      return stryMutAct_9fa48("64") ? {} : (stryCov_9fa48("64"), {
        success: stryMutAct_9fa48("65") ? false : (stryCov_9fa48("65"), true),
        userId,
        anonymizedFields: Object.keys(anonymizedData),
        retainedFields: stryMutAct_9fa48("66") ? [] : (stryCov_9fa48("66"), ['id', 'role', 'createdAt']),
        timestamp: new Date()
      });
    }
  }

  // ✅ SRP: Delegates to NotificationService
  async sendMessageToUser(userId: string, message: string) {
    if (stryMutAct_9fa48("70")) {
      {}
    } else {
      stryCov_9fa48("70");
      try {
        if (stryMutAct_9fa48("71")) {
          {}
        } else {
          stryCov_9fa48("71");
          await this.notificationService.createNotification(stryMutAct_9fa48("72") ? {} : (stryCov_9fa48("72"), {
            userId,
            message,
            type: 'info'
          }));
          return stryMutAct_9fa48("74") ? {} : (stryCov_9fa48("74"), {
            success: stryMutAct_9fa48("75") ? false : (stryCov_9fa48("75"), true),
            message: 'Message sent successfully'
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("77")) {
          {}
        } else {
          stryCov_9fa48("77");
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return stryMutAct_9fa48("79") ? {} : (stryCov_9fa48("79"), {
            success: stryMutAct_9fa48("80") ? true : (stryCov_9fa48("80"), false),
            message: `Failed to send message: ${errorMessage}`
          });
        }
      }
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async createImpersonationToken(adminId: string, targetUserId: string) {
    if (stryMutAct_9fa48("82")) {
      {}
    } else {
      stryCov_9fa48("82");
      // Simplified implementation - in production, use proper JWT
      const token = await this.userAuthentication.generatePasswordResetToken(targetUserId);
      return stryMutAct_9fa48("83") ? {} : (stryCov_9fa48("83"), {
        token,
        expiresAt: new Date(stryMutAct_9fa48("84") ? Date.now() - 3600000 : (stryCov_9fa48("84"), Date.now() + 3600000)),
        // 1 hour
        targetUserId,
        adminId,
        restrictions: stryMutAct_9fa48("85") ? [] : (stryCov_9fa48("85"), ['read-only', 'no-admin-actions'])
      });
    }
  }

  // Bulk operations - these would be implemented by separate bulk services
  // For now, we'll provide simplified implementations

  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto) {
    if (stryMutAct_9fa48("88")) {
      {}
    } else {
      stryCov_9fa48("88");
      const {
        userIds
      } = bulkDeleteDto;
      let deletedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("89")) {
          {}
        } else {
          stryCov_9fa48("89");
          try {
            if (stryMutAct_9fa48("90")) {
              {}
            } else {
              stryCov_9fa48("90");
              await this.remove(userId);
              stryMutAct_9fa48("91") ? deletedCount-- : (stryCov_9fa48("91"), deletedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("92")) {
              {}
            } else {
              stryCov_9fa48("92");
              console.error(`Failed to delete user ${userId}:`, error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation('bulk_delete', userIds, stryMutAct_9fa48("95") ? {} : (stryCov_9fa48("95"), {
        requestedCount: userIds.length,
        successCount: deletedCount
      }));
      return stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
        success: stryMutAct_9fa48("97") ? false : (stryCov_9fa48("97"), true),
        message: `Successfully deleted ${deletedCount} out of ${userIds.length} users`,
        affectedCount: deletedCount
      });
    }
  }
  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    if (stryMutAct_9fa48("99")) {
      {}
    } else {
      stryCov_9fa48("99");
      const {
        userIds,
        role
      } = bulkUpdateRoleDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("100")) {
          {}
        } else {
          stryCov_9fa48("100");
          try {
            if (stryMutAct_9fa48("101")) {
              {}
            } else {
              stryCov_9fa48("101");
              await this.update(userId, stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
                role
              }));
              stryMutAct_9fa48("103") ? updatedCount-- : (stryCov_9fa48("103"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("104")) {
              {}
            } else {
              stryCov_9fa48("104");
              console.error(`Failed to update role for user ${userId}:`, error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation('bulk_update_role', userIds, stryMutAct_9fa48("107") ? {} : (stryCov_9fa48("107"), {
        newRole: role,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("108") ? {} : (stryCov_9fa48("108"), {
        success: stryMutAct_9fa48("109") ? false : (stryCov_9fa48("109"), true),
        message: `Successfully updated role for ${updatedCount} out of ${userIds.length} users`,
        affectedCount: updatedCount
      });
    }
  }
  async bulkUpdateStatus(bulkUpdateStatusDto: BulkUpdateStatusDto) {
    if (stryMutAct_9fa48("111")) {
      {}
    } else {
      stryCov_9fa48("111");
      const {
        userIds,
        status
      } = bulkUpdateStatusDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("112")) {
          {}
        } else {
          stryCov_9fa48("112");
          try {
            if (stryMutAct_9fa48("113")) {
              {}
            } else {
              stryCov_9fa48("113");
              await this.update(userId, stryMutAct_9fa48("114") ? {} : (stryCov_9fa48("114"), {
                status
              }));
              stryMutAct_9fa48("115") ? updatedCount-- : (stryCov_9fa48("115"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("116")) {
              {}
            } else {
              stryCov_9fa48("116");
              console.error(`Failed to update status for user ${userId}:`, error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation('bulk_update_status', userIds, stryMutAct_9fa48("119") ? {} : (stryCov_9fa48("119"), {
        newStatus: status,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("120") ? {} : (stryCov_9fa48("120"), {
        success: stryMutAct_9fa48("121") ? false : (stryCov_9fa48("121"), true),
        message: `Successfully updated status for ${updatedCount} out of ${userIds.length} users`,
        affectedCount: updatedCount
      });
    }
  }
  async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    if (stryMutAct_9fa48("123")) {
      {}
    } else {
      stryCov_9fa48("123");
      const {
        userId,
        sendEmail = stryMutAct_9fa48("124") ? false : (stryCov_9fa48("124"), true)
      } = resetPasswordDto;

      // Generate temporary password
      const tempPassword = stryMutAct_9fa48("125") ? Math.random().toString(36) : (stryCov_9fa48("125"), Math.random().toString(36).slice(stryMutAct_9fa48("126") ? +8 : (stryCov_9fa48("126"), -8)));

      // Hash and update password
      const hashedPassword = await this.userAuthentication.hashPassword(tempPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
      let emailSent = stryMutAct_9fa48("127") ? true : (stryCov_9fa48("127"), false);
      if (sendEmail) {
        if (stryMutAct_9fa48("130")) {
          {}
        } else {
          stryCov_9fa48("130");
          try {
            if (stryMutAct_9fa48("131")) {
              {}
            } else {
              stryCov_9fa48("131");
              await this.notificationService.createNotification(stryMutAct_9fa48("132") ? {} : (stryCov_9fa48("132"), {
                userId,
                message: `Your password has been reset. Your temporary password is: ${tempPassword}`,
                type: 'warning'
              }));
              emailSent = stryMutAct_9fa48("135") ? false : (stryCov_9fa48("135"), true);
            }
          } catch (error) {
            if (stryMutAct_9fa48("136")) {
              {}
            } else {
              stryCov_9fa48("136");
              console.error('Failed to send password reset email:', error);
            }
          }
        }
      }
      return stryMutAct_9fa48("138") ? {} : (stryCov_9fa48("138"), {
        success: stryMutAct_9fa48("139") ? false : (stryCov_9fa48("139"), true),
        message: emailSent ? 'Password reset email sent' : 'Password reset completed',
        tempPassword: emailSent ? undefined : tempPassword,
        emailSent
      });
    }
  }
}