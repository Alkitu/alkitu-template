// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - Authentication Logic Only
// packages/api/src/users/services/user-authentication.service.ts
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
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from '../dto/login-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { IUserAuthentication, AuthenticatedUser } from '../interfaces/user-authentication.interface';
import { UserRepositoryService } from './user-repository.service';
@Injectable()
export class UserAuthenticationService implements IUserAuthentication {
  constructor(private userRepository: UserRepositoryService) {}
  async validateUser(loginDto: LoginUserDto): Promise<AuthenticatedUser | null> {
    if (stryMutAct_9fa48("210")) {
      {}
    } else {
      stryCov_9fa48("210");
      const {
        email,
        password
      } = loginDto;

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (stryMutAct_9fa48("213") ? false : stryMutAct_9fa48("212") ? true : stryMutAct_9fa48("211") ? user : (stryCov_9fa48("211", "212", "213"), !user)) {
        if (stryMutAct_9fa48("214")) {
          {}
        } else {
          stryCov_9fa48("214");
          return null;
        }
      }

      // Validate password
      if (stryMutAct_9fa48("217") ? false : stryMutAct_9fa48("216") ? true : stryMutAct_9fa48("215") ? user.password : (stryCov_9fa48("215", "216", "217"), !user.password)) {
        if (stryMutAct_9fa48("218")) {
          {}
        } else {
          stryCov_9fa48("218");
          return null;
        }
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (stryMutAct_9fa48("221") ? false : stryMutAct_9fa48("220") ? true : stryMutAct_9fa48("219") ? isPasswordValid : (stryCov_9fa48("219", "220", "221"), !isPasswordValid)) {
        if (stryMutAct_9fa48("222")) {
          {}
        } else {
          stryCov_9fa48("222");
          return null;
        }
      }

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Return authenticated user (without password)
      return stryMutAct_9fa48("223") ? {} : (stryCov_9fa48("223"), {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        contactNumber: user.contactNumber,
        role: user.role,
        createdAt: user.createdAt,
        lastLogin: new Date(),
        emailVerified: user.emailVerified
      });
    }
  }
  async validatePassword(userId: string, password: string): Promise<boolean> {
    if (stryMutAct_9fa48("224")) {
      {}
    } else {
      stryCov_9fa48("224");
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("227") ? false : stryMutAct_9fa48("226") ? true : stryMutAct_9fa48("225") ? user : (stryCov_9fa48("225", "226", "227"), !user)) {
        if (stryMutAct_9fa48("228")) {
          {}
        } else {
          stryCov_9fa48("228");
          return stryMutAct_9fa48("229") ? true : (stryCov_9fa48("229"), false);
        }
      }
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("232") ? !fullUser && !fullUser.password : stryMutAct_9fa48("231") ? false : stryMutAct_9fa48("230") ? true : (stryCov_9fa48("230", "231", "232"), (stryMutAct_9fa48("233") ? fullUser : (stryCov_9fa48("233"), !fullUser)) || (stryMutAct_9fa48("234") ? fullUser.password : (stryCov_9fa48("234"), !fullUser.password)))) {
        if (stryMutAct_9fa48("235")) {
          {}
        } else {
          stryCov_9fa48("235");
          return stryMutAct_9fa48("236") ? true : (stryCov_9fa48("236"), false);
        }
      }
      return await bcrypt.compare(password, fullUser.password);
    }
  }
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    if (stryMutAct_9fa48("237")) {
      {}
    } else {
      stryCov_9fa48("237");
      const {
        currentPassword,
        newPassword
      } = changePasswordDto;

      // Find user
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("240") ? false : stryMutAct_9fa48("239") ? true : stryMutAct_9fa48("238") ? user : (stryCov_9fa48("238", "239", "240"), !user)) {
        if (stryMutAct_9fa48("241")) {
          {}
        } else {
          stryCov_9fa48("241");
          throw new NotFoundException(stryMutAct_9fa48("242") ? `` : (stryCov_9fa48("242"), `User with ID ${userId} not found`));
        }
      }

      // Get full user data to validate current password
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("245") ? false : stryMutAct_9fa48("244") ? true : stryMutAct_9fa48("243") ? fullUser : (stryCov_9fa48("243", "244", "245"), !fullUser)) {
        if (stryMutAct_9fa48("246")) {
          {}
        } else {
          stryCov_9fa48("246");
          throw new NotFoundException(stryMutAct_9fa48("247") ? `` : (stryCov_9fa48("247"), `User with ID ${userId} not found`));
        }
      }

      // Validate current password
      if (stryMutAct_9fa48("250") ? false : stryMutAct_9fa48("249") ? true : stryMutAct_9fa48("248") ? fullUser.password : (stryCov_9fa48("248", "249", "250"), !fullUser.password)) {
        if (stryMutAct_9fa48("251")) {
          {}
        } else {
          stryCov_9fa48("251");
          throw new UnauthorizedException(stryMutAct_9fa48("252") ? "" : (stryCov_9fa48("252"), 'User password not found'));
        }
      }
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, fullUser.password);
      if (stryMutAct_9fa48("255") ? false : stryMutAct_9fa48("254") ? true : stryMutAct_9fa48("253") ? isCurrentPasswordValid : (stryCov_9fa48("253", "254", "255"), !isCurrentPasswordValid)) {
        if (stryMutAct_9fa48("256")) {
          {}
        } else {
          stryCov_9fa48("256");
          throw new UnauthorizedException(stryMutAct_9fa48("257") ? "" : (stryCov_9fa48("257"), 'Current password is incorrect'));
        }
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      await this.userRepository.updatePassword(userId, hashedNewPassword);
    }
  }
  async hashPassword(password: string): Promise<string> {
    if (stryMutAct_9fa48("258")) {
      {}
    } else {
      stryCov_9fa48("258");
      const saltRounds = parseInt(stryMutAct_9fa48("261") ? process.env.BCRYPT_SALT_ROUNDS && '12' : stryMutAct_9fa48("260") ? false : stryMutAct_9fa48("259") ? true : (stryCov_9fa48("259", "260", "261"), process.env.BCRYPT_SALT_ROUNDS || (stryMutAct_9fa48("262") ? "" : (stryCov_9fa48("262"), '12'))), 10);
      return bcrypt.hash(password, saltRounds);
    }
  }
  async generatePasswordResetToken(userId: string): Promise<string> {
    if (stryMutAct_9fa48("263")) {
      {}
    } else {
      stryCov_9fa48("263");
      // This would typically generate a JWT token or random token
      // For now, we'll return a simple token (in production, use proper JWT)
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("266") ? false : stryMutAct_9fa48("265") ? true : stryMutAct_9fa48("264") ? user : (stryCov_9fa48("264", "265", "266"), !user)) {
        if (stryMutAct_9fa48("267")) {
          {}
        } else {
          stryCov_9fa48("267");
          throw new NotFoundException(stryMutAct_9fa48("268") ? `` : (stryCov_9fa48("268"), `User with ID ${userId} not found`));
        }
      }

      // Generate a simple token (in production, use JWT with expiration)
      const token = Buffer.from(stryMutAct_9fa48("269") ? `` : (stryCov_9fa48("269"), `${userId}:${Date.now()}`)).toString(stryMutAct_9fa48("270") ? "" : (stryCov_9fa48("270"), 'base64'));
      return token;
    }
  }
  async validatePasswordResetToken(token: string): Promise<User | null> {
    if (stryMutAct_9fa48("271")) {
      {}
    } else {
      stryCov_9fa48("271");
      try {
        if (stryMutAct_9fa48("272")) {
          {}
        } else {
          stryCov_9fa48("272");
          // Decode token (in production, use proper JWT validation)
          const decoded = Buffer.from(token, stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), 'base64')).toString(stryMutAct_9fa48("274") ? "" : (stryCov_9fa48("274"), 'ascii'));
          const [userId, timestamp] = decoded.split(stryMutAct_9fa48("275") ? "" : (stryCov_9fa48("275"), ':'));

          // Check if token is not expired (1 hour = 3600000 ms)
          const tokenAge = stryMutAct_9fa48("276") ? Date.now() + parseInt(timestamp) : (stryCov_9fa48("276"), Date.now() - parseInt(timestamp));
          if (stryMutAct_9fa48("280") ? tokenAge <= 3600000 : stryMutAct_9fa48("279") ? tokenAge >= 3600000 : stryMutAct_9fa48("278") ? false : stryMutAct_9fa48("277") ? true : (stryCov_9fa48("277", "278", "279", "280"), tokenAge > 3600000)) {
            if (stryMutAct_9fa48("281")) {
              {}
            } else {
              stryCov_9fa48("281");
              return null;
            }
          }

          // Find and return user by ID (not email)
          const user = await this.userRepository.findById(userId);
          if (stryMutAct_9fa48("284") ? false : stryMutAct_9fa48("283") ? true : stryMutAct_9fa48("282") ? user : (stryCov_9fa48("282", "283", "284"), !user)) {
            if (stryMutAct_9fa48("285")) {
              {}
            } else {
              stryCov_9fa48("285");
              return null;
            }
          }

          // Get full user data
          return await this.userRepository.findByEmail(user.email);
        }
      } catch {
        if (stryMutAct_9fa48("286")) {
          {}
        } else {
          stryCov_9fa48("286");
          return null;
        }
      }
    }
  }
  async invalidateUserSessions(userId: string): Promise<void> {
    if (stryMutAct_9fa48("287")) {
      {}
    } else {
      stryCov_9fa48("287");
      // This would typically invalidate JWT tokens or session tokens
      // For now, we'll just verify the user exists
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("290") ? false : stryMutAct_9fa48("289") ? true : stryMutAct_9fa48("288") ? user : (stryCov_9fa48("288", "289", "290"), !user)) {
        if (stryMutAct_9fa48("291")) {
          {}
        } else {
          stryCov_9fa48("291");
          throw new NotFoundException(stryMutAct_9fa48("292") ? `` : (stryCov_9fa48("292"), `User with ID ${userId} not found`));
        }
      }

      // In a real implementation, you would:
      // 1. Add token to blacklist
      // 2. Update user's token version
      // 3. Clear session storage
      // 4. Notify other services

      console.log(stryMutAct_9fa48("293") ? `` : (stryCov_9fa48("293"), `Sessions invalidated for user ${userId}`));
    }
  }
}