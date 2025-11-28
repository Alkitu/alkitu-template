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
import { Injectable, Logger } from '@nestjs/common';
import { IEmailChannel } from './email-channel.interface';
import { EmailResult, PasswordResetEmailData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Password Reset Email Channel
 *
 * Handles password reset email functionality following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class PasswordResetEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(PasswordResetEmailChannel.name);
  readonly type = stryMutAct_9fa48("871") ? "" : (stryCov_9fa48("871"), 'reset');
  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a password reset email
   */
  async send(data: PasswordResetEmailData): Promise<EmailResult> {
    if (stryMutAct_9fa48("872")) {
      {}
    } else {
      stryCov_9fa48("872");
      try {
        if (stryMutAct_9fa48("873")) {
          {}
        } else {
          stryCov_9fa48("873");
          this.logger.log(stryMutAct_9fa48("874") ? `` : (stryCov_9fa48("874"), `Sending password reset email to ${data.userEmail}`));
          const result = await this.emailService.sendPasswordResetEmail(data);
          this.logger.log(stryMutAct_9fa48("875") ? `` : (stryCov_9fa48("875"), `Password reset email ${result.success ? stryMutAct_9fa48("876") ? "" : (stryCov_9fa48("876"), 'sent successfully') : stryMutAct_9fa48("877") ? "" : (stryCov_9fa48("877"), 'failed')} to ${data.userEmail}`));
          return result;
        }
      } catch (error) {
        if (stryMutAct_9fa48("878")) {
          {}
        } else {
          stryCov_9fa48("878");
          this.logger.error(stryMutAct_9fa48("879") ? `` : (stryCov_9fa48("879"), `Failed to send password reset email to ${data.userEmail}:`), error);
          return stryMutAct_9fa48("880") ? {} : (stryCov_9fa48("880"), {
            success: stryMutAct_9fa48("881") ? true : (stryCov_9fa48("881"), false),
            error: error instanceof Error ? error.message : stryMutAct_9fa48("882") ? "" : (stryCov_9fa48("882"), 'Unknown error')
          });
        }
      }
    }
  }

  /**
   * Check if this channel supports the given type
   */
  supports(type: string): boolean {
    if (stryMutAct_9fa48("883")) {
      {}
    } else {
      stryCov_9fa48("883");
      return stryMutAct_9fa48("886") ? type !== 'reset' : stryMutAct_9fa48("885") ? false : stryMutAct_9fa48("884") ? true : (stryCov_9fa48("884", "885", "886"), type === (stryMutAct_9fa48("887") ? "" : (stryCov_9fa48("887"), 'reset')));
    }
  }

  /**
   * Type guard to check if data is PasswordResetEmailData
   */
  private isPasswordResetEmailData(data: unknown): data is PasswordResetEmailData {
    if (stryMutAct_9fa48("888")) {
      {}
    } else {
      stryCov_9fa48("888");
      if (stryMutAct_9fa48("891") ? !data && typeof data !== 'object' : stryMutAct_9fa48("890") ? false : stryMutAct_9fa48("889") ? true : (stryCov_9fa48("889", "890", "891"), (stryMutAct_9fa48("892") ? data : (stryCov_9fa48("892"), !data)) || (stryMutAct_9fa48("894") ? typeof data === 'object' : stryMutAct_9fa48("893") ? false : (stryCov_9fa48("893", "894"), typeof data !== (stryMutAct_9fa48("895") ? "" : (stryCov_9fa48("895"), 'object')))))) {
        if (stryMutAct_9fa48("896")) {
          {}
        } else {
          stryCov_9fa48("896");
          return stryMutAct_9fa48("897") ? true : (stryCov_9fa48("897"), false);
        }
      }
      const emailData = data as Record<string, unknown>;
      return stryMutAct_9fa48("900") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.resetUrl === 'string' && typeof emailData.supportUrl === 'string' || typeof emailData.securityUrl === 'string' : stryMutAct_9fa48("899") ? false : stryMutAct_9fa48("898") ? true : (stryCov_9fa48("898", "899", "900"), (stryMutAct_9fa48("902") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.resetUrl === 'string' || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("901") ? true : (stryCov_9fa48("901", "902"), (stryMutAct_9fa48("904") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' || typeof emailData.resetUrl === 'string' : stryMutAct_9fa48("903") ? true : (stryCov_9fa48("903", "904"), (stryMutAct_9fa48("906") ? typeof emailData.userName === 'string' || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("905") ? true : (stryCov_9fa48("905", "906"), (stryMutAct_9fa48("908") ? typeof emailData.userName !== 'string' : stryMutAct_9fa48("907") ? true : (stryCov_9fa48("907", "908"), typeof emailData.userName === (stryMutAct_9fa48("909") ? "" : (stryCov_9fa48("909"), 'string')))) && (stryMutAct_9fa48("911") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("910") ? true : (stryCov_9fa48("910", "911"), typeof emailData.userEmail === (stryMutAct_9fa48("912") ? "" : (stryCov_9fa48("912"), 'string')))))) && (stryMutAct_9fa48("914") ? typeof emailData.resetUrl !== 'string' : stryMutAct_9fa48("913") ? true : (stryCov_9fa48("913", "914"), typeof emailData.resetUrl === (stryMutAct_9fa48("915") ? "" : (stryCov_9fa48("915"), 'string')))))) && (stryMutAct_9fa48("917") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("916") ? true : (stryCov_9fa48("916", "917"), typeof emailData.supportUrl === (stryMutAct_9fa48("918") ? "" : (stryCov_9fa48("918"), 'string')))))) && (stryMutAct_9fa48("920") ? typeof emailData.securityUrl !== 'string' : stryMutAct_9fa48("919") ? true : (stryCov_9fa48("919", "920"), typeof emailData.securityUrl === (stryMutAct_9fa48("921") ? "" : (stryCov_9fa48("921"), 'string')))));
    }
  }

  /**
   * Validate password reset email data
   */
  validateData(data: unknown): {
    isValid: boolean;
    errors: string[];
  } {
    if (stryMutAct_9fa48("922")) {
      {}
    } else {
      stryCov_9fa48("922");
      const errors: string[] = stryMutAct_9fa48("923") ? ["Stryker was here"] : (stryCov_9fa48("923"), []);
      if (stryMutAct_9fa48("926") ? false : stryMutAct_9fa48("925") ? true : stryMutAct_9fa48("924") ? data : (stryCov_9fa48("924", "925", "926"), !data)) {
        if (stryMutAct_9fa48("927")) {
          {}
        } else {
          stryCov_9fa48("927");
          errors.push(stryMutAct_9fa48("928") ? "" : (stryCov_9fa48("928"), 'Email data is required'));
          return stryMutAct_9fa48("929") ? {} : (stryCov_9fa48("929"), {
            isValid: stryMutAct_9fa48("930") ? true : (stryCov_9fa48("930"), false),
            errors
          });
        }
      }
      if (stryMutAct_9fa48("933") ? false : stryMutAct_9fa48("932") ? true : stryMutAct_9fa48("931") ? this.isPasswordResetEmailData(data) : (stryCov_9fa48("931", "932", "933"), !this.isPasswordResetEmailData(data))) {
        if (stryMutAct_9fa48("934")) {
          {}
        } else {
          stryCov_9fa48("934");
          errors.push(stryMutAct_9fa48("935") ? "" : (stryCov_9fa48("935"), 'Invalid password reset email data structure'));
          if (stryMutAct_9fa48("938") ? typeof data !== 'object' : stryMutAct_9fa48("937") ? false : stryMutAct_9fa48("936") ? true : (stryCov_9fa48("936", "937", "938"), typeof data === (stryMutAct_9fa48("939") ? "" : (stryCov_9fa48("939"), 'object')))) {
            if (stryMutAct_9fa48("940")) {
              {}
            } else {
              stryCov_9fa48("940");
              const emailData = data as Record<string, unknown>;
              if (stryMutAct_9fa48("943") ? !emailData.userName && typeof emailData.userName !== 'string' : stryMutAct_9fa48("942") ? false : stryMutAct_9fa48("941") ? true : (stryCov_9fa48("941", "942", "943"), (stryMutAct_9fa48("944") ? emailData.userName : (stryCov_9fa48("944"), !emailData.userName)) || (stryMutAct_9fa48("946") ? typeof emailData.userName === 'string' : stryMutAct_9fa48("945") ? false : (stryCov_9fa48("945", "946"), typeof emailData.userName !== (stryMutAct_9fa48("947") ? "" : (stryCov_9fa48("947"), 'string')))))) {
                if (stryMutAct_9fa48("948")) {
                  {}
                } else {
                  stryCov_9fa48("948");
                  errors.push(stryMutAct_9fa48("949") ? "" : (stryCov_9fa48("949"), 'userName is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("952") ? !emailData.userEmail && typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("951") ? false : stryMutAct_9fa48("950") ? true : (stryCov_9fa48("950", "951", "952"), (stryMutAct_9fa48("953") ? emailData.userEmail : (stryCov_9fa48("953"), !emailData.userEmail)) || (stryMutAct_9fa48("955") ? typeof emailData.userEmail === 'string' : stryMutAct_9fa48("954") ? false : (stryCov_9fa48("954", "955"), typeof emailData.userEmail !== (stryMutAct_9fa48("956") ? "" : (stryCov_9fa48("956"), 'string')))))) {
                if (stryMutAct_9fa48("957")) {
                  {}
                } else {
                  stryCov_9fa48("957");
                  errors.push(stryMutAct_9fa48("958") ? "" : (stryCov_9fa48("958"), 'userEmail is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("961") ? !emailData.resetUrl && typeof emailData.resetUrl !== 'string' : stryMutAct_9fa48("960") ? false : stryMutAct_9fa48("959") ? true : (stryCov_9fa48("959", "960", "961"), (stryMutAct_9fa48("962") ? emailData.resetUrl : (stryCov_9fa48("962"), !emailData.resetUrl)) || (stryMutAct_9fa48("964") ? typeof emailData.resetUrl === 'string' : stryMutAct_9fa48("963") ? false : (stryCov_9fa48("963", "964"), typeof emailData.resetUrl !== (stryMutAct_9fa48("965") ? "" : (stryCov_9fa48("965"), 'string')))))) {
                if (stryMutAct_9fa48("966")) {
                  {}
                } else {
                  stryCov_9fa48("966");
                  errors.push(stryMutAct_9fa48("967") ? "" : (stryCov_9fa48("967"), 'resetUrl is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("970") ? !emailData.supportUrl && typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("969") ? false : stryMutAct_9fa48("968") ? true : (stryCov_9fa48("968", "969", "970"), (stryMutAct_9fa48("971") ? emailData.supportUrl : (stryCov_9fa48("971"), !emailData.supportUrl)) || (stryMutAct_9fa48("973") ? typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("972") ? false : (stryCov_9fa48("972", "973"), typeof emailData.supportUrl !== (stryMutAct_9fa48("974") ? "" : (stryCov_9fa48("974"), 'string')))))) {
                if (stryMutAct_9fa48("975")) {
                  {}
                } else {
                  stryCov_9fa48("975");
                  errors.push(stryMutAct_9fa48("976") ? "" : (stryCov_9fa48("976"), 'supportUrl is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("979") ? !emailData.securityUrl && typeof emailData.securityUrl !== 'string' : stryMutAct_9fa48("978") ? false : stryMutAct_9fa48("977") ? true : (stryCov_9fa48("977", "978", "979"), (stryMutAct_9fa48("980") ? emailData.securityUrl : (stryCov_9fa48("980"), !emailData.securityUrl)) || (stryMutAct_9fa48("982") ? typeof emailData.securityUrl === 'string' : stryMutAct_9fa48("981") ? false : (stryCov_9fa48("981", "982"), typeof emailData.securityUrl !== (stryMutAct_9fa48("983") ? "" : (stryCov_9fa48("983"), 'string')))))) {
                if (stryMutAct_9fa48("984")) {
                  {}
                } else {
                  stryCov_9fa48("984");
                  errors.push(stryMutAct_9fa48("985") ? "" : (stryCov_9fa48("985"), 'securityUrl is required and must be a string'));
                }
              }

              // Email format validation
              if (stryMutAct_9fa48("988") ? emailData.userEmail && typeof emailData.userEmail === 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : stryMutAct_9fa48("987") ? false : stryMutAct_9fa48("986") ? true : (stryCov_9fa48("986", "987", "988"), (stryMutAct_9fa48("990") ? emailData.userEmail || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("989") ? true : (stryCov_9fa48("989", "990"), emailData.userEmail && (stryMutAct_9fa48("992") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("991") ? true : (stryCov_9fa48("991", "992"), typeof emailData.userEmail === (stryMutAct_9fa48("993") ? "" : (stryCov_9fa48("993"), 'string')))))) && (stryMutAct_9fa48("994") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : (stryCov_9fa48("994"), !(stryMutAct_9fa48("1005") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("1004") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("1003") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("1002") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("1001") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1000") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("999") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("998") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("997") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("996") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("995") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("995", "996", "997", "998", "999", "1000", "1001", "1002", "1003", "1004", "1005"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(emailData.userEmail))))) {
                if (stryMutAct_9fa48("1006")) {
                  {}
                } else {
                  stryCov_9fa48("1006");
                  errors.push(stryMutAct_9fa48("1007") ? "" : (stryCov_9fa48("1007"), 'userEmail must be a valid email address'));
                }
              }

              // URL validation (basic)
              if (stryMutAct_9fa48("1010") ? emailData.resetUrl && typeof emailData.resetUrl === 'string' || !this.isValidUrl(emailData.resetUrl) : stryMutAct_9fa48("1009") ? false : stryMutAct_9fa48("1008") ? true : (stryCov_9fa48("1008", "1009", "1010"), (stryMutAct_9fa48("1012") ? emailData.resetUrl || typeof emailData.resetUrl === 'string' : stryMutAct_9fa48("1011") ? true : (stryCov_9fa48("1011", "1012"), emailData.resetUrl && (stryMutAct_9fa48("1014") ? typeof emailData.resetUrl !== 'string' : stryMutAct_9fa48("1013") ? true : (stryCov_9fa48("1013", "1014"), typeof emailData.resetUrl === (stryMutAct_9fa48("1015") ? "" : (stryCov_9fa48("1015"), 'string')))))) && (stryMutAct_9fa48("1016") ? this.isValidUrl(emailData.resetUrl) : (stryCov_9fa48("1016"), !this.isValidUrl(emailData.resetUrl))))) {
                if (stryMutAct_9fa48("1017")) {
                  {}
                } else {
                  stryCov_9fa48("1017");
                  errors.push(stryMutAct_9fa48("1018") ? "" : (stryCov_9fa48("1018"), 'resetUrl must be a valid URL'));
                }
              }
              if (stryMutAct_9fa48("1021") ? emailData.supportUrl && typeof emailData.supportUrl === 'string' || !this.isValidUrl(emailData.supportUrl) : stryMutAct_9fa48("1020") ? false : stryMutAct_9fa48("1019") ? true : (stryCov_9fa48("1019", "1020", "1021"), (stryMutAct_9fa48("1023") ? emailData.supportUrl || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("1022") ? true : (stryCov_9fa48("1022", "1023"), emailData.supportUrl && (stryMutAct_9fa48("1025") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("1024") ? true : (stryCov_9fa48("1024", "1025"), typeof emailData.supportUrl === (stryMutAct_9fa48("1026") ? "" : (stryCov_9fa48("1026"), 'string')))))) && (stryMutAct_9fa48("1027") ? this.isValidUrl(emailData.supportUrl) : (stryCov_9fa48("1027"), !this.isValidUrl(emailData.supportUrl))))) {
                if (stryMutAct_9fa48("1028")) {
                  {}
                } else {
                  stryCov_9fa48("1028");
                  errors.push(stryMutAct_9fa48("1029") ? "" : (stryCov_9fa48("1029"), 'supportUrl must be a valid URL'));
                }
              }
              if (stryMutAct_9fa48("1032") ? emailData.securityUrl && typeof emailData.securityUrl === 'string' || !this.isValidUrl(emailData.securityUrl) : stryMutAct_9fa48("1031") ? false : stryMutAct_9fa48("1030") ? true : (stryCov_9fa48("1030", "1031", "1032"), (stryMutAct_9fa48("1034") ? emailData.securityUrl || typeof emailData.securityUrl === 'string' : stryMutAct_9fa48("1033") ? true : (stryCov_9fa48("1033", "1034"), emailData.securityUrl && (stryMutAct_9fa48("1036") ? typeof emailData.securityUrl !== 'string' : stryMutAct_9fa48("1035") ? true : (stryCov_9fa48("1035", "1036"), typeof emailData.securityUrl === (stryMutAct_9fa48("1037") ? "" : (stryCov_9fa48("1037"), 'string')))))) && (stryMutAct_9fa48("1038") ? this.isValidUrl(emailData.securityUrl) : (stryCov_9fa48("1038"), !this.isValidUrl(emailData.securityUrl))))) {
                if (stryMutAct_9fa48("1039")) {
                  {}
                } else {
                  stryCov_9fa48("1039");
                  errors.push(stryMutAct_9fa48("1040") ? "" : (stryCov_9fa48("1040"), 'securityUrl must be a valid URL'));
                }
              }
            }
          }
          return stryMutAct_9fa48("1041") ? {} : (stryCov_9fa48("1041"), {
            isValid: stryMutAct_9fa48("1042") ? true : (stryCov_9fa48("1042"), false),
            errors
          });
        }
      }

      // Additional validation for valid data
      if (stryMutAct_9fa48("1045") ? false : stryMutAct_9fa48("1044") ? true : stryMutAct_9fa48("1043") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail) : (stryCov_9fa48("1043", "1044", "1045"), !(stryMutAct_9fa48("1056") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("1055") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("1054") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("1053") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("1052") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1051") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("1050") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1049") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1048") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("1047") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("1046") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("1046", "1047", "1048", "1049", "1050", "1051", "1052", "1053", "1054", "1055", "1056"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(data.userEmail))) {
        if (stryMutAct_9fa48("1057")) {
          {}
        } else {
          stryCov_9fa48("1057");
          errors.push(stryMutAct_9fa48("1058") ? "" : (stryCov_9fa48("1058"), 'userEmail must be a valid email address'));
        }
      }
      if (stryMutAct_9fa48("1061") ? false : stryMutAct_9fa48("1060") ? true : stryMutAct_9fa48("1059") ? this.isValidUrl(data.resetUrl) : (stryCov_9fa48("1059", "1060", "1061"), !this.isValidUrl(data.resetUrl))) {
        if (stryMutAct_9fa48("1062")) {
          {}
        } else {
          stryCov_9fa48("1062");
          errors.push(stryMutAct_9fa48("1063") ? "" : (stryCov_9fa48("1063"), 'resetUrl must be a valid URL'));
        }
      }
      if (stryMutAct_9fa48("1066") ? false : stryMutAct_9fa48("1065") ? true : stryMutAct_9fa48("1064") ? this.isValidUrl(data.supportUrl) : (stryCov_9fa48("1064", "1065", "1066"), !this.isValidUrl(data.supportUrl))) {
        if (stryMutAct_9fa48("1067")) {
          {}
        } else {
          stryCov_9fa48("1067");
          errors.push(stryMutAct_9fa48("1068") ? "" : (stryCov_9fa48("1068"), 'supportUrl must be a valid URL'));
        }
      }
      if (stryMutAct_9fa48("1071") ? false : stryMutAct_9fa48("1070") ? true : stryMutAct_9fa48("1069") ? this.isValidUrl(data.securityUrl) : (stryCov_9fa48("1069", "1070", "1071"), !this.isValidUrl(data.securityUrl))) {
        if (stryMutAct_9fa48("1072")) {
          {}
        } else {
          stryCov_9fa48("1072");
          errors.push(stryMutAct_9fa48("1073") ? "" : (stryCov_9fa48("1073"), 'securityUrl must be a valid URL'));
        }
      }
      return stryMutAct_9fa48("1074") ? {} : (stryCov_9fa48("1074"), {
        isValid: stryMutAct_9fa48("1077") ? errors.length !== 0 : stryMutAct_9fa48("1076") ? false : stryMutAct_9fa48("1075") ? true : (stryCov_9fa48("1075", "1076", "1077"), errors.length === 0),
        errors
      });
    }
  }
  private isValidUrl(url: string): boolean {
    if (stryMutAct_9fa48("1078")) {
      {}
    } else {
      stryCov_9fa48("1078");
      try {
        if (stryMutAct_9fa48("1079")) {
          {}
        } else {
          stryCov_9fa48("1079");
          new URL(url);
          return stryMutAct_9fa48("1080") ? false : (stryCov_9fa48("1080"), true);
        }
      } catch {
        if (stryMutAct_9fa48("1081")) {
          {}
        } else {
          stryCov_9fa48("1081");
          return stryMutAct_9fa48("1082") ? true : (stryCov_9fa48("1082"), false);
        }
      }
    }
  }
}