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
import { Injectable } from '@nestjs/common';
import { UserRole, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Define proper user data type
export interface UserData {
  id: string;
  email: string;
  name: string;
  lastName: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: Date | null;
  lastLogin: Date | null;
  twoFactorEnabled?: boolean;
}

// ✅ LSP: Base Authentication Interface
// All implementations must be substitutable without affecting correctness
export interface IAuthenticationService {
  validateCredentials(email: string, password: string): Promise<AuthenticationResult>;
  hashPassword(password: string): Promise<string>;
  comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
  generateToken(userId: string): Promise<string>;
  validateToken(token: string): Promise<TokenValidationResult>;
}

// ✅ LSP: Authentication Result Types
export interface AuthenticationResult {
  success: boolean;
  user?: UserAuthData;
  token?: string;
  message: string;
}
export interface TokenValidationResult {
  valid: boolean;
  userId?: string;
  expiresAt?: Date;
  message: string;
}
export interface UserAuthData {
  id: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  lastLogin: Date | null;
}

// ✅ LSP COMPLIANT: Base Authentication Service
// This can be substituted by any subclass without breaking functionality
@Injectable()
export abstract class BaseAuthenticationService implements IAuthenticationService {
  // ✅ LSP: Template method pattern - subclasses can override specific parts
  async validateCredentials(email: string, password: string): Promise<AuthenticationResult> {
    if (stryMutAct_9fa48("2525")) {
      {}
    } else {
      stryCov_9fa48("2525");
      try {
        if (stryMutAct_9fa48("2526")) {
          {}
        } else {
          stryCov_9fa48("2526");
          // Step 1: Find user (can be overridden by subclasses)
          const user = await this.findUserByEmail(email);
          if (stryMutAct_9fa48("2529") ? false : stryMutAct_9fa48("2528") ? true : stryMutAct_9fa48("2527") ? user : (stryCov_9fa48("2527", "2528", "2529"), !user)) {
            if (stryMutAct_9fa48("2530")) {
              {}
            } else {
              stryCov_9fa48("2530");
              return stryMutAct_9fa48("2531") ? {} : (stryCov_9fa48("2531"), {
                success: stryMutAct_9fa48("2532") ? true : (stryCov_9fa48("2532"), false),
                message: stryMutAct_9fa48("2533") ? "" : (stryCov_9fa48("2533"), 'Invalid credentials')
              });
            }
          }

          // Step 2: Check user status (can be overridden by subclasses)
          const statusCheck = await this.checkUserStatus(user);
          if (stryMutAct_9fa48("2536") ? false : stryMutAct_9fa48("2535") ? true : stryMutAct_9fa48("2534") ? statusCheck.allowed : (stryCov_9fa48("2534", "2535", "2536"), !statusCheck.allowed)) {
            if (stryMutAct_9fa48("2537")) {
              {}
            } else {
              stryCov_9fa48("2537");
              return stryMutAct_9fa48("2538") ? {} : (stryCov_9fa48("2538"), {
                success: stryMutAct_9fa48("2539") ? true : (stryCov_9fa48("2539"), false),
                message: statusCheck.reason
              });
            }
          }

          // Step 3: Validate password (can be overridden by subclasses)
          const passwordValid = await this.validatePassword(password, user.password);
          if (stryMutAct_9fa48("2542") ? false : stryMutAct_9fa48("2541") ? true : stryMutAct_9fa48("2540") ? passwordValid : (stryCov_9fa48("2540", "2541", "2542"), !passwordValid)) {
            if (stryMutAct_9fa48("2543")) {
              {}
            } else {
              stryCov_9fa48("2543");
              await this.handleFailedLogin(user.id);
              return stryMutAct_9fa48("2544") ? {} : (stryCov_9fa48("2544"), {
                success: stryMutAct_9fa48("2545") ? true : (stryCov_9fa48("2545"), false),
                message: stryMutAct_9fa48("2546") ? "" : (stryCov_9fa48("2546"), 'Invalid credentials')
              });
            }
          }

          // Step 4: Generate token (can be overridden by subclasses)
          const token = await this.generateToken(user.id);

          // Step 5: Update last login (can be overridden by subclasses)
          await this.updateLastLogin(user.id);
          return stryMutAct_9fa48("2547") ? {} : (stryCov_9fa48("2547"), {
            success: stryMutAct_9fa48("2548") ? false : (stryCov_9fa48("2548"), true),
            user: stryMutAct_9fa48("2549") ? {} : (stryCov_9fa48("2549"), {
              id: user.id,
              email: user.email,
              name: user.name,
              lastName: user.lastName,
              role: user.role,
              status: user.status,
              emailVerified: stryMutAct_9fa48("2552") ? user.emailVerified === null : stryMutAct_9fa48("2551") ? false : stryMutAct_9fa48("2550") ? true : (stryCov_9fa48("2550", "2551", "2552"), user.emailVerified !== null),
              lastLogin: new Date()
            }),
            token,
            message: stryMutAct_9fa48("2553") ? "" : (stryCov_9fa48("2553"), 'Authentication successful')
          });
        }
      } catch {
        if (stryMutAct_9fa48("2554")) {
          {}
        } else {
          stryCov_9fa48("2554");
          return stryMutAct_9fa48("2555") ? {} : (stryCov_9fa48("2555"), {
            success: stryMutAct_9fa48("2556") ? true : (stryCov_9fa48("2556"), false),
            message: stryMutAct_9fa48("2557") ? "" : (stryCov_9fa48("2557"), 'Authentication failed due to system error')
          });
        }
      }
    }
  }

  // ✅ LSP: Standard password hashing implementation
  async hashPassword(password: string): Promise<string> {
    if (stryMutAct_9fa48("2558")) {
      {}
    } else {
      stryCov_9fa48("2558");
      const saltRounds = 12;
      return await bcrypt.hash(password, saltRounds);
    }
  }

  // ✅ LSP: Standard password comparison implementation
  async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    if (stryMutAct_9fa48("2559")) {
      {}
    } else {
      stryCov_9fa48("2559");
      return await bcrypt.compare(plainPassword, hashedPassword);
    }
  }

  // ✅ LSP: Abstract methods that subclasses must implement
  abstract findUserByEmail(email: string): Promise<UserData | null>;
  abstract checkUserStatus(user: UserData): Promise<{
    allowed: boolean;
    reason: string;
  }>;
  abstract validatePassword(password: string, hashedPassword: string): Promise<boolean>;
  abstract generateToken(userId: string): Promise<string>;
  abstract validateToken(token: string): Promise<TokenValidationResult>;
  abstract handleFailedLogin(userId: string): Promise<void>;
  abstract updateLastLogin(userId: string): Promise<void>;
}

