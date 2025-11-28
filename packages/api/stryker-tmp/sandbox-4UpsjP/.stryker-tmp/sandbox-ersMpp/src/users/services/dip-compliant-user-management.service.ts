// @ts-nocheck
// 
// ✅ DIP COMPLIANT: Dependency Inversion Principle Implementation
// packages/api/src/users/services/dip-compliant-user-management.service.ts
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

// ✅ DIP: High-level modules should not depend on low-level modules
// Both should depend on abstractions (interfaces)

// Define proper types
export interface UserData {
  id: string;
  email: string;
  name: string;
  lastName: string;
  contactNumber?: string;
  role: UserRole;
  status: UserStatus;
  terms: boolean;
  isTwoFactorEnabled: boolean;
  emailVerified: Date | null;
  image: string;
  groupIds: string[];
  tagIds: string[];
  resourceIds: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}
export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  lastName: string;
  contactNumber?: string;
}
export interface UpdateUserInput {
  email?: string;
  password?: string;
  name?: string;
  lastName?: string;
  contactNumber?: string;
  role?: UserRole;
  status?: UserStatus;
}
export interface BulkOperationResult {
  success: number;
  failed: number;
  results: (UserData | {
    id: string;
    error: string;
  })[];
}

// Abstraction for User Repository
export interface IUserRepository {
  create(userData: Partial<UserData>): Promise<UserData>;
  findById(id: string): Promise<UserData | null>;
  update(id: string, data: Partial<UserData>): Promise<UserData>;
  delete(id: string): Promise<void>;
  findAll(): Promise<UserData[]>;
}

// Abstraction for User Validation
export interface IUserValidator {
  validateEmail(email: string): boolean;
  validatePassword(password: string): boolean;
  validateUserData(userData: CreateUserInput): boolean;
}

// Abstraction for User Notifications
export interface IUserNotificationService {
  sendWelcomeEmail(userId: string): Promise<void>;
  sendPasswordResetEmail(userId: string): Promise<void>;
  sendAccountDeactivationEmail(userId: string): Promise<void>;
}

// ✅ DIP COMPLIANT: High-level User Management Service
// Depends on abstractions, not concrete implementations
@Injectable()
export class DIPCompliantUserManagementService {
  constructor(private readonly userRepository: IUserRepository, private readonly userValidator: IUserValidator, private readonly notificationService: IUserNotificationService) {}

  // ✅ DIP: This method depends on abstractions, not concretions
  async createUser(userData: CreateUserInput): Promise<UserData> {
    if (stryMutAct_9fa48("2271")) {
      {}
    } else {
      stryCov_9fa48("2271");
      // Validate using abstraction
      if (stryMutAct_9fa48("2274") ? false : stryMutAct_9fa48("2273") ? true : stryMutAct_9fa48("2272") ? this.userValidator.validateUserData(userData) : (stryCov_9fa48("2272", "2273", "2274"), !this.userValidator.validateUserData(userData))) {
        if (stryMutAct_9fa48("2275")) {
          {}
        } else {
          stryCov_9fa48("2275");
          throw new Error(stryMutAct_9fa48("2276") ? "" : (stryCov_9fa48("2276"), 'Invalid user data'));
        }
      }

      // Create user using abstraction
      const newUser = await this.userRepository.create(stryMutAct_9fa48("2277") ? {} : (stryCov_9fa48("2277"), {
        ...userData,
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        terms: stryMutAct_9fa48("2278") ? false : (stryCov_9fa48("2278"), true),
        isTwoFactorEnabled: stryMutAct_9fa48("2279") ? true : (stryCov_9fa48("2279"), false),
        emailVerified: null,
        image: stryMutAct_9fa48("2280") ? "Stryker was here!" : (stryCov_9fa48("2280"), ''),
        groupIds: stryMutAct_9fa48("2281") ? ["Stryker was here"] : (stryCov_9fa48("2281"), []),
        tagIds: stryMutAct_9fa48("2282") ? ["Stryker was here"] : (stryCov_9fa48("2282"), []),
        resourceIds: stryMutAct_9fa48("2283") ? ["Stryker was here"] : (stryCov_9fa48("2283"), []),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      }));

      // Send notification using abstraction
      await this.notificationService.sendWelcomeEmail(newUser.id);
      return newUser;
    }
  }

