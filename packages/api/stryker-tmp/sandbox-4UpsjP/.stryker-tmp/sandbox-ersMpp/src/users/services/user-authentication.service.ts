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
    if (stryMutAct_9fa48("3054")) {
      {}
    } else {
      stryCov_9fa48("3054");
      const {
        email,
        password
      } = loginDto;

      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      if (stryMutAct_9fa48("3057") ? false : stryMutAct_9fa48("3056") ? true : stryMutAct_9fa48("3055") ? user : (stryCov_9fa48("3055", "3056", "3057"), !user)) {
        if (stryMutAct_9fa48("3058")) {
          {}
        } else {
          stryCov_9fa48("3058");
          return null;
        }
      }

      // Validate password
      if (stryMutAct_9fa48("3061") ? false : stryMutAct_9fa48("3060") ? true : stryMutAct_9fa48("3059") ? user.password : (stryCov_9fa48("3059", "3060", "3061"), !user.password)) {
        if (stryMutAct_9fa48("3062")) {
          {}
        } else {
          stryCov_9fa48("3062");
          return null;
        }
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (stryMutAct_9fa48("3065") ? false : stryMutAct_9fa48("3064") ? true : stryMutAct_9fa48("3063") ? isPasswordValid : (stryCov_9fa48("3063", "3064", "3065"), !isPasswordValid)) {
        if (stryMutAct_9fa48("3066")) {
          {}
        } else {
          stryCov_9fa48("3066");
          return null;
        }
      }

      // Update last login
      await this.userRepository.updateLastLogin(user.id);

      // Return authenticated user (without password)
      return stryMutAct_9fa48("3067") ? {} : (stryCov_9fa48("3067"), {
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
    if (stryMutAct_9fa48("3068")) {
      {}
    } else {
      stryCov_9fa48("3068");
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("3071") ? false : stryMutAct_9fa48("3070") ? true : stryMutAct_9fa48("3069") ? user : (stryCov_9fa48("3069", "3070", "3071"), !user)) {
        if (stryMutAct_9fa48("3072")) {
          {}
        } else {
          stryCov_9fa48("3072");
          return stryMutAct_9fa48("3073") ? true : (stryCov_9fa48("3073"), false);
        }
      }
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("3076") ? !fullUser && !fullUser.password : stryMutAct_9fa48("3075") ? false : stryMutAct_9fa48("3074") ? true : (stryCov_9fa48("3074", "3075", "3076"), (stryMutAct_9fa48("3077") ? fullUser : (stryCov_9fa48("3077"), !fullUser)) || (stryMutAct_9fa48("3078") ? fullUser.password : (stryCov_9fa48("3078"), !fullUser.password)))) {
        if (stryMutAct_9fa48("3079")) {
          {}
        } else {
          stryCov_9fa48("3079");
          return stryMutAct_9fa48("3080") ? true : (stryCov_9fa48("3080"), false);
        }
      }
      return await bcrypt.compare(password, fullUser.password);
    }
  }
  async changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<void> {
    if (stryMutAct_9fa48("3081")) {
      {}
    } else {
      stryCov_9fa48("3081");
      const {
        currentPassword,
        newPassword
      } = changePasswordDto;

      // Find user
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("3084") ? false : stryMutAct_9fa48("3083") ? true : stryMutAct_9fa48("3082") ? user : (stryCov_9fa48("3082", "3083", "3084"), !user)) {
        if (stryMutAct_9fa48("3085")) {
          {}
        } else {
          stryCov_9fa48("3085");
          throw new NotFoundException(stryMutAct_9fa48("3086") ? `` : (stryCov_9fa48("3086"), `User with ID ${userId} not found`));
        }
      }

      // Get full user data to validate current password
      const fullUser = await this.userRepository.findByEmail(user.email);
      if (stryMutAct_9fa48("3089") ? false : stryMutAct_9fa48("3088") ? true : stryMutAct_9fa48("3087") ? fullUser : (stryCov_9fa48("3087", "3088", "3089"), !fullUser)) {
        if (stryMutAct_9fa48("3090")) {
          {}
        } else {
          stryCov_9fa48("3090");
          throw new NotFoundException(stryMutAct_9fa48("3091") ? `` : (stryCov_9fa48("3091"), `User with ID ${userId} not found`));
        }
      }

      // Validate current password
      if (stryMutAct_9fa48("3094") ? false : stryMutAct_9fa48("3093") ? true : stryMutAct_9fa48("3092") ? fullUser.password : (stryCov_9fa48("3092", "3093", "3094"), !fullUser.password)) {
        if (stryMutAct_9fa48("3095")) {
          {}
        } else {
          stryCov_9fa48("3095");
          throw new UnauthorizedException(stryMutAct_9fa48("3096") ? "" : (stryCov_9fa48("3096"), 'User password not found'));
        }
      }
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, fullUser.password);
      if (stryMutAct_9fa48("3099") ? false : stryMutAct_9fa48("3098") ? true : stryMutAct_9fa48("3097") ? isCurrentPasswordValid : (stryCov_9fa48("3097", "3098", "3099"), !isCurrentPasswordValid)) {
        if (stryMutAct_9fa48("3100")) {
          {}
        } else {
          stryCov_9fa48("3100");
          throw new UnauthorizedException(stryMutAct_9fa48("3101") ? "" : (stryCov_9fa48("3101"), 'Current password is incorrect'));
        }
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      await this.userRepository.updatePassword(userId, hashedNewPassword);
    }
  }
  async hashPassword(password: string): Promise<string> {
    if (stryMutAct_9fa48("3102")) {
      {}
    } else {
      stryCov_9fa48("3102");
      const saltRounds = parseInt(stryMutAct_9fa48("3105") ? process.env.BCRYPT_SALT_ROUNDS && '12' : stryMutAct_9fa48("3104") ? false : stryMutAct_9fa48("3103") ? true : (stryCov_9fa48("3103", "3104", "3105"), process.env.BCRYPT_SALT_ROUNDS || (stryMutAct_9fa48("3106") ? "" : (stryCov_9fa48("3106"), '12'))), 10);
      return bcrypt.hash(password, saltRounds);
    }
  }
  async generatePasswordResetToken(userId: string): Promise<string> {
    if (stryMutAct_9fa48("3107")) {
      {}
    } else {
      stryCov_9fa48("3107");
      // This would typically generate a JWT token or random token
      // For now, we'll return a simple token (in production, use proper JWT)
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("3110") ? false : stryMutAct_9fa48("3109") ? true : stryMutAct_9fa48("3108") ? user : (stryCov_9fa48("3108", "3109", "3110"), !user)) {
        if (stryMutAct_9fa48("3111")) {
          {}
        } else {
          stryCov_9fa48("3111");
          throw new NotFoundException(stryMutAct_9fa48("3112") ? `` : (stryCov_9fa48("3112"), `User with ID ${userId} not found`));
        }
      }

      // Generate a simple token (in production, use JWT with expiration)
      const token = Buffer.from(stryMutAct_9fa48("3113") ? `` : (stryCov_9fa48("3113"), `${userId}:${Date.now()}`)).toString(stryMutAct_9fa48("3114") ? "" : (stryCov_9fa48("3114"), 'base64'));
      return token;
    }
  }
  async validatePasswordResetToken(token: string): Promise<User | null> {
    if (stryMutAct_9fa48("3115")) {
      {}
    } else {
      stryCov_9fa48("3115");
      try {
        if (stryMutAct_9fa48("3116")) {
          {}
        } else {
          stryCov_9fa48("3116");
          // Decode token (in production, use proper JWT validation)
          const decoded = Buffer.from(token, stryMutAct_9fa48("3117") ? "" : (stryCov_9fa48("3117"), 'base64')).toString(stryMutAct_9fa48("3118") ? "" : (stryCov_9fa48("3118"), 'ascii'));
          const [userId, timestamp] = decoded.split(stryMutAct_9fa48("3119") ? "" : (stryCov_9fa48("3119"), ':'));

          // Check if token is not expired (1 hour = 3600000 ms)
          const tokenAge = Date.now() - parseInt(timestamp);
          if (stryMutAct_9fa48("3124") ? tokenAge <= 3600000 : stryMutAct_9fa48("3123") ? tokenAge >= 3600000 : stryMutAct_9fa48("3122") ? false : stryMutAct_9fa48("3121") ? true : (stryCov_9fa48("3121", "3122", "3123", "3124"), tokenAge > 3600000)) {
            if (stryMutAct_9fa48("3125")) {
              {}
            } else {
              stryCov_9fa48("3125");
              return null;
            }
          }

          // Find and return user by ID (not email)
          const user = await this.userRepository.findById(userId);
          if (stryMutAct_9fa48("3128") ? false : stryMutAct_9fa48("3127") ? true : stryMutAct_9fa48("3126") ? user : (stryCov_9fa48("3126", "3127", "3128"), !user)) {
            if (stryMutAct_9fa48("3129")) {
              {}
            } else {
              stryCov_9fa48("3129");
              return null;
            }
          }

          // Get full user data
          return await this.userRepository.findByEmail(user.email);
        }
      } catch {
        if (stryMutAct_9fa48("3130")) {
          {}
        } else {
          stryCov_9fa48("3130");
          return null;
        }
      }
    }
  }
  async invalidateUserSessions(userId: string): Promise<void> {
    if (stryMutAct_9fa48("3131")) {
      {}
    } else {
      stryCov_9fa48("3131");
      // This would typically invalidate JWT tokens or session tokens
      // For now, we'll just verify the user exists
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("3134") ? false : stryMutAct_9fa48("3133") ? true : stryMutAct_9fa48("3132") ? user : (stryCov_9fa48("3132", "3133", "3134"), !user)) {
        if (stryMutAct_9fa48("3135")) {
          {}
        } else {
          stryCov_9fa48("3135");
          throw new NotFoundException(stryMutAct_9fa48("3136") ? `` : (stryCov_9fa48("3136"), `User with ID ${userId} not found`));
        }
      }

      // In a real implementation, you would:
      // 1. Add token to blacklist
      // 2. Update user's token version
      // 3. Clear session storage
      // 4. Notify other services

      console.log(stryMutAct_9fa48("3137") ? `` : (stryCov_9fa48("3137"), `Sessions invalidated for user ${userId}`));
    }
  }
}