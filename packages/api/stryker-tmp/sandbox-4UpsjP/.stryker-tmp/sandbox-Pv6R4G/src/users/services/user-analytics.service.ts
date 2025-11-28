// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - User Analytics Only
// packages/api/src/users/services/user-analytics.service.ts
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
import { PrismaService } from '../../prisma.service';
import { IUserAnalytics, UserStats, GrowthStats, ActivityStats, DemographicsStats, RetentionStats, RoleDistribution, StatusDistribution, SourceDistribution, GeographicDistribution, LoginFrequencyStats, EngagementScore, TopUserStats, CohortSize } from '../interfaces/user-analytics.interface';
@Injectable()
export class UserAnalyticsService implements IUserAnalytics {
  constructor(private prisma: PrismaService) {}
  async getUserStats(): Promise<UserStats> {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      const thirtyDaysAgo = new Date();
      stryMutAct_9fa48("1") ? thirtyDaysAgo.setTime(thirtyDaysAgo.getDate() - 30) : (stryCov_9fa48("1"), thirtyDaysAgo.setDate(stryMutAct_9fa48("2") ? thirtyDaysAgo.getDate() + 30 : (stryCov_9fa48("2"), thirtyDaysAgo.getDate() - 30)));
      const [total, active, inactive, verified, unverified, recentSignups, deletedRecently] = await Promise.all(stryMutAct_9fa48("3") ? [] : (stryCov_9fa48("3"), [this.prisma.user.count(), this.prisma.user.count(stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
        where: stryMutAct_9fa48("5") ? {} : (stryCov_9fa48("5"), {
          lastLogin: stryMutAct_9fa48("6") ? {} : (stryCov_9fa48("6"), {
            gte: thirtyDaysAgo
          })
        })
      })), this.prisma.user.count(stryMutAct_9fa48("7") ? {} : (stryCov_9fa48("7"), {
        where: stryMutAct_9fa48("8") ? {} : (stryCov_9fa48("8"), {
          OR: stryMutAct_9fa48("9") ? [] : (stryCov_9fa48("9"), [stryMutAct_9fa48("10") ? {} : (stryCov_9fa48("10"), {
            lastLogin: null
          }), stryMutAct_9fa48("11") ? {} : (stryCov_9fa48("11"), {
            lastLogin: stryMutAct_9fa48("12") ? {} : (stryCov_9fa48("12"), {
              lt: thirtyDaysAgo
            })
          })])
        })
      })), this.prisma.user.count(stryMutAct_9fa48("13") ? {} : (stryCov_9fa48("13"), {
        where: stryMutAct_9fa48("14") ? {} : (stryCov_9fa48("14"), {
          emailVerified: stryMutAct_9fa48("15") ? {} : (stryCov_9fa48("15"), {
            not: null
          })
        })
      })), this.prisma.user.count(stryMutAct_9fa48("16") ? {} : (stryCov_9fa48("16"), {
        where: stryMutAct_9fa48("17") ? {} : (stryCov_9fa48("17"), {
          emailVerified: null
        })
      })), this.prisma.user.count(stryMutAct_9fa48("18") ? {} : (stryCov_9fa48("18"), {
        where: stryMutAct_9fa48("19") ? {} : (stryCov_9fa48("19"), {
          createdAt: stryMutAct_9fa48("20") ? {} : (stryCov_9fa48("20"), {
            gte: thirtyDaysAgo
          })
        })
      })),
      // Note: Assuming hard deletes since deletedAt field doesn't exist
      // In production, implement soft deletes by adding deletedAt to schema
      0 // Placeholder for deleted users count
      ]));
      return stryMutAct_9fa48("21") ? {} : (stryCov_9fa48("21"), {
        total,
        active,
        inactive,
        verified,
        unverified,
        recentSignups,
        deletedRecently
      });
    }
  }
  async getUserGrowthStats(days: number): Promise<GrowthStats[]> {
    if (stryMutAct_9fa48("22")) {
      {}
    } else {
      stryCov_9fa48("22");
      const startDate = new Date();
      stryMutAct_9fa48("23") ? startDate.setTime(startDate.getDate() - days) : (stryCov_9fa48("23"), startDate.setDate(stryMutAct_9fa48("24") ? startDate.getDate() + days : (stryCov_9fa48("24"), startDate.getDate() - days)));

      // This is a simplified version - in production you'd want to use raw SQL
      // or a more sophisticated aggregation for better performance
      const growthStats: GrowthStats[] = stryMutAct_9fa48("25") ? ["Stryker was here"] : (stryCov_9fa48("25"), []);
      for (let i = 0; stryMutAct_9fa48("28") ? i >= days : stryMutAct_9fa48("27") ? i <= days : stryMutAct_9fa48("26") ? false : (stryCov_9fa48("26", "27", "28"), i < days); stryMutAct_9fa48("29") ? i-- : (stryCov_9fa48("29"), i++)) {
        if (stryMutAct_9fa48("30")) {
          {}
        } else {
          stryCov_9fa48("30");
          const date = new Date(startDate);
          stryMutAct_9fa48("31") ? date.setTime(date.getDate() + i) : (stryCov_9fa48("31"), date.setDate(stryMutAct_9fa48("32") ? date.getDate() - i : (stryCov_9fa48("32"), date.getDate() + i)));
          const nextDate = new Date(date);
          stryMutAct_9fa48("33") ? nextDate.setTime(nextDate.getDate() + 1) : (stryCov_9fa48("33"), nextDate.setDate(stryMutAct_9fa48("34") ? nextDate.getDate() - 1 : (stryCov_9fa48("34"), nextDate.getDate() + 1)));
          const [newUsers, deletedUsers, totalUsers] = await Promise.all(stryMutAct_9fa48("35") ? [] : (stryCov_9fa48("35"), [this.prisma.user.count(stryMutAct_9fa48("36") ? {} : (stryCov_9fa48("36"), {
            where: stryMutAct_9fa48("37") ? {} : (stryCov_9fa48("37"), {
              createdAt: stryMutAct_9fa48("38") ? {} : (stryCov_9fa48("38"), {
                gte: date,
                lt: nextDate
              })
            })
          })),
          // Note: Hard deletes used, so deletedUsers = 0
          // In production, implement soft deletes for proper analytics
          Promise.resolve(0), this.prisma.user.count(stryMutAct_9fa48("39") ? {} : (stryCov_9fa48("39"), {
            where: stryMutAct_9fa48("40") ? {} : (stryCov_9fa48("40"), {
              createdAt: stryMutAct_9fa48("41") ? {} : (stryCov_9fa48("41"), {
                lt: nextDate
              })
              // Note: Using hard deletes, so all users are considered active
              // In production, add: OR: [{ deletedAt: null }, { deletedAt: { gte: nextDate } }]
            })
          }))]));
          growthStats.push(stryMutAct_9fa48("42") ? {} : (stryCov_9fa48("42"), {
            date: date.toISOString().split(stryMutAct_9fa48("43") ? "" : (stryCov_9fa48("43"), 'T'))[0],
            newUsers,
            deletedUsers,
            netGrowth: stryMutAct_9fa48("44") ? newUsers + deletedUsers : (stryCov_9fa48("44"), newUsers - deletedUsers),
            totalUsers
          }));
        }
      }
      return growthStats;
    }
  }
  async getUserActivityStats(days: number): Promise<ActivityStats> {
    if (stryMutAct_9fa48("45")) {
      {}
    } else {
      stryCov_9fa48("45");
      const startDate = new Date();
      stryMutAct_9fa48("46") ? startDate.setTime(startDate.getDate() - days) : (stryCov_9fa48("46"), startDate.setDate(stryMutAct_9fa48("47") ? startDate.getDate() + days : (stryCov_9fa48("47"), startDate.getDate() - days)));

      // This would require a sessions/login_attempts table in production
      // For now, we'll use simplified metrics based on lastLogin
      const [totalLogins, uniqueActiveUsers] = await Promise.all(stryMutAct_9fa48("48") ? [] : (stryCov_9fa48("48"), [
      // Simplified - in production you'd count actual login events
      this.prisma.user.count(stryMutAct_9fa48("49") ? {} : (stryCov_9fa48("49"), {
        where: stryMutAct_9fa48("50") ? {} : (stryCov_9fa48("50"), {
          lastLogin: stryMutAct_9fa48("51") ? {} : (stryCov_9fa48("51"), {
            gte: startDate
          })
        })
      })), this.prisma.user.count(stryMutAct_9fa48("52") ? {} : (stryCov_9fa48("52"), {
        where: stryMutAct_9fa48("53") ? {} : (stryCov_9fa48("53"), {
          lastLogin: stryMutAct_9fa48("54") ? {} : (stryCov_9fa48("54"), {
            gte: startDate
          })
        })
      }))]));
      return stryMutAct_9fa48("55") ? {} : (stryCov_9fa48("55"), {
        totalLogins,
        uniqueActiveUsers,
        averageSessionsPerUser: stryMutAct_9fa48("56") ? totalLogins * (uniqueActiveUsers || 1) : (stryCov_9fa48("56"), totalLogins / (stryMutAct_9fa48("59") ? uniqueActiveUsers && 1 : stryMutAct_9fa48("58") ? false : stryMutAct_9fa48("57") ? true : (stryCov_9fa48("57", "58", "59"), uniqueActiveUsers || 1))),
        peakActivityDay: new Date().toISOString().split(stryMutAct_9fa48("60") ? "" : (stryCov_9fa48("60"), 'T'))[0],
        // Simplified
        peakActivityHour: 14 // Simplified - 2 PM
      });
    }
  }
  async getUserDemographics(): Promise<DemographicsStats> {
    if (stryMutAct_9fa48("61")) {
      {}
    } else {
      stryCov_9fa48("61");
      const [roleDistribution, statusDistribution] = await Promise.all(stryMutAct_9fa48("62") ? [] : (stryCov_9fa48("62"), [this.getUsersByRole(), this.getUsersByStatus()]));

      // Simplified source distribution
      const sourceDistribution: SourceDistribution[] = stryMutAct_9fa48("63") ? [] : (stryCov_9fa48("63"), [stryMutAct_9fa48("64") ? {} : (stryCov_9fa48("64"), {
        source: stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), 'web'),
        count: 0,
        percentage: 0
      }), stryMutAct_9fa48("66") ? {} : (stryCov_9fa48("66"), {
        source: stryMutAct_9fa48("67") ? "" : (stryCov_9fa48("67"), 'mobile'),
        count: 0,
        percentage: 0
      }), stryMutAct_9fa48("68") ? {} : (stryCov_9fa48("68"), {
        source: stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), 'api'),
        count: 0,
        percentage: 0
      })]);
      return stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
        byRole: roleDistribution,
        byStatus: statusDistribution,
        byRegistrationSource: sourceDistribution
      });
    }
  }
  async getUserRetentionStats(days: number): Promise<RetentionStats> {
    if (stryMutAct_9fa48("71")) {
      {}
    } else {
      stryCov_9fa48("71");
      const startDate = new Date();
      stryMutAct_9fa48("72") ? startDate.setTime(startDate.getDate() - days) : (stryCov_9fa48("72"), startDate.setDate(stryMutAct_9fa48("73") ? startDate.getDate() + days : (stryCov_9fa48("73"), startDate.getDate() - days)));

      // Simplified retention calculation
      // In production, you'd want more sophisticated cohort analysis
      const totalUsers = await this.prisma.user.count(stryMutAct_9fa48("74") ? {} : (stryCov_9fa48("74"), {
        where: stryMutAct_9fa48("75") ? {} : (stryCov_9fa48("75"), {
          createdAt: stryMutAct_9fa48("76") ? {} : (stryCov_9fa48("76"), {
            gte: startDate
          })
        })
      }));
      const day1Active = await this.prisma.user.count(stryMutAct_9fa48("77") ? {} : (stryCov_9fa48("77"), {
        where: stryMutAct_9fa48("78") ? {} : (stryCov_9fa48("78"), {
          createdAt: stryMutAct_9fa48("79") ? {} : (stryCov_9fa48("79"), {
            gte: startDate
          }),
          lastLogin: stryMutAct_9fa48("80") ? {} : (stryCov_9fa48("80"), {
            gte: startDate
          })
        })
      }));
      return stryMutAct_9fa48("81") ? {} : (stryCov_9fa48("81"), {
        day1: (stryMutAct_9fa48("85") ? totalUsers <= 0 : stryMutAct_9fa48("84") ? totalUsers >= 0 : stryMutAct_9fa48("83") ? false : stryMutAct_9fa48("82") ? true : (stryCov_9fa48("82", "83", "84", "85"), totalUsers > 0)) ? stryMutAct_9fa48("86") ? day1Active / totalUsers / 100 : (stryCov_9fa48("86"), (stryMutAct_9fa48("87") ? day1Active * totalUsers : (stryCov_9fa48("87"), day1Active / totalUsers)) * 100) : 0,
        day7: 0,
        // Simplified
        day30: 0,
        // Simplified
        cohortSizes: stryMutAct_9fa48("88") ? ["Stryker was here"] : (stryCov_9fa48("88"), []) // Would require more complex queries
      });
    }
  }
  async getUsersByRole(): Promise<RoleDistribution[]> {
    if (stryMutAct_9fa48("89")) {
      {}
    } else {
      stryCov_9fa48("89");
      const roleStats = await this.prisma.user.groupBy(stryMutAct_9fa48("90") ? {} : (stryCov_9fa48("90"), {
        by: stryMutAct_9fa48("91") ? [] : (stryCov_9fa48("91"), [stryMutAct_9fa48("92") ? "" : (stryCov_9fa48("92"), 'role')]),
        _count: stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
          role: stryMutAct_9fa48("94") ? false : (stryCov_9fa48("94"), true)
        })
      }));
      const totalUsers = await this.prisma.user.count();
      return roleStats.map(stryMutAct_9fa48("95") ? () => undefined : (stryCov_9fa48("95"), stat => stryMutAct_9fa48("96") ? {} : (stryCov_9fa48("96"), {
        role: stat.role,
        count: stat._count.role,
        percentage: (stryMutAct_9fa48("100") ? totalUsers <= 0 : stryMutAct_9fa48("99") ? totalUsers >= 0 : stryMutAct_9fa48("98") ? false : stryMutAct_9fa48("97") ? true : (stryCov_9fa48("97", "98", "99", "100"), totalUsers > 0)) ? stryMutAct_9fa48("101") ? stat._count.role / totalUsers / 100 : (stryCov_9fa48("101"), (stryMutAct_9fa48("102") ? stat._count.role * totalUsers : (stryCov_9fa48("102"), stat._count.role / totalUsers)) * 100) : 0
      })));
    }
  }
  async getUsersByStatus(): Promise<StatusDistribution[]> {
    if (stryMutAct_9fa48("103")) {
      {}
    } else {
      stryCov_9fa48("103");
      const statusStats = await this.prisma.user.groupBy(stryMutAct_9fa48("104") ? {} : (stryCov_9fa48("104"), {
        by: stryMutAct_9fa48("105") ? [] : (stryCov_9fa48("105"), [stryMutAct_9fa48("106") ? "" : (stryCov_9fa48("106"), 'status')]),
        _count: stryMutAct_9fa48("107") ? {} : (stryCov_9fa48("107"), {
          status: stryMutAct_9fa48("108") ? false : (stryCov_9fa48("108"), true)
        })
      }));
      const totalUsers = await this.prisma.user.count();
      return statusStats.map(stryMutAct_9fa48("109") ? () => undefined : (stryCov_9fa48("109"), stat => stryMutAct_9fa48("110") ? {} : (stryCov_9fa48("110"), {
        status: stat.status,
        count: stat._count.status,
        percentage: (stryMutAct_9fa48("114") ? totalUsers <= 0 : stryMutAct_9fa48("113") ? totalUsers >= 0 : stryMutAct_9fa48("112") ? false : stryMutAct_9fa48("111") ? true : (stryCov_9fa48("111", "112", "113", "114"), totalUsers > 0)) ? stryMutAct_9fa48("115") ? stat._count.status / totalUsers / 100 : (stryCov_9fa48("115"), (stryMutAct_9fa48("116") ? stat._count.status * totalUsers : (stryCov_9fa48("116"), stat._count.status / totalUsers)) * 100) : 0
      })));
    }
  }
  async getActiveUsersCount(days: number): Promise<number> {
    if (stryMutAct_9fa48("117")) {
      {}
    } else {
      stryCov_9fa48("117");
      const startDate = new Date();
      stryMutAct_9fa48("118") ? startDate.setTime(startDate.getDate() - days) : (stryCov_9fa48("118"), startDate.setDate(stryMutAct_9fa48("119") ? startDate.getDate() + days : (stryCov_9fa48("119"), startDate.getDate() - days)));
      return this.prisma.user.count(stryMutAct_9fa48("120") ? {} : (stryCov_9fa48("120"), {
        where: stryMutAct_9fa48("121") ? {} : (stryCov_9fa48("121"), {
          lastLogin: stryMutAct_9fa48("122") ? {} : (stryCov_9fa48("122"), {
            gte: startDate
          })
        })
      }));
    }
  }
  async getInactiveUsersCount(days: number): Promise<number> {
    if (stryMutAct_9fa48("123")) {
      {}
    } else {
      stryCov_9fa48("123");
      const startDate = new Date();
      stryMutAct_9fa48("124") ? startDate.setTime(startDate.getDate() - days) : (stryCov_9fa48("124"), startDate.setDate(stryMutAct_9fa48("125") ? startDate.getDate() + days : (stryCov_9fa48("125"), startDate.getDate() - days)));
      return this.prisma.user.count(stryMutAct_9fa48("126") ? {} : (stryCov_9fa48("126"), {
        where: stryMutAct_9fa48("127") ? {} : (stryCov_9fa48("127"), {
          OR: stryMutAct_9fa48("128") ? [] : (stryCov_9fa48("128"), [stryMutAct_9fa48("129") ? {} : (stryCov_9fa48("129"), {
            lastLogin: null
          }), stryMutAct_9fa48("130") ? {} : (stryCov_9fa48("130"), {
            lastLogin: stryMutAct_9fa48("131") ? {} : (stryCov_9fa48("131"), {
              lt: startDate
            })
          })])
        })
      }));
    }
  }
  async getLoginFrequencyStats(days: number): Promise<LoginFrequencyStats> {
    if (stryMutAct_9fa48("132")) {
      {}
    } else {
      stryCov_9fa48("132");
      // Simplified implementation
      // In production, you'd analyze actual login patterns
      const activeUsers = await this.getActiveUsersCount(days);
      const totalUsers = await this.prisma.user.count();
      return stryMutAct_9fa48("133") ? {} : (stryCov_9fa48("133"), {
        daily: Math.round(stryMutAct_9fa48("134") ? activeUsers / 0.3 : (stryCov_9fa48("134"), activeUsers * 0.3)),
        weekly: Math.round(stryMutAct_9fa48("135") ? activeUsers / 0.4 : (stryCov_9fa48("135"), activeUsers * 0.4)),
        monthly: Math.round(stryMutAct_9fa48("136") ? activeUsers / 0.2 : (stryCov_9fa48("136"), activeUsers * 0.2)),
        rarely: Math.round(stryMutAct_9fa48("137") ? activeUsers / 0.1 : (stryCov_9fa48("137"), activeUsers * 0.1)),
        never: stryMutAct_9fa48("138") ? totalUsers + activeUsers : (stryCov_9fa48("138"), totalUsers - activeUsers)
      });
    }
  }
  async getUserEngagementScore(userId: string): Promise<EngagementScore> {
    if (stryMutAct_9fa48("139")) {
      {}
    } else {
      stryCov_9fa48("139");
      const user = await this.prisma.user.findUnique(stryMutAct_9fa48("140") ? {} : (stryCov_9fa48("140"), {
        where: stryMutAct_9fa48("141") ? {} : (stryCov_9fa48("141"), {
          id: userId
        })
      }));
      if (stryMutAct_9fa48("144") ? false : stryMutAct_9fa48("143") ? true : stryMutAct_9fa48("142") ? user : (stryCov_9fa48("142", "143", "144"), !user)) {
        if (stryMutAct_9fa48("145")) {
          {}
        } else {
          stryCov_9fa48("145");
          throw new Error(stryMutAct_9fa48("146") ? `` : (stryCov_9fa48("146"), `User ${userId} not found`));
        }
      }

      // Simplified engagement scoring
      const loginFrequency = user.lastLogin ? 80 : 20;
      const featureUsage = 70; // Would analyze actual feature usage
      const profileCompleteness = this.calculateProfileCompleteness(user);
      const socialEngagement = 60; // Would analyze social interactions

      const score = Math.round(stryMutAct_9fa48("147") ? (loginFrequency + featureUsage + profileCompleteness + socialEngagement) * 4 : (stryCov_9fa48("147"), (stryMutAct_9fa48("148") ? loginFrequency + featureUsage + profileCompleteness - socialEngagement : (stryCov_9fa48("148"), (stryMutAct_9fa48("149") ? loginFrequency + featureUsage - profileCompleteness : (stryCov_9fa48("149"), (stryMutAct_9fa48("150") ? loginFrequency - featureUsage : (stryCov_9fa48("150"), loginFrequency + featureUsage)) + profileCompleteness)) + socialEngagement)) / 4));
      return stryMutAct_9fa48("151") ? {} : (stryCov_9fa48("151"), {
        userId,
        score,
        factors: stryMutAct_9fa48("152") ? {} : (stryCov_9fa48("152"), {
          loginFrequency,
          featureUsage,
          profileCompleteness,
          socialEngagement
        }),
        category: (stryMutAct_9fa48("156") ? score < 70 : stryMutAct_9fa48("155") ? score > 70 : stryMutAct_9fa48("154") ? false : stryMutAct_9fa48("153") ? true : (stryCov_9fa48("153", "154", "155", "156"), score >= 70)) ? stryMutAct_9fa48("157") ? "" : (stryCov_9fa48("157"), 'high') : (stryMutAct_9fa48("161") ? score < 40 : stryMutAct_9fa48("160") ? score > 40 : stryMutAct_9fa48("159") ? false : stryMutAct_9fa48("158") ? true : (stryCov_9fa48("158", "159", "160", "161"), score >= 40)) ? stryMutAct_9fa48("162") ? "" : (stryCov_9fa48("162"), 'medium') : stryMutAct_9fa48("163") ? "" : (stryCov_9fa48("163"), 'low')
      });
    }
  }
  async getTopActiveUsers(limit: number, days: number): Promise<TopUserStats[]> {
    if (stryMutAct_9fa48("164")) {
      {}
    } else {
      stryCov_9fa48("164");
      const startDate = new Date();
      stryMutAct_9fa48("165") ? startDate.setTime(startDate.getDate() - days) : (stryCov_9fa48("165"), startDate.setDate(stryMutAct_9fa48("166") ? startDate.getDate() + days : (stryCov_9fa48("166"), startDate.getDate() - days)));
      const users = await this.prisma.user.findMany(stryMutAct_9fa48("167") ? {} : (stryCov_9fa48("167"), {
        where: stryMutAct_9fa48("168") ? {} : (stryCov_9fa48("168"), {
          lastLogin: stryMutAct_9fa48("169") ? {} : (stryCov_9fa48("169"), {
            gte: startDate
          })
        }),
        select: stryMutAct_9fa48("170") ? {} : (stryCov_9fa48("170"), {
          id: stryMutAct_9fa48("171") ? false : (stryCov_9fa48("171"), true),
          name: stryMutAct_9fa48("172") ? false : (stryCov_9fa48("172"), true),
          email: stryMutAct_9fa48("173") ? false : (stryCov_9fa48("173"), true),
          lastLogin: stryMutAct_9fa48("174") ? false : (stryCov_9fa48("174"), true)
        }),
        orderBy: stryMutAct_9fa48("175") ? {} : (stryCov_9fa48("175"), {
          lastLogin: stryMutAct_9fa48("176") ? "" : (stryCov_9fa48("176"), 'desc')
        }),
        take: limit
      }));
      return Promise.all(users.map(async user => {
        if (stryMutAct_9fa48("177")) {
          {}
        } else {
          stryCov_9fa48("177");
          const engagementScore = await this.getUserEngagementScore(user.id);
          return stryMutAct_9fa48("178") ? {} : (stryCov_9fa48("178"), {
            userId: user.id,
            name: stryMutAct_9fa48("181") ? user.name && 'Unknown' : stryMutAct_9fa48("180") ? false : stryMutAct_9fa48("179") ? true : (stryCov_9fa48("179", "180", "181"), user.name || (stryMutAct_9fa48("182") ? "" : (stryCov_9fa48("182"), 'Unknown'))),
            email: user.email,
            loginCount: 1,
            // Simplified - would count actual logins
            lastLogin: stryMutAct_9fa48("185") ? user.lastLogin && new Date() : stryMutAct_9fa48("184") ? false : stryMutAct_9fa48("183") ? true : (stryCov_9fa48("183", "184", "185"), user.lastLogin || new Date()),
            engagementScore: engagementScore.score
          });
        }
      }));
    }
  }

  // Private helper methods
  private calculateProfileCompleteness(user: any): number {
    if (stryMutAct_9fa48("186")) {
      {}
    } else {
      stryCov_9fa48("186");
      const fields = stryMutAct_9fa48("187") ? [] : (stryCov_9fa48("187"), [stryMutAct_9fa48("188") ? "" : (stryCov_9fa48("188"), 'name'), stryMutAct_9fa48("189") ? "" : (stryCov_9fa48("189"), 'lastName'), stryMutAct_9fa48("190") ? "" : (stryCov_9fa48("190"), 'contactNumber'), stryMutAct_9fa48("191") ? "" : (stryCov_9fa48("191"), 'emailVerified')]);
      const completedFields = stryMutAct_9fa48("192") ? fields : (stryCov_9fa48("192"), fields.filter(field => {
        if (stryMutAct_9fa48("193")) {
          {}
        } else {
          stryCov_9fa48("193");
          if (stryMutAct_9fa48("196") ? field !== 'emailVerified' : stryMutAct_9fa48("195") ? false : stryMutAct_9fa48("194") ? true : (stryCov_9fa48("194", "195", "196"), field === (stryMutAct_9fa48("197") ? "" : (stryCov_9fa48("197"), 'emailVerified')))) return stryMutAct_9fa48("200") ? user[field] === null : stryMutAct_9fa48("199") ? false : stryMutAct_9fa48("198") ? true : (stryCov_9fa48("198", "199", "200"), user[field] !== null);
          return stryMutAct_9fa48("203") ? user[field] || user[field].trim() !== '' : stryMutAct_9fa48("202") ? false : stryMutAct_9fa48("201") ? true : (stryCov_9fa48("201", "202", "203"), user[field] && (stryMutAct_9fa48("205") ? user[field].trim() === '' : stryMutAct_9fa48("204") ? true : (stryCov_9fa48("204", "205"), (stryMutAct_9fa48("206") ? user[field] : (stryCov_9fa48("206"), user[field].trim())) !== (stryMutAct_9fa48("207") ? "Stryker was here!" : (stryCov_9fa48("207"), '')))));
        }
      }));
      return Math.round(stryMutAct_9fa48("208") ? completedFields.length / fields.length / 100 : (stryCov_9fa48("208"), (stryMutAct_9fa48("209") ? completedFields.length * fields.length : (stryCov_9fa48("209"), completedFields.length / fields.length)) * 100));
    }
  }
}