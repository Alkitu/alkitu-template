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
import { EmailResult, MarketingEmailData } from '../types/email.types';
import { EmailService } from '../email.service';

/**
 * Marketing Email Channel - OCP EXTENSION EXAMPLE
 *
 * This class demonstrates OCP compliance by extending the email system
 * WITHOUT modifying any existing code. This new channel can be added
 * and registered dynamically.
 *
 * NOTICE: This file is a NEW addition that doesn't modify existing classes.
 */
@Injectable()
export class MarketingEmailChannel implements IEmailChannel {
  private readonly logger = new Logger(MarketingEmailChannel.name);
  readonly type = stryMutAct_9fa48("290") ? "" : (stryCov_9fa48("290"), 'marketing');
  constructor(private readonly emailService: EmailService) {}

  /**
   * Send a marketing email
   *
   * This implementation uses the existing EmailService but adds
   * marketing-specific logic and templates
   */
  async send(data: MarketingEmailData): Promise<EmailResult> {
    if (stryMutAct_9fa48("291")) {
      {}
    } else {
      stryCov_9fa48("291");
      try {
        if (stryMutAct_9fa48("292")) {
          {}
        } else {
          stryCov_9fa48("292");
          this.logger.log(stryMutAct_9fa48("293") ? `` : (stryCov_9fa48("293"), `Sending marketing email to ${data.userEmail} for campaign: ${data.campaignName}`));

          // Marketing emails have additional tracking and formatting
          const enhancedData = this.enhanceMarketingData(data);

          // Use a generic email method or create a new one in EmailService
          // For now, using the notification method as a base
          const result = await this.emailService.sendNotification(data.userEmail, data.userName, stryMutAct_9fa48("294") ? `` : (stryCov_9fa48("294"), `Marketing: ${data.campaignName}`), this.convertHtmlToText(data.contentHtml), stryMutAct_9fa48("295") ? "" : (stryCov_9fa48("295"), 'View Campaign'), enhancedData.trackingUrl);
          this.logger.log(stryMutAct_9fa48("296") ? `` : (stryCov_9fa48("296"), `Marketing email for campaign '${data.campaignName}' ${result.success ? stryMutAct_9fa48("297") ? "" : (stryCov_9fa48("297"), 'sent successfully') : stryMutAct_9fa48("298") ? "" : (stryCov_9fa48("298"), 'failed')} to ${data.userEmail}`));
          return result;
        }
      } catch (error) {
        if (stryMutAct_9fa48("299")) {
          {}
        } else {
          stryCov_9fa48("299");
          this.logger.error(stryMutAct_9fa48("300") ? `` : (stryCov_9fa48("300"), `Failed to send marketing email for campaign '${data.campaignName}' to ${data.userEmail}:`), error);
          return stryMutAct_9fa48("301") ? {} : (stryCov_9fa48("301"), {
            success: stryMutAct_9fa48("302") ? true : (stryCov_9fa48("302"), false),
            error: error instanceof Error ? error.message : stryMutAct_9fa48("303") ? "" : (stryCov_9fa48("303"), 'Unknown error')
          });
        }
      }
    }
  }

  /**
   * Check if this channel supports the given type
   */
  supports(type: string): boolean {
    if (stryMutAct_9fa48("304")) {
      {}
    } else {
      stryCov_9fa48("304");
      return stryMutAct_9fa48("307") ? type !== 'marketing' : stryMutAct_9fa48("306") ? false : stryMutAct_9fa48("305") ? true : (stryCov_9fa48("305", "306", "307"), type === (stryMutAct_9fa48("308") ? "" : (stryCov_9fa48("308"), 'marketing')));
    }
  }