  // ✅ DIP: Update method depends on abstractions
  async updateUser(id: string, updateData: UpdateUserInput): Promise<UserData> {
    if (stryMutAct_9fa48("2284")) {
      {}
    } else {
      stryCov_9fa48("2284");
      const user = await this.userRepository.findById(id);
      if (stryMutAct_9fa48("2287") ? false : stryMutAct_9fa48("2286") ? true : stryMutAct_9fa48("2285") ? user : (stryCov_9fa48("2285", "2286", "2287"), !user)) {
        if (stryMutAct_9fa48("2288")) {
          {}
        } else {
          stryCov_9fa48("2288");
          throw new Error(stryMutAct_9fa48("2289") ? "" : (stryCov_9fa48("2289"), 'User not found'));
        }
      }
      if (stryMutAct_9fa48("2292") ? updateData.email || !this.userValidator.validateEmail(updateData.email) : stryMutAct_9fa48("2291") ? false : stryMutAct_9fa48("2290") ? true : (stryCov_9fa48("2290", "2291", "2292"), updateData.email && (stryMutAct_9fa48("2293") ? this.userValidator.validateEmail(updateData.email) : (stryCov_9fa48("2293"), !this.userValidator.validateEmail(updateData.email))))) {
        if (stryMutAct_9fa48("2294")) {
          {}
        } else {
          stryCov_9fa48("2294");
          throw new Error(stryMutAct_9fa48("2295") ? "" : (stryCov_9fa48("2295"), 'Invalid email format'));
        }
      }
      if (stryMutAct_9fa48("2298") ? updateData.password || !this.userValidator.validatePassword(updateData.password) : stryMutAct_9fa48("2297") ? false : stryMutAct_9fa48("2296") ? true : (stryCov_9fa48("2296", "2297", "2298"), updateData.password && (stryMutAct_9fa48("2299") ? this.userValidator.validatePassword(updateData.password) : (stryCov_9fa48("2299"), !this.userValidator.validatePassword(updateData.password))))) {
        if (stryMutAct_9fa48("2300")) {
          {}
        } else {
          stryCov_9fa48("2300");
          throw new Error(stryMutAct_9fa48("2301") ? "" : (stryCov_9fa48("2301"), 'Invalid password format'));
        }
      }
      return await this.userRepository.update(id, updateData);
    }
  }

  // ✅ DIP: Delete method depends on abstractions
  async deleteUser(id: string): Promise<void> {
    if (stryMutAct_9fa48("2302")) {
      {}
    } else {
      stryCov_9fa48("2302");
      const user = await this.userRepository.findById(id);
      if (stryMutAct_9fa48("2305") ? false : stryMutAct_9fa48("2304") ? true : stryMutAct_9fa48("2303") ? user : (stryCov_9fa48("2303", "2304", "2305"), !user)) {
        if (stryMutAct_9fa48("2306")) {
          {}
        } else {
          stryCov_9fa48("2306");
          throw new Error(stryMutAct_9fa48("2307") ? "" : (stryCov_9fa48("2307"), 'User not found'));
        }
      }
      await this.notificationService.sendAccountDeactivationEmail(id);
      await this.userRepository.delete(id);
    }
  }

  // ✅ DIP: Find methods depend on abstractions
  async findUserById(id: string): Promise<UserData | null> {
    if (stryMutAct_9fa48("2308")) {
      {}
    } else {
      stryCov_9fa48("2308");
      return await this.userRepository.findById(id);
    }
  }
  async getAllUsers(): Promise<UserData[]> {
    if (stryMutAct_9fa48("2309")) {
      {}
    } else {
      stryCov_9fa48("2309");
      return await this.userRepository.findAll();
    }
  }

