import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * PUT /api/drive/upload/resumable-chunk
 * BFF proxy for streaming resumable upload chunks
 */
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const resumableURI = searchParams.get('resumableURI');

    if (!resumableURI) {
      return NextResponse.json(
        { message: 'Missing resumableURI parameter' },
        { status: 400 },
      );
    }

    // Prepare headers to forward
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
      'Content-Type':
        request.headers.get('content-type') || 'application/octet-stream',
    };

    const contentRange = request.headers.get('content-range');
    const contentLength = request.headers.get('content-length');
    if (contentRange) headers['Content-Range'] = contentRange;
    if (contentLength) headers['Content-Length'] = contentLength;

    const response = await fetch(
      `${BACKEND_URL}/drive/upload/resumable-chunk?resumableURI=${encodeURIComponent(resumableURI)}`,
      {
        method: 'PUT',
        headers,
        body: request.body,
        // @ts-expect-error duplex is required for streaming
        duplex: 'half',
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('PUT /api/drive/upload/resumable-chunk error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 },
    );
  }
}
