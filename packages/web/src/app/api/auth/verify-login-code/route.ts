import { NextRequest, NextResponse } from 'next/server';

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
      const responseObj = NextResponse.json(data, { status: response.status });
      
      // Set httpOnly cookies for security
      responseObj.cookies.set('access_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 15 * 60, // 15 minutes for access token
        path: '/',
      });

      if (data.refresh_token) {
        responseObj.cookies.set('refresh_token', data.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 days for refresh token
          path: '/',
        });
      }

      return responseObj;
    }

    // Return the response from the backend
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Verify login code API error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}