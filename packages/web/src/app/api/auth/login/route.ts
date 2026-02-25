import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import {
  AUTH_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  AUTH_COOKIE_OPTIONS,
} from '@/lib/auth/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward to backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${backendUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        logger.error('Backend did not return JSON response for login');

        return NextResponse.json(
          {
            message:
              'Backend service unavailable. Please ensure the NestJS backend is running on port 3001.',
            details: 'Expected JSON response but received HTML/text',
          },
          { status: 503 },
        );
      }

      const data = await response.json();

      // Si el backend devuelve error, reenviarlo tal como está
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      // Si el login es exitoso, establecer cookies
      if (response.ok && data.user) {
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;

        logger.debug('Login successful, setting cookies', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          role: data.user.role,
        });

        const nextResponse = NextResponse.json(
          { message: data.message || 'Login successful', user: data.user },
          { status: response.status },
        );

        if (accessToken) {
          nextResponse.cookies.set(AUTH_TOKEN_COOKIE, accessToken, {
            ...AUTH_COOKIE_OPTIONS,
            maxAge: ACCESS_TOKEN_MAX_AGE,
          });
        }

        if (refreshToken) {
          nextResponse.cookies.set(REFRESH_TOKEN_COOKIE, refreshToken, {
            ...AUTH_COOKIE_OPTIONS,
            maxAge: REFRESH_TOKEN_MAX_AGE,
          });
        }

        return nextResponse;
      }

      // Return the response from the backend
      return NextResponse.json(data, { status: response.status });
    } catch (fetchError: unknown) {
      const message =
        fetchError instanceof Error ? fetchError.message : 'Unknown error';
      logger.error('Backend connection error during login', {
        error: message,
      });

      return NextResponse.json(
        {
          message: 'Unable to connect to authentication service',
          details:
            'The backend service is not available. Please try again later.',
        },
        { status: 503 },
      );
    }
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Login API error', { error: message });

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: message,
      },
      { status: 500 },
    );
  }
}
