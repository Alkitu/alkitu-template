/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// @ts-nocheck

// 

/* eslint-disable @typescript-eslint/no-unsafe-member-access */function stryNS_9fa48() {
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
import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmailService } from './email.service';
import { TestEmailDto } from './dto/test-email.dto';
import { EmailChannelRegistryService } from './services/email-channel-registry.service';
@ApiTags('email')
@Controller('email')
export class EmailController {
  private readonly logger = new Logger(EmailController.name);
  constructor(private emailService: EmailService, private emailChannelRegistry: EmailChannelRegistryService) {}
  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Test email functionality (development only)',
    description: 'Send test emails of different types to verify email service configuration. This endpoint is intended for development and testing purposes only.'
  })
  @ApiBody({
    type: TestEmailDto
  })
  @ApiResponse({
    status: 200,
    description: 'Email sent successfully',
    schema: {
      example: {
        success: true,
        message: 'Email de welcome enviado exitosamente',
        messageId: 'b25c6e4a-8e2f-4c78-9b4a-1234567890ab'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Error sending email',
    schema: {
      example: {
        success: false,
        error: 'Invalid email type or configuration error'
      }
    }
  })
  async testEmail(@Body()
  testEmailDto: TestEmailDto) {
    if (stryMutAct_9fa48("0")) {
      {}
    } else {
      stryCov_9fa48("0");
      const {
        to,
        type,
        userName = stryMutAct_9fa48("1") ? "" : (stryCov_9fa48("1"), 'Usuario de Prueba')
      } = testEmailDto;
      try {
        if (stryMutAct_9fa48("2")) {
          {}
        } else {
          stryCov_9fa48("2");
          this.logger.log(stryMutAct_9fa48("3") ? `` : (stryCov_9fa48("3"), `Processing test email request: type=${type}, to=${to}`));

          // ✅ OCP COMPLIANT: No switch statement needed!
          // The registry dynamically finds the appropriate channel
          const emailData = this.buildEmailData(type, to, userName);
          const result = await this.emailChannelRegistry.sendEmail(type, emailData);
          const response = stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
            success: result.success,
            message: result.success ? stryMutAct_9fa48("5") ? `` : (stryCov_9fa48("5"), `Email de ${type} enviado exitosamente`) : stryMutAct_9fa48("6") ? `` : (stryCov_9fa48("6"), `Error enviando email: ${result.error}`),
            messageId: result.messageId
          });
          this.logger.log(stryMutAct_9fa48("7") ? `` : (stryCov_9fa48("7"), `Test email response: ${JSON.stringify(response)}`));
          return response;
        }
      } catch (error: any) {
        if (stryMutAct_9fa48("8")) {
          {}
        } else {
          stryCov_9fa48("8");
          this.logger.error(stryMutAct_9fa48("9") ? `` : (stryCov_9fa48("9"), `Error processing test email request:`), error);
          return stryMutAct_9fa48("10") ? {} : (stryCov_9fa48("10"), {
            success: stryMutAct_9fa48("11") ? true : (stryCov_9fa48("11"), false),
            error: error.message
          });
        }
      }
    }
  }

  /**
   * Build email data based on type
   *
   * This method prepares the data for each email type.
   * Adding new email types only requires adding a new case here,
   * no modification to the main flow.
   */
  private buildEmailData(type: string, to: string, userName: string): any {
    if (stryMutAct_9fa48("12")) {
      {}
    } else {
      stryCov_9fa48("12");
      const baseUrls = stryMutAct_9fa48("13") ? {} : (stryCov_9fa48("13"), {
        login: stryMutAct_9fa48("14") ? "" : (stryCov_9fa48("14"), 'http://localhost:3000/login'),
        support: stryMutAct_9fa48("15") ? "" : (stryCov_9fa48("15"), 'http://localhost:3000/support'),
        dashboard: stryMutAct_9fa48("16") ? "" : (stryCov_9fa48("16"), 'http://localhost:3000/dashboard'),
        security: stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), 'http://localhost:3000/security'),
        unsubscribe: stryMutAct_9fa48("18") ? "" : (stryCov_9fa48("18"), 'http://localhost:3000/unsubscribe')
      });
      switch (type) {
        case stryMutAct_9fa48("20") ? "" : (stryCov_9fa48("20"), 'welcome'):
          if (stryMutAct_9fa48("19")) {} else {
            stryCov_9fa48("19");
            return stryMutAct_9fa48("21") ? {} : (stryCov_9fa48("21"), {
              userName,
              userEmail: to,
              registrationDate: new Date().toLocaleDateString(stryMutAct_9fa48("22") ? "" : (stryCov_9fa48("22"), 'es-ES')),
              loginUrl: baseUrls.login,
              unsubscribeUrl: baseUrls.unsubscribe,
              supportUrl: baseUrls.support
            });
          }
        case stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), 'reset'):
          if (stryMutAct_9fa48("23")) {} else {
            stryCov_9fa48("23");
            return stryMutAct_9fa48("25") ? {} : (stryCov_9fa48("25"), {
              userName,
              userEmail: to,
              resetUrl: stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), 'http://localhost:3000/reset-password?token=test-token-123'),
              supportUrl: baseUrls.support,
              securityUrl: baseUrls.security
            });
          }
        case stryMutAct_9fa48("28") ? "" : (stryCov_9fa48("28"), 'verification'):
          if (stryMutAct_9fa48("27")) {} else {
            stryCov_9fa48("27");
            return stryMutAct_9fa48("29") ? {} : (stryCov_9fa48("29"), {
              userName,
              userEmail: to,
              verificationUrl: stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), 'http://localhost:3000/verify-email?token=test-token-123'),
              supportUrl: baseUrls.support
            });
          }
        case stryMutAct_9fa48("32") ? "" : (stryCov_9fa48("32"), 'notification'):
          if (stryMutAct_9fa48("31")) {} else {
            stryCov_9fa48("31");
            return stryMutAct_9fa48("33") ? {} : (stryCov_9fa48("33"), {
              userName,
              userEmail: to,
              subject: stryMutAct_9fa48("34") ? "" : (stryCov_9fa48("34"), 'Notificación de Prueba'),
              message: stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), 'Esta es una notificación de prueba del sistema de emails de Alkitu. Todo está funcionando correctamente.'),
              actionText: stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), 'Ir al Dashboard'),
              actionUrl: baseUrls.dashboard,
              supportUrl: baseUrls.support
            });
          }
        case stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), 'marketing'):
          if (stryMutAct_9fa48("37")) {} else {
            stryCov_9fa48("37");
            return stryMutAct_9fa48("39") ? {} : (stryCov_9fa48("39"), {
              userName,
              userEmail: to,
              campaignName: stryMutAct_9fa48("40") ? "" : (stryCov_9fa48("40"), 'Test Marketing Campaign'),
              contentHtml: stryMutAct_9fa48("41") ? "" : (stryCov_9fa48("41"), '<h1>Welcome to our newsletter!</h1><p>This is a test marketing email.</p>'),
              unsubscribeUrl: baseUrls.unsubscribe,
              supportUrl: baseUrls.support,
              trackingPixelUrl: stryMutAct_9fa48("42") ? "" : (stryCov_9fa48("42"), 'http://localhost:3000/track')
            });
          }
        default:
          if (stryMutAct_9fa48("43")) {} else {
            stryCov_9fa48("43");
            throw new Error(stryMutAct_9fa48("44") ? `` : (stryCov_9fa48("44"), `Email type '${type}' is not supported`));
          }
      }
    }
  }
  @Post('test-config')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Test email service configuration',
    description: 'Verify that the email service (Resend) configuration is working properly without sending actual emails.'
  })
  @ApiResponse({
    status: 200,
    description: 'Configuration test result',
    schema: {
      example: {
        success: true,
        message: 'Configuración de Resend funcionando correctamente'
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Configuration error',
    schema: {
      example: {
        success: false,
        error: 'API key not configured or invalid'
      }
    }
  })
  async testConfiguration() {
    if (stryMutAct_9fa48("45")) {
      {}
    } else {
      stryCov_9fa48("45");
      try {
        if (stryMutAct_9fa48("46")) {
          {}
        } else {
          stryCov_9fa48("46");
          const result = await this.emailService.testConfiguration();
          return stryMutAct_9fa48("47") ? {} : (stryCov_9fa48("47"), {
            success: result.success,
            message: result.success ? stryMutAct_9fa48("48") ? "" : (stryCov_9fa48("48"), 'Configuración de Resend funcionando correctamente') : stryMutAct_9fa48("49") ? `` : (stryCov_9fa48("49"), `Error en configuración: ${result.error}`)
          });
        }
      } catch (error: any) {
        if (stryMutAct_9fa48("50")) {
          {}
        } else {
          stryCov_9fa48("50");
          return stryMutAct_9fa48("51") ? {} : (stryCov_9fa48("51"), {
            success: stryMutAct_9fa48("52") ? true : (stryCov_9fa48("52"), false),
            error: error.message
          });
        }
      }
    }
  }
  @Post('registry-info')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get email registry information',
    description: 'Display information about registered email channels and supported types. Demonstrates OCP extensibility.'
  })
  @ApiResponse({
    status: 200,
    description: 'Registry information retrieved successfully',
    schema: {
      example: {
        success: true,
        data: {
          totalChannels: 5,
          supportedTypes: ['welcome', 'reset', 'verification', 'notification', 'marketing'],
          channelDetails: [{
            type: 'welcome',
            className: 'WelcomeEmailChannel'
          }, {
            type: 'reset',
            className: 'PasswordResetEmailChannel'
          }, {
            type: 'verification',
            className: 'EmailVerificationChannel'
          }, {
            type: 'notification',
            className: 'NotificationEmailChannel'
          }, {
            type: 'marketing',
            className: 'MarketingEmailChannel'
          }]
        },
        message: 'Email registry information retrieved successfully'
      }
    }
  })
  async getRegistryInfo() {
    if (stryMutAct_9fa48("53")) {
      {}
    } else {
      stryCov_9fa48("53");
      try {
        if (stryMutAct_9fa48("54")) {
          {}
        } else {
          stryCov_9fa48("54");
          this.logger.log(stryMutAct_9fa48("55") ? "" : (stryCov_9fa48("55"), 'Retrieving email registry information'));
          const stats = this.emailChannelRegistry.getRegistryStats();
          const response = stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
            success: stryMutAct_9fa48("57") ? false : (stryCov_9fa48("57"), true),
            data: stats,
            message: stryMutAct_9fa48("58") ? "" : (stryCov_9fa48("58"), 'Email registry information retrieved successfully'),
            ocpCompliance: stryMutAct_9fa48("59") ? {} : (stryCov_9fa48("59"), {
              description: stryMutAct_9fa48("60") ? "" : (stryCov_9fa48("60"), 'This system follows the Open/Closed Principle'),
              benefits: stryMutAct_9fa48("61") ? [] : (stryCov_9fa48("61"), [stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), 'New email types can be added without modifying existing code'), stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), 'Email channels are registered dynamically'), stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), 'System is extensible without breaking existing functionality'), stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), 'Each email type has its own validation and processing logic')]),
              extensionExample: stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), 'To add a new email type, create a class implementing IEmailChannel and register it in the module')
            })
          });
          this.logger.log(stryMutAct_9fa48("67") ? `` : (stryCov_9fa48("67"), `Registry info response: ${JSON.stringify(response)}`));
          return response;
        }
      } catch (error: any) {
        if (stryMutAct_9fa48("68")) {
          {}
        } else {
          stryCov_9fa48("68");
          this.logger.error(stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), 'Error retrieving registry information:'), error);
          return stryMutAct_9fa48("70") ? {} : (stryCov_9fa48("70"), {
            success: stryMutAct_9fa48("71") ? true : (stryCov_9fa48("71"), false),
            error: error.message
          });
        }
      }
    }
  }
}