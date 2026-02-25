import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { refreshToken } = body;

    if (!refreshToken) {
      return NextResponse.json(
        { message: 'Refresh token is required' },
        { status: 400 },
      );
    }

    // Forward the request to the NestJS backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${backendUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        logger.error('Backend did not return JSON response for refresh');
        return NextResponse.json(
          { message: 'Backend service error' },
          { status: 503 },
        );
      }

      const data = await response.json();

      // Return the response from the backend
      return NextResponse.json(data, { status: response.status });
    } catch (fetchError: unknown) {
      const message =
        fetchError instanceof Error ? fetchError.message : 'Unknown error';
      logger.error('Backend connection error for refresh', {
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
    logger.error('Refresh API error', { error: message });

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: message,
      },
      { status: 500 },
    );
  }
}
