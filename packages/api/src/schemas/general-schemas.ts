import * as z from 'zod';

export const EmailSchema = z.object({
  email: z.string().email({
    message: 'El correo electrónico es requerido',
  }),
});

export const CredentialSigninSchema = z.object({
  email: z.string().email({
    message: 'El correo electrónico es requerido',
  }),
  password: z.string().min(1, {
    message: 'La contraseña es requerida',
  }),
  code: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: 'El correo electrónico es requerido',
  }),
  password: z.string().min(1, {
    message: 'La contraseña es requerida',
  }),
});

export const RegisterSchema = z
  .object({
    email: z.string().email({
      message: 'El correo electrónico es requerido',
    }),
    password: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
    confirmPassword: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
    name: z.string().min(1, { message: 'El nombre es requerido' }),
    lastName: z.string().min(1, { message: 'El apellido es requerido' }),
    contactNumber: z
      .string()
      .min(1, { message: 'El número de contacto es requerido' }),
    terms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirmation'],
  });

//TODO: Add forms for forgot password, reset password, update password, update business profile, update user profile
export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: 'El correo electrónico es requerido',
  }),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
    passwordConfirmation: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirmation'],
  });

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
    password: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
    passwordConfirmation: z.string().min(6, {
      message: 'La contraseña debe tener al menos 6 caracteres',
    }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirmation'],
  });

export const UpdateBusinessProfileSchema = z.object({
  businessName: z
    .string()
    .min(1, { message: 'El nombre del negocio es requerido' }),
  businessNif: z.string().min(1, { message: 'El NIF es requerida' }),
  businessPhone: z.string().min(1, { message: 'El telefono es requerido' }),
  businessAddress: z.string().min(1, { message: 'La dirección es requerida' }),
  businessCity: z.string().min(1, { message: 'La ciudad es requerida' }),
  businessState: z.string().min(1, { message: 'El estado es requerido' }),
  businessCountry: z.string().min(1, { message: 'El país es requerido' }),
  businessPostalCode: z
    .string()
    .min(1, { message: 'El código postal es requerido' }),
  businessNumberOFEmployees: z
    .number()
    .min(1, { message: 'El número de empleados es requerido' }),
});

export const UpdateUserProfileSchema = z.object({
  name: z.string().min(1, { message: 'El nombre es requerido' }),
  lastName: z.string().min(1, { message: 'El apellido es requerido' }),
  contactNumber: z
    .number()
    .min(1, { message: 'El número de contacto es requerido' }),
});

export const UserSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string().email().optional(),
  emailVerified: z.date().nullable().optional(),
  image: z.string().nullable().optional(),
  contactNumber: z.string().nullable().optional(),
  role: z.enum(['ADMIN', 'CLIENT', 'EMPLOYEE']).optional(),
  isTwoFactorEnabled: z.boolean().optional(),
  terms: z.boolean().optional(),
  password: z.string().optional(),
  newPassword: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  lastLogin: z.date().nullable().optional(),
});

export const HoldedDataDeleteSchema = z.object({
  confirmation: z.string().min(1, { message: 'La confirmación es requerida' }),
});
