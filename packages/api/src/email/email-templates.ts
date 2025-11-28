import * as fs from 'fs';
import * as path from 'path';

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
 */
export class EmailTemplates {
  private static templatesPath = path.join(process.cwd(), 'src/templates');

  /**
   * Lee un template HTML desde el archivo
   */
  private static readTemplate(templateName: string): string {
    const templatePath = path.join(this.templatesPath, `${templateName}.html`);

    console.log(`🔍 Buscando template: ${templateName}`);
    console.log(`📁 Path completo: ${templatePath}`);
    console.log(`📂 Templates path: ${this.templatesPath}`);
    console.log(
      `📋 Archivos en directorio:`,
      fs.existsSync(this.templatesPath)
        ? fs.readdirSync(this.templatesPath)
        : 'Directorio no existe',
    );

    if (!fs.existsSync(templatePath)) {
      throw new Error(
        `Template no encontrado: ${templateName} en ${templatePath}`,
      );
    }

    return fs.readFileSync(templatePath, 'utf-8');
  }

  /**
   * Reemplaza las variables en el template con los datos proporcionados
   */
  private static replaceVariables(
    template: string,
    data: Record<string, string>,
  ): string {
    let result = template;

    Object.entries(data).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });

    return result;
  }

  /**
   * Genera el email de bienvenida
   */
  static getWelcomeEmail(data: WelcomeEmailData): {
    html: string;
    subject: string;
  } {
    // Template inline por ahora para evitar problemas de path
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a Alkitu</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 30px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: #667eea; font-size: 24px; font-weight: bold;">A</span>
                  </div>
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">¡Bienvenido a Alkitu!</h1>
                  <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Tu cuenta ha sido creada exitosamente</p>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px;">
                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      Hola <strong>${data.userName}</strong>,
                  </p>
                  
                  <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                      ¡Gracias por unirte a Alkitu! Tu cuenta ha sido configurada y ya puedes comenzar a disfrutar de todas nuestras funcionalidades.
                  </p>

                  <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 30px 0;">
                      <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px;">Detalles de tu cuenta:</h3>
                      <p style="color: #4a5568; margin: 5px 0; font-size: 14px;"><strong>Email:</strong> ${data.userEmail}</p>
                      <p style="color: #4a5568; margin: 5px 0; font-size: 14px;"><strong>Fecha de registro:</strong> ${data.registrationDate}</p>
                      <p style="color: #4a5568; margin: 5px 0; font-size: 14px;"><strong>Plan:</strong> Plan Básico</p>
                  </div>

                  <div style="text-align: center; margin: 30px 0;">
                      <a href="${data.loginUrl}" 
                         style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
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
                      <strong>El equipo de Alkitu</strong>
                  </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #718096; margin: 0 0 10px 0; font-size: 14px;">
                      <a href="${data.unsubscribeUrl}" style="color: #667eea; text-decoration: none;">Darse de baja</a> | 
                      <a href="${data.supportUrl}" style="color: #667eea; text-decoration: none;">Soporte</a>
                  </p>
                  <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                      © ${new Date().getFullYear()} Alkitu Template. Todos los derechos reservados.
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    return {
      html,
      subject: `¡Bienvenido a Alkitu, ${data.userName}!`,
    };
  }

  /**
   * Genera el email de restablecimiento de contraseña
   */
  static getPasswordResetEmail(data: PasswordResetEmailData): {
    html: string;
    subject: string;
  } {
    const template = this.readTemplate('password-reset-email');
    const html = this.replaceVariables(template, {
      userName: data.userName,
      resetUrl: data.resetUrl,
      supportUrl: data.supportUrl,
      securityUrl: data.securityUrl,
    });

    return {
      html,
      subject: 'Restablecer tu contraseña de Alkitu',
    };
  }

  /**
   * Template simple en línea para verificación de email
   */
  static getEmailVerificationTemplate(data: EmailVerificationData): {
    html: string;
    subject: string;
  } {
    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificar Email - Alkitu</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verificar tu Email</h1>
              </div>

              <!-- Content -->
              <div style="padding: 40px 30px; text-align: center;">
                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                      Hola <strong>${data.userName}</strong>,
                  </p>
                  
                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                      Por favor, verifica tu dirección de email haciendo clic en el botón de abajo:
                  </p>

                  <a href="${data.verificationUrl}" 
                     style="background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); 
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
                      <a href="${data.verificationUrl}" style="color: #48bb78;">${data.verificationUrl}</a>
                  </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
                  <p style="color: #718096; font-size: 12px; margin: 0;">
                      © 2024 Alkitu Template | <a href="${data.supportUrl}" style="color: #48bb78;">Soporte</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

    return {
      html,
      subject: 'Verifica tu email en Alkitu',
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
  ): { html: string; subject: string } {
    const buttonHtml =
      buttonText && buttonUrl
        ? `
      <div style="text-align: center; margin: 30px 0;">
          <a href="${buttonUrl}" 
             style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: #ffffff; 
                    text-decoration: none; 
                    padding: 12px 30px; 
                    border-radius: 6px; 
                    font-weight: 600; 
                    display: inline-block;">
              ${buttonText}
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
          <title>${title}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${title}</h1>
              </div>

              <div style="padding: 40px 30px;">
                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
                      Hola <strong>${userName}</strong>,
                  </p>
                  
                  <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                      ${message}
                  </p>

                  ${buttonHtml}

                  <p style="color: #4a5568; font-size: 16px; margin-top: 30px;">
                      Saludos,<br>
                      <strong>El equipo de Alkitu</strong>
                  </p>
              </div>

              <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
                  <p style="color: #718096; font-size: 12px; margin: 0;">
                      © 2024 Alkitu Template
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