// ✅ LSP COMPLIANT: Standard Authentication Service
// Can be substituted for BaseAuthenticationService without issues
@Injectable()
export class StandardAuthenticationService extends BaseAuthenticationService {
  // ✅ LSP: Implements abstract methods maintaining contract
  async findUserByEmail(email: string): Promise<UserData | null> {
    if (stryMutAct_9fa48("2560")) {
      {}
    } else {
      stryCov_9fa48("2560");
      // Mock implementation - in real app would use repository
      if (stryMutAct_9fa48("2563") ? email !== 'test@example.com' : stryMutAct_9fa48("2562") ? false : stryMutAct_9fa48("2561") ? true : (stryCov_9fa48("2561", "2562", "2563"), email === (stryMutAct_9fa48("2564") ? "" : (stryCov_9fa48("2564"), 'test@example.com')))) {
        if (stryMutAct_9fa48("2565")) {
          {}
        } else {
          stryCov_9fa48("2565");
          return stryMutAct_9fa48("2566") ? {} : (stryCov_9fa48("2566"), {
            id: stryMutAct_9fa48("2567") ? "" : (stryCov_9fa48("2567"), '1'),
            email: stryMutAct_9fa48("2568") ? "" : (stryCov_9fa48("2568"), 'test@example.com'),
            name: stryMutAct_9fa48("2569") ? "" : (stryCov_9fa48("2569"), 'Test User'),
            lastName: stryMutAct_9fa48("2570") ? "" : (stryCov_9fa48("2570"), 'User'),
            password: await this.hashPassword(stryMutAct_9fa48("2571") ? "" : (stryCov_9fa48("2571"), 'password123')),
            role: UserRole.CLIENT,
            status: UserStatus.ACTIVE,
            emailVerified: new Date(),
            lastLogin: null
          });
        }
      }
      return null;
    }
  }
  checkUserStatus(user: UserData): Promise<{
    allowed: boolean;
    reason: string;
  }> {
    if (stryMutAct_9fa48("2572")) {
      {}
    } else {
      stryCov_9fa48("2572");
      if (stryMutAct_9fa48("2575") ? user.status !== UserStatus.SUSPENDED : stryMutAct_9fa48("2574") ? false : stryMutAct_9fa48("2573") ? true : (stryCov_9fa48("2573", "2574", "2575"), user.status === UserStatus.SUSPENDED)) {
        if (stryMutAct_9fa48("2576")) {
          {}
        } else {
          stryCov_9fa48("2576");
          return Promise.resolve(stryMutAct_9fa48("2577") ? {} : (stryCov_9fa48("2577"), {
            allowed: stryMutAct_9fa48("2578") ? true : (stryCov_9fa48("2578"), false),
            reason: stryMutAct_9fa48("2579") ? "" : (stryCov_9fa48("2579"), 'Account is suspended')
          }));
        }
      }
      if (stryMutAct_9fa48("2582") ? user.status !== UserStatus.ANONYMIZED : stryMutAct_9fa48("2581") ? false : stryMutAct_9fa48("2580") ? true : (stryCov_9fa48("2580", "2581", "2582"), user.status === UserStatus.ANONYMIZED)) {
        if (stryMutAct_9fa48("2583")) {
          {}
        } else {
          stryCov_9fa48("2583");
          return Promise.resolve(stryMutAct_9fa48("2584") ? {} : (stryCov_9fa48("2584"), {
            allowed: stryMutAct_9fa48("2585") ? true : (stryCov_9fa48("2585"), false),
            reason: stryMutAct_9fa48("2586") ? "" : (stryCov_9fa48("2586"), 'Account is deactivated')
          }));
        }
      }
      return Promise.resolve(stryMutAct_9fa48("2587") ? {} : (stryCov_9fa48("2587"), {
        allowed: stryMutAct_9fa48("2588") ? false : (stryCov_9fa48("2588"), true),
        reason: stryMutAct_9fa48("2589") ? "" : (stryCov_9fa48("2589"), 'Account is active')
      }));
    }
  }
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    if (stryMutAct_9fa48("2590")) {
      {}
    } else {
      stryCov_9fa48("2590");
      return await this.comparePassword(password, hashedPassword);
    }
  }
  generateToken(userId: string): Promise<string> {
    if (stryMutAct_9fa48("2591")) {
      {}
    } else {
      stryCov_9fa48("2591");
      // Mock implementation - in real app would use JWT
      const timestamp = Date.now();
      const token = Buffer.from(stryMutAct_9fa48("2592") ? `` : (stryCov_9fa48("2592"), `${userId}:${timestamp}`)).toString(stryMutAct_9fa48("2593") ? "" : (stryCov_9fa48("2593"), 'base64'));
      return Promise.resolve(token);
    }
  }
  validateToken(token: string): Promise<TokenValidationResult> {
    if (stryMutAct_9fa48("2594")) {
      {}
    } else {
      stryCov_9fa48("2594");
      try {
        if (stryMutAct_9fa48("2595")) {
          {}
        } else {
          stryCov_9fa48("2595");
          const decoded = Buffer.from(token, stryMutAct_9fa48("2596") ? "" : (stryCov_9fa48("2596"), 'base64')).toString();
          const [userId, timestamp] = decoded.split(stryMutAct_9fa48("2597") ? "" : (stryCov_9fa48("2597"), ':'));

          // Check if token is expired (24 hours)
          const tokenAge = Date.now() - parseInt(timestamp);
          const maxAge = 24 * 60 * 60 * 1000; // 24 hours

          if (stryMutAct_9fa48("2605") ? tokenAge <= maxAge : stryMutAct_9fa48("2604") ? tokenAge >= maxAge : stryMutAct_9fa48("2603") ? false : stryMutAct_9fa48("2602") ? true : (stryCov_9fa48("2602", "2603", "2604", "2605"), tokenAge > maxAge)) {
            if (stryMutAct_9fa48("2606")) {
              {}
            } else {
              stryCov_9fa48("2606");
              return Promise.resolve(stryMutAct_9fa48("2607") ? {} : (stryCov_9fa48("2607"), {
                valid: stryMutAct_9fa48("2608") ? true : (stryCov_9fa48("2608"), false),
                message: stryMutAct_9fa48("2609") ? "" : (stryCov_9fa48("2609"), 'Token has expired')
              }));
            }
          }
          return Promise.resolve(stryMutAct_9fa48("2610") ? {} : (stryCov_9fa48("2610"), {
            valid: stryMutAct_9fa48("2611") ? false : (stryCov_9fa48("2611"), true),
            userId,
            expiresAt: new Date(parseInt(timestamp) + maxAge),
            message: stryMutAct_9fa48("2613") ? "" : (stryCov_9fa48("2613"), 'Token is valid')
          }));
        }
      } catch {
        if (stryMutAct_9fa48("2614")) {
          {}
        } else {
          stryCov_9fa48("2614");
          return Promise.resolve(stryMutAct_9fa48("2615") ? {} : (stryCov_9fa48("2615"), {
            valid: stryMutAct_9fa48("2616") ? true : (stryCov_9fa48("2616"), false),
            message: stryMutAct_9fa48("2617") ? "" : (stryCov_9fa48("2617"), 'Invalid token format')
          }));
        }
      }
    }
  }
  handleFailedLogin(userId: string): Promise<void> {
    if (stryMutAct_9fa48("2618")) {
      {}
    } else {
      stryCov_9fa48("2618");
      // Mock implementation - in real app would track failed attempts
      console.log(stryMutAct_9fa48("2619") ? `` : (stryCov_9fa48("2619"), `Failed login attempt for user ${userId}`));
      return Promise.resolve();
    }
  }
  updateLastLogin(userId: string): Promise<void> {
    if (stryMutAct_9fa48("2620")) {
      {}
    } else {
      stryCov_9fa48("2620");
      // Mock implementation - in real app would update database
      console.log(stryMutAct_9fa48("2621") ? `` : (stryCov_9fa48("2621"), `Updated last login for user ${userId}`));
      return Promise.resolve();
    }
  }
}

