import { vi } from 'vitest';
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createTRPCReact, httpBatchLink } from '@trpc/react-query';
// @ts-expect-error - test-only import, @alkitu/api types not available in web package
import type { AppRouter } from '@alkitu/api';
import { TranslationsProvider } from '@/context/TranslationsContext';

// Create tRPC client for testing
export const trpc = createTRPCReact<AppRouter>();

// Create a new QueryClient for each test
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

// Create test tRPC client
export function createTestTRPCClient() {
  return (trpc as any).createClient({
    links: [
      httpBatchLink({
        url: 'http://localhost:3001/trpc',
        fetch: async () => {
          // Return mock response
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          });
        },
      }),
    ],
  });
}

interface AllProvidersProps {
  children: React.ReactNode;
  trpcClient?: ReturnType<typeof createTestTRPCClient>;
  queryClient?: QueryClient;
  translations?: Record<string, any>;
  locale?: 'es' | 'en';
}

export function AllProviders({
  children,
  trpcClient,
  queryClient,
  translations = {},
  locale = 'en',
}: AllProvidersProps) {
  const testQueryClient = queryClient || createTestQueryClient();
  const testTRPCClient = trpcClient || createTestTRPCClient();

  const TRPCProvider = (trpc as any).Provider;
  return (
    <TRPCProvider client={testTRPCClient} queryClient={testQueryClient}>
      <QueryClientProvider client={testQueryClient}>
        <TranslationsProvider
          initialLocale={locale}
          initialTranslations={translations}
        >
          {children}
        </TranslationsProvider>
      </QueryClientProvider>
    </TRPCProvider>
  );
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  trpcClient?: ReturnType<typeof createTestTRPCClient>;
  queryClient?: QueryClient;
  translations?: Record<string, any>;
  locale?: 'es' | 'en';
}

export function renderWithProviders(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  const { trpcClient, queryClient, translations, locale, ...renderOptions } =
    options || {};

  return render(ui, {
    wrapper: ({ children }) => (
      <AllProviders
        trpcClient={trpcClient}
        queryClient={queryClient}
        translations={translations}
        locale={locale}
      >
        {children}
      </AllProviders>
    ),
    ...renderOptions,
  });
}

// Store router configuration globally so vi.mock() can access it
let globalRouterConfig: any = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
  prefetch: vi.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
};

// Mock Next.js router
export function mockNextRouter(overrides = {}) {
  const router = {
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
    ...overrides,
  };

  // Update global config
  globalRouterConfig = router;

  return router;
}

// Create mock tRPC query
export function createMockTRPCQuery<T>(data: T, options = {}) {
  return {
    data,
    isLoading: false,
    isError: false,
    error: null,
    refetch: vi.fn(),
    ...options,
  };
}

// Create mock tRPC mutation
export function createMockTRPCMutation<T>(options = {}) {
  return {
    mutate: vi.fn(),
    mutateAsync: vi.fn(),
    isLoading: false,
    isError: false,
    isSuccess: false,
    error: null,
    data: null as T | null,
    reset: vi.fn(),
    ...options,
  };
}

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { vi };
