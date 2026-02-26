import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

/**
 * GET /api/drive/files/:fileId/thumbnail
 * BFF proxy that fetches a file thumbnail via the backend service account.
 * Returns the image bytes with appropriate caching headers.
 */
export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ fileId: string }> },
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { fileId } = await props.params;

    const response = await fetch(
      `${BACKEND_URL}/drive/files/${fileId}/thumbnail`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      return new NextResponse(null, { status: 404 });
    }

    const buffer = await response.arrayBuffer();
    const contentType =
      response.headers.get('content-type') || 'image/png';

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('GET /api/drive/files/[fileId]/thumbnail error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
