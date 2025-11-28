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
      if (fullUser) {
        if (stryMutAct_9fa48("4")) {
          {}
        } else {
          stryCov_9fa48("4");
          // Publish user created event
          await this.userEvents.publishUserCreated(fullUser);
        }
      }

      // Create welcome notification (optional, don't fail if it fails)
      try {
        if (stryMutAct_9fa48("5")) {
          {}
        } else {
          stryCov_9fa48("5");
          await this.notificationService.createNotification(stryMutAct_9fa48("6") ? {} : (stryCov_9fa48("6"), {
            userId: user.id,
            message: `Welcome to Alkitu, ${stryMutAct_9fa48("10") ? user.name && user.email : (stryCov_9fa48("10"), user.name || user.email)}!`,
            type: 'info',
            link: '/dashboard'
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("13")) {
          {}
        } else {
          stryCov_9fa48("13");
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          console.log('Warning: Could not create welcome notification:', errorMessage);
        }
      }
      return user;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAll() {
    if (stryMutAct_9fa48("16")) {
      {}
    } else {
      stryCov_9fa48("16");
      return this.userRepository.findAll();
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAllWithFilters(filterDto: FilterUsersDto) {
    if (stryMutAct_9fa48("17")) {
      {}
    } else {
      stryCov_9fa48("17");
      return this.userRepository.findAllWithFilters(filterDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findOne(id: string) {
    if (stryMutAct_9fa48("18")) {
      {}
    } else {
      stryCov_9fa48("18");
      return this.userRepository.findById(id);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findByEmail(email: string) {
    if (stryMutAct_9fa48("19")) {
      {}
    } else {
      stryCov_9fa48("19");
      return this.userRepository.findByEmail(email);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (stryMutAct_9fa48("20")) {
      {}
    } else {
      stryCov_9fa48("20");
      // Get previous data for events
      const previousUser = await this.userRepository.findById(id);

      // Update user
      const updatedUser = await this.userRepository.update(id, updateUserDto);

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(updatedUser.email);
      if (stryMutAct_9fa48("23") ? fullUser || previousUser : (stryCov_9fa48("23"), fullUser && previousUser)) {
        if (stryMutAct_9fa48("24")) {
          {}
        } else {
          stryCov_9fa48("24");
          // Publish user updated event - convert UserResponse to User for events
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("25") ? {} : (stryCov_9fa48("25"), {
            id: previousUser.id,
            email: previousUser.email,
            name: previousUser.name,
            lastName: previousUser.lastName,
            contactNumber: previousUser.contactNumber
          }));
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
      const user = await this.userRepository.findById(id);

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
      await this.userRepository.delete(id);

      // Publish user deleted event
      await this.userEvents.publishUserDeleted(id, stryMutAct_9fa48("33") ? {} : (stryCov_9fa48("33"), {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        contactNumber: user.contactNumber
      }));

      // Return success message for backward compatibility
      return stryMutAct_9fa48("34") ? {} : (stryCov_9fa48("34"), {
        message: 'User deleted successfully'
      });
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async validateUser(loginDto: LoginUserDto) {
    if (stryMutAct_9fa48("36")) {
      {}
    } else {
      stryCov_9fa48("36");
      const authenticatedUser = await this.userAuthentication.validateUser(loginDto);
      if (authenticatedUser) {
        if (stryMutAct_9fa48("39")) {
          {}
        } else {
          stryCov_9fa48("39");
          // Publish login event
          await this.userEvents.publishUserLoggedIn(authenticatedUser.id);
        }
      }
      return authenticatedUser;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updatePassword(id: string, hashedPassword: string) {
    if (stryMutAct_9fa48("40")) {
      {}
    } else {
      stryCov_9fa48("40");
      return this.userRepository.updatePassword(id, hashedPassword);
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    if (stryMutAct_9fa48("41")) {
      {}
    } else {
      stryCov_9fa48("41");
      await this.userAuthentication.changePassword(id, changePasswordDto);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(id);
      return stryMutAct_9fa48("42") ? {} : (stryCov_9fa48("42"), {
        message: 'Password changed successfully'
      });
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async markEmailAsVerified(id: string) {
    if (stryMutAct_9fa48("44")) {
      {}
    } else {
      stryCov_9fa48("44");
      const result = await this.userRepository.markEmailAsVerified(id);

      // Publish email verified event
      await this.userEvents.publishUserEmailVerified(id);
      return result;
    }
  }

  // ✅ SRP: Delegates to UserAnalyticsService
  async getUserStats() {
    if (stryMutAct_9fa48("45")) {
      {}
    } else {
      stryCov_9fa48("45");
      return this.userAnalytics.getUserStats();
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async adminChangePassword(userId: string, newPassword: string) {
    if (stryMutAct_9fa48("46")) {
      {}
    } else {
      stryCov_9fa48("46");
      const hashedPassword = await this.userAuthentication.hashPassword(newPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async anonymizeUser(userId: string) {
    if (stryMutAct_9fa48("47")) {
      {}
    } else {
      stryCov_9fa48("47");
      const anonymizedData = stryMutAct_9fa48("48") ? {} : (stryCov_9fa48("48"), {
        name: 'Anonymous User',
        lastName: 'Anonymous',
        email: `anonymous_${userId}@example.com`,
        contactNumber: undefined // Use undefined instead of null for UpdateUserDto
      });
      const user = await this.userRepository.update(userId, anonymizedData);

      // Publish user updated event
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (fullUser) {
        if (stryMutAct_9fa48("54")) {
          {}
        } else {
          stryCov_9fa48("54");
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("55") ? {} : (stryCov_9fa48("55"), {
            id: userId
          }));
        }
      }
      return stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
        success: stryMutAct_9fa48("57") ? false : (stryCov_9fa48("57"), true),
        userId,
        anonymizedFields: Object.keys(anonymizedData),
        retainedFields: stryMutAct_9fa48("58") ? [] : (stryCov_9fa48("58"), ['id', 'role', 'createdAt']),
        timestamp: new Date()
      });
    }
  }

  // ✅ SRP: Delegates to NotificationService
  async sendMessageToUser(userId: string, message: string) {
    if (stryMutAct_9fa48("62")) {
      {}
    } else {
      stryCov_9fa48("62");
      try {
        if (stryMutAct_9fa48("63")) {
          {}
        } else {
          stryCov_9fa48("63");
          await this.notificationService.createNotification(stryMutAct_9fa48("64") ? {} : (stryCov_9fa48("64"), {
            userId,
            message,
            type: 'info'
          }));
          return stryMutAct_9fa48("66") ? {} : (stryCov_9fa48("66"), {
            success: stryMutAct_9fa48("67") ? false : (stryCov_9fa48("67"), true),
            message: 'Message sent successfully'
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("69")) {
          {}
        } else {
          stryCov_9fa48("69");
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          return stryMutAct_9fa48("71") ? {} : (stryCov_9fa48("71"), {
            success: stryMutAct_9fa48("72") ? true : (stryCov_9fa48("72"), false),
            message: `Failed to send message: ${errorMessage}`
          });
        }
      }
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async createImpersonationToken(adminId: string, targetUserId: string) {
    if (stryMutAct_9fa48("74")) {
      {}
    } else {
      stryCov_9fa48("74");
      // Simplified implementation - in production, use proper JWT
      const token = await this.userAuthentication.generatePasswordResetToken(targetUserId);
      return stryMutAct_9fa48("75") ? {} : (stryCov_9fa48("75"), {
        token,
        expiresAt: new Date(stryMutAct_9fa48("76") ? Date.now() - 3600000 : (stryCov_9fa48("76"), Date.now() + 3600000)),
        // 1 hour
        targetUserId,
        adminId,
        restrictions: stryMutAct_9fa48("77") ? [] : (stryCov_9fa48("77"), ['read-only', 'no-admin-actions'])
      });
    }
  }

  // Bulk operations - these would be implemented by separate bulk services
  // For now, we'll provide simplified implementations

  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto) {
    if (stryMutAct_9fa48("80")) {
      {}
    } else {
      stryCov_9fa48("80");
      const {
        userIds
      } = bulkDeleteDto;
      let deletedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("81")) {
          {}
        } else {
          stryCov_9fa48("81");
          try {
            if (stryMutAct_9fa48("82")) {
              {}
            } else {
              stryCov_9fa48("82");
              await this.remove(userId);
              stryMutAct_9fa48("83") ? deletedCount-- : (stryCov_9fa48("83"), deletedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("84")) {
              {}
            } else {
              stryCov_9fa48("84");
              console.error(`Failed to delete user ${userId}:`, error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation('bulk_delete', userIds, stryMutAct_9fa48("87") ? {} : (stryCov_9fa48("87"), {
        requestedCount: userIds.length,
        successCount: deletedCount
      }));
      return stryMutAct_9fa48("88") ? {} : (stryCov_9fa48("88"), {
        success: stryMutAct_9fa48("89") ? false : (stryCov_9fa48("89"), true),
        message: `Successfully deleted ${deletedCount} out of ${userIds.length} users`,
        affectedCount: deletedCount
      });
    }
  }
  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    if (stryMutAct_9fa48("91")) {
      {}
    } else {
      stryCov_9fa48("91");
      const {
        userIds,
        role
      } = bulkUpdateRoleDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("92")) {
          {}
        } else {
          stryCov_9fa48("92");
          try {
            if (stryMutAct_9fa48("93")) {
              {}
            } else {
              stryCov_9fa48("93");
              await this.update(userId, stryMutAct_9fa48("94") ? {} : (stryCov_9fa48("94"), {
                role
              }));
              stryMutAct_9fa48("95") ? updatedCount-- : (stryCov_9fa48("95"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("96")) {
              {}
            } else {
              stryCov_9fa48("96");
              console.error(`Failed to update role for user ${userId}:`, error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation('bulk_update_role', userIds, stryMutAct_9fa48("99") ? {} : (stryCov_9fa48("99"), {
        newRole: role,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("100") ? {} : (stryCov_9fa48("100"), {
        success: stryMutAct_9fa48("101") ? false : (stryCov_9fa48("101"), true),
        message: `Successfully updated role for ${updatedCount} out of ${userIds.length} users`,
        affectedCount: updatedCount
      });
    }
  }
  async bulkUpdateStatus(bulkUpdateStatusDto: BulkUpdateStatusDto) {
    if (stryMutAct_9fa48("103")) {
      {}
    } else {
      stryCov_9fa48("103");
      const {
        userIds,
        status
      } = bulkUpdateStatusDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("104")) {
          {}
        } else {
          stryCov_9fa48("104");
          try {
            if (stryMutAct_9fa48("105")) {
              {}
            } else {
              stryCov_9fa48("105");
              await this.update(userId, stryMutAct_9fa48("106") ? {} : (stryCov_9fa48("106"), {
                status
              }));
              stryMutAct_9fa48("107") ? updatedCount-- : (stryCov_9fa48("107"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("108")) {
              {}
            } else {
              stryCov_9fa48("108");
              console.error(`Failed to update status for user ${userId}:`, error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation('bulk_update_status', userIds, stryMutAct_9fa48("111") ? {} : (stryCov_9fa48("111"), {
        newStatus: status,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
        success: stryMutAct_9fa48("113") ? false : (stryCov_9fa48("113"), true),
        message: `Successfully updated status for ${updatedCount} out of ${userIds.length} users`,
        affectedCount: updatedCount
      });
    }
  }
  async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    if (stryMutAct_9fa48("115")) {
      {}
    } else {
      stryCov_9fa48("115");
      const {
        userId,
        sendEmail = stryMutAct_9fa48("116") ? false : (stryCov_9fa48("116"), true)
      } = resetPasswordDto;

      // Generate temporary password
      const tempPassword = stryMutAct_9fa48("117") ? Math.random().toString(36) : (stryCov_9fa48("117"), Math.random().toString(36).slice(stryMutAct_9fa48("118") ? +8 : (stryCov_9fa48("118"), -8)));

      // Hash and update password
      const hashedPassword = await this.userAuthentication.hashPassword(tempPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
      let emailSent = stryMutAct_9fa48("119") ? true : (stryCov_9fa48("119"), false);
      if (sendEmail) {
        if (stryMutAct_9fa48("122")) {
          {}
        } else {
          stryCov_9fa48("122");
          try {
            if (stryMutAct_9fa48("123")) {
              {}
            } else {
              stryCov_9fa48("123");
              await this.notificationService.createNotification(stryMutAct_9fa48("124") ? {} : (stryCov_9fa48("124"), {
                userId,
                message: `Your password has been reset. Your temporary password is: ${tempPassword}`,
                type: 'warning'
              }));
              emailSent = stryMutAct_9fa48("127") ? false : (stryCov_9fa48("127"), true);
            }
          } catch (error) {
            if (stryMutAct_9fa48("128")) {
              {}
            } else {
              stryCov_9fa48("128");
              console.error('Failed to send password reset email:', error);
            }
          }
        }
      }
      return stryMutAct_9fa48("130") ? {} : (stryCov_9fa48("130"), {
        success: stryMutAct_9fa48("131") ? false : (stryCov_9fa48("131"), true),
        message: emailSent ? 'Password reset email sent' : 'Password reset completed',
        tempPassword: emailSent ? undefined : tempPassword,
        emailSent
      });
    }
  }
}