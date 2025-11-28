// @ts-nocheck
// 
// ✅ SRP COMPLIANT: Single Responsibility - User Domain Events Only
// packages/api/src/users/services/user-events.service.ts
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
import { User } from '@prisma/client';
import { IUserEvents, UserEvent, UserEventType, UserCreatedEvent, UserUpdatedEvent, UserDeletedEvent } from '../interfaces/user-events.interface';
@Injectable()
export class UserEventsService implements IUserEvents {
  // In a real implementation, you would inject an event bus or message queue
  // For now, we'll use console logging and could extend to integrate with
  // services like Redis, RabbitMQ, or AWS EventBridge

  async publishUserCreated(user: User): Promise<void> {
    if (stryMutAct_9fa48("290")) {
      {}
    } else {
      stryCov_9fa48("290");
      const event: UserCreatedEvent = stryMutAct_9fa48("291") ? {} : (stryCov_9fa48("291"), {
        type: UserEventType.USER_CREATED,
        userId: user.id,
        data: stryMutAct_9fa48("292") ? {} : (stryCov_9fa48("292"), {
          user,
          welcomeEmailSent: stryMutAct_9fa48("293") ? true : (stryCov_9fa48("293"), false) // This would be set by the notification service
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("294") ? {} : (stryCov_9fa48("294"), {
          source: stryMutAct_9fa48("295") ? "" : (stryCov_9fa48("295"), 'user-service'),
          version: stryMutAct_9fa48("296") ? "" : (stryCov_9fa48("296"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserUpdated(user: User, previousData?: Partial<User>): Promise<void> {
    if (stryMutAct_9fa48("297")) {
      {}
    } else {
      stryCov_9fa48("297");
      const changedFields = this.getChangedFields(user, previousData);
      const event: UserUpdatedEvent = stryMutAct_9fa48("298") ? {} : (stryCov_9fa48("298"), {
        type: UserEventType.USER_UPDATED,
        userId: user.id,
        data: stryMutAct_9fa48("299") ? {} : (stryCov_9fa48("299"), {
          user,
          previousData: stryMutAct_9fa48("302") ? previousData && {} : stryMutAct_9fa48("301") ? false : stryMutAct_9fa48("300") ? true : (stryCov_9fa48("300", "301", "302"), previousData || {}),
          changedFields
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("303") ? {} : (stryCov_9fa48("303"), {
          source: stryMutAct_9fa48("304") ? "" : (stryCov_9fa48("304"), 'user-service'),
          version: stryMutAct_9fa48("305") ? "" : (stryCov_9fa48("305"), '1.0'),
          changedFieldsCount: changedFields.length
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserDeleted(userId: string, userData?: Partial<User>): Promise<void> {
    if (stryMutAct_9fa48("306")) {
      {}
    } else {
      stryCov_9fa48("306");
      const event: UserDeletedEvent = stryMutAct_9fa48("307") ? {} : (stryCov_9fa48("307"), {
        type: UserEventType.USER_DELETED,
        userId,
        data: stryMutAct_9fa48("308") ? {} : (stryCov_9fa48("308"), {
          deletedUserId: userId,
          userData,
          cascade: stryMutAct_9fa48("309") ? false : (stryCov_9fa48("309"), true) // Assuming cascade delete
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("310") ? {} : (stryCov_9fa48("310"), {
          source: stryMutAct_9fa48("311") ? "" : (stryCov_9fa48("311"), 'user-service'),
          version: stryMutAct_9fa48("312") ? "" : (stryCov_9fa48("312"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserPasswordChanged(userId: string): Promise<void> {
    if (stryMutAct_9fa48("313")) {
      {}
    } else {
      stryCov_9fa48("313");
      const event: UserEvent = stryMutAct_9fa48("314") ? {} : (stryCov_9fa48("314"), {
        type: UserEventType.PASSWORD_CHANGED,
        userId,
        data: stryMutAct_9fa48("315") ? {} : (stryCov_9fa48("315"), {
          securityEvent: stryMutAct_9fa48("316") ? false : (stryCov_9fa48("316"), true),
          requiresNotification: stryMutAct_9fa48("317") ? false : (stryCov_9fa48("317"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("318") ? {} : (stryCov_9fa48("318"), {
          source: stryMutAct_9fa48("319") ? "" : (stryCov_9fa48("319"), 'user-authentication-service'),
          version: stryMutAct_9fa48("320") ? "" : (stryCov_9fa48("320"), '1.0'),
          securityLevel: stryMutAct_9fa48("321") ? "" : (stryCov_9fa48("321"), 'high')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserEmailVerified(userId: string): Promise<void> {
    if (stryMutAct_9fa48("322")) {
      {}
    } else {
      stryCov_9fa48("322");
      const event: UserEvent = stryMutAct_9fa48("323") ? {} : (stryCov_9fa48("323"), {
        type: UserEventType.EMAIL_VERIFIED,
        userId,
        data: stryMutAct_9fa48("324") ? {} : (stryCov_9fa48("324"), {
          verificationCompleted: stryMutAct_9fa48("325") ? false : (stryCov_9fa48("325"), true),
          accountActivated: stryMutAct_9fa48("326") ? false : (stryCov_9fa48("326"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("327") ? {} : (stryCov_9fa48("327"), {
          source: stryMutAct_9fa48("328") ? "" : (stryCov_9fa48("328"), 'user-service'),
          version: stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserLoggedIn(userId: string): Promise<void> {
    if (stryMutAct_9fa48("330")) {
      {}
    } else {
      stryCov_9fa48("330");
      const event: UserEvent = stryMutAct_9fa48("331") ? {} : (stryCov_9fa48("331"), {
        type: UserEventType.USER_LOGGED_IN,
        userId,
        data: stryMutAct_9fa48("332") ? {} : (stryCov_9fa48("332"), {
          loginTimestamp: new Date(),
          sessionStarted: stryMutAct_9fa48("333") ? false : (stryCov_9fa48("333"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("334") ? {} : (stryCov_9fa48("334"), {
          source: stryMutAct_9fa48("335") ? "" : (stryCov_9fa48("335"), 'user-authentication-service'),
          version: stryMutAct_9fa48("336") ? "" : (stryCov_9fa48("336"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserRoleChanged(userId: string, oldRole: string, newRole: string): Promise<void> {
    if (stryMutAct_9fa48("337")) {
      {}
    } else {
      stryCov_9fa48("337");
      const event: UserEvent = stryMutAct_9fa48("338") ? {} : (stryCov_9fa48("338"), {
        type: UserEventType.ROLE_CHANGED,
        userId,
        data: stryMutAct_9fa48("339") ? {} : (stryCov_9fa48("339"), {
          oldRole,
          newRole,
          securityEvent: stryMutAct_9fa48("340") ? false : (stryCov_9fa48("340"), true),
          requiresAudit: stryMutAct_9fa48("341") ? false : (stryCov_9fa48("341"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("342") ? {} : (stryCov_9fa48("342"), {
          source: stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), 'user-service'),
          version: stryMutAct_9fa48("344") ? "" : (stryCov_9fa48("344"), '1.0'),
          securityLevel: stryMutAct_9fa48("345") ? "" : (stryCov_9fa48("345"), 'high')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserBulkOperation(operation: string, userIds: string[], metadata?: any): Promise<void> {
    if (stryMutAct_9fa48("346")) {
      {}
    } else {
      stryCov_9fa48("346");
      const event: UserEvent = stryMutAct_9fa48("347") ? {} : (stryCov_9fa48("347"), {
        type: UserEventType.BULK_OPERATION,
        userId: stryMutAct_9fa48("348") ? "" : (stryCov_9fa48("348"), 'system'),
        // Bulk operations are system-level
        data: stryMutAct_9fa48("349") ? {} : (stryCov_9fa48("349"), {
          operation,
          userIds,
          affectedCount: userIds.length,
          bulkOperationMetadata: metadata
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("350") ? {} : (stryCov_9fa48("350"), {
          source: stryMutAct_9fa48("351") ? "" : (stryCov_9fa48("351"), 'user-bulk-service'),
          version: stryMutAct_9fa48("352") ? "" : (stryCov_9fa48("352"), '1.0'),
          operationType: operation
        })
      });
      await this.publishEvent(event);
    }
  }

  // Private helper methods
  private async publishEvent(event: UserEvent): Promise<void> {
    if (stryMutAct_9fa48("353")) {
      {}
    } else {
      stryCov_9fa48("353");
      // In a real implementation, this would:
      // 1. Serialize the event
      // 2. Publish to message queue (Redis, RabbitMQ, etc.)
      // 3. Handle failures and retries
      // 4. Ensure event ordering if needed

      console.log(stryMutAct_9fa48("354") ? `` : (stryCov_9fa48("354"), `[USER EVENT] ${event.type}:`), stryMutAct_9fa48("355") ? {} : (stryCov_9fa48("355"), {
        userId: event.userId,
        timestamp: event.timestamp,
        data: event.data,
        metadata: event.metadata
      }));

      // Simulate async event publishing
      await new Promise(stryMutAct_9fa48("356") ? () => undefined : (stryCov_9fa48("356"), resolve => setTimeout(resolve, 10)));

      // In production, you might want to:
      // - Store events in an event store
      // - Publish to multiple subscribers
      // - Handle event versioning
      // - Implement event replay capabilities
    }
  }
  private getChangedFields(current: User, previous?: Partial<User>): string[] {
    if (stryMutAct_9fa48("357")) {
      {}
    } else {
      stryCov_9fa48("357");
      if (stryMutAct_9fa48("360") ? false : stryMutAct_9fa48("359") ? true : stryMutAct_9fa48("358") ? previous : (stryCov_9fa48("358", "359", "360"), !previous)) return stryMutAct_9fa48("361") ? ["Stryker was here"] : (stryCov_9fa48("361"), []);
      const changedFields: string[] = stryMutAct_9fa48("362") ? ["Stryker was here"] : (stryCov_9fa48("362"), []);
      const currentObj = current as any;
      const previousObj = previous as any;

      // Compare each field
      Object.keys(previousObj).forEach(key => {
        if (stryMutAct_9fa48("363")) {
          {}
        } else {
          stryCov_9fa48("363");
          if (stryMutAct_9fa48("366") ? currentObj[key] === previousObj[key] : stryMutAct_9fa48("365") ? false : stryMutAct_9fa48("364") ? true : (stryCov_9fa48("364", "365", "366"), currentObj[key] !== previousObj[key])) {
            if (stryMutAct_9fa48("367")) {
              {}
            } else {
              stryCov_9fa48("367");
              changedFields.push(key);
            }
          }
        }
      });
      return changedFields;
    }
  }
}