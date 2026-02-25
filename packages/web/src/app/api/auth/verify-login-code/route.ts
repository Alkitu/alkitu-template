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

    // Forward the request to the NestJS backend
    const response = await fetch(
      `${process.env.API_URL || 'http://localhost:3001'}/auth/verify-login-code`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    );

    const data = await response.json();

    if (response.ok && data.access_token) {
      // Create the response
      const responseObj = NextResponse.json(data, {
        status: response.status,
      });

      // Set httpOnly cookies for security
      responseObj.cookies.set(AUTH_TOKEN_COOKIE, data.access_token, {
        ...AUTH_COOKIE_OPTIONS,
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      if (data.refresh_token) {
        responseObj.cookies.set(REFRESH_TOKEN_COOKIE, data.refresh_token, {
          ...AUTH_COOKIE_OPTIONS,
          maxAge: REFRESH_TOKEN_MAX_AGE,
        });
      }

      return responseObj;
    }

    // Return the response from the backend
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Verify login code API error', { error: message });
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
