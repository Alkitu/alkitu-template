import { escapeHtml } from './email.service';

/**
 * Tipos para los datos de los templates de email
 */
export interface WelcomeEmailData {
  userName: string;
  userEmail: string;
  registrationDate: string;
  loginUrl: string;
  unsubscribeUrl: string;
  supportUrl: string;
}

export interface PasswordResetEmailData {
  userName: string;
  resetUrl: string;
  supportUrl: string;
  securityUrl: string;
}

export interface EmailVerificationData {
  userName: string;
  verificationUrl: string;
  supportUrl: string;
}

/**
 * Servicio para gestionar templates de email
 *
 * @deprecated Use DB-based templates via EmailTemplateService.renderBySlug() instead.
 * This class is kept as a fallback while the unified template system is confirmed stable.
 * Will be removed once all templates are verified in the database.
 */
export class EmailTemplates {
  /**
   * Reemplaza las variables en el template con los datos proporcionados.
   * Escapes regex special chars in keys and HTML-escapes values to prevent XSS.
   */
  private static replaceVariables(
    template: string,
    data: Record<string, string>,
  ): string {
    let result = template;

    Object.entries(data).forEach(([key, value]) => {
      const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`\\{\\{${escapedKey}\\}\\}`, 'g');
      result = result.replace(regex, escapeHtml(value));
    });