  // ✅ DIP: Password reset depends on abstractions
  async resetUserPassword(userId: string): Promise<void> {
    if (stryMutAct_9fa48("2310")) {
      {}
    } else {
      stryCov_9fa48("2310");
      const user = await this.userRepository.findById(userId);
      if (stryMutAct_9fa48("2313") ? false : stryMutAct_9fa48("2312") ? true : stryMutAct_9fa48("2311") ? user : (stryCov_9fa48("2311", "2312", "2313"), !user)) {
        if (stryMutAct_9fa48("2314")) {
          {}
        } else {
          stryCov_9fa48("2314");
          throw new Error(stryMutAct_9fa48("2315") ? "" : (stryCov_9fa48("2315"), 'User not found'));
        }
      }
      await this.notificationService.sendPasswordResetEmail(userId);
    }
  }

  // ✅ DIP: Bulk operations depend on abstractions
  async bulkUpdateUserStatus(userIds: string[], status: UserStatus): Promise<BulkOperationResult> {
    if (stryMutAct_9fa48("2316")) {
      {}
    } else {
      stryCov_9fa48("2316");
      const results: (UserData | {
        id: string;
        error: string;
      })[] = stryMutAct_9fa48("2317") ? ["Stryker was here"] : (stryCov_9fa48("2317"), []);
      let success = 0;
      let failed = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("2318")) {
          {}
        } else {
          stryCov_9fa48("2318");
          try {
            if (stryMutAct_9fa48("2319")) {
              {}
            } else {
              stryCov_9fa48("2319");
              const updatedUser = await this.userRepository.update(userId, stryMutAct_9fa48("2320") ? {} : (stryCov_9fa48("2320"), {
                status
              }));
              results.push(updatedUser);
              stryMutAct_9fa48("2321") ? success-- : (stryCov_9fa48("2321"), success++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("2322")) {
              {}
            } else {
              stryCov_9fa48("2322");
              results.push(stryMutAct_9fa48("2323") ? {} : (stryCov_9fa48("2323"), {
                id: userId,
                error: error instanceof Error ? error.message : stryMutAct_9fa48("2324") ? "" : (stryCov_9fa48("2324"), 'Unknown error')
              }));
              stryMutAct_9fa48("2325") ? failed-- : (stryCov_9fa48("2325"), failed++);
            }
          }
        }
      }
      return stryMutAct_9fa48("2326") ? {} : (stryCov_9fa48("2326"), {
        success,
        failed,
        results
      });
    }
  }
  async bulkUpdateUserRole(userIds: string[], role: UserRole): Promise<BulkOperationResult> {
    if (stryMutAct_9fa48("2327")) {
      {}
    } else {
      stryCov_9fa48("2327");
      const results: (UserData | {
        id: string;
        error: string;
      })[] = stryMutAct_9fa48("2328") ? ["Stryker was here"] : (stryCov_9fa48("2328"), []);
      let success = 0;
      let failed = 0;
      for (const userId of userIds) {
        if (stryMutAct_9fa48("2329")) {
          {}
        } else {
          stryCov_9fa48("2329");
          try {
            if (stryMutAct_9fa48("2330")) {
              {}
            } else {
              stryCov_9fa48("2330");
              const updatedUser = await this.userRepository.update(userId, stryMutAct_9fa48("2331") ? {} : (stryCov_9fa48("2331"), {
                role
              }));
              results.push(updatedUser);
              stryMutAct_9fa48("2332") ? success-- : (stryCov_9fa48("2332"), success++);
            }
          } catch (error) {
            if (stryMutAct_9fa48("2333")) {
              {}
            } else {
              stryCov_9fa48("2333");
              results.push(stryMutAct_9fa48("2334") ? {} : (stryCov_9fa48("2334"), {
                id: userId,
                error: error instanceof Error ? error.message : stryMutAct_9fa48("2335") ? "" : (stryCov_9fa48("2335"), 'Unknown error')
              }));
              stryMutAct_9fa48("2336") ? failed-- : (stryCov_9fa48("2336"), failed++);
            }
          }
        }
      }
      return stryMutAct_9fa48("2337") ? {} : (stryCov_9fa48("2337"), {
        success,
        failed,
        results
      });
    }
  }
}

// ✅ DIP COMPLIANT: Concrete implementations that can be injected
// These implement the abstractions defined above