// ✅ LSP COMPLIANT: Enhanced Authentication Service
// Can be substituted for BaseAuthenticationService, adds extra features
@Injectable()
export class EnhancedAuthenticationService extends BaseAuthenticationService {
  private failedAttempts = new Map<string, {
    count: number;
    lastAttempt: Date;
  }>();
  private readonly maxFailedAttempts = 5;
  private readonly lockoutDuration = 30 * 60 * 1000; // 30 minutes

  // ✅ LSP: Overrides base behavior while maintaining contract
  async validateCredentials(email: string, password: string): Promise<AuthenticationResult> {
    if (stryMutAct_9fa48("2624")) {
      {}
    } else {
      stryCov_9fa48("2624");
      // Check if account is locked
      if (stryMutAct_9fa48("2626") ? false : stryMutAct_9fa48("2625") ? true : (stryCov_9fa48("2625", "2626"), await this.isAccountLocked(email))) {
        if (stryMutAct_9fa48("2627")) {
          {}
        } else {
          stryCov_9fa48("2627");
          return stryMutAct_9fa48("2628") ? {} : (stryCov_9fa48("2628"), {
            success: stryMutAct_9fa48("2629") ? true : (stryCov_9fa48("2629"), false),
            message: stryMutAct_9fa48("2630") ? "" : (stryCov_9fa48("2630"), 'Account is temporarily locked due to too many failed attempts')
          });
        }
      }

      // Call parent implementation
      const result = await super.validateCredentials(email, password);

      // Reset failed attempts on successful login
      if (stryMutAct_9fa48("2632") ? false : stryMutAct_9fa48("2631") ? true : (stryCov_9fa48("2631", "2632"), result.success)) {
        if (stryMutAct_9fa48("2633")) {
          {}
        } else {
          stryCov_9fa48("2633");
          this.failedAttempts.delete(email);
        }
      }
      return result;
    }
  }
  async findUserByEmail(email: string): Promise<UserData | null> {
    if (stryMutAct_9fa48("2634")) {
      {}
    } else {
      stryCov_9fa48("2634");
      // Enhanced user lookup with additional fields
      if (stryMutAct_9fa48("2637") ? email !== 'admin@example.com' : stryMutAct_9fa48("2636") ? false : stryMutAct_9fa48("2635") ? true : (stryCov_9fa48("2635", "2636", "2637"), email === (stryMutAct_9fa48("2638") ? "" : (stryCov_9fa48("2638"), 'admin@example.com')))) {
        if (stryMutAct_9fa48("2639")) {
          {}
        } else {
          stryCov_9fa48("2639");
          return stryMutAct_9fa48("2640") ? {} : (stryCov_9fa48("2640"), {
            id: stryMutAct_9fa48("2641") ? "" : (stryCov_9fa48("2641"), '2'),
            email: stryMutAct_9fa48("2642") ? "" : (stryCov_9fa48("2642"), 'admin@example.com'),
            name: stryMutAct_9fa48("2643") ? "" : (stryCov_9fa48("2643"), 'Admin User'),
            lastName: stryMutAct_9fa48("2644") ? "" : (stryCov_9fa48("2644"), 'Administrator'),
            password: await this.hashPassword(stryMutAct_9fa48("2645") ? "" : (stryCov_9fa48("2645"), 'admin123')),
            role: UserRole.ADMIN,
            status: UserStatus.ACTIVE,
            emailVerified: new Date(),
            lastLogin: null,
            twoFactorEnabled: stryMutAct_9fa48("2646") ? false : (stryCov_9fa48("2646"), true)
          });
        }
      }
      if (stryMutAct_9fa48("2649") ? email !== 'test@example.com' : stryMutAct_9fa48("2648") ? false : stryMutAct_9fa48("2647") ? true : (stryCov_9fa48("2647", "2648", "2649"), email === (stryMutAct_9fa48("2650") ? "" : (stryCov_9fa48("2650"), 'test@example.com')))) {
        if (stryMutAct_9fa48("2651")) {
          {}
        } else {
          stryCov_9fa48("2651");
          return stryMutAct_9fa48("2652") ? {} : (stryCov_9fa48("2652"), {
            id: stryMutAct_9fa48("2653") ? "" : (stryCov_9fa48("2653"), '1'),
            email: stryMutAct_9fa48("2654") ? "" : (stryCov_9fa48("2654"), 'test@example.com'),
            name: stryMutAct_9fa48("2655") ? "" : (stryCov_9fa48("2655"), 'Test User'),
            lastName: stryMutAct_9fa48("2656") ? "" : (stryCov_9fa48("2656"), 'User'),
            password: await this.hashPassword(stryMutAct_9fa48("2657") ? "" : (stryCov_9fa48("2657"), 'password123')),
            role: UserRole.CLIENT,
            status: UserStatus.ACTIVE,
            emailVerified: new Date(),
            lastLogin: null,
            twoFactorEnabled: stryMutAct_9fa48("2658") ? true : (stryCov_9fa48("2658"), false)
          });
        }
      }
      return null;
    }
  }
  async checkUserStatus(user: UserData): Promise<{
    allowed: boolean;
    reason: string;
  }> {
    if (stryMutAct_9fa48("2659")) {
      {}
    } else {
      stryCov_9fa48("2659");
      // Enhanced status checking
      const baseCheck = await this.checkUserStatusBase(user);
      if (stryMutAct_9fa48("2662") ? false : stryMutAct_9fa48("2661") ? true : stryMutAct_9fa48("2660") ? baseCheck.allowed : (stryCov_9fa48("2660", "2661", "2662"), !baseCheck.allowed)) {
        if (stryMutAct_9fa48("2663")) {
          {}
        } else {
          stryCov_9fa48("2663");
          return baseCheck;
        }
      }

      // Additional checks for enhanced service
      if (stryMutAct_9fa48("2666") ? false : stryMutAct_9fa48("2665") ? true : stryMutAct_9fa48("2664") ? user.emailVerified : (stryCov_9fa48("2664", "2665", "2666"), !user.emailVerified)) {
        if (stryMutAct_9fa48("2667")) {
          {}
        } else {
          stryCov_9fa48("2667");
          return stryMutAct_9fa48("2668") ? {} : (stryCov_9fa48("2668"), {
            allowed: stryMutAct_9fa48("2669") ? true : (stryCov_9fa48("2669"), false),
            reason: stryMutAct_9fa48("2670") ? "" : (stryCov_9fa48("2670"), 'Email address not verified')
          });
        }
      }
      return stryMutAct_9fa48("2671") ? {} : (stryCov_9fa48("2671"), {
        allowed: stryMutAct_9fa48("2672") ? false : (stryCov_9fa48("2672"), true),
        reason: stryMutAct_9fa48("2673") ? "" : (stryCov_9fa48("2673"), 'Account is verified and active')
      });
    }
  }
  private checkUserStatusBase(user: UserData): Promise<{
    allowed: boolean;
    reason: string;
  }> {
    if (stryMutAct_9fa48("2674")) {
      {}
    } else {
      stryCov_9fa48("2674");
      if (stryMutAct_9fa48("2677") ? user.status !== UserStatus.SUSPENDED : stryMutAct_9fa48("2676") ? false : stryMutAct_9fa48("2675") ? true : (stryCov_9fa48("2675", "2676", "2677"), user.status === UserStatus.SUSPENDED)) {
        if (stryMutAct_9fa48("2678")) {
          {}
        } else {
          stryCov_9fa48("2678");
          return Promise.resolve(stryMutAct_9fa48("2679") ? {} : (stryCov_9fa48("2679"), {
            allowed: stryMutAct_9fa48("2680") ? true : (stryCov_9fa48("2680"), false),
            reason: stryMutAct_9fa48("2681") ? "" : (stryCov_9fa48("2681"), 'Account is suspended')
          }));
        }
      }
      if (stryMutAct_9fa48("2684") ? user.status !== UserStatus.ANONYMIZED : stryMutAct_9fa48("2683") ? false : stryMutAct_9fa48("2682") ? true : (stryCov_9fa48("2682", "2683", "2684"), user.status === UserStatus.ANONYMIZED)) {
        if (stryMutAct_9fa48("2685")) {
          {}
        } else {
          stryCov_9fa48("2685");
          return Promise.resolve(stryMutAct_9fa48("2686") ? {} : (stryCov_9fa48("2686"), {
            allowed: stryMutAct_9fa48("2687") ? true : (stryCov_9fa48("2687"), false),
            reason: stryMutAct_9fa48("2688") ? "" : (stryCov_9fa48("2688"), 'Account is deactivated')
          }));
        }
      }
      return Promise.resolve(stryMutAct_9fa48("2689") ? {} : (stryCov_9fa48("2689"), {
        allowed: stryMutAct_9fa48("2690") ? false : (stryCov_9fa48("2690"), true),
        reason: stryMutAct_9fa48("2691") ? "" : (stryCov_9fa48("2691"), 'Account is active')
      }));
    }
  }
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    if (stryMutAct_9fa48("2692")) {
      {}
    } else {
      stryCov_9fa48("2692");
      return await this.comparePassword(password, hashedPassword);
    }
  }
  generateToken(userId: string): Promise<string> {
    if (stryMutAct_9fa48("2693")) {
      {}
    } else {
      stryCov_9fa48("2693");
      // Enhanced token generation with more security
      const timestamp = Date.now();
      const randomBytes = stryMutAct_9fa48("2694") ? Math.random().toString(36) : (stryCov_9fa48("2694"), Math.random().toString(36).substring(2));
      const token = Buffer.from(stryMutAct_9fa48("2695") ? `` : (stryCov_9fa48("2695"), `${userId}:${timestamp}:${randomBytes}`)).toString(stryMutAct_9fa48("2696") ? "" : (stryCov_9fa48("2696"), 'base64'));
      return Promise.resolve(token);
    }
  }
  validateToken(token: string): Promise<TokenValidationResult> {
    if (stryMutAct_9fa48("2697")) {
      {}
    } else {
      stryCov_9fa48("2697");
      try {
        if (stryMutAct_9fa48("2698")) {
          {}
        } else {
          stryCov_9fa48("2698");
          const decoded = Buffer.from(token, stryMutAct_9fa48("2699") ? "" : (stryCov_9fa48("2699"), 'base64')).toString();
          const parts = decoded.split(stryMutAct_9fa48("2700") ? "" : (stryCov_9fa48("2700"), ':'));
          if (stryMutAct_9fa48("2703") ? parts.length === 3 : stryMutAct_9fa48("2702") ? false : stryMutAct_9fa48("2701") ? true : (stryCov_9fa48("2701", "2702", "2703"), parts.length !== 3)) {
            if (stryMutAct_9fa48("2704")) {
              {}
            } else {
              stryCov_9fa48("2704");
              return Promise.resolve(stryMutAct_9fa48("2705") ? {} : (stryCov_9fa48("2705"), {
                valid: stryMutAct_9fa48("2706") ? true : (stryCov_9fa48("2706"), false),
                message: stryMutAct_9fa48("2707") ? "" : (stryCov_9fa48("2707"), 'Invalid token format')
              }));
            }
          }
          const [userId, timestamp] = parts;

          // Check if token is expired (12 hours for enhanced security)
          const tokenAge = Date.now() - parseInt(timestamp);
          const maxAge = 12 * 60 * 60 * 1000; // 12 hours

          if (stryMutAct_9fa48("2715") ? tokenAge <= maxAge : stryMutAct_9fa48("2714") ? tokenAge >= maxAge : stryMutAct_9fa48("2713") ? false : stryMutAct_9fa48("2712") ? true : (stryCov_9fa48("2712", "2713", "2714", "2715"), tokenAge > maxAge)) {
            if (stryMutAct_9fa48("2716")) {
              {}
            } else {
              stryCov_9fa48("2716");
              return Promise.resolve(stryMutAct_9fa48("2717") ? {} : (stryCov_9fa48("2717"), {
                valid: stryMutAct_9fa48("2718") ? true : (stryCov_9fa48("2718"), false),
                message: stryMutAct_9fa48("2719") ? "" : (stryCov_9fa48("2719"), 'Token has expired')
              }));
            }
          }
          return Promise.resolve(stryMutAct_9fa48("2720") ? {} : (stryCov_9fa48("2720"), {
            valid: stryMutAct_9fa48("2721") ? false : (stryCov_9fa48("2721"), true),
            userId,
            expiresAt: new Date(parseInt(timestamp) + maxAge),
            message: stryMutAct_9fa48("2723") ? "" : (stryCov_9fa48("2723"), 'Token is valid')
          }));
        }
      } catch {
        if (stryMutAct_9fa48("2724")) {
          {}
        } else {
          stryCov_9fa48("2724");
          return Promise.resolve(stryMutAct_9fa48("2725") ? {} : (stryCov_9fa48("2725"), {
            valid: stryMutAct_9fa48("2726") ? true : (stryCov_9fa48("2726"), false),
            message: stryMutAct_9fa48("2727") ? "" : (stryCov_9fa48("2727"), 'Invalid token format')
          }));
        }
      }
    }
  }
  async handleFailedLogin(userId: string): Promise<void> {
    if (stryMutAct_9fa48("2728")) {
      {}
    } else {
      stryCov_9fa48("2728");
      const user = await this.findUserByEmail(userId);
      if (stryMutAct_9fa48("2731") ? false : stryMutAct_9fa48("2730") ? true : stryMutAct_9fa48("2729") ? user : (stryCov_9fa48("2729", "2730", "2731"), !user)) return;
      const attempts = stryMutAct_9fa48("2734") ? this.failedAttempts.get(user.email) && {
        count: 0,
        lastAttempt: new Date()
      } : stryMutAct_9fa48("2733") ? false : stryMutAct_9fa48("2732") ? true : (stryCov_9fa48("2732", "2733", "2734"), this.failedAttempts.get(user.email) || (stryMutAct_9fa48("2735") ? {} : (stryCov_9fa48("2735"), {
        count: 0,
        lastAttempt: new Date()
      })));
      stryMutAct_9fa48("2736") ? attempts.count-- : (stryCov_9fa48("2736"), attempts.count++);
      attempts.lastAttempt = new Date();
      this.failedAttempts.set(user.email, attempts);
      console.log(stryMutAct_9fa48("2737") ? `` : (stryCov_9fa48("2737"), `Failed login attempt ${attempts.count} for user ${userId}`));
    }
  }
  updateLastLogin(userId: string): Promise<void> {
    if (stryMutAct_9fa48("2738")) {
      {}
    } else {
      stryCov_9fa48("2738");
      console.log(stryMutAct_9fa48("2739") ? `` : (stryCov_9fa48("2739"), `Updated last login for user ${userId} with enhanced tracking`));
      return Promise.resolve();
    }
  }

  // ✅ LSP: Additional methods that don't break substitutability
  private isAccountLocked(email: string): Promise<boolean> {
    if (stryMutAct_9fa48("2740")) {
      {}
    } else {
      stryCov_9fa48("2740");
      const attempts = this.failedAttempts.get(email);
      if (stryMutAct_9fa48("2743") ? false : stryMutAct_9fa48("2742") ? true : stryMutAct_9fa48("2741") ? attempts : (stryCov_9fa48("2741", "2742", "2743"), !attempts)) return Promise.resolve(stryMutAct_9fa48("2744") ? true : (stryCov_9fa48("2744"), false));
      if (stryMutAct_9fa48("2748") ? attempts.count < this.maxFailedAttempts : stryMutAct_9fa48("2747") ? attempts.count > this.maxFailedAttempts : stryMutAct_9fa48("2746") ? false : stryMutAct_9fa48("2745") ? true : (stryCov_9fa48("2745", "2746", "2747", "2748"), attempts.count >= this.maxFailedAttempts)) {
        if (stryMutAct_9fa48("2749")) {
          {}
        } else {
          stryCov_9fa48("2749");
          const timeSinceLastAttempt = Date.now() - attempts.lastAttempt.getTime();
          if (stryMutAct_9fa48("2754") ? timeSinceLastAttempt >= this.lockoutDuration : stryMutAct_9fa48("2753") ? timeSinceLastAttempt <= this.lockoutDuration : stryMutAct_9fa48("2752") ? false : stryMutAct_9fa48("2751") ? true : (stryCov_9fa48("2751", "2752", "2753", "2754"), timeSinceLastAttempt < this.lockoutDuration)) {
            if (stryMutAct_9fa48("2755")) {
              {}
            } else {
              stryCov_9fa48("2755");
              return Promise.resolve(stryMutAct_9fa48("2756") ? false : (stryCov_9fa48("2756"), true));
            }
          } else {
            if (stryMutAct_9fa48("2757")) {
              {}
            } else {
              stryCov_9fa48("2757");
              // Reset attempts after lockout period
              this.failedAttempts.delete(email);
              return Promise.resolve(stryMutAct_9fa48("2758") ? true : (stryCov_9fa48("2758"), false));
            }
          }
        }
      }
      return Promise.resolve(stryMutAct_9fa48("2759") ? true : (stryCov_9fa48("2759"), false));
    }
  }
  unlockAccount(email: string): Promise<void> {
    if (stryMutAct_9fa48("2760")) {
      {}
    } else {
      stryCov_9fa48("2760");
      this.failedAttempts.delete(email);
      console.log(stryMutAct_9fa48("2761") ? `` : (stryCov_9fa48("2761"), `Account unlocked for ${email}`));
      return Promise.resolve();
    }
  }
}

