// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - User Data Persistence Only
// packages/api/src/users/services/user-repository.service.ts
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
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { FilterUsersDto } from '../dto/filter-users.dto';
import { UpdateUserTagsDto } from '../dto/update-user-tags.dto';
import { User, UserRole } from '@prisma/client';
import { IUserRepository, UserResponse, UserResponseWithTags, EmailVerificationResponse, PaginatedUsersResponse } from '../interfaces/user-repository.interface';
@Injectable()
export class UserRepositoryService implements IUserRepository {
  constructor(private prisma: PrismaService) {}
  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    if (stryMutAct_9fa48("3354")) {
      {}
    } else {
      stryCov_9fa48("3354");
      const {
        email,
        password,
        ...userData
      } = createUserDto;

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique(stryMutAct_9fa48("3355") ? {} : (stryCov_9fa48("3355"), {
        where: stryMutAct_9fa48("3356") ? {} : (stryCov_9fa48("3356"), {
          email
        })
      }));
      if (stryMutAct_9fa48("3358") ? false : stryMutAct_9fa48("3357") ? true : (stryCov_9fa48("3357", "3358"), existingUser)) {
        if (stryMutAct_9fa48("3359")) {
          {}
        } else {
          stryCov_9fa48("3359");
          throw new ConflictException(stryMutAct_9fa48("3360") ? `` : (stryCov_9fa48("3360"), `An account with email ${email} already exists. Please use a different email or try logging in.`));
        }
      }

      // Create user (password should be hashed by authentication service)
      const user = await this.prisma.user.create(stryMutAct_9fa48("3361") ? {} : (stryCov_9fa48("3361"), {
        data: stryMutAct_9fa48("3362") ? {} : (stryCov_9fa48("3362"), {
          email,
          password,
          // Assumes password is already hashed
          ...userData
        }),
        select: stryMutAct_9fa48("3363") ? {} : (stryCov_9fa48("3363"), {
          id: stryMutAct_9fa48("3364") ? false : (stryCov_9fa48("3364"), true),
          email: stryMutAct_9fa48("3365") ? false : (stryCov_9fa48("3365"), true),
          name: stryMutAct_9fa48("3366") ? false : (stryCov_9fa48("3366"), true),
          lastName: stryMutAct_9fa48("3367") ? false : (stryCov_9fa48("3367"), true),
          contactNumber: stryMutAct_9fa48("3368") ? false : (stryCov_9fa48("3368"), true),
          role: stryMutAct_9fa48("3369") ? false : (stryCov_9fa48("3369"), true),
          createdAt: stryMutAct_9fa48("3370") ? false : (stryCov_9fa48("3370"), true),
          updatedAt: stryMutAct_9fa48("3371") ? false : (stryCov_9fa48("3371"), true),
          lastLogin: stryMutAct_9fa48("3372") ? false : (stryCov_9fa48("3372"), true)
        })
      }));
      return user;
    }
  }
  async findById(id: string): Promise<UserResponse | null> {
    if (stryMutAct_9fa48("3373")) {
      {}
    } else {
      stryCov_9fa48("3373");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("3374") ? {} : (stryCov_9fa48("3374"), {
        where: stryMutAct_9fa48("3375") ? {} : (stryCov_9fa48("3375"), {
          id
        }),
        select: stryMutAct_9fa48("3376") ? {} : (stryCov_9fa48("3376"), {
          id: stryMutAct_9fa48("3377") ? false : (stryCov_9fa48("3377"), true),
          email: stryMutAct_9fa48("3378") ? false : (stryCov_9fa48("3378"), true),
          name: stryMutAct_9fa48("3379") ? false : (stryCov_9fa48("3379"), true),
          lastName: stryMutAct_9fa48("3380") ? false : (stryCov_9fa48("3380"), true),
          contactNumber: stryMutAct_9fa48("3381") ? false : (stryCov_9fa48("3381"), true),
          role: stryMutAct_9fa48("3382") ? false : (stryCov_9fa48("3382"), true),
          createdAt: stryMutAct_9fa48("3383") ? false : (stryCov_9fa48("3383"), true),
          updatedAt: stryMutAct_9fa48("3384") ? false : (stryCov_9fa48("3384"), true),
          lastLogin: stryMutAct_9fa48("3385") ? false : (stryCov_9fa48("3385"), true)
        })
      }));
      return user;
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    if (stryMutAct_9fa48("3386")) {
      {}
    } else {
      stryCov_9fa48("3386");
      return this.prisma.user.findUnique(stryMutAct_9fa48("3387") ? {} : (stryCov_9fa48("3387"), {
        where: stryMutAct_9fa48("3388") ? {} : (stryCov_9fa48("3388"), {
          email
        })
      }));
    }
  }
  async findAll(): Promise<UserResponse[]> {
    if (stryMutAct_9fa48("3389")) {
      {}
    } else {
      stryCov_9fa48("3389");
      return this.prisma.user.findMany(stryMutAct_9fa48("3390") ? {} : (stryCov_9fa48("3390"), {
        select: stryMutAct_9fa48("3391") ? {} : (stryCov_9fa48("3391"), {
          id: stryMutAct_9fa48("3392") ? false : (stryCov_9fa48("3392"), true),
          email: stryMutAct_9fa48("3393") ? false : (stryCov_9fa48("3393"), true),
          name: stryMutAct_9fa48("3394") ? false : (stryCov_9fa48("3394"), true),
          lastName: stryMutAct_9fa48("3395") ? false : (stryCov_9fa48("3395"), true),
          contactNumber: stryMutAct_9fa48("3396") ? false : (stryCov_9fa48("3396"), true),
          role: stryMutAct_9fa48("3397") ? false : (stryCov_9fa48("3397"), true),
          createdAt: stryMutAct_9fa48("3398") ? false : (stryCov_9fa48("3398"), true),
          updatedAt: stryMutAct_9fa48("3399") ? false : (stryCov_9fa48("3399"), true),
          lastLogin: stryMutAct_9fa48("3400") ? false : (stryCov_9fa48("3400"), true)
        })
      }));
    }
  }
  async findAllWithFilters(filterDto: FilterUsersDto): Promise<PaginatedUsersResponse> {
    if (stryMutAct_9fa48("3401")) {
      {}
    } else {
      stryCov_9fa48("3401");
      const {
        search,
        role,
        createdFrom,
        createdTo,
        page = 1,
        limit = 20,
        sortBy = stryMutAct_9fa48("3402") ? "" : (stryCov_9fa48("3402"), 'createdAt'),
        sortOrder = stryMutAct_9fa48("3403") ? "" : (stryCov_9fa48("3403"), 'desc')
      } = filterDto;

      // Build where clause
      const where: {
        OR?: Array<{
          email?: {
            contains: string;
            mode: 'insensitive';
          };
          name?: {
            contains: string;
            mode: 'insensitive';
          };
          lastName?: {
            contains: string;
            mode: 'insensitive';
          };
        }>;
        role?: UserRole;
        createdAt?: {
          gte?: Date;
          lte?: Date;
        };
      } = {};
      if (stryMutAct_9fa48("3405") ? false : stryMutAct_9fa48("3404") ? true : (stryCov_9fa48("3404", "3405"), search)) {
        if (stryMutAct_9fa48("3406")) {
          {}
        } else {
          stryCov_9fa48("3406");
          where.OR = stryMutAct_9fa48("3407") ? [] : (stryCov_9fa48("3407"), [stryMutAct_9fa48("3408") ? {} : (stryCov_9fa48("3408"), {
            email: stryMutAct_9fa48("3409") ? {} : (stryCov_9fa48("3409"), {
              contains: search,
              mode: stryMutAct_9fa48("3410") ? "" : (stryCov_9fa48("3410"), 'insensitive')
            })
          }), stryMutAct_9fa48("3411") ? {} : (stryCov_9fa48("3411"), {
            name: stryMutAct_9fa48("3412") ? {} : (stryCov_9fa48("3412"), {
              contains: search,
              mode: stryMutAct_9fa48("3413") ? "" : (stryCov_9fa48("3413"), 'insensitive')
            })
          }), stryMutAct_9fa48("3414") ? {} : (stryCov_9fa48("3414"), {
            lastName: stryMutAct_9fa48("3415") ? {} : (stryCov_9fa48("3415"), {
              contains: search,
              mode: stryMutAct_9fa48("3416") ? "" : (stryCov_9fa48("3416"), 'insensitive')
            })
          })]);
        }
      }
      if (stryMutAct_9fa48("3418") ? false : stryMutAct_9fa48("3417") ? true : (stryCov_9fa48("3417", "3418"), role)) {
        if (stryMutAct_9fa48("3419")) {
          {}
        } else {
          stryCov_9fa48("3419");
          where.role = role;
        }
      }
      if (stryMutAct_9fa48("3422") ? createdFrom && createdTo : stryMutAct_9fa48("3421") ? false : stryMutAct_9fa48("3420") ? true : (stryCov_9fa48("3420", "3421", "3422"), createdFrom || createdTo)) {
        if (stryMutAct_9fa48("3423")) {
          {}
        } else {
          stryCov_9fa48("3423");
          where.createdAt = {};
          if (stryMutAct_9fa48("3425") ? false : stryMutAct_9fa48("3424") ? true : (stryCov_9fa48("3424", "3425"), createdFrom)) {
            if (stryMutAct_9fa48("3426")) {
              {}
            } else {
              stryCov_9fa48("3426");
              where.createdAt.gte = new Date(createdFrom);
            }
          }
          if (stryMutAct_9fa48("3428") ? false : stryMutAct_9fa48("3427") ? true : (stryCov_9fa48("3427", "3428"), createdTo)) {
            if (stryMutAct_9fa48("3429")) {
              {}
            } else {
              stryCov_9fa48("3429");
              where.createdAt.lte = new Date(createdTo);
            }
          }
        }
      }

      // Calculate skip for pagination
      const skip = (page - 1) * limit;

      // Get total count for pagination
      const total = await this.prisma.user.count(stryMutAct_9fa48("3432") ? {} : (stryCov_9fa48("3432"), {
        where
      }));

      // Get users with pagination and sorting
      const users = await this.prisma.user.findMany(stryMutAct_9fa48("3433") ? {} : (stryCov_9fa48("3433"), {
        where,
        select: stryMutAct_9fa48("3434") ? {} : (stryCov_9fa48("3434"), {
          id: stryMutAct_9fa48("3435") ? false : (stryCov_9fa48("3435"), true),
          email: stryMutAct_9fa48("3436") ? false : (stryCov_9fa48("3436"), true),
          name: stryMutAct_9fa48("3437") ? false : (stryCov_9fa48("3437"), true),
          lastName: stryMutAct_9fa48("3438") ? false : (stryCov_9fa48("3438"), true),
          contactNumber: stryMutAct_9fa48("3439") ? false : (stryCov_9fa48("3439"), true),
          role: stryMutAct_9fa48("3440") ? false : (stryCov_9fa48("3440"), true),
          createdAt: stryMutAct_9fa48("3441") ? false : (stryCov_9fa48("3441"), true),
          updatedAt: stryMutAct_9fa48("3442") ? false : (stryCov_9fa48("3442"), true),
          lastLogin: stryMutAct_9fa48("3443") ? false : (stryCov_9fa48("3443"), true)
        }),
        orderBy: {
          [sortBy]: sortOrder
        } as Record<string, 'asc' | 'desc'>,
        skip,
        take: limit
      }));
      const totalPages = Math.ceil(total / limit);
      return stryMutAct_9fa48("3445") ? {} : (stryCov_9fa48("3445"), {
        users,
        pagination: stryMutAct_9fa48("3446") ? {} : (stryCov_9fa48("3446"), {
          page,
          limit,
          total,
          totalPages,
          hasNext: stryMutAct_9fa48("3450") ? page >= totalPages : stryMutAct_9fa48("3449") ? page <= totalPages : stryMutAct_9fa48("3448") ? false : stryMutAct_9fa48("3447") ? true : (stryCov_9fa48("3447", "3448", "3449", "3450"), page < totalPages),
          hasPrev: stryMutAct_9fa48("3454") ? page <= 1 : stryMutAct_9fa48("3453") ? page >= 1 : stryMutAct_9fa48("3452") ? false : stryMutAct_9fa48("3451") ? true : (stryCov_9fa48("3451", "3452", "3453", "3454"), page > 1)
        })
      });
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    if (stryMutAct_9fa48("3455")) {
      {}
    } else {
      stryCov_9fa48("3455");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("3456") ? {} : (stryCov_9fa48("3456"), {
        where: stryMutAct_9fa48("3457") ? {} : (stryCov_9fa48("3457"), {
          id
        })
      }));
      if (stryMutAct_9fa48("3460") ? false : stryMutAct_9fa48("3459") ? true : stryMutAct_9fa48("3458") ? user : (stryCov_9fa48("3458", "3459", "3460"), !user)) {
        if (stryMutAct_9fa48("3461")) {
          {}
        } else {
          stryCov_9fa48("3461");
          throw new NotFoundException(stryMutAct_9fa48("3462") ? `` : (stryCov_9fa48("3462"), `User with ID ${id} not found`));
        }
      }
      const updatedUser = await this.prisma.user.update(stryMutAct_9fa48("3463") ? {} : (stryCov_9fa48("3463"), {
        where: stryMutAct_9fa48("3464") ? {} : (stryCov_9fa48("3464"), {
          id
        }),
        data: updateUserDto,
        select: stryMutAct_9fa48("3465") ? {} : (stryCov_9fa48("3465"), {
          id: stryMutAct_9fa48("3466") ? false : (stryCov_9fa48("3466"), true),
          email: stryMutAct_9fa48("3467") ? false : (stryCov_9fa48("3467"), true),
          name: stryMutAct_9fa48("3468") ? false : (stryCov_9fa48("3468"), true),
          lastName: stryMutAct_9fa48("3469") ? false : (stryCov_9fa48("3469"), true),
          contactNumber: stryMutAct_9fa48("3470") ? false : (stryCov_9fa48("3470"), true),
          role: stryMutAct_9fa48("3471") ? false : (stryCov_9fa48("3471"), true),
          createdAt: stryMutAct_9fa48("3472") ? false : (stryCov_9fa48("3472"), true),
          updatedAt: stryMutAct_9fa48("3473") ? false : (stryCov_9fa48("3473"), true),
          lastLogin: stryMutAct_9fa48("3474") ? false : (stryCov_9fa48("3474"), true)
        })
      }));
      return updatedUser;
    }
  }
  async updateTags(id: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateUserTagsDto: UpdateUserTagsDto): Promise<UserResponseWithTags> {
    if (stryMutAct_9fa48("3475")) {
      {}
    } else {
      stryCov_9fa48("3475");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("3476") ? {} : (stryCov_9fa48("3476"), {
        where: stryMutAct_9fa48("3477") ? {} : (stryCov_9fa48("3477"), {
          id
        })
      }));
      if (stryMutAct_9fa48("3480") ? false : stryMutAct_9fa48("3479") ? true : stryMutAct_9fa48("3478") ? user : (stryCov_9fa48("3478", "3479", "3480"), !user)) {
        if (stryMutAct_9fa48("3481")) {
          {}
        } else {
          stryCov_9fa48("3481");
          throw new NotFoundException(stryMutAct_9fa48("3482") ? `` : (stryCov_9fa48("3482"), `User with ID ${id} not found`));
        }
      }

      // Note: UserTag table doesn't exist in current schema
      // In production, implement user tags by adding UserTag model to schema
      // For now, we'll skip the tag operations
      // const { tagIds } = updateUserTagsDto; // Commented out since not used

      // Return user with tags (simplified since UserTag doesn't exist)
      const updatedUser = await this.prisma.user.findUnique(stryMutAct_9fa48("3483") ? {} : (stryCov_9fa48("3483"), {
        where: stryMutAct_9fa48("3484") ? {} : (stryCov_9fa48("3484"), {
          id
        }),
        select: stryMutAct_9fa48("3485") ? {} : (stryCov_9fa48("3485"), {
          id: stryMutAct_9fa48("3486") ? false : (stryCov_9fa48("3486"), true),
          email: stryMutAct_9fa48("3487") ? false : (stryCov_9fa48("3487"), true),
          name: stryMutAct_9fa48("3488") ? false : (stryCov_9fa48("3488"), true),
          lastName: stryMutAct_9fa48("3489") ? false : (stryCov_9fa48("3489"), true),
          contactNumber: stryMutAct_9fa48("3490") ? false : (stryCov_9fa48("3490"), true),
          role: stryMutAct_9fa48("3491") ? false : (stryCov_9fa48("3491"), true),
          createdAt: stryMutAct_9fa48("3492") ? false : (stryCov_9fa48("3492"), true),
          updatedAt: stryMutAct_9fa48("3493") ? false : (stryCov_9fa48("3493"), true),
          lastLogin: stryMutAct_9fa48("3494") ? false : (stryCov_9fa48("3494"), true)
        })
      }));
      if (stryMutAct_9fa48("3497") ? false : stryMutAct_9fa48("3496") ? true : stryMutAct_9fa48("3495") ? updatedUser : (stryCov_9fa48("3495", "3496", "3497"), !updatedUser)) {
        if (stryMutAct_9fa48("3498")) {
          {}
        } else {
          stryCov_9fa48("3498");
          throw new NotFoundException(stryMutAct_9fa48("3499") ? `` : (stryCov_9fa48("3499"), `User with ID ${id} not found`));
        }
      }
      return stryMutAct_9fa48("3500") ? {} : (stryCov_9fa48("3500"), {
        ...updatedUser,
        tags: stryMutAct_9fa48("3501") ? ["Stryker was here"] : (stryCov_9fa48("3501"), []) // Empty array since UserTag table doesn't exist
      });
    }
  }
  async delete(id: string): Promise<void> {
    if (stryMutAct_9fa48("3502")) {
      {}
    } else {
      stryCov_9fa48("3502");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("3503") ? {} : (stryCov_9fa48("3503"), {
        where: stryMutAct_9fa48("3504") ? {} : (stryCov_9fa48("3504"), {
          id
        })
      }));
      if (stryMutAct_9fa48("3507") ? false : stryMutAct_9fa48("3506") ? true : stryMutAct_9fa48("3505") ? user : (stryCov_9fa48("3505", "3506", "3507"), !user)) {
        if (stryMutAct_9fa48("3508")) {
          {}
        } else {
          stryCov_9fa48("3508");
          throw new NotFoundException(stryMutAct_9fa48("3509") ? `` : (stryCov_9fa48("3509"), `User with ID ${id} not found`));
        }
      }
      await this.prisma.user.delete(stryMutAct_9fa48("3510") ? {} : (stryCov_9fa48("3510"), {
        where: stryMutAct_9fa48("3511") ? {} : (stryCov_9fa48("3511"), {
          id
        })
      }));
    }
  }
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    if (stryMutAct_9fa48("3512")) {
      {}
    } else {
      stryCov_9fa48("3512");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("3513") ? {} : (stryCov_9fa48("3513"), {
        where: stryMutAct_9fa48("3514") ? {} : (stryCov_9fa48("3514"), {
          id
        })
      }));
      if (stryMutAct_9fa48("3517") ? false : stryMutAct_9fa48("3516") ? true : stryMutAct_9fa48("3515") ? user : (stryCov_9fa48("3515", "3516", "3517"), !user)) {
        if (stryMutAct_9fa48("3518")) {
          {}
        } else {
          stryCov_9fa48("3518");
          throw new NotFoundException(stryMutAct_9fa48("3519") ? `` : (stryCov_9fa48("3519"), `User with ID ${id} not found`));
        }
      }
      return this.prisma.user.update(stryMutAct_9fa48("3520") ? {} : (stryCov_9fa48("3520"), {
        where: stryMutAct_9fa48("3521") ? {} : (stryCov_9fa48("3521"), {
          id
        }),
        data: stryMutAct_9fa48("3522") ? {} : (stryCov_9fa48("3522"), {
          password: hashedPassword
        })
      }));
    }
  }
  async markEmailAsVerified(id: string): Promise<EmailVerificationResponse> {
    if (stryMutAct_9fa48("3523")) {
      {}
    } else {
      stryCov_9fa48("3523");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("3524") ? {} : (stryCov_9fa48("3524"), {
        where: stryMutAct_9fa48("3525") ? {} : (stryCov_9fa48("3525"), {
          id
        })
      }));
      if (stryMutAct_9fa48("3528") ? false : stryMutAct_9fa48("3527") ? true : stryMutAct_9fa48("3526") ? user : (stryCov_9fa48("3526", "3527", "3528"), !user)) {
        if (stryMutAct_9fa48("3529")) {
          {}
        } else {
          stryCov_9fa48("3529");
          throw new NotFoundException(stryMutAct_9fa48("3530") ? `` : (stryCov_9fa48("3530"), `User with ID ${id} not found`));
        }
      }
      const updatedUser = await this.prisma.user.update(stryMutAct_9fa48("3531") ? {} : (stryCov_9fa48("3531"), {
        where: stryMutAct_9fa48("3532") ? {} : (stryCov_9fa48("3532"), {
          id
        }),
        data: stryMutAct_9fa48("3533") ? {} : (stryCov_9fa48("3533"), {
          emailVerified: new Date()
        }),
        select: stryMutAct_9fa48("3534") ? {} : (stryCov_9fa48("3534"), {
          id: stryMutAct_9fa48("3535") ? false : (stryCov_9fa48("3535"), true),
          email: stryMutAct_9fa48("3536") ? false : (stryCov_9fa48("3536"), true),
          emailVerified: stryMutAct_9fa48("3537") ? false : (stryCov_9fa48("3537"), true),
          name: stryMutAct_9fa48("3538") ? false : (stryCov_9fa48("3538"), true),
          lastName: stryMutAct_9fa48("3539") ? false : (stryCov_9fa48("3539"), true)
        })
      }));
      return updatedUser;
    }
  }
  async updateLastLogin(id: string): Promise<void> {
    if (stryMutAct_9fa48("3540")) {
      {}
    } else {
      stryCov_9fa48("3540");
      await this.prisma.user.update(stryMutAct_9fa48("3541") ? {} : (stryCov_9fa48("3541"), {
        where: stryMutAct_9fa48("3542") ? {} : (stryCov_9fa48("3542"), {
          id
        }),
        data: stryMutAct_9fa48("3543") ? {} : (stryCov_9fa48("3543"), {
          lastLogin: new Date()
        })
      }));
    }
  }
  async exists(id: string): Promise<boolean> {
    if (stryMutAct_9fa48("3544")) {
      {}
    } else {
      stryCov_9fa48("3544");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("3545") ? {} : (stryCov_9fa48("3545"), {
        where: stryMutAct_9fa48("3546") ? {} : (stryCov_9fa48("3546"), {
          id
        }),
        select: stryMutAct_9fa48("3547") ? {} : (stryCov_9fa48("3547"), {
          id: stryMutAct_9fa48("3548") ? false : (stryCov_9fa48("3548"), true)
        })
      }));
      return stryMutAct_9fa48("3549") ? !user : (stryCov_9fa48("3549"), !(stryMutAct_9fa48("3550") ? user : (stryCov_9fa48("3550"), !user)));
    }
  }
  async existsByEmail(email: string): Promise<boolean> {
    if (stryMutAct_9fa48("3551")) {
      {}
    } else {
      stryCov_9fa48("3551");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("3552") ? {} : (stryCov_9fa48("3552"), {
        where: stryMutAct_9fa48("3553") ? {} : (stryCov_9fa48("3553"), {
          email
        }),
        select: stryMutAct_9fa48("3554") ? {} : (stryCov_9fa48("3554"), {
          id: stryMutAct_9fa48("3555") ? false : (stryCov_9fa48("3555"), true)
        })
      }));
      return stryMutAct_9fa48("3556") ? !user : (stryCov_9fa48("3556"), !(stryMutAct_9fa48("3557") ? user : (stryCov_9fa48("3557"), !user)));
    }
  }
  async count(): Promise<number> {
    if (stryMutAct_9fa48("3558")) {
      {}
    } else {
      stryCov_9fa48("3558");
      return this.prisma.user.count();
    }
  }
  async countByFilters(where: Record<string, any>): Promise<number> {
    if (stryMutAct_9fa48("3559")) {
      {}
    } else {
      stryCov_9fa48("3559");
      return this.prisma.user.count(stryMutAct_9fa48("3560") ? {} : (stryCov_9fa48("3560"), {
        where
      }));
    }
  }
}