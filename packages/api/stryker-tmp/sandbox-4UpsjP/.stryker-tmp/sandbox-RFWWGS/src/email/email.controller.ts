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
    if (stryMutAct_9fa48("147")) {
      {}
    } else {
      stryCov_9fa48("147");
      const {
        to,
        type,
        userName = stryMutAct_9fa48("148") ? "" : (stryCov_9fa48("148"), 'Usuario de Prueba')
      } = testEmailDto;
      try {
        if (stryMutAct_9fa48("149")) {
          {}
        } else {
          stryCov_9fa48("149");
          this.logger.log(stryMutAct_9fa48("150") ? `` : (stryCov_9fa48("150"), `Processing test email request: type=${type}, to=${to}`));

          // ✅ OCP COMPLIANT: No switch statement needed!
          // The registry dynamically finds the appropriate channel
          const emailData = this.buildEmailData(type, to, userName);
          const result = await this.emailChannelRegistry.sendEmail(type, emailData);
          const response = stryMutAct_9fa48("151") ? {} : (stryCov_9fa48("151"), {
            success: result.success,
            message: result.success ? stryMutAct_9fa48("152") ? `` : (stryCov_9fa48("152"), `Email de ${type} enviado exitosamente`) : stryMutAct_9fa48("153") ? `` : (stryCov_9fa48("153"), `Error enviando email: ${result.error}`),
            messageId: result.messageId
          });
          this.logger.log(stryMutAct_9fa48("154") ? `` : (stryCov_9fa48("154"), `Test email response: ${JSON.stringify(response)}`));
          return response;
        }
      } catch (error: any) {
        if (stryMutAct_9fa48("155")) {
          {}
        } else {
          stryCov_9fa48("155");
          this.logger.error(stryMutAct_9fa48("156") ? `` : (stryCov_9fa48("156"), `Error processing test email request:`), error);
          return stryMutAct_9fa48("157") ? {} : (stryCov_9fa48("157"), {
            success: stryMutAct_9fa48("158") ? true : (stryCov_9fa48("158"), false),
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
    if (stryMutAct_9fa48("159")) {
      {}
    } else {
      stryCov_9fa48("159");
      const baseUrls = stryMutAct_9fa48("160") ? {} : (stryCov_9fa48("160"), {
        login: stryMutAct_9fa48("161") ? "" : (stryCov_9fa48("161"), 'http://localhost:3000/login'),
        support: stryMutAct_9fa48("162") ? "" : (stryCov_9fa48("162"), 'http://localhost:3000/support'),
        dashboard: stryMutAct_9fa48("163") ? "" : (stryCov_9fa48("163"), 'http://localhost:3000/dashboard'),
        security: stryMutAct_9fa48("164") ? "" : (stryCov_9fa48("164"), 'http://localhost:3000/security'),
        unsubscribe: stryMutAct_9fa48("165") ? "" : (stryCov_9fa48("165"), 'http://localhost:3000/unsubscribe')
      });
      switch (type) {
        case stryMutAct_9fa48("167") ? "" : (stryCov_9fa48("167"), 'welcome'):
          if (stryMutAct_9fa48("166")) {} else {
            stryCov_9fa48("166");
            return stryMutAct_9fa48("168") ? {} : (stryCov_9fa48("168"), {
              userName,
              userEmail: to,
              registrationDate: new Date().toLocaleDateString(stryMutAct_9fa48("169") ? "" : (stryCov_9fa48("169"), 'es-ES')),
              loginUrl: baseUrls.login,
              unsubscribeUrl: baseUrls.unsubscribe,
              supportUrl: baseUrls.support
            });
          }
        case stryMutAct_9fa48("171") ? "" : (stryCov_9fa48("171"), 'reset'):
          if (stryMutAct_9fa48("170")) {} else {
            stryCov_9fa48("170");
            return stryMutAct_9fa48("172") ? {} : (stryCov_9fa48("172"), {
              userName,
              userEmail: to,
              resetUrl: stryMutAct_9fa48("173") ? "" : (stryCov_9fa48("173"), 'http://localhost:3000/reset-password?token=test-token-123'),
              supportUrl: baseUrls.support,
              securityUrl: baseUrls.security
            });
          }
        case stryMutAct_9fa48("175") ? "" : (stryCov_9fa48("175"), 'verification'):
          if (stryMutAct_9fa48("174")) {} else {
            stryCov_9fa48("174");
            return stryMutAct_9fa48("176") ? {} : (stryCov_9fa48("176"), {
              userName,
              userEmail: to,
              verificationUrl: stryMutAct_9fa48("177") ? "" : (stryCov_9fa48("177"), 'http://localhost:3000/verify-email?token=test-token-123'),
              supportUrl: baseUrls.support
            });
          }
        case stryMutAct_9fa48("179") ? "" : (stryCov_9fa48("179"), 'notification'):
          if (stryMutAct_9fa48("178")) {} else {
            stryCov_9fa48("178");
            return stryMutAct_9fa48("180") ? {} : (stryCov_9fa48("180"), {
              userName,
              userEmail: to,
              subject: stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), 'Notificación de Prueba'),
              message: stryMutAct_9fa48("182") ? "" : (stryCov_9fa48("182"), 'Esta es una notificación de prueba del sistema de emails de Alkitu. Todo está funcionando correctamente.'),
              actionText: stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), 'Ir al Dashboard'),
              actionUrl: baseUrls.dashboard,
              supportUrl: baseUrls.support
            });
          }
        case stryMutAct_9fa48("185") ? "" : (stryCov_9fa48("185"), 'marketing'):
          if (stryMutAct_9fa48("184")) {} else {
            stryCov_9fa48("184");
            return stryMutAct_9fa48("186") ? {} : (stryCov_9fa48("186"), {
              userName,
              userEmail: to,
              campaignName: stryMutAct_9fa48("187") ? "" : (stryCov_9fa48("187"), 'Test Marketing Campaign'),
              contentHtml: stryMutAct_9fa48("188") ? "" : (stryCov_9fa48("188"), '<h1>Welcome to our newsletter!</h1><p>This is a test marketing email.</p>'),
              unsubscribeUrl: baseUrls.unsubscribe,
              supportUrl: baseUrls.support,
              trackingPixelUrl: stryMutAct_9fa48("189") ? "" : (stryCov_9fa48("189"), 'http://localhost:3000/track')
            });
          }
        default:
          if (stryMutAct_9fa48("190")) {} else {
            stryCov_9fa48("190");
            throw new Error(stryMutAct_9fa48("191") ? `` : (stryCov_9fa48("191"), `Email type '${type}' is not supported`));
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
    if (stryMutAct_9fa48("192")) {
      {}
    } else {
      stryCov_9fa48("192");
      try {
        if (stryMutAct_9fa48("193")) {
          {}
        } else {
          stryCov_9fa48("193");
          const result = await this.emailService.testConfiguration();
          return stryMutAct_9fa48("194") ? {} : (stryCov_9fa48("194"), {
            success: result.success,
            message: result.success ? stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), 'Configuración de Resend funcionando correctamente') : stryMutAct_9fa48("196") ? `` : (stryCov_9fa48("196"), `Error en configuración: ${result.error}`)
          });
        }
      } catch (error: any) {
        if (stryMutAct_9fa48("197")) {
          {}
        } else {
          stryCov_9fa48("197");
          return stryMutAct_9fa48("198") ? {} : (stryCov_9fa48("198"), {
            success: stryMutAct_9fa48("199") ? true : (stryCov_9fa48("199"), false),
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
    if (stryMutAct_9fa48("200")) {
      {}
    } else {
      stryCov_9fa48("200");
      try {
        if (stryMutAct_9fa48("201")) {
          {}
        } else {
          stryCov_9fa48("201");
          this.logger.log(stryMutAct_9fa48("202") ? "" : (stryCov_9fa48("202"), 'Retrieving email registry information'));
          const stats = this.emailChannelRegistry.getRegistryStats();
          const response = stryMutAct_9fa48("203") ? {} : (stryCov_9fa48("203"), {
            success: stryMutAct_9fa48("204") ? false : (stryCov_9fa48("204"), true),
            data: stats,
            message: stryMutAct_9fa48("205") ? "" : (stryCov_9fa48("205"), 'Email registry information retrieved successfully'),
            ocpCompliance: stryMutAct_9fa48("206") ? {} : (stryCov_9fa48("206"), {
              description: stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), 'This system follows the Open/Closed Principle'),
              benefits: stryMutAct_9fa48("208") ? [] : (stryCov_9fa48("208"), [stryMutAct_9fa48("209") ? "" : (stryCov_9fa48("209"), 'New email types can be added without modifying existing code'), stryMutAct_9fa48("210") ? "" : (stryCov_9fa48("210"), 'Email channels are registered dynamically'), stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), 'System is extensible without breaking existing functionality'), stryMutAct_9fa48("212") ? "" : (stryCov_9fa48("212"), 'Each email type has its own validation and processing logic')]),
              extensionExample: stryMutAct_9fa48("213") ? "" : (stryCov_9fa48("213"), 'To add a new email type, create a class implementing IEmailChannel and register it in the module')
            })
          });
          this.logger.log(stryMutAct_9fa48("214") ? `` : (stryCov_9fa48("214"), `Registry info response: ${JSON.stringify(response)}`));
          return response;
        }
      } catch (error: any) {
        if (stryMutAct_9fa48("215")) {
          {}
        } else {
          stryCov_9fa48("215");
          this.logger.error(stryMutAct_9fa48("216") ? "" : (stryCov_9fa48("216"), 'Error retrieving registry information:'), error);
          return stryMutAct_9fa48("217") ? {} : (stryCov_9fa48("217"), {
            success: stryMutAct_9fa48("218") ? true : (stryCov_9fa48("218"), false),
            error: error.message
          });
        }
      }
    }
  }
}