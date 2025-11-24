import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * POST /api/auth/complete-profile
 *
 * Completes user profile during onboarding (ALI-115)
 * Updates optional fields: phone, company, address, contactPerson
 * Sets profileComplete flag to true
 *
 * @requires Authentication (auth-token cookie)
 * @body OnboardingFormData
 */
export async function POST(request: NextRequest) {
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
      `Forwarding complete-profile request to: ${backendUrl}/auth/complete-profile`,
    );

    try {
      const response = await fetch(`${backendUrl}/auth/complete-profile`, {
        method: 'POST',
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

      console.log('Backend complete-profile response data:', data);

      // If backend returns error, forward as is
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      // Success - profile completed
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
    console.error('Complete profile API error:', error);

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: error.message,
      },
      { status: 500 },
    );
  }
}

