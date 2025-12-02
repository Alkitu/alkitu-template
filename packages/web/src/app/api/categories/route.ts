import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/categories
 *
 * Get all service categories (ALI-118)
 *
 * @requires Authentication (auth-token cookie)
 * @returns Array of Category objects with service count
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication token not found',
        },
        { status: 401 },
      );
    }

    // Forward to backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${backendUrl}/categories`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Backend did not return JSON response');
        return NextResponse.json(
          {
            error: 'Backend service unavailable',
            message:
              'Please ensure the NestJS backend is running on port 3001',
          },
          { status: 503 },
        );
      }

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || 'Failed to fetch categories' },
          { status: response.status },
        );
      }

      return NextResponse.json(data, { status: 200 });
    } catch (fetchError: any) {
      console.error('Backend connection error:', fetchError.message);
      return NextResponse.json(
        {
          error: 'Service unavailable',
          message: 'Unable to connect to backend service',
        },
        { status: 503 },
      );
    }
  } catch (error: any) {
    console.error('Get categories API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/categories
 *
 * Create a new service category (ALI-118)
 *
 * @requires Authentication (auth-token cookie)
 * @body CreateCategoryInput (name)
 * @returns Created Category object
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication token not found',
        },
        { status: 401 },
      );
    }

    // Forward to backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    try {
      const response = await fetch(`${backendUrl}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Backend did not return JSON response');
        return NextResponse.json(
          {
            error: 'Backend service unavailable',
            message:
              'Please ensure the NestJS backend is running on port 3001',
          },
          { status: 503 },
        );
      }

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(
          { error: data.message || 'Failed to create category' },
          { status: response.status },
        );
      }

      return NextResponse.json(data, { status: 201 });
    } catch (fetchError: any) {
      console.error('Backend connection error:', fetchError.message);
      return NextResponse.json(
        {
          error: 'Service unavailable',
          message: 'Unable to connect to backend service',
        },
        { status: 503 },
      );
    }
  } catch (error: any) {
    console.error('Create category API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
