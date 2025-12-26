import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest, NextResponse, NextFetchEvent } from 'next/server';
import { withI18nMiddleware } from '../withI18nMiddleware';

/**
 * Integration tests for the i18n middleware
 * These tests verify the internationalization routing and cookie management
 */
describe('i18n Middleware Integration Tests', () => {
  let mockNext: any;
  let consoleLogSpy: any;

  beforeEach(() => {
    // Mock next middleware function
    mockNext = vi.fn(async () => NextResponse.next());

    // Mock console.log to avoid spam in test output
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleLogSpy.mockRestore();
  });

  // Helper function to create mock NextRequest
  const createRequest = (
    url: string,
    cookies: Record<string, string> = {},
  ) => {
    const request = new NextRequest(new URL(url, 'http://localhost:3000'));

    // Mock cookies.get to return our test cookies
    const originalGet = request.cookies.get.bind(request.cookies);
    request.cookies.get = vi.fn((name: string) => {
      if (cookies[name]) {
        return { name, value: cookies[name] } as any;
      }
      return originalGet(name);
    });

    return request;
  };

  // Helper to create mock NextFetchEvent
  const createEvent = () =>
    ({
      waitUntil: vi.fn(),
    }) as unknown as NextFetchEvent;

  describe('Root Path Redirection Flow', () => {
    it('should redirect / to /es when no cookie exists (default locale)', async () => {
      const request = createRequest('http://localhost:3000/');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('http://localhost:3000/es');

      // Verify cookie is set
      const setCookieHeader = response.headers.get('Set-Cookie');
      expect(setCookieHeader).toContain('NEXT_LOCALE=es');
      expect(setCookieHeader).toContain('SameSite=lax');
    });

    it('should redirect / to /en when cookie has en locale', async () => {
      const request = createRequest('http://localhost:3000/', {
        NEXT_LOCALE: 'en',
      });
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('http://localhost:3000/en');
    });

    it('should use default locale when cookie has invalid locale', async () => {
      const request = createRequest('http://localhost:3000/', {
        NEXT_LOCALE: 'fr', // Invalid locale
      });
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe('http://localhost:3000/es');
    });
  });

  describe('Path Without Locale Redirection', () => {
    it('should redirect /dashboard to /es/dashboard (default locale)', async () => {
      const request = createRequest('http://localhost:3000/dashboard');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/es/dashboard',
      );
    });

    it('should redirect /profile to /en/profile when cookie is en', async () => {
      const request = createRequest('http://localhost:3000/profile', {
        NEXT_LOCALE: 'en',
      });
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/en/profile',
      );
    });

    it('should preserve query parameters in redirect', async () => {
      const request = createRequest(
        'http://localhost:3000/dashboard?tab=settings',
      );
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/es/dashboard?tab=settings',
      );
    });
  });

  describe('Paths With Valid Locale', () => {
    it('should not redirect /es path', async () => {
      const request = createRequest('http://localhost:3000/es');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      await middleware(request, event);

      // Should call next middleware instead of redirecting
      expect(mockNext).toHaveBeenCalled();
    });

    it('should not redirect /en path', async () => {
      const request = createRequest('http://localhost:3000/en');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      await middleware(request, event);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should not redirect /es/dashboard path', async () => {
      const request = createRequest('http://localhost:3000/es/dashboard');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      await middleware(request, event);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('Cookie Validation and Management', () => {
    it('should set cookie with correct configuration', async () => {
      const request = createRequest('http://localhost:3000/');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      const setCookieHeader = response.headers.get('Set-Cookie');
      expect(setCookieHeader).toContain('NEXT_LOCALE=es');
      expect(setCookieHeader).toContain('Path=/');
      expect(setCookieHeader).toContain('Max-Age=31536000'); // 1 year
      expect(setCookieHeader).toContain('SameSite=lax');
    });

    it('should use valid locale from cookie', async () => {
      const request = createRequest('http://localhost:3000/dashboard', {
        NEXT_LOCALE: 'en',
      });
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/en/dashboard',
      );
    });

    it('should reject invalid locale from cookie and use default', async () => {
      const request = createRequest('http://localhost:3000/dashboard', {
        NEXT_LOCALE: 'invalid',
      });
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/es/dashboard',
      );
    });

    it('should override cookie locale with path locale', async () => {
      const request = createRequest('http://localhost:3000/en/dashboard', {
        NEXT_LOCALE: 'es',
      });
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      // Should not redirect, path locale takes precedence
      expect(mockNext).toHaveBeenCalled();

      // Cookie should be updated to match path locale
      const setCookieHeader = response.headers.get('Set-Cookie');
      expect(setCookieHeader).toContain('NEXT_LOCALE=en');
    });
  });

  describe('Route Exclusions', () => {
    it('should not redirect /api paths', async () => {
      const request = createRequest('http://localhost:3000/api/users');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      await middleware(request, event);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should not redirect static files', async () => {
      const request = createRequest('http://localhost:3000/favicon.ico');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      await middleware(request, event);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should not redirect /not-found', async () => {
      const request = createRequest('http://localhost:3000/not-found');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      await middleware(request, event);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should not redirect _next paths', async () => {
      const request = createRequest(
        'http://localhost:3000/_next/static/chunk.js',
      );
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      await middleware(request, event);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should not redirect service worker', async () => {
      const request = createRequest('http://localhost:3000/sw.js');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      await middleware(request, event);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('HTTP Status Codes', () => {
    it('should use 302 status for root path redirects', async () => {
      const request = createRequest('http://localhost:3000/');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
    });

    it('should use 302 for path without locale redirects', async () => {
      const request = createRequest('http://localhost:3000/dashboard');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
    });
  });

  describe('Performance Integration Tests', () => {
    it('should handle multiple concurrent requests with different locales', async () => {
      const requests = [
        createRequest('http://localhost:3000/dashboard', { NEXT_LOCALE: 'es' }),
        createRequest('http://localhost:3000/profile', { NEXT_LOCALE: 'en' }),
        createRequest('http://localhost:3000/settings'),
      ];

      const middleware = withI18nMiddleware(mockNext);
      const responses = await Promise.all(
        requests.map((req) => middleware(req, createEvent())),
      );

      expect(responses[0].headers.get('Location')).toBe(
        'http://localhost:3000/es/dashboard',
      );
      expect(responses[1].headers.get('Location')).toBe(
        'http://localhost:3000/en/profile',
      );
      expect(responses[2].headers.get('Location')).toBe(
        'http://localhost:3000/es/settings',
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty cookie value', async () => {
      const request = createRequest('http://localhost:3000/', {
        NEXT_LOCALE: '',
      });
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      // Should use default locale when cookie is empty
      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/es',
      );
    });

    it('should handle malformed locale in cookie', async () => {
      const request = createRequest('http://localhost:3000/', {
        NEXT_LOCALE: 'ES-MX', // Malformed locale
      });
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      // Should use default locale
      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/es',
      );
    });

    it('should handle paths with trailing slashes', async () => {
      const request = createRequest('http://localhost:3000/dashboard/');
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/es/dashboard/',
      );
    });

    it('should handle deeply nested paths', async () => {
      const request = createRequest(
        'http://localhost:3000/admin/users/settings/profile',
      );
      const event = createEvent();

      const middleware = withI18nMiddleware(mockNext);
      const response = await middleware(request, event);

      expect(response.status).toBe(302);
      expect(response.headers.get('Location')).toBe(
        'http://localhost:3000/es/admin/users/settings/profile',
      );
    });
  });
});
