import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/services/[id]
 *
 * Get a specific service by ID with category info (ALI-118)
 *
 * @requires Authentication (auth-token cookie)
 * @param id - Service ID (MongoDB ObjectId)
 * @returns Service object with category
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
      const response = await fetch(`${backendUrl}/services/${id}`, {
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
          { error: data.message || 'Failed to fetch service' },
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
    console.error('Get service API error:', error);
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
 * PATCH /api/services/[id]
 *
 * Update a service (ALI-118)
 *
 * @requires Authentication (auth-token cookie)
 * @param id - Service ID (MongoDB ObjectId)
 * @body UpdateServiceInput (name?, categoryId?, thumbnail?, requestTemplate?)
 * @returns Updated Service object with category
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
      const response = await fetch(`${backendUrl}/services/${id}`, {
        method: 'PATCH',
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
          { error: data.message || 'Failed to update service' },
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
    console.error('Update service API error:', error);
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
 * DELETE /api/services/[id]
 *
 * Delete a service (ALI-118)
 *
 * @requires Authentication (auth-token cookie)
 * @param id - Service ID (MongoDB ObjectId)
 * @returns Deleted Service object
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
      const response = await fetch(`${backendUrl}/services/${id}`, {
        method: 'DELETE',
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
          { error: data.message || 'Failed to delete service' },
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
    console.error('Delete service API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
