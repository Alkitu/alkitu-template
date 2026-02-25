import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';

// Mock shared package subpath imports that aren't in the exports map
vi.mock('@alkitu/shared/enums/user-role.enum', () => ({
  UserRole: {
    ADMIN: 'ADMIN',
    EMPLOYEE: 'EMPLOYEE',
    CLIENT: 'CLIENT',
    LEAD: 'LEAD',
    MODERATOR: 'MODERATOR',
    USER: 'USER',
  },
}));

vi.mock('@alkitu/shared/rbac/role-hierarchy', () => ({
  hasRole: (userRole: string, requiredRoles: string[]) => {
    // Simplified hierarchy: ADMIN inherits all
    if (userRole === 'ADMIN') return true;
    return requiredRoles.includes(userRole);
  },
}));

// Mock jose
vi.mock('jose', () => ({
  jwtVerify: vi.fn(),
}));

// Mock the logger
vi.mock('@/lib/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock verify-jwt
const mockVerifyJWT = vi.fn();
vi.mock('@/lib/auth/verify-jwt', () => ({
  verifyJWT: (...args: any[]) => mockVerifyJWT(...args),
}));

import { withAuthMiddleware } from '../withAuthMiddleware';

describe('Auth Middleware Integration Tests', () => {
  let mockNext: any;
  const originalFetch = global.fetch;

  beforeEach(() => {
    mockNext = vi.fn(async () => NextResponse.next());
    vi.clearAllMocks();
    delete process.env.SKIP_AUTH;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  // Helper to create a mock request
  const createRequest = (
    url: string,
    cookies: Record<string, string> = {},
  ) => {
    const request = new NextRequest(new URL(url, 'http://localhost:3000'));
    const originalGet = request.cookies.get.bind(request.cookies);
    request.cookies.get = vi.fn((name: string) => {
      if (cookies[name]) {
        return { name, value: cookies[name] } as any;
      }
      return originalGet(name);
    }) as any;
    return request;
  };

  const createEvent = () =>
    ({
      waitUntil: vi.fn(),
    }) as unknown as NextFetchEvent;

  const validAdminPayload = {
    sub: '1',
    email: 'admin@test.com',
    role: 'ADMIN',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const validClientPayload = {
    sub: '2',
    email: 'client@test.com',
    role: 'CLIENT',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  const validEmployeePayload = {
    sub: '3',
    email: 'employee@test.com',
    role: 'EMPLOYEE',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };

  // =====================================================
  // SKIP_AUTH bypass
  // =====================================================
  describe('SKIP_AUTH bypass', () => {
    it('should bypass auth in development when SKIP_AUTH is true', async () => {
      process.env.SKIP_AUTH = 'true';
      process.env.NODE_ENV = 'development';

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should throw error if SKIP_AUTH is true in production', async () => {
      process.env.SKIP_AUTH = 'true';
      process.env.NODE_ENV = 'production';

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
      );
      const middleware = withAuthMiddleware(mockNext);

      await expect(middleware(request, createEvent())).rejects.toThrow(
        'SECURITY ERROR: SKIP_AUTH cannot be enabled in production environment',
      );
    });
  });

  // =====================================================
  // Public routes
  // =====================================================
  describe('Public routes', () => {
    it('should allow /api paths without auth', async () => {
      const request = createRequest('http://localhost:3000/api/auth/login');
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow static files without auth', async () => {
      const request = createRequest('http://localhost:3000/favicon.ico');
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow _next paths without auth', async () => {
      const request = createRequest(
        'http://localhost:3000/_next/static/chunk.js',
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow /not-found without auth', async () => {
      const request = createRequest('http://localhost:3000/not-found');
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // =====================================================
  // Auth page redirects for authenticated users
  // =====================================================
  describe('Redirect authenticated users from auth pages', () => {
    it('should redirect authenticated ADMIN to admin dashboard from login page', async () => {
      mockVerifyJWT.mockResolvedValue(validAdminPayload);

      const request = createRequest(
        'http://localhost:3000/es/auth/login',
        { 'auth-token': 'valid-jwt-token' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain(
        '/es/admin/dashboard',
      );
    });

    it('should redirect authenticated CLIENT to client dashboard from login page', async () => {
      mockVerifyJWT.mockResolvedValue(validClientPayload);

      const request = createRequest(
        'http://localhost:3000/es/auth/login',
        { 'auth-token': 'valid-jwt-token' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain(
        '/es/client/dashboard',
      );
    });

    it('should redirect authenticated EMPLOYEE to employee dashboard from register page', async () => {
      mockVerifyJWT.mockResolvedValue(validEmployeePayload);

      const request = createRequest(
        'http://localhost:3000/en/auth/register',
        { 'auth-token': 'valid-jwt-token' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain(
        '/en/employee/dashboard',
      );
    });

    it('should allow unauthenticated users to access auth pages', async () => {
      const request = createRequest('http://localhost:3000/es/auth/login');
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow access to auth pages if token verification fails', async () => {
      mockVerifyJWT.mockResolvedValue(null);

      const request = createRequest(
        'http://localhost:3000/es/auth/login',
        { 'auth-token': 'invalid-jwt-token' },
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // =====================================================
  // JWT verification
  // =====================================================
  describe('JWT verification', () => {
    it('should reject forged tokens (verifyJWT returns null)', async () => {
      mockVerifyJWT.mockResolvedValue(null);
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }) as any;

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
        {
          'auth-token': 'forged.jwt.token',
          'refresh-token': 'some-refresh',
        },
      );

      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/es/auth/login');
    });

    it('should accept valid tokens', async () => {
      mockVerifyJWT.mockResolvedValue(validAdminPayload);

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
        { 'auth-token': 'valid-jwt-token' },
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should redirect to login when no cookies exist', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }) as any;

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/es/auth/login');
    });
  });

  // =====================================================
  // Role-based access control
  // =====================================================
  describe('Role-based access control', () => {
    it('should allow ADMIN to access admin routes', async () => {
      mockVerifyJWT.mockResolvedValue(validAdminPayload);

      const request = createRequest(
        'http://localhost:3000/es/admin/users',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny CLIENT access to admin routes', async () => {
      mockVerifyJWT.mockResolvedValue(validClientPayload);

      const request = createRequest(
        'http://localhost:3000/es/admin/users',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/es/unauthorized');
    });

    it('should allow CLIENT to access client routes', async () => {
      mockVerifyJWT.mockResolvedValue(validClientPayload);

      const request = createRequest(
        'http://localhost:3000/es/client/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should deny EMPLOYEE access to admin routes', async () => {
      mockVerifyJWT.mockResolvedValue(validEmployeePayload);

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/es/unauthorized');
    });

    it('should allow ADMIN to access employee routes (hierarchy)', async () => {
      mockVerifyJWT.mockResolvedValue(validAdminPayload);

      const request = createRequest(
        'http://localhost:3000/es/employee/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });

    it('should allow all authenticated users to access shared routes', async () => {
      mockVerifyJWT.mockResolvedValue(validClientPayload);

      const request = createRequest(
        'http://localhost:3000/es/profile',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // =====================================================
  // Refresh token flow
  // =====================================================
  describe('Refresh token flow', () => {
    it('should attempt refresh when auth-token is missing but refresh-token exists', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
        }),
      }) as any;

      // verifyJWT not called for the inline refresh path (no auth cookie)
      // but we still need to mock it for potential calls
      mockVerifyJWT.mockResolvedValue(validAdminPayload);

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
        { 'refresh-token': 'valid-refresh-token' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/auth/refresh'),
        expect.any(Object),
      );
    });

    it('should redirect to login when refresh fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }) as any;

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
        { 'refresh-token': 'expired-refresh-token' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/es/auth/login');
    });

    it('should redirect to login when no tokens exist at all', async () => {
      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
      );

      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/es/auth/login');
    });

    it('should attempt refresh when token verification fails', async () => {
      mockVerifyJWT
        .mockResolvedValueOnce(null) // original token fails
        .mockResolvedValueOnce(validAdminPayload); // refreshed token succeeds

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
        }),
      }) as any;

      const request = createRequest(
        'http://localhost:3000/es/admin/dashboard',
        {
          'auth-token': 'expired-jwt',
          'refresh-token': 'valid-refresh',
        },
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // =====================================================
  // PENDING status
  // =====================================================
  describe('PENDING status handling', () => {
    it('should redirect PENDING user to verify-email when email not verified', async () => {
      mockVerifyJWT.mockResolvedValue({
        ...validClientPayload,
        status: 'PENDING',
        emailVerified: false,
        profileComplete: false,
      });

      const request = createRequest(
        'http://localhost:3000/es/client/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain(
        '/es/auth/verify-email',
      );
    });

    it('should redirect PENDING user to onboarding when email verified but profile incomplete', async () => {
      mockVerifyJWT.mockResolvedValue({
        ...validClientPayload,
        status: 'PENDING',
        emailVerified: true,
        profileComplete: false,
      });

      const request = createRequest(
        'http://localhost:3000/es/client/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/es/onboarding');
    });

    it('should allow PENDING user with verified email and complete profile', async () => {
      mockVerifyJWT.mockResolvedValue({
        ...validClientPayload,
        status: 'PENDING',
        emailVerified: true,
        profileComplete: true,
      });

      const request = createRequest(
        'http://localhost:3000/es/client/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });
  });

  // =====================================================
  // Dashboard redirects by role
  // =====================================================
  describe('Dashboard redirects', () => {
    it('should redirect /dashboard to /admin/dashboard for ADMIN', async () => {
      mockVerifyJWT.mockResolvedValue(validAdminPayload);

      const request = createRequest(
        'http://localhost:3000/es/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain(
        '/es/admin/dashboard',
      );
    });

    it('should redirect /dashboard to /client/dashboard for CLIENT', async () => {
      mockVerifyJWT.mockResolvedValue(validClientPayload);

      const request = createRequest(
        'http://localhost:3000/es/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain(
        '/es/client/dashboard',
      );
    });

    it('should redirect /dashboard to /employee/dashboard for EMPLOYEE', async () => {
      mockVerifyJWT.mockResolvedValue(validEmployeePayload);

      const request = createRequest(
        'http://localhost:3000/es/dashboard',
        { 'auth-token': 'valid-jwt' },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain(
        '/es/employee/dashboard',
      );
    });
  });

  // =====================================================
  // Locale handling
  // =====================================================
  describe('Locale handling', () => {
    it('should use en locale from path', async () => {
      mockVerifyJWT.mockResolvedValue(null);
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }) as any;

      const request = createRequest(
        'http://localhost:3000/en/admin/dashboard',
        {
          'auth-token': 'invalid',
          'refresh-token': 'also-invalid',
        },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      expect(response?.status).toBe(307);
      expect(response?.headers.get('Location')).toContain('/en/auth/login');
    });

    it('should preserve redirect path in login URL', async () => {
      mockVerifyJWT.mockResolvedValue(null);
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
      }) as any;

      const request = createRequest(
        'http://localhost:3000/es/admin/users',
        {
          'auth-token': 'invalid',
          'refresh-token': 'also-invalid',
        },
      );
      const middleware = withAuthMiddleware(mockNext);
      const response = await middleware(request, createEvent());

      const location = response?.headers.get('Location') || '';
      expect(location).toContain('redirect=');
      expect(location).toContain('%2Fes%2Fadmin%2Fusers');
    });
  });

  // =====================================================
  // Routes without required roles
  // =====================================================
  describe('Routes without required roles', () => {
    it('should allow access to unprotected routes without auth', async () => {
      const request = createRequest(
        'http://localhost:3000/es/some-public-page',
      );
      const middleware = withAuthMiddleware(mockNext);
      await middleware(request, createEvent());

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
