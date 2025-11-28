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
    if (stryMutAct_9fa48("498")) {
      {}
    } else {
      stryCov_9fa48("498");
      const {
        email,
        password,
        ...userData
      } = createUserDto;

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique(stryMutAct_9fa48("499") ? {} : (stryCov_9fa48("499"), {
        where: stryMutAct_9fa48("500") ? {} : (stryCov_9fa48("500"), {
          email
        })
      }));
      if (stryMutAct_9fa48("502") ? false : stryMutAct_9fa48("501") ? true : (stryCov_9fa48("501", "502"), existingUser)) {
        if (stryMutAct_9fa48("503")) {
          {}
        } else {
          stryCov_9fa48("503");
          throw new ConflictException(stryMutAct_9fa48("504") ? `` : (stryCov_9fa48("504"), `An account with email ${email} already exists. Please use a different email or try logging in.`));
        }
      }

      // Create user (password should be hashed by authentication service)
      const user = await this.prisma.user.create(stryMutAct_9fa48("505") ? {} : (stryCov_9fa48("505"), {
        data: stryMutAct_9fa48("506") ? {} : (stryCov_9fa48("506"), {
          email,
          password,
          // Assumes password is already hashed
          ...userData
        }),
        select: stryMutAct_9fa48("507") ? {} : (stryCov_9fa48("507"), {
          id: stryMutAct_9fa48("508") ? false : (stryCov_9fa48("508"), true),
          email: stryMutAct_9fa48("509") ? false : (stryCov_9fa48("509"), true),
          name: stryMutAct_9fa48("510") ? false : (stryCov_9fa48("510"), true),
          lastName: stryMutAct_9fa48("511") ? false : (stryCov_9fa48("511"), true),
          contactNumber: stryMutAct_9fa48("512") ? false : (stryCov_9fa48("512"), true),
          role: stryMutAct_9fa48("513") ? false : (stryCov_9fa48("513"), true),
          createdAt: stryMutAct_9fa48("514") ? false : (stryCov_9fa48("514"), true),
          lastLogin: stryMutAct_9fa48("515") ? false : (stryCov_9fa48("515"), true)
        })
      }));
      return user;
    }
  }
  async findById(id: string): Promise<UserResponse | null> {
    if (stryMutAct_9fa48("516")) {
      {}
    } else {
      stryCov_9fa48("516");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("517") ? {} : (stryCov_9fa48("517"), {
        where: stryMutAct_9fa48("518") ? {} : (stryCov_9fa48("518"), {
          id
        }),
        select: stryMutAct_9fa48("519") ? {} : (stryCov_9fa48("519"), {
          id: stryMutAct_9fa48("520") ? false : (stryCov_9fa48("520"), true),
          email: stryMutAct_9fa48("521") ? false : (stryCov_9fa48("521"), true),
          name: stryMutAct_9fa48("522") ? false : (stryCov_9fa48("522"), true),
          lastName: stryMutAct_9fa48("523") ? false : (stryCov_9fa48("523"), true),
          contactNumber: stryMutAct_9fa48("524") ? false : (stryCov_9fa48("524"), true),
          role: stryMutAct_9fa48("525") ? false : (stryCov_9fa48("525"), true),
          createdAt: stryMutAct_9fa48("526") ? false : (stryCov_9fa48("526"), true),
          lastLogin: stryMutAct_9fa48("527") ? false : (stryCov_9fa48("527"), true)
        })
      }));
      return user;
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    if (stryMutAct_9fa48("528")) {
      {}
    } else {
      stryCov_9fa48("528");
      return this.prisma.user.findUnique(stryMutAct_9fa48("529") ? {} : (stryCov_9fa48("529"), {
        where: stryMutAct_9fa48("530") ? {} : (stryCov_9fa48("530"), {
          email
        })
      }));
    }
  }
  async findAll(): Promise<UserResponse[]> {
    if (stryMutAct_9fa48("531")) {
      {}
    } else {
      stryCov_9fa48("531");
      return this.prisma.user.findMany(stryMutAct_9fa48("532") ? {} : (stryCov_9fa48("532"), {
        select: stryMutAct_9fa48("533") ? {} : (stryCov_9fa48("533"), {
          id: stryMutAct_9fa48("534") ? false : (stryCov_9fa48("534"), true),
          email: stryMutAct_9fa48("535") ? false : (stryCov_9fa48("535"), true),
          name: stryMutAct_9fa48("536") ? false : (stryCov_9fa48("536"), true),
          lastName: stryMutAct_9fa48("537") ? false : (stryCov_9fa48("537"), true),
          contactNumber: stryMutAct_9fa48("538") ? false : (stryCov_9fa48("538"), true),
          role: stryMutAct_9fa48("539") ? false : (stryCov_9fa48("539"), true),
          createdAt: stryMutAct_9fa48("540") ? false : (stryCov_9fa48("540"), true),
          lastLogin: stryMutAct_9fa48("541") ? false : (stryCov_9fa48("541"), true)
        })
      }));
    }
  }
  async findAllWithFilters(filterDto: FilterUsersDto): Promise<PaginatedUsersResponse> {
    if (stryMutAct_9fa48("542")) {
      {}
    } else {
      stryCov_9fa48("542");
      const {
        search,
        role,
        createdFrom,
        createdTo,
        page = 1,
        limit = 20,
        sortBy = stryMutAct_9fa48("543") ? "" : (stryCov_9fa48("543"), 'createdAt'),
        sortOrder = stryMutAct_9fa48("544") ? "" : (stryCov_9fa48("544"), 'desc')
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
      if (stryMutAct_9fa48("546") ? false : stryMutAct_9fa48("545") ? true : (stryCov_9fa48("545", "546"), search)) {
        if (stryMutAct_9fa48("547")) {
          {}
        } else {
          stryCov_9fa48("547");
          where.OR = stryMutAct_9fa48("548") ? [] : (stryCov_9fa48("548"), [stryMutAct_9fa48("549") ? {} : (stryCov_9fa48("549"), {
            email: stryMutAct_9fa48("550") ? {} : (stryCov_9fa48("550"), {
              contains: search,
              mode: stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), 'insensitive')
            })
          }), stryMutAct_9fa48("552") ? {} : (stryCov_9fa48("552"), {
            name: stryMutAct_9fa48("553") ? {} : (stryCov_9fa48("553"), {
              contains: search,
              mode: stryMutAct_9fa48("554") ? "" : (stryCov_9fa48("554"), 'insensitive')
            })
          }), stryMutAct_9fa48("555") ? {} : (stryCov_9fa48("555"), {
            lastName: stryMutAct_9fa48("556") ? {} : (stryCov_9fa48("556"), {
              contains: search,
              mode: stryMutAct_9fa48("557") ? "" : (stryCov_9fa48("557"), 'insensitive')
            })
          })]);
        }
      }
      if (stryMutAct_9fa48("559") ? false : stryMutAct_9fa48("558") ? true : (stryCov_9fa48("558", "559"), role)) {
        if (stryMutAct_9fa48("560")) {
          {}
        } else {
          stryCov_9fa48("560");
          where.role = role;
        }
      }
      if (stryMutAct_9fa48("563") ? createdFrom && createdTo : stryMutAct_9fa48("562") ? false : stryMutAct_9fa48("561") ? true : (stryCov_9fa48("561", "562", "563"), createdFrom || createdTo)) {
        if (stryMutAct_9fa48("564")) {
          {}
        } else {
          stryCov_9fa48("564");
          where.createdAt = {};
          if (stryMutAct_9fa48("566") ? false : stryMutAct_9fa48("565") ? true : (stryCov_9fa48("565", "566"), createdFrom)) {
            if (stryMutAct_9fa48("567")) {
              {}
            } else {
              stryCov_9fa48("567");
              where.createdAt.gte = new Date(createdFrom);
            }
          }
          if (stryMutAct_9fa48("569") ? false : stryMutAct_9fa48("568") ? true : (stryCov_9fa48("568", "569"), createdTo)) {
            if (stryMutAct_9fa48("570")) {
              {}
            } else {
              stryCov_9fa48("570");
              where.createdAt.lte = new Date(createdTo);
            }
          }
        }
      }

      // Calculate skip for pagination
      const skip = stryMutAct_9fa48("571") ? (page - 1) / limit : (stryCov_9fa48("571"), (stryMutAct_9fa48("572") ? page + 1 : (stryCov_9fa48("572"), page - 1)) * limit);

      // Get total count for pagination
      const total = await this.prisma.user.count(stryMutAct_9fa48("573") ? {} : (stryCov_9fa48("573"), {
        where
      }));

      // Get users with pagination and sorting
      const users = await this.prisma.user.findMany(stryMutAct_9fa48("574") ? {} : (stryCov_9fa48("574"), {
        where,
        select: stryMutAct_9fa48("575") ? {} : (stryCov_9fa48("575"), {
          id: stryMutAct_9fa48("576") ? false : (stryCov_9fa48("576"), true),
          email: stryMutAct_9fa48("577") ? false : (stryCov_9fa48("577"), true),
          name: stryMutAct_9fa48("578") ? false : (stryCov_9fa48("578"), true),
          lastName: stryMutAct_9fa48("579") ? false : (stryCov_9fa48("579"), true),
          contactNumber: stryMutAct_9fa48("580") ? false : (stryCov_9fa48("580"), true),
          role: stryMutAct_9fa48("581") ? false : (stryCov_9fa48("581"), true),
          createdAt: stryMutAct_9fa48("582") ? false : (stryCov_9fa48("582"), true),
          lastLogin: stryMutAct_9fa48("583") ? false : (stryCov_9fa48("583"), true)
        }),
        orderBy: {
          [sortBy]: sortOrder
        } as Record<string, 'asc' | 'desc'>,
        skip,
        take: limit
      }));
      const totalPages = Math.ceil(stryMutAct_9fa48("584") ? total * limit : (stryCov_9fa48("584"), total / limit));
      return stryMutAct_9fa48("585") ? {} : (stryCov_9fa48("585"), {
        users,
        pagination: stryMutAct_9fa48("586") ? {} : (stryCov_9fa48("586"), {
          page,
          limit,
          total,
          totalPages,
          hasNext: stryMutAct_9fa48("590") ? page >= totalPages : stryMutAct_9fa48("589") ? page <= totalPages : stryMutAct_9fa48("588") ? false : stryMutAct_9fa48("587") ? true : (stryCov_9fa48("587", "588", "589", "590"), page < totalPages),
          hasPrev: stryMutAct_9fa48("594") ? page <= 1 : stryMutAct_9fa48("593") ? page >= 1 : stryMutAct_9fa48("592") ? false : stryMutAct_9fa48("591") ? true : (stryCov_9fa48("591", "592", "593", "594"), page > 1)
        })
      });
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    if (stryMutAct_9fa48("595")) {
      {}
    } else {
      stryCov_9fa48("595");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("596") ? {} : (stryCov_9fa48("596"), {
        where: stryMutAct_9fa48("597") ? {} : (stryCov_9fa48("597"), {
          id
        })
      }));
      if (stryMutAct_9fa48("600") ? false : stryMutAct_9fa48("599") ? true : stryMutAct_9fa48("598") ? user : (stryCov_9fa48("598", "599", "600"), !user)) {
        if (stryMutAct_9fa48("601")) {
          {}
        } else {
          stryCov_9fa48("601");
          throw new NotFoundException(stryMutAct_9fa48("602") ? `` : (stryCov_9fa48("602"), `User with ID ${id} not found`));
        }
      }
      const updatedUser = await this.prisma.user.update(stryMutAct_9fa48("603") ? {} : (stryCov_9fa48("603"), {
        where: stryMutAct_9fa48("604") ? {} : (stryCov_9fa48("604"), {
          id
        }),
        data: updateUserDto,
        select: stryMutAct_9fa48("605") ? {} : (stryCov_9fa48("605"), {
          id: stryMutAct_9fa48("606") ? false : (stryCov_9fa48("606"), true),
          email: stryMutAct_9fa48("607") ? false : (stryCov_9fa48("607"), true),
          name: stryMutAct_9fa48("608") ? false : (stryCov_9fa48("608"), true),
          lastName: stryMutAct_9fa48("609") ? false : (stryCov_9fa48("609"), true),
          contactNumber: stryMutAct_9fa48("610") ? false : (stryCov_9fa48("610"), true),
          role: stryMutAct_9fa48("611") ? false : (stryCov_9fa48("611"), true),
          createdAt: stryMutAct_9fa48("612") ? false : (stryCov_9fa48("612"), true),
          lastLogin: stryMutAct_9fa48("613") ? false : (stryCov_9fa48("613"), true)
        })
      }));
      return updatedUser;
    }
  }
  async updateTags(id: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateUserTagsDto: UpdateUserTagsDto): Promise<UserResponseWithTags> {
    if (stryMutAct_9fa48("614")) {
      {}
    } else {
      stryCov_9fa48("614");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("615") ? {} : (stryCov_9fa48("615"), {
        where: stryMutAct_9fa48("616") ? {} : (stryCov_9fa48("616"), {
          id
        })
      }));
      if (stryMutAct_9fa48("619") ? false : stryMutAct_9fa48("618") ? true : stryMutAct_9fa48("617") ? user : (stryCov_9fa48("617", "618", "619"), !user)) {
        if (stryMutAct_9fa48("620")) {
          {}
        } else {
          stryCov_9fa48("620");
          throw new NotFoundException(stryMutAct_9fa48("621") ? `` : (stryCov_9fa48("621"), `User with ID ${id} not found`));
        }
      }

      // Note: UserTag table doesn't exist in current schema
      // In production, implement user tags by adding UserTag model to schema
      // For now, we'll skip the tag operations
      // const { tagIds } = updateUserTagsDto; // Commented out since not used

      // Return user with tags (simplified since UserTag doesn't exist)
      const updatedUser = await this.prisma.user.findUnique(stryMutAct_9fa48("622") ? {} : (stryCov_9fa48("622"), {
        where: stryMutAct_9fa48("623") ? {} : (stryCov_9fa48("623"), {
          id
        }),
        select: stryMutAct_9fa48("624") ? {} : (stryCov_9fa48("624"), {
          id: stryMutAct_9fa48("625") ? false : (stryCov_9fa48("625"), true),
          email: stryMutAct_9fa48("626") ? false : (stryCov_9fa48("626"), true),
          name: stryMutAct_9fa48("627") ? false : (stryCov_9fa48("627"), true),
          lastName: stryMutAct_9fa48("628") ? false : (stryCov_9fa48("628"), true),
          contactNumber: stryMutAct_9fa48("629") ? false : (stryCov_9fa48("629"), true),
          role: stryMutAct_9fa48("630") ? false : (stryCov_9fa48("630"), true),
          createdAt: stryMutAct_9fa48("631") ? false : (stryCov_9fa48("631"), true),
          lastLogin: stryMutAct_9fa48("632") ? false : (stryCov_9fa48("632"), true)
        })
      }));
      if (stryMutAct_9fa48("635") ? false : stryMutAct_9fa48("634") ? true : stryMutAct_9fa48("633") ? updatedUser : (stryCov_9fa48("633", "634", "635"), !updatedUser)) {
        if (stryMutAct_9fa48("636")) {
          {}
        } else {
          stryCov_9fa48("636");
          throw new NotFoundException(stryMutAct_9fa48("637") ? `` : (stryCov_9fa48("637"), `User with ID ${id} not found`));
        }
      }
      return stryMutAct_9fa48("638") ? {} : (stryCov_9fa48("638"), {
        ...updatedUser,
        tags: stryMutAct_9fa48("639") ? ["Stryker was here"] : (stryCov_9fa48("639"), []) // Empty array since UserTag table doesn't exist
      });
    }
  }
  async delete(id: string): Promise<void> {
    if (stryMutAct_9fa48("640")) {
      {}
    } else {
      stryCov_9fa48("640");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("641") ? {} : (stryCov_9fa48("641"), {
        where: stryMutAct_9fa48("642") ? {} : (stryCov_9fa48("642"), {
          id
        })
      }));
      if (stryMutAct_9fa48("645") ? false : stryMutAct_9fa48("644") ? true : stryMutAct_9fa48("643") ? user : (stryCov_9fa48("643", "644", "645"), !user)) {
        if (stryMutAct_9fa48("646")) {
          {}
        } else {
          stryCov_9fa48("646");
          throw new NotFoundException(stryMutAct_9fa48("647") ? `` : (stryCov_9fa48("647"), `User with ID ${id} not found`));
        }
      }
      await this.prisma.user.delete(stryMutAct_9fa48("648") ? {} : (stryCov_9fa48("648"), {
        where: stryMutAct_9fa48("649") ? {} : (stryCov_9fa48("649"), {
          id
        })
      }));
    }
  }
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    if (stryMutAct_9fa48("650")) {
      {}
    } else {
      stryCov_9fa48("650");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("651") ? {} : (stryCov_9fa48("651"), {
        where: stryMutAct_9fa48("652") ? {} : (stryCov_9fa48("652"), {
          id
        })
      }));
      if (stryMutAct_9fa48("655") ? false : stryMutAct_9fa48("654") ? true : stryMutAct_9fa48("653") ? user : (stryCov_9fa48("653", "654", "655"), !user)) {
        if (stryMutAct_9fa48("656")) {
          {}
        } else {
          stryCov_9fa48("656");
          throw new NotFoundException(stryMutAct_9fa48("657") ? `` : (stryCov_9fa48("657"), `User with ID ${id} not found`));
        }
      }
      return this.prisma.user.update(stryMutAct_9fa48("658") ? {} : (stryCov_9fa48("658"), {
        where: stryMutAct_9fa48("659") ? {} : (stryCov_9fa48("659"), {
          id
        }),
        data: stryMutAct_9fa48("660") ? {} : (stryCov_9fa48("660"), {
          password: hashedPassword
        })
      }));
    }
  }
  async markEmailAsVerified(id: string): Promise<EmailVerificationResponse> {
    if (stryMutAct_9fa48("661")) {
      {}
    } else {
      stryCov_9fa48("661");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("662") ? {} : (stryCov_9fa48("662"), {
        where: stryMutAct_9fa48("663") ? {} : (stryCov_9fa48("663"), {
          id
        })
      }));
      if (stryMutAct_9fa48("666") ? false : stryMutAct_9fa48("665") ? true : stryMutAct_9fa48("664") ? user : (stryCov_9fa48("664", "665", "666"), !user)) {
        if (stryMutAct_9fa48("667")) {
          {}
        } else {
          stryCov_9fa48("667");
          throw new NotFoundException(stryMutAct_9fa48("668") ? `` : (stryCov_9fa48("668"), `User with ID ${id} not found`));
        }
      }
      const updatedUser = await this.prisma.user.update(stryMutAct_9fa48("669") ? {} : (stryCov_9fa48("669"), {
        where: stryMutAct_9fa48("670") ? {} : (stryCov_9fa48("670"), {
          id
        }),
        data: stryMutAct_9fa48("671") ? {} : (stryCov_9fa48("671"), {
          emailVerified: new Date()
        }),
        select: stryMutAct_9fa48("672") ? {} : (stryCov_9fa48("672"), {
          id: stryMutAct_9fa48("673") ? false : (stryCov_9fa48("673"), true),
          email: stryMutAct_9fa48("674") ? false : (stryCov_9fa48("674"), true),
          emailVerified: stryMutAct_9fa48("675") ? false : (stryCov_9fa48("675"), true),
          name: stryMutAct_9fa48("676") ? false : (stryCov_9fa48("676"), true),
          lastName: stryMutAct_9fa48("677") ? false : (stryCov_9fa48("677"), true)
        })
      }));
      return updatedUser;
    }
  }
  async updateLastLogin(id: string): Promise<void> {
    if (stryMutAct_9fa48("678")) {
      {}
    } else {
      stryCov_9fa48("678");
      await this.prisma.user.update(stryMutAct_9fa48("679") ? {} : (stryCov_9fa48("679"), {
        where: stryMutAct_9fa48("680") ? {} : (stryCov_9fa48("680"), {
          id
        }),
        data: stryMutAct_9fa48("681") ? {} : (stryCov_9fa48("681"), {
          lastLogin: new Date()
        })
      }));
    }
  }
  async exists(id: string): Promise<boolean> {
    if (stryMutAct_9fa48("682")) {
      {}
    } else {
      stryCov_9fa48("682");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("683") ? {} : (stryCov_9fa48("683"), {
        where: stryMutAct_9fa48("684") ? {} : (stryCov_9fa48("684"), {
          id
        }),
        select: stryMutAct_9fa48("685") ? {} : (stryCov_9fa48("685"), {
          id: stryMutAct_9fa48("686") ? false : (stryCov_9fa48("686"), true)
        })
      }));
      return stryMutAct_9fa48("687") ? !user : (stryCov_9fa48("687"), !(stryMutAct_9fa48("688") ? user : (stryCov_9fa48("688"), !user)));
    }
  }
  async existsByEmail(email: string): Promise<boolean> {
    if (stryMutAct_9fa48("689")) {
      {}
    } else {
      stryCov_9fa48("689");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("690") ? {} : (stryCov_9fa48("690"), {
        where: stryMutAct_9fa48("691") ? {} : (stryCov_9fa48("691"), {
          email
        }),
        select: stryMutAct_9fa48("692") ? {} : (stryCov_9fa48("692"), {
          id: stryMutAct_9fa48("693") ? false : (stryCov_9fa48("693"), true)
        })
      }));
      return stryMutAct_9fa48("694") ? !user : (stryCov_9fa48("694"), !(stryMutAct_9fa48("695") ? user : (stryCov_9fa48("695"), !user)));
    }
  }
  async count(): Promise<number> {
    if (stryMutAct_9fa48("696")) {
      {}
    } else {
      stryCov_9fa48("696");
      return this.prisma.user.count();
    }
  }
  async countByFilters(where: Record<string, any>): Promise<number> {
    if (stryMutAct_9fa48("697")) {
      {}
    } else {
      stryCov_9fa48("697");
      return this.prisma.user.count(stryMutAct_9fa48("698") ? {} : (stryCov_9fa48("698"), {
        where
      }));
    }
  }
}