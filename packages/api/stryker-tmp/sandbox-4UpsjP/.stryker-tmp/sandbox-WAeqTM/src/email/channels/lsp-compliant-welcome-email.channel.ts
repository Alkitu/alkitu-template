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
import { IEmailChannel, WelcomeEmailData, EmailDeliveryResult, EmailChannelInfo } from '../interfaces/email-service.interface';
import { ServiceResult, ValidationResult, ValidationError, ServiceUnavailableError } from '../../common/interfaces/base-service.interface';
import { EmailService } from '../email.service';

/**
 * Welcome Email Channel - LSP Compliant Implementation
 *
 * This implementation strictly follows the Liskov Substitution Principle by:
 * - Never strengthening preconditions (accepts all valid WelcomeEmailData)
 * - Never weakening postconditions (always returns ServiceResult)
 * - Maintaining behavioral consistency with IEmailChannel contract
 * - Being fully substitutable with any other IEmailChannel implementation
 */
@Injectable()
export class LSPCompliantWelcomeEmailChannel implements IEmailChannel<WelcomeEmailData> {
  private readonly logger = new Logger(LSPCompliantWelcomeEmailChannel.name);

  // LSP: Immutable properties as required by interface
  readonly serviceId = stryMutAct_9fa48("0") ? "" : (stryCov_9fa48("0"), 'welcome-email-channel');
  readonly version = stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), '1.0.0');
  readonly channelType = stryMutAct_9fa48("2") ? "" : (stryCov_9fa48("2"), 'welcome');
  readonly supportedDataTypes = stryMutAct_9fa48("3") ? [] : (stryCov_9fa48("3"), [stryMutAct_9fa48("4") ? "" : (stryCov_9fa48("4"), 'welcome')]);
  readonly configSchema = stryMutAct_9fa48("5") ? {} : (stryCov_9fa48("5"), {
    templateId: stryMutAct_9fa48("6") ? {} : (stryCov_9fa48("6"), {
      type: stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), 'string'),
      required: stryMutAct_9fa48("8") ? false : (stryCov_9fa48("8"), true)
    }),
    sendDelay: stryMutAct_9fa48("9") ? {} : (stryCov_9fa48("9"), {
      type: stryMutAct_9fa48("10") ? "" : (stryCov_9fa48("10"), 'number'),
      required: stryMutAct_9fa48("11") ? true : (stryCov_9fa48("11"), false),
      default: 0
    }),
    enableTracking: stryMutAct_9fa48("12") ? {} : (stryCov_9fa48("12"), {
      type: stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), 'boolean'),
      required: stryMutAct_9fa48("14") ? true : (stryCov_9fa48("14"), false),
      default: stryMutAct_9fa48("15") ? false : (stryCov_9fa48("15"), true)
    })
  });
  private isInitialized = stryMutAct_9fa48("16") ? true : (stryCov_9fa48("16"), false);
  private startTime = Date.now();
  private lastHealthCheck = new Date();
  constructor(private readonly emailService: EmailService) {}

  /**
   * Initialize the service
   *
   * LSP Contract Implementation:
   * - Returns ServiceResult<void> as required
   * - Never throws exceptions
   * - Sets up service state properly
   */
  async initialize(): Promise<ServiceResult<void>> {
    if (stryMutAct_9fa48("17")) {
      {}
    } else {
      stryCov_9fa48("17");
      try {
        if (stryMutAct_9fa48("18")) {
          {}
        } else {
          stryCov_9fa48("18");
          this.logger.log(stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), 'Initializing Welcome Email Channel'));

          // Verify email service is available
          const emailServiceHealth = await this.emailService.testConfiguration();
          if (stryMutAct_9fa48("22") ? false : stryMutAct_9fa48("21") ? true : stryMutAct_9fa48("20") ? emailServiceHealth.success : (stryCov_9fa48("20", "21", "22"), !emailServiceHealth.success)) {
            if (stryMutAct_9fa48("23")) {
              {}
            } else {
              stryCov_9fa48("23");
              return stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
                success: stryMutAct_9fa48("25") ? true : (stryCov_9fa48("25"), false),
                error: new ServiceUnavailableError(stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), 'Email service is not available'), stryMutAct_9fa48("27") ? {} : (stryCov_9fa48("27"), {
                  emailServiceError: emailServiceHealth.error
                }))
              });
            }
          }
          this.isInitialized = stryMutAct_9fa48("28") ? false : (stryCov_9fa48("28"), true);
          this.logger.log(stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), 'Welcome Email Channel initialized successfully'));
          return stryMutAct_9fa48("30") ? {} : (stryCov_9fa48("30"), {
            success: stryMutAct_9fa48("31") ? false : (stryCov_9fa48("31"), true),
            metadata: stryMutAct_9fa48("32") ? {} : (stryCov_9fa48("32"), {
              initializedAt: new Date().toISOString(),
              emailServiceVersion: stryMutAct_9fa48("33") ? "" : (stryCov_9fa48("33"), 'latest')
            })
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("34")) {
          {}
        } else {
          stryCov_9fa48("34");
          this.logger.error(stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), 'Failed to initialize Welcome Email Channel'), error);
          return stryMutAct_9fa48("36") ? {} : (stryCov_9fa48("36"), {
            success: stryMutAct_9fa48("37") ? true : (stryCov_9fa48("37"), false),
            error: new ServiceUnavailableError(stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), 'Failed to initialize welcome email channel'), stryMutAct_9fa48("39") ? {} : (stryCov_9fa48("39"), {
              originalError: error instanceof Error ? error.message : stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), 'Unknown error')
            }))
          });
        }
      }
    }
  }

  /**
   * Check service health
   *
   * LSP Contract Implementation:
   * - Returns boolean as required
   * - Never throws exceptions
   * - Completes within reasonable time
   */
  async isHealthy(): Promise<boolean> {
    if (stryMutAct_9fa48("41")) {
      {}
    } else {
      stryCov_9fa48("41");
      try {
        if (stryMutAct_9fa48("42")) {
          {}
        } else {
          stryCov_9fa48("42");
          this.lastHealthCheck = new Date();
          if (stryMutAct_9fa48("45") ? false : stryMutAct_9fa48("44") ? true : stryMutAct_9fa48("43") ? this.isInitialized : (stryCov_9fa48("43", "44", "45"), !this.isInitialized)) {
            if (stryMutAct_9fa48("46")) {
              {}
            } else {
              stryCov_9fa48("46");
              return stryMutAct_9fa48("47") ? true : (stryCov_9fa48("47"), false);
            }
          }

          // Quick health check of email service
          const emailServiceTest = await Promise.race(stryMutAct_9fa48("48") ? [] : (stryCov_9fa48("48"), [this.emailService.testConfiguration(), new Promise<{
            success: boolean;
          }>(stryMutAct_9fa48("49") ? () => undefined : (stryCov_9fa48("49"), (_, reject) => setTimeout(stryMutAct_9fa48("50") ? () => undefined : (stryCov_9fa48("50"), () => reject(new Error(stryMutAct_9fa48("51") ? "" : (stryCov_9fa48("51"), 'Timeout')))), 3000)))]));
          return emailServiceTest.success;
        }
      } catch (error) {
        if (stryMutAct_9fa48("52")) {
          {}
        } else {
          stryCov_9fa48("52");
          this.logger.warn(stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), 'Health check failed'), error);
          return stryMutAct_9fa48("54") ? true : (stryCov_9fa48("54"), false);
        }
      }
    }
  }

  /**
   * Cleanup resources
   *
   * LSP Contract Implementation:
   * - Returns ServiceResult<void> as required
   * - Never throws exceptions
   * - Idempotent operation
   */
  async cleanup(): Promise<ServiceResult<void>> {
    if (stryMutAct_9fa48("55")) {
      {}
    } else {
      stryCov_9fa48("55");
      try {
        if (stryMutAct_9fa48("56")) {
          {}
        } else {
          stryCov_9fa48("56");
          this.logger.log(stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), 'Cleaning up Welcome Email Channel'));
          this.isInitialized = stryMutAct_9fa48("58") ? true : (stryCov_9fa48("58"), false);

          // Perform any async cleanup operations if needed
          await Promise.resolve(); // Ensure this is properly async

          return stryMutAct_9fa48("59") ? {} : (stryCov_9fa48("59"), {
            success: stryMutAct_9fa48("60") ? false : (stryCov_9fa48("60"), true),
            metadata: stryMutAct_9fa48("61") ? {} : (stryCov_9fa48("61"), {
              cleanedUpAt: new Date().toISOString()
            })
          });
        }
      } catch (error) {
        if (stryMutAct_9fa48("62")) {
          {}
        } else {
          stryCov_9fa48("62");
          this.logger.error(stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), 'Cleanup failed'), error);
          return stryMutAct_9fa48("64") ? {} : (stryCov_9fa48("64"), {
            success: stryMutAct_9fa48("65") ? true : (stryCov_9fa48("65"), false),
            error: new ServiceUnavailableError(stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), 'Failed to cleanup welcome email channel'), stryMutAct_9fa48("67") ? {} : (stryCov_9fa48("67"), {
              originalError: error instanceof Error ? error.message : stryMutAct_9fa48("68") ? "" : (stryCov_9fa48("68"), 'Unknown error')
            }))
          });
        }
      }
    }
  }

  /**
   * Get service information
   *
   * LSP Contract Implementation:
   * - Returns ServiceInfo as required
   * - Never throws exceptions
   * - Provides current status
   */
  getServiceInfo() {
    if (stryMutAct_9fa48("69")) {
      {}
    } else {
      stryCov_9fa48("69");
      return stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
        serviceId: this.serviceId,
        version: this.version,
        status: this.isInitialized ? (this.lastHealthCheck.getTime() > Date.now() - 60000 ? 'healthy' : 'degraded') as 'healthy' | 'degraded' | 'stopped' : 'stopped' as 'healthy' | 'degraded' | 'stopped',
        uptime: Date.now() - this.startTime,
        lastHealthCheck: this.lastHealthCheck,
        dependencies: stryMutAct_9fa48("72") ? [] : (stryCov_9fa48("72"), [stryMutAct_9fa48("73") ? "" : (stryCov_9fa48("73"), 'email-service')]),
        capabilities: stryMutAct_9fa48("74") ? [] : (stryCov_9fa48("74"), [stryMutAct_9fa48("75") ? "" : (stryCov_9fa48("75"), 'welcome-emails'), stryMutAct_9fa48("76") ? "" : (stryCov_9fa48("76"), 'template-rendering'), stryMutAct_9fa48("77") ? "" : (stryCov_9fa48("77"), 'tracking')])
      });
    }
  }

  /**
   * Send welcome email
   *
   * LSP Contract Implementation:
   * - Accepts all valid WelcomeEmailData (doesn't strengthen preconditions)
   * - Always returns ServiceResult<EmailDeliveryResult> (doesn't weaken postconditions)
   * - Never throws exceptions
   * - Validates data before processing
   */
  async send(data: WelcomeEmailData): Promise<ServiceResult<EmailDeliveryResult>> {
    if (stryMutAct_9fa48("78")) {
      {}
    } else {
      stryCov_9fa48("78");
      const startTime = Date.now();
      try {
        if (stryMutAct_9fa48("79")) {
          {}
        } else {
          stryCov_9fa48("79");
          this.logger.log(stryMutAct_9fa48("80") ? `` : (stryCov_9fa48("80"), `Sending welcome email to ${data.recipientEmail}`));

          // LSP: Validate data using standard validation (no strengthened preconditions)
          const validation = this.validateData(data);
          if (stryMutAct_9fa48("83") ? false : stryMutAct_9fa48("82") ? true : stryMutAct_9fa48("81") ? validation.isValid : (stryCov_9fa48("81", "82", "83"), !validation.isValid)) {
            if (stryMutAct_9fa48("84")) {
              {}
            } else {
              stryCov_9fa48("84");
              return stryMutAct_9fa48("85") ? {} : (stryCov_9fa48("85"), {
                success: stryMutAct_9fa48("86") ? true : (stryCov_9fa48("86"), false),
                error: new ValidationError(stryMutAct_9fa48("87") ? "" : (stryCov_9fa48("87"), 'Invalid welcome email data'), stryMutAct_9fa48("88") ? {} : (stryCov_9fa48("88"), {
                  validationErrors: validation.errors.map(stryMutAct_9fa48("89") ? () => undefined : (stryCov_9fa48("89"), e => e.message)),
                  recipientEmail: data.recipientEmail
                }))
              });
            }
          }

          // Check service health before processing
          if (stryMutAct_9fa48("92") ? false : stryMutAct_9fa48("91") ? true : stryMutAct_9fa48("90") ? this.isInitialized : (stryCov_9fa48("90", "91", "92"), !this.isInitialized)) {
            if (stryMutAct_9fa48("93")) {
              {}
            } else {
              stryCov_9fa48("93");
              return stryMutAct_9fa48("94") ? {} : (stryCov_9fa48("94"), {
                success: stryMutAct_9fa48("95") ? true : (stryCov_9fa48("95"), false),
                error: new ServiceUnavailableError(stryMutAct_9fa48("96") ? "" : (stryCov_9fa48("96"), 'Welcome email channel is not initialized'))
              });
            }
          }

          // Send email using underlying email service
          const emailResult = await this.emailService.sendWelcomeEmail(stryMutAct_9fa48("97") ? {} : (stryCov_9fa48("97"), {
            userName: data.recipientName,
            userEmail: data.recipientEmail,
            registrationDate: data.registrationDate,
            loginUrl: data.loginUrl,
            unsubscribeUrl: data.unsubscribeUrl,
            supportUrl: data.supportUrl
          }));

          // LSP: Always return ServiceResult (never throw exceptions)
          if (stryMutAct_9fa48("99") ? false : stryMutAct_9fa48("98") ? true : (stryCov_9fa48("98", "99"), emailResult.success)) {
            if (stryMutAct_9fa48("100")) {
              {}
            } else {
              stryCov_9fa48("100");
              const deliveryResult: EmailDeliveryResult = stryMutAct_9fa48("101") ? {} : (stryCov_9fa48("101"), {
                messageId: stryMutAct_9fa48("104") ? emailResult.messageId && `welcome_${Date.now()}` : stryMutAct_9fa48("103") ? false : stryMutAct_9fa48("102") ? true : (stryCov_9fa48("102", "103", "104"), emailResult.messageId || (stryMutAct_9fa48("105") ? `` : (stryCov_9fa48("105"), `welcome_${Date.now()}`))),
                status: stryMutAct_9fa48("106") ? "" : (stryCov_9fa48("106"), 'sent'),
                timestamp: new Date(),
                deliveryTime: Date.now() - startTime,
                provider: stryMutAct_9fa48("108") ? "" : (stryCov_9fa48("108"), 'resend')
              });
              this.logger.log(stryMutAct_9fa48("109") ? `` : (stryCov_9fa48("109"), `Welcome email sent successfully to ${data.recipientEmail}, messageId: ${deliveryResult.messageId}`));
              return stryMutAct_9fa48("110") ? {} : (stryCov_9fa48("110"), {
                success: stryMutAct_9fa48("111") ? false : (stryCov_9fa48("111"), true),
                data: deliveryResult,
                metadata: stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
                  channelType: this.channelType,
                  processedAt: new Date().toISOString()
                })
              });
            }
          } else {
            if (stryMutAct_9fa48("113")) {
              {}
            } else {
              stryCov_9fa48("113");
              return stryMutAct_9fa48("114") ? {} : (stryCov_9fa48("114"), {
                success: stryMutAct_9fa48("115") ? true : (stryCov_9fa48("115"), false),
                error: new ServiceUnavailableError(stryMutAct_9fa48("116") ? "" : (stryCov_9fa48("116"), 'Failed to send welcome email'), stryMutAct_9fa48("117") ? {} : (stryCov_9fa48("117"), {
                  emailServiceError: emailResult.error,
                  recipientEmail: data.recipientEmail
                }))
              });
            }
          }
        }
      } catch (error) {
        if (stryMutAct_9fa48("118")) {
          {}
        } else {
          stryCov_9fa48("118");
          this.logger.error(stryMutAct_9fa48("119") ? `` : (stryCov_9fa48("119"), `Failed to send welcome email to ${data.recipientEmail}:`), error);

          // LSP: Never throw exceptions, always return ServiceResult
          return stryMutAct_9fa48("120") ? {} : (stryCov_9fa48("120"), {
            success: stryMutAct_9fa48("121") ? true : (stryCov_9fa48("121"), false),
            error: new ServiceUnavailableError(stryMutAct_9fa48("122") ? "" : (stryCov_9fa48("122"), 'Unexpected error sending welcome email'), stryMutAct_9fa48("123") ? {} : (stryCov_9fa48("123"), {
              originalError: error instanceof Error ? error.message : stryMutAct_9fa48("124") ? "" : (stryCov_9fa48("124"), 'Unknown error'),
              recipientEmail: data.recipientEmail
            }))
          });
        }
      }
    }
  }

  /**
   * Validate email data
   *
   * LSP Contract Implementation:
   * - Uses consistent validation criteria for base fields
   * - Only adds validation for welcome-specific fields
   * - Returns ValidationResult as required
   * - Never throws exceptions
   */
  validateData(data: WelcomeEmailData): ValidationResult {
    if (stryMutAct_9fa48("125")) {
      {}
    } else {
      stryCov_9fa48("125");
      const errors: ValidationError[] = stryMutAct_9fa48("126") ? ["Stryker was here"] : (stryCov_9fa48("126"), []);
      try {
        if (stryMutAct_9fa48("127")) {
          {}
        } else {
          stryCov_9fa48("127");
          // Base validation (consistent across all channels)
          if (stryMutAct_9fa48("130") ? false : stryMutAct_9fa48("129") ? true : stryMutAct_9fa48("128") ? data : (stryCov_9fa48("128", "129", "130"), !data)) {
            if (stryMutAct_9fa48("131")) {
              {}
            } else {
              stryCov_9fa48("131");
              errors.push(new ValidationError(stryMutAct_9fa48("132") ? "" : (stryCov_9fa48("132"), 'Email data is required')));
              return stryMutAct_9fa48("133") ? {} : (stryCov_9fa48("133"), {
                isValid: stryMutAct_9fa48("134") ? true : (stryCov_9fa48("134"), false),
                errors
              });
            }
          }

          // Validate base fields (cannot strengthen these preconditions)
          if (stryMutAct_9fa48("137") ? !data.recipientEmail && typeof data.recipientEmail !== 'string' : stryMutAct_9fa48("136") ? false : stryMutAct_9fa48("135") ? true : (stryCov_9fa48("135", "136", "137"), (stryMutAct_9fa48("138") ? data.recipientEmail : (stryCov_9fa48("138"), !data.recipientEmail)) || (stryMutAct_9fa48("140") ? typeof data.recipientEmail === 'string' : stryMutAct_9fa48("139") ? false : (stryCov_9fa48("139", "140"), typeof data.recipientEmail !== (stryMutAct_9fa48("141") ? "" : (stryCov_9fa48("141"), 'string')))))) {
            if (stryMutAct_9fa48("142")) {
              {}
            } else {
              stryCov_9fa48("142");
              errors.push(new ValidationError(stryMutAct_9fa48("143") ? "" : (stryCov_9fa48("143"), 'recipientEmail is required and must be a string')));
            }
          } else if (stryMutAct_9fa48("146") ? false : stryMutAct_9fa48("145") ? true : stryMutAct_9fa48("144") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.recipientEmail) : (stryCov_9fa48("144", "145", "146"), !(stryMutAct_9fa48("157") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("156") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("155") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("154") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("153") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("152") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("151") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("150") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("149") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("148") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("147") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("147", "148", "149", "150", "151", "152", "153", "154", "155", "156", "157"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(data.recipientEmail))) {
            if (stryMutAct_9fa48("158")) {
              {}
            } else {
              stryCov_9fa48("158");
              errors.push(new ValidationError(stryMutAct_9fa48("159") ? "" : (stryCov_9fa48("159"), 'recipientEmail must be a valid email address')));
            }
          }
          if (stryMutAct_9fa48("162") ? !data.recipientName && typeof data.recipientName !== 'string' : stryMutAct_9fa48("161") ? false : stryMutAct_9fa48("160") ? true : (stryCov_9fa48("160", "161", "162"), (stryMutAct_9fa48("163") ? data.recipientName : (stryCov_9fa48("163"), !data.recipientName)) || (stryMutAct_9fa48("165") ? typeof data.recipientName === 'string' : stryMutAct_9fa48("164") ? false : (stryCov_9fa48("164", "165"), typeof data.recipientName !== (stryMutAct_9fa48("166") ? "" : (stryCov_9fa48("166"), 'string')))))) {
            if (stryMutAct_9fa48("167")) {
              {}
            } else {
              stryCov_9fa48("167");
              errors.push(new ValidationError(stryMutAct_9fa48("168") ? "" : (stryCov_9fa48("168"), 'recipientName is required and must be a string')));
            }
          }

          // Validate data type
          if (stryMutAct_9fa48("171") ? data.dataType === 'welcome' : stryMutAct_9fa48("170") ? false : stryMutAct_9fa48("169") ? true : (stryCov_9fa48("169", "170", "171"), data.dataType !== (stryMutAct_9fa48("172") ? "" : (stryCov_9fa48("172"), 'welcome')))) {
            if (stryMutAct_9fa48("173")) {
              {}
            } else {
              stryCov_9fa48("173");
              errors.push(new ValidationError(stryMutAct_9fa48("174") ? "" : (stryCov_9fa48("174"), 'dataType must be "welcome"')));
            }
          }

          // Welcome-specific validation (only for fields specific to this channel)
          if (stryMutAct_9fa48("177") ? !data.registrationDate && typeof data.registrationDate !== 'string' : stryMutAct_9fa48("176") ? false : stryMutAct_9fa48("175") ? true : (stryCov_9fa48("175", "176", "177"), (stryMutAct_9fa48("178") ? data.registrationDate : (stryCov_9fa48("178"), !data.registrationDate)) || (stryMutAct_9fa48("180") ? typeof data.registrationDate === 'string' : stryMutAct_9fa48("179") ? false : (stryCov_9fa48("179", "180"), typeof data.registrationDate !== (stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), 'string')))))) {
            if (stryMutAct_9fa48("182")) {
              {}
            } else {
              stryCov_9fa48("182");
              errors.push(new ValidationError(stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), 'registrationDate is required and must be a string')));
            }
          }
          if (stryMutAct_9fa48("186") ? !data.loginUrl && typeof data.loginUrl !== 'string' : stryMutAct_9fa48("185") ? false : stryMutAct_9fa48("184") ? true : (stryCov_9fa48("184", "185", "186"), (stryMutAct_9fa48("187") ? data.loginUrl : (stryCov_9fa48("187"), !data.loginUrl)) || (stryMutAct_9fa48("189") ? typeof data.loginUrl === 'string' : stryMutAct_9fa48("188") ? false : (stryCov_9fa48("188", "189"), typeof data.loginUrl !== (stryMutAct_9fa48("190") ? "" : (stryCov_9fa48("190"), 'string')))))) {
            if (stryMutAct_9fa48("191")) {
              {}
            } else {
              stryCov_9fa48("191");
              errors.push(new ValidationError(stryMutAct_9fa48("192") ? "" : (stryCov_9fa48("192"), 'loginUrl is required and must be a string')));
            }
          } else if (stryMutAct_9fa48("195") ? false : stryMutAct_9fa48("194") ? true : stryMutAct_9fa48("193") ? this.isValidUrl(data.loginUrl) : (stryCov_9fa48("193", "194", "195"), !this.isValidUrl(data.loginUrl))) {
            if (stryMutAct_9fa48("196")) {
              {}
            } else {
              stryCov_9fa48("196");
              errors.push(new ValidationError(stryMutAct_9fa48("197") ? "" : (stryCov_9fa48("197"), 'loginUrl must be a valid URL')));
            }
          }
          if (stryMutAct_9fa48("200") ? !data.unsubscribeUrl && typeof data.unsubscribeUrl !== 'string' : stryMutAct_9fa48("199") ? false : stryMutAct_9fa48("198") ? true : (stryCov_9fa48("198", "199", "200"), (stryMutAct_9fa48("201") ? data.unsubscribeUrl : (stryCov_9fa48("201"), !data.unsubscribeUrl)) || (stryMutAct_9fa48("203") ? typeof data.unsubscribeUrl === 'string' : stryMutAct_9fa48("202") ? false : (stryCov_9fa48("202", "203"), typeof data.unsubscribeUrl !== (stryMutAct_9fa48("204") ? "" : (stryCov_9fa48("204"), 'string')))))) {
            if (stryMutAct_9fa48("205")) {
              {}
            } else {
              stryCov_9fa48("205");
              errors.push(new ValidationError(stryMutAct_9fa48("206") ? "" : (stryCov_9fa48("206"), 'unsubscribeUrl is required and must be a string')));
            }
          } else if (stryMutAct_9fa48("209") ? false : stryMutAct_9fa48("208") ? true : stryMutAct_9fa48("207") ? this.isValidUrl(data.unsubscribeUrl) : (stryCov_9fa48("207", "208", "209"), !this.isValidUrl(data.unsubscribeUrl))) {
            if (stryMutAct_9fa48("210")) {
              {}
            } else {
              stryCov_9fa48("210");
              errors.push(new ValidationError(stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), 'unsubscribeUrl must be a valid URL')));
            }
          }
          if (stryMutAct_9fa48("214") ? !data.supportUrl && typeof data.supportUrl !== 'string' : stryMutAct_9fa48("213") ? false : stryMutAct_9fa48("212") ? true : (stryCov_9fa48("212", "213", "214"), (stryMutAct_9fa48("215") ? data.supportUrl : (stryCov_9fa48("215"), !data.supportUrl)) || (stryMutAct_9fa48("217") ? typeof data.supportUrl === 'string' : stryMutAct_9fa48("216") ? false : (stryCov_9fa48("216", "217"), typeof data.supportUrl !== (stryMutAct_9fa48("218") ? "" : (stryCov_9fa48("218"), 'string')))))) {
            if (stryMutAct_9fa48("219")) {
              {}
            } else {
              stryCov_9fa48("219");
              errors.push(new ValidationError(stryMutAct_9fa48("220") ? "" : (stryCov_9fa48("220"), 'supportUrl is required and must be a string')));
            }
          } else if (stryMutAct_9fa48("223") ? false : stryMutAct_9fa48("222") ? true : stryMutAct_9fa48("221") ? this.isValidUrl(data.supportUrl) : (stryCov_9fa48("221", "222", "223"), !this.isValidUrl(data.supportUrl))) {
            if (stryMutAct_9fa48("224")) {
              {}
            } else {
              stryCov_9fa48("224");
              errors.push(new ValidationError(stryMutAct_9fa48("225") ? "" : (stryCov_9fa48("225"), 'supportUrl must be a valid URL')));
            }
          }

          // Optional fields validation
          if (stryMutAct_9fa48("228") ? data.senderName || typeof data.senderName !== 'string' : stryMutAct_9fa48("227") ? false : stryMutAct_9fa48("226") ? true : (stryCov_9fa48("226", "227", "228"), data.senderName && (stryMutAct_9fa48("230") ? typeof data.senderName === 'string' : stryMutAct_9fa48("229") ? true : (stryCov_9fa48("229", "230"), typeof data.senderName !== (stryMutAct_9fa48("231") ? "" : (stryCov_9fa48("231"), 'string')))))) {
            if (stryMutAct_9fa48("232")) {
              {}
            } else {
              stryCov_9fa48("232");
              errors.push(new ValidationError(stryMutAct_9fa48("233") ? "" : (stryCov_9fa48("233"), 'senderName must be a string if provided')));
            }
          }
          if (stryMutAct_9fa48("236") ? data.replyTo || typeof data.replyTo !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.replyTo) : stryMutAct_9fa48("235") ? false : stryMutAct_9fa48("234") ? true : (stryCov_9fa48("234", "235", "236"), data.replyTo && (stryMutAct_9fa48("238") ? typeof data.replyTo !== 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.replyTo) : stryMutAct_9fa48("237") ? true : (stryCov_9fa48("237", "238"), (stryMutAct_9fa48("240") ? typeof data.replyTo === 'string' : stryMutAct_9fa48("239") ? false : (stryCov_9fa48("239", "240"), typeof data.replyTo !== (stryMutAct_9fa48("241") ? "" : (stryCov_9fa48("241"), 'string')))) || (stryMutAct_9fa48("242") ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.replyTo) : (stryCov_9fa48("242"), !(stryMutAct_9fa48("253") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("252") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("251") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("250") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("249") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("248") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("247") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("246") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("245") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("244") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("243") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/)).test(data.replyTo))))))) {
            if (stryMutAct_9fa48("254")) {
              {}
            } else {
              stryCov_9fa48("254");
              errors.push(new ValidationError(stryMutAct_9fa48("255") ? "" : (stryCov_9fa48("255"), 'replyTo must be a valid email address if provided')));
            }
          }
        }
      } catch (error) {
        if (stryMutAct_9fa48("256")) {
          {}
        } else {
          stryCov_9fa48("256");
          // LSP: Never throw exceptions from validation
          errors.push(new ValidationError(stryMutAct_9fa48("257") ? "" : (stryCov_9fa48("257"), 'Validation failed due to unexpected error'), stryMutAct_9fa48("258") ? {} : (stryCov_9fa48("258"), {
            originalError: error instanceof Error ? error.message : stryMutAct_9fa48("259") ? "" : (stryCov_9fa48("259"), 'Unknown error')
          })));
        }
      }
      return stryMutAct_9fa48("260") ? {} : (stryCov_9fa48("260"), {
        isValid: stryMutAct_9fa48("263") ? errors.length !== 0 : stryMutAct_9fa48("262") ? false : stryMutAct_9fa48("261") ? true : (stryCov_9fa48("261", "262", "263"), errors.length === 0),
        errors,
        warnings: (stryMutAct_9fa48("267") ? errors.length <= 0 : stryMutAct_9fa48("266") ? errors.length >= 0 : stryMutAct_9fa48("265") ? false : stryMutAct_9fa48("264") ? true : (stryCov_9fa48("264", "265", "266", "267"), errors.length > 0)) ? stryMutAct_9fa48("268") ? [] : (stryCov_9fa48("268"), [stryMutAct_9fa48("269") ? `` : (stryCov_9fa48("269"), `Found ${errors.length} validation errors`)]) : undefined
      });
    }
  }

  /**
   * Check if channel supports data type
   *
   * LSP Contract Implementation:
   * - Returns boolean as required
   * - Never throws exceptions
   * - Consistent with supportedDataTypes
   */
  supportsDataType(dataType: string): boolean {
    if (stryMutAct_9fa48("270")) {
      {}
    } else {
      stryCov_9fa48("270");
      return this.supportedDataTypes.includes(dataType as any);
    }
  }

  /**
   * Get channel information
   *
   * LSP Contract Implementation:
   * - Returns EmailChannelInfo as required
   * - Never throws exceptions
   * - Consistent across instances
   */
  getChannelInfo(): EmailChannelInfo {
    if (stryMutAct_9fa48("271")) {
      {}
    } else {
      stryCov_9fa48("271");
      return stryMutAct_9fa48("272") ? {} : (stryCov_9fa48("272"), {
        channelType: this.channelType,
        provider: stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), 'resend'),
        maxRecipientsPerMessage: 1,
        maxMessageSize: 10 * 1024 * 1024,
        // 10MB
        supportedFormats: stryMutAct_9fa48("276") ? [] : (stryCov_9fa48("276"), [stryMutAct_9fa48("277") ? "" : (stryCov_9fa48("277"), 'html'), stryMutAct_9fa48("278") ? "" : (stryCov_9fa48("278"), 'text')]),
        rateLimits: stryMutAct_9fa48("279") ? {} : (stryCov_9fa48("279"), {
          messagesPerHour: 100,
          messagesPerDay: 1000
        }),
        features: stryMutAct_9fa48("280") ? {} : (stryCov_9fa48("280"), {
          tracking: stryMutAct_9fa48("281") ? false : (stryCov_9fa48("281"), true),
          templates: stryMutAct_9fa48("282") ? false : (stryCov_9fa48("282"), true),
          attachments: stryMutAct_9fa48("283") ? true : (stryCov_9fa48("283"), false),
          scheduling: stryMutAct_9fa48("284") ? true : (stryCov_9fa48("284"), false)
        })
      });
    }
  }

  /**
   * Private helper methods
   */
  private isValidUrl(url: string): boolean {
    if (stryMutAct_9fa48("285")) {
      {}
    } else {
      stryCov_9fa48("285");
      try {
        if (stryMutAct_9fa48("286")) {
          {}
        } else {
          stryCov_9fa48("286");
          new URL(url);
          return stryMutAct_9fa48("287") ? false : (stryCov_9fa48("287"), true);
        }
      } catch {
        if (stryMutAct_9fa48("288")) {
          {}
        } else {
          stryCov_9fa48("288");
          return stryMutAct_9fa48("289") ? true : (stryCov_9fa48("289"), false);
        }
      }
    }
  }
}