// ✅ LSP COMPLIANT: Two-Factor Authentication Service
// Can be substituted for BaseAuthenticationService, adds 2FA
@Injectable()
export class TwoFactorAuthenticationService extends EnhancedAuthenticationService {
  // ✅ LSP: Extends behavior while maintaining contract
  async validateCredentials(email: string, password: string, twoFactorCode?: string): Promise<AuthenticationResult> {
    if (stryMutAct_9fa48("2762")) {
      {}
    } else {
      stryCov_9fa48("2762");
      // First validate standard credentials
      const baseResult = await super.validateCredentials(email, password);
      if (stryMutAct_9fa48("2765") ? false : stryMutAct_9fa48("2764") ? true : stryMutAct_9fa48("2763") ? baseResult.success : (stryCov_9fa48("2763", "2764", "2765"), !baseResult.success)) {
        if (stryMutAct_9fa48("2766")) {
          {}
        } else {
          stryCov_9fa48("2766");
          return baseResult;
        }
      }

      // Check if user has 2FA enabled
      const user = await this.findUserByEmail(email);
      if (stryMutAct_9fa48("2769") ? user.twoFactorEnabled : stryMutAct_9fa48("2768") ? false : stryMutAct_9fa48("2767") ? true : (stryCov_9fa48("2767", "2768", "2769"), user?.twoFactorEnabled)) {
        if (stryMutAct_9fa48("2770")) {
          {}
        } else {
          stryCov_9fa48("2770");
          if (stryMutAct_9fa48("2773") ? false : stryMutAct_9fa48("2772") ? true : stryMutAct_9fa48("2771") ? twoFactorCode : (stryCov_9fa48("2771", "2772", "2773"), !twoFactorCode)) {
            if (stryMutAct_9fa48("2774")) {
              {}
            } else {
              stryCov_9fa48("2774");
              return stryMutAct_9fa48("2775") ? {} : (stryCov_9fa48("2775"), {
                success: stryMutAct_9fa48("2776") ? true : (stryCov_9fa48("2776"), false),
                message: stryMutAct_9fa48("2777") ? "" : (stryCov_9fa48("2777"), 'Two-factor authentication code required')
              });
            }
          }
          const twoFactorValid = await this.validateTwoFactorCode(user.id, twoFactorCode);
          if (stryMutAct_9fa48("2780") ? false : stryMutAct_9fa48("2779") ? true : stryMutAct_9fa48("2778") ? twoFactorValid : (stryCov_9fa48("2778", "2779", "2780"), !twoFactorValid)) {
            if (stryMutAct_9fa48("2781")) {
              {}
            } else {
              stryCov_9fa48("2781");
              return stryMutAct_9fa48("2782") ? {} : (stryCov_9fa48("2782"), {
                success: stryMutAct_9fa48("2783") ? true : (stryCov_9fa48("2783"), false),
                message: stryMutAct_9fa48("2784") ? "" : (stryCov_9fa48("2784"), 'Invalid two-factor authentication code')
              });
            }
          }
        }
      }
      return baseResult;
    }
  }
  private validateTwoFactorCode(_userId: string, code: string): Promise<boolean> {
    if (stryMutAct_9fa48("2785")) {
      {}
    } else {
      stryCov_9fa48("2785");
      // Mock implementation - in real app would validate TOTP code
      return Promise.resolve(stryMutAct_9fa48("2788") ? code !== '123456' : stryMutAct_9fa48("2787") ? false : stryMutAct_9fa48("2786") ? true : (stryCov_9fa48("2786", "2787", "2788"), code === (stryMutAct_9fa48("2789") ? "" : (stryCov_9fa48("2789"), '123456'))));
    }
  }
  generateTwoFactorSecret(userId: string): Promise<string> {
    if (stryMutAct_9fa48("2790")) {
      {}
    } else {
      stryCov_9fa48("2790");
      // Mock implementation - in real app would generate TOTP secret
      return Promise.resolve(stryMutAct_9fa48("2791") ? `` : (stryCov_9fa48("2791"), `secret_${userId}_${Date.now()}`));
    }
  }
  enableTwoFactor(userId: string): Promise<boolean> {
    if (stryMutAct_9fa48("2792")) {
      {}
    } else {
      stryCov_9fa48("2792");
      // Mock implementation - in real app would save secret to database
      console.log(stryMutAct_9fa48("2793") ? `` : (stryCov_9fa48("2793"), `Two-factor authentication enabled for user ${userId}`));
      return Promise.resolve(stryMutAct_9fa48("2794") ? false : (stryCov_9fa48("2794"), true));
    }
  }
  disableTwoFactor(userId: string): Promise<boolean> {
    if (stryMutAct_9fa48("2795")) {
      {}
    } else {
      stryCov_9fa48("2795");
      // Mock implementation - in real app would remove secret from database
      console.log(stryMutAct_9fa48("2796") ? `` : (stryCov_9fa48("2796"), `Two-factor authentication disabled for user ${userId}`));
      return Promise.resolve(stryMutAct_9fa48("2797") ? false : (stryCov_9fa48("2797"), true));
    }
  }
}

// ✅ LSP BENEFITS DEMONSTRATED:
// 1. Any subclass can be substituted for the base class without breaking functionality
// 2. All implementations maintain the same interface contract
// 3. Subclasses can extend behavior without violating the contract
// 4. Clients can use any implementation without knowing the specific type
// 5. New authentication methods can be added without changing existing code

// Example usage demonstrating LSP:
/*
function authenticateUser(authService: IAuthenticationService, email: string, password: string) {
  // This function works with ANY implementation of IAuthenticationService
  return authService.validateCredentials(email, password);
}

// All of these work the same way:
const standardAuth = new StandardAuthenticationService();
const enhancedAuth = new EnhancedAuthenticationService();
const twoFactorAuth = new TwoFactorAuthenticationService();

// LSP: These are all substitutable
await authenticateUser(standardAuth, 'test@example.com', 'password123');
await authenticateUser(enhancedAuth, 'test@example.com', 'password123');
await authenticateUser(twoFactorAuth, 'test@example.com', 'password123');
*/