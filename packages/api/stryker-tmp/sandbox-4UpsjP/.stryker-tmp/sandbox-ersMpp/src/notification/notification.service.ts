/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

// 

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */function stryNS_9fa48() {
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
import { PrismaService } from '../prisma.service';
import { CreateNotificationDto, NotificationType } from './dto/create-notification.dto';
interface Notification {
  id: string;
  message: string;
  type: string | null;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
  link: string | null;
}
interface NotificationGateway {
  sendNotificationToUser(userId: string, notification: Record<string, unknown>): Promise<void>;
}
interface WhereClause {
  userId: string;
  AND?: any[];
  OR?: any[];
  type?: any;
  read?: boolean;
  message?: any;
  createdAt?: {
    gte?: Date;
    lte?: Date;
  };
  id?: {
    gt?: string;
    lt?: string;
  };
  NOT?: any;
}
interface QueryOptions {
  where: any;
  orderBy: any;
  take?: number;
  skip?: number;
}
@Injectable()
export class NotificationService {
  private notificationGateway?: NotificationGateway;
  constructor(private prisma: PrismaService) {}
  setNotificationGateway(gateway: NotificationGateway) {
    if (stryMutAct_9fa48("1510")) {
      {}
    } else {
      stryCov_9fa48("1510");
      this.notificationGateway = gateway;
    }
  }
  async createNotification(createNotificationDto: CreateNotificationDto) {
    if (stryMutAct_9fa48("1511")) {
      {}
    } else {
      stryCov_9fa48("1511");
      return this.prisma.notification.create(stryMutAct_9fa48("1512") ? {} : (stryCov_9fa48("1512"), {
        data: createNotificationDto
      }));
    }
  }
  async notifyNewChatConversation(conversation: any) {
    if (stryMutAct_9fa48("1513")) {
      {}
    } else {
      stryCov_9fa48("1513");
      // Assuming a default admin user or a system-wide notification mechanism
      const adminUserId = stryMutAct_9fa48("1514") ? "" : (stryCov_9fa48("1514"), 'admin'); // TODO: Replace with actual admin user ID or logic to find relevant users
      await this.createNotification(stryMutAct_9fa48("1515") ? {} : (stryCov_9fa48("1515"), {
        userId: adminUserId,
        message: stryMutAct_9fa48("1516") ? `` : (stryCov_9fa48("1516"), `New chat conversation from ${stryMutAct_9fa48("1519") ? (conversation.contactInfo?.name || conversation.contactInfo?.email) && 'a visitor' : stryMutAct_9fa48("1518") ? false : stryMutAct_9fa48("1517") ? true : (stryCov_9fa48("1517", "1518", "1519"), (stryMutAct_9fa48("1521") ? conversation.contactInfo?.name && conversation.contactInfo?.email : stryMutAct_9fa48("1520") ? false : (stryCov_9fa48("1520", "1521"), (stryMutAct_9fa48("1522") ? conversation.contactInfo.name : (stryCov_9fa48("1522"), conversation.contactInfo?.name)) || (stryMutAct_9fa48("1523") ? conversation.contactInfo.email : (stryCov_9fa48("1523"), conversation.contactInfo?.email)))) || (stryMutAct_9fa48("1524") ? "" : (stryCov_9fa48("1524"), 'a visitor')))}`),
        type: NotificationType.CHAT_NEW_CONVERSATION,
        link: stryMutAct_9fa48("1525") ? `` : (stryCov_9fa48("1525"), `/dashboard/chat/${conversation.id}`)
      }));
    }
  }
  async notifyNewChatMessage(message: any) {
    if (stryMutAct_9fa48("1526")) {
      {}
    } else {
      stryCov_9fa48("1526");
      // Assuming a default admin user or a system-wide notification mechanism
      const adminUserId = stryMutAct_9fa48("1527") ? "" : (stryCov_9fa48("1527"), 'admin'); // TODO: Replace with actual admin user ID or logic to find relevant users
      await this.createNotification(stryMutAct_9fa48("1528") ? {} : (stryCov_9fa48("1528"), {
        userId: adminUserId,
        message: stryMutAct_9fa48("1529") ? `` : (stryCov_9fa48("1529"), `New message in conversation ${message.conversationId}: ${stryMutAct_9fa48("1530") ? message.content : (stryCov_9fa48("1530"), message.content.substring(0, 50))}...`),
        type: NotificationType.CHAT_NEW_MESSAGE,
        link: stryMutAct_9fa48("1531") ? `` : (stryCov_9fa48("1531"), `/dashboard/chat/${message.conversationId}`)
      }));
    }
  }
  async getNotifications(userId: string) {
    if (stryMutAct_9fa48("1532")) {
      {}
    } else {
      stryCov_9fa48("1532");
      return this.prisma.notification.findMany(stryMutAct_9fa48("1533") ? {} : (stryCov_9fa48("1533"), {
        where: stryMutAct_9fa48("1534") ? {} : (stryCov_9fa48("1534"), {
          userId
        }),
        orderBy: stryMutAct_9fa48("1535") ? {} : (stryCov_9fa48("1535"), {
          createdAt: stryMutAct_9fa48("1536") ? "" : (stryCov_9fa48("1536"), 'desc')
        })
      }));
    }
  }
  async markAsRead(notificationId: string) {
    if (stryMutAct_9fa48("1537")) {
      {}
    } else {
      stryCov_9fa48("1537");
      const notification = await this.prisma.notification.update(stryMutAct_9fa48("1538") ? {} : (stryCov_9fa48("1538"), {
        where: stryMutAct_9fa48("1539") ? {} : (stryCov_9fa48("1539"), {
          id: notificationId
        }),
        data: stryMutAct_9fa48("1540") ? {} : (stryCov_9fa48("1540"), {
          read: stryMutAct_9fa48("1541") ? false : (stryCov_9fa48("1541"), true)
        })
      }));

      // Send real-time update for unread count if gateway is available
      if (stryMutAct_9fa48("1543") ? false : stryMutAct_9fa48("1542") ? true : (stryCov_9fa48("1542", "1543"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1544")) {
          {}
        } else {
          stryCov_9fa48("1544");
          await this.notificationGateway.sendNotificationToUser(notification.userId, stryMutAct_9fa48("1545") ? {} : (stryCov_9fa48("1545"), {
            type: stryMutAct_9fa48("1546") ? "" : (stryCov_9fa48("1546"), 'notification_read'),
            notificationId: notification.id
          }));
        }
      }
      return notification;
    }
  }
  async markAsUnread(notificationId: string) {
    if (stryMutAct_9fa48("1547")) {
      {}
    } else {
      stryCov_9fa48("1547");
      const notification = await this.prisma.notification.update(stryMutAct_9fa48("1548") ? {} : (stryCov_9fa48("1548"), {
        where: stryMutAct_9fa48("1549") ? {} : (stryCov_9fa48("1549"), {
          id: notificationId
        }),
        data: stryMutAct_9fa48("1550") ? {} : (stryCov_9fa48("1550"), {
          read: stryMutAct_9fa48("1551") ? true : (stryCov_9fa48("1551"), false)
        })
      }));

      // Send real-time update for unread count if gateway is available
      if (stryMutAct_9fa48("1553") ? false : stryMutAct_9fa48("1552") ? true : (stryCov_9fa48("1552", "1553"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1554")) {
          {}
        } else {
          stryCov_9fa48("1554");
          await this.notificationGateway.sendNotificationToUser(notification.userId, stryMutAct_9fa48("1555") ? {} : (stryCov_9fa48("1555"), {
            type: stryMutAct_9fa48("1556") ? "" : (stryCov_9fa48("1556"), 'notification_unread'),
            notificationId: notification.id
          }));
        }
      }
      return notification;
    }
  }
  async deleteNotification(notificationId: string) {
    if (stryMutAct_9fa48("1557")) {
      {}
    } else {
      stryCov_9fa48("1557");
      const notification = await this.prisma.notification.delete(stryMutAct_9fa48("1558") ? {} : (stryCov_9fa48("1558"), {
        where: stryMutAct_9fa48("1559") ? {} : (stryCov_9fa48("1559"), {
          id: notificationId
        })
      }));

      // Send real-time update if gateway is available
      if (stryMutAct_9fa48("1561") ? false : stryMutAct_9fa48("1560") ? true : (stryCov_9fa48("1560", "1561"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1562")) {
          {}
        } else {
          stryCov_9fa48("1562");
          await this.notificationGateway.sendNotificationToUser(notification.userId, stryMutAct_9fa48("1563") ? {} : (stryCov_9fa48("1563"), {
            type: stryMutAct_9fa48("1564") ? "" : (stryCov_9fa48("1564"), 'notification_delete'),
            notificationId: notification.id
          }));
        }
      }
      return notification;
    }
  }
  async bulkMarkAsRead(notificationIds: string[]) {
    if (stryMutAct_9fa48("1565")) {
      {}
    } else {
      stryCov_9fa48("1565");
      const result = await this.prisma.notification.updateMany(stryMutAct_9fa48("1566") ? {} : (stryCov_9fa48("1566"), {
        where: stryMutAct_9fa48("1567") ? {} : (stryCov_9fa48("1567"), {
          id: stryMutAct_9fa48("1568") ? {} : (stryCov_9fa48("1568"), {
            in: notificationIds
          })
        }),
        data: stryMutAct_9fa48("1569") ? {} : (stryCov_9fa48("1569"), {
          read: stryMutAct_9fa48("1570") ? false : (stryCov_9fa48("1570"), true)
        })
      }));

      // Get affected user IDs for real-time updates
      const notifications = await this.prisma.notification.findMany(stryMutAct_9fa48("1571") ? {} : (stryCov_9fa48("1571"), {
        where: stryMutAct_9fa48("1572") ? {} : (stryCov_9fa48("1572"), {
          id: stryMutAct_9fa48("1573") ? {} : (stryCov_9fa48("1573"), {
            in: notificationIds
          })
        }),
        select: stryMutAct_9fa48("1574") ? {} : (stryCov_9fa48("1574"), {
          userId: stryMutAct_9fa48("1575") ? false : (stryCov_9fa48("1575"), true)
        })
      }));
      const userIds = stryMutAct_9fa48("1576") ? [] : (stryCov_9fa48("1576"), [...new Set(notifications.map(stryMutAct_9fa48("1577") ? () => undefined : (stryCov_9fa48("1577"), (n: {
        userId: string;
      }) => n.userId)))]);

      // Send real-time updates to affected users
      if (stryMutAct_9fa48("1579") ? false : stryMutAct_9fa48("1578") ? true : (stryCov_9fa48("1578", "1579"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1580")) {
          {}
        } else {
          stryCov_9fa48("1580");
          for (const userId of userIds) {
            if (stryMutAct_9fa48("1581")) {
              {}
            } else {
              stryCov_9fa48("1581");
              await this.notificationGateway.sendNotificationToUser(userId, stryMutAct_9fa48("1582") ? {} : (stryCov_9fa48("1582"), {
                type: stryMutAct_9fa48("1583") ? "" : (stryCov_9fa48("1583"), 'notification_bulk_read_selected'),
                notificationIds
              }));
            }
          }
        }
      }
      return result;
    }
  }
  async bulkMarkAsUnread(notificationIds: string[]) {
    if (stryMutAct_9fa48("1584")) {
      {}
    } else {
      stryCov_9fa48("1584");
      const result = await this.prisma.notification.updateMany(stryMutAct_9fa48("1585") ? {} : (stryCov_9fa48("1585"), {
        where: stryMutAct_9fa48("1586") ? {} : (stryCov_9fa48("1586"), {
          id: stryMutAct_9fa48("1587") ? {} : (stryCov_9fa48("1587"), {
            in: notificationIds
          })
        }),
        data: stryMutAct_9fa48("1588") ? {} : (stryCov_9fa48("1588"), {
          read: stryMutAct_9fa48("1589") ? true : (stryCov_9fa48("1589"), false)
        })
      }));

      // Get affected user IDs for real-time updates
      const notifications = await this.prisma.notification.findMany(stryMutAct_9fa48("1590") ? {} : (stryCov_9fa48("1590"), {
        where: stryMutAct_9fa48("1591") ? {} : (stryCov_9fa48("1591"), {
          id: stryMutAct_9fa48("1592") ? {} : (stryCov_9fa48("1592"), {
            in: notificationIds
          })
        }),
        select: stryMutAct_9fa48("1593") ? {} : (stryCov_9fa48("1593"), {
          userId: stryMutAct_9fa48("1594") ? false : (stryCov_9fa48("1594"), true)
        })
      }));
      const userIds = stryMutAct_9fa48("1595") ? [] : (stryCov_9fa48("1595"), [...new Set(notifications.map(stryMutAct_9fa48("1596") ? () => undefined : (stryCov_9fa48("1596"), (n: {
        userId: string;
      }) => n.userId)))]);

      // Send real-time updates to affected users
      if (stryMutAct_9fa48("1598") ? false : stryMutAct_9fa48("1597") ? true : (stryCov_9fa48("1597", "1598"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1599")) {
          {}
        } else {
          stryCov_9fa48("1599");
          for (const userId of userIds) {
            if (stryMutAct_9fa48("1600")) {
              {}
            } else {
              stryCov_9fa48("1600");
              await this.notificationGateway.sendNotificationToUser(userId, stryMutAct_9fa48("1601") ? {} : (stryCov_9fa48("1601"), {
                type: stryMutAct_9fa48("1602") ? "" : (stryCov_9fa48("1602"), 'notification_bulk_unread_selected'),
                notificationIds
              }));
            }
          }
        }
      }
      return result;
    }
  }
  async bulkDelete(notificationIds: string[]) {
    if (stryMutAct_9fa48("1603")) {
      {}
    } else {
      stryCov_9fa48("1603");
      // Get affected user IDs before deletion
      const notifications = await this.prisma.notification.findMany(stryMutAct_9fa48("1604") ? {} : (stryCov_9fa48("1604"), {
        where: stryMutAct_9fa48("1605") ? {} : (stryCov_9fa48("1605"), {
          id: stryMutAct_9fa48("1606") ? {} : (stryCov_9fa48("1606"), {
            in: notificationIds
          })
        }),
        select: stryMutAct_9fa48("1607") ? {} : (stryCov_9fa48("1607"), {
          userId: stryMutAct_9fa48("1608") ? false : (stryCov_9fa48("1608"), true)
        })
      }));
      const userIds = stryMutAct_9fa48("1609") ? [] : (stryCov_9fa48("1609"), [...new Set(notifications.map(stryMutAct_9fa48("1610") ? () => undefined : (stryCov_9fa48("1610"), (n: {
        userId: string;
      }) => n.userId)))]);
      const result = await this.prisma.notification.deleteMany(stryMutAct_9fa48("1611") ? {} : (stryCov_9fa48("1611"), {
        where: stryMutAct_9fa48("1612") ? {} : (stryCov_9fa48("1612"), {
          id: stryMutAct_9fa48("1613") ? {} : (stryCov_9fa48("1613"), {
            in: notificationIds
          })
        })
      }));

      // Send real-time updates to affected users
      if (stryMutAct_9fa48("1615") ? false : stryMutAct_9fa48("1614") ? true : (stryCov_9fa48("1614", "1615"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1616")) {
          {}
        } else {
          stryCov_9fa48("1616");
          for (const userId of userIds) {
            if (stryMutAct_9fa48("1617")) {
              {}
            } else {
              stryCov_9fa48("1617");
              await this.notificationGateway.sendNotificationToUser(userId, stryMutAct_9fa48("1618") ? {} : (stryCov_9fa48("1618"), {
                type: stryMutAct_9fa48("1619") ? "" : (stryCov_9fa48("1619"), 'notification_bulk_delete_selected'),
                notificationIds
              }));
            }
          }
        }
      }
      return result;
    }
  }
  async getNotificationsWithFilters(userId: string, filters: {
    search?: string;
    types?: string[];
    status?: 'all' | 'read' | 'unread';
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: 'newest' | 'oldest' | 'type';
    limit?: number;
    offset?: number;
  } = {}) {
    if (stryMutAct_9fa48("1620")) {
      {}
    } else {
      stryCov_9fa48("1620");
      const {
        search,
        types,
        status,
        dateFrom,
        dateTo,
        sortBy = stryMutAct_9fa48("1621") ? "" : (stryCov_9fa48("1621"), 'newest'),
        limit,
        offset
      } = filters;

      // Build where clause
      const where: WhereClause = stryMutAct_9fa48("1622") ? {} : (stryCov_9fa48("1622"), {
        userId
      });

      // Advanced search parsing
      if (stryMutAct_9fa48("1624") ? false : stryMutAct_9fa48("1623") ? true : (stryCov_9fa48("1623", "1624"), search)) {
        if (stryMutAct_9fa48("1625")) {
          {}
        } else {
          stryCov_9fa48("1625");
          const advancedSearch = this.parseAdvancedSearch(search);
          if (stryMutAct_9fa48("1627") ? false : stryMutAct_9fa48("1626") ? true : (stryCov_9fa48("1626", "1627"), advancedSearch)) {
            if (stryMutAct_9fa48("1628")) {
              {}
            } else {
              stryCov_9fa48("1628");
              Object.assign(where, advancedSearch);
            }
          } else {
            if (stryMutAct_9fa48("1629")) {
              {}
            } else {
              stryCov_9fa48("1629");
              // Fallback to simple search
              where.OR = stryMutAct_9fa48("1630") ? [] : (stryCov_9fa48("1630"), [stryMutAct_9fa48("1631") ? {} : (stryCov_9fa48("1631"), {
                message: stryMutAct_9fa48("1632") ? {} : (stryCov_9fa48("1632"), {
                  contains: search,
                  mode: stryMutAct_9fa48("1633") ? "" : (stryCov_9fa48("1633"), 'insensitive')
                })
              }), stryMutAct_9fa48("1634") ? {} : (stryCov_9fa48("1634"), {
                type: stryMutAct_9fa48("1635") ? {} : (stryCov_9fa48("1635"), {
                  contains: search,
                  mode: stryMutAct_9fa48("1636") ? "" : (stryCov_9fa48("1636"), 'insensitive')
                })
              })]);
            }
          }
        }
      }

      // Type filter (merge with advanced search type filters)
      if (stryMutAct_9fa48("1639") ? types || types.length > 0 : stryMutAct_9fa48("1638") ? false : stryMutAct_9fa48("1637") ? true : (stryCov_9fa48("1637", "1638", "1639"), types && (stryMutAct_9fa48("1642") ? types.length <= 0 : stryMutAct_9fa48("1641") ? types.length >= 0 : stryMutAct_9fa48("1640") ? true : (stryCov_9fa48("1640", "1641", "1642"), types.length > 0)))) {
        if (stryMutAct_9fa48("1643")) {
          {}
        } else {
          stryCov_9fa48("1643");
          if (stryMutAct_9fa48("1645") ? false : stryMutAct_9fa48("1644") ? true : (stryCov_9fa48("1644", "1645"), where.AND)) {
            if (stryMutAct_9fa48("1646")) {
              {}
            } else {
              stryCov_9fa48("1646");
              // Check if there's already a type filter from advanced search
              const existingTypeFilter = where.AND.find(stryMutAct_9fa48("1647") ? () => undefined : (stryCov_9fa48("1647"), (condition: any) => stryMutAct_9fa48("1648") ? condition.type.in : (stryCov_9fa48("1648"), condition.type?.in)));
              if (stryMutAct_9fa48("1650") ? false : stryMutAct_9fa48("1649") ? true : (stryCov_9fa48("1649", "1650"), existingTypeFilter)) {
                if (stryMutAct_9fa48("1651")) {
                  {}
                } else {
                  stryCov_9fa48("1651");
                  // Merge type filters
                  const existingTypes = existingTypeFilter.type.in;
                  const mergedTypes = stryMutAct_9fa48("1652") ? [] : (stryCov_9fa48("1652"), [...new Set(stryMutAct_9fa48("1653") ? [] : (stryCov_9fa48("1653"), [...existingTypes, ...types]))]);
                  existingTypeFilter.type.in = mergedTypes;
                }
              } else {
                if (stryMutAct_9fa48("1654")) {
                  {}
                } else {
                  stryCov_9fa48("1654");
                  where.AND.push(stryMutAct_9fa48("1655") ? {} : (stryCov_9fa48("1655"), {
                    type: stryMutAct_9fa48("1656") ? {} : (stryCov_9fa48("1656"), {
                      in: types
                    })
                  }));
                }
              }
            }
          } else {
            if (stryMutAct_9fa48("1657")) {
              {}
            } else {
              stryCov_9fa48("1657");
              where.type = stryMutAct_9fa48("1658") ? {} : (stryCov_9fa48("1658"), {
                in: types
              });
            }
          }
        }
      }

      // Status filter
      if (stryMutAct_9fa48("1661") ? status !== 'read' : stryMutAct_9fa48("1660") ? false : stryMutAct_9fa48("1659") ? true : (stryCov_9fa48("1659", "1660", "1661"), status === (stryMutAct_9fa48("1662") ? "" : (stryCov_9fa48("1662"), 'read')))) {
        if (stryMutAct_9fa48("1663")) {
          {}
        } else {
          stryCov_9fa48("1663");
          where.read = stryMutAct_9fa48("1664") ? false : (stryCov_9fa48("1664"), true);
        }
      } else if (stryMutAct_9fa48("1667") ? status !== 'unread' : stryMutAct_9fa48("1666") ? false : stryMutAct_9fa48("1665") ? true : (stryCov_9fa48("1665", "1666", "1667"), status === (stryMutAct_9fa48("1668") ? "" : (stryCov_9fa48("1668"), 'unread')))) {
        if (stryMutAct_9fa48("1669")) {
          {}
        } else {
          stryCov_9fa48("1669");
          where.read = stryMutAct_9fa48("1670") ? true : (stryCov_9fa48("1670"), false);
        }
      }

      // Date range filter
      if (stryMutAct_9fa48("1673") ? dateFrom && dateTo : stryMutAct_9fa48("1672") ? false : stryMutAct_9fa48("1671") ? true : (stryCov_9fa48("1671", "1672", "1673"), dateFrom || dateTo)) {
        if (stryMutAct_9fa48("1674")) {
          {}
        } else {
          stryCov_9fa48("1674");
          where.createdAt = {};
          if (stryMutAct_9fa48("1676") ? false : stryMutAct_9fa48("1675") ? true : (stryCov_9fa48("1675", "1676"), dateFrom)) {
            if (stryMutAct_9fa48("1677")) {
              {}
            } else {
              stryCov_9fa48("1677");
              where.createdAt.gte = dateFrom;
            }
          }
          if (stryMutAct_9fa48("1679") ? false : stryMutAct_9fa48("1678") ? true : (stryCov_9fa48("1678", "1679"), dateTo)) {
            if (stryMutAct_9fa48("1680")) {
              {}
            } else {
              stryCov_9fa48("1680");
              where.createdAt.lte = dateTo;
            }
          }
        }
      }

      // Build orderBy clause
      let orderBy: any = stryMutAct_9fa48("1681") ? {} : (stryCov_9fa48("1681"), {
        createdAt: stryMutAct_9fa48("1682") ? "" : (stryCov_9fa48("1682"), 'desc')
      });
      if (stryMutAct_9fa48("1685") ? sortBy !== 'oldest' : stryMutAct_9fa48("1684") ? false : stryMutAct_9fa48("1683") ? true : (stryCov_9fa48("1683", "1684", "1685"), sortBy === (stryMutAct_9fa48("1686") ? "" : (stryCov_9fa48("1686"), 'oldest')))) {
        if (stryMutAct_9fa48("1687")) {
          {}
        } else {
          stryCov_9fa48("1687");
          orderBy = stryMutAct_9fa48("1688") ? {} : (stryCov_9fa48("1688"), {
            createdAt: stryMutAct_9fa48("1689") ? "" : (stryCov_9fa48("1689"), 'asc')
          });
        }
      } else if (stryMutAct_9fa48("1692") ? sortBy !== 'type' : stryMutAct_9fa48("1691") ? false : stryMutAct_9fa48("1690") ? true : (stryCov_9fa48("1690", "1691", "1692"), sortBy === (stryMutAct_9fa48("1693") ? "" : (stryCov_9fa48("1693"), 'type')))) {
        if (stryMutAct_9fa48("1694")) {
          {}
        } else {
          stryCov_9fa48("1694");
          orderBy = stryMutAct_9fa48("1695") ? [] : (stryCov_9fa48("1695"), [stryMutAct_9fa48("1696") ? {} : (stryCov_9fa48("1696"), {
            type: stryMutAct_9fa48("1697") ? "" : (stryCov_9fa48("1697"), 'asc')
          }), stryMutAct_9fa48("1698") ? {} : (stryCov_9fa48("1698"), {
            createdAt: stryMutAct_9fa48("1699") ? "" : (stryCov_9fa48("1699"), 'desc')
          })]);
        }
      }

      // Execute query with pagination
      const query: QueryOptions = stryMutAct_9fa48("1700") ? {} : (stryCov_9fa48("1700"), {
        where,
        orderBy
      });
      if (stryMutAct_9fa48("1702") ? false : stryMutAct_9fa48("1701") ? true : (stryCov_9fa48("1701", "1702"), limit)) {
        if (stryMutAct_9fa48("1703")) {
          {}
        } else {
          stryCov_9fa48("1703");
          query.take = limit;
        }
      }
      if (stryMutAct_9fa48("1705") ? false : stryMutAct_9fa48("1704") ? true : (stryCov_9fa48("1704", "1705"), offset)) {
        if (stryMutAct_9fa48("1706")) {
          {}
        } else {
          stryCov_9fa48("1706");
          query.skip = offset;
        }
      }
      const [notifications, totalCount] = await Promise.all(stryMutAct_9fa48("1707") ? [] : (stryCov_9fa48("1707"), [this.prisma.notification.findMany(query), this.prisma.notification.count(stryMutAct_9fa48("1708") ? {} : (stryCov_9fa48("1708"), {
        where
      }))]));
      return stryMutAct_9fa48("1709") ? {} : (stryCov_9fa48("1709"), {
        notifications,
        totalCount,
        hasMore: limit ? stryMutAct_9fa48("1713") ? totalCount <= (offset || 0) + limit : stryMutAct_9fa48("1712") ? totalCount >= (offset || 0) + limit : stryMutAct_9fa48("1711") ? false : stryMutAct_9fa48("1710") ? true : (stryCov_9fa48("1710", "1711", "1712", "1713"), totalCount > (stryMutAct_9fa48("1717") ? offset && 0 : stryMutAct_9fa48("1716") ? false : stryMutAct_9fa48("1715") ? true : (stryCov_9fa48("1715", "1716", "1717"), offset || 0)) + limit) : stryMutAct_9fa48("1718") ? true : (stryCov_9fa48("1718"), false)
      });
    }
  }

  // Export notifications to CSV format
  async exportNotifications(userId: string, filters: {
    search?: string;
    types?: string[];
    status?: 'all' | 'read' | 'unread';
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: 'newest' | 'oldest' | 'type';
  } = {}) {
    if (stryMutAct_9fa48("1719")) {
      {}
    } else {
      stryCov_9fa48("1719");
      // Get all notifications without pagination for export
      const result = await this.getNotificationsWithFilters(userId, filters);
      const csvHeader = stryMutAct_9fa48("1720") ? "" : (stryCov_9fa48("1720"), 'ID,Message,Type,Status,Created At,Updated At,Link\n');
      const csvRows = result.notifications.map((notification: Notification) => {
        if (stryMutAct_9fa48("1721")) {
          {}
        } else {
          stryCov_9fa48("1721");
          const escapeCsv = (str: string | null) => {
            if (stryMutAct_9fa48("1722")) {
              {}
            } else {
              stryCov_9fa48("1722");
              if (stryMutAct_9fa48("1725") ? false : stryMutAct_9fa48("1724") ? true : stryMutAct_9fa48("1723") ? str : (stryCov_9fa48("1723", "1724", "1725"), !str)) return stryMutAct_9fa48("1726") ? "Stryker was here!" : (stryCov_9fa48("1726"), '');
              return stryMutAct_9fa48("1727") ? `` : (stryCov_9fa48("1727"), `"${str.replace(/"/g, stryMutAct_9fa48("1728") ? "" : (stryCov_9fa48("1728"), '""'))}"`);
            }
          };
          return (stryMutAct_9fa48("1729") ? [] : (stryCov_9fa48("1729"), [notification.id, escapeCsv(notification.message), notification.type, notification.read ? stryMutAct_9fa48("1730") ? "" : (stryCov_9fa48("1730"), 'Read') : stryMutAct_9fa48("1731") ? "" : (stryCov_9fa48("1731"), 'Unread'), notification.createdAt.toISOString(), notification.updatedAt.toISOString(), escapeCsv(notification.link)])).join(stryMutAct_9fa48("1732") ? "" : (stryCov_9fa48("1732"), ','));
        }
      }).join(stryMutAct_9fa48("1733") ? "" : (stryCov_9fa48("1733"), '\n'));
      return stryMutAct_9fa48("1734") ? {} : (stryCov_9fa48("1734"), {
        csv: csvHeader + csvRows,
        filename: stryMutAct_9fa48("1736") ? `` : (stryCov_9fa48("1736"), `notifications-${userId}-${new Date().toISOString().split(stryMutAct_9fa48("1737") ? "" : (stryCov_9fa48("1737"), 'T'))[0]}.csv`),
        count: result.notifications.length
      });
    }
  }

  // Get notification analytics
  async getNotificationAnalytics(userId: string, days: number = 30) {
    if (stryMutAct_9fa48("1738")) {
      {}
    } else {
      stryCov_9fa48("1738");
      const startDate = new Date();
      stryMutAct_9fa48("1739") ? startDate.setTime(startDate.getDate() - days) : (stryCov_9fa48("1739"), startDate.setDate(startDate.getDate() - days));
      const [totalCount, unreadCount, typeDistribution, dailyActivity, readCount] = await Promise.all(stryMutAct_9fa48("1741") ? [] : (stryCov_9fa48("1741"), [
      // Total notifications in period
      this.prisma.notification.count(stryMutAct_9fa48("1742") ? {} : (stryCov_9fa48("1742"), {
        where: stryMutAct_9fa48("1743") ? {} : (stryCov_9fa48("1743"), {
          userId,
          createdAt: stryMutAct_9fa48("1744") ? {} : (stryCov_9fa48("1744"), {
            gte: startDate
          })
        })
      })),
      // Unread notifications
      this.prisma.notification.count(stryMutAct_9fa48("1745") ? {} : (stryCov_9fa48("1745"), {
        where: stryMutAct_9fa48("1746") ? {} : (stryCov_9fa48("1746"), {
          userId,
          read: stryMutAct_9fa48("1747") ? true : (stryCov_9fa48("1747"), false),
          createdAt: stryMutAct_9fa48("1748") ? {} : (stryCov_9fa48("1748"), {
            gte: startDate
          })
        })
      })),
      // Type distribution
      this.prisma.notification.groupBy(stryMutAct_9fa48("1749") ? {} : (stryCov_9fa48("1749"), {
        by: stryMutAct_9fa48("1750") ? [] : (stryCov_9fa48("1750"), [stryMutAct_9fa48("1751") ? "" : (stryCov_9fa48("1751"), 'type')]),
        where: stryMutAct_9fa48("1752") ? {} : (stryCov_9fa48("1752"), {
          userId,
          createdAt: stryMutAct_9fa48("1753") ? {} : (stryCov_9fa48("1753"), {
            gte: startDate
          })
        }),
        _count: stryMutAct_9fa48("1754") ? {} : (stryCov_9fa48("1754"), {
          type: stryMutAct_9fa48("1755") ? false : (stryCov_9fa48("1755"), true)
        })
      })),
      // Daily activity (last 7 days)
      this.prisma.notification.groupBy(stryMutAct_9fa48("1756") ? {} : (stryCov_9fa48("1756"), {
        by: stryMutAct_9fa48("1757") ? [] : (stryCov_9fa48("1757"), [stryMutAct_9fa48("1758") ? "" : (stryCov_9fa48("1758"), 'createdAt')]),
        where: stryMutAct_9fa48("1759") ? {} : (stryCov_9fa48("1759"), {
          userId,
          createdAt: stryMutAct_9fa48("1760") ? {} : (stryCov_9fa48("1760"), {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          })
        }),
        _count: stryMutAct_9fa48("1766") ? {} : (stryCov_9fa48("1766"), {
          id: stryMutAct_9fa48("1767") ? false : (stryCov_9fa48("1767"), true)
        })
      })),
      // Read notifications count
      this.prisma.notification.count(stryMutAct_9fa48("1768") ? {} : (stryCov_9fa48("1768"), {
        where: stryMutAct_9fa48("1769") ? {} : (stryCov_9fa48("1769"), {
          userId,
          read: stryMutAct_9fa48("1770") ? false : (stryCov_9fa48("1770"), true),
          createdAt: stryMutAct_9fa48("1771") ? {} : (stryCov_9fa48("1771"), {
            gte: startDate
          })
        })
      }))]));

      // Calculate read rate
      const readRate = (stryMutAct_9fa48("1775") ? totalCount <= 0 : stryMutAct_9fa48("1774") ? totalCount >= 0 : stryMutAct_9fa48("1773") ? false : stryMutAct_9fa48("1772") ? true : (stryCov_9fa48("1772", "1773", "1774", "1775"), totalCount > 0)) ? readCount / totalCount * 100 : 0;
      return stryMutAct_9fa48("1778") ? {} : (stryCov_9fa48("1778"), {
        totalCount,
        unreadCount,
        readCount,
        readRate: Math.round(readRate * 100) / 100,
        // Round to 2 decimal places
        typeDistribution: typeDistribution.map(stryMutAct_9fa48("1781") ? () => undefined : (stryCov_9fa48("1781"), (item: {
          type: string | null;
          _count: {
            type: number;
          };
        }) => stryMutAct_9fa48("1782") ? {} : (stryCov_9fa48("1782"), {
          type: stryMutAct_9fa48("1785") ? item.type && 'unknown' : stryMutAct_9fa48("1784") ? false : stryMutAct_9fa48("1783") ? true : (stryCov_9fa48("1783", "1784", "1785"), item.type || (stryMutAct_9fa48("1786") ? "" : (stryCov_9fa48("1786"), 'unknown'))),
          count: item._count.type
        }))),
        dailyActivity: dailyActivity.map(stryMutAct_9fa48("1787") ? () => undefined : (stryCov_9fa48("1787"), (item: {
          createdAt: Date;
          _count: {
            id: number;
          };
        }) => stryMutAct_9fa48("1788") ? {} : (stryCov_9fa48("1788"), {
          date: item.createdAt,
          count: item._count.id
        })))
      });
    }
  }

  // Parse advanced search query
  private parseAdvancedSearch(searchQuery: string): WhereClause | null {
    if (stryMutAct_9fa48("1789")) {
      {}
    } else {
      stryCov_9fa48("1789");
      const conditions: any = stryMutAct_9fa48("1790") ? {} : (stryCov_9fa48("1790"), {
        AND: stryMutAct_9fa48("1791") ? ["Stryker was here"] : (stryCov_9fa48("1791"), []),
        OR: stryMutAct_9fa48("1792") ? ["Stryker was here"] : (stryCov_9fa48("1792"), [])
      });

      // Handle type: prefix
      const typeMatch = searchQuery.match(stryMutAct_9fa48("1794") ? /type:(\W+)/gi : stryMutAct_9fa48("1793") ? /type:(\w)/gi : (stryCov_9fa48("1793", "1794"), /type:(\w+)/gi));
      if (stryMutAct_9fa48("1796") ? false : stryMutAct_9fa48("1795") ? true : (stryCov_9fa48("1795", "1796"), typeMatch)) {
        if (stryMutAct_9fa48("1797")) {
          {}
        } else {
          stryCov_9fa48("1797");
          const types = typeMatch.map(stryMutAct_9fa48("1798") ? () => undefined : (stryCov_9fa48("1798"), match => stryMutAct_9fa48("1799") ? match.split(':')[1].toUpperCase() : (stryCov_9fa48("1799"), match.split(stryMutAct_9fa48("1800") ? "" : (stryCov_9fa48("1800"), ':'))[1].toLowerCase())));
          conditions.AND.push(stryMutAct_9fa48("1801") ? {} : (stryCov_9fa48("1801"), {
            type: stryMutAct_9fa48("1802") ? {} : (stryCov_9fa48("1802"), {
              in: types
            })
          }));
          // Remove type: patterns from search
          searchQuery = stryMutAct_9fa48("1803") ? searchQuery.replace(/type:\w+/gi, '') : (stryCov_9fa48("1803"), searchQuery.replace(stryMutAct_9fa48("1805") ? /type:\W+/gi : stryMutAct_9fa48("1804") ? /type:\w/gi : (stryCov_9fa48("1804", "1805"), /type:\w+/gi), stryMutAct_9fa48("1806") ? "Stryker was here!" : (stryCov_9fa48("1806"), '')).trim());
        }
      }

      // Handle quoted phrases
      const quotedPhrases = searchQuery.match(stryMutAct_9fa48("1808") ? /"(["]*)"/g : stryMutAct_9fa48("1807") ? /"([^"])"/g : (stryCov_9fa48("1807", "1808"), /"([^"]*)"/g));
      if (stryMutAct_9fa48("1810") ? false : stryMutAct_9fa48("1809") ? true : (stryCov_9fa48("1809", "1810"), quotedPhrases)) {
        if (stryMutAct_9fa48("1811")) {
          {}
        } else {
          stryCov_9fa48("1811");
          quotedPhrases.forEach(phrase => {
            if (stryMutAct_9fa48("1812")) {
              {}
            } else {
              stryCov_9fa48("1812");
              const cleanPhrase = phrase.replace(/"/g, stryMutAct_9fa48("1813") ? "Stryker was here!" : (stryCov_9fa48("1813"), ''));
              conditions.AND.push(stryMutAct_9fa48("1814") ? {} : (stryCov_9fa48("1814"), {
                OR: stryMutAct_9fa48("1815") ? [] : (stryCov_9fa48("1815"), [stryMutAct_9fa48("1816") ? {} : (stryCov_9fa48("1816"), {
                  message: stryMutAct_9fa48("1817") ? {} : (stryCov_9fa48("1817"), {
                    contains: cleanPhrase,
                    mode: stryMutAct_9fa48("1818") ? "" : (stryCov_9fa48("1818"), 'insensitive')
                  })
                }), stryMutAct_9fa48("1819") ? {} : (stryCov_9fa48("1819"), {
                  type: stryMutAct_9fa48("1820") ? {} : (stryCov_9fa48("1820"), {
                    contains: cleanPhrase,
                    mode: stryMutAct_9fa48("1821") ? "" : (stryCov_9fa48("1821"), 'insensitive')
                  })
                })])
              }));
            }
          });
          // Remove quoted phrases from search
          searchQuery = stryMutAct_9fa48("1822") ? searchQuery.replace(/"([^"]*)"/g, '') : (stryCov_9fa48("1822"), searchQuery.replace(stryMutAct_9fa48("1824") ? /"(["]*)"/g : stryMutAct_9fa48("1823") ? /"([^"])"/g : (stryCov_9fa48("1823", "1824"), /"([^"]*)"/g), stryMutAct_9fa48("1825") ? "Stryker was here!" : (stryCov_9fa48("1825"), '')).trim());
        }
      }

      // Handle OR conditions
      if (stryMutAct_9fa48("1827") ? false : stryMutAct_9fa48("1826") ? true : (stryCov_9fa48("1826", "1827"), searchQuery.includes(stryMutAct_9fa48("1828") ? "" : (stryCov_9fa48("1828"), ' OR ')))) {
        if (stryMutAct_9fa48("1829")) {
          {}
        } else {
          stryCov_9fa48("1829");
          const orTerms = stryMutAct_9fa48("1830") ? searchQuery.split(' OR ').map(term => term.trim()) : (stryCov_9fa48("1830"), searchQuery.split(stryMutAct_9fa48("1831") ? "" : (stryCov_9fa48("1831"), ' OR ')).map(stryMutAct_9fa48("1832") ? () => undefined : (stryCov_9fa48("1832"), term => stryMutAct_9fa48("1833") ? term : (stryCov_9fa48("1833"), term.trim()))).filter(Boolean));
          const orConditions = orTerms.map(stryMutAct_9fa48("1834") ? () => undefined : (stryCov_9fa48("1834"), term => stryMutAct_9fa48("1835") ? {} : (stryCov_9fa48("1835"), {
            OR: stryMutAct_9fa48("1836") ? [] : (stryCov_9fa48("1836"), [stryMutAct_9fa48("1837") ? {} : (stryCov_9fa48("1837"), {
              message: stryMutAct_9fa48("1838") ? {} : (stryCov_9fa48("1838"), {
                contains: term,
                mode: stryMutAct_9fa48("1839") ? "" : (stryCov_9fa48("1839"), 'insensitive')
              })
            }), stryMutAct_9fa48("1840") ? {} : (stryCov_9fa48("1840"), {
              type: stryMutAct_9fa48("1841") ? {} : (stryCov_9fa48("1841"), {
                contains: term,
                mode: stryMutAct_9fa48("1842") ? "" : (stryCov_9fa48("1842"), 'insensitive')
              })
            })])
          })));
          conditions.OR.push(...orConditions);
        }
      } else if (stryMutAct_9fa48("1844") ? false : stryMutAct_9fa48("1843") ? true : (stryCov_9fa48("1843", "1844"), searchQuery.includes(stryMutAct_9fa48("1845") ? "" : (stryCov_9fa48("1845"), ' AND ')))) {
        if (stryMutAct_9fa48("1846")) {
          {}
        } else {
          stryCov_9fa48("1846");
          // Handle AND conditions
          const andTerms = stryMutAct_9fa48("1847") ? searchQuery.split(' AND ').map(term => term.trim()) : (stryCov_9fa48("1847"), searchQuery.split(stryMutAct_9fa48("1848") ? "" : (stryCov_9fa48("1848"), ' AND ')).map(stryMutAct_9fa48("1849") ? () => undefined : (stryCov_9fa48("1849"), term => stryMutAct_9fa48("1850") ? term : (stryCov_9fa48("1850"), term.trim()))).filter(Boolean));
          andTerms.forEach(term => {
            if (stryMutAct_9fa48("1851")) {
              {}
            } else {
              stryCov_9fa48("1851");
              if (stryMutAct_9fa48("1854") ? term.endsWith('-') : stryMutAct_9fa48("1853") ? false : stryMutAct_9fa48("1852") ? true : (stryCov_9fa48("1852", "1853", "1854"), term.startsWith(stryMutAct_9fa48("1855") ? "" : (stryCov_9fa48("1855"), '-')))) {
                if (stryMutAct_9fa48("1856")) {
                  {}
                } else {
                  stryCov_9fa48("1856");
                  // Exclude term
                  const excludeTerm = stryMutAct_9fa48("1857") ? term : (stryCov_9fa48("1857"), term.substring(1));
                  conditions.AND.push(stryMutAct_9fa48("1858") ? {} : (stryCov_9fa48("1858"), {
                    NOT: stryMutAct_9fa48("1859") ? {} : (stryCov_9fa48("1859"), {
                      OR: stryMutAct_9fa48("1860") ? [] : (stryCov_9fa48("1860"), [stryMutAct_9fa48("1861") ? {} : (stryCov_9fa48("1861"), {
                        message: stryMutAct_9fa48("1862") ? {} : (stryCov_9fa48("1862"), {
                          contains: excludeTerm,
                          mode: stryMutAct_9fa48("1863") ? "" : (stryCov_9fa48("1863"), 'insensitive')
                        })
                      }), stryMutAct_9fa48("1864") ? {} : (stryCov_9fa48("1864"), {
                        type: stryMutAct_9fa48("1865") ? {} : (stryCov_9fa48("1865"), {
                          contains: excludeTerm,
                          mode: stryMutAct_9fa48("1866") ? "" : (stryCov_9fa48("1866"), 'insensitive')
                        })
                      })])
                    })
                  }));
                }
              } else {
                if (stryMutAct_9fa48("1867")) {
                  {}
                } else {
                  stryCov_9fa48("1867");
                  conditions.AND.push(stryMutAct_9fa48("1868") ? {} : (stryCov_9fa48("1868"), {
                    OR: stryMutAct_9fa48("1869") ? [] : (stryCov_9fa48("1869"), [stryMutAct_9fa48("1870") ? {} : (stryCov_9fa48("1870"), {
                      message: stryMutAct_9fa48("1871") ? {} : (stryCov_9fa48("1871"), {
                        contains: term,
                        mode: stryMutAct_9fa48("1872") ? "" : (stryCov_9fa48("1872"), 'insensitive')
                      })
                    }), stryMutAct_9fa48("1873") ? {} : (stryCov_9fa48("1873"), {
                      type: stryMutAct_9fa48("1874") ? {} : (stryCov_9fa48("1874"), {
                        contains: term,
                        mode: stryMutAct_9fa48("1875") ? "" : (stryCov_9fa48("1875"), 'insensitive')
                      })
                    })])
                  }));
                }
              }
            }
          });
        }
      } else {
        if (stryMutAct_9fa48("1876")) {
          {}
        } else {
          stryCov_9fa48("1876");
          // Handle simple search with exclusions
          const terms = stryMutAct_9fa48("1877") ? searchQuery.split(' ') : (stryCov_9fa48("1877"), searchQuery.split(stryMutAct_9fa48("1878") ? "" : (stryCov_9fa48("1878"), ' ')).filter(Boolean));
          terms.forEach(term => {
            if (stryMutAct_9fa48("1879")) {
              {}
            } else {
              stryCov_9fa48("1879");
              if (stryMutAct_9fa48("1882") ? term.endsWith('-') : stryMutAct_9fa48("1881") ? false : stryMutAct_9fa48("1880") ? true : (stryCov_9fa48("1880", "1881", "1882"), term.startsWith(stryMutAct_9fa48("1883") ? "" : (stryCov_9fa48("1883"), '-')))) {
                if (stryMutAct_9fa48("1884")) {
                  {}
                } else {
                  stryCov_9fa48("1884");
                  // Exclude term
                  const excludeTerm = stryMutAct_9fa48("1885") ? term : (stryCov_9fa48("1885"), term.substring(1));
                  conditions.AND.push(stryMutAct_9fa48("1886") ? {} : (stryCov_9fa48("1886"), {
                    NOT: stryMutAct_9fa48("1887") ? {} : (stryCov_9fa48("1887"), {
                      OR: stryMutAct_9fa48("1888") ? [] : (stryCov_9fa48("1888"), [stryMutAct_9fa48("1889") ? {} : (stryCov_9fa48("1889"), {
                        message: stryMutAct_9fa48("1890") ? {} : (stryCov_9fa48("1890"), {
                          contains: excludeTerm,
                          mode: stryMutAct_9fa48("1891") ? "" : (stryCov_9fa48("1891"), 'insensitive')
                        })
                      }), stryMutAct_9fa48("1892") ? {} : (stryCov_9fa48("1892"), {
                        type: stryMutAct_9fa48("1893") ? {} : (stryCov_9fa48("1893"), {
                          contains: excludeTerm,
                          mode: stryMutAct_9fa48("1894") ? "" : (stryCov_9fa48("1894"), 'insensitive')
                        })
                      })])
                    })
                  }));
                }
              } else {
                if (stryMutAct_9fa48("1895")) {
                  {}
                } else {
                  stryCov_9fa48("1895");
                  conditions.OR.push(stryMutAct_9fa48("1896") ? {} : (stryCov_9fa48("1896"), {
                    OR: stryMutAct_9fa48("1897") ? [] : (stryCov_9fa48("1897"), [stryMutAct_9fa48("1898") ? {} : (stryCov_9fa48("1898"), {
                      message: stryMutAct_9fa48("1899") ? {} : (stryCov_9fa48("1899"), {
                        contains: term,
                        mode: stryMutAct_9fa48("1900") ? "" : (stryCov_9fa48("1900"), 'insensitive')
                      })
                    }), stryMutAct_9fa48("1901") ? {} : (stryCov_9fa48("1901"), {
                      type: stryMutAct_9fa48("1902") ? {} : (stryCov_9fa48("1902"), {
                        contains: term,
                        mode: stryMutAct_9fa48("1903") ? "" : (stryCov_9fa48("1903"), 'insensitive')
                      })
                    })])
                  }));
                }
              }
            }
          });
        }
      }

      // Clean up empty arrays
      if (stryMutAct_9fa48("1906") ? conditions.AND.length !== 0 : stryMutAct_9fa48("1905") ? false : stryMutAct_9fa48("1904") ? true : (stryCov_9fa48("1904", "1905", "1906"), conditions.AND.length === 0)) delete conditions.AND;
      if (stryMutAct_9fa48("1909") ? conditions.OR.length !== 0 : stryMutAct_9fa48("1908") ? false : stryMutAct_9fa48("1907") ? true : (stryCov_9fa48("1907", "1908", "1909"), conditions.OR.length === 0)) delete conditions.OR;
      return (stryMutAct_9fa48("1913") ? Object.keys(conditions).length <= 0 : stryMutAct_9fa48("1912") ? Object.keys(conditions).length >= 0 : stryMutAct_9fa48("1911") ? false : stryMutAct_9fa48("1910") ? true : (stryCov_9fa48("1910", "1911", "1912", "1913"), Object.keys(conditions).length > 0)) ? conditions : null;
    }
  }
  async getUnreadCount(userId: string) {
    if (stryMutAct_9fa48("1914")) {
      {}
    } else {
      stryCov_9fa48("1914");
      return this.prisma.notification.count(stryMutAct_9fa48("1915") ? {} : (stryCov_9fa48("1915"), {
        where: stryMutAct_9fa48("1916") ? {} : (stryCov_9fa48("1916"), {
          userId,
          read: stryMutAct_9fa48("1917") ? true : (stryCov_9fa48("1917"), false)
        })
      }));
    }
  }

  // Bulk operations
  async markAllAsRead(userId: string) {
    if (stryMutAct_9fa48("1918")) {
      {}
    } else {
      stryCov_9fa48("1918");
      const result = await this.prisma.notification.updateMany(stryMutAct_9fa48("1919") ? {} : (stryCov_9fa48("1919"), {
        where: stryMutAct_9fa48("1920") ? {} : (stryCov_9fa48("1920"), {
          userId,
          read: stryMutAct_9fa48("1921") ? true : (stryCov_9fa48("1921"), false)
        }),
        data: stryMutAct_9fa48("1922") ? {} : (stryCov_9fa48("1922"), {
          read: stryMutAct_9fa48("1923") ? false : (stryCov_9fa48("1923"), true)
        })
      }));

      // Send real-time update for unread count if gateway is available
      if (stryMutAct_9fa48("1925") ? false : stryMutAct_9fa48("1924") ? true : (stryCov_9fa48("1924", "1925"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1926")) {
          {}
        } else {
          stryCov_9fa48("1926");
          await this.notificationGateway.sendNotificationToUser(userId, stryMutAct_9fa48("1927") ? {} : (stryCov_9fa48("1927"), {
            type: stryMutAct_9fa48("1928") ? "" : (stryCov_9fa48("1928"), 'notification_bulk_read'),
            count: result.count
          }));
        }
      }
      return result;
    }
  }
  async deleteAllNotifications(userId: string) {
    if (stryMutAct_9fa48("1929")) {
      {}
    } else {
      stryCov_9fa48("1929");
      const result = await this.prisma.notification.deleteMany(stryMutAct_9fa48("1930") ? {} : (stryCov_9fa48("1930"), {
        where: stryMutAct_9fa48("1931") ? {} : (stryCov_9fa48("1931"), {
          userId
        })
      }));

      // Send real-time update if gateway is available
      if (stryMutAct_9fa48("1933") ? false : stryMutAct_9fa48("1932") ? true : (stryCov_9fa48("1932", "1933"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1934")) {
          {}
        } else {
          stryCov_9fa48("1934");
          await this.notificationGateway.sendNotificationToUser(userId, stryMutAct_9fa48("1935") ? {} : (stryCov_9fa48("1935"), {
            type: stryMutAct_9fa48("1936") ? "" : (stryCov_9fa48("1936"), 'notification_bulk_delete'),
            count: result.count
          }));
        }
      }
      return result;
    }
  }
  async deleteReadNotifications(userId: string) {
    if (stryMutAct_9fa48("1937")) {
      {}
    } else {
      stryCov_9fa48("1937");
      const result = await this.prisma.notification.deleteMany(stryMutAct_9fa48("1938") ? {} : (stryCov_9fa48("1938"), {
        where: stryMutAct_9fa48("1939") ? {} : (stryCov_9fa48("1939"), {
          userId,
          read: stryMutAct_9fa48("1940") ? false : (stryCov_9fa48("1940"), true)
        })
      }));

      // Send real-time update if gateway is available
      if (stryMutAct_9fa48("1942") ? false : stryMutAct_9fa48("1941") ? true : (stryCov_9fa48("1941", "1942"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1943")) {
          {}
        } else {
          stryCov_9fa48("1943");
          await this.notificationGateway.sendNotificationToUser(userId, stryMutAct_9fa48("1944") ? {} : (stryCov_9fa48("1944"), {
            type: stryMutAct_9fa48("1945") ? "" : (stryCov_9fa48("1945"), 'notification_bulk_delete_read'),
            count: result.count
          }));
        }
      }
      return result;
    }
  }
  async deleteNotificationsByType(userId: string, type: string) {
    if (stryMutAct_9fa48("1946")) {
      {}
    } else {
      stryCov_9fa48("1946");
      const result = await this.prisma.notification.deleteMany(stryMutAct_9fa48("1947") ? {} : (stryCov_9fa48("1947"), {
        where: stryMutAct_9fa48("1948") ? {} : (stryCov_9fa48("1948"), {
          userId,
          type
        })
      }));

      // Send real-time update if gateway is available
      if (stryMutAct_9fa48("1950") ? false : stryMutAct_9fa48("1949") ? true : (stryCov_9fa48("1949", "1950"), this.notificationGateway)) {
        if (stryMutAct_9fa48("1951")) {
          {}
        } else {
          stryCov_9fa48("1951");
          await this.notificationGateway.sendNotificationToUser(userId, stryMutAct_9fa48("1952") ? {} : (stryCov_9fa48("1952"), {
            type: stryMutAct_9fa48("1953") ? "" : (stryCov_9fa48("1953"), 'notification_bulk_delete_by_type'),
            notificationType: type,
            count: result.count
          }));
        }
      }
      return result;
    }
  }
  async getNotificationStats(userId: string) {
    if (stryMutAct_9fa48("1954")) {
      {}
    } else {
      stryCov_9fa48("1954");
      const [total, unread, byType] = await Promise.all(stryMutAct_9fa48("1955") ? [] : (stryCov_9fa48("1955"), [this.prisma.notification.count(stryMutAct_9fa48("1956") ? {} : (stryCov_9fa48("1956"), {
        where: stryMutAct_9fa48("1957") ? {} : (stryCov_9fa48("1957"), {
          userId
        })
      })), this.prisma.notification.count(stryMutAct_9fa48("1958") ? {} : (stryCov_9fa48("1958"), {
        where: stryMutAct_9fa48("1959") ? {} : (stryCov_9fa48("1959"), {
          userId,
          read: stryMutAct_9fa48("1960") ? true : (stryCov_9fa48("1960"), false)
        })
      })), this.prisma.notification.groupBy(stryMutAct_9fa48("1961") ? {} : (stryCov_9fa48("1961"), {
        by: stryMutAct_9fa48("1962") ? [] : (stryCov_9fa48("1962"), [stryMutAct_9fa48("1963") ? "" : (stryCov_9fa48("1963"), 'type')]),
        where: stryMutAct_9fa48("1964") ? {} : (stryCov_9fa48("1964"), {
          userId
        }),
        _count: stryMutAct_9fa48("1965") ? {} : (stryCov_9fa48("1965"), {
          type: stryMutAct_9fa48("1966") ? false : (stryCov_9fa48("1966"), true)
        })
      }))]));
      return stryMutAct_9fa48("1967") ? {} : (stryCov_9fa48("1967"), {
        total,
        unread,
        read: total - unread,
        byType: byType.map(stryMutAct_9fa48("1969") ? () => undefined : (stryCov_9fa48("1969"), (item: {
          type: string | null;
          _count: {
            type: number;
          };
        }) => stryMutAct_9fa48("1970") ? {} : (stryCov_9fa48("1970"), {
          type: stryMutAct_9fa48("1973") ? item.type && 'unknown' : stryMutAct_9fa48("1972") ? false : stryMutAct_9fa48("1971") ? true : (stryCov_9fa48("1971", "1972", "1973"), item.type || (stryMutAct_9fa48("1974") ? "" : (stryCov_9fa48("1974"), 'unknown'))),
          count: item._count.type
        })))
      });
    }
  }

  // Notification Preferences
  async getUserPreferences(userId: string) {
    if (stryMutAct_9fa48("1975")) {
      {}
    } else {
      stryCov_9fa48("1975");
      return this.prisma.notificationPreference.findUnique(stryMutAct_9fa48("1976") ? {} : (stryCov_9fa48("1976"), {
        where: stryMutAct_9fa48("1977") ? {} : (stryCov_9fa48("1977"), {
          userId
        })
      }));
    }
  }
  async createOrUpdatePreferences(userId: string, preferences: Record<string, any>) {
    if (stryMutAct_9fa48("1978")) {
      {}
    } else {
      stryCov_9fa48("1978");
      return this.prisma.notificationPreference.upsert(stryMutAct_9fa48("1979") ? {} : (stryCov_9fa48("1979"), {
        where: stryMutAct_9fa48("1980") ? {} : (stryCov_9fa48("1980"), {
          userId
        }),
        create: stryMutAct_9fa48("1981") ? {} : (stryCov_9fa48("1981"), {
          userId,
          ...preferences
        }),
        update: preferences
      }));
    }
  }
  getDefaultPreferences() {
    if (stryMutAct_9fa48("1982")) {
      {}
    } else {
      stryCov_9fa48("1982");
      return stryMutAct_9fa48("1983") ? {} : (stryCov_9fa48("1983"), {
        emailEnabled: stryMutAct_9fa48("1984") ? false : (stryCov_9fa48("1984"), true),
        emailTypes: stryMutAct_9fa48("1985") ? [] : (stryCov_9fa48("1985"), [stryMutAct_9fa48("1986") ? "" : (stryCov_9fa48("1986"), 'welcome'), stryMutAct_9fa48("1987") ? "" : (stryCov_9fa48("1987"), 'security'), stryMutAct_9fa48("1988") ? "" : (stryCov_9fa48("1988"), 'billing')]),
        pushEnabled: stryMutAct_9fa48("1989") ? false : (stryCov_9fa48("1989"), true),
        pushTypes: stryMutAct_9fa48("1990") ? [] : (stryCov_9fa48("1990"), [stryMutAct_9fa48("1991") ? "" : (stryCov_9fa48("1991"), 'urgent'), stryMutAct_9fa48("1992") ? "" : (stryCov_9fa48("1992"), 'reminders')]),
        inAppEnabled: stryMutAct_9fa48("1993") ? false : (stryCov_9fa48("1993"), true),
        inAppTypes: stryMutAct_9fa48("1994") ? [] : (stryCov_9fa48("1994"), [stryMutAct_9fa48("1995") ? "" : (stryCov_9fa48("1995"), 'all')]),
        emailFrequency: stryMutAct_9fa48("1996") ? "" : (stryCov_9fa48("1996"), 'immediate'),
        digestEnabled: stryMutAct_9fa48("1997") ? true : (stryCov_9fa48("1997"), false),
        quietHoursEnabled: stryMutAct_9fa48("1998") ? true : (stryCov_9fa48("1998"), false),
        quietHoursStart: null,
        quietHoursEnd: null,
        marketingEnabled: stryMutAct_9fa48("1999") ? true : (stryCov_9fa48("1999"), false),
        promotionalEnabled: stryMutAct_9fa48("2000") ? true : (stryCov_9fa48("2000"), false)
      });
    }
  }
  async deletePreferences(userId: string) {
    if (stryMutAct_9fa48("2001")) {
      {}
    } else {
      stryCov_9fa48("2001");
      return this.prisma.notificationPreference.delete(stryMutAct_9fa48("2002") ? {} : (stryCov_9fa48("2002"), {
        where: stryMutAct_9fa48("2003") ? {} : (stryCov_9fa48("2003"), {
          userId
        })
      }));
    }
  }
  async shouldSendNotification(userId: string, notificationType: string, channel: 'email' | 'push' | 'inApp'): Promise<boolean> {
    if (stryMutAct_9fa48("2004")) {
      {}
    } else {
      stryCov_9fa48("2004");
      const preferences = await this.getUserPreferences(userId);
      if (stryMutAct_9fa48("2007") ? false : stryMutAct_9fa48("2006") ? true : stryMutAct_9fa48("2005") ? preferences : (stryCov_9fa48("2005", "2006", "2007"), !preferences)) {
        if (stryMutAct_9fa48("2008")) {
          {}
        } else {
          stryCov_9fa48("2008");
          // Use default preferences if none exist
          const defaults = this.getDefaultPreferences();
          switch (channel) {
            case stryMutAct_9fa48("2010") ? "" : (stryCov_9fa48("2010"), 'email'):
              if (stryMutAct_9fa48("2009")) {} else {
                stryCov_9fa48("2009");
                return stryMutAct_9fa48("2013") ? defaults.emailEnabled || defaults.emailTypes.includes(notificationType) : stryMutAct_9fa48("2012") ? false : stryMutAct_9fa48("2011") ? true : (stryCov_9fa48("2011", "2012", "2013"), defaults.emailEnabled && defaults.emailTypes.includes(notificationType));
              }
            case stryMutAct_9fa48("2015") ? "" : (stryCov_9fa48("2015"), 'push'):
              if (stryMutAct_9fa48("2014")) {} else {
                stryCov_9fa48("2014");
                return stryMutAct_9fa48("2018") ? defaults.pushEnabled || defaults.pushTypes.includes(notificationType) : stryMutAct_9fa48("2017") ? false : stryMutAct_9fa48("2016") ? true : (stryCov_9fa48("2016", "2017", "2018"), defaults.pushEnabled && defaults.pushTypes.includes(notificationType));
              }
            case stryMutAct_9fa48("2020") ? "" : (stryCov_9fa48("2020"), 'inApp'):
              if (stryMutAct_9fa48("2019")) {} else {
                stryCov_9fa48("2019");
                return stryMutAct_9fa48("2023") ? defaults.inAppEnabled || defaults.inAppTypes.includes('all') || defaults.inAppTypes.includes(notificationType) : stryMutAct_9fa48("2022") ? false : stryMutAct_9fa48("2021") ? true : (stryCov_9fa48("2021", "2022", "2023"), defaults.inAppEnabled && (stryMutAct_9fa48("2025") ? defaults.inAppTypes.includes('all') && defaults.inAppTypes.includes(notificationType) : stryMutAct_9fa48("2024") ? true : (stryCov_9fa48("2024", "2025"), defaults.inAppTypes.includes(stryMutAct_9fa48("2026") ? "" : (stryCov_9fa48("2026"), 'all')) || defaults.inAppTypes.includes(notificationType))));
              }
            default:
              if (stryMutAct_9fa48("2027")) {} else {
                stryCov_9fa48("2027");
                return stryMutAct_9fa48("2028") ? true : (stryCov_9fa48("2028"), false);
              }
          }
        }
      }

      // Check if user is in quiet hours
      if (stryMutAct_9fa48("2031") ? preferences.quietHoursEnabled || (await this.isInQuietHours(userId)) : stryMutAct_9fa48("2030") ? false : stryMutAct_9fa48("2029") ? true : (stryCov_9fa48("2029", "2030", "2031"), preferences.quietHoursEnabled && (await this.isInQuietHours(userId)))) {
        if (stryMutAct_9fa48("2032")) {
          {}
        } else {
          stryCov_9fa48("2032");
          return stryMutAct_9fa48("2033") ? true : (stryCov_9fa48("2033"), false);
        }
      }
      switch (channel) {
        case stryMutAct_9fa48("2035") ? "" : (stryCov_9fa48("2035"), 'email'):
          if (stryMutAct_9fa48("2034")) {} else {
            stryCov_9fa48("2034");
            return stryMutAct_9fa48("2038") ? preferences.emailEnabled || preferences.emailTypes.includes('all') || preferences.emailTypes.includes(notificationType) : stryMutAct_9fa48("2037") ? false : stryMutAct_9fa48("2036") ? true : (stryCov_9fa48("2036", "2037", "2038"), preferences.emailEnabled && (stryMutAct_9fa48("2040") ? preferences.emailTypes.includes('all') && preferences.emailTypes.includes(notificationType) : stryMutAct_9fa48("2039") ? true : (stryCov_9fa48("2039", "2040"), preferences.emailTypes.includes(stryMutAct_9fa48("2041") ? "" : (stryCov_9fa48("2041"), 'all')) || preferences.emailTypes.includes(notificationType))));
          }
        case stryMutAct_9fa48("2043") ? "" : (stryCov_9fa48("2043"), 'push'):
          if (stryMutAct_9fa48("2042")) {} else {
            stryCov_9fa48("2042");
            return stryMutAct_9fa48("2046") ? preferences.pushEnabled || preferences.pushTypes.includes('all') || preferences.pushTypes.includes(notificationType) : stryMutAct_9fa48("2045") ? false : stryMutAct_9fa48("2044") ? true : (stryCov_9fa48("2044", "2045", "2046"), preferences.pushEnabled && (stryMutAct_9fa48("2048") ? preferences.pushTypes.includes('all') && preferences.pushTypes.includes(notificationType) : stryMutAct_9fa48("2047") ? true : (stryCov_9fa48("2047", "2048"), preferences.pushTypes.includes(stryMutAct_9fa48("2049") ? "" : (stryCov_9fa48("2049"), 'all')) || preferences.pushTypes.includes(notificationType))));
          }
        case stryMutAct_9fa48("2051") ? "" : (stryCov_9fa48("2051"), 'inApp'):
          if (stryMutAct_9fa48("2050")) {} else {
            stryCov_9fa48("2050");
            return stryMutAct_9fa48("2054") ? preferences.inAppEnabled || preferences.inAppTypes.includes('all') || preferences.inAppTypes.includes(notificationType) : stryMutAct_9fa48("2053") ? false : stryMutAct_9fa48("2052") ? true : (stryCov_9fa48("2052", "2053", "2054"), preferences.inAppEnabled && (stryMutAct_9fa48("2056") ? preferences.inAppTypes.includes('all') && preferences.inAppTypes.includes(notificationType) : stryMutAct_9fa48("2055") ? true : (stryCov_9fa48("2055", "2056"), preferences.inAppTypes.includes(stryMutAct_9fa48("2057") ? "" : (stryCov_9fa48("2057"), 'all')) || preferences.inAppTypes.includes(notificationType))));
          }
        default:
          if (stryMutAct_9fa48("2058")) {} else {
            stryCov_9fa48("2058");
            return stryMutAct_9fa48("2059") ? true : (stryCov_9fa48("2059"), false);
          }
      }
    }
  }
  async isInQuietHours(userId: string): Promise<boolean> {
    if (stryMutAct_9fa48("2060")) {
      {}
    } else {
      stryCov_9fa48("2060");
      const preferences = await this.getUserPreferences(userId);
      if (stryMutAct_9fa48("2063") ? (!preferences || !preferences.quietHoursEnabled || !preferences.quietHoursStart) && !preferences.quietHoursEnd : stryMutAct_9fa48("2062") ? false : stryMutAct_9fa48("2061") ? true : (stryCov_9fa48("2061", "2062", "2063"), (stryMutAct_9fa48("2065") ? (!preferences || !preferences.quietHoursEnabled) && !preferences.quietHoursStart : stryMutAct_9fa48("2064") ? false : (stryCov_9fa48("2064", "2065"), (stryMutAct_9fa48("2067") ? !preferences && !preferences.quietHoursEnabled : stryMutAct_9fa48("2066") ? false : (stryCov_9fa48("2066", "2067"), (stryMutAct_9fa48("2068") ? preferences : (stryCov_9fa48("2068"), !preferences)) || (stryMutAct_9fa48("2069") ? preferences.quietHoursEnabled : (stryCov_9fa48("2069"), !preferences.quietHoursEnabled)))) || (stryMutAct_9fa48("2070") ? preferences.quietHoursStart : (stryCov_9fa48("2070"), !preferences.quietHoursStart)))) || (stryMutAct_9fa48("2071") ? preferences.quietHoursEnd : (stryCov_9fa48("2071"), !preferences.quietHoursEnd)))) {
        if (stryMutAct_9fa48("2072")) {
          {}
        } else {
          stryCov_9fa48("2072");
          return stryMutAct_9fa48("2073") ? true : (stryCov_9fa48("2073"), false);
        }
      }
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const [startHour, startMin] = preferences.quietHoursStart.split(stryMutAct_9fa48("2076") ? "" : (stryCov_9fa48("2076"), ':')).map(Number);
      const [endHour, endMin] = preferences.quietHoursEnd.split(stryMutAct_9fa48("2077") ? "" : (stryCov_9fa48("2077"), ':')).map(Number);
      const startTime = startHour * 60 + startMin;
      const endTime = endHour * 60 + endMin;
      if (stryMutAct_9fa48("2085") ? startTime > endTime : stryMutAct_9fa48("2084") ? startTime < endTime : stryMutAct_9fa48("2083") ? false : stryMutAct_9fa48("2082") ? true : (stryCov_9fa48("2082", "2083", "2084", "2085"), startTime <= endTime)) {
        if (stryMutAct_9fa48("2086")) {
          {}
        } else {
          stryCov_9fa48("2086");
          // Same day quiet hours (e.g., 22:00 to 08:00 next day)
          return stryMutAct_9fa48("2089") ? currentTime >= startTime || currentTime <= endTime : stryMutAct_9fa48("2088") ? false : stryMutAct_9fa48("2087") ? true : (stryCov_9fa48("2087", "2088", "2089"), (stryMutAct_9fa48("2092") ? currentTime < startTime : stryMutAct_9fa48("2091") ? currentTime > startTime : stryMutAct_9fa48("2090") ? true : (stryCov_9fa48("2090", "2091", "2092"), currentTime >= startTime)) && (stryMutAct_9fa48("2095") ? currentTime > endTime : stryMutAct_9fa48("2094") ? currentTime < endTime : stryMutAct_9fa48("2093") ? true : (stryCov_9fa48("2093", "2094", "2095"), currentTime <= endTime)));
        }
      } else {
        if (stryMutAct_9fa48("2096")) {
          {}
        } else {
          stryCov_9fa48("2096");
          // Quiet hours span midnight (e.g., 22:00 to 08:00 next day)
          return stryMutAct_9fa48("2099") ? currentTime >= startTime && currentTime <= endTime : stryMutAct_9fa48("2098") ? false : stryMutAct_9fa48("2097") ? true : (stryCov_9fa48("2097", "2098", "2099"), (stryMutAct_9fa48("2102") ? currentTime < startTime : stryMutAct_9fa48("2101") ? currentTime > startTime : stryMutAct_9fa48("2100") ? false : (stryCov_9fa48("2100", "2101", "2102"), currentTime >= startTime)) || (stryMutAct_9fa48("2105") ? currentTime > endTime : stryMutAct_9fa48("2104") ? currentTime < endTime : stryMutAct_9fa48("2103") ? false : (stryCov_9fa48("2103", "2104", "2105"), currentTime <= endTime)));
        }
      }
    }
  }

  // TICKET #7: Optimized cursor-based pagination for large datasets
  async getNotificationsWithCursor(userId: string, options: {
    cursor?: string; // Notification ID to start from
    limit?: number;
    search?: string;
    types?: string[];
    status?: 'all' | 'read' | 'unread';
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: 'newest' | 'oldest' | 'type';
  } = {}) {
    if (stryMutAct_9fa48("2106")) {
      {}
    } else {
      stryCov_9fa48("2106");
      const {
        cursor,
        limit = 20,
        search,
        types,
        status,
        dateFrom,
        dateTo,
        sortBy = stryMutAct_9fa48("2107") ? "" : (stryCov_9fa48("2107"), 'newest')
      } = options;

      // Build base where clause
      const where: WhereClause = stryMutAct_9fa48("2108") ? {} : (stryCov_9fa48("2108"), {
        userId
      });

      // Advanced search parsing
      if (stryMutAct_9fa48("2110") ? false : stryMutAct_9fa48("2109") ? true : (stryCov_9fa48("2109", "2110"), search)) {
        if (stryMutAct_9fa48("2111")) {
          {}
        } else {
          stryCov_9fa48("2111");
          const advancedSearch = this.parseAdvancedSearch(search);
          if (stryMutAct_9fa48("2113") ? false : stryMutAct_9fa48("2112") ? true : (stryCov_9fa48("2112", "2113"), advancedSearch)) {
            if (stryMutAct_9fa48("2114")) {
              {}
            } else {
              stryCov_9fa48("2114");
              Object.assign(where, advancedSearch);
            }
          } else {
            if (stryMutAct_9fa48("2115")) {
              {}
            } else {
              stryCov_9fa48("2115");
              // Fallback to simple search
              where.OR = stryMutAct_9fa48("2116") ? [] : (stryCov_9fa48("2116"), [stryMutAct_9fa48("2117") ? {} : (stryCov_9fa48("2117"), {
                message: stryMutAct_9fa48("2118") ? {} : (stryCov_9fa48("2118"), {
                  contains: search,
                  mode: stryMutAct_9fa48("2119") ? "" : (stryCov_9fa48("2119"), 'insensitive')
                })
              }), stryMutAct_9fa48("2120") ? {} : (stryCov_9fa48("2120"), {
                type: stryMutAct_9fa48("2121") ? {} : (stryCov_9fa48("2121"), {
                  contains: search,
                  mode: stryMutAct_9fa48("2122") ? "" : (stryCov_9fa48("2122"), 'insensitive')
                })
              })]);
            }
          }
        }
      }

      // Type filter (merge with advanced search type filters)
      if (stryMutAct_9fa48("2125") ? types || types.length > 0 : stryMutAct_9fa48("2124") ? false : stryMutAct_9fa48("2123") ? true : (stryCov_9fa48("2123", "2124", "2125"), types && (stryMutAct_9fa48("2128") ? types.length <= 0 : stryMutAct_9fa48("2127") ? types.length >= 0 : stryMutAct_9fa48("2126") ? true : (stryCov_9fa48("2126", "2127", "2128"), types.length > 0)))) {
        if (stryMutAct_9fa48("2129")) {
          {}
        } else {
          stryCov_9fa48("2129");
          if (stryMutAct_9fa48("2131") ? false : stryMutAct_9fa48("2130") ? true : (stryCov_9fa48("2130", "2131"), where.AND)) {
            if (stryMutAct_9fa48("2132")) {
              {}
            } else {
              stryCov_9fa48("2132");
              // Check if there's already a type filter from advanced search
              const existingTypeFilter = where.AND.find(stryMutAct_9fa48("2133") ? () => undefined : (stryCov_9fa48("2133"), (condition: any) => stryMutAct_9fa48("2134") ? condition.type.in : (stryCov_9fa48("2134"), condition.type?.in)));
              if (stryMutAct_9fa48("2136") ? false : stryMutAct_9fa48("2135") ? true : (stryCov_9fa48("2135", "2136"), existingTypeFilter)) {
                if (stryMutAct_9fa48("2137")) {
                  {}
                } else {
                  stryCov_9fa48("2137");
                  // Merge type filters
                  const existingTypes = existingTypeFilter.type.in;
                  const mergedTypes = stryMutAct_9fa48("2138") ? [] : (stryCov_9fa48("2138"), [...new Set(stryMutAct_9fa48("2139") ? [] : (stryCov_9fa48("2139"), [...existingTypes, ...types]))]);
                  existingTypeFilter.type.in = mergedTypes;
                }
              } else {
                if (stryMutAct_9fa48("2140")) {
                  {}
                } else {
                  stryCov_9fa48("2140");
                  where.AND.push(stryMutAct_9fa48("2141") ? {} : (stryCov_9fa48("2141"), {
                    type: stryMutAct_9fa48("2142") ? {} : (stryCov_9fa48("2142"), {
                      in: types
                    })
                  }));
                }
              }
            }
          } else {
            if (stryMutAct_9fa48("2143")) {
              {}
            } else {
              stryCov_9fa48("2143");
              where.type = stryMutAct_9fa48("2144") ? {} : (stryCov_9fa48("2144"), {
                in: types
              });
            }
          }
        }
      }

      // Status filter
      if (stryMutAct_9fa48("2147") ? status !== 'read' : stryMutAct_9fa48("2146") ? false : stryMutAct_9fa48("2145") ? true : (stryCov_9fa48("2145", "2146", "2147"), status === (stryMutAct_9fa48("2148") ? "" : (stryCov_9fa48("2148"), 'read')))) {
        if (stryMutAct_9fa48("2149")) {
          {}
        } else {
          stryCov_9fa48("2149");
          where.read = stryMutAct_9fa48("2150") ? false : (stryCov_9fa48("2150"), true);
        }
      } else if (stryMutAct_9fa48("2153") ? status !== 'unread' : stryMutAct_9fa48("2152") ? false : stryMutAct_9fa48("2151") ? true : (stryCov_9fa48("2151", "2152", "2153"), status === (stryMutAct_9fa48("2154") ? "" : (stryCov_9fa48("2154"), 'unread')))) {
        if (stryMutAct_9fa48("2155")) {
          {}
        } else {
          stryCov_9fa48("2155");
          where.read = stryMutAct_9fa48("2156") ? true : (stryCov_9fa48("2156"), false);
        }
      }

      // Date range filter
      if (stryMutAct_9fa48("2159") ? dateFrom && dateTo : stryMutAct_9fa48("2158") ? false : stryMutAct_9fa48("2157") ? true : (stryCov_9fa48("2157", "2158", "2159"), dateFrom || dateTo)) {
        if (stryMutAct_9fa48("2160")) {
          {}
        } else {
          stryCov_9fa48("2160");
          where.createdAt = {};
          if (stryMutAct_9fa48("2162") ? false : stryMutAct_9fa48("2161") ? true : (stryCov_9fa48("2161", "2162"), dateFrom)) {
            if (stryMutAct_9fa48("2163")) {
              {}
            } else {
              stryCov_9fa48("2163");
              where.createdAt.gte = dateFrom;
            }
          }
          if (stryMutAct_9fa48("2165") ? false : stryMutAct_9fa48("2164") ? true : (stryCov_9fa48("2164", "2165"), dateTo)) {
            if (stryMutAct_9fa48("2166")) {
              {}
            } else {
              stryCov_9fa48("2166");
              where.createdAt.lte = dateTo;
            }
          }
        }
      }

      // Cursor-based pagination
      if (stryMutAct_9fa48("2168") ? false : stryMutAct_9fa48("2167") ? true : (stryCov_9fa48("2167", "2168"), cursor)) {
        if (stryMutAct_9fa48("2169")) {
          {}
        } else {
          stryCov_9fa48("2169");
          if (stryMutAct_9fa48("2172") ? sortBy !== 'oldest' : stryMutAct_9fa48("2171") ? false : stryMutAct_9fa48("2170") ? true : (stryCov_9fa48("2170", "2171", "2172"), sortBy === (stryMutAct_9fa48("2173") ? "" : (stryCov_9fa48("2173"), 'oldest')))) {
            if (stryMutAct_9fa48("2174")) {
              {}
            } else {
              stryCov_9fa48("2174");
              where.id = stryMutAct_9fa48("2175") ? {} : (stryCov_9fa48("2175"), {
                gt: cursor
              });
            }
          } else {
            if (stryMutAct_9fa48("2176")) {
              {}
            } else {
              stryCov_9fa48("2176");
              where.id = stryMutAct_9fa48("2177") ? {} : (stryCov_9fa48("2177"), {
                lt: cursor
              });
            }
          }
        }
      }

      // Build orderBy clause
      let orderBy: any = stryMutAct_9fa48("2178") ? {} : (stryCov_9fa48("2178"), {
        createdAt: stryMutAct_9fa48("2179") ? "" : (stryCov_9fa48("2179"), 'desc')
      });
      if (stryMutAct_9fa48("2182") ? sortBy !== 'oldest' : stryMutAct_9fa48("2181") ? false : stryMutAct_9fa48("2180") ? true : (stryCov_9fa48("2180", "2181", "2182"), sortBy === (stryMutAct_9fa48("2183") ? "" : (stryCov_9fa48("2183"), 'oldest')))) {
        if (stryMutAct_9fa48("2184")) {
          {}
        } else {
          stryCov_9fa48("2184");
          orderBy = stryMutAct_9fa48("2185") ? {} : (stryCov_9fa48("2185"), {
            createdAt: stryMutAct_9fa48("2186") ? "" : (stryCov_9fa48("2186"), 'asc')
          });
        }
      } else if (stryMutAct_9fa48("2189") ? sortBy !== 'type' : stryMutAct_9fa48("2188") ? false : stryMutAct_9fa48("2187") ? true : (stryCov_9fa48("2187", "2188", "2189"), sortBy === (stryMutAct_9fa48("2190") ? "" : (stryCov_9fa48("2190"), 'type')))) {
        if (stryMutAct_9fa48("2191")) {
          {}
        } else {
          stryCov_9fa48("2191");
          orderBy = stryMutAct_9fa48("2192") ? [] : (stryCov_9fa48("2192"), [stryMutAct_9fa48("2193") ? {} : (stryCov_9fa48("2193"), {
            type: stryMutAct_9fa48("2194") ? "" : (stryCov_9fa48("2194"), 'asc')
          }), stryMutAct_9fa48("2195") ? {} : (stryCov_9fa48("2195"), {
            createdAt: stryMutAct_9fa48("2196") ? "" : (stryCov_9fa48("2196"), 'desc')
          })]);
        }
      }
      const notifications = await this.prisma.notification.findMany(stryMutAct_9fa48("2197") ? {} : (stryCov_9fa48("2197"), {
        where,
        orderBy,
        take: limit + 1 // Fetch one extra to check if there are more
      }));
      const hasMore = stryMutAct_9fa48("2202") ? notifications.length <= limit : stryMutAct_9fa48("2201") ? notifications.length >= limit : stryMutAct_9fa48("2200") ? false : stryMutAct_9fa48("2199") ? true : (stryCov_9fa48("2199", "2200", "2201", "2202"), notifications.length > limit);
      if (stryMutAct_9fa48("2204") ? false : stryMutAct_9fa48("2203") ? true : (stryCov_9fa48("2203", "2204"), hasMore)) {
        if (stryMutAct_9fa48("2205")) {
          {}
        } else {
          stryCov_9fa48("2205");
          notifications.pop(); // Remove the extra record
        }
      }
      const nextCursor = hasMore ? stryMutAct_9fa48("2206") ? notifications[notifications.length - 1].id : (stryCov_9fa48("2206"), notifications[notifications.length - 1]?.id) : null;
      return stryMutAct_9fa48("2208") ? {} : (stryCov_9fa48("2208"), {
        notifications,
        hasMore,
        nextCursor
      });
    }
  }
  async getNotificationsBatch(userId: string, notificationIds: string[]) {
    if (stryMutAct_9fa48("2209")) {
      {}
    } else {
      stryCov_9fa48("2209");
      return this.prisma.notification.findMany(stryMutAct_9fa48("2210") ? {} : (stryCov_9fa48("2210"), {
        where: stryMutAct_9fa48("2211") ? {} : (stryCov_9fa48("2211"), {
          userId,
          id: stryMutAct_9fa48("2212") ? {} : (stryCov_9fa48("2212"), {
            in: notificationIds
          })
        }),
        orderBy: stryMutAct_9fa48("2213") ? {} : (stryCov_9fa48("2213"), {
          createdAt: stryMutAct_9fa48("2214") ? "" : (stryCov_9fa48("2214"), 'desc')
        })
      }));
    }
  }

  // Get recent notifications (optimized for dashboard)
  async getRecentNotifications(userId: string, limit: number = 10) {
    if (stryMutAct_9fa48("2215")) {
      {}
    } else {
      stryCov_9fa48("2215");
      return this.prisma.notification.findMany(stryMutAct_9fa48("2216") ? {} : (stryCov_9fa48("2216"), {
        where: stryMutAct_9fa48("2217") ? {} : (stryCov_9fa48("2217"), {
          userId
        }),
        orderBy: stryMutAct_9fa48("2218") ? {} : (stryCov_9fa48("2218"), {
          createdAt: stryMutAct_9fa48("2219") ? "" : (stryCov_9fa48("2219"), 'desc')
        }),
        take: limit,
        select: stryMutAct_9fa48("2220") ? {} : (stryCov_9fa48("2220"), {
          id: stryMutAct_9fa48("2221") ? false : (stryCov_9fa48("2221"), true),
          message: stryMutAct_9fa48("2222") ? false : (stryCov_9fa48("2222"), true),
          type: stryMutAct_9fa48("2223") ? false : (stryCov_9fa48("2223"), true),
          read: stryMutAct_9fa48("2224") ? false : (stryCov_9fa48("2224"), true),
          createdAt: stryMutAct_9fa48("2225") ? false : (stryCov_9fa48("2225"), true),
          link: stryMutAct_9fa48("2226") ? false : (stryCov_9fa48("2226"), true)
        })
      }));
    }
  }

  // Get optimized notification counts for dashboard
  async getNotificationCountsOptimized(userId: string) {
    if (stryMutAct_9fa48("2227")) {
      {}
    } else {
      stryCov_9fa48("2227");
      const [total, unread, urgent] = await Promise.all(stryMutAct_9fa48("2228") ? [] : (stryCov_9fa48("2228"), [this.prisma.notification.count(stryMutAct_9fa48("2229") ? {} : (stryCov_9fa48("2229"), {
        where: stryMutAct_9fa48("2230") ? {} : (stryCov_9fa48("2230"), {
          userId
        })
      })), this.prisma.notification.count(stryMutAct_9fa48("2231") ? {} : (stryCov_9fa48("2231"), {
        where: stryMutAct_9fa48("2232") ? {} : (stryCov_9fa48("2232"), {
          userId,
          read: stryMutAct_9fa48("2233") ? true : (stryCov_9fa48("2233"), false)
        })
      })), this.prisma.notification.count(stryMutAct_9fa48("2234") ? {} : (stryCov_9fa48("2234"), {
        where: stryMutAct_9fa48("2235") ? {} : (stryCov_9fa48("2235"), {
          userId,
          type: stryMutAct_9fa48("2236") ? "" : (stryCov_9fa48("2236"), 'urgent'),
          read: stryMutAct_9fa48("2237") ? true : (stryCov_9fa48("2237"), false)
        })
      }))]));
      return stryMutAct_9fa48("2238") ? {} : (stryCov_9fa48("2238"), {
        total,
        unread,
        urgent
      });
    }
  }

  // Optimized bulk operations with batch processing
  async bulkMarkAsReadOptimized(notificationIds: string[], batchSize: number = 100) {
    if (stryMutAct_9fa48("2239")) {
      {}
    } else {
      stryCov_9fa48("2239");
      const batches: string[][] = stryMutAct_9fa48("2240") ? ["Stryker was here"] : (stryCov_9fa48("2240"), []);
      for (let i = 0; stryMutAct_9fa48("2243") ? i >= notificationIds.length : stryMutAct_9fa48("2242") ? i <= notificationIds.length : stryMutAct_9fa48("2241") ? false : (stryCov_9fa48("2241", "2242", "2243"), i < notificationIds.length); stryMutAct_9fa48("2244") ? i -= batchSize : (stryCov_9fa48("2244"), i += batchSize)) {
        if (stryMutAct_9fa48("2245")) {
          {}
        } else {
          stryCov_9fa48("2245");
          batches.push(stryMutAct_9fa48("2246") ? notificationIds : (stryCov_9fa48("2246"), notificationIds.slice(i, i + batchSize)));
        }
      }
      const results: any[] = stryMutAct_9fa48("2248") ? ["Stryker was here"] : (stryCov_9fa48("2248"), []);
      for (const batch of batches) {
        if (stryMutAct_9fa48("2249")) {
          {}
        } else {
          stryCov_9fa48("2249");
          const result = await this.prisma.notification.updateMany(stryMutAct_9fa48("2250") ? {} : (stryCov_9fa48("2250"), {
            where: stryMutAct_9fa48("2251") ? {} : (stryCov_9fa48("2251"), {
              id: stryMutAct_9fa48("2252") ? {} : (stryCov_9fa48("2252"), {
                in: batch
              })
            }),
            data: stryMutAct_9fa48("2253") ? {} : (stryCov_9fa48("2253"), {
              read: stryMutAct_9fa48("2254") ? false : (stryCov_9fa48("2254"), true)
            })
          }));
          results.push(result);
        }
      }
      const totalUpdated = results.reduce(stryMutAct_9fa48("2255") ? () => undefined : (stryCov_9fa48("2255"), (sum: number, result: any) => sum + result.count), 0);

      // Get affected user IDs for real-time updates
      const affectedNotifications = await this.prisma.notification.findMany(stryMutAct_9fa48("2257") ? {} : (stryCov_9fa48("2257"), {
        where: stryMutAct_9fa48("2258") ? {} : (stryCov_9fa48("2258"), {
          id: stryMutAct_9fa48("2259") ? {} : (stryCov_9fa48("2259"), {
            in: notificationIds
          })
        }),
        select: stryMutAct_9fa48("2260") ? {} : (stryCov_9fa48("2260"), {
          userId: stryMutAct_9fa48("2261") ? false : (stryCov_9fa48("2261"), true)
        })
      }));
      const userIds = stryMutAct_9fa48("2262") ? [] : (stryCov_9fa48("2262"), [...new Set(affectedNotifications.map(stryMutAct_9fa48("2263") ? () => undefined : (stryCov_9fa48("2263"), (n: {
        userId: string;
      }) => n.userId)))]);

      // Send real-time updates to affected users
      if (stryMutAct_9fa48("2265") ? false : stryMutAct_9fa48("2264") ? true : (stryCov_9fa48("2264", "2265"), this.notificationGateway)) {
        if (stryMutAct_9fa48("2266")) {
          {}
        } else {
          stryCov_9fa48("2266");
          for (const userId of userIds) {
            if (stryMutAct_9fa48("2267")) {
              {}
            } else {
              stryCov_9fa48("2267");
              await this.notificationGateway.sendNotificationToUser(userId, stryMutAct_9fa48("2268") ? {} : (stryCov_9fa48("2268"), {
                type: stryMutAct_9fa48("2269") ? "" : (stryCov_9fa48("2269"), 'notification_bulk_read_optimized'),
                count: totalUpdated
              }));
            }
          }
        }
      }
      return stryMutAct_9fa48("2270") ? {} : (stryCov_9fa48("2270"), {
        count: totalUpdated,
        batches: results.length
      });
    }
  }
}