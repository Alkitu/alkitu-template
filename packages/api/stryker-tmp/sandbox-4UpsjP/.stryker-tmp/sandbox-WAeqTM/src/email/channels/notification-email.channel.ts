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
import { EmailResult, NotificationEmailData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Notification Email Channel
 *
 * Handles notification email functionality following OCP.
 * This class is CLOSED for modification but OPEN for extension.
 */
@Injectable()
export class NotificationEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(NotificationEmailChannel.name);
  readonly type = stryMutAct_9fa48("620") ? "" : (stryCov_9fa48("620"), 'notification');
  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a notification email
   */
  async send(data: NotificationEmailData): Promise<EmailResult> {
    if (stryMutAct_9fa48("621")) {
      {}
    } else {
      stryCov_9fa48("621");
      try {
        if (stryMutAct_9fa48("622")) {
          {}
        } else {
          stryCov_9fa48("622");
          this.logger.log(stryMutAct_9fa48("623") ? `` : (stryCov_9fa48("623"), `Sending notification email to ${data.userEmail}`));
          const result = await this.emailService.sendNotification(data.userEmail, data.userName, data.subject, data.message, data.actionText, data.actionUrl);
          this.logger.log(stryMutAct_9fa48("624") ? `` : (stryCov_9fa48("624"), `Notification email ${result.success ? stryMutAct_9fa48("625") ? "" : (stryCov_9fa48("625"), 'sent successfully') : stryMutAct_9fa48("626") ? "" : (stryCov_9fa48("626"), 'failed')} to ${data.userEmail}`));
          return result;
        }
      } catch (error) {
        if (stryMutAct_9fa48("627")) {
          {}
        } else {
          stryCov_9fa48("627");
          this.logger.error(stryMutAct_9fa48("628") ? `` : (stryCov_9fa48("628"), `Failed to send notification email to ${data.userEmail}:`), error);
          return stryMutAct_9fa48("629") ? {} : (stryCov_9fa48("629"), {
            success: stryMutAct_9fa48("630") ? true : (stryCov_9fa48("630"), false),
            error: error instanceof Error ? error.message : stryMutAct_9fa48("631") ? "" : (stryCov_9fa48("631"), 'Unknown error')
          });
        }
      }
    }
  }

  /**
   * Check if this channel supports the given type
   */
  supports(type: string): boolean {
    if (stryMutAct_9fa48("632")) {
      {}
    } else {
      stryCov_9fa48("632");
      return stryMutAct_9fa48("635") ? type !== 'notification' : stryMutAct_9fa48("634") ? false : stryMutAct_9fa48("633") ? true : (stryCov_9fa48("633", "634", "635"), type === (stryMutAct_9fa48("636") ? "" : (stryCov_9fa48("636"), 'notification')));
    }
  }

  /**
   * Type guard to check if data is NotificationEmailData
   */
  private isNotificationEmailData(data: unknown): data is NotificationEmailData {
    if (stryMutAct_9fa48("637")) {
      {}
    } else {
      stryCov_9fa48("637");
      if (stryMutAct_9fa48("640") ? !data && typeof data !== 'object' : stryMutAct_9fa48("639") ? false : stryMutAct_9fa48("638") ? true : (stryCov_9fa48("638", "639", "640"), (stryMutAct_9fa48("641") ? data : (stryCov_9fa48("641"), !data)) || (stryMutAct_9fa48("643") ? typeof data === 'object' : stryMutAct_9fa48("642") ? false : (stryCov_9fa48("642", "643"), typeof data !== (stryMutAct_9fa48("644") ? "" : (stryCov_9fa48("644"), 'object')))))) {
        if (stryMutAct_9fa48("645")) {
          {}
        } else {
          stryCov_9fa48("645");
          return stryMutAct_9fa48("646") ? true : (stryCov_9fa48("646"), false);
        }
      }
      const emailData = data as Record<string, unknown>;
      return stryMutAct_9fa48("649") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.subject === 'string' && typeof emailData.message === 'string' || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("648") ? false : stryMutAct_9fa48("647") ? true : (stryCov_9fa48("647", "648", "649"), (stryMutAct_9fa48("651") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.subject === 'string' || typeof emailData.message === 'string' : stryMutAct_9fa48("650") ? true : (stryCov_9fa48("650", "651"), (stryMutAct_9fa48("653") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' || typeof emailData.subject === 'string' : stryMutAct_9fa48("652") ? true : (stryCov_9fa48("652", "653"), (stryMutAct_9fa48("655") ? typeof emailData.userName === 'string' || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("654") ? true : (stryCov_9fa48("654", "655"), (stryMutAct_9fa48("657") ? typeof emailData.userName !== 'string' : stryMutAct_9fa48("656") ? true : (stryCov_9fa48("656", "657"), typeof emailData.userName === (stryMutAct_9fa48("658") ? "" : (stryCov_9fa48("658"), 'string')))) && (stryMutAct_9fa48("660") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("659") ? true : (stryCov_9fa48("659", "660"), typeof emailData.userEmail === (stryMutAct_9fa48("661") ? "" : (stryCov_9fa48("661"), 'string')))))) && (stryMutAct_9fa48("663") ? typeof emailData.subject !== 'string' : stryMutAct_9fa48("662") ? true : (stryCov_9fa48("662", "663"), typeof emailData.subject === (stryMutAct_9fa48("664") ? "" : (stryCov_9fa48("664"), 'string')))))) && (stryMutAct_9fa48("666") ? typeof emailData.message !== 'string' : stryMutAct_9fa48("665") ? true : (stryCov_9fa48("665", "666"), typeof emailData.message === (stryMutAct_9fa48("667") ? "" : (stryCov_9fa48("667"), 'string')))))) && (stryMutAct_9fa48("669") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("668") ? true : (stryCov_9fa48("668", "669"), typeof emailData.supportUrl === (stryMutAct_9fa48("670") ? "" : (stryCov_9fa48("670"), 'string')))));
    }
  }

  /**
   * Validate notification email data
   */
  validateData(data: unknown): {
    isValid: boolean;
    errors: string[];
  } {
    if (stryMutAct_9fa48("671")) {
      {}
    } else {
      stryCov_9fa48("671");
      const errors: string[] = stryMutAct_9fa48("672") ? ["Stryker was here"] : (stryCov_9fa48("672"), []);
      if (stryMutAct_9fa48("675") ? false : stryMutAct_9fa48("674") ? true : stryMutAct_9fa48("673") ? data : (stryCov_9fa48("673", "674", "675"), !data)) {
        if (stryMutAct_9fa48("676")) {
          {}
        } else {
          stryCov_9fa48("676");
          errors.push(stryMutAct_9fa48("677") ? "" : (stryCov_9fa48("677"), 'Email data is required'));
          return stryMutAct_9fa48("678") ? {} : (stryCov_9fa48("678"), {
            isValid: stryMutAct_9fa48("679") ? true : (stryCov_9fa48("679"), false),
            errors
          });
        }
      }
      if (stryMutAct_9fa48("682") ? false : stryMutAct_9fa48("681") ? true : stryMutAct_9fa48("680") ? this.isNotificationEmailData(data) : (stryCov_9fa48("680", "681", "682"), !this.isNotificationEmailData(data))) {
        if (stryMutAct_9fa48("683")) {
          {}
        } else {
          stryCov_9fa48("683");
          errors.push(stryMutAct_9fa48("684") ? "" : (stryCov_9fa48("684"), 'Invalid notification email data structure'));
          if (stryMutAct_9fa48("687") ? typeof data !== 'object' : stryMutAct_9fa48("686") ? false : stryMutAct_9fa48("685") ? true : (stryCov_9fa48("685", "686", "687"), typeof data === (stryMutAct_9fa48("688") ? "" : (stryCov_9fa48("688"), 'object')))) {
            if (stryMutAct_9fa48("689")) {
              {}
            } else {
              stryCov_9fa48("689");
              const emailData = data as Record<string, unknown>;
              if (stryMutAct_9fa48("692") ? !emailData.userName && typeof emailData.userName !== 'string' : stryMutAct_9fa48("691") ? false : stryMutAct_9fa48("690") ? true : (stryCov_9fa48("690", "691", "692"), (stryMutAct_9fa48("693") ? emailData.userName : (stryCov_9fa48("693"), !emailData.userName)) || (stryMutAct_9fa48("695") ? typeof emailData.userName === 'string' : stryMutAct_9fa48("694") ? false : (stryCov_9fa48("694", "695"), typeof emailData.userName !== (stryMutAct_9fa48("696") ? "" : (stryCov_9fa48("696"), 'string')))))) {
                if (stryMutAct_9fa48("697")) {
                  {}
                } else {
                  stryCov_9fa48("697");
                  errors.push(stryMutAct_9fa48("698") ? "" : (stryCov_9fa48("698"), 'userName is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("701") ? !emailData.userEmail && typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("700") ? false : stryMutAct_9fa48("699") ? true : (stryCov_9fa48("699", "700", "701"), (stryMutAct_9fa48("702") ? emailData.userEmail : (stryCov_9fa48("702"), !emailData.userEmail)) || (stryMutAct_9fa48("704") ? typeof emailData.userEmail === 'string' : stryMutAct_9fa48("703") ? false : (stryCov_9fa48("703", "704"), typeof emailData.userEmail !== (stryMutAct_9fa48("705") ? "" : (stryCov_9fa48("705"), 'string')))))) {
                if (stryMutAct_9fa48("706")) {
                  {}
                } else {
                  stryCov_9fa48("706");
                  errors.push(stryMutAct_9fa48("707") ? "" : (stryCov_9fa48("707"), 'userEmail is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("710") ? !emailData.subject && typeof emailData.subject !== 'string' : stryMutAct_9fa48("709") ? false : stryMutAct_9fa48("708") ? true : (stryCov_9fa48("708", "709", "710"), (stryMutAct_9fa48("711") ? emailData.subject : (stryCov_9fa48("711"), !emailData.subject)) || (stryMutAct_9fa48("713") ? typeof emailData.subject === 'string' : stryMutAct_9fa48("712") ? false : (stryCov_9fa48("712", "713"), typeof emailData.subject !== (stryMutAct_9fa48("714") ? "" : (stryCov_9fa48("714"), 'string')))))) {
                if (stryMutAct_9fa48("715")) {
                  {}
                } else {
                  stryCov_9fa48("715");
                  errors.push(stryMutAct_9fa48("716") ? "" : (stryCov_9fa48("716"), 'subject is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("719") ? !emailData.message && typeof emailData.message !== 'string' : stryMutAct_9fa48("718") ? false : stryMutAct_9fa48("717") ? true : (stryCov_9fa48("717", "718", "719"), (stryMutAct_9fa48("720") ? emailData.message : (stryCov_9fa48("720"), !emailData.message)) || (stryMutAct_9fa48("722") ? typeof emailData.message === 'string' : stryMutAct_9fa48("721") ? false : (stryCov_9fa48("721", "722"), typeof emailData.message !== (stryMutAct_9fa48("723") ? "" : (stryCov_9fa48("723"), 'string')))))) {
                if (stryMutAct_9fa48("724")) {
                  {}
                } else {
                  stryCov_9fa48("724");
                  errors.push(stryMutAct_9fa48("725") ? "" : (stryCov_9fa48("725"), 'message is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("728") ? !emailData.supportUrl && typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("727") ? false : stryMutAct_9fa48("726") ? true : (stryCov_9fa48("726", "727", "728"), (stryMutAct_9fa48("729") ? emailData.supportUrl : (stryCov_9fa48("729"), !emailData.supportUrl)) || (stryMutAct_9fa48("731") ? typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("730") ? false : (stryCov_9fa48("730", "731"), typeof emailData.supportUrl !== (stryMutAct_9fa48("732") ? "" : (stryCov_9fa48("732"), 'string')))))) {
                if (stryMutAct_9fa48("733")) {
                  {}
                } else {
                  stryCov_9fa48("733");
                  errors.push(stryMutAct_9fa48("734") ? "" : (stryCov_9fa48("734"), 'supportUrl is required and must be a string'));
                }
              }

              // Optional fields validation
              if (stryMutAct_9fa48("737") ? emailData.actionText || typeof emailData.actionText !== 'string' : stryMutAct_9fa48("736") ? false : stryMutAct_9fa48("735") ? true : (stryCov_9fa48("735", "736", "737"), emailData.actionText && (stryMutAct_9fa48("739") ? typeof emailData.actionText === 'string' : stryMutAct_9fa48("738") ? true : (stryCov_9fa48("738", "739"), typeof emailData.actionText !== (stryMutAct_9fa48("740") ? "" : (stryCov_9fa48("740"), 'string')))))) {
                if (stryMutAct_9fa48("741")) {
                  {}
                } else {
                  stryCov_9fa48("741");
                  errors.push(stryMutAct_9fa48("742") ? "" : (stryCov_9fa48("742"), 'actionText must be a string if provided'));
                }
              }
              if (stryMutAct_9fa48("745") ? emailData.actionUrl || typeof emailData.actionUrl !== 'string' : stryMutAct_9fa48("744") ? false : stryMutAct_9fa48("743") ? true : (stryCov_9fa48("743", "744", "745"), emailData.actionUrl && (stryMutAct_9fa48("747") ? typeof emailData.actionUrl === 'string' : stryMutAct_9fa48("746") ? true : (stryCov_9fa48("746", "747"), typeof emailData.actionUrl !== (stryMutAct_9fa48("748") ? "" : (stryCov_9fa48("748"), 'string')))))) {
                if (stryMutAct_9fa48("749")) {
                  {}
                } else {
                  stryCov_9fa48("749");
                  errors.push(stryMutAct_9fa48("750") ? "" : (stryCov_9fa48("750"), 'actionUrl must be a string if provided'));
                }
              }

              // Email format validation
              if (stryMutAct_9fa48("753") ? emailData.userEmail && typeof emailData.userEmail === 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : stryMutAct_9fa48("752") ? false : stryMutAct_9fa48("751") ? true : (stryCov_9fa48("751", "752", "753"), (stryMutAct_9fa48("755") ? emailData.userEmail || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("754") ? true : (stryCov_9fa48("754", "755"), emailData.userEmail && (stryMutAct_9fa48("757") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("756") ? true : (stryCov_9fa48("756", "757"), typeof emailData.userEmail === (stryMutAct_9fa48("758") ? "" : (stryCov_9fa48("758"), 'string')))))) && (stryMutAct_9fa48("759") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : (stryCov_9fa48("759"), !(stryMutAct_9fa48("770") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("769") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("768") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("767") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("766") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("765") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("764") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("763") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("762") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("761") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("760") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("760", "761", "762", "763", "764", "765", "766", "767", "768", "769", "770"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(emailData.userEmail))))) {
                if (stryMutAct_9fa48("771")) {
                  {}
                } else {
                  stryCov_9fa48("771");
                  errors.push(stryMutAct_9fa48("772") ? "" : (stryCov_9fa48("772"), 'userEmail must be a valid email address'));
                }
              }

              // URL validation (basic)
              if (stryMutAct_9fa48("775") ? emailData.actionUrl && typeof emailData.actionUrl === 'string' || !this.isValidUrl(emailData.actionUrl) : stryMutAct_9fa48("774") ? false : stryMutAct_9fa48("773") ? true : (stryCov_9fa48("773", "774", "775"), (stryMutAct_9fa48("777") ? emailData.actionUrl || typeof emailData.actionUrl === 'string' : stryMutAct_9fa48("776") ? true : (stryCov_9fa48("776", "777"), emailData.actionUrl && (stryMutAct_9fa48("779") ? typeof emailData.actionUrl !== 'string' : stryMutAct_9fa48("778") ? true : (stryCov_9fa48("778", "779"), typeof emailData.actionUrl === (stryMutAct_9fa48("780") ? "" : (stryCov_9fa48("780"), 'string')))))) && (stryMutAct_9fa48("781") ? this.isValidUrl(emailData.actionUrl) : (stryCov_9fa48("781"), !this.isValidUrl(emailData.actionUrl))))) {
                if (stryMutAct_9fa48("782")) {
                  {}
                } else {
                  stryCov_9fa48("782");
                  errors.push(stryMutAct_9fa48("783") ? "" : (stryCov_9fa48("783"), 'actionUrl must be a valid URL'));
                }
              }
              if (stryMutAct_9fa48("786") ? emailData.supportUrl && typeof emailData.supportUrl === 'string' || !this.isValidUrl(emailData.supportUrl) : stryMutAct_9fa48("785") ? false : stryMutAct_9fa48("784") ? true : (stryCov_9fa48("784", "785", "786"), (stryMutAct_9fa48("788") ? emailData.supportUrl || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("787") ? true : (stryCov_9fa48("787", "788"), emailData.supportUrl && (stryMutAct_9fa48("790") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("789") ? true : (stryCov_9fa48("789", "790"), typeof emailData.supportUrl === (stryMutAct_9fa48("791") ? "" : (stryCov_9fa48("791"), 'string')))))) && (stryMutAct_9fa48("792") ? this.isValidUrl(emailData.supportUrl) : (stryCov_9fa48("792"), !this.isValidUrl(emailData.supportUrl))))) {
                if (stryMutAct_9fa48("793")) {
                  {}
                } else {
                  stryCov_9fa48("793");
                  errors.push(stryMutAct_9fa48("794") ? "" : (stryCov_9fa48("794"), 'supportUrl must be a valid URL'));
                }
              }

              // Content length validation
              if (stryMutAct_9fa48("797") ? emailData.subject && typeof emailData.subject === 'string' || emailData.subject.length > 200 : stryMutAct_9fa48("796") ? false : stryMutAct_9fa48("795") ? true : (stryCov_9fa48("795", "796", "797"), (stryMutAct_9fa48("799") ? emailData.subject || typeof emailData.subject === 'string' : stryMutAct_9fa48("798") ? true : (stryCov_9fa48("798", "799"), emailData.subject && (stryMutAct_9fa48("801") ? typeof emailData.subject !== 'string' : stryMutAct_9fa48("800") ? true : (stryCov_9fa48("800", "801"), typeof emailData.subject === (stryMutAct_9fa48("802") ? "" : (stryCov_9fa48("802"), 'string')))))) && (stryMutAct_9fa48("805") ? emailData.subject.length <= 200 : stryMutAct_9fa48("804") ? emailData.subject.length >= 200 : stryMutAct_9fa48("803") ? true : (stryCov_9fa48("803", "804", "805"), emailData.subject.length > 200)))) {
                if (stryMutAct_9fa48("806")) {
                  {}
                } else {
                  stryCov_9fa48("806");
                  errors.push(stryMutAct_9fa48("807") ? "" : (stryCov_9fa48("807"), 'subject must be 200 characters or less'));
                }
              }
              if (stryMutAct_9fa48("810") ? emailData.message && typeof emailData.message === 'string' || emailData.message.length > 5000 : stryMutAct_9fa48("809") ? false : stryMutAct_9fa48("808") ? true : (stryCov_9fa48("808", "809", "810"), (stryMutAct_9fa48("812") ? emailData.message || typeof emailData.message === 'string' : stryMutAct_9fa48("811") ? true : (stryCov_9fa48("811", "812"), emailData.message && (stryMutAct_9fa48("814") ? typeof emailData.message !== 'string' : stryMutAct_9fa48("813") ? true : (stryCov_9fa48("813", "814"), typeof emailData.message === (stryMutAct_9fa48("815") ? "" : (stryCov_9fa48("815"), 'string')))))) && (stryMutAct_9fa48("818") ? emailData.message.length <= 5000 : stryMutAct_9fa48("817") ? emailData.message.length >= 5000 : stryMutAct_9fa48("816") ? true : (stryCov_9fa48("816", "817", "818"), emailData.message.length > 5000)))) {
                if (stryMutAct_9fa48("819")) {
                  {}
                } else {
                  stryCov_9fa48("819");
                  errors.push(stryMutAct_9fa48("820") ? "" : (stryCov_9fa48("820"), 'message must be 5000 characters or less'));
                }
              }
            }
          }
          return stryMutAct_9fa48("821") ? {} : (stryCov_9fa48("821"), {
            isValid: stryMutAct_9fa48("822") ? true : (stryCov_9fa48("822"), false),
            errors
          });
        }
      }

      // Additional validation for valid data
      if (stryMutAct_9fa48("825") ? false : stryMutAct_9fa48("824") ? true : stryMutAct_9fa48("823") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail) : (stryCov_9fa48("823", "824", "825"), !(stryMutAct_9fa48("836") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("835") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("834") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("833") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("832") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("831") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("830") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("829") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("828") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("827") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("826") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("826", "827", "828", "829", "830", "831", "832", "833", "834", "835", "836"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(data.userEmail))) {
        if (stryMutAct_9fa48("837")) {
          {}
        } else {
          stryCov_9fa48("837");
          errors.push(stryMutAct_9fa48("838") ? "" : (stryCov_9fa48("838"), 'userEmail must be a valid email address'));
        }
      }
      if (stryMutAct_9fa48("841") ? data.actionUrl || !this.isValidUrl(data.actionUrl) : stryMutAct_9fa48("840") ? false : stryMutAct_9fa48("839") ? true : (stryCov_9fa48("839", "840", "841"), data.actionUrl && (stryMutAct_9fa48("842") ? this.isValidUrl(data.actionUrl) : (stryCov_9fa48("842"), !this.isValidUrl(data.actionUrl))))) {
        if (stryMutAct_9fa48("843")) {
          {}
        } else {
          stryCov_9fa48("843");
          errors.push(stryMutAct_9fa48("844") ? "" : (stryCov_9fa48("844"), 'actionUrl must be a valid URL'));
        }
      }
      if (stryMutAct_9fa48("847") ? false : stryMutAct_9fa48("846") ? true : stryMutAct_9fa48("845") ? this.isValidUrl(data.supportUrl) : (stryCov_9fa48("845", "846", "847"), !this.isValidUrl(data.supportUrl))) {
        if (stryMutAct_9fa48("848")) {
          {}
        } else {
          stryCov_9fa48("848");
          errors.push(stryMutAct_9fa48("849") ? "" : (stryCov_9fa48("849"), 'supportUrl must be a valid URL'));
        }
      }
      if (stryMutAct_9fa48("853") ? data.subject.length <= 200 : stryMutAct_9fa48("852") ? data.subject.length >= 200 : stryMutAct_9fa48("851") ? false : stryMutAct_9fa48("850") ? true : (stryCov_9fa48("850", "851", "852", "853"), data.subject.length > 200)) {
        if (stryMutAct_9fa48("854")) {
          {}
        } else {
          stryCov_9fa48("854");
          errors.push(stryMutAct_9fa48("855") ? "" : (stryCov_9fa48("855"), 'subject must be 200 characters or less'));
        }
      }
      if (stryMutAct_9fa48("859") ? data.message.length <= 5000 : stryMutAct_9fa48("858") ? data.message.length >= 5000 : stryMutAct_9fa48("857") ? false : stryMutAct_9fa48("856") ? true : (stryCov_9fa48("856", "857", "858", "859"), data.message.length > 5000)) {
        if (stryMutAct_9fa48("860")) {
          {}
        } else {
          stryCov_9fa48("860");
          errors.push(stryMutAct_9fa48("861") ? "" : (stryCov_9fa48("861"), 'message must be 5000 characters or less'));
        }
      }
      return stryMutAct_9fa48("862") ? {} : (stryCov_9fa48("862"), {
        isValid: stryMutAct_9fa48("865") ? errors.length !== 0 : stryMutAct_9fa48("864") ? false : stryMutAct_9fa48("863") ? true : (stryCov_9fa48("863", "864", "865"), errors.length === 0),
        errors
      });
    }
  }
  private isValidUrl(url: string): boolean {
    if (stryMutAct_9fa48("866")) {
      {}
    } else {
      stryCov_9fa48("866");
      try {
        if (stryMutAct_9fa48("867")) {
          {}
        } else {
          stryCov_9fa48("867");
          new URL(url);
          return stryMutAct_9fa48("868") ? false : (stryCov_9fa48("868"), true);
        }
      } catch {
        if (stryMutAct_9fa48("869")) {
          {}
        } else {
          stryCov_9fa48("869");
          return stryMutAct_9fa48("870") ? true : (stryCov_9fa48("870"), false);
        }
      }
    }
  }
}