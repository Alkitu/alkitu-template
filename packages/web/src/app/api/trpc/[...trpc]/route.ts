import { NextRequest, NextResponse } from 'next/server';
import { AUTH_TOKEN_COOKIE } from '@/lib/auth/constants';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function proxyTrpc(request: NextRequest): Promise<NextResponse> {
  const { pathname, search } = request.nextUrl;

  // Strip /api/trpc prefix → forward as /trpc/...
  const trpcPath = pathname.replace(/^\/api\/trpc/, '/trpc');
  const targetUrl = `${BACKEND_URL}${trpcPath}${search}`;

  // Read httpOnly cookie server-side
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  const headers = new Headers();
  headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fetchOptions: RequestInit = {
    method: request.method,
    headers,
  };

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    fetchOptions.body = await request.text();
  }

  const response = await fetch(targetUrl, fetchOptions);

  const data = await response.text();

  return new NextResponse(data, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
    },
  });
}

export const GET = proxyTrpc;
export const POST = proxyTrpc;
