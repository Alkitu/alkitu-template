import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  AUTH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  AUTH_COOKIE_OPTIONS,
} from '@/lib/auth/constants';

export async function POST(request: NextRequest) {
  try {
    // Obtener el token de autenticación de las cookies
    const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

    // Si hay token, intentar hacer logout en el backend
    if (authToken) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
        await fetch(`${backendUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });
        // No importa si falla el backend, continuamos limpiando las cookies locales
      } catch (backendError: unknown) {
        const message = backendError instanceof Error ? backendError.message : 'Unknown error';
        logger.warn('Backend logout failed', { error: message });
      }
    }

    // Limpiar cookies de autenticación localmente
    const response = NextResponse.json(
      { message: 'Logout successful' },
      { status: 200 }
    );

    // Eliminar cookies de tokens
    response.cookies.set(AUTH_TOKEN_COOKIE, '', {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });

    response.cookies.set(REFRESH_TOKEN_COOKIE, '', {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: 0,
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Logout API error', { error: message });

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: message,
      },
      { status: 500 }
    );
  }
}
