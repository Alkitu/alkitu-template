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
    if (stryMutAct_9fa48("219")) {
      {}
    } else {
      stryCov_9fa48("219");
      const {
        password,
        ...userData
      } = createUserDto;

      // Hash password using authentication service
      const hashedPassword = await this.userAuthentication.hashPassword(password);

      // Create user using repository service
      const user = await this.userRepository.create(stryMutAct_9fa48("220") ? {} : (stryCov_9fa48("220"), {
        ...userData,
        password: hashedPassword
      }));

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("222") ? false : stryMutAct_9fa48("221") ? true : (stryCov_9fa48("221", "222"), fullUser)) {
        if (stryMutAct_9fa48("223")) {
          {}
        } else {
          stryCov_9fa48("223");
          // Publish user created event
          await this.userEvents.publishUserCreated(fullUser);
        }
      }

      // Create welcome notification (optional, don't fail if it fails)
      try {
        if (stryMutAct_9fa48("224")) {
          {}
        } else {
          stryCov_9fa48("224");
          await this.notificationService.createNotification(stryMutAct_9fa48("225") ? {} : (stryCov_9fa48("225"), {
            userId: user.id,
            message: stryMutAct_9fa48("226") ? `` : (stryCov_9fa48("226"), `Welcome to Alkitu, ${stryMutAct_9fa48("229") ? user.name && user.email : stryMutAct_9fa48("228") ? false : stryMutAct_9fa48("227") ? true : (stryCov_9fa48("227", "228", "229"), user.name || user.email)}!`),
            type: stryMutAct_9fa48("230") ? "" : (stryCov_9fa48("230"), 'info'),
            link: stryMutAct_9fa48("231") ? "" : (stryCov_9fa48("231"), '/dashboard')
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("232")) {
          {}
        } else {
          stryCov_9fa48("232");
          const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("233") ? "" : (stryCov_9fa48("233"), 'Unknown error');
          console.log(stryMutAct_9fa48("234") ? "" : (stryCov_9fa48("234"), 'Warning: Could not create welcome notification:'), errorMessage);
        }
      }
      return user;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAll() {
    if (stryMutAct_9fa48("235")) {
      {}
    } else {
      stryCov_9fa48("235");
      return this.userRepository.findAll();
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findAllWithFilters(filterDto: FilterUsersDto) {
    if (stryMutAct_9fa48("236")) {
      {}
    } else {
      stryCov_9fa48("236");
      return this.userRepository.findAllWithFilters(filterDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findOne(id: string) {
    if (stryMutAct_9fa48("237")) {
      {}
    } else {
      stryCov_9fa48("237");
      return this.userRepository.findById(id);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async findByEmail(email: string) {
    if (stryMutAct_9fa48("238")) {
      {}
    } else {
      stryCov_9fa48("238");
      return this.userRepository.findByEmail(email);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (stryMutAct_9fa48("239")) {
      {}
    } else {
      stryCov_9fa48("239");
      // Get previous data for events
      const previousUser = await this.userRepository.findById(id);

      // Check if user exists
      if (stryMutAct_9fa48("242") ? false : stryMutAct_9fa48("241") ? true : stryMutAct_9fa48("240") ? previousUser : (stryCov_9fa48("240", "241", "242"), !previousUser)) {
        if (stryMutAct_9fa48("243")) {
          {}
        } else {
          stryCov_9fa48("243");
          throw new Error(stryMutAct_9fa48("244") ? "" : (stryCov_9fa48("244"), 'User not found'));
        }
      }

      // Update user
      const updatedUser = await this.userRepository.update(id, updateUserDto);

      // Get full user data for events
      const fullUser = await this.userRepository.findByEmail(updatedUser.email);
      if (stryMutAct_9fa48("247") ? fullUser || previousUser : stryMutAct_9fa48("246") ? false : stryMutAct_9fa48("245") ? true : (stryCov_9fa48("245", "246", "247"), fullUser && previousUser)) {
        if (stryMutAct_9fa48("248")) {
          {}
        } else {
          stryCov_9fa48("248");
          // Publish user updated event - convert UserResponse to User for events
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("249") ? {} : (stryCov_9fa48("249"), {
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
    if (stryMutAct_9fa48("250")) {
      {}
    } else {
      stryCov_9fa48("250");
      return this.userRepository.updateTags(id, updateUserTagsDto);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async remove(id: string) {
    if (stryMutAct_9fa48("251")) {
      {}
    } else {
      stryCov_9fa48("251");
      // Get user data before deletion for events
      const user = await this.userRepository.findById(id);

      // Check if user exists
      if (stryMutAct_9fa48("254") ? false : stryMutAct_9fa48("253") ? true : stryMutAct_9fa48("252") ? user : (stryCov_9fa48("252", "253", "254"), !user)) {
        if (stryMutAct_9fa48("255")) {
          {}
        } else {
          stryCov_9fa48("255");
          throw new Error(stryMutAct_9fa48("256") ? "" : (stryCov_9fa48("256"), 'User not found'));
        }
      }

      // Delete user
      await this.userRepository.delete(id);

      // Publish user deleted event
      await this.userEvents.publishUserDeleted(id, stryMutAct_9fa48("257") ? {} : (stryCov_9fa48("257"), {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        contactNumber: user.contactNumber
      }));

      // Return success message for backward compatibility
      return stryMutAct_9fa48("258") ? {} : (stryCov_9fa48("258"), {
        message: stryMutAct_9fa48("259") ? "" : (stryCov_9fa48("259"), 'User deleted successfully')
      });
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async validateUser(loginDto: LoginUserDto) {
    if (stryMutAct_9fa48("260")) {
      {}
    } else {
      stryCov_9fa48("260");
      const authenticatedUser = await this.userAuthentication.validateUser(loginDto);
      if (stryMutAct_9fa48("262") ? false : stryMutAct_9fa48("261") ? true : (stryCov_9fa48("261", "262"), authenticatedUser)) {
        if (stryMutAct_9fa48("263")) {
          {}
        } else {
          stryCov_9fa48("263");
          // Publish login event
          await this.userEvents.publishUserLoggedIn(authenticatedUser.id);
        }
      }
      return authenticatedUser;
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService
  async updatePassword(id: string, hashedPassword: string) {
    if (stryMutAct_9fa48("264")) {
      {}
    } else {
      stryCov_9fa48("264");
      return this.userRepository.updatePassword(id, hashedPassword);
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService + UserEventsService
  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    if (stryMutAct_9fa48("265")) {
      {}
    } else {
      stryCov_9fa48("265");
      await this.userAuthentication.changePassword(id, changePasswordDto);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(id);
      return stryMutAct_9fa48("266") ? {} : (stryCov_9fa48("266"), {
        message: stryMutAct_9fa48("267") ? "" : (stryCov_9fa48("267"), 'Password changed successfully')
      });
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async markEmailAsVerified(id: string) {
    if (stryMutAct_9fa48("268")) {
      {}
    } else {
      stryCov_9fa48("268");
      const result = await this.userRepository.markEmailAsVerified(id);

      // Publish email verified event
      await this.userEvents.publishUserEmailVerified(id);
      return result;
    }
  }

  // ✅ SRP: Delegates to UserAnalyticsService
  async getUserStats() {
    if (stryMutAct_9fa48("269")) {
      {}
    } else {
      stryCov_9fa48("269");
      return this.userAnalytics.getUserStats();
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async adminChangePassword(userId: string, newPassword: string) {
    if (stryMutAct_9fa48("270")) {
      {}
    } else {
      stryCov_9fa48("270");
      const hashedPassword = await this.userAuthentication.hashPassword(newPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
    }
  }

  // ✅ SRP: Delegates to UserRepositoryService + UserEventsService
  async anonymizeUser(userId: string) {
    if (stryMutAct_9fa48("271")) {
      {}
    } else {
      stryCov_9fa48("271");
      const anonymizedData = stryMutAct_9fa48("272") ? {} : (stryCov_9fa48("272"), {
        name: stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), 'Anonymous User'),
        lastName: stryMutAct_9fa48("274") ? "" : (stryCov_9fa48("274"), 'Anonymous'),
        email: stryMutAct_9fa48("275") ? `` : (stryCov_9fa48("275"), `anonymous_${userId}@example.com`),
        contactNumber: undefined // Use undefined instead of null for UpdateUserDto
      });
      const user = await this.userRepository.update(userId, anonymizedData);

      // Publish user updated event
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("277") ? false : stryMutAct_9fa48("276") ? true : (stryCov_9fa48("276", "277"), fullUser)) {
        if (stryMutAct_9fa48("278")) {
          {}
        } else {
          stryCov_9fa48("278");
          await this.userEvents.publishUserUpdated(fullUser, stryMutAct_9fa48("279") ? {} : (stryCov_9fa48("279"), {
            id: userId
          }));
        }
      }
      return stryMutAct_9fa48("280") ? {} : (stryCov_9fa48("280"), {
        success: stryMutAct_9fa48("281") ? false : (stryCov_9fa48("281"), true),
        userId,
        anonymizedFields: Object.keys(anonymizedData),
        retainedFields: stryMutAct_9fa48("282") ? [] : (stryCov_9fa48("282"), [stryMutAct_9fa48("283") ? "" : (stryCov_9fa48("283"), 'id'), stryMutAct_9fa48("284") ? "" : (stryCov_9fa48("284"), 'role'), stryMutAct_9fa48("285") ? "" : (stryCov_9fa48("285"), 'createdAt')]),
        timestamp: new Date()
      });
    }
  }

  // ✅ SRP: Delegates to NotificationService
  async sendMessageToUser(userId: string, message: string) {
    if (stryMutAct_9fa48("286")) {
      {}
    } else {
      stryCov_9fa48("286");
      try {
        if (stryMutAct_9fa48("287")) {
          {}
        } else {
          stryCov_9fa48("287");
          await this.notificationService.createNotification(stryMutAct_9fa48("288") ? {} : (stryCov_9fa48("288"), {
            userId,
            message,
            type: stryMutAct_9fa48("289") ? "" : (stryCov_9fa48("289"), 'info')
          }));
          return stryMutAct_9fa48("290") ? {} : (stryCov_9fa48("290"), {
            success: stryMutAct_9fa48("291") ? false : (stryCov_9fa48("291"), true),
            message: stryMutAct_9fa48("292") ? "" : (stryCov_9fa48("292"), 'Message sent successfully')
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("293")) {
          {}
        } else {
          stryCov_9fa48("293");
          const errorMessage = error instanceof Error ? error.message : stryMutAct_9fa48("294") ? "" : (stryCov_9fa48("294"), 'Unknown error');
          return stryMutAct_9fa48("295") ? {} : (stryCov_9fa48("295"), {
            success: stryMutAct_9fa48("296") ? true : (stryCov_9fa48("296"), false),
            message: stryMutAct_9fa48("297") ? `` : (stryCov_9fa48("297"), `Failed to send message: ${errorMessage}`)
          });
        }
      }
    }
  }

  // ✅ SRP: Delegates to UserAuthenticationService
  async createImpersonationToken(adminId: string, targetUserId: string) {
    if (stryMutAct_9fa48("298")) {
      {}
    } else {
      stryCov_9fa48("298");
      // Simplified implementation - in production, use proper JWT
      const token = await this.userAuthentication.generatePasswordResetToken(targetUserId);
      return stryMutAct_9fa48("299") ? {} : (stryCov_9fa48("299"), {
        token,
        expiresAt: new Date(stryMutAct_9fa48("300") ? Date.now() - 3600000 : (stryCov_9fa48("300"), Date.now() + 3600000)),
        // 1 hour
        targetUserId,
        adminId,
        restrictions: stryMutAct_9fa48("301") ? [] : (stryCov_9fa48("301"), [stryMutAct_9fa48("302") ? "" : (stryCov_9fa48("302"), 'read-only'), stryMutAct_9fa48("303") ? "" : (stryCov_9fa48("303"), 'no-admin-actions')])
      });
    }
  }

  // Bulk operations - these would be implemented by separate bulk services
  // For now, we'll provide simplified implementations

  async bulkDeleteUsers(bulkDeleteDto: BulkDeleteUsersDto) {
    if (stryMutAct_9fa48("304")) {
      {}
    } else {
      stryCov_9fa48("304");
      const {
        userIds
      } = bulkDeleteDto;
      let deletedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("305")) {
          {}
        } else {
          stryCov_9fa48("305");
          try {
            if (stryMutAct_9fa48("306")) {
              {}
            } else {
              stryCov_9fa48("306");
              await this.remove(userId);
              stryMutAct_9fa48("307") ? deletedCount-- : (stryCov_9fa48("307"), deletedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("308")) {
              {}
            } else {
              stryCov_9fa48("308");
              console.error(stryMutAct_9fa48("309") ? `` : (stryCov_9fa48("309"), `Failed to delete user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("310") ? "" : (stryCov_9fa48("310"), 'bulk_delete'), userIds, stryMutAct_9fa48("311") ? {} : (stryCov_9fa48("311"), {
        requestedCount: userIds.length,
        successCount: deletedCount
      }));
      return stryMutAct_9fa48("312") ? {} : (stryCov_9fa48("312"), {
        success: stryMutAct_9fa48("313") ? false : (stryCov_9fa48("313"), true),
        message: stryMutAct_9fa48("314") ? `` : (stryCov_9fa48("314"), `Successfully deleted ${deletedCount} out of ${userIds.length} users`),
        affectedCount: deletedCount
      });
    }
  }
  async bulkUpdateRole(bulkUpdateRoleDto: BulkUpdateRoleDto) {
    if (stryMutAct_9fa48("315")) {
      {}
    } else {
      stryCov_9fa48("315");
      const {
        userIds,
        role
      } = bulkUpdateRoleDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("316")) {
          {}
        } else {
          stryCov_9fa48("316");
          try {
            if (stryMutAct_9fa48("317")) {
              {}
            } else {
              stryCov_9fa48("317");
              await this.update(userId, stryMutAct_9fa48("318") ? {} : (stryCov_9fa48("318"), {
                role
              }));
              stryMutAct_9fa48("319") ? updatedCount-- : (stryCov_9fa48("319"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("320")) {
              {}
            } else {
              stryCov_9fa48("320");
              console.error(stryMutAct_9fa48("321") ? `` : (stryCov_9fa48("321"), `Failed to update role for user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("322") ? "" : (stryCov_9fa48("322"), 'bulk_update_role'), userIds, stryMutAct_9fa48("323") ? {} : (stryCov_9fa48("323"), {
        newRole: role,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("324") ? {} : (stryCov_9fa48("324"), {
        success: stryMutAct_9fa48("325") ? false : (stryCov_9fa48("325"), true),
        message: stryMutAct_9fa48("326") ? `` : (stryCov_9fa48("326"), `Successfully updated role for ${updatedCount} out of ${userIds.length} users`),
        affectedCount: updatedCount
      });
    }
  }
  async bulkUpdateStatus(bulkUpdateStatusDto: BulkUpdateStatusDto) {
    if (stryMutAct_9fa48("327")) {
      {}
    } else {
      stryCov_9fa48("327");
      const {
        userIds,
        status
      } = bulkUpdateStatusDto;
      let updatedCount = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("328")) {
          {}
        } else {
          stryCov_9fa48("328");
          try {
            if (stryMutAct_9fa48("329")) {
              {}
            } else {
              stryCov_9fa48("329");
              await this.update(userId, stryMutAct_9fa48("330") ? {} : (stryCov_9fa48("330"), {
                status
              }));
              stryMutAct_9fa48("331") ? updatedCount-- : (stryCov_9fa48("331"), updatedCount++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("332")) {
              {}
            } else {
              stryCov_9fa48("332");
              console.error(stryMutAct_9fa48("333") ? `` : (stryCov_9fa48("333"), `Failed to update status for user ${userId}:`), error);
            }
          }
        }
      }

      // Publish bulk operation event
      await this.userEvents.publishUserBulkOperation(stryMutAct_9fa48("334") ? "" : (stryCov_9fa48("334"), 'bulk_update_status'), userIds, stryMutAct_9fa48("335") ? {} : (stryCov_9fa48("335"), {
        newStatus: status,
        requestedCount: userIds.length,
        successCount: updatedCount
      }));
      return stryMutAct_9fa48("336") ? {} : (stryCov_9fa48("336"), {
        success: stryMutAct_9fa48("337") ? false : (stryCov_9fa48("337"), true),
        message: stryMutAct_9fa48("338") ? `` : (stryCov_9fa48("338"), `Successfully updated status for ${updatedCount} out of ${userIds.length} users`),
        affectedCount: updatedCount
      });
    }
  }
  async resetUserPassword(resetPasswordDto: ResetPasswordDto) {
    if (stryMutAct_9fa48("339")) {
      {}
    } else {
      stryCov_9fa48("339");
      const {
        userId,
        sendEmail = stryMutAct_9fa48("340") ? false : (stryCov_9fa48("340"), true)
      } = resetPasswordDto;

      // Generate temporary password
      const tempPassword = stryMutAct_9fa48("341") ? Math.random().toString(36) : (stryCov_9fa48("341"), Math.random().toString(36).slice(stryMutAct_9fa48("342") ? +8 : (stryCov_9fa48("342"), -8)));

      // Hash and update password
      const hashedPassword = await this.userAuthentication.hashPassword(tempPassword);
      await this.userRepository.updatePassword(userId, hashedPassword);

      // Publish password changed event
      await this.userEvents.publishUserPasswordChanged(userId);
      let emailSent = stryMutAct_9fa48("343") ? true : (stryCov_9fa48("343"), false);
      if (stryMutAct_9fa48("345") ? false : stryMutAct_9fa48("344") ? true : (stryCov_9fa48("344", "345"), sendEmail)) {
        if (stryMutAct_9fa48("346")) {
          {}
        } else {
          stryCov_9fa48("346");
          try {
            if (stryMutAct_9fa48("347")) {
              {}
            } else {
              stryCov_9fa48("347");
              await this.notificationService.createNotification(stryMutAct_9fa48("348") ? {} : (stryCov_9fa48("348"), {
                userId,
                message: stryMutAct_9fa48("349") ? `` : (stryCov_9fa48("349"), `Your password has been reset. Your temporary password is: ${tempPassword}`),
                type: stryMutAct_9fa48("350") ? "" : (stryCov_9fa48("350"), 'warning')
              }));
              emailSent = stryMutAct_9fa48("351") ? false : (stryCov_9fa48("351"), true);
            }
          } catch (error) {
            if (stryMutAct_9fa48("352")) {
              {}
            } else {
              stryCov_9fa48("352");
              console.error(stryMutAct_9fa48("353") ? "" : (stryCov_9fa48("353"), 'Failed to send password reset email:'), error);
            }
          }
        }
      }
      return stryMutAct_9fa48("354") ? {} : (stryCov_9fa48("354"), {
        success: stryMutAct_9fa48("355") ? false : (stryCov_9fa48("355"), true),
        message: emailSent ? stryMutAct_9fa48("356") ? "" : (stryCov_9fa48("356"), 'Password reset email sent') : stryMutAct_9fa48("357") ? "" : (stryCov_9fa48("357"), 'Password reset completed'),
        tempPassword: emailSent ? undefined : tempPassword,
        emailSent
      });
    }
  }
}