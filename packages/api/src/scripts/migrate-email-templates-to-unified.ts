import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Migration Script: Unify Email Template System
 *
 * This script:
 * 1. Updates existing request lifecycle templates with unified fields
 * 2. Creates new AUTH and NOTIFICATION templates from hard-coded HTML
 * 3. Creates the 'email-templates' feature flag
 *
 * Safe to run multiple times (uses upsert patterns).
 *
 * Usage: npx ts-node src/scripts/migrate-email-templates-to-unified.ts
 */

// ──────────────────────────────────────────────────────────
// Default template bodies (extracted from email-templates.ts)
// ──────────────────────────────────────────────────────────

const WELCOME_BODY_ES = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Alkitu</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 30px; margin: 0 auto 20px; text-align: center; line-height: 60px;">
                <span style="color: #667eea; font-size: 24px; font-weight: bold;">A</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Bienvenido a Alkitu!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Tu cuenta ha sido creada exitosamente</p>
        </div>
        <div style="padding: 40px 30px;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hola <strong>{{user.name}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Gracias por unirte a Alkitu! Tu cuenta ha sido configurada y ya puedes comenzar a disfrutar de todas nuestras funcionalidades.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{login.url}}" style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
                    Acceder a mi cuenta
                </a>
            </div>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                Te damos la bienvenida!<br>
                <strong>El equipo de Alkitu</strong>
            </p>
        </div>
        <div style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Alkitu Template. Todos los derechos reservados.
            </p>
        </div>
    </div>
</body>
</html>`;

const WELCOME_BODY_EN = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Alkitu</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <div style="background-color: #ffffff; width: 60px; height: 60px; border-radius: 30px; margin: 0 auto 20px; text-align: center; line-height: 60px;">
                <span style="color: #667eea; font-size: 24px; font-weight: bold;">A</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Alkitu!</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">Your account has been created successfully</p>
        </div>
        <div style="padding: 40px 30px;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hello <strong>{{user.name}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for joining Alkitu! Your account is ready and you can start enjoying all our features.
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{login.url}}" style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; font-size: 16px; display: inline-block;">
                    Access my account
                </a>
            </div>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 30px 0 0 0;">
                Welcome aboard!<br>
                <strong>The Alkitu Team</strong>
            </p>
        </div>
        <div style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Alkitu Template. All rights reserved.
            </p>
        </div>
    </div>
</body>
</html>`;

const VERIFICATION_BODY_ES = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificar Email - Alkitu</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #48bb78; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verificar tu Email</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                Hola <strong>{{user.name}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                Por favor, verifica tu direccion de email haciendo clic en el boton de abajo:
            </p>
            <a href="{{verification.url}}" style="background-color: #48bb78; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: 600; display: inline-block;">
                Verificar Email
            </a>
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                Si no puedes hacer clic en el boton, copia este enlace:<br>
                <a href="{{verification.url}}" style="color: #48bb78;">{{verification.url}}</a>
            </p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Alkitu Template
            </p>
        </div>
    </div>
</body>
</html>`;

const VERIFICATION_BODY_EN = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Email - Alkitu</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #48bb78; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Verify your Email</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                Hello <strong>{{user.name}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                Please verify your email address by clicking the button below:
            </p>
            <a href="{{verification.url}}" style="background-color: #48bb78; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: 600; display: inline-block;">
                Verify Email
            </a>
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                If you can't click the button, copy this link:<br>
                <a href="{{verification.url}}" style="color: #48bb78;">{{verification.url}}</a>
            </p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Alkitu Template
            </p>
        </div>
    </div>
</body>
</html>`;

const PASSWORD_RESET_BODY_ES = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contrasena - Alkitu</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #e53e3e; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Restablecer tu Contrasena</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                Hola <strong>{{user.name}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                Hemos recibido una solicitud para restablecer tu contrasena. Haz clic en el boton de abajo para continuar:
            </p>
            <a href="{{reset.url}}" style="background-color: #e53e3e; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: 600; display: inline-block;">
                Restablecer Contrasena
            </a>
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                Si no solicitaste este cambio, ignora este email. Tu contrasena no sera modificada.
            </p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Alkitu Template
            </p>
        </div>
    </div>