  /**
   * Type guard to check if data is MarketingEmailData
   */
  private isMarketingEmailData(data: unknown): data is MarketingEmailData {
    if (stryMutAct_9fa48("309")) {
      {}
    } else {
      stryCov_9fa48("309");
      if (stryMutAct_9fa48("312") ? !data && typeof data !== 'object' : stryMutAct_9fa48("311") ? false : stryMutAct_9fa48("310") ? true : (stryCov_9fa48("310", "311", "312"), (stryMutAct_9fa48("313") ? data : (stryCov_9fa48("313"), !data)) || (stryMutAct_9fa48("315") ? typeof data === 'object' : stryMutAct_9fa48("314") ? false : (stryCov_9fa48("314", "315"), typeof data !== (stryMutAct_9fa48("316") ? "" : (stryCov_9fa48("316"), 'object')))))) {
        if (stryMutAct_9fa48("317")) {
          {}
        } else {
          stryCov_9fa48("317");
          return stryMutAct_9fa48("318") ? true : (stryCov_9fa48("318"), false);
        }
      }
      const emailData = data as Record<string, unknown>;
      return stryMutAct_9fa48("321") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.supportUrl === 'string' && typeof emailData.campaignName === 'string' && typeof emailData.contentHtml === 'string' || typeof emailData.unsubscribeUrl === 'string' : stryMutAct_9fa48("320") ? false : stryMutAct_9fa48("319") ? true : (stryCov_9fa48("319", "320", "321"), (stryMutAct_9fa48("323") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.supportUrl === 'string' && typeof emailData.campaignName === 'string' || typeof emailData.contentHtml === 'string' : stryMutAct_9fa48("322") ? true : (stryCov_9fa48("322", "323"), (stryMutAct_9fa48("325") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' && typeof emailData.supportUrl === 'string' || typeof emailData.campaignName === 'string' : stryMutAct_9fa48("324") ? true : (stryCov_9fa48("324", "325"), (stryMutAct_9fa48("327") ? typeof emailData.userName === 'string' && typeof emailData.userEmail === 'string' || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("326") ? true : (stryCov_9fa48("326", "327"), (stryMutAct_9fa48("329") ? typeof emailData.userName === 'string' || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("328") ? true : (stryCov_9fa48("328", "329"), (stryMutAct_9fa48("331") ? typeof emailData.userName !== 'string' : stryMutAct_9fa48("330") ? true : (stryCov_9fa48("330", "331"), typeof emailData.userName === (stryMutAct_9fa48("332") ? "" : (stryCov_9fa48("332"), 'string')))) && (stryMutAct_9fa48("334") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("333") ? true : (stryCov_9fa48("333", "334"), typeof emailData.userEmail === (stryMutAct_9fa48("335") ? "" : (stryCov_9fa48("335"), 'string')))))) && (stryMutAct_9fa48("337") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("336") ? true : (stryCov_9fa48("336", "337"), typeof emailData.supportUrl === (stryMutAct_9fa48("338") ? "" : (stryCov_9fa48("338"), 'string')))))) && (stryMutAct_9fa48("340") ? typeof emailData.campaignName !== 'string' : stryMutAct_9fa48("339") ? true : (stryCov_9fa48("339", "340"), typeof emailData.campaignName === (stryMutAct_9fa48("341") ? "" : (stryCov_9fa48("341"), 'string')))))) && (stryMutAct_9fa48("343") ? typeof emailData.contentHtml !== 'string' : stryMutAct_9fa48("342") ? true : (stryCov_9fa48("342", "343"), typeof emailData.contentHtml === (stryMutAct_9fa48("344") ? "" : (stryCov_9fa48("344"), 'string')))))) && (stryMutAct_9fa48("346") ? typeof emailData.unsubscribeUrl !== 'string' : stryMutAct_9fa48("345") ? true : (stryCov_9fa48("345", "346"), typeof emailData.unsubscribeUrl === (stryMutAct_9fa48("347") ? "" : (stryCov_9fa48("347"), 'string')))));
    }
  }

  /**
   * Validate marketing email data
   */
  validateData(data: unknown): {
    isValid: boolean;
    errors: string[];
  } {
    if (stryMutAct_9fa48("348")) {
      {}
    } else {
      stryCov_9fa48("348");
      const errors: string[] = stryMutAct_9fa48("349") ? ["Stryker was here"] : (stryCov_9fa48("349"), []);
      if (stryMutAct_9fa48("352") ? false : stryMutAct_9fa48("351") ? true : stryMutAct_9fa48("350") ? data : (stryCov_9fa48("350", "351", "352"), !data)) {
        if (stryMutAct_9fa48("353")) {
          {}
        } else {
          stryCov_9fa48("353");
          errors.push(stryMutAct_9fa48("354") ? "" : (stryCov_9fa48("354"), 'Email data is required'));
          return stryMutAct_9fa48("355") ? {} : (stryCov_9fa48("355"), {
            isValid: stryMutAct_9fa48("356") ? true : (stryCov_9fa48("356"), false),
            errors
          });
        }
      }
      if (stryMutAct_9fa48("359") ? false : stryMutAct_9fa48("358") ? true : stryMutAct_9fa48("357") ? this.isMarketingEmailData(data) : (stryCov_9fa48("357", "358", "359"), !this.isMarketingEmailData(data))) {
        if (stryMutAct_9fa48("360")) {
          {}
        } else {
          stryCov_9fa48("360");
          errors.push(stryMutAct_9fa48("361") ? "" : (stryCov_9fa48("361"), 'Invalid marketing email data structure'));
          if (stryMutAct_9fa48("364") ? typeof data !== 'object' : stryMutAct_9fa48("363") ? false : stryMutAct_9fa48("362") ? true : (stryCov_9fa48("362", "363", "364"), typeof data === (stryMutAct_9fa48("365") ? "" : (stryCov_9fa48("365"), 'object')))) {
            if (stryMutAct_9fa48("366")) {
              {}
            } else {
              stryCov_9fa48("366");
              const emailData = data as Record<string, unknown>;

              // Base validations
              if (stryMutAct_9fa48("369") ? !emailData.userName && typeof emailData.userName !== 'string' : stryMutAct_9fa48("368") ? false : stryMutAct_9fa48("367") ? true : (stryCov_9fa48("367", "368", "369"), (stryMutAct_9fa48("370") ? emailData.userName : (stryCov_9fa48("370"), !emailData.userName)) || (stryMutAct_9fa48("372") ? typeof emailData.userName === 'string' : stryMutAct_9fa48("371") ? false : (stryCov_9fa48("371", "372"), typeof emailData.userName !== (stryMutAct_9fa48("373") ? "" : (stryCov_9fa48("373"), 'string')))))) {
                if (stryMutAct_9fa48("374")) {
                  {}
                } else {
                  stryCov_9fa48("374");
                  errors.push(stryMutAct_9fa48("375") ? "" : (stryCov_9fa48("375"), 'userName is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("378") ? !emailData.userEmail && typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("377") ? false : stryMutAct_9fa48("376") ? true : (stryCov_9fa48("376", "377", "378"), (stryMutAct_9fa48("379") ? emailData.userEmail : (stryCov_9fa48("379"), !emailData.userEmail)) || (stryMutAct_9fa48("381") ? typeof emailData.userEmail === 'string' : stryMutAct_9fa48("380") ? false : (stryCov_9fa48("380", "381"), typeof emailData.userEmail !== (stryMutAct_9fa48("382") ? "" : (stryCov_9fa48("382"), 'string')))))) {
                if (stryMutAct_9fa48("383")) {
                  {}
                } else {
                  stryCov_9fa48("383");
                  errors.push(stryMutAct_9fa48("384") ? "" : (stryCov_9fa48("384"), 'userEmail is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("387") ? !emailData.supportUrl && typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("386") ? false : stryMutAct_9fa48("385") ? true : (stryCov_9fa48("385", "386", "387"), (stryMutAct_9fa48("388") ? emailData.supportUrl : (stryCov_9fa48("388"), !emailData.supportUrl)) || (stryMutAct_9fa48("390") ? typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("389") ? false : (stryCov_9fa48("389", "390"), typeof emailData.supportUrl !== (stryMutAct_9fa48("391") ? "" : (stryCov_9fa48("391"), 'string')))))) {
                if (stryMutAct_9fa48("392")) {
                  {}
                } else {
                  stryCov_9fa48("392");
                  errors.push(stryMutAct_9fa48("393") ? "" : (stryCov_9fa48("393"), 'supportUrl is required and must be a string'));
                }
              }

              // Marketing-specific validations
              if (stryMutAct_9fa48("396") ? !emailData.campaignName && typeof emailData.campaignName !== 'string' : stryMutAct_9fa48("395") ? false : stryMutAct_9fa48("394") ? true : (stryCov_9fa48("394", "395", "396"), (stryMutAct_9fa48("397") ? emailData.campaignName : (stryCov_9fa48("397"), !emailData.campaignName)) || (stryMutAct_9fa48("399") ? typeof emailData.campaignName === 'string' : stryMutAct_9fa48("398") ? false : (stryCov_9fa48("398", "399"), typeof emailData.campaignName !== (stryMutAct_9fa48("400") ? "" : (stryCov_9fa48("400"), 'string')))))) {
                if (stryMutAct_9fa48("401")) {
                  {}
                } else {
                  stryCov_9fa48("401");
                  errors.push(stryMutAct_9fa48("402") ? "" : (stryCov_9fa48("402"), 'campaignName is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("405") ? !emailData.contentHtml && typeof emailData.contentHtml !== 'string' : stryMutAct_9fa48("404") ? false : stryMutAct_9fa48("403") ? true : (stryCov_9fa48("403", "404", "405"), (stryMutAct_9fa48("406") ? emailData.contentHtml : (stryCov_9fa48("406"), !emailData.contentHtml)) || (stryMutAct_9fa48("408") ? typeof emailData.contentHtml === 'string' : stryMutAct_9fa48("407") ? false : (stryCov_9fa48("407", "408"), typeof emailData.contentHtml !== (stryMutAct_9fa48("409") ? "" : (stryCov_9fa48("409"), 'string')))))) {
                if (stryMutAct_9fa48("410")) {
                  {}
                } else {
                  stryCov_9fa48("410");
                  errors.push(stryMutAct_9fa48("411") ? "" : (stryCov_9fa48("411"), 'contentHtml is required and must be a string'));
                }
              }
              if (stryMutAct_9fa48("414") ? !emailData.unsubscribeUrl && typeof emailData.unsubscribeUrl !== 'string' : stryMutAct_9fa48("413") ? false : stryMutAct_9fa48("412") ? true : (stryCov_9fa48("412", "413", "414"), (stryMutAct_9fa48("415") ? emailData.unsubscribeUrl : (stryCov_9fa48("415"), !emailData.unsubscribeUrl)) || (stryMutAct_9fa48("417") ? typeof emailData.unsubscribeUrl === 'string' : stryMutAct_9fa48("416") ? false : (stryCov_9fa48("416", "417"), typeof emailData.unsubscribeUrl !== (stryMutAct_9fa48("418") ? "" : (stryCov_9fa48("418"), 'string')))))) {
                if (stryMutAct_9fa48("419")) {
                  {}
                } else {
                  stryCov_9fa48("419");
                  errors.push(stryMutAct_9fa48("420") ? "" : (stryCov_9fa48("420"), 'unsubscribeUrl is required and must be a string'));
                }
              }

              // Optional tracking pixel
              if (stryMutAct_9fa48("423") ? emailData.trackingPixelUrl || typeof emailData.trackingPixelUrl !== 'string' : stryMutAct_9fa48("422") ? false : stryMutAct_9fa48("421") ? true : (stryCov_9fa48("421", "422", "423"), emailData.trackingPixelUrl && (stryMutAct_9fa48("425") ? typeof emailData.trackingPixelUrl === 'string' : stryMutAct_9fa48("424") ? true : (stryCov_9fa48("424", "425"), typeof emailData.trackingPixelUrl !== (stryMutAct_9fa48("426") ? "" : (stryCov_9fa48("426"), 'string')))))) {
                if (stryMutAct_9fa48("427")) {
                  {}
                } else {
                  stryCov_9fa48("427");
                  errors.push(stryMutAct_9fa48("428") ? "" : (stryCov_9fa48("428"), 'trackingPixelUrl must be a string if provided'));
                }
              }

              // Email format validation
              if (stryMutAct_9fa48("431") ? emailData.userEmail && typeof emailData.userEmail === 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : stryMutAct_9fa48("430") ? false : stryMutAct_9fa48("429") ? true : (stryCov_9fa48("429", "430", "431"), (stryMutAct_9fa48("433") ? emailData.userEmail || typeof emailData.userEmail === 'string' : stryMutAct_9fa48("432") ? true : (stryCov_9fa48("432", "433"), emailData.userEmail && (stryMutAct_9fa48("435") ? typeof emailData.userEmail !== 'string' : stryMutAct_9fa48("434") ? true : (stryCov_9fa48("434", "435"), typeof emailData.userEmail === (stryMutAct_9fa48("436") ? "" : (stryCov_9fa48("436"), 'string')))))) && (stryMutAct_9fa48("437") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData.userEmail) : (stryCov_9fa48("437"), !(stryMutAct_9fa48("448") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("447") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("446") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("445") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("444") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("443") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("442") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("441") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("440") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("439") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("438") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("438", "439", "440", "441", "442", "443", "444", "445", "446", "447", "448"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(emailData.userEmail))))) {
                if (stryMutAct_9fa48("449")) {
                  {}
                } else {
                  stryCov_9fa48("449");
                  errors.push(stryMutAct_9fa48("450") ? "" : (stryCov_9fa48("450"), 'userEmail must be a valid email address'));
                }
              }

              // URL validation
              if (stryMutAct_9fa48("453") ? emailData.unsubscribeUrl && typeof emailData.unsubscribeUrl === 'string' || !this.isValidUrl(emailData.unsubscribeUrl) : stryMutAct_9fa48("452") ? false : stryMutAct_9fa48("451") ? true : (stryCov_9fa48("451", "452", "453"), (stryMutAct_9fa48("455") ? emailData.unsubscribeUrl || typeof emailData.unsubscribeUrl === 'string' : stryMutAct_9fa48("454") ? true : (stryCov_9fa48("454", "455"), emailData.unsubscribeUrl && (stryMutAct_9fa48("457") ? typeof emailData.unsubscribeUrl !== 'string' : stryMutAct_9fa48("456") ? true : (stryCov_9fa48("456", "457"), typeof emailData.unsubscribeUrl === (stryMutAct_9fa48("458") ? "" : (stryCov_9fa48("458"), 'string')))))) && (stryMutAct_9fa48("459") ? this.isValidUrl(emailData.unsubscribeUrl) : (stryCov_9fa48("459"), !this.isValidUrl(emailData.unsubscribeUrl))))) {
                if (stryMutAct_9fa48("460")) {
                  {}
                } else {
                  stryCov_9fa48("460");
                  errors.push(stryMutAct_9fa48("461") ? "" : (stryCov_9fa48("461"), 'unsubscribeUrl must be a valid URL'));
                }
              }
              if (stryMutAct_9fa48("464") ? emailData.supportUrl && typeof emailData.supportUrl === 'string' || !this.isValidUrl(emailData.supportUrl) : stryMutAct_9fa48("463") ? false : stryMutAct_9fa48("462") ? true : (stryCov_9fa48("462", "463", "464"), (stryMutAct_9fa48("466") ? emailData.supportUrl || typeof emailData.supportUrl === 'string' : stryMutAct_9fa48("465") ? true : (stryCov_9fa48("465", "466"), emailData.supportUrl && (stryMutAct_9fa48("468") ? typeof emailData.supportUrl !== 'string' : stryMutAct_9fa48("467") ? true : (stryCov_9fa48("467", "468"), typeof emailData.supportUrl === (stryMutAct_9fa48("469") ? "" : (stryCov_9fa48("469"), 'string')))))) && (stryMutAct_9fa48("470") ? this.isValidUrl(emailData.supportUrl) : (stryCov_9fa48("470"), !this.isValidUrl(emailData.supportUrl))))) {
                if (stryMutAct_9fa48("471")) {
                  {}
                } else {
                  stryCov_9fa48("471");
                  errors.push(stryMutAct_9fa48("472") ? "" : (stryCov_9fa48("472"), 'supportUrl must be a valid URL'));
                }
              }
              if (stryMutAct_9fa48("475") ? emailData.trackingPixelUrl && typeof emailData.trackingPixelUrl === 'string' || !this.isValidUrl(emailData.trackingPixelUrl) : stryMutAct_9fa48("474") ? false : stryMutAct_9fa48("473") ? true : (stryCov_9fa48("473", "474", "475"), (stryMutAct_9fa48("477") ? emailData.trackingPixelUrl || typeof emailData.trackingPixelUrl === 'string' : stryMutAct_9fa48("476") ? true : (stryCov_9fa48("476", "477"), emailData.trackingPixelUrl && (stryMutAct_9fa48("479") ? typeof emailData.trackingPixelUrl !== 'string' : stryMutAct_9fa48("478") ? true : (stryCov_9fa48("478", "479"), typeof emailData.trackingPixelUrl === (stryMutAct_9fa48("480") ? "" : (stryCov_9fa48("480"), 'string')))))) && (stryMutAct_9fa48("481") ? this.isValidUrl(emailData.trackingPixelUrl) : (stryCov_9fa48("481"), !this.isValidUrl(emailData.trackingPixelUrl))))) {
                if (stryMutAct_9fa48("482")) {
                  {}
                } else {
                  stryCov_9fa48("482");
                  errors.push(stryMutAct_9fa48("483") ? "" : (stryCov_9fa48("483"), 'trackingPixelUrl must be a valid URL'));
                }
              }

              // Content length validation
              if (stryMutAct_9fa48("486") ? emailData.campaignName && typeof emailData.campaignName === 'string' || emailData.campaignName.length > 100 : stryMutAct_9fa48("485") ? false : stryMutAct_9fa48("484") ? true : (stryCov_9fa48("484", "485", "486"), (stryMutAct_9fa48("488") ? emailData.campaignName || typeof emailData.campaignName === 'string' : stryMutAct_9fa48("487") ? true : (stryCov_9fa48("487", "488"), emailData.campaignName && (stryMutAct_9fa48("490") ? typeof emailData.campaignName !== 'string' : stryMutAct_9fa48("489") ? true : (stryCov_9fa48("489", "490"), typeof emailData.campaignName === (stryMutAct_9fa48("491") ? "" : (stryCov_9fa48("491"), 'string')))))) && (stryMutAct_9fa48("494") ? emailData.campaignName.length <= 100 : stryMutAct_9fa48("493") ? emailData.campaignName.length >= 100 : stryMutAct_9fa48("492") ? true : (stryCov_9fa48("492", "493", "494"), emailData.campaignName.length > 100)))) {
                if (stryMutAct_9fa48("495")) {
                  {}
                } else {
                  stryCov_9fa48("495");
                  errors.push(stryMutAct_9fa48("496") ? "" : (stryCov_9fa48("496"), 'campaignName must be 100 characters or less'));
                }
              }
              if (stryMutAct_9fa48("499") ? emailData.contentHtml && typeof emailData.contentHtml === 'string' || emailData.contentHtml.length > 50000 : stryMutAct_9fa48("498") ? false : stryMutAct_9fa48("497") ? true : (stryCov_9fa48("497", "498", "499"), (stryMutAct_9fa48("501") ? emailData.contentHtml || typeof emailData.contentHtml === 'string' : stryMutAct_9fa48("500") ? true : (stryCov_9fa48("500", "501"), emailData.contentHtml && (stryMutAct_9fa48("503") ? typeof emailData.contentHtml !== 'string' : stryMutAct_9fa48("502") ? true : (stryCov_9fa48("502", "503"), typeof emailData.contentHtml === (stryMutAct_9fa48("504") ? "" : (stryCov_9fa48("504"), 'string')))))) && (stryMutAct_9fa48("507") ? emailData.contentHtml.length <= 50000 : stryMutAct_9fa48("506") ? emailData.contentHtml.length >= 50000 : stryMutAct_9fa48("505") ? true : (stryCov_9fa48("505", "506", "507"), emailData.contentHtml.length > 50000)))) {
                if (stryMutAct_9fa48("508")) {
                  {}
                } else {
                  stryCov_9fa48("508");
                  errors.push(stryMutAct_9fa48("509") ? "" : (stryCov_9fa48("509"), 'contentHtml must be 50000 characters or less'));
                }
              }

              // HTML content validation (basic)
              if (stryMutAct_9fa48("512") ? emailData.contentHtml && typeof emailData.contentHtml === 'string' || !this.isValidHtml(emailData.contentHtml) : stryMutAct_9fa48("511") ? false : stryMutAct_9fa48("510") ? true : (stryCov_9fa48("510", "511", "512"), (stryMutAct_9fa48("514") ? emailData.contentHtml || typeof emailData.contentHtml === 'string' : stryMutAct_9fa48("513") ? true : (stryCov_9fa48("513", "514"), emailData.contentHtml && (stryMutAct_9fa48("516") ? typeof emailData.contentHtml !== 'string' : stryMutAct_9fa48("515") ? true : (stryCov_9fa48("515", "516"), typeof emailData.contentHtml === (stryMutAct_9fa48("517") ? "" : (stryCov_9fa48("517"), 'string')))))) && (stryMutAct_9fa48("518") ? this.isValidHtml(emailData.contentHtml) : (stryCov_9fa48("518"), !this.isValidHtml(emailData.contentHtml))))) {
                if (stryMutAct_9fa48("519")) {
                  {}
                } else {
                  stryCov_9fa48("519");
                  errors.push(stryMutAct_9fa48("520") ? "" : (stryCov_9fa48("520"), 'contentHtml must be valid HTML'));
                }
              }
            }
          }
          return stryMutAct_9fa48("521") ? {} : (stryCov_9fa48("521"), {
            isValid: stryMutAct_9fa48("522") ? true : (stryCov_9fa48("522"), false),
            errors
          });
        }
      }

      // Additional validation for valid data
      if (stryMutAct_9fa48("525") ? false : stryMutAct_9fa48("524") ? true : stryMutAct_9fa48("523") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.userEmail) : (stryCov_9fa48("523", "524", "525"), !(stryMutAct_9fa48("536") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("535") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("534") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("533") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("532") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("531") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("530") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("529") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("528") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("527") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("526") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("526", "527", "528", "529", "530", "531", "532", "533", "534", "535", "536"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(data.userEmail))) {
        if (stryMutAct_9fa48("537")) {
          {}
        } else {
          stryCov_9fa48("537");
          errors.push(stryMutAct_9fa48("538") ? "" : (stryCov_9fa48("538"), 'userEmail must be a valid email address'));
        }
      }
      if (stryMutAct_9fa48("541") ? false : stryMutAct_9fa48("540") ? true : stryMutAct_9fa48("539") ? this.isValidUrl(data.unsubscribeUrl) : (stryCov_9fa48("539", "540", "541"), !this.isValidUrl(data.unsubscribeUrl))) {
        if (stryMutAct_9fa48("542")) {
          {}
        } else {
          stryCov_9fa48("542");
          errors.push(stryMutAct_9fa48("543") ? "" : (stryCov_9fa48("543"), 'unsubscribeUrl must be a valid URL'));
        }
      }
      if (stryMutAct_9fa48("546") ? false : stryMutAct_9fa48("545") ? true : stryMutAct_9fa48("544") ? this.isValidUrl(data.supportUrl) : (stryCov_9fa48("544", "545", "546"), !this.isValidUrl(data.supportUrl))) {
        if (stryMutAct_9fa48("547")) {
          {}
        } else {
          stryCov_9fa48("547");
          errors.push(stryMutAct_9fa48("548") ? "" : (stryCov_9fa48("548"), 'supportUrl must be a valid URL'));
        }
      }
      if (stryMutAct_9fa48("551") ? data.trackingPixelUrl || !this.isValidUrl(data.trackingPixelUrl) : stryMutAct_9fa48("550") ? false : stryMutAct_9fa48("549") ? true : (stryCov_9fa48("549", "550", "551"), data.trackingPixelUrl && (stryMutAct_9fa48("552") ? this.isValidUrl(data.trackingPixelUrl) : (stryCov_9fa48("552"), !this.isValidUrl(data.trackingPixelUrl))))) {
        if (stryMutAct_9fa48("553")) {
          {}
        } else {
          stryCov_9fa48("553");
          errors.push(stryMutAct_9fa48("554") ? "" : (stryCov_9fa48("554"), 'trackingPixelUrl must be a valid URL'));
        }
      }
      if (stryMutAct_9fa48("558") ? data.campaignName.length <= 100 : stryMutAct_9fa48("557") ? data.campaignName.length >= 100 : stryMutAct_9fa48("556") ? false : stryMutAct_9fa48("555") ? true : (stryCov_9fa48("555", "556", "557", "558"), data.campaignName.length > 100)) {
        if (stryMutAct_9fa48("559")) {
          {}
        } else {
          stryCov_9fa48("559");
          errors.push(stryMutAct_9fa48("560") ? "" : (stryCov_9fa48("560"), 'campaignName must be 100 characters or less'));
        }
      }
      if (stryMutAct_9fa48("564") ? data.contentHtml.length <= 50000 : stryMutAct_9fa48("563") ? data.contentHtml.length >= 50000 : stryMutAct_9fa48("562") ? false : stryMutAct_9fa48("561") ? true : (stryCov_9fa48("561", "562", "563", "564"), data.contentHtml.length > 50000)) {
        if (stryMutAct_9fa48("565")) {
          {}
        } else {
          stryCov_9fa48("565");
          errors.push(stryMutAct_9fa48("566") ? "" : (stryCov_9fa48("566"), 'contentHtml must be 50000 characters or less'));
        }
      }
      if (stryMutAct_9fa48("569") ? false : stryMutAct_9fa48("568") ? true : stryMutAct_9fa48("567") ? this.isValidHtml(data.contentHtml) : (stryCov_9fa48("567", "568", "569"), !this.isValidHtml(data.contentHtml))) {
        if (stryMutAct_9fa48("570")) {
          {}
        } else {
          stryCov_9fa48("570");
          errors.push(stryMutAct_9fa48("571") ? "" : (stryCov_9fa48("571"), 'contentHtml must be valid HTML'));
        }
      }
      return stryMutAct_9fa48("572") ? {} : (stryCov_9fa48("572"), {
        isValid: stryMutAct_9fa48("575") ? errors.length !== 0 : stryMutAct_9fa48("574") ? false : stryMutAct_9fa48("573") ? true : (stryCov_9fa48("573", "574", "575"), errors.length === 0),
        errors
      });
    }
  }

  /**
   * Enhance marketing data with tracking and campaign-specific features
   */
  private enhanceMarketingData(data: MarketingEmailData): MarketingEmailData & {
    trackingUrl?: string;
  } {
    if (stryMutAct_9fa48("576")) {
      {}
    } else {
      stryCov_9fa48("576");
      const trackingUrl = data.trackingPixelUrl ? stryMutAct_9fa48("577") ? `` : (stryCov_9fa48("577"), `${data.trackingPixelUrl}?campaign=${encodeURIComponent(data.campaignName)}&email=${encodeURIComponent(data.userEmail)}&timestamp=${Date.now()}`) : undefined;
      return stryMutAct_9fa48("578") ? {} : (stryCov_9fa48("578"), {
        ...data,
        trackingUrl
      });
    }
  }

  /**
   * Convert HTML content to plain text for fallback
   */
  private convertHtmlToText(html: string): string {
    if (stryMutAct_9fa48("579")) {
      {}
    } else {
      stryCov_9fa48("579");
      return stryMutAct_9fa48("580") ? html.replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"') : (stryCov_9fa48("580"), html.replace(stryMutAct_9fa48("582") ? /<[>]*>/g : stryMutAct_9fa48("581") ? /<[^>]>/g : (stryCov_9fa48("581", "582"), /<[^>]*>/g), stryMutAct_9fa48("583") ? "Stryker was here!" : (stryCov_9fa48("583"), '')) // Remove HTML tags
      .replace(/&nbsp;/g, stryMutAct_9fa48("584") ? "" : (stryCov_9fa48("584"), ' ')).replace(/&amp;/g, stryMutAct_9fa48("585") ? "" : (stryCov_9fa48("585"), '&')).replace(/&lt;/g, stryMutAct_9fa48("586") ? "" : (stryCov_9fa48("586"), '<')).replace(/&gt;/g, stryMutAct_9fa48("587") ? "" : (stryCov_9fa48("587"), '>')).replace(/&quot;/g, stryMutAct_9fa48("588") ? "" : (stryCov_9fa48("588"), '"')).trim());
    }
  }

  /**
   * Basic HTML validation
   */
  private isValidHtml(html: string): boolean {
    if (stryMutAct_9fa48("589")) {
      {}
    } else {
      stryCov_9fa48("589");
      // Basic validation: check for balanced opening/closing tags
      const openTags = (stryMutAct_9fa48("592") ? html.match(/<[^/][^>]*>/g) && [] : stryMutAct_9fa48("591") ? false : stryMutAct_9fa48("590") ? true : (stryCov_9fa48("590", "591", "592"), html.match(stryMutAct_9fa48("595") ? /<[^/][>]*>/g : stryMutAct_9fa48("594") ? /<[^/][^>]>/g : stryMutAct_9fa48("593") ? /<[/][^>]*>/g : (stryCov_9fa48("593", "594", "595"), /<[^/][^>]*>/g)) || (stryMutAct_9fa48("596") ? ["Stryker was here"] : (stryCov_9fa48("596"), [])))).length;
      const closeTags = (stryMutAct_9fa48("599") ? html.match(/<\/[^>]*>/g) && [] : stryMutAct_9fa48("598") ? false : stryMutAct_9fa48("597") ? true : (stryCov_9fa48("597", "598", "599"), html.match(stryMutAct_9fa48("601") ? /<\/[>]*>/g : stryMutAct_9fa48("600") ? /<\/[^>]>/g : (stryCov_9fa48("600", "601"), /<\/[^>]*>/g)) || (stryMutAct_9fa48("602") ? ["Stryker was here"] : (stryCov_9fa48("602"), [])))).length;
      const selfClosing = (stryMutAct_9fa48("605") ? html.match(/<[^>]*\/>/g) && [] : stryMutAct_9fa48("604") ? false : stryMutAct_9fa48("603") ? true : (stryCov_9fa48("603", "604", "605"), html.match(stryMutAct_9fa48("607") ? /<[>]*\/>/g : stryMutAct_9fa48("606") ? /<[^>]\/>/g : (stryCov_9fa48("606", "607"), /<[^>]*\/>/g)) || (stryMutAct_9fa48("608") ? ["Stryker was here"] : (stryCov_9fa48("608"), [])))).length;

      // Should have roughly equal open and close tags (considering self-closing)
      return stryMutAct_9fa48("612") ? Math.abs(openTags - closeTags - selfClosing) > 2 : stryMutAct_9fa48("611") ? Math.abs(openTags - closeTags - selfClosing) < 2 : stryMutAct_9fa48("610") ? false : stryMutAct_9fa48("609") ? true : (stryCov_9fa48("609", "610", "611", "612"), Math.abs(openTags - closeTags - selfClosing) <= 2); // Allow some tolerance
    }
  }

  /**
   * URL validation utility
   */
  private isValidUrl(url: string): boolean {
    if (stryMutAct_9fa48("615")) {
      {}
    } else {
      stryCov_9fa48("615");
      try {
        if (stryMutAct_9fa48("616")) {
          {}
        } else {
          stryCov_9fa48("616");
          new URL(url);
          return stryMutAct_9fa48("617") ? false : (stryCov_9fa48("617"), true);
        }
      } catch {
        if (stryMutAct_9fa48("618")) {
          {}
        } else {
          stryCov_9fa48("618");
          return stryMutAct_9fa48("619") ? true : (stryCov_9fa48("619"), false);
        }
      }
    }
  }
}