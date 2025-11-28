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
    if (stryMutAct_9fa48("294")) {
      {}
    } else {
      stryCov_9fa48("294");
      const event: UserCreatedEvent = stryMutAct_9fa48("295") ? {} : (stryCov_9fa48("295"), {
        type: UserEventType.USER_CREATED,
        userId: user.id,
        data: stryMutAct_9fa48("296") ? {} : (stryCov_9fa48("296"), {
          user,
          welcomeEmailSent: stryMutAct_9fa48("297") ? true : (stryCov_9fa48("297"), false) // This would be set by the notification service
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("298") ? {} : (stryCov_9fa48("298"), {
          source: stryMutAct_9fa48("299") ? "" : (stryCov_9fa48("299"), 'user-service'),
          version: stryMutAct_9fa48("300") ? "" : (stryCov_9fa48("300"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserUpdated(user: User, previousData?: Partial<User>): Promise<void> {
    if (stryMutAct_9fa48("301")) {
      {}
    } else {
      stryCov_9fa48("301");
      const changedFields = this.getChangedFields(user, previousData);
      const event: UserUpdatedEvent = stryMutAct_9fa48("302") ? {} : (stryCov_9fa48("302"), {
        type: UserEventType.USER_UPDATED,
        userId: user.id,
        data: stryMutAct_9fa48("303") ? {} : (stryCov_9fa48("303"), {
          user,
          previousData: stryMutAct_9fa48("306") ? previousData && {} : stryMutAct_9fa48("305") ? false : stryMutAct_9fa48("304") ? true : (stryCov_9fa48("304", "305", "306"), previousData || {}),
          changedFields
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("307") ? {} : (stryCov_9fa48("307"), {
          source: stryMutAct_9fa48("308") ? "" : (stryCov_9fa48("308"), 'user-service'),
          version: stryMutAct_9fa48("309") ? "" : (stryCov_9fa48("309"), '1.0'),
          changedFieldsCount: changedFields.length
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserDeleted(userId: string, userData?: Partial<User>): Promise<void> {
    if (stryMutAct_9fa48("310")) {
      {}
    } else {
      stryCov_9fa48("310");
      const event: UserDeletedEvent = stryMutAct_9fa48("311") ? {} : (stryCov_9fa48("311"), {
        type: UserEventType.USER_DELETED,
        userId,
        data: stryMutAct_9fa48("312") ? {} : (stryCov_9fa48("312"), {
          deletedUserId: userId,
          userData,
          cascade: stryMutAct_9fa48("313") ? false : (stryCov_9fa48("313"), true) // Assuming cascade delete
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("314") ? {} : (stryCov_9fa48("314"), {
          source: stryMutAct_9fa48("315") ? "" : (stryCov_9fa48("315"), 'user-service'),
          version: stryMutAct_9fa48("316") ? "" : (stryCov_9fa48("316"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserPasswordChanged(userId: string): Promise<void> {
    if (stryMutAct_9fa48("317")) {
      {}
    } else {
      stryCov_9fa48("317");
      const event: UserEvent = stryMutAct_9fa48("318") ? {} : (stryCov_9fa48("318"), {
        type: UserEventType.PASSWORD_CHANGED,
        userId,
        data: stryMutAct_9fa48("319") ? {} : (stryCov_9fa48("319"), {
          securityEvent: stryMutAct_9fa48("320") ? false : (stryCov_9fa48("320"), true),
          requiresNotification: stryMutAct_9fa48("321") ? false : (stryCov_9fa48("321"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("322") ? {} : (stryCov_9fa48("322"), {
          source: stryMutAct_9fa48("323") ? "" : (stryCov_9fa48("323"), 'user-authentication-service'),
          version: stryMutAct_9fa48("324") ? "" : (stryCov_9fa48("324"), '1.0'),
          securityLevel: stryMutAct_9fa48("325") ? "" : (stryCov_9fa48("325"), 'high')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserEmailVerified(userId: string): Promise<void> {
    if (stryMutAct_9fa48("326")) {
      {}
    } else {
      stryCov_9fa48("326");
      const event: UserEvent = stryMutAct_9fa48("327") ? {} : (stryCov_9fa48("327"), {
        type: UserEventType.EMAIL_VERIFIED,
        userId,
        data: stryMutAct_9fa48("328") ? {} : (stryCov_9fa48("328"), {
          verificationCompleted: stryMutAct_9fa48("329") ? false : (stryCov_9fa48("329"), true),
          accountActivated: stryMutAct_9fa48("330") ? false : (stryCov_9fa48("330"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("331") ? {} : (stryCov_9fa48("331"), {
          source: stryMutAct_9fa48("332") ? "" : (stryCov_9fa48("332"), 'user-service'),
          version: stryMutAct_9fa48("333") ? "" : (stryCov_9fa48("333"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserLoggedIn(userId: string): Promise<void> {
    if (stryMutAct_9fa48("334")) {
      {}
    } else {
      stryCov_9fa48("334");
      const event: UserEvent = stryMutAct_9fa48("335") ? {} : (stryCov_9fa48("335"), {
        type: UserEventType.USER_LOGGED_IN,
        userId,
        data: stryMutAct_9fa48("336") ? {} : (stryCov_9fa48("336"), {
          loginTimestamp: new Date(),
          sessionStarted: stryMutAct_9fa48("337") ? false : (stryCov_9fa48("337"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("338") ? {} : (stryCov_9fa48("338"), {
          source: stryMutAct_9fa48("339") ? "" : (stryCov_9fa48("339"), 'user-authentication-service'),
          version: stryMutAct_9fa48("340") ? "" : (stryCov_9fa48("340"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserRoleChanged(userId: string, oldRole: string, newRole: string): Promise<void> {
    if (stryMutAct_9fa48("341")) {
      {}
    } else {
      stryCov_9fa48("341");
      const event: UserEvent = stryMutAct_9fa48("342") ? {} : (stryCov_9fa48("342"), {
        type: UserEventType.ROLE_CHANGED,
        userId,
        data: stryMutAct_9fa48("343") ? {} : (stryCov_9fa48("343"), {
          oldRole,
          newRole,
          securityEvent: stryMutAct_9fa48("344") ? false : (stryCov_9fa48("344"), true),
          requiresAudit: stryMutAct_9fa48("345") ? false : (stryCov_9fa48("345"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("346") ? {} : (stryCov_9fa48("346"), {
          source: stryMutAct_9fa48("347") ? "" : (stryCov_9fa48("347"), 'user-service'),
          version: stryMutAct_9fa48("348") ? "" : (stryCov_9fa48("348"), '1.0'),
          securityLevel: stryMutAct_9fa48("349") ? "" : (stryCov_9fa48("349"), 'high')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserBulkOperation(operation: string, userIds: string[], metadata?: any): Promise<void> {
    if (stryMutAct_9fa48("350")) {
      {}
    } else {
      stryCov_9fa48("350");
      const event: UserEvent = stryMutAct_9fa48("351") ? {} : (stryCov_9fa48("351"), {
        type: UserEventType.BULK_OPERATION,
        userId: stryMutAct_9fa48("352") ? "" : (stryCov_9fa48("352"), 'system'),
        // Bulk operations are system-level
        data: stryMutAct_9fa48("353") ? {} : (stryCov_9fa48("353"), {
          operation,
          userIds,
          affectedCount: userIds.length,
          bulkOperationMetadata: metadata
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("354") ? {} : (stryCov_9fa48("354"), {
          source: stryMutAct_9fa48("355") ? "" : (stryCov_9fa48("355"), 'user-bulk-service'),
          version: stryMutAct_9fa48("356") ? "" : (stryCov_9fa48("356"), '1.0'),
          operationType: operation
        })
      });
      await this.publishEvent(event);
    }
  }

  // Private helper methods
  private async publishEvent(event: UserEvent): Promise<void> {
    if (stryMutAct_9fa48("357")) {
      {}
    } else {
      stryCov_9fa48("357");
      // In a real implementation, this would:
      // 1. Serialize the event
      // 2. Publish to message queue (Redis, RabbitMQ, etc.)
      // 3. Handle failures and retries
      // 4. Ensure event ordering if needed

      console.log(stryMutAct_9fa48("358") ? `` : (stryCov_9fa48("358"), `[USER EVENT] ${event.type}:`), stryMutAct_9fa48("359") ? {} : (stryCov_9fa48("359"), {
        userId: event.userId,
        timestamp: event.timestamp,
        data: event.data,
        metadata: event.metadata
      }));

      // Simulate async event publishing
      await new Promise(stryMutAct_9fa48("360") ? () => undefined : (stryCov_9fa48("360"), resolve => setTimeout(resolve, 10)));

      // In production, you might want to:
      // - Store events in an event store
      // - Publish to multiple subscribers
      // - Handle event versioning
      // - Implement event replay capabilities
    }
  }
  private getChangedFields(current: User, previous?: Partial<User>): string[] {
    if (stryMutAct_9fa48("361")) {
      {}
    } else {
      stryCov_9fa48("361");
      if (stryMutAct_9fa48("364") ? false : stryMutAct_9fa48("363") ? true : stryMutAct_9fa48("362") ? previous : (stryCov_9fa48("362", "363", "364"), !previous)) return stryMutAct_9fa48("365") ? ["Stryker was here"] : (stryCov_9fa48("365"), []);
      const changedFields: string[] = stryMutAct_9fa48("366") ? ["Stryker was here"] : (stryCov_9fa48("366"), []);
      const currentObj = current as any;
      const previousObj = previous as any;

      // Compare each field
      Object.keys(previousObj).forEach(key => {
        if (stryMutAct_9fa48("367")) {
          {}
        } else {
          stryCov_9fa48("367");
          if (stryMutAct_9fa48("370") ? currentObj[key] === previousObj[key] : stryMutAct_9fa48("369") ? false : stryMutAct_9fa48("368") ? true : (stryCov_9fa48("368", "369", "370"), currentObj[key] !== previousObj[key])) {
            if (stryMutAct_9fa48("371")) {
              {}
            } else {
              stryCov_9fa48("371");
              changedFields.push(key);
            }
          }
        }
      });
      return changedFields;
    }
  }
}