</body>
</html>`;

const PASSWORD_RESET_BODY_EN = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Alkitu</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #e53e3e; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Reset your Password</h1>
        </div>
        <div style="padding: 40px 30px; text-align: center;">
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                Hello <strong>{{user.name}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                We received a request to reset your password. Click the button below to continue:
            </p>
            <a href="{{reset.url}}" style="background-color: #e53e3e; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 6px; font-weight: 600; display: inline-block;">
                Reset Password
            </a>
            <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                If you didn't request this change, ignore this email. Your password will not be modified.
            </p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Alkitu Template
            </p>
        </div>
    </div>
</body>
</html>`;

const NOTIFICATION_BODY_ES = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificacion</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Notificacion</h1>
        </div>
        <div style="padding: 40px 30px;">
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
                Hola <strong>{{user.name}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                {{message}}
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{action.url}}" style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; display: inline-block;">
                    {{action.text}}
                </a>
            </div>
            <p style="color: #4a5568; font-size: 16px; margin-top: 30px;">
                Saludos,<br>
                <strong>El equipo de Alkitu</strong>
            </p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Alkitu Template
            </p>
        </div>
    </div>
</body>
</html>`;

const NOTIFICATION_BODY_EN = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f9fc;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Notification</h1>
        </div>
        <div style="padding: 40px 30px;">
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 20px;">
                Hello <strong>{{user.name}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; margin-bottom: 30px;">
                {{message}}
            </p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="{{action.url}}" style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 600; display: inline-block;">
                    {{action.text}}
                </a>
            </div>
            <p style="color: #4a5568; font-size: 16px; margin-top: 30px;">
                Regards,<br>
                <strong>The Alkitu Team</strong>
            </p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center;">
            <p style="color: #718096; font-size: 12px; margin: 0;">
                &copy; ${new Date().getFullYear()} Alkitu Template
            </p>
        </div>
    </div>
</body>
</html>`;

// ──────────────────────────────────────────────────────────
// Request Lifecycle HTML templates (branded, styled)
// ──────────────────────────────────────────────────────────

const YEAR = new Date().getFullYear();

