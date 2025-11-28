// @ts-nocheck
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
import { NotificationType } from '../../notification/dto/create-notification.dto';

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
      if (stryMutAct_9fa48("3") ? false : stryMutAct_9fa48("2") ? true : (stryCov_9fa48("2", "3"), fullUser)) {
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
            message: stryMutAct_9fa48("7") ? `` : (stryCov_9fa48("7"), `Welcome to Alkitu, ${stryMutAct_9fa48("10") ? user.name && user.email : stryMutAct_9fa48("9") ? false : stryMutAct_9fa48("8") ? true : (stryCov_9fa48("8", "9", "10"), user.name || user.email)}!`),
            type: NotificationType.INFO,
            link: stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), '/dashboard')
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("12")) {
          {}
        } else {
          stryCov_9fa48("12");
          const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), 'Unknown error');
          console.log(stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), 'Warning: Could not create welcome notification:'), errorMessage);
        }
      }
      return user;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAll() {
    if (stryMutAct_9fa48("15")) {
      {}
    } else {
      stryCov_9fa48("15");
      return this.userRepository.findAll();
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAllWithFilters(filterDto: FilterUsersDto) {
    if (stryMutAct_9fa48("16")) {
      {}
    } else {
      stryCov_9fa48("16");
      return this.userRepository.findAllWithFilters(filterDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findOne(id: string) {
    if (stryMutAct_9fa48("17")) {
      {}
    } else {
      stryCov_9fa48("17");
      return this.userRepository.findById(id);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findByEmail(email: string) {
    if (stryMutAct_9fa48("18")) {
      {}
    } else {
      stryCov_9fa48("18");
      return this.userRepository.findByEmail(email);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (stryMutAct_9fa48("19")) {
      {}
    } else {
      stryCov_9fa48("19");
      // Get previous data for events
      const previousUser = await this.userRepository.findById(id);

      // Check if user exists
      if (stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : stryMutAct_9fa48("20") ? previousUser : (stryCov_9fa48("20", "21", "22"), !previousUser)) {
        if (stryMutAct_9fa48("23")) {
          {}
        } else {
          stryCov_9fa48("23");
          throw new Error(stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), 'User not found'));
        }
      }

      // Update user
      const updatedUser = await this.userRepository.update(id, updateUserDto);

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(updatedUser.email);
      if (stryMutAct_9fa48("27") ? fullUser || previousUser : stryMutAct_9fa48("26") ? false : stryMutAct_9fa48("25") ? true : (stryCov_9fa48("25", "26", "27"), fullUser && previousUser)) {
        if (stryMutAct_9fa48("28")) {
          {}
        } else {
          stryCov_9fa48("28");
          // Publish user updated event - convert UserResponse to User for events
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("29") ? {} : (stryCov_9fa48("29"), {
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
    if (stryMutAct_9fa48("30")) {
      {}
    } else {
      stryCov_9fa48("30");
      return this.userRepository.updateTags(id, updateUserTagsDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async remove(id: string) {
    if (stryMutAct_9fa48("31")) {
      {}
    } else {
      stryCov_9fa48("31");
      // Get user data before deletion for events
      const user = await this.userRepository.findById(id);

      // Check if user exists
      if (stryMutAct_9fa48("34") ? false : stryMutAct_9fa48("33") ? true : stryMutAct_9fa48("32") ? user : (stryCov_9fa48("32", "33", "34"), !user)) {
        if (stryMutAct_9fa48("35")) {
          {}
        } else {
          stryCov_9fa48("35");
          throw new Error(stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), 'User not found'));
        }
      }

      // Delete user
      await this.userRepository.delete(id);

      // Publish user deleted event
      await this.userEvents.publishUserDeleted(id, stryMutAct_9fa48("37") ? {} : (stryCov_9fa48("37"), {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        contactNumber: user.contactNumber
      }));

      // Return success message for backward compatibility
      return stryMutAct_9fa48("38") ? {} : (stryCov_9fa48("38"), {
        message: stryMutAct_9fa48("39") ? "" : (stryCov_9fa48("39"), 'User deleted successfully')
      });
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async validateUser(loginDto: LoginUserDto) {
    if (stryMutAct_9fa48("40")) {
      {}
    } else {
      stryCov_9fa48("40");
      const authenticatedUser = await this.userAuthentication.validateUser(loginDto);
      if (stryMutAct_9fa48("42") ? false : stryMutAct_9fa48("41") ? true : (stryCov_9fa48("41", "42"), authenticatedUser)) {
        if (stryMutAct_9fa48("43")) {
          {}
        } else {
          stryCov_9fa48("43");
          // Publish login event
          await this.userEvents.publishUserLoggedIn(authenticatedUser.id);
        }
      }
      return authenticatedUser;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updatePassword(id: string, hashedPassword: string) {
    if (stryMutAct_9fa48("44")) {
      {}
    } else {
      stryCov_9fa48("44");
      return this.userRepository.updatePassword(id, hashedPassword);
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    if (stryMutAct_9fa48("45")) {
      {}
    } else {
      stryCov_9fa48("45");
      await this.userAuthentication.changePassword(id, changePasswordDto);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(id);
      return stryMutAct_9fa48("46") ? {} : (stryCov_9fa48("46"), {
        message: stryMutAct_9fa48("47") ? "" : (stryCov_9fa48("47"), 'Password changed successfully')
      });
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async markEmailAsVerified(id: string) {
    if (stryMutAct_9fa48("48")) {
      {}
    } else {
      stryCov_9fa48("48");
      const result = await this.userRepository.markEmailAsVerified(id);

      // Publish email verified event
      await this.userEvents.publishUserEmailVerified(id);
      return result;
    }
  }

  // ✅ SRP: Delegates to UserAnalyticsService
  async getUserStats() {
    if (stryMutAct_9fa48("49")) {
      {}
    } else {
      stryCov_9fa48("49");
      return this.userAnalytics.getUserStats();
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async adminChangePassword(userId: string, newPassword: string) {
    if (stryMutAct_9fa48("50")) {
      {}
    } else {
      stryCov_9fa48("50");
      const hashedPassword = await this.userAuthentication.hashPassword(newPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async anonymizeUser(userId: string) {
    if (stryMutAct_9fa48("51")) {
      {}
    } else {
      stryCov_9fa48("51");
      const anonymizedData = stryMutAct_9fa48("52") ? {} : (stryCov_9fa48("52"), {
        name: stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), 'Anonymous User'),
        lastName: stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), 'Anonymous'),
        email: stryMutAct_9fa48("55") ? `` : (stryCov_9fa48("55"), `anonymous_${userId}@example.com`),
        contactNumber: undefined // Use undefined instead of null for UpdateUserDto
      });
      const user = await this.userRepository.update(userId, anonymizedData);

      // Publish user updated event
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("57") ? false : stryMutAct_9fa48("56") ? true : (stryCov_9fa48("56", "57"), fullUser)) {
        if (stryMutAct_9fa48("58")) {
          {}
        } else {
          stryCov_9fa48("58");
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("59") ? {} : (stryCov_9fa48("59"), {
            id: userId
          }));
        }
      }
      return stryMutAct_9fa48("60") ? {} : (stryCov_9fa48("60"), {
        success: stryMutAct_9fa48("61") ? false : (stryCov_9fa48("61"), true),
        userId,
        anonymizedFields: Object.keys(anonymizedData),
        retainedFields: stryMutAct_9fa48("62") ? [] : (stryCov_9fa48("62"), [stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), 'id'), stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), 'role'), stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), 'createdAt')]),
        timestamp: new Date()
      });
    }
  }

  // ✅ SRP: Delegates to NotificationService
  async sendMessageToUser(userId: string, message: string) {
    if (stryMutAct_9fa48("66")) {
      {}
    } else {
      stryCov_9fa48("66");
      try {
        if (stryMutAct_9fa48("67")) {
          {}
        } else {
          stryCov_9fa48("67");
          await this.notificationService.createNotification(stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
            userId,
            message,
            type: NotificationType.INFO
          }));
          return stryMutAct_9fa48("69") ? {} : (stryCov_9fa48("69"), {
            success: stryMutAct_9fa48("70") ? false : (stryCov_9fa48("70"), true),
            message: stryMutAct_9fa48("71") ? "" : (stryCov_9fa48("71"), 'Message sent successfully')
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("72")) {
          {}
        } else {
          stryCov_9fa48("72");
          const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("73") ? "" : (stryCov_9fa48("73"), 'Unknown error');
          return stryMutAct_9fa48("74") ? {} : (stryCov_9fa48("74"), {
            success: stryMutAct_9fa48("75") ? true : (stryCov_9fa48("75"), false),
            message: stryMutAct_9fa48("76") ? `` : (stryCov_9fa48("76"), `Failed to send message: ${errorMessage}`)
          });
        }
      }
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async createImpersonationToken(adminId: string, targetUserId: string) {
    if (stryMutAct_9fa48("77")) {
      {}
    } else {
      stryCov_9fa48("77");
      // Simplified implementation - in production, use proper JWT
      const token = await this.userAuthentication.generatePasswordResetToken(targetUserId);
      return stryMutAct_9fa48("78") ? {} : (stryCov_9fa48("78"), {
        token,
        expiresAt: new Date(stryMutAct_9fa48("79") ? Date.now() - 3600000 : (stryCov_9fa48("79"), Date.now() + 3600000)),
        // 1 hour
        targetUserId,
        adminId,
        restrictions: stryMutAct_9fa48("80") ? [] : (stryCov_9fa48("80"), [stryMutAct_9fa48("81") ? "" : (stryCov_9fa48("81"), 'read-only'), stryMutAct_9fa48("82") ? "" : (stryCov_9fa48("82"), 'no-admin-actions')])
      });
    }
  }

  // Bulk operations - these would be implemented by separate bulk services
  // For now, we'll provide simplified implementations

  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto) {
    if (stryMutAct_9fa48("83")) {
      {}
    } else {
      stryCov_9fa48("83");
      const {
        userIds
      } = bulkDeleteDto;
      let deletedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("84")) {
          {}
        } else {
          stryCov_9fa48("84");
          try {
            if (stryMutAct_9fa48("85")) {
              {}
            } else {
              stryCov_9fa48("85");
              await this.remove(userId);
              stryMutAct_9fa48("86") ? deletedCount-- : (stryCov_9fa48("86"), deletedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("87")) {
              {}
            } else {
              stryCov_9fa48("87");
              console.error(stryMutAct_9fa48("88") ? `` : (stryCov_9fa48("88"), `Failed to delete user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("89") ? "" : (stryCov_9fa48("89"), 'bulk_delete'), userIds, stryMutAct_9fa48("90") ? {} : (stryCov_9fa48("90"), {
        requestedCount: userIds.length,
        successCount: deletedCount
      }));
      return stryMutAct_9fa48("91") ? {} : (stryCov_9fa48("91"), {
        success: stryMutAct_9fa48("92") ? false : (stryCov_9fa48("92"), true),
        message: stryMutAct_9fa48("93") ? `` : (stryCov_9fa48("93"), `Successfully deleted ${deletedCount} out of ${userIds.length} users`),
        affectedCount: deletedCount
      });
    }
  }
  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    if (stryMutAct_9fa48("94")) {
      {}
    } else {
      stryCov_9fa48("94");
      const {
        userIds,
        role
      } = bulkUpdateRoleDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("95")) {
          {}
        } else {
          stryCov_9fa48("95");
          try {
            if (stryMutAct_9fa48("96")) {
              {}
            } else {
              stryCov_9fa48("96");
              await this.update(userId, stryMutAct_9fa48("97") ? {} : (stryCov_9fa48("97"), {
                role
              }));
              stryMutAct_9fa48("98") ? updatedCount-- : (stryCov_9fa48("98"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("99")) {
              {}
            } else {
              stryCov_9fa48("99");
              console.error(stryMutAct_9fa48("100") ? `` : (stryCov_9fa48("100"), `Failed to update role for user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), 'bulk_update_role'), userIds, stryMutAct_9fa48("102") ? {} : (stryCov_9fa48("102"), {
        newRole: role,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("103") ? {} : (stryCov_9fa48("103"), {
        success: stryMutAct_9fa48("104") ? false : (stryCov_9fa48("104"), true),
        message: stryMutAct_9fa48("105") ? `` : (stryCov_9fa48("105"), `Successfully updated role for ${updatedCount} out of ${userIds.length} users`),
        affectedCount: updatedCount
      });
    }
  }
  async bulkUpdateStatus(bulkUpdateStatusDto: BulkUpdateStatusDto) {
    if (stryMutAct_9fa48("106")) {
      {}
    } else {
      stryCov_9fa48("106");
      const {
        userIds,
        status
      } = bulkUpdateStatusDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("107")) {
          {}
        } else {
          stryCov_9fa48("107");
          try {
            if (stryMutAct_9fa48("108")) {
              {}
            } else {
              stryCov_9fa48("108");
              await this.update(userId, stryMutAct_9fa48("109") ? {} : (stryCov_9fa48("109"), {
                status
              }));
              stryMutAct_9fa48("110") ? updatedCount-- : (stryCov_9fa48("110"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("111")) {
              {}
            } else {
              stryCov_9fa48("111");
              console.error(stryMutAct_9fa48("112") ? `` : (stryCov_9fa48("112"), `Failed to update status for user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("113") ? "" : (stryCov_9fa48("113"), 'bulk_update_status'), userIds, stryMutAct_9fa48("114") ? {} : (stryCov_9fa48("114"), {
        newStatus: status,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("115") ? {} : (stryCov_9fa48("115"), {
        success: stryMutAct_9fa48("116") ? false : (stryCov_9fa48("116"), true),
        message: stryMutAct_9fa48("117") ? `` : (stryCov_9fa48("117"), `Successfully updated status for ${updatedCount} out of ${userIds.length} users`),
        affectedCount: updatedCount
      });
    }
  }
  async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    if (stryMutAct_9fa48("118")) {
      {}
    } else {
      stryCov_9fa48("118");
      const {
        userId,
        sendEmail = stryMutAct_9fa48("119") ? false : (stryCov_9fa48("119"), true)
      } = resetPasswordDto;

      // Generate temporary password
      const tempPassword = stryMutAct_9fa48("120") ? Math.random().toString(36) : (stryCov_9fa48("120"), Math.random().toString(36).slice(stryMutAct_9fa48("121") ? +8 : (stryCov_9fa48("121"), -8)));

      // Hash and update password
      const hashedPassword = await this.userAuthentication.hashPassword(tempPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
      let emailSent = stryMutAct_9fa48("122") ? true : (stryCov_9fa48("122"), false);
      if (stryMutAct_9fa48("124") ? false : stryMutAct_9fa48("123") ? true : (stryCov_9fa48("123", "124"), sendEmail)) {
        if (stryMutAct_9fa48("125")) {
          {}
        } else {
          stryCov_9fa48("125");
          try {
            if (stryMutAct_9fa48("126")) {
              {}
            } else {
              stryCov_9fa48("126");
              await this.notificationService.createNotification(stryMutAct_9fa48("127") ? {} : (stryCov_9fa48("127"), {
                userId,
                message: stryMutAct_9fa48("128") ? `` : (stryCov_9fa48("128"), `Your password has been reset. Your temporary password is: ${tempPassword}`),
                type: NotificationType.WARNING
              }));
              emailSent = stryMutAct_9fa48("129") ? false : (stryCov_9fa48("129"), true);
            }
          } catch (error) {
            if (stryMutAct_9fa48("130")) {
              {}
            } else {
              stryCov_9fa48("130");
              console.error(stryMutAct_9fa48("131") ? "" : (stryCov_9fa48("131"), 'Failed to send password reset email:'), error);
            }
          }
        }
      }
      return stryMutAct_9fa48("132") ? {} : (stryCov_9fa48("132"), {
        success: stryMutAct_9fa48("133") ? false : (stryCov_9fa48("133"), true),
        message: emailSent ? stryMutAct_9fa48("134") ? "" : (stryCov_9fa48("134"), 'Password reset email sent') : stryMutAct_9fa48("135") ? "" : (stryCov_9fa48("135"), 'Password reset completed'),
        tempPassword: emailSent ? undefined : tempPassword,
        emailSent
      });
    }
  }
}