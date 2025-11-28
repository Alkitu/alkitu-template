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
    if (stryMutAct_9fa48("372")) {
      {}
    } else {
      stryCov_9fa48("372");
      const {
        password,
        ...userData
      } = createUserDto;

      // Hash password using authentication service
      const hashedPassword = await this.userAuthentication.hashPassword(password);

      // Create user using repository service
      const user = await this.userRepository.create(stryMutAct_9fa48("373") ? {} : (stryCov_9fa48("373"), {
        ...userData,
        password: hashedPassword
      }));

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("375") ? false : stryMutAct_9fa48("374") ? true : (stryCov_9fa48("374", "375"), fullUser)) {
        if (stryMutAct_9fa48("376")) {
          {}
        } else {
          stryCov_9fa48("376");
          // Publish user created event
          await this.userEvents.publishUserCreated(fullUser);
        }
      }

      // Create welcome notification (optional, don't fail if it fails)
      try {
        if (stryMutAct_9fa48("377")) {
          {}
        } else {
          stryCov_9fa48("377");
          await this.notificationService.createNotification(stryMutAct_9fa48("378") ? {} : (stryCov_9fa48("378"), {
            userId: user.id,
            message: stryMutAct_9fa48("379") ? `` : (stryCov_9fa48("379"), `Welcome to Alkitu, ${stryMutAct_9fa48("382") ? user.name && user.email : stryMutAct_9fa48("381") ? false : stryMutAct_9fa48("380") ? true : (stryCov_9fa48("380", "381", "382"), user.name || user.email)}!`),
            type: stryMutAct_9fa48("383") ? "" : (stryCov_9fa48("383"), 'info'),
            link: stryMutAct_9fa48("384") ? "" : (stryCov_9fa48("384"), '/dashboard')
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("385")) {
          {}
        } else {
          stryCov_9fa48("385");
          const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("386") ? "" : (stryCov_9fa48("386"), 'Unknown error');
          console.log(stryMutAct_9fa48("387") ? "" : (stryCov_9fa48("387"), 'Warning: Could not create welcome notification:'), errorMessage);
        }
      }
      return user;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAll() {
    if (stryMutAct_9fa48("388")) {
      {}
    } else {
      stryCov_9fa48("388");
      return this.userRepository.findAll();
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAllWithFilters(filterDto: FilterUsersDto) {
    if (stryMutAct_9fa48("389")) {
      {}
    } else {
      stryCov_9fa48("389");
      return this.userRepository.findAllWithFilters(filterDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findOne(id: string) {
    if (stryMutAct_9fa48("390")) {
      {}
    } else {
      stryCov_9fa48("390");
      return this.userRepository.findById(id);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findByEmail(email: string) {
    if (stryMutAct_9fa48("391")) {
      {}
    } else {
      stryCov_9fa48("391");
      return this.userRepository.findByEmail(email);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (stryMutAct_9fa48("392")) {
      {}
    } else {
      stryCov_9fa48("392");
      // Get previous data for events
      const previousUser = await this.userRepository.findById(id);

      // Update user
      const updatedUser = await this.userRepository.update(id, updateUserDto);

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(updatedUser.email);
      if (stryMutAct_9fa48("395") ? fullUser || previousUser : stryMutAct_9fa48("394") ? false : stryMutAct_9fa48("393") ? true : (stryCov_9fa48("393", "394", "395"), fullUser && previousUser)) {
        if (stryMutAct_9fa48("396")) {
          {}
        } else {
          stryCov_9fa48("396");
          // Publish user updated event - convert UserResponse to User for events
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("397") ? {} : (stryCov_9fa48("397"), {
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
    if (stryMutAct_9fa48("398")) {
      {}
    } else {
      stryCov_9fa48("398");
      return this.userRepository.updateTags(id, updateUserTagsDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async remove(id: string) {
    if (stryMutAct_9fa48("399")) {
      {}
    } else {
      stryCov_9fa48("399");
      // Get user data before deletion for events
      const user = await this.userRepository.findById(id);

      // Check if user exists
      if (stryMutAct_9fa48("402") ? false : stryMutAct_9fa48("401") ? true : stryMutAct_9fa48("400") ? user : (stryCov_9fa48("400", "401", "402"), !user)) {
        if (stryMutAct_9fa48("403")) {
          {}
        } else {
          stryCov_9fa48("403");
          throw new Error(stryMutAct_9fa48("404") ? "" : (stryCov_9fa48("404"), 'User not found'));
        }
      }

      // Delete user
      await this.userRepository.delete(id);

      // Publish user deleted event
      await this.userEvents.publishUserDeleted(id, stryMutAct_9fa48("405") ? {} : (stryCov_9fa48("405"), {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        contactNumber: user.contactNumber
      }));

      // Return success message for backward compatibility
      return stryMutAct_9fa48("406") ? {} : (stryCov_9fa48("406"), {
        message: stryMutAct_9fa48("407") ? "" : (stryCov_9fa48("407"), 'User deleted successfully')
      });
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async validateUser(loginDto: LoginUserDto) {
    if (stryMutAct_9fa48("408")) {
      {}
    } else {
      stryCov_9fa48("408");
      const authenticatedUser = await this.userAuthentication.validateUser(loginDto);
      if (stryMutAct_9fa48("410") ? false : stryMutAct_9fa48("409") ? true : (stryCov_9fa48("409", "410"), authenticatedUser)) {
        if (stryMutAct_9fa48("411")) {
          {}
        } else {
          stryCov_9fa48("411");
          // Publish login event
          await this.userEvents.publishUserLoggedIn(authenticatedUser.id);
        }
      }
      return authenticatedUser;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updatePassword(id: string, hashedPassword: string) {
    if (stryMutAct_9fa48("412")) {
      {}
    } else {
      stryCov_9fa48("412");
      return this.userRepository.updatePassword(id, hashedPassword);
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    if (stryMutAct_9fa48("413")) {
      {}
    } else {
      stryCov_9fa48("413");
      await this.userAuthentication.changePassword(id, changePasswordDto);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(id);
      return stryMutAct_9fa48("414") ? {} : (stryCov_9fa48("414"), {
        message: stryMutAct_9fa48("415") ? "" : (stryCov_9fa48("415"), 'Password changed successfully')
      });
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async markEmailAsVerified(id: string) {
    if (stryMutAct_9fa48("416")) {
      {}
    } else {
      stryCov_9fa48("416");
      const result = await this.userRepository.markEmailAsVerified(id);

      // Publish email verified event
      await this.userEvents.publishUserEmailVerified(id);
      return result;
    }
  }

  // ✅ SRP: Delegates to UserAnalyticsService
  async getUserStats() {
    if (stryMutAct_9fa48("417")) {
      {}
    } else {
      stryCov_9fa48("417");
      return this.userAnalytics.getUserStats();
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async adminChangePassword(userId: string, newPassword: string) {
    if (stryMutAct_9fa48("418")) {
      {}
    } else {
      stryCov_9fa48("418");
      const hashedPassword = await this.userAuthentication.hashPassword(newPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async anonymizeUser(userId: string) {
    if (stryMutAct_9fa48("419")) {
      {}
    } else {
      stryCov_9fa48("419");
      const anonymizedData = stryMutAct_9fa48("420") ? {} : (stryCov_9fa48("420"), {
        name: stryMutAct_9fa48("421") ? "" : (stryCov_9fa48("421"), 'Anonymous User'),
        lastName: stryMutAct_9fa48("422") ? "" : (stryCov_9fa48("422"), 'Anonymous'),
        email: stryMutAct_9fa48("423") ? `` : (stryCov_9fa48("423"), `anonymous_${userId}@example.com`),
        contactNumber: undefined // Use undefined instead of null for UpdateUserDto
      });
      const user = await this.userRepository.update(userId, anonymizedData);

      // Publish user updated event
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("425") ? false : stryMutAct_9fa48("424") ? true : (stryCov_9fa48("424", "425"), fullUser)) {
        if (stryMutAct_9fa48("426")) {
          {}
        } else {
          stryCov_9fa48("426");
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("427") ? {} : (stryCov_9fa48("427"), {
            id: userId
          }));
        }
      }
      return stryMutAct_9fa48("428") ? {} : (stryCov_9fa48("428"), {
        success: stryMutAct_9fa48("429") ? false : (stryCov_9fa48("429"), true),
        userId,
        anonymizedFields: Object.keys(anonymizedData),
        retainedFields: stryMutAct_9fa48("430") ? [] : (stryCov_9fa48("430"), [stryMutAct_9fa48("431") ? "" : (stryCov_9fa48("431"), 'id'), stryMutAct_9fa48("432") ? "" : (stryCov_9fa48("432"), 'role'), stryMutAct_9fa48("433") ? "" : (stryCov_9fa48("433"), 'createdAt')]),
        timestamp: new Date()
      });
    }
  }

  // ✅ SRP: Delegates to NotificationService
  async sendMessageToUser(userId: string, message: string) {
    if (stryMutAct_9fa48("434")) {
      {}
    } else {
      stryCov_9fa48("434");
      try {
        if (stryMutAct_9fa48("435")) {
          {}
        } else {
          stryCov_9fa48("435");
          await this.notificationService.createNotification(stryMutAct_9fa48("436") ? {} : (stryCov_9fa48("436"), {
            userId,
            message,
            type: stryMutAct_9fa48("437") ? "" : (stryCov_9fa48("437"), 'info')
          }));
          return stryMutAct_9fa48("438") ? {} : (stryCov_9fa48("438"), {
            success: stryMutAct_9fa48("439") ? false : (stryCov_9fa48("439"), true),
            message: stryMutAct_9fa48("440") ? "" : (stryCov_9fa48("440"), 'Message sent successfully')
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("441")) {
          {}
        } else {
          stryCov_9fa48("441");
          const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("442") ? "" : (stryCov_9fa48("442"), 'Unknown error');
          return stryMutAct_9fa48("443") ? {} : (stryCov_9fa48("443"), {
            success: stryMutAct_9fa48("444") ? true : (stryCov_9fa48("444"), false),
            message: stryMutAct_9fa48("445") ? `` : (stryCov_9fa48("445"), `Failed to send message: ${errorMessage}`)
          });
        }
      }
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async createImpersonationToken(adminId: string, targetUserId: string) {
    if (stryMutAct_9fa48("446")) {
      {}
    } else {
      stryCov_9fa48("446");
      // Simplified implementation - in production, use proper JWT
      const token = await this.userAuthentication.generatePasswordResetToken(targetUserId);
      return stryMutAct_9fa48("447") ? {} : (stryCov_9fa48("447"), {
        token,
        expiresAt: new Date(stryMutAct_9fa48("448") ? Date.now() - 3600000 : (stryCov_9fa48("448"), Date.now() + 3600000)),
        // 1 hour
        targetUserId,
        adminId,
        restrictions: stryMutAct_9fa48("449") ? [] : (stryCov_9fa48("449"), [stryMutAct_9fa48("450") ? "" : (stryCov_9fa48("450"), 'read-only'), stryMutAct_9fa48("451") ? "" : (stryCov_9fa48("451"), 'no-admin-actions')])
      });
    }
  }

  // Bulk operations - these would be implemented by separate bulk services
  // For now, we'll provide simplified implementations

  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto) {
    if (stryMutAct_9fa48("452")) {
      {}
    } else {
      stryCov_9fa48("452");
      const {
        userIds
      } = bulkDeleteDto;
      let deletedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("453")) {
          {}
        } else {
          stryCov_9fa48("453");
          try {
            if (stryMutAct_9fa48("454")) {
              {}
            } else {
              stryCov_9fa48("454");
              await this.remove(userId);
              stryMutAct_9fa48("455") ? deletedCount-- : (stryCov_9fa48("455"), deletedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("456")) {
              {}
            } else {
              stryCov_9fa48("456");
              console.error(stryMutAct_9fa48("457") ? `` : (stryCov_9fa48("457"), `Failed to delete user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("458") ? "" : (stryCov_9fa48("458"), 'bulk_delete'), userIds, stryMutAct_9fa48("459") ? {} : (stryCov_9fa48("459"), {
        requestedCount: userIds.length,
        successCount: deletedCount
      }));
      return stryMutAct_9fa48("460") ? {} : (stryCov_9fa48("460"), {
        success: stryMutAct_9fa48("461") ? false : (stryCov_9fa48("461"), true),
        message: stryMutAct_9fa48("462") ? `` : (stryCov_9fa48("462"), `Successfully deleted ${deletedCount} out of ${userIds.length} users`),
        affectedCount: deletedCount
      });
    }
  }
  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    if (stryMutAct_9fa48("463")) {
      {}
    } else {
      stryCov_9fa48("463");
      const {
        userIds,
        role
      } = bulkUpdateRoleDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("464")) {
          {}
        } else {
          stryCov_9fa48("464");
          try {
            if (stryMutAct_9fa48("465")) {
              {}
            } else {
              stryCov_9fa48("465");
              await this.update(userId, stryMutAct_9fa48("466") ? {} : (stryCov_9fa48("466"), {
                role
              }));
              stryMutAct_9fa48("467") ? updatedCount-- : (stryCov_9fa48("467"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("468")) {
              {}
            } else {
              stryCov_9fa48("468");
              console.error(stryMutAct_9fa48("469") ? `` : (stryCov_9fa48("469"), `Failed to update role for user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("470") ? "" : (stryCov_9fa48("470"), 'bulk_update_role'), userIds, stryMutAct_9fa48("471") ? {} : (stryCov_9fa48("471"), {
        newRole: role,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("472") ? {} : (stryCov_9fa48("472"), {
        success: stryMutAct_9fa48("473") ? false : (stryCov_9fa48("473"), true),
        message: stryMutAct_9fa48("474") ? `` : (stryCov_9fa48("474"), `Successfully updated role for ${updatedCount} out of ${userIds.length} users`),
        affectedCount: updatedCount
      });
    }
  }
  async bulkUpdateStatus(bulkUpdateStatusDto: BulkUpdateStatusDto) {
    if (stryMutAct_9fa48("475")) {
      {}
    } else {
      stryCov_9fa48("475");
      const {
        userIds,
        status
      } = bulkUpdateStatusDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("476")) {
          {}
        } else {
          stryCov_9fa48("476");
          try {
            if (stryMutAct_9fa48("477")) {
              {}
            } else {
              stryCov_9fa48("477");
              await this.update(userId, stryMutAct_9fa48("478") ? {} : (stryCov_9fa48("478"), {
                status
              }));
              stryMutAct_9fa48("479") ? updatedCount-- : (stryCov_9fa48("479"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("480")) {
              {}
            } else {
              stryCov_9fa48("480");
              console.error(stryMutAct_9fa48("481") ? `` : (stryCov_9fa48("481"), `Failed to update status for user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("482") ? "" : (stryCov_9fa48("482"), 'bulk_update_status'), userIds, stryMutAct_9fa48("483") ? {} : (stryCov_9fa48("483"), {
        newStatus: status,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("484") ? {} : (stryCov_9fa48("484"), {
        success: stryMutAct_9fa48("485") ? false : (stryCov_9fa48("485"), true),
        message: stryMutAct_9fa48("486") ? `` : (stryCov_9fa48("486"), `Successfully updated status for ${updatedCount} out of ${userIds.length} users`),
        affectedCount: updatedCount
      });
    }
  }
  async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    if (stryMutAct_9fa48("487")) {
      {}
    } else {
      stryCov_9fa48("487");
      const {
        userId,
        sendEmail = stryMutAct_9fa48("488") ? false : (stryCov_9fa48("488"), true)
      } = resetPasswordDto;

      // Generate temporary password
      const tempPassword = stryMutAct_9fa48("489") ? Math.random().toString(36) : (stryCov_9fa48("489"), Math.random().toString(36).slice(stryMutAct_9fa48("490") ? +8 : (stryCov_9fa48("490"), -8)));

      // Hash and update password
      const hashedPassword = await this.userAuthentication.hashPassword(tempPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
      let emailSent = stryMutAct_9fa48("491") ? true : (stryCov_9fa48("491"), false);
      if (stryMutAct_9fa48("493") ? false : stryMutAct_9fa48("492") ? true : (stryCov_9fa48("492", "493"), sendEmail)) {
        if (stryMutAct_9fa48("494")) {
          {}
        } else {
          stryCov_9fa48("494");
          try {
            if (stryMutAct_9fa48("495")) {
              {}
            } else {
              stryCov_9fa48("495");
              await this.notificationService.createNotification(stryMutAct_9fa48("496") ? {} : (stryCov_9fa48("496"), {
                userId,
                message: stryMutAct_9fa48("497") ? `` : (stryCov_9fa48("497"), `Your password has been reset. Your temporary password is: ${tempPassword}`),
                type: stryMutAct_9fa48("498") ? "" : (stryCov_9fa48("498"), 'warning')
              }));
              emailSent = stryMutAct_9fa48("499") ? false : (stryCov_9fa48("499"), true);
            }
          } catch (error) {
            if (stryMutAct_9fa48("500")) {
              {}
            } else {
              stryCov_9fa48("500");
              console.error(stryMutAct_9fa48("501") ? "" : (stryCov_9fa48("501"), 'Failed to send password reset email:'), error);
            }
          }
        }
      }
      return stryMutAct_9fa48("502") ? {} : (stryCov_9fa48("502"), {
        success: stryMutAct_9fa48("503") ? false : (stryCov_9fa48("503"), true),
        message: emailSent ? stryMutAct_9fa48("504") ? "" : (stryCov_9fa48("504"), 'Password reset email sent') : stryMutAct_9fa48("505") ? "" : (stryCov_9fa48("505"), 'Password reset completed'),
        tempPassword: emailSent ? undefined : tempPassword,
        emailSent
      });
    }
  }
}