@Injectable()
export class ConcreteUserRepository implements IUserRepository {
  create(userData: Partial<UserData>): Promise<UserData> {
    if (stryMutAct_9fa48("2338")) {
      {}
    } else {
      stryCov_9fa48("2338");
      // Concrete implementation would use Prisma or other ORM
      return Promise.resolve(stryMutAct_9fa48("2339") ? {} : (stryCov_9fa48("2339"), {
        id: stryMutAct_9fa48("2340") ? "" : (stryCov_9fa48("2340"), '1'),
        email: stryMutAct_9fa48("2343") ? userData.email && 'test@example.com' : stryMutAct_9fa48("2342") ? false : stryMutAct_9fa48("2341") ? true : (stryCov_9fa48("2341", "2342", "2343"), userData.email || (stryMutAct_9fa48("2344") ? "" : (stryCov_9fa48("2344"), 'test@example.com'))),
        name: stryMutAct_9fa48("2347") ? userData.name && 'Test User' : stryMutAct_9fa48("2346") ? false : stryMutAct_9fa48("2345") ? true : (stryCov_9fa48("2345", "2346", "2347"), userData.name || (stryMutAct_9fa48("2348") ? "" : (stryCov_9fa48("2348"), 'Test User'))),
        lastName: stryMutAct_9fa48("2351") ? userData.lastName && 'User' : stryMutAct_9fa48("2350") ? false : stryMutAct_9fa48("2349") ? true : (stryCov_9fa48("2349", "2350", "2351"), userData.lastName || (stryMutAct_9fa48("2352") ? "" : (stryCov_9fa48("2352"), 'User'))),
        contactNumber: userData.contactNumber,
        role: stryMutAct_9fa48("2355") ? userData.role && UserRole.CLIENT : stryMutAct_9fa48("2354") ? false : stryMutAct_9fa48("2353") ? true : (stryCov_9fa48("2353", "2354", "2355"), userData.role || UserRole.CLIENT),
        status: stryMutAct_9fa48("2358") ? userData.status && UserStatus.ACTIVE : stryMutAct_9fa48("2357") ? false : stryMutAct_9fa48("2356") ? true : (stryCov_9fa48("2356", "2357", "2358"), userData.status || UserStatus.ACTIVE),
        terms: stryMutAct_9fa48("2359") ? userData.terms && true : (stryCov_9fa48("2359"), userData.terms ?? (stryMutAct_9fa48("2360") ? false : (stryCov_9fa48("2360"), true))),
        isTwoFactorEnabled: stryMutAct_9fa48("2363") ? userData.isTwoFactorEnabled && false : stryMutAct_9fa48("2362") ? false : stryMutAct_9fa48("2361") ? true : (stryCov_9fa48("2361", "2362", "2363"), userData.isTwoFactorEnabled || (stryMutAct_9fa48("2364") ? true : (stryCov_9fa48("2364"), false))),
        emailVerified: stryMutAct_9fa48("2367") ? userData.emailVerified && null : stryMutAct_9fa48("2366") ? false : stryMutAct_9fa48("2365") ? true : (stryCov_9fa48("2365", "2366", "2367"), userData.emailVerified || null),
        image: stryMutAct_9fa48("2370") ? userData.image && '' : stryMutAct_9fa48("2369") ? false : stryMutAct_9fa48("2368") ? true : (stryCov_9fa48("2368", "2369", "2370"), userData.image || (stryMutAct_9fa48("2371") ? "Stryker was here!" : (stryCov_9fa48("2371"), ''))),
        groupIds: stryMutAct_9fa48("2374") ? userData.groupIds && [] : stryMutAct_9fa48("2373") ? false : stryMutAct_9fa48("2372") ? true : (stryCov_9fa48("2372", "2373", "2374"), userData.groupIds || (stryMutAct_9fa48("2375") ? ["Stryker was here"] : (stryCov_9fa48("2375"), []))),
        tagIds: stryMutAct_9fa48("2378") ? userData.tagIds && [] : stryMutAct_9fa48("2377") ? false : stryMutAct_9fa48("2376") ? true : (stryCov_9fa48("2376", "2377", "2378"), userData.tagIds || (stryMutAct_9fa48("2379") ? ["Stryker was here"] : (stryCov_9fa48("2379"), []))),
        resourceIds: stryMutAct_9fa48("2382") ? userData.resourceIds && [] : stryMutAct_9fa48("2381") ? false : stryMutAct_9fa48("2380") ? true : (stryCov_9fa48("2380", "2381", "2382"), userData.resourceIds || (stryMutAct_9fa48("2383") ? ["Stryker was here"] : (stryCov_9fa48("2383"), []))),
        createdAt: stryMutAct_9fa48("2386") ? userData.createdAt && new Date() : stryMutAct_9fa48("2385") ? false : stryMutAct_9fa48("2384") ? true : (stryCov_9fa48("2384", "2385", "2386"), userData.createdAt || new Date()),
        updatedAt: stryMutAct_9fa48("2389") ? userData.updatedAt && new Date() : stryMutAct_9fa48("2388") ? false : stryMutAct_9fa48("2387") ? true : (stryCov_9fa48("2387", "2388", "2389"), userData.updatedAt || new Date()),
        lastLogin: stryMutAct_9fa48("2392") ? userData.lastLogin && null : stryMutAct_9fa48("2391") ? false : stryMutAct_9fa48("2390") ? true : (stryCov_9fa48("2390", "2391", "2392"), userData.lastLogin || null)
      }));
    }
  }
  findById(id: string): Promise<UserData | null> {
    if (stryMutAct_9fa48("2393")) {
      {}
    } else {
      stryCov_9fa48("2393");
      // Concrete implementation
      return Promise.resolve(stryMutAct_9fa48("2394") ? {} : (stryCov_9fa48("2394"), {
        id,
        email: stryMutAct_9fa48("2395") ? "" : (stryCov_9fa48("2395"), 'test@example.com'),
        name: stryMutAct_9fa48("2396") ? "" : (stryCov_9fa48("2396"), 'Test User'),
        lastName: stryMutAct_9fa48("2397") ? "" : (stryCov_9fa48("2397"), 'User'),
        contactNumber: stryMutAct_9fa48("2398") ? "" : (stryCov_9fa48("2398"), '+1234567890'),
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        terms: stryMutAct_9fa48("2399") ? false : (stryCov_9fa48("2399"), true),
        isTwoFactorEnabled: stryMutAct_9fa48("2400") ? true : (stryCov_9fa48("2400"), false),
        emailVerified: null,
        image: stryMutAct_9fa48("2401") ? "Stryker was here!" : (stryCov_9fa48("2401"), ''),
        groupIds: stryMutAct_9fa48("2402") ? ["Stryker was here"] : (stryCov_9fa48("2402"), []),
        tagIds: stryMutAct_9fa48("2403") ? ["Stryker was here"] : (stryCov_9fa48("2403"), []),
        resourceIds: stryMutAct_9fa48("2404") ? ["Stryker was here"] : (stryCov_9fa48("2404"), []),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      }));
    }
  }
  update(id: string, data: Partial<UserData>): Promise<UserData> {
    if (stryMutAct_9fa48("2405")) {
      {}
    } else {
      stryCov_9fa48("2405");
      // Concrete implementation
      return Promise.resolve(stryMutAct_9fa48("2406") ? {} : (stryCov_9fa48("2406"), {
        id,
        email: stryMutAct_9fa48("2409") ? data.email && 'test@example.com' : stryMutAct_9fa48("2408") ? false : stryMutAct_9fa48("2407") ? true : (stryCov_9fa48("2407", "2408", "2409"), data.email || (stryMutAct_9fa48("2410") ? "" : (stryCov_9fa48("2410"), 'test@example.com'))),
        name: stryMutAct_9fa48("2413") ? data.name && 'Test User' : stryMutAct_9fa48("2412") ? false : stryMutAct_9fa48("2411") ? true : (stryCov_9fa48("2411", "2412", "2413"), data.name || (stryMutAct_9fa48("2414") ? "" : (stryCov_9fa48("2414"), 'Test User'))),
        lastName: stryMutAct_9fa48("2417") ? data.lastName && 'User' : stryMutAct_9fa48("2416") ? false : stryMutAct_9fa48("2415") ? true : (stryCov_9fa48("2415", "2416", "2417"), data.lastName || (stryMutAct_9fa48("2418") ? "" : (stryCov_9fa48("2418"), 'User'))),
        contactNumber: stryMutAct_9fa48("2421") ? data.contactNumber && '+1234567890' : stryMutAct_9fa48("2420") ? false : stryMutAct_9fa48("2419") ? true : (stryCov_9fa48("2419", "2420", "2421"), data.contactNumber || (stryMutAct_9fa48("2422") ? "" : (stryCov_9fa48("2422"), '+1234567890'))),
        role: stryMutAct_9fa48("2425") ? data.role && UserRole.CLIENT : stryMutAct_9fa48("2424") ? false : stryMutAct_9fa48("2423") ? true : (stryCov_9fa48("2423", "2424", "2425"), data.role || UserRole.CLIENT),
        status: stryMutAct_9fa48("2428") ? data.status && UserStatus.ACTIVE : stryMutAct_9fa48("2427") ? false : stryMutAct_9fa48("2426") ? true : (stryCov_9fa48("2426", "2427", "2428"), data.status || UserStatus.ACTIVE),
        terms: stryMutAct_9fa48("2429") ? data.terms && true : (stryCov_9fa48("2429"), data.terms ?? (stryMutAct_9fa48("2430") ? false : (stryCov_9fa48("2430"), true))),
        isTwoFactorEnabled: stryMutAct_9fa48("2433") ? data.isTwoFactorEnabled && false : stryMutAct_9fa48("2432") ? false : stryMutAct_9fa48("2431") ? true : (stryCov_9fa48("2431", "2432", "2433"), data.isTwoFactorEnabled || (stryMutAct_9fa48("2434") ? true : (stryCov_9fa48("2434"), false))),
        emailVerified: stryMutAct_9fa48("2437") ? data.emailVerified && null : stryMutAct_9fa48("2436") ? false : stryMutAct_9fa48("2435") ? true : (stryCov_9fa48("2435", "2436", "2437"), data.emailVerified || null),
        image: stryMutAct_9fa48("2440") ? data.image && '' : stryMutAct_9fa48("2439") ? false : stryMutAct_9fa48("2438") ? true : (stryCov_9fa48("2438", "2439", "2440"), data.image || (stryMutAct_9fa48("2441") ? "Stryker was here!" : (stryCov_9fa48("2441"), ''))),
        groupIds: stryMutAct_9fa48("2444") ? data.groupIds && [] : stryMutAct_9fa48("2443") ? false : stryMutAct_9fa48("2442") ? true : (stryCov_9fa48("2442", "2443", "2444"), data.groupIds || (stryMutAct_9fa48("2445") ? ["Stryker was here"] : (stryCov_9fa48("2445"), []))),
        tagIds: stryMutAct_9fa48("2448") ? data.tagIds && [] : stryMutAct_9fa48("2447") ? false : stryMutAct_9fa48("2446") ? true : (stryCov_9fa48("2446", "2447", "2448"), data.tagIds || (stryMutAct_9fa48("2449") ? ["Stryker was here"] : (stryCov_9fa48("2449"), []))),
        resourceIds: stryMutAct_9fa48("2452") ? data.resourceIds && [] : stryMutAct_9fa48("2451") ? false : stryMutAct_9fa48("2450") ? true : (stryCov_9fa48("2450", "2451", "2452"), data.resourceIds || (stryMutAct_9fa48("2453") ? ["Stryker was here"] : (stryCov_9fa48("2453"), []))),
        createdAt: stryMutAct_9fa48("2456") ? data.createdAt && new Date() : stryMutAct_9fa48("2455") ? false : stryMutAct_9fa48("2454") ? true : (stryCov_9fa48("2454", "2455", "2456"), data.createdAt || new Date()),
        updatedAt: new Date(),
        lastLogin: stryMutAct_9fa48("2459") ? data.lastLogin && null : stryMutAct_9fa48("2458") ? false : stryMutAct_9fa48("2457") ? true : (stryCov_9fa48("2457", "2458", "2459"), data.lastLogin || null)
      }));
    }
  }
  delete(id: string): Promise<void> {
    if (stryMutAct_9fa48("2460")) {
      {}
    } else {
      stryCov_9fa48("2460");
      // Concrete implementation
      console.log(stryMutAct_9fa48("2461") ? `` : (stryCov_9fa48("2461"), `Deleting user ${id}`));
      return Promise.resolve();
    }
  }
  findAll(): Promise<UserData[]> {
    if (stryMutAct_9fa48("2462")) {
      {}
    } else {
      stryCov_9fa48("2462");
      // Concrete implementation
      return Promise.resolve(stryMutAct_9fa48("2463") ? [] : (stryCov_9fa48("2463"), [stryMutAct_9fa48("2464") ? {} : (stryCov_9fa48("2464"), {
        id: stryMutAct_9fa48("2465") ? "" : (stryCov_9fa48("2465"), '1'),
        email: stryMutAct_9fa48("2466") ? "" : (stryCov_9fa48("2466"), 'user1@example.com'),
        name: stryMutAct_9fa48("2467") ? "" : (stryCov_9fa48("2467"), 'User 1'),
        lastName: stryMutAct_9fa48("2468") ? "" : (stryCov_9fa48("2468"), 'LastName 1'),
        contactNumber: stryMutAct_9fa48("2469") ? "" : (stryCov_9fa48("2469"), '+1111111111'),
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        terms: stryMutAct_9fa48("2470") ? false : (stryCov_9fa48("2470"), true),
        isTwoFactorEnabled: stryMutAct_9fa48("2471") ? true : (stryCov_9fa48("2471"), false),
        emailVerified: null,
        image: stryMutAct_9fa48("2472") ? "Stryker was here!" : (stryCov_9fa48("2472"), ''),
        groupIds: stryMutAct_9fa48("2473") ? ["Stryker was here"] : (stryCov_9fa48("2473"), []),
        tagIds: stryMutAct_9fa48("2474") ? ["Stryker was here"] : (stryCov_9fa48("2474"), []),
        resourceIds: stryMutAct_9fa48("2475") ? ["Stryker was here"] : (stryCov_9fa48("2475"), []),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      }), stryMutAct_9fa48("2476") ? {} : (stryCov_9fa48("2476"), {
        id: stryMutAct_9fa48("2477") ? "" : (stryCov_9fa48("2477"), '2'),
        email: stryMutAct_9fa48("2478") ? "" : (stryCov_9fa48("2478"), 'user2@example.com'),
        name: stryMutAct_9fa48("2479") ? "" : (stryCov_9fa48("2479"), 'User 2'),
        lastName: stryMutAct_9fa48("2480") ? "" : (stryCov_9fa48("2480"), 'LastName 2'),
        contactNumber: stryMutAct_9fa48("2481") ? "" : (stryCov_9fa48("2481"), '+2222222222'),
        role: UserRole.CLIENT,
        status: UserStatus.ACTIVE,
        terms: stryMutAct_9fa48("2482") ? false : (stryCov_9fa48("2482"), true),
        isTwoFactorEnabled: stryMutAct_9fa48("2483") ? true : (stryCov_9fa48("2483"), false),
        emailVerified: null,
        image: stryMutAct_9fa48("2484") ? "Stryker was here!" : (stryCov_9fa48("2484"), ''),
        groupIds: stryMutAct_9fa48("2485") ? ["Stryker was here"] : (stryCov_9fa48("2485"), []),
        tagIds: stryMutAct_9fa48("2486") ? ["Stryker was here"] : (stryCov_9fa48("2486"), []),
        resourceIds: stryMutAct_9fa48("2487") ? ["Stryker was here"] : (stryCov_9fa48("2487"), []),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: null
      })]));
    }
  }
}
@Injectable()
export class ConcreteUserValidator implements IUserValidator {
  validateEmail(email: string): boolean {
    if (stryMutAct_9fa48("2488")) {
      {}
    } else {
      stryCov_9fa48("2488");
      const emailRegex = stryMutAct_9fa48("2499") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("2498") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("2497") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("2496") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("2495") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("2494") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("2493") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("2492") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("2491") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("2490") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("2489") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("2489", "2490", "2491", "2492", "2493", "2494", "2495", "2496", "2497", "2498", "2499"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      return emailRegex.test(email);
    }
  }
  validatePassword(password: string): boolean {
    if (stryMutAct_9fa48("2500")) {
      {}
    } else {
      stryCov_9fa48("2500");
      return stryMutAct_9fa48("2504") ? password.length < 8 : stryMutAct_9fa48("2503") ? password.length > 8 : stryMutAct_9fa48("2502") ? false : stryMutAct_9fa48("2501") ? true : (stryCov_9fa48("2501", "2502", "2503", "2504"), password.length >= 8);
    }
  }
  validateUserData(userData: CreateUserInput): boolean {
    if (stryMutAct_9fa48("2505")) {
      {}
    } else {
      stryCov_9fa48("2505");
      return stryMutAct_9fa48("2506") ? !(userData.email && userData.password && userData.name && userData.lastName && this.validateEmail(userData.email) && this.validatePassword(userData.password)) : (stryCov_9fa48("2506"), !(stryMutAct_9fa48("2507") ? userData.email && userData.password && userData.name && userData.lastName && this.validateEmail(userData.email) && this.validatePassword(userData.password) : (stryCov_9fa48("2507"), !(stryMutAct_9fa48("2510") ? userData.email && userData.password && userData.name && userData.lastName && this.validateEmail(userData.email) || this.validatePassword(userData.password) : stryMutAct_9fa48("2509") ? false : stryMutAct_9fa48("2508") ? true : (stryCov_9fa48("2508", "2509", "2510"), (stryMutAct_9fa48("2512") ? userData.email && userData.password && userData.name && userData.lastName || this.validateEmail(userData.email) : stryMutAct_9fa48("2511") ? true : (stryCov_9fa48("2511", "2512"), (stryMutAct_9fa48("2514") ? userData.email && userData.password && userData.name || userData.lastName : stryMutAct_9fa48("2513") ? true : (stryCov_9fa48("2513", "2514"), (stryMutAct_9fa48("2516") ? userData.email && userData.password || userData.name : stryMutAct_9fa48("2515") ? true : (stryCov_9fa48("2515", "2516"), (stryMutAct_9fa48("2518") ? userData.email || userData.password : stryMutAct_9fa48("2517") ? true : (stryCov_9fa48("2517", "2518"), userData.email && userData.password)) && userData.name)) && userData.lastName)) && this.validateEmail(userData.email))) && this.validatePassword(userData.password))))));
    }
  }
}
@Injectable()
export class ConcreteUserNotificationService implements IUserNotificationService {
  sendWelcomeEmail(userId: string): Promise<void> {
    if (stryMutAct_9fa48("2519")) {
      {}
    } else {
      stryCov_9fa48("2519");
      // Concrete implementation would send actual email
      console.log(stryMutAct_9fa48("2520") ? `` : (stryCov_9fa48("2520"), `Sending welcome email to user ${userId}`));
      return Promise.resolve();
    }
  }
  sendPasswordResetEmail(userId: string): Promise<void> {
    if (stryMutAct_9fa48("2521")) {
      {}
    } else {
      stryCov_9fa48("2521");
      // Concrete implementation would send actual email
      console.log(stryMutAct_9fa48("2522") ? `` : (stryCov_9fa48("2522"), `Sending password reset email to user ${userId}`));
      return Promise.resolve();
    }
  }
  sendAccountDeactivationEmail(userId: string): Promise<void> {
    if (stryMutAct_9fa48("2523")) {
      {}
    } else {
      stryCov_9fa48("2523");
      // Concrete implementation would send actual email
      console.log(stryMutAct_9fa48("2524") ? `` : (stryCov_9fa48("2524"), `Sending account deactivation email to user ${userId}`));
      return Promise.resolve();
    }
  }
}

// ✅ DIP BENEFITS DEMONSTRATED:
// 1. High-level modules (UserManagementService) don't depend on low-level modules
// 2. Both depend on abstractions (interfaces)
// 3. Easy to test with mock implementations
// 4. Easy to swap implementations without changing high-level code
// 5. Follows the dependency inversion principle perfectly