const REQUEST_CREATED_CLIENT_BODY = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud Recibida</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Hemos registrado tu solicitud de {{service.name}} exitosamente.</div>
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #667eea; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); width: 50px; height: 50px; border-radius: 25px; margin: 0 auto 15px; line-height: 50px;">
                <span style="color: #ffffff; font-size: 22px;">&#10003;</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Solicitud Recibida</h1>
            <p style="color: #e2e8f0; margin: 8px 0 0 0; font-size: 14px;">Hemos registrado tu solicitud exitosamente</p>
        </div>
        <div style="padding: 35px 30px;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Estimado/a <strong>{{user.firstname}} {{user.lastname}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Hemos recibido su solicitud de servicio. A continuaci&oacute;n encontrar&aacute; los detalles:
            </p>
            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Detalles del Servicio</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px; width: 140px;">Servicio:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px; font-weight: 600;">{{service.name}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Categor&iacute;a:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{service.category}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Fecha Programada:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{request.executionDateTime}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Estado:</td><td style="padding: 6px 0; font-size: 14px;"><span style="background-color: #ebf4ff; color: #4299e1; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600;">{{request.status}}</span></td></tr>
                </table>
            </div>
            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Ubicaci&oacute;n</h3>
                <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.5;">
                    {{location.street}}<br>
                    {{location.city}}, {{location.state}} {{location.zipCode}}
                </p>
            </div>
            <div style="background-color: #edf2f7; border-radius: 6px; padding: 12px 16px; text-align: center; margin: 0 0 25px 0;">
                <span style="color: #718096; font-size: 12px;">ID de Solicitud:</span>
                <span style="color: #2d3748; font-size: 14px; font-weight: 600; font-family: monospace;">{{request.id}}</span>
            </div>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">Revisaremos su solicitud y asignaremos un t&eacute;cnico en breve.</p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">Saludos cordiales,<br><strong>Equipo Alkitu</strong></p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">&copy; ${YEAR} Alkitu Template. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`;

const REQUEST_ONGOING_CLIENT_BODY = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>T&eacute;cnico Asignado</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Se ha asignado un t&eacute;cnico a tu solicitud de {{service.name}}.</div>
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #4299e1; background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%); padding: 40px 20px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); width: 50px; height: 50px; border-radius: 25px; margin: 0 auto 15px; line-height: 50px;">
                <span style="color: #ffffff; font-size: 22px;">&#128736;</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">T&eacute;cnico Asignado</h1>
            <p style="color: #bee3f8; margin: 8px 0 0 0; font-size: 14px;">Su solicitud est&aacute; en proceso</p>
        </div>
        <div style="padding: 35px 30px;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Estimado/a <strong>{{user.firstname}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                &iexcl;Buenas noticias! Se ha asignado un t&eacute;cnico a su solicitud de servicio.
            </p>
            <div style="background-color: #ebf8ff; background: linear-gradient(135deg, #ebf8ff 0%, #e6fffa 100%); border: 1px solid #bee3f8; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #2b6cb0; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">T&eacute;cnico Asignado</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px; width: 100px;">Nombre:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px; font-weight: 600;">{{employee.firstname}} {{employee.lastname}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Tel&eacute;fono:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{employee.phone}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Email:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{employee.email}}</td></tr>
                </table>
            </div>
            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Detalles</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px; width: 140px;">Servicio:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px; font-weight: 600;">{{service.name}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Fecha Programada:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{request.executionDateTime}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Ubicaci&oacute;n:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{location.street}}, {{location.city}}</td></tr>
                </table>
            </div>
            <div style="background-color: #edf2f7; border-radius: 6px; padding: 12px 16px; text-align: center; margin: 0 0 25px 0;">
                <span style="color: #718096; font-size: 12px;">ID de Solicitud:</span>
                <span style="color: #2d3748; font-size: 14px; font-weight: 600; font-family: monospace;">{{request.id}}</span>
            </div>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">Su t&eacute;cnico se pondr&aacute; en contacto con usted en breve.</p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">Gracias,<br><strong>Equipo Alkitu</strong></p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">&copy; ${YEAR} Alkitu Template. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`;

const REQUEST_ONGOING_EMPLOYEE_BODY = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nueva Asignaci&oacute;n</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Se te ha asignado una nueva solicitud de {{service.name}}.</div>
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #ed8936; background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%); padding: 40px 20px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); width: 50px; height: 50px; border-radius: 25px; margin: 0 auto 15px; line-height: 50px;">
                <span style="color: #ffffff; font-size: 22px;">&#128221;</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Nueva Asignaci&oacute;n</h1>
            <p style="color: #fefcbf; margin: 8px 0 0 0; font-size: 14px;">Se te ha asignado un nuevo servicio</p>
        </div>
        <div style="padding: 35px 30px;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hola <strong>{{employee.firstname}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Se te ha asignado una nueva solicitud de servicio. Revisa los detalles a continuaci&oacute;n:
            </p>
            <div style="background-color: #fffaf0; background: linear-gradient(135deg, #fffaf0 0%, #fefcbf 100%); border: 1px solid #fbd38d; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #c05621; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Datos del Cliente</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px; width: 100px;">Nombre:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px; font-weight: 600;">{{user.firstname}} {{user.lastname}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Tel&eacute;fono:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{user.phone}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Email:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{user.email}}</td></tr>
                </table>
            </div>
            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Detalles del Servicio</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px; width: 140px;">Servicio:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px; font-weight: 600;">{{service.name}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Categor&iacute;a:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{service.category}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Fecha Programada:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{request.executionDateTime}}</td></tr>
                </table>
            </div>
            <div style="background-color: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #2d3748; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Ubicaci&oacute;n</h3>
                <p style="color: #4a5568; margin: 0; font-size: 14px; line-height: 1.5;">
                    {{location.street}}<br>
                    {{location.city}}, {{location.state}} {{location.zipCode}}
                </p>
            </div>
            <div style="background-color: #edf2f7; border-radius: 6px; padding: 12px 16px; text-align: center; margin: 0 0 25px 0;">
                <span style="color: #718096; font-size: 12px;">ID de Solicitud:</span>
                <span style="color: #2d3748; font-size: 14px; font-weight: 600; font-family: monospace;">{{request.id}}</span>
            </div>
            <p style="color: #c05621; font-size: 15px; line-height: 1.6; margin: 0 0 10px 0; font-weight: 600;">Por favor, contacta al cliente para confirmar la cita.</p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">Saludos,<br><strong>Equipo Alkitu</strong></p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">&copy; ${YEAR} Alkitu Template. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`;

const REQUEST_COMPLETED_CLIENT_BODY = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Servicio Completado</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Tu solicitud de {{service.name}} ha sido completada exitosamente.</div>
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #48bb78; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); padding: 40px 20px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); width: 50px; height: 50px; border-radius: 25px; margin: 0 auto 15px; line-height: 50px;">
                <span style="color: #ffffff; font-size: 22px;">&#10004;</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Servicio Completado</h1>
            <p style="color: #c6f6d5; margin: 8px 0 0 0; font-size: 14px;">Su solicitud ha sido finalizada exitosamente</p>
        </div>
        <div style="padding: 35px 30px;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Estimado/a <strong>{{user.firstname}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                &iexcl;Su solicitud de servicio se ha completado exitosamente!
            </p>
            <div style="background-color: #f0fff4; background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%); border: 1px solid #9ae6b4; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <h3 style="color: #276749; margin: 0 0 12px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Resumen</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px; width: 120px;">Servicio:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px; font-weight: 600;">{{service.name}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">Completado:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{request.completedAt}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">T&eacute;cnico:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px;">{{employee.firstname}} {{employee.lastname}}</td></tr>
                </table>
            </div>
            <div style="background-color: #edf2f7; border-radius: 6px; padding: 12px 16px; text-align: center; margin: 0 0 25px 0;">
                <span style="color: #718096; font-size: 12px;">ID de Solicitud:</span>
                <span style="color: #2d3748; font-size: 14px; font-weight: 600; font-family: monospace;">{{request.id}}</span>
            </div>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">Esperamos que est&eacute; satisfecho/a con nuestro servicio. No dude en solicitar otro servicio cuando lo necesite.</p>
            <p style="color: #38a169; font-size: 18px; line-height: 1.6; margin: 20px 0; font-weight: 600; text-align: center;">&iexcl;Gracias por elegir Alkitu!</p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0;">Saludos cordiales,<br><strong>Equipo Alkitu</strong></p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">&copy; ${YEAR} Alkitu Template. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`;

const REQUEST_CANCELLED_CLIENT_BODY = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitud Cancelada</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f6f9fc;">
    <div style="display: none; max-height: 0; overflow: hidden; mso-hide: all;">Tu solicitud de {{service.name}} ha sido cancelada.</div>
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0;">
        <div style="background-color: #e53e3e; background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%); padding: 40px 20px; text-align: center;">
            <div style="background-color: rgba(255,255,255,0.2); width: 50px; height: 50px; border-radius: 25px; margin: 0 auto 15px; line-height: 50px;">
                <span style="color: #ffffff; font-size: 22px;">&#10007;</span>
            </div>
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Solicitud Cancelada</h1>
            <p style="color: #fed7d7; margin: 8px 0 0 0; font-size: 14px;">Su solicitud de servicio ha sido cancelada</p>
        </div>
        <div style="padding: 35px 30px;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Estimado/a <strong>{{user.firstname}}</strong>,
            </p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 25px 0;">
                Le informamos que su solicitud de servicio ha sido cancelada.
            </p>
            <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 20px; margin: 0 0 20px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px; width: 120px;">Servicio:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px; font-weight: 600;">{{service.name}}</td></tr>
                    <tr><td style="color: #718096; padding: 6px 0; font-size: 14px;">ID Solicitud:</td><td style="color: #2d3748; padding: 6px 0; font-size: 14px; font-family: monospace;">{{request.id}}</td></tr>
                </table>
            </div>
            <div style="background-color: #fffaf0; border: 1px solid #fbd38d; border-radius: 8px; padding: 16px; margin: 0 0 25px 0;">
                <p style="color: #c05621; font-size: 14px; margin: 0; line-height: 1.5;">
                    Si no solicit&oacute; esta cancelaci&oacute;n o tiene alguna pregunta, por favor cont&aacute;ctenos de inmediato.
                </p>
            </div>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 0 0 10px 0;">Puede enviar una nueva solicitud en cualquier momento.</p>
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin: 20px 0 0 0;">Saludos cordiales,<br><strong>Equipo Alkitu</strong></p>
        </div>
        <div style="background-color: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="color: #a0aec0; margin: 0; font-size: 12px;">&copy; ${YEAR} Alkitu Template. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`;

const REQUEST_TEMPLATE_BODIES: Record<string, string> = {
  request_created_client: REQUEST_CREATED_CLIENT_BODY,
  request_ongoing_client: REQUEST_ONGOING_CLIENT_BODY,
  request_ongoing_employee: REQUEST_ONGOING_EMPLOYEE_BODY,
  request_completed_client: REQUEST_COMPLETED_CLIENT_BODY,
  request_cancelled_client: REQUEST_CANCELLED_CLIENT_BODY,
};

// ──────────────────────────────────────────────────────────
// Migration Logic
// ──────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Starting Unified Email Template Migration...\n');

  try {
    // ────────────────────────────────────────
    // STEP 1: Update existing request lifecycle templates
    // ────────────────────────────────────────
    console.log('📧 STEP 1: Updating existing request lifecycle templates...');

    const existingTemplates = await prisma.emailTemplate.findMany();
    console.log(`   Found ${existingTemplates.length} existing templates`);

    const requestTemplateUpdates: Array<{
      name: string;
      slug: string;
      description: string;
      variables: string[];
    }> = [
      {
        name: 'request_created_client',
        slug: 'request-created-client',
        description: 'Email sent to client when a new request is created',
        variables: [
          '{{user.firstname}}', '{{user.lastname}}', '{{service.name}}',
          '{{service.category}}', '{{request.executionDateTime}}',
          '{{location.street}}', '{{location.city}}', '{{location.state}}',
          '{{location.zipCode}}', '{{request.id}}', '{{request.status}}',
        ],
      },
      {
        name: 'request_ongoing_client',
        slug: 'request-ongoing-client',
        description: 'Email sent to client when a technician is assigned',
        variables: [
          '{{user.firstname}}', '{{employee.firstname}}', '{{employee.lastname}}',
          '{{employee.phone}}', '{{employee.email}}', '{{service.name}}',
          '{{request.executionDateTime}}', '{{location.street}}',
          '{{location.city}}', '{{request.id}}',
        ],
      },
      {
        name: 'request_ongoing_employee',
        slug: 'request-ongoing-employee',
        description: 'Email sent to assigned employee for a new assignment',
        variables: [
          '{{employee.firstname}}', '{{user.firstname}}', '{{user.lastname}}',
          '{{user.phone}}', '{{user.email}}', '{{service.name}}',
          '{{service.category}}', '{{request.executionDateTime}}',
          '{{location.street}}', '{{location.city}}', '{{location.state}}',
          '{{location.zipCode}}', '{{request.id}}',
        ],
      },
      {
        name: 'request_completed_client',
        slug: 'request-completed-client',
        description: 'Email sent to client when a request is completed',
        variables: [
          '{{user.firstname}}', '{{service.name}}', '{{request.completedAt}}',
          '{{employee.firstname}}', '{{employee.lastname}}', '{{request.id}}',
        ],
      },
      {
        name: 'request_cancelled_client',
        slug: 'request-cancelled-client',
        description: 'Email sent to client when a request is cancelled',
        variables: [
          '{{user.firstname}}', '{{service.name}}', '{{request.id}}',
        ],
      },
    ];

    for (const update of requestTemplateUpdates) {
      const existing = existingTemplates.find((t) => t.name === update.name);
      const htmlBody = REQUEST_TEMPLATE_BODIES[update.name];
      if (existing) {
        await prisma.emailTemplate.update({
          where: { id: existing.id },
          data: {
            category: 'REQUEST',
            slug: update.slug,
            description: update.description,
            variables: update.variables,
            isDefault: true,
            body: htmlBody || existing.body,
            defaultBody: htmlBody || existing.body,
            defaultSubject: existing.subject,
            defaultLocale: 'es',
            localizations: [],
          },
        });
        console.log(`   ✅ Updated: ${update.name} (with HTML body)`);
      } else {
        console.log(`   ⚠️  Template "${update.name}" not found in DB, skipping`);
      }
    }

    // ────────────────────────────────────────
    // STEP 2: Create new AUTH templates
    // ────────────────────────────────────────
    console.log('\n📧 STEP 2: Creating AUTH email templates...');

    // Welcome
    await prisma.emailTemplate.upsert({
      where: { name: 'welcome' },
      update: {
        category: 'AUTH',
        slug: 'welcome',
        description: 'Welcome email sent to new users after registration',
        variables: ['{{user.name}}', '{{login.url}}'],
        isDefault: true,
        defaultBody: WELCOME_BODY_ES,
        defaultSubject: 'Bienvenido a Alkitu, {{user.name}}!',
        defaultLocale: 'es',
        localizations: [
          {
            locale: 'en',
            subject: 'Welcome to Alkitu, {{user.name}}!',
            body: WELCOME_BODY_EN,
          },
        ],
      },
      create: {
        name: 'welcome',
        slug: 'welcome',
        subject: 'Bienvenido a Alkitu, {{user.name}}!',
        body: WELCOME_BODY_ES,
        trigger: 'ON_AUTH_EVENT',
        category: 'AUTH',
        description: 'Welcome email sent to new users after registration',
        variables: ['{{user.name}}', '{{login.url}}'],
        isDefault: true,
        defaultBody: WELCOME_BODY_ES,
        defaultSubject: 'Bienvenido a Alkitu, {{user.name}}!',
        defaultLocale: 'es',
        active: true,
        localizations: [
          {
            locale: 'en',
            subject: 'Welcome to Alkitu, {{user.name}}!',
            body: WELCOME_BODY_EN,
          },
        ],
      },
    });
    console.log('   ✅ Created/updated: welcome');

    // Email Verification
    await prisma.emailTemplate.upsert({
      where: { name: 'email_verification' },
      update: {
        category: 'AUTH',
        slug: 'email-verification',
        description: 'Email verification template sent to confirm user email address',
        variables: ['{{user.name}}', '{{verification.url}}'],
        isDefault: true,
        defaultBody: VERIFICATION_BODY_ES,
        defaultSubject: 'Verifica tu email en Alkitu',
        defaultLocale: 'es',
        localizations: [
          {
            locale: 'en',
            subject: 'Verify your email on Alkitu',
            body: VERIFICATION_BODY_EN,
          },
        ],
      },
      create: {
        name: 'email_verification',
        slug: 'email-verification',
        subject: 'Verifica tu email en Alkitu',
        body: VERIFICATION_BODY_ES,
        trigger: 'ON_AUTH_EVENT',
        category: 'AUTH',
        description: 'Email verification template sent to confirm user email address',
        variables: ['{{user.name}}', '{{verification.url}}'],
        isDefault: true,
        defaultBody: VERIFICATION_BODY_ES,
        defaultSubject: 'Verifica tu email en Alkitu',
        defaultLocale: 'es',
        active: true,
        localizations: [
          {
            locale: 'en',
            subject: 'Verify your email on Alkitu',
            body: VERIFICATION_BODY_EN,
          },
        ],
      },
    });
    console.log('   ✅ Created/updated: email_verification');

    // Password Reset
    await prisma.emailTemplate.upsert({
      where: { name: 'password_reset' },
      update: {
        category: 'AUTH',
        slug: 'password-reset',
        description: 'Password reset email with secure reset link',
        variables: ['{{user.name}}', '{{reset.url}}'],
        isDefault: true,
        defaultBody: PASSWORD_RESET_BODY_ES,
        defaultSubject: 'Restablecer tu contrasena de Alkitu',
        defaultLocale: 'es',
        localizations: [
          {
            locale: 'en',
            subject: 'Reset your Alkitu password',
            body: PASSWORD_RESET_BODY_EN,
          },
        ],
      },
      create: {
        name: 'password_reset',
        slug: 'password-reset',
        subject: 'Restablecer tu contrasena de Alkitu',
        body: PASSWORD_RESET_BODY_ES,
        trigger: 'ON_AUTH_EVENT',
        category: 'AUTH',
        description: 'Password reset email with secure reset link',
        variables: ['{{user.name}}', '{{reset.url}}'],
        isDefault: true,
        defaultBody: PASSWORD_RESET_BODY_ES,
        defaultSubject: 'Restablecer tu contrasena de Alkitu',
        defaultLocale: 'es',
        active: true,
        localizations: [
          {
            locale: 'en',
            subject: 'Reset your Alkitu password',
            body: PASSWORD_RESET_BODY_EN,
          },
        ],
      },
    });
    console.log('   ✅ Created/updated: password_reset');

    // ────────────────────────────────────────
    // STEP 3: Create NOTIFICATION template
    // ────────────────────────────────────────
    console.log('\n📧 STEP 3: Creating NOTIFICATION email template...');

    await prisma.emailTemplate.upsert({
      where: { name: 'notification_general' },
      update: {
        category: 'NOTIFICATION',
        slug: 'notification-general',
        description: 'General notification email with optional action button',
        variables: ['{{user.name}}', '{{message}}', '{{action.url}}', '{{action.text}}'],
        isDefault: true,
        defaultBody: NOTIFICATION_BODY_ES,
        defaultSubject: 'Notificacion - Alkitu',
        defaultLocale: 'es',
        localizations: [
          {
            locale: 'en',
            subject: 'Notification - Alkitu',
            body: NOTIFICATION_BODY_EN,
          },
        ],
      },
      create: {
        name: 'notification_general',
        slug: 'notification-general',
        subject: 'Notificacion - Alkitu',
        body: NOTIFICATION_BODY_ES,
        trigger: 'ON_NOTIFICATION',
        category: 'NOTIFICATION',
        description: 'General notification email with optional action button',
        variables: ['{{user.name}}', '{{message}}', '{{action.url}}', '{{action.text}}'],
        isDefault: true,
        defaultBody: NOTIFICATION_BODY_ES,
        defaultSubject: 'Notificacion - Alkitu',
        defaultLocale: 'es',
        active: true,
        localizations: [
          {
            locale: 'en',
            subject: 'Notification - Alkitu',
            body: NOTIFICATION_BODY_EN,
          },
        ],
      },
    });
    console.log('   ✅ Created/updated: notification_general');

    // ────────────────────────────────────────
    // STEP 4: Create feature flag
    // ────────────────────────────────────────
    console.log('\n🏴 STEP 4: Creating email-templates feature flag...');

    await prisma.featureFlag.upsert({
      where: { key: 'email-templates' },
      update: {},
      create: {
        key: 'email-templates',
        name: 'Editor de Email Templates',
        description:
          'UI para personalizar los templates de email. Los emails siempre se envian desde DB independiente de este flag.',
        category: 'addon',
        status: 'DISABLED',
        icon: 'Mail',
        badge: 'New',
        sortOrder: 10,
      },
    });
    console.log('   ✅ Created/updated: email-templates feature flag');

    // ────────────────────────────────────────
    // SUMMARY
    // ────────────────────────────────────────
    const finalCount = await prisma.emailTemplate.count();
    console.log(`\n✅ Migration complete! Total templates in DB: ${finalCount}`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
