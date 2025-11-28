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
    if (stryMutAct_9fa48("3138")) {
      {}
    } else {
      stryCov_9fa48("3138");
      const event: UserCreatedEvent = stryMutAct_9fa48("3139") ? {} : (stryCov_9fa48("3139"), {
        type: UserEventType.USER_CREATED,
        userId: user.id,
        data: stryMutAct_9fa48("3140") ? {} : (stryCov_9fa48("3140"), {
          user,
          welcomeEmailSent: stryMutAct_9fa48("3141") ? true : (stryCov_9fa48("3141"), false) // This would be set by the notification service
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("3142") ? {} : (stryCov_9fa48("3142"), {
          source: stryMutAct_9fa48("3143") ? "" : (stryCov_9fa48("3143"), 'user-service'),
          version: stryMutAct_9fa48("3144") ? "" : (stryCov_9fa48("3144"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserUpdated(user: User, previousData?: Partial<User>): Promise<void> {
    if (stryMutAct_9fa48("3145")) {
      {}
    } else {
      stryCov_9fa48("3145");
      const changedFields = this.getChangedFields(user, previousData);
      const event: UserUpdatedEvent = stryMutAct_9fa48("3146") ? {} : (stryCov_9fa48("3146"), {
        type: UserEventType.USER_UPDATED,
        userId: user.id,
        data: stryMutAct_9fa48("3147") ? {} : (stryCov_9fa48("3147"), {
          user,
          previousData: stryMutAct_9fa48("3150") ? previousData && {} : stryMutAct_9fa48("3149") ? false : stryMutAct_9fa48("3148") ? true : (stryCov_9fa48("3148", "3149", "3150"), previousData || {}),
          changedFields
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("3151") ? {} : (stryCov_9fa48("3151"), {
          source: stryMutAct_9fa48("3152") ? "" : (stryCov_9fa48("3152"), 'user-service'),
          version: stryMutAct_9fa48("3153") ? "" : (stryCov_9fa48("3153"), '1.0'),
          changedFieldsCount: changedFields.length
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserDeleted(userId: string, userData?: Partial<User>): Promise<void> {
    if (stryMutAct_9fa48("3154")) {
      {}
    } else {
      stryCov_9fa48("3154");
      const event: UserDeletedEvent = stryMutAct_9fa48("3155") ? {} : (stryCov_9fa48("3155"), {
        type: UserEventType.USER_DELETED,
        userId,
        data: stryMutAct_9fa48("3156") ? {} : (stryCov_9fa48("3156"), {
          deletedUserId: userId,
          userData,
          cascade: stryMutAct_9fa48("3157") ? false : (stryCov_9fa48("3157"), true) // Assuming cascade delete
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("3158") ? {} : (stryCov_9fa48("3158"), {
          source: stryMutAct_9fa48("3159") ? "" : (stryCov_9fa48("3159"), 'user-service'),
          version: stryMutAct_9fa48("3160") ? "" : (stryCov_9fa48("3160"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserPasswordChanged(userId: string): Promise<void> {
    if (stryMutAct_9fa48("3161")) {
      {}
    } else {
      stryCov_9fa48("3161");
      const event: UserEvent = stryMutAct_9fa48("3162") ? {} : (stryCov_9fa48("3162"), {
        type: UserEventType.PASSWORD_CHANGED,
        userId,
        data: stryMutAct_9fa48("3163") ? {} : (stryCov_9fa48("3163"), {
          securityEvent: stryMutAct_9fa48("3164") ? false : (stryCov_9fa48("3164"), true),
          requiresNotification: stryMutAct_9fa48("3165") ? false : (stryCov_9fa48("3165"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("3166") ? {} : (stryCov_9fa48("3166"), {
          source: stryMutAct_9fa48("3167") ? "" : (stryCov_9fa48("3167"), 'user-authentication-service'),
          version: stryMutAct_9fa48("3168") ? "" : (stryCov_9fa48("3168"), '1.0'),
          securityLevel: stryMutAct_9fa48("3169") ? "" : (stryCov_9fa48("3169"), 'high')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserEmailVerified(userId: string): Promise<void> {
    if (stryMutAct_9fa48("3170")) {
      {}
    } else {
      stryCov_9fa48("3170");
      const event: UserEvent = stryMutAct_9fa48("3171") ? {} : (stryCov_9fa48("3171"), {
        type: UserEventType.EMAIL_VERIFIED,
        userId,
        data: stryMutAct_9fa48("3172") ? {} : (stryCov_9fa48("3172"), {
          verificationCompleted: stryMutAct_9fa48("3173") ? false : (stryCov_9fa48("3173"), true),
          accountActivated: stryMutAct_9fa48("3174") ? false : (stryCov_9fa48("3174"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("3175") ? {} : (stryCov_9fa48("3175"), {
          source: stryMutAct_9fa48("3176") ? "" : (stryCov_9fa48("3176"), 'user-service'),
          version: stryMutAct_9fa48("3177") ? "" : (stryCov_9fa48("3177"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserLoggedIn(userId: string): Promise<void> {
    if (stryMutAct_9fa48("3178")) {
      {}
    } else {
      stryCov_9fa48("3178");
      const event: UserEvent = stryMutAct_9fa48("3179") ? {} : (stryCov_9fa48("3179"), {
        type: UserEventType.USER_LOGGED_IN,
        userId,
        data: stryMutAct_9fa48("3180") ? {} : (stryCov_9fa48("3180"), {
          loginTimestamp: new Date(),
          sessionStarted: stryMutAct_9fa48("3181") ? false : (stryCov_9fa48("3181"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("3182") ? {} : (stryCov_9fa48("3182"), {
          source: stryMutAct_9fa48("3183") ? "" : (stryCov_9fa48("3183"), 'user-authentication-service'),
          version: stryMutAct_9fa48("3184") ? "" : (stryCov_9fa48("3184"), '1.0')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserRoleChanged(userId: string, oldRole: string, newRole: string): Promise<void> {
    if (stryMutAct_9fa48("3185")) {
      {}
    } else {
      stryCov_9fa48("3185");
      const event: UserEvent = stryMutAct_9fa48("3186") ? {} : (stryCov_9fa48("3186"), {
        type: UserEventType.ROLE_CHANGED,
        userId,
        data: stryMutAct_9fa48("3187") ? {} : (stryCov_9fa48("3187"), {
          oldRole,
          newRole,
          securityEvent: stryMutAct_9fa48("3188") ? false : (stryCov_9fa48("3188"), true),
          requiresAudit: stryMutAct_9fa48("3189") ? false : (stryCov_9fa48("3189"), true)
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("3190") ? {} : (stryCov_9fa48("3190"), {
          source: stryMutAct_9fa48("3191") ? "" : (stryCov_9fa48("3191"), 'user-service'),
          version: stryMutAct_9fa48("3192") ? "" : (stryCov_9fa48("3192"), '1.0'),
          securityLevel: stryMutAct_9fa48("3193") ? "" : (stryCov_9fa48("3193"), 'high')
        })
      });
      await this.publishEvent(event);
    }
  }
  async publishUserBulkOperation(operation: string, userIds: string[], metadata?: Record<string, unknown>): Promise<void> {
    if (stryMutAct_9fa48("3194")) {
      {}
    } else {
      stryCov_9fa48("3194");
      const event: UserEvent = stryMutAct_9fa48("3195") ? {} : (stryCov_9fa48("3195"), {
        type: UserEventType.BULK_OPERATION,
        userId: stryMutAct_9fa48("3196") ? "" : (stryCov_9fa48("3196"), 'system'),
        // Bulk operations are system-level
        data: stryMutAct_9fa48("3197") ? {} : (stryCov_9fa48("3197"), {
          operation,
          userIds,
          affectedCount: userIds.length,
          bulkOperationMetadata: metadata
        }),
        timestamp: new Date(),
        metadata: stryMutAct_9fa48("3198") ? {} : (stryCov_9fa48("3198"), {
          source: stryMutAct_9fa48("3199") ? "" : (stryCov_9fa48("3199"), 'user-bulk-service'),
          version: stryMutAct_9fa48("3200") ? "" : (stryCov_9fa48("3200"), '1.0'),
          operationType: operation
        })
      });
      await this.publishEvent(event);
    }
  }

  // Private helper methods
  private async publishEvent(event: UserEvent): Promise<void> {
    if (stryMutAct_9fa48("3201")) {
      {}
    } else {
      stryCov_9fa48("3201");
      // In a real implementation, this would:
      // 1. Serialize the event
      // 2. Publish to message queue (Redis, RabbitMQ, etc.)
      // 3. Handle failures and retries
      // 4. Ensure event ordering if needed

      console.log(stryMutAct_9fa48("3202") ? `` : (stryCov_9fa48("3202"), `[USER EVENT] ${event.type}:`), stryMutAct_9fa48("3203") ? {} : (stryCov_9fa48("3203"), {
        userId: event.userId,
        timestamp: event.timestamp,
        data: event.data as Record<string, unknown>,
        metadata: event.metadata
      }));

      // Simulate async event publishing
      await new Promise(stryMutAct_9fa48("3204") ? () => undefined : (stryCov_9fa48("3204"), resolve => setTimeout(resolve, 10)));

      // In production, you might want to:
      // - Store events in an event store
      // - Publish to multiple subscribers
      // - Handle event versioning
      // - Implement event replay capabilities
    }
  }
  private getChangedFields(current: User, previous?: Partial<User>): string[] {
    if (stryMutAct_9fa48("3205")) {
      {}
    } else {
      stryCov_9fa48("3205");
      if (stryMutAct_9fa48("3208") ? false : stryMutAct_9fa48("3207") ? true : stryMutAct_9fa48("3206") ? previous : (stryCov_9fa48("3206", "3207", "3208"), !previous)) return stryMutAct_9fa48("3209") ? ["Stryker was here"] : (stryCov_9fa48("3209"), []);
      const changedFields: string[] = stryMutAct_9fa48("3210") ? ["Stryker was here"] : (stryCov_9fa48("3210"), []);

      // Iterate over the keys of the current user object
      for (const key in current) {
        if (stryMutAct_9fa48("3211")) {
          {}
        } else {
          stryCov_9fa48("3211");
          // Ensure the key exists in previous and the values are different
          if (stryMutAct_9fa48("3214") ? Object.prototype.hasOwnProperty.call(previous, key) || current[key] !== previous[key] : stryMutAct_9fa48("3213") ? false : stryMutAct_9fa48("3212") ? true : (stryCov_9fa48("3212", "3213", "3214"), Object.prototype.hasOwnProperty.call(previous, key) && (stryMutAct_9fa48("3216") ? current[key] === previous[key] : stryMutAct_9fa48("3215") ? true : (stryCov_9fa48("3215", "3216"), current[key] !== previous[key])))) {
            if (stryMutAct_9fa48("3217")) {
              {}
            } else {
              stryCov_9fa48("3217");
              changedFields.push(key);
            }
          }
        }
      }
      return changedFields;
    }
  }
}