    return result;
  }

  /**
   * Genera el email de bienvenida
   */
  static getWelcomeEmail(
    data: WelcomeEmailData,
    companyName: string = process.env.APP_NAME || 'Alkitu',
  ): {
    html: string;
    subject: string;
  } {
    const safeUserName = escapeHtml(data.userName);
    const safeUserEmail = escapeHtml(data.userEmail);
    const safeRegistrationDate = escapeHtml(data.registrationDate);
    const safeLoginUrl = escapeHtml(data.loginUrl);
    const safeUnsubscribeUrl = escapeHtml(data.unsubscribeUrl);
    const safeSupportUrl = escapeHtml(data.supportUrl);

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a ${companyName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
          <!-- Preheader text (shown in inbox preview) -->
          <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Tu cuenta ha sido creada exitosamente. Accede a tu cuenta para comenzar.</div>
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
              <!-- Header -->
              <div style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 30px; margin: 0 auto 20px; text-align: center; line-height: 60px;">
                      <span style="color: #667eea; font-size: 24px; font-weight: bold; vertical-align: middle;">A</span>
                  </div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">¡Bienvenido a ${companyName}!</h1>
                  <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Tu cuenta ha sido creada exitosamente</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hola <strong>${safeUserName}</strong>,
                  </p>

                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      ¡Gracias por unirte a ${companyName}! Tu cuenta ha sido configurada y ya puedes comenzar a disfrutar de todas nuestras funcionalidades.
                  </p>

                  <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Detalles de tu cuenta:</h3>
                      <p style="color: #4a5568; margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${safeUserEmail}</p>
                      <p style="color: #4a5568; margin: 5px 0; font-size: 14px;"><strong>Fecha de registro:</strong> ${safeRegistrationDate}</p>
                      <p style="color: #4a5568; margin: 5px 0; font-size: 14px;"><strong>Plan:</strong> Plan Básico</p>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${safeLoginUrl}"
                         style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                color: #ffffff;
                                text-decoration: none;
                                padding: 12px 30px;
                                border-radius: 6px;
                                font-weight: 600;
                                font-size: 16px;
                                display: inline-block;">
                          Acceder a mi cuenta
                      </a>
                  </div>

                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 30px 0 20px 0;">
                      Si tienes alguna pregunta, no dudes en contactarnos. Estamos aquí para ayudarte.
                  </p>

                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">
                      ¡Te damos la bienvenida al futuro!<br>
                      <strong>El equipo de ${companyName}</strong>
                  </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #718096; margin: 0 0 10px 0; font-size: 14px;">
                      <a href="${safeUnsubscribeUrl}" style="color: #667eea; text-decoration: none;">Darse de baja</a> |
                      <a href="${safeSupportUrl}" style="color: #667eea; text-decoration: none;">Soporte</a>
                  </p>
                  <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                      © ${new Date().getFullYear()} ${companyName}. Todos los derechos reservados.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    return {
      html,
      subject: `¡Bienvenido a ${companyName}, ${safeUserName}!`,
    };
  }

  /**
   * Genera el email de restablecimiento de contraseña (inline template)
   */
  static getPasswordResetEmail(
    data: PasswordResetEmailData,
    companyName: string = process.env.APP_NAME || 'Alkitu',
  ): {
    html: string;
    subject: string;
  } {
    const safeUserName = escapeHtml(data.userName);
    const safeResetUrl = escapeHtml(data.resetUrl);
    const safeSupportUrl = escapeHtml(data.supportUrl);
    const safeSecurityUrl = escapeHtml(data.securityUrl);

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Restablecer Contraseña - ${companyName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
          <!-- Preheader text (shown in inbox preview) -->
          <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Hemos recibido una solicitud para restablecer tu contrase&ntilde;a. Este enlace expira en 1 hora.</div>
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
              <!-- Header -->
              <div style="background-color: #e53e3e; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Restablecer Contraseña</h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hola <strong>${safeUserName}</strong>,
                  </p>

                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el botón de abajo para crear una nueva contraseña:
                  </p>

                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${safeResetUrl}"
                         style="background-color: #e53e3e; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
                                color: #ffffff;
                                text-decoration: none;
                                padding: 15px 30px;
                                border-radius: 6px;
                                font-weight: 600;
                                font-size: 16px;
                                display: inline-block;">
                          Restablecer Contraseña
                      </a>
                  </div>

                  <p style="color: #718096; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                      Si no puedes hacer clic en el botón, copia este enlace:<br>
                      <a href="${safeResetUrl}" style="color: #e53e3e;">${safeResetUrl}</a>
                  </p>

                  <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                      <p style="color: #c53030; font-size: 14px; margin: 0;">
                          <strong>Importante:</strong> Este enlace expira en 1 hora. Si no solicitaste este cambio, puedes ignorar este email o
                          <a href="${safeSecurityUrl}" style="color: #e53e3e;">reportarlo aquí</a>.
                      </p>
                  </div>
              </div>

              <!-- Footer -->
              <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #718096; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} ${companyName} | <a href="${safeSupportUrl}" style="color: #e53e3e;">Soporte</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    return {
      html,
      subject: `Restablecer tu contraseña - ${companyName}`,
    };
  }

  /**
   * Template simple en línea para verificación de email
   */
  static getEmailVerificationTemplate(
    data: EmailVerificationData,
    companyName: string = process.env.APP_NAME || 'Alkitu',
  ): {
    html: string;
    subject: string;
  } {
    const safeUserName = escapeHtml(data.userName);
    const safeVerificationUrl = escapeHtml(data.verificationUrl);
    const safeSupportUrl = escapeHtml(data.supportUrl);

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificar Email - ${companyName}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
          <!-- Preheader text (shown in inbox preview) -->
          <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Verifica tu direcci&oacute;n de email para completar tu registro en ${companyName}.</div>
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
              <!-- Header -->
              <div style="background-color: #48bb78; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verificar tu Email</h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px; text-align: center;">
                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                      Hola <strong>${safeUserName}</strong>,
                  </p>

                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                      Por favor, verifica tu dirección de email haciendo clic en el botón de abajo:
                  </p>

                  <a href="${safeVerificationUrl}"
                     style="background-color: #48bb78; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
                            color: #ffffff;
                            text-decoration: none;
                            padding: 15px 30px;
                            border-radius: 6px;
                            font-weight: 600;
                            display: inline-block;">
                      Verificar Email
                  </a>

                  <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                      Si no puedes hacer clic en el botón, copia este enlace:<br>
                      <a href="${safeVerificationUrl}" style="color: #48bb78;">${safeVerificationUrl}</a>
                  </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
                  <p style="color: #718096; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} ${companyName} | <a href="${safeSupportUrl}" style="color: #48bb78;">Soporte</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    return {
      html,
      subject: `Verifica tu email - ${companyName}`,
    };
  }

  /**
   * Template de notificación general
   */
  static getNotificationEmail(
    title: string,
    message: string,
    userName: string,
    buttonText?: string,
    buttonUrl?: string,
    companyName: string = process.env.APP_NAME || 'Alkitu',
  ): { html: string; subject: string } {
    const safeTitle = escapeHtml(title);
    const safeMessage = escapeHtml(message);
    const safeUserName = escapeHtml(userName);

    const buttonHtml =
      buttonText && buttonUrl
        ? `
      <div style="text-align: center; margin: 30px 0;">
          <a href="${escapeHtml(buttonUrl)}"
             style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff;
                    text-decoration: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    font-weight: 600;
                    display: inline-block;">
              ${escapeHtml(buttonText)}
          </a>
      </div>
    `
        : '';

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${safeTitle}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
          <!-- Preheader text (shown in inbox preview) -->
          <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">${safeTitle} - ${safeMessage.substring(0, 80)}</div>
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
              <div style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${safeTitle}</h1>
              </div>

              <div style="padding: 40px 30px;">
                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
                      Hola <strong>${safeUserName}</strong>,
                  </p>

                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                      ${safeMessage}
                  </p>

                  ${buttonHtml}

                  <p style="color: #4a5568; font-size: 16px; margin-top: 30px;">
                      Saludos,<br>
                      <strong>El equipo de ${companyName}</strong>
                  </p>
              </div>

              <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
                  <p style="color: #718096; font-size: 12px; margin: 0;">
                      © ${new Date().getFullYear()} ${companyName}
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    return {
      html,
      subject: title,
    };
  }
}
