import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * GET /api/categories/[id]
 *
 * Get a specific category by ID with its services (ALI-118)
 *
 * @requires Authentication (auth-token cookie)
 * @param id - Category ID (MongoDB ObjectId)
 * @returns Category object with services array
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
      const response = await fetch(`${backendUrl}/categories/${id}`, {
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
          { error: data.message || 'Failed to fetch category' },
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
    console.error('Get category API error:', error);
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
 * PUT /api/categories/[id]
 *
 * Update a category (ALI-118)
 *
 * @requires Authentication (auth-token cookie)
 * @param id - Category ID (MongoDB ObjectId)
 * @body UpdateCategoryInput (name)
 * @returns Updated Category object
 */
export async function PUT(
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
      const response = await fetch(`${backendUrl}/categories/${id}`, {
        method: 'PUT',
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
          { error: data.message || 'Failed to update category' },
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
    console.error('Update category API error:', error);
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
 * DELETE /api/categories/[id]
 *
 * Delete a category (only if it has no services) (ALI-118)
 *
 * @requires Authentication (auth-token cookie)
 * @param id - Category ID (MongoDB ObjectId)
 * @returns Deleted Category object
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
      const response = await fetch(`${backendUrl}/categories/${id}`, {
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
          { error: data.message || 'Failed to delete category' },
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
    console.error('Delete category API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
