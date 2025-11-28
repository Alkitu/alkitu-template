import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * PUT /api/users/profile
 *
 * Update authenticated user profile (ALI-116)
 * Updates allowed fields: firstname, lastname, phone, company
 * CLIENT role also can update: address, contactPerson
 *
 * @requires Authentication (auth-token cookie)
 * @body UpdateProfileFormData
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          message: 'Unauthorized',
          details: 'Authentication token not found',
        },
        { status: 401 },
      );
    }

    // Forward to backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log(
      `Forwarding update-profile request to: ${backendUrl}/users/me/profile`,
    );

    try {
      const response = await fetch(`${backendUrl}/users/me/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log(`Backend response status: ${response.status}`);

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Backend did not return JSON response');
        const textResponse = await response.text();
        console.error(
          'Backend response text:',
          textResponse.substring(0, 200),
        );

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

      console.log('Backend update-profile response data:', data);

      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data, { status: response.status });
    } catch (fetchError: any) {
      console.error('Backend connection error:', fetchError.message);

      return NextResponse.json(
        {
          message: 'Unable to connect to authentication service',
          details:
            'The backend service is not available. Please try again later.',
        },
        { status: 503 },
      );
    }
  } catch (error: any) {
    console.error('Update profile API error:', error);

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/users/profile
 *
 * Get authenticated user profile (ALI-116)
 * Optional: can be used instead of extracting from JWT
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    console.log('[GET /api/users/profile] Token exists:', !!token);
    console.log('[GET /api/users/profile] Token preview:', token?.substring(0, 20) + '...');

    if (!token) {
      console.log('[GET /api/users/profile] ERROR: No token found');
      return NextResponse.json(
        {
          message: 'Unauthorized',
          details: 'Authentication token not found',
        },
        { status: 401 },
      );
    }

    // Forward to backend (assuming endpoint exists)
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log('[GET /api/users/profile] Calling backend:', `${backendUrl}/users/me`);

    try {
      const response = await fetch(`${backendUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json(
          {
            message: 'Backend service unavailable',
            details: 'Expected JSON response but received HTML/text',
          },
          { status: 503 },
        );
      }

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data, { status: response.status });
    } catch (fetchError: any) {
      console.error('Backend connection error:', fetchError.message);

      return NextResponse.json(
        {
          message: 'Unable to connect to authentication service',
          details:
            'The backend service is not available. Please try again later.',
        },
        { status: 503 },
      );
    }
  } catch (error: any) {
    console.error('Get profile API error:', error);

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: error.message,
      },
      { status: 500 },
    );
  }
}


