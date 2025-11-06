import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Hardcoded credentials check
    if (body.email === 'alkitu@alkitu.com' && body.password === 'test123') {
      // Create a mock successful response
      const mockUser = {
        id: '1',
        email: 'alkitu@alkitu.com',
        name: 'Alkitu User',
        role: 'admin',
      };

      // Create a mock JWT token with proper structure
      // JWT has 3 parts: header.payload.signature
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(JSON.stringify({
        sub: '1',
        email: 'alkitu@alkitu.com',
        name: 'Alkitu User',
        role: 'ADMIN', // Use uppercase to match UserRole enum
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
      }));
      const signature = 'mock-signature';
      
      const mockAccessToken = `${header}.${payload}.${signature}`;
      const mockRefreshToken = `${header}.${btoa(JSON.stringify({...JSON.parse(atob(payload)), exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60)}))}.${signature}`;

      const nextResponse = NextResponse.json(
        { 
          message: 'Login successful', 
          user: mockUser,
          access_token: mockAccessToken,
          refresh_token: mockRefreshToken
        },
        { status: 200 },
      );

      // Set cookies for authentication
      nextResponse.cookies.set('auth-token', mockAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/',
      });

      nextResponse.cookies.set('refresh-token', mockRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/',
      });

      console.log('Hardcoded login successful for alkitu@alkitu.com');
      return nextResponse;
    }

    // If not hardcoded credentials, forward to backend
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    console.log(`Forwarding login request to: ${backendUrl}/users/login`);

    try {
      const response = await fetch(`${backendUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log(`Backend response status: ${response.status}`);
      console.log(
        `Backend response content-type: ${response.headers.get(
          'content-type',
        )}`,
      );

      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Backend did not return JSON response');
        const textResponse = await response.text();
        console.error('Backend response text:', textResponse.substring(0, 200));

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
      
      console.log('Backend login response data:', data);

      // Si el backend devuelve error, reenviarlo tal como está
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      // Si el login es exitoso, establecer cookies
      if (response.ok && data.user) {
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        
        console.log(
          'Setting cookies - access_token exists:',
          !!accessToken,
          'refresh_token exists:',
          !!refreshToken,
          'role:',
          data.user.role,
        );
        
        const nextResponse = NextResponse.json(
          { message: data.message || 'Login successful', user: data.user },
          { status: response.status },
        );
        
        // Establecer cookies para middleware
        if (accessToken) {
        nextResponse.cookies.set('auth-token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 24 * 60 * 60, // 24 horas para access token
            path: '/',
        });
        }
        
        if (refreshToken) {
        nextResponse.cookies.set('refresh-token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60, // 7 días para refresh token
            path: '/',
          });
        }

        // El rol del usuario se obtiene del JWT token, no necesitamos cookie separada
        
        console.log('Cookies set successfully');
        return nextResponse;
      }

      // Return the response from the backend
      return NextResponse.json(data, { status: response.status });
    } catch (fetchError: any) {
      console.error('Backend connection error:', fetchError.message);

      // En caso de error de conexión, devolver el error real en lugar de mock
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
    console.error('Login API error:', error);

    return NextResponse.json(
      {
        message: 'Internal server error',
        details: error.message,
      },
      { status: 500 },
    );
  }
}
