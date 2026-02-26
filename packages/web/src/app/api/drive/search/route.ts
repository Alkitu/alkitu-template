import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * GET /api/drive/search?q=term&pageSize=25&pageToken=xxx
 * BFF proxy for searching files and folders by name
 */
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const q = searchParams.get('q') || '';
    const pageSize = searchParams.get('pageSize') || '25';
    const pageToken = searchParams.get('pageToken') || '';

    const params = new URLSearchParams({ q, pageSize });
    if (pageToken) params.set('pageToken', pageToken);

    const response = await fetch(
      `${BACKEND_URL}/drive/search?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('GET /api/drive/search error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
