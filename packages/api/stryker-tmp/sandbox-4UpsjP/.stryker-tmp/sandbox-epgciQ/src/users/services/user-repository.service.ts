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
    if (stryMutAct_9fa48("506")) {
      {}
    } else {
      stryCov_9fa48("506");
      const {
        email,
        password,
        ...userData
      } = createUserDto;

      // Check if user already exists
      const existingUser = await this.prisma.user.findUnique(stryMutAct_9fa48("507") ? {} : (stryCov_9fa48("507"), {
        where: stryMutAct_9fa48("508") ? {} : (stryCov_9fa48("508"), {
          email
        })
      }));
      if (stryMutAct_9fa48("510") ? false : stryMutAct_9fa48("509") ? true : (stryCov_9fa48("509", "510"), existingUser)) {
        if (stryMutAct_9fa48("511")) {
          {}
        } else {
          stryCov_9fa48("511");
          throw new ConflictException(stryMutAct_9fa48("512") ? `` : (stryCov_9fa48("512"), `An account with email ${email} already exists. Please use a different email or try logging in.`));
        }
      }

      // Create user (password should be hashed by authentication service)
      const user = await this.prisma.user.create(stryMutAct_9fa48("513") ? {} : (stryCov_9fa48("513"), {
        data: stryMutAct_9fa48("514") ? {} : (stryCov_9fa48("514"), {
          email,
          password,
          // Assumes password is already hashed
          ...userData
        }),
        select: stryMutAct_9fa48("515") ? {} : (stryCov_9fa48("515"), {
          id: stryMutAct_9fa48("516") ? false : (stryCov_9fa48("516"), true),
          email: stryMutAct_9fa48("517") ? false : (stryCov_9fa48("517"), true),
          name: stryMutAct_9fa48("518") ? false : (stryCov_9fa48("518"), true),
          lastName: stryMutAct_9fa48("519") ? false : (stryCov_9fa48("519"), true),
          contactNumber: stryMutAct_9fa48("520") ? false : (stryCov_9fa48("520"), true),
          role: stryMutAct_9fa48("521") ? false : (stryCov_9fa48("521"), true),
          createdAt: stryMutAct_9fa48("522") ? false : (stryCov_9fa48("522"), true),
          lastLogin: stryMutAct_9fa48("523") ? false : (stryCov_9fa48("523"), true)
        })
      }));
      return user;
    }
  }
  async findById(id: string): Promise<UserResponse | null> {
    if (stryMutAct_9fa48("524")) {
      {}
    } else {
      stryCov_9fa48("524");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("525") ? {} : (stryCov_9fa48("525"), {
        where: stryMutAct_9fa48("526") ? {} : (stryCov_9fa48("526"), {
          id
        }),
        select: stryMutAct_9fa48("527") ? {} : (stryCov_9fa48("527"), {
          id: stryMutAct_9fa48("528") ? false : (stryCov_9fa48("528"), true),
          email: stryMutAct_9fa48("529") ? false : (stryCov_9fa48("529"), true),
          name: stryMutAct_9fa48("530") ? false : (stryCov_9fa48("530"), true),
          lastName: stryMutAct_9fa48("531") ? false : (stryCov_9fa48("531"), true),
          contactNumber: stryMutAct_9fa48("532") ? false : (stryCov_9fa48("532"), true),
          role: stryMutAct_9fa48("533") ? false : (stryCov_9fa48("533"), true),
          createdAt: stryMutAct_9fa48("534") ? false : (stryCov_9fa48("534"), true),
          lastLogin: stryMutAct_9fa48("535") ? false : (stryCov_9fa48("535"), true)
        })
      }));
      return user;
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    if (stryMutAct_9fa48("536")) {
      {}
    } else {
      stryCov_9fa48("536");
      return this.prisma.user.findUnique(stryMutAct_9fa48("537") ? {} : (stryCov_9fa48("537"), {
        where: stryMutAct_9fa48("538") ? {} : (stryCov_9fa48("538"), {
          email
        })
      }));
    }
  }
  async findAll(): Promise<UserResponse[]> {
    if (stryMutAct_9fa48("539")) {
      {}
    } else {
      stryCov_9fa48("539");
      return this.prisma.user.findMany(stryMutAct_9fa48("540") ? {} : (stryCov_9fa48("540"), {
        select: stryMutAct_9fa48("541") ? {} : (stryCov_9fa48("541"), {
          id: stryMutAct_9fa48("542") ? false : (stryCov_9fa48("542"), true),
          email: stryMutAct_9fa48("543") ? false : (stryCov_9fa48("543"), true),
          name: stryMutAct_9fa48("544") ? false : (stryCov_9fa48("544"), true),
          lastName: stryMutAct_9fa48("545") ? false : (stryCov_9fa48("545"), true),
          contactNumber: stryMutAct_9fa48("546") ? false : (stryCov_9fa48("546"), true),
          role: stryMutAct_9fa48("547") ? false : (stryCov_9fa48("547"), true),
          createdAt: stryMutAct_9fa48("548") ? false : (stryCov_9fa48("548"), true),
          lastLogin: stryMutAct_9fa48("549") ? false : (stryCov_9fa48("549"), true)
        })
      }));
    }
  }
  async findAllWithFilters(filterDto: FilterUsersDto): Promise<PaginatedUsersResponse> {
    if (stryMutAct_9fa48("550")) {
      {}
    } else {
      stryCov_9fa48("550");
      const {
        search,
        role,
        createdFrom,
        createdTo,
        page = 1,
        limit = 20,
        sortBy = stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), 'createdAt'),
        sortOrder = stryMutAct_9fa48("552") ? "" : (stryCov_9fa48("552"), 'desc')
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
      if (stryMutAct_9fa48("554") ? false : stryMutAct_9fa48("553") ? true : (stryCov_9fa48("553", "554"), search)) {
        if (stryMutAct_9fa48("555")) {
          {}
        } else {
          stryCov_9fa48("555");
          where.OR = stryMutAct_9fa48("556") ? [] : (stryCov_9fa48("556"), [stryMutAct_9fa48("557") ? {} : (stryCov_9fa48("557"), {
            email: stryMutAct_9fa48("558") ? {} : (stryCov_9fa48("558"), {
              contains: search,
              mode: stryMutAct_9fa48("559") ? "" : (stryCov_9fa48("559"), 'insensitive')
            })
          }), stryMutAct_9fa48("560") ? {} : (stryCov_9fa48("560"), {
            name: stryMutAct_9fa48("561") ? {} : (stryCov_9fa48("561"), {
              contains: search,
              mode: stryMutAct_9fa48("562") ? "" : (stryCov_9fa48("562"), 'insensitive')
            })
          }), stryMutAct_9fa48("563") ? {} : (stryCov_9fa48("563"), {
            lastName: stryMutAct_9fa48("564") ? {} : (stryCov_9fa48("564"), {
              contains: search,
              mode: stryMutAct_9fa48("565") ? "" : (stryCov_9fa48("565"), 'insensitive')
            })
          })]);
        }
      }
      if (stryMutAct_9fa48("567") ? false : stryMutAct_9fa48("566") ? true : (stryCov_9fa48("566", "567"), role)) {
        if (stryMutAct_9fa48("568")) {
          {}
        } else {
          stryCov_9fa48("568");
          where.role = role;
        }
      }
      if (stryMutAct_9fa48("571") ? createdFrom && createdTo : stryMutAct_9fa48("570") ? false : stryMutAct_9fa48("569") ? true : (stryCov_9fa48("569", "570", "571"), createdFrom || createdTo)) {
        if (stryMutAct_9fa48("572")) {
          {}
        } else {
          stryCov_9fa48("572");
          where.createdAt = {};
          if (stryMutAct_9fa48("574") ? false : stryMutAct_9fa48("573") ? true : (stryCov_9fa48("573", "574"), createdFrom)) {
            if (stryMutAct_9fa48("575")) {
              {}
            } else {
              stryCov_9fa48("575");
              where.createdAt.gte = new Date(createdFrom);
            }
          }
          if (stryMutAct_9fa48("577") ? false : stryMutAct_9fa48("576") ? true : (stryCov_9fa48("576", "577"), createdTo)) {
            if (stryMutAct_9fa48("578")) {
              {}
            } else {
              stryCov_9fa48("578");
              where.createdAt.lte = new Date(createdTo);
            }
          }
        }
      }

      // Calculate skip for pagination
      const skip = stryMutAct_9fa48("579") ? (page - 1) / limit : (stryCov_9fa48("579"), (stryMutAct_9fa48("580") ? page + 1 : (stryCov_9fa48("580"), page - 1)) * limit);

      // Get total count for pagination
      const total = await this.prisma.user.count(stryMutAct_9fa48("581") ? {} : (stryCov_9fa48("581"), {
        where
      }));

      // Get users with pagination and sorting
      const users = await this.prisma.user.findMany(stryMutAct_9fa48("582") ? {} : (stryCov_9fa48("582"), {
        where,
        select: stryMutAct_9fa48("583") ? {} : (stryCov_9fa48("583"), {
          id: stryMutAct_9fa48("584") ? false : (stryCov_9fa48("584"), true),
          email: stryMutAct_9fa48("585") ? false : (stryCov_9fa48("585"), true),
          name: stryMutAct_9fa48("586") ? false : (stryCov_9fa48("586"), true),
          lastName: stryMutAct_9fa48("587") ? false : (stryCov_9fa48("587"), true),
          contactNumber: stryMutAct_9fa48("588") ? false : (stryCov_9fa48("588"), true),
          role: stryMutAct_9fa48("589") ? false : (stryCov_9fa48("589"), true),
          createdAt: stryMutAct_9fa48("590") ? false : (stryCov_9fa48("590"), true),
          lastLogin: stryMutAct_9fa48("591") ? false : (stryCov_9fa48("591"), true)
        }),
        orderBy: {
          [sortBy]: sortOrder
        } as Record<string, 'asc' | 'desc'>,
        skip,
        take: limit
      }));
      const totalPages = Math.ceil(stryMutAct_9fa48("592") ? total * limit : (stryCov_9fa48("592"), total / limit));
      return stryMutAct_9fa48("593") ? {} : (stryCov_9fa48("593"), {
        users,
        pagination: stryMutAct_9fa48("594") ? {} : (stryCov_9fa48("594"), {
          page,
          limit,
          total,
          totalPages,
          hasNext: stryMutAct_9fa48("598") ? page >= totalPages : stryMutAct_9fa48("597") ? page <= totalPages : stryMutAct_9fa48("596") ? false : stryMutAct_9fa48("595") ? true : (stryCov_9fa48("595", "596", "597", "598"), page < totalPages),
          hasPrev: stryMutAct_9fa48("602") ? page <= 1 : stryMutAct_9fa48("601") ? page >= 1 : stryMutAct_9fa48("600") ? false : stryMutAct_9fa48("599") ? true : (stryCov_9fa48("599", "600", "601", "602"), page > 1)
        })
      });
    }
  }
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    if (stryMutAct_9fa48("603")) {
      {}
    } else {
      stryCov_9fa48("603");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("604") ? {} : (stryCov_9fa48("604"), {
        where: stryMutAct_9fa48("605") ? {} : (stryCov_9fa48("605"), {
          id
        })
      }));
      if (stryMutAct_9fa48("608") ? false : stryMutAct_9fa48("607") ? true : stryMutAct_9fa48("606") ? user : (stryCov_9fa48("606", "607", "608"), !user)) {
        if (stryMutAct_9fa48("609")) {
          {}
        } else {
          stryCov_9fa48("609");
          throw new NotFoundException(stryMutAct_9fa48("610") ? `` : (stryCov_9fa48("610"), `User with ID ${id} not found`));
        }
      }
      const updatedUser = await this.prisma.user.update(stryMutAct_9fa48("611") ? {} : (stryCov_9fa48("611"), {
        where: stryMutAct_9fa48("612") ? {} : (stryCov_9fa48("612"), {
          id
        }),
        data: updateUserDto,
        select: stryMutAct_9fa48("613") ? {} : (stryCov_9fa48("613"), {
          id: stryMutAct_9fa48("614") ? false : (stryCov_9fa48("614"), true),
          email: stryMutAct_9fa48("615") ? false : (stryCov_9fa48("615"), true),
          name: stryMutAct_9fa48("616") ? false : (stryCov_9fa48("616"), true),
          lastName: stryMutAct_9fa48("617") ? false : (stryCov_9fa48("617"), true),
          contactNumber: stryMutAct_9fa48("618") ? false : (stryCov_9fa48("618"), true),
          role: stryMutAct_9fa48("619") ? false : (stryCov_9fa48("619"), true),
          createdAt: stryMutAct_9fa48("620") ? false : (stryCov_9fa48("620"), true),
          lastLogin: stryMutAct_9fa48("621") ? false : (stryCov_9fa48("621"), true)
        })
      }));
      return updatedUser;
    }
  }
  async updateTags(id: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _updateUserTagsDto: UpdateUserTagsDto): Promise<UserResponseWithTags> {
    if (stryMutAct_9fa48("622")) {
      {}
    } else {
      stryCov_9fa48("622");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("623") ? {} : (stryCov_9fa48("623"), {
        where: stryMutAct_9fa48("624") ? {} : (stryCov_9fa48("624"), {
          id
        })
      }));
      if (stryMutAct_9fa48("627") ? false : stryMutAct_9fa48("626") ? true : stryMutAct_9fa48("625") ? user : (stryCov_9fa48("625", "626", "627"), !user)) {
        if (stryMutAct_9fa48("628")) {
          {}
        } else {
          stryCov_9fa48("628");
          throw new NotFoundException(stryMutAct_9fa48("629") ? `` : (stryCov_9fa48("629"), `User with ID ${id} not found`));
        }
      }

      // Note: UserTag table doesn't exist in current schema
      // In production, implement user tags by adding UserTag model to schema
      // For now, we'll skip the tag operations
      // const { tagIds } = updateUserTagsDto; // Commented out since not used

      // Return user with tags (simplified since UserTag doesn't exist)
      const updatedUser = await this.prisma.user.findUnique(stryMutAct_9fa48("630") ? {} : (stryCov_9fa48("630"), {
        where: stryMutAct_9fa48("631") ? {} : (stryCov_9fa48("631"), {
          id
        }),
        select: stryMutAct_9fa48("632") ? {} : (stryCov_9fa48("632"), {
          id: stryMutAct_9fa48("633") ? false : (stryCov_9fa48("633"), true),
          email: stryMutAct_9fa48("634") ? false : (stryCov_9fa48("634"), true),
          name: stryMutAct_9fa48("635") ? false : (stryCov_9fa48("635"), true),
          lastName: stryMutAct_9fa48("636") ? false : (stryCov_9fa48("636"), true),
          contactNumber: stryMutAct_9fa48("637") ? false : (stryCov_9fa48("637"), true),
          role: stryMutAct_9fa48("638") ? false : (stryCov_9fa48("638"), true),
          createdAt: stryMutAct_9fa48("639") ? false : (stryCov_9fa48("639"), true),
          lastLogin: stryMutAct_9fa48("640") ? false : (stryCov_9fa48("640"), true)
        })
      }));
      if (stryMutAct_9fa48("643") ? false : stryMutAct_9fa48("642") ? true : stryMutAct_9fa48("641") ? updatedUser : (stryCov_9fa48("641", "642", "643"), !updatedUser)) {
        if (stryMutAct_9fa48("644")) {
          {}
        } else {
          stryCov_9fa48("644");
          throw new NotFoundException(stryMutAct_9fa48("645") ? `` : (stryCov_9fa48("645"), `User with ID ${id} not found`));
        }
      }
      return stryMutAct_9fa48("646") ? {} : (stryCov_9fa48("646"), {
        ...updatedUser,
        tags: stryMutAct_9fa48("647") ? ["Stryker was here"] : (stryCov_9fa48("647"), []) // Empty array since UserTag table doesn't exist
      });
    }
  }
  async delete(id: string): Promise<void> {
    if (stryMutAct_9fa48("648")) {
      {}
    } else {
      stryCov_9fa48("648");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("649") ? {} : (stryCov_9fa48("649"), {
        where: stryMutAct_9fa48("650") ? {} : (stryCov_9fa48("650"), {
          id
        })
      }));
      if (stryMutAct_9fa48("653") ? false : stryMutAct_9fa48("652") ? true : stryMutAct_9fa48("651") ? user : (stryCov_9fa48("651", "652", "653"), !user)) {
        if (stryMutAct_9fa48("654")) {
          {}
        } else {
          stryCov_9fa48("654");
          throw new NotFoundException(stryMutAct_9fa48("655") ? `` : (stryCov_9fa48("655"), `User with ID ${id} not found`));
        }
      }
      await this.prisma.user.delete(stryMutAct_9fa48("656") ? {} : (stryCov_9fa48("656"), {
        where: stryMutAct_9fa48("657") ? {} : (stryCov_9fa48("657"), {
          id
        })
      }));
    }
  }
  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    if (stryMutAct_9fa48("658")) {
      {}
    } else {
      stryCov_9fa48("658");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("659") ? {} : (stryCov_9fa48("659"), {
        where: stryMutAct_9fa48("660") ? {} : (stryCov_9fa48("660"), {
          id
        })
      }));
      if (stryMutAct_9fa48("663") ? false : stryMutAct_9fa48("662") ? true : stryMutAct_9fa48("661") ? user : (stryCov_9fa48("661", "662", "663"), !user)) {
        if (stryMutAct_9fa48("664")) {
          {}
        } else {
          stryCov_9fa48("664");
          throw new NotFoundException(stryMutAct_9fa48("665") ? `` : (stryCov_9fa48("665"), `User with ID ${id} not found`));
        }
      }
      return this.prisma.user.update(stryMutAct_9fa48("666") ? {} : (stryCov_9fa48("666"), {
        where: stryMutAct_9fa48("667") ? {} : (stryCov_9fa48("667"), {
          id
        }),
        data: stryMutAct_9fa48("668") ? {} : (stryCov_9fa48("668"), {
          password: hashedPassword
        })
      }));
    }
  }
  async markEmailAsVerified(id: string): Promise<EmailVerificationResponse> {
    if (stryMutAct_9fa48("669")) {
      {}
    } else {
      stryCov_9fa48("669");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("670") ? {} : (stryCov_9fa48("670"), {
        where: stryMutAct_9fa48("671") ? {} : (stryCov_9fa48("671"), {
          id
        })
      }));
      if (stryMutAct_9fa48("674") ? false : stryMutAct_9fa48("673") ? true : stryMutAct_9fa48("672") ? user : (stryCov_9fa48("672", "673", "674"), !user)) {
        if (stryMutAct_9fa48("675")) {
          {}
        } else {
          stryCov_9fa48("675");
          throw new NotFoundException(stryMutAct_9fa48("676") ? `` : (stryCov_9fa48("676"), `User with ID ${id} not found`));
        }
      }
      const updatedUser = await this.prisma.user.update(stryMutAct_9fa48("677") ? {} : (stryCov_9fa48("677"), {
        where: stryMutAct_9fa48("678") ? {} : (stryCov_9fa48("678"), {
          id
        }),
        data: stryMutAct_9fa48("679") ? {} : (stryCov_9fa48("679"), {
          emailVerified: new Date()
        }),
        select: stryMutAct_9fa48("680") ? {} : (stryCov_9fa48("680"), {
          id: stryMutAct_9fa48("681") ? false : (stryCov_9fa48("681"), true),
          email: stryMutAct_9fa48("682") ? false : (stryCov_9fa48("682"), true),
          emailVerified: stryMutAct_9fa48("683") ? false : (stryCov_9fa48("683"), true),
          name: stryMutAct_9fa48("684") ? false : (stryCov_9fa48("684"), true),
          lastName: stryMutAct_9fa48("685") ? false : (stryCov_9fa48("685"), true)
        })
      }));
      return updatedUser;
    }
  }
  async updateLastLogin(id: string): Promise<void> {
    if (stryMutAct_9fa48("686")) {
      {}
    } else {
      stryCov_9fa48("686");
      await this.prisma.user.update(stryMutAct_9fa48("687") ? {} : (stryCov_9fa48("687"), {
        where: stryMutAct_9fa48("688") ? {} : (stryCov_9fa48("688"), {
          id
        }),
        data: stryMutAct_9fa48("689") ? {} : (stryCov_9fa48("689"), {
          lastLogin: new Date()
        })
      }));
    }
  }
  async exists(id: string): Promise<boolean> {
    if (stryMutAct_9fa48("690")) {
      {}
    } else {
      stryCov_9fa48("690");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("691") ? {} : (stryCov_9fa48("691"), {
        where: stryMutAct_9fa48("692") ? {} : (stryCov_9fa48("692"), {
          id
        }),
        select: stryMutAct_9fa48("693") ? {} : (stryCov_9fa48("693"), {
          id: stryMutAct_9fa48("694") ? false : (stryCov_9fa48("694"), true)
        })
      }));
      return stryMutAct_9fa48("695") ? !user : (stryCov_9fa48("695"), !(stryMutAct_9fa48("696") ? user : (stryCov_9fa48("696"), !user)));
    }
  }
  async existsByEmail(email: string): Promise<boolean> {
    if (stryMutAct_9fa48("697")) {
      {}
    } else {
      stryCov_9fa48("697");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("698") ? {} : (stryCov_9fa48("698"), {
        where: stryMutAct_9fa48("699") ? {} : (stryCov_9fa48("699"), {
          email
        }),
        select: stryMutAct_9fa48("700") ? {} : (stryCov_9fa48("700"), {
          id: stryMutAct_9fa48("701") ? false : (stryCov_9fa48("701"), true)
        })
      }));
      return stryMutAct_9fa48("702") ? !user : (stryCov_9fa48("702"), !(stryMutAct_9fa48("703") ? user : (stryCov_9fa48("703"), !user)));
    }
  }
  async count(): Promise<number> {
    if (stryMutAct_9fa48("704")) {
      {}
    } else {
      stryCov_9fa48("704");
      return this.prisma.user.count();
    }
  }
  async countByFilters(where: Record<string, any>): Promise<number> {
    if (stryMutAct_9fa48("705")) {
      {}
    } else {
      stryCov_9fa48("705");
      return this.prisma.user.count(stryMutAct_9fa48("706") ? {} : (stryCov_9fa48("706"), {
        where
      }));
    }
  }
}