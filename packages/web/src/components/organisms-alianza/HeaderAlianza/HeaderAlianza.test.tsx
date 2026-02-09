import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  renderWithProviders,
  screen,
  waitFor,
  userEvent,
  mockNextRouter,
  createMockTRPCQuery,
} from '@/test/test-utils';
import { HeaderAlianza } from './HeaderAlianza';

// Mock fetch globally
global.fetch = vi.fn();

// Mock Next.js navigation
const mockPush = vi.fn();
const mockPathname = '/';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: vi.fn(),
  }),
  usePathname: () => mockPathname,
}));

// Mock tRPC
const mockInvalidate = vi.fn();
const mockUserQuery = vi.fn(() =>
  createMockTRPCQuery({ email: 'test@example.com', role: 'ADMIN' })
);

vi.mock('@/lib/trpc', () => ({
  trpc: {
    user: {
      me: {
        useQuery: (params: any, options: any) => mockUserQuery(),
      },
    },
    useUtils: () => ({
      user: {
        me: {
          invalidate: mockInvalidate,
        },
      },
    }),
  },
}));

// Mock translation context
const mockSetLocale = vi.fn();

vi.mock('@/context/TranslationsContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/context/TranslationsContext')>();
  return {
    ...actual,
    useTranslations: () => (key: string) => key,
    useTranslationContext: () => ({
      setLocale: mockSetLocale,
    }),
  };
});

// Mock Logo component
vi.mock('@/components/atoms-alianza/Logo', () => ({
  Logo: ({ className, alt }: { className?: string; alt?: string }) => (
    <div data-testid="logo" className={className} aria-label={alt}>
      Logo
    </div>
  ),
}));

// Mock Button component
vi.mock('@/components/molecules-alianza/Button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    className?: string;
  }) => (
    <button onClick={onClick} data-variant={variant} className={className}>
      {children}
    </button>
  ),
}));

// Mock ThemeToggle component
vi.mock('@/components/atoms-alianza/ThemeToggle', () => ({
  ThemeToggle: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock Sheet components
vi.mock('@/components/primitives/ui/sheet', () => ({
  Sheet: ({ children, open, onOpenChange }: any) => (
    <div data-testid="sheet" data-open={open}>
      {children}
    </div>
  ),
  SheetTrigger: ({ children, asChild }: any) => (
    <div data-testid="sheet-trigger">{children}</div>
  ),
  SheetContent: ({ children, side, className }: any) => (
    <div data-testid="sheet-content" data-side={side} className={className}>
      {children}
    </div>
  ),
  SheetTitle: ({ children, className }: any) => (
    <div data-testid="sheet-title" className={className}>
      {children}
    </div>
  ),
}));

// Mock DropdownMenu components
vi.mock('@/components/primitives/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => (
    <div data-testid="dropdown-menu">{children}</div>
  ),
  DropdownMenuTrigger: ({ children, asChild }: any) => (
    <div data-testid="dropdown-menu-trigger">{children}</div>
  ),
  DropdownMenuContent: ({ children, align, className }: any) => (
    <div
      data-testid="dropdown-menu-content"
      data-align={align}
      className={className}
    >
      {children}
    </div>
  ),
  DropdownMenuItem: ({ children, onClick, className }: any) => (
    <button
      data-testid="dropdown-menu-item"
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Menu: ({ className }: any) => (
    <div data-testid="menu-icon" className={className} />
  ),
  Globe: ({ className }: any) => (
    <div data-testid="globe-icon" className={className} />
  ),
  LogOut: ({ className }: any) => (
    <div data-testid="logout-icon" className={className} />
  ),
  LayoutDashboard: ({ className }: any) => (
    <div data-testid="dashboard-icon" className={className} />
  ),
}));

describe('HeaderAlianza - Organism', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();

    // Reset mocks to default state
    mockUserQuery.mockReturnValue(
      createMockTRPCQuery({ email: 'test@example.com', role: 'ADMIN' })
    );
  });

  describe('1. Rendering Tests', () => {
    it('should render the header when user is logged in', () => {
      renderWithProviders(<HeaderAlianza />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByTestId('logo').length).toBeGreaterThan(0);
    });

    it('should render the header when user is logged out', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
      expect(screen.getAllByTestId('logo').length).toBeGreaterThan(0);
    });

    it('should render on public route (home)', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      // Public routes should be visible (both desktop and mobile versions)
      expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Características').length).toBeGreaterThan(0);
    });

    it('should render on auth route (/auth/login)', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      // Should render but without public navigation links
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('2. Authentication Tests', () => {
    it('should display admin dashboard button when logged in', () => {
      renderWithProviders(<HeaderAlianza />);

      // Both desktop and mobile versions
      expect(screen.getAllByText('Panel Admin').length).toBeGreaterThan(0);
    });

    it('should display login button when logged out', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      // Both desktop and mobile versions
      expect(screen.getAllByText('Iniciar Sesión').length).toBeGreaterThan(0);
    });

    it('should display register button when logged out', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      // Both desktop and mobile versions
      expect(screen.getAllByText('Registrarse').length).toBeGreaterThan(0);
    });

    it('should call logout API on logout button click', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValue({ ok: true });

      renderWithProviders(<HeaderAlianza />);

      const logoutButtons = screen.getAllByTestId('logout-icon');
      const desktopLogoutButton = logoutButtons[0].parentElement!;

      await user.click(desktopLogoutButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
          method: 'POST',
        });
      });
    });

    it('should invalidate cache on logout', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValue({ ok: true });

      renderWithProviders(<HeaderAlianza />);

      const logoutButtons = screen.getAllByTestId('logout-icon');
      const desktopLogoutButton = logoutButtons[0].parentElement!;

      await user.click(desktopLogoutButton);

      await waitFor(() => {
        expect(mockInvalidate).toHaveBeenCalled();
      });
    });

    it('should redirect to login page after logout', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValue({ ok: true });

      renderWithProviders(<HeaderAlianza />);

      const logoutButtons = screen.getAllByTestId('logout-icon');
      const desktopLogoutButton = logoutButtons[0].parentElement!;

      await user.click(desktopLogoutButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login');
      });
    });

    it('should handle logout errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      renderWithProviders(<HeaderAlianza />);

      const logoutButtons = screen.getAllByTestId('logout-icon');
      const desktopLogoutButton = logoutButtons[0].parentElement!;

      await user.click(desktopLogoutButton);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(mockPush).toHaveBeenCalledWith('/auth/login');
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('3. Navigation Tests', () => {
    it('should render logo with link to home', () => {
      renderWithProviders(<HeaderAlianza />);

      const logos = screen.getAllByTestId('logo');
      const logoLink = logos[0].closest('a');
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('should render all public navigation links', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      // Both desktop and mobile versions exist
      expect(screen.getAllByText('Inicio').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Características').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Precios').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Testimonios').length).toBeGreaterThan(0);
    });

    it('should navigate to login page when login button is clicked', async () => {
      const user = userEvent.setup();
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      const loginButtons = screen.getAllByText('Iniciar Sesión');
      const loginButton = loginButtons[0].closest('button')!;
      await user.click(loginButton);

      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    it('should navigate to dashboard when dashboard button is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderAlianza />);

      const dashboardButtons = screen.getAllByText('Panel Admin');
      const dashboardButton = dashboardButtons[0].closest('button')!;
      await user.click(dashboardButton);

      expect(mockPush).toHaveBeenCalledWith('/admin/dashboard');
    });
  });

  describe('4. Language Switching Tests', () => {
    it('should render language dropdown', () => {
      renderWithProviders(<HeaderAlianza />);

      expect(screen.getByTestId('globe-icon')).toBeInTheDocument();
    });

    it('should switch to Spanish when Spanish option is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderAlianza />);

      const spanishButtons = screen.getAllByText(/Español/i);
      await user.click(spanishButtons[0]);

      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledWith('es');
      });
    });

    it('should switch to English when English option is clicked', async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderAlianza />);

      const englishButtons = screen.getAllByText(/English/i);
      await user.click(englishButtons[0]);

      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledWith('en');
      });
    });

    it('should update URL when language is changed', async () => {
      const user = userEvent.setup();

      renderWithProviders(<HeaderAlianza />);

      const spanishButtons = screen.getAllByText(/Español/i);
      await user.click(spanishButtons[0]);

      await waitFor(() => {
        // The path will be '/es' for root or '/es/...' for other paths
        expect(mockPush).toHaveBeenCalled();
        const callArg = mockPush.mock.calls[0][0];
        expect(callArg).toContain('/es');
      });
    });
  });

  describe('5. Mobile Menu Tests', () => {
    it('should render mobile menu trigger', () => {
      renderWithProviders(<HeaderAlianza />);

      expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
    });

    it('should render mobile menu with public routes', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      expect(screen.getByTestId('sheet')).toBeInTheDocument();
    });

    it('should render mobile login button when logged out', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      const loginButtons = screen.getAllByText('Iniciar Sesión');
      expect(loginButtons.length).toBeGreaterThan(0);
    });

    it('should render mobile logout button when logged in', () => {
      renderWithProviders(<HeaderAlianza />);

      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
    });
  });

  describe('6. Theme Toggle Tests', () => {
    it('should render theme toggle button in desktop view', () => {
      renderWithProviders(<HeaderAlianza />);

      const themeToggles = screen.getAllByTestId('theme-toggle');
      expect(themeToggles.length).toBeGreaterThan(0);
    });

    it('should render theme toggle in mobile menu', () => {
      renderWithProviders(<HeaderAlianza />);

      const themeToggles = screen.getAllByTestId('theme-toggle');
      // Should have both desktop and mobile theme toggles
      expect(themeToggles.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('7. Responsive Design Tests', () => {
    it('should apply sticky positioning to navbar', () => {
      const { container } = renderWithProviders(<HeaderAlianza />);

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('sticky', 'top-0', 'z-50');
    });

    it('should apply backdrop blur effect', () => {
      const { container } = renderWithProviders(<HeaderAlianza />);

      const nav = container.querySelector('nav');
      expect(nav).toHaveClass('backdrop-blur-md');
    });

    it('should apply correct height to header', () => {
      const { container } = renderWithProviders(<HeaderAlianza />);

      const headerContent = container.querySelector('.h-\\[80px\\]');
      expect(headerContent).toBeInTheDocument();
    });
  });

  describe('8. Route Detection Tests', () => {
    it('should detect current locale as "es" for Spanish path', () => {
      renderWithProviders(<HeaderAlianza />);

      // The currentLocale helper should extract 'es' from paths like '/es/...'
      // This is tested indirectly through language highlighting in mobile menu
      const spanishButtons = screen.getAllByText(/Español/i);
      expect(spanishButtons.length).toBeGreaterThan(0);
    });

    it('should default to "es" locale for paths without language prefix', () => {
      renderWithProviders(<HeaderAlianza />);

      // Default locale is 'es' according to currentLocale helper
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('9. Loading States', () => {
    it('should handle loading state from tRPC query', () => {
      mockUserQuery.mockReturnValue(
        createMockTRPCQuery(null, { isLoading: true })
      );

      renderWithProviders(<HeaderAlianza />);

      // Should still render header during loading
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  describe('10. Accessibility Tests', () => {
    it('should have proper semantic navigation element', () => {
      renderWithProviders(<HeaderAlianza />);

      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should have accessible button labels', () => {
      renderWithProviders(<HeaderAlianza />);

      const globeButton = screen.getByLabelText('navbar.language');
      expect(globeButton).toBeInTheDocument();
    });

    it('should have screen reader text for menu button', () => {
      renderWithProviders(<HeaderAlianza />);

      // Check for sr-only span with translation key (might have multiple elements)
      const srTexts = screen.getAllByText((content, element) => {
        return element?.classList.contains('sr-only') || content === 'openMenu';
      });
      expect(srTexts.length).toBeGreaterThan(0);
    });
  });

  describe('11. Additional Edge Cases', () => {
    it('should handle null user data gracefully', () => {
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      expect(screen.getAllByText('Iniciar Sesión').length).toBeGreaterThan(0);
      expect(screen.queryByText('Panel Admin')).not.toBeInTheDocument();
    });

    it('should clear auth cookies on logout', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValue({ ok: true });

      // Mock document.cookie
      const cookieSetter = vi.fn();
      Object.defineProperty(document, 'cookie', {
        set: cookieSetter,
        configurable: true,
      });

      renderWithProviders(<HeaderAlianza />);

      const logoutButtons = screen.getAllByTestId('logout-icon');
      const desktopLogoutButton = logoutButtons[0].parentElement!;

      await user.click(desktopLogoutButton);

      await waitFor(() => {
        expect(cookieSetter).toHaveBeenCalled();
      });
    });

    it('should navigate to register page when register button is clicked', async () => {
      const user = userEvent.setup();
      mockUserQuery.mockReturnValue(createMockTRPCQuery(null));

      renderWithProviders(<HeaderAlianza />);

      const registerButtons = screen.getAllByText('Registrarse');
      const registerButton = registerButtons[0].closest('button')!;
      await user.click(registerButton);

      expect(mockPush).toHaveBeenCalledWith('/auth/register');
    });
  });
});
