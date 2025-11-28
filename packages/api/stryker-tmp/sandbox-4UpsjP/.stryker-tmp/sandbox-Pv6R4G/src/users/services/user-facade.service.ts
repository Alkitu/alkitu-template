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
    if (stryMutAct_9fa48("368")) {
      {}
    } else {
      stryCov_9fa48("368");
      const {
        password,
        ...userData
      } = createUserDto;

      // Hash password using authentication service
      const hashedPassword = await this.userAuthentication.hashPassword(password);

      // Create user using repository service
      const user = await this.userRepository.create(stryMutAct_9fa48("369") ? {} : (stryCov_9fa48("369"), {
        ...userData,
        password: hashedPassword
      }));

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("371") ? false : stryMutAct_9fa48("370") ? true : (stryCov_9fa48("370", "371"), fullUser)) {
        if (stryMutAct_9fa48("372")) {
          {}
        } else {
          stryCov_9fa48("372");
          // Publish user created event
          await this.userEvents.publishUserCreated(fullUser);
        }
      }

      // Create welcome notification (optional, don't fail if it fails)
      try {
        if (stryMutAct_9fa48("373")) {
          {}
        } else {
          stryCov_9fa48("373");
          await this.notificationService.createNotification(stryMutAct_9fa48("374") ? {} : (stryCov_9fa48("374"), {
            userId: user.id,
            message: stryMutAct_9fa48("375") ? `` : (stryCov_9fa48("375"), `Welcome to Alkitu, ${stryMutAct_9fa48("378") ? user.name && user.email : stryMutAct_9fa48("377") ? false : stryMutAct_9fa48("376") ? true : (stryCov_9fa48("376", "377", "378"), user.name || user.email)}!`),
            type: stryMutAct_9fa48("379") ? "" : (stryCov_9fa48("379"), 'info'),
            link: stryMutAct_9fa48("380") ? "" : (stryCov_9fa48("380"), '/dashboard')
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("381")) {
          {}
        } else {
          stryCov_9fa48("381");
          const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("382") ? "" : (stryCov_9fa48("382"), 'Unknown error');
          console.log(stryMutAct_9fa48("383") ? "" : (stryCov_9fa48("383"), 'Warning: Could not create welcome notification:'), errorMessage);
        }
      }
      return user;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAll() {
    if (stryMutAct_9fa48("384")) {
      {}
    } else {
      stryCov_9fa48("384");
      return this.userRepository.findAll();
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAllWithFilters(filterDto: FilterUsersDto) {
    if (stryMutAct_9fa48("385")) {
      {}
    } else {
      stryCov_9fa48("385");
      return this.userRepository.findAllWithFilters(filterDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findOne(id: string) {
    if (stryMutAct_9fa48("386")) {
      {}
    } else {
      stryCov_9fa48("386");
      return this.userRepository.findById(id);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findByEmail(email: string) {
    if (stryMutAct_9fa48("387")) {
      {}
    } else {
      stryCov_9fa48("387");
      return this.userRepository.findByEmail(email);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (stryMutAct_9fa48("388")) {
      {}
    } else {
      stryCov_9fa48("388");
      // Get previous data for events
      const previousUser = await this.userRepository.findById(id);

      // Update user
      const updatedUser = await this.userRepository.update(id, updateUserDto);

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(updatedUser.email);
      if (stryMutAct_9fa48("391") ? fullUser || previousUser : stryMutAct_9fa48("390") ? false : stryMutAct_9fa48("389") ? true : (stryCov_9fa48("389", "390", "391"), fullUser && previousUser)) {
        if (stryMutAct_9fa48("392")) {
          {}
        } else {
          stryCov_9fa48("392");
          // Publish user updated event - convert UserResponse to User for events
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("393") ? {} : (stryCov_9fa48("393"), {
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
    if (stryMutAct_9fa48("394")) {
      {}
    } else {
      stryCov_9fa48("394");
      return this.userRepository.updateTags(id, updateUserTagsDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async remove(id: string) {
    if (stryMutAct_9fa48("395")) {
      {}
    } else {
      stryCov_9fa48("395");
      // Get user data before deletion for events
      const user = await this.userRepository.findById(id);

      // Delete user
      await this.userRepository.delete(id);

      // Publish user deleted event
      if (stryMutAct_9fa48("397") ? false : stryMutAct_9fa48("396") ? true : (stryCov_9fa48("396", "397"), user)) {
        if (stryMutAct_9fa48("398")) {
          {}
        } else {
          stryCov_9fa48("398");
          await this.userEvents.publishUserDeleted(id, stryMutAct_9fa48("399") ? {} : (stryCov_9fa48("399"), {
            id: user.id,
            email: user.email,
            name: user.name,
            lastName: user.lastName,
            contactNumber: user.contactNumber
          }));
        }
      }

      // Return success message for backward compatibility
      return stryMutAct_9fa48("400") ? {} : (stryCov_9fa48("400"), {
        message: stryMutAct_9fa48("401") ? "" : (stryCov_9fa48("401"), 'User deleted successfully')
      });
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async validateUser(loginDto: LoginUserDto) {
    if (stryMutAct_9fa48("402")) {
      {}
    } else {
      stryCov_9fa48("402");
      const authenticatedUser = await this.userAuthentication.validateUser(loginDto);
      if (stryMutAct_9fa48("404") ? false : stryMutAct_9fa48("403") ? true : (stryCov_9fa48("403", "404"), authenticatedUser)) {
        if (stryMutAct_9fa48("405")) {
          {}
        } else {
          stryCov_9fa48("405");
          // Publish login event
          await this.userEvents.publishUserLoggedIn(authenticatedUser.id);
        }
      }
      return authenticatedUser;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updatePassword(id: string, hashedPassword: string) {
    if (stryMutAct_9fa48("406")) {
      {}
    } else {
      stryCov_9fa48("406");
      return this.userRepository.updatePassword(id, hashedPassword);
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    if (stryMutAct_9fa48("407")) {
      {}
    } else {
      stryCov_9fa48("407");
      await this.userAuthentication.changePassword(id, changePasswordDto);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(id);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async markEmailAsVerified(id: string) {
    if (stryMutAct_9fa48("408")) {
      {}
    } else {
      stryCov_9fa48("408");
      const result = await this.userRepository.markEmailAsVerified(id);

      // Publish email verified event
      await this.userEvents.publishUserEmailVerified(id);
      return result;
    }
  }

  // ✅ SRP: Delegates to UserAnalyticsService
  async getUserStats() {
    if (stryMutAct_9fa48("409")) {
      {}
    } else {
      stryCov_9fa48("409");
      return this.userAnalytics.getUserStats();
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async adminChangePassword(userId: string, newPassword: string) {
    if (stryMutAct_9fa48("410")) {
      {}
    } else {
      stryCov_9fa48("410");
      const hashedPassword = await this.userAuthentication.hashPassword(newPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async anonymizeUser(userId: string) {
    if (stryMutAct_9fa48("411")) {
      {}
    } else {
      stryCov_9fa48("411");
      const anonymizedData = stryMutAct_9fa48("412") ? {} : (stryCov_9fa48("412"), {
        name: stryMutAct_9fa48("413") ? "" : (stryCov_9fa48("413"), 'Anonymous User'),
        lastName: stryMutAct_9fa48("414") ? "" : (stryCov_9fa48("414"), 'Anonymous'),
        email: stryMutAct_9fa48("415") ? `` : (stryCov_9fa48("415"), `anonymous_${userId}@example.com`),
        contactNumber: undefined // Use undefined instead of null for UpdateUserDto
      });
      const user = await this.userRepository.update(userId, anonymizedData);

      // Publish user updated event
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("417") ? false : stryMutAct_9fa48("416") ? true : (stryCov_9fa48("416", "417"), fullUser)) {
        if (stryMutAct_9fa48("418")) {
          {}
        } else {
          stryCov_9fa48("418");
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("419") ? {} : (stryCov_9fa48("419"), {
            id: userId
          }));
        }
      }
      return stryMutAct_9fa48("420") ? {} : (stryCov_9fa48("420"), {
        success: stryMutAct_9fa48("421") ? false : (stryCov_9fa48("421"), true),
        userId,
        anonymizedFields: Object.keys(anonymizedData),
        retainedFields: stryMutAct_9fa48("422") ? [] : (stryCov_9fa48("422"), [stryMutAct_9fa48("423") ? "" : (stryCov_9fa48("423"), 'id'), stryMutAct_9fa48("424") ? "" : (stryCov_9fa48("424"), 'role'), stryMutAct_9fa48("425") ? "" : (stryCov_9fa48("425"), 'createdAt')]),
        timestamp: new Date()
      });
    }
  }

  // ✅ SRP: Delegates to NotificationService
  async sendMessageToUser(userId: string, message: string) {
    if (stryMutAct_9fa48("426")) {
      {}
    } else {
      stryCov_9fa48("426");
      try {
        if (stryMutAct_9fa48("427")) {
          {}
        } else {
          stryCov_9fa48("427");
          await this.notificationService.createNotification(stryMutAct_9fa48("428") ? {} : (stryCov_9fa48("428"), {
            userId,
            message,
            type: stryMutAct_9fa48("429") ? "" : (stryCov_9fa48("429"), 'info')
          }));
          return stryMutAct_9fa48("430") ? {} : (stryCov_9fa48("430"), {
            success: stryMutAct_9fa48("431") ? false : (stryCov_9fa48("431"), true),
            message: stryMutAct_9fa48("432") ? "" : (stryCov_9fa48("432"), 'Message sent successfully')
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("433")) {
          {}
        } else {
          stryCov_9fa48("433");
          const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("434") ? "" : (stryCov_9fa48("434"), 'Unknown error');
          return stryMutAct_9fa48("435") ? {} : (stryCov_9fa48("435"), {
            success: stryMutAct_9fa48("436") ? true : (stryCov_9fa48("436"), false),
            message: stryMutAct_9fa48("437") ? `` : (stryCov_9fa48("437"), `Failed to send message: ${errorMessage}`)
          });
        }
      }
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async createImpersonationToken(adminId: string, targetUserId: string) {
    if (stryMutAct_9fa48("438")) {
      {}
    } else {
      stryCov_9fa48("438");
      // Simplified implementation - in production, use proper JWT
      const token = await this.userAuthentication.generatePasswordResetToken(targetUserId);
      return stryMutAct_9fa48("439") ? {} : (stryCov_9fa48("439"), {
        token,
        expiresAt: new Date(stryMutAct_9fa48("440") ? Date.now() - 3600000 : (stryCov_9fa48("440"), Date.now() + 3600000)),
        // 1 hour
        targetUserId,
        adminId,
        restrictions: stryMutAct_9fa48("441") ? [] : (stryCov_9fa48("441"), [stryMutAct_9fa48("442") ? "" : (stryCov_9fa48("442"), 'read-only'), stryMutAct_9fa48("443") ? "" : (stryCov_9fa48("443"), 'no-admin-actions')])
      });
    }
  }

  // Bulk operations - these would be implemented by separate bulk services
  // For now, we'll provide simplified implementations

  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto) {
    if (stryMutAct_9fa48("444")) {
      {}
    } else {
      stryCov_9fa48("444");
      const {
        userIds
      } = bulkDeleteDto;
      let deletedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("445")) {
          {}
        } else {
          stryCov_9fa48("445");
          try {
            if (stryMutAct_9fa48("446")) {
              {}
            } else {
              stryCov_9fa48("446");
              await this.remove(userId);
              stryMutAct_9fa48("447") ? deletedCount-- : (stryCov_9fa48("447"), deletedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("448")) {
              {}
            } else {
              stryCov_9fa48("448");
              console.error(stryMutAct_9fa48("449") ? `` : (stryCov_9fa48("449"), `Failed to delete user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("450") ? "" : (stryCov_9fa48("450"), 'bulk_delete'), userIds, stryMutAct_9fa48("451") ? {} : (stryCov_9fa48("451"), {
        requestedCount: userIds.length,
        successCount: deletedCount
      }));
      return stryMutAct_9fa48("452") ? {} : (stryCov_9fa48("452"), {
        success: stryMutAct_9fa48("453") ? false : (stryCov_9fa48("453"), true),
        message: stryMutAct_9fa48("454") ? `` : (stryCov_9fa48("454"), `Successfully deleted ${deletedCount} out of ${userIds.length} users`),
        affectedCount: deletedCount
      });
    }
  }
  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    if (stryMutAct_9fa48("455")) {
      {}
    } else {
      stryCov_9fa48("455");
      const {
        userIds,
        role
      } = bulkUpdateRoleDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("456")) {
          {}
        } else {
          stryCov_9fa48("456");
          try {
            if (stryMutAct_9fa48("457")) {
              {}
            } else {
              stryCov_9fa48("457");
              await this.update(userId, stryMutAct_9fa48("458") ? {} : (stryCov_9fa48("458"), {
                role
              }));
              stryMutAct_9fa48("459") ? updatedCount-- : (stryCov_9fa48("459"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("460")) {
              {}
            } else {
              stryCov_9fa48("460");
              console.error(stryMutAct_9fa48("461") ? `` : (stryCov_9fa48("461"), `Failed to update role for user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("462") ? "" : (stryCov_9fa48("462"), 'bulk_update_role'), userIds, stryMutAct_9fa48("463") ? {} : (stryCov_9fa48("463"), {
        newRole: role,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("464") ? {} : (stryCov_9fa48("464"), {
        success: stryMutAct_9fa48("465") ? false : (stryCov_9fa48("465"), true),
        message: stryMutAct_9fa48("466") ? `` : (stryCov_9fa48("466"), `Successfully updated role for ${updatedCount} out of ${userIds.length} users`),
        affectedCount: updatedCount
      });
    }
  }
  async bulkUpdateStatus(bulkUpdateStatusDto: BulkUpdateStatusDto) {
    if (stryMutAct_9fa48("467")) {
      {}
    } else {
      stryCov_9fa48("467");
      const {
        userIds,
        status
      } = bulkUpdateStatusDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("468")) {
          {}
        } else {
          stryCov_9fa48("468");
          try {
            if (stryMutAct_9fa48("469")) {
              {}
            } else {
              stryCov_9fa48("469");
              await this.update(userId, stryMutAct_9fa48("470") ? {} : (stryCov_9fa48("470"), {
                status
              }));
              stryMutAct_9fa48("471") ? updatedCount-- : (stryCov_9fa48("471"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("472")) {
              {}
            } else {
              stryCov_9fa48("472");
              console.error(stryMutAct_9fa48("473") ? `` : (stryCov_9fa48("473"), `Failed to update status for user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("474") ? "" : (stryCov_9fa48("474"), 'bulk_update_status'), userIds, stryMutAct_9fa48("475") ? {} : (stryCov_9fa48("475"), {
        newStatus: status,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("476") ? {} : (stryCov_9fa48("476"), {
        success: stryMutAct_9fa48("477") ? false : (stryCov_9fa48("477"), true),
        message: stryMutAct_9fa48("478") ? `` : (stryCov_9fa48("478"), `Successfully updated status for ${updatedCount} out of ${userIds.length} users`),
        affectedCount: updatedCount
      });
    }
  }
  async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    if (stryMutAct_9fa48("479")) {
      {}
    } else {
      stryCov_9fa48("479");
      const {
        userId,
        sendEmail = stryMutAct_9fa48("480") ? false : (stryCov_9fa48("480"), true)
      } = resetPasswordDto;

      // Generate temporary password
      const tempPassword = stryMutAct_9fa48("481") ? Math.random().toString(36) : (stryCov_9fa48("481"), Math.random().toString(36).slice(stryMutAct_9fa48("482") ? +8 : (stryCov_9fa48("482"), -8)));

      // Hash and update password
      const hashedPassword = await this.userAuthentication.hashPassword(tempPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
      let emailSent = stryMutAct_9fa48("483") ? true : (stryCov_9fa48("483"), false);
      if (stryMutAct_9fa48("485") ? false : stryMutAct_9fa48("484") ? true : (stryCov_9fa48("484", "485"), sendEmail)) {
        if (stryMutAct_9fa48("486")) {
          {}
        } else {
          stryCov_9fa48("486");
          try {
            if (stryMutAct_9fa48("487")) {
              {}
            } else {
              stryCov_9fa48("487");
              await this.notificationService.createNotification(stryMutAct_9fa48("488") ? {} : (stryCov_9fa48("488"), {
                userId,
                message: stryMutAct_9fa48("489") ? `` : (stryCov_9fa48("489"), `Your password has been reset. Your temporary password is: ${tempPassword}`),
                type: stryMutAct_9fa48("490") ? "" : (stryCov_9fa48("490"), 'warning')
              }));
              emailSent = stryMutAct_9fa48("491") ? false : (stryCov_9fa48("491"), true);
            }
          } catch (error) {
            if (stryMutAct_9fa48("492")) {
              {}
            } else {
              stryCov_9fa48("492");
              console.error(stryMutAct_9fa48("493") ? "" : (stryCov_9fa48("493"), 'Failed to send password reset email:'), error);
            }
          }
        }
      }
      return stryMutAct_9fa48("494") ? {} : (stryCov_9fa48("494"), {
        success: stryMutAct_9fa48("495") ? false : (stryCov_9fa48("495"), true),
        message: emailSent ? stryMutAct_9fa48("496") ? "" : (stryCov_9fa48("496"), 'Password reset email sent') : stryMutAct_9fa48("497") ? "" : (stryCov_9fa48("497"), 'Password reset completed'),
        tempPassword: emailSent ? undefined : tempPassword,
        emailSent
      });
    }
  }
}