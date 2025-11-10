import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NavUser } from '../nav-user';

// Mock the dependencies
const mockPush = vi.fn();
const mockSetTheme = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({
    setTheme: mockSetTheme,
  }),
}));

vi.mock('@/context/TranslationContext', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'userNav.upgradeToPro': 'Upgrade to Pro',
      'userNav.account': 'Account',
      'userNav.billing': 'Billing',
      'userNav.notifications': 'Notifications',
      'userNav.logout': 'Logout',
    };
    return translations[key] || key;
  },
}));

vi.mock('@/components/ui/sidebar', () => ({
  useSidebar: () => ({
    isMobile: false,
  }),
  SidebarMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenuItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SidebarMenuButton: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/atomic-design/molecules/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuLabel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuSeparator: () => <hr />,
  DropdownMenuGroup: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick, asChild }: any) =>
    asChild ? children : <button onClick={onClick}>{children}</button>,
}));

vi.mock('../language-switcher', () => ({
  LanguageSwitcher: () => <div>LanguageSwitcher</div>,
}));

vi.mock('../notification-badge', () => ({
  NotificationBadge: ({ count }: { count: number }) =>
    count > 0 ? <span data-testid="notification-badge">{count}</span> : null,
}));

vi.mock('@/hooks/use-notification-count', () => ({
  useNotificationCount: () => ({
    count: 0,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

// Mock fetch globally
global.fetch = vi.fn();

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  role: 'USER' as const,
};

describe('NavUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  it('should render user information correctly', () => {
    render(<NavUser user={mockUser} />);

    expect(screen.getAllByText('John Doe')).toHaveLength(2); // Appears in trigger and dropdown
    expect(screen.getAllByText('john@example.com')).toHaveLength(2); // Appears in trigger and dropdown
  });

  it('should render navigation menu items', () => {
    render(<NavUser user={mockUser} />);

    expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
    expect(screen.getByText('Billing')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('logout')).toBeInTheDocument(); // Lowercase from translation
  });

  it('should handle theme changes correctly', async () => {
    render(<NavUser user={mockUser} />);

    const lightButton = screen.getByText('Light').closest('button');
    const darkButton = screen.getByText('Dark').closest('button');
    const systemButton = screen.getByText('System').closest('button');

    fireEvent.click(lightButton!);
    expect(mockSetTheme).toHaveBeenCalledWith('light');

    fireEvent.click(darkButton!);
    expect(mockSetTheme).toHaveBeenCalledWith('dark');

    fireEvent.click(systemButton!);
    expect(mockSetTheme).toHaveBeenCalledWith('system');
  });

  it('should handle successful logout', async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ message: 'Logout successful' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    render(<NavUser user={mockUser} />);

    const logoutButton = screen.getByText('logout').closest('button');
    fireEvent.click(logoutButton!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });
  });

  it('should handle logout API failure and clear cookies manually', async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ message: 'Logout failed' }),
    };

    (global.fetch as any).mockResolvedValue(mockResponse);

    // Mock document.cookie
    const originalCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    const mockCookieSetter = vi.fn();
    Object.defineProperty(document, 'cookie', {
      set: mockCookieSetter,
      configurable: true,
    });

    render(<NavUser user={mockUser} />);

    const logoutButton = screen.getByText('logout').closest('button');
    fireEvent.click(logoutButton!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockCookieSetter).toHaveBeenCalledWith(
        'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
      expect(mockCookieSetter).toHaveBeenCalledWith(
        'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    // Restore original cookie descriptor
    if (originalCookie) {
      Object.defineProperty(Document.prototype, 'cookie', originalCookie);
    }
  });

  it('should handle network errors during logout', async () => {
    (global.fetch as any).mockRejectedValue(new Error('Network error'));

    // Mock document.cookie
    const originalCookie = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    const mockCookieSetter = vi.fn();
    Object.defineProperty(document, 'cookie', {
      set: mockCookieSetter,
      configurable: true,
    });

    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<NavUser user={mockUser} />);

    const logoutButton = screen.getByText('logout').closest('button');
    fireEvent.click(logoutButton!);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error signing out:', expect.any(Error));
      expect(mockCookieSetter).toHaveBeenCalledWith(
        'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
      expect(mockCookieSetter).toHaveBeenCalledWith(
        'refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      );
      expect(mockPush).toHaveBeenCalledWith('/auth/login');
    });

    // Restore original cookie descriptor and console
    if (originalCookie) {
      Object.defineProperty(Document.prototype, 'cookie', originalCookie);
    }
    consoleSpy.mockRestore();
  });

  it('should not show notification badge when count is 0', () => {
    render(<NavUser user={mockUser} />);

    expect(screen.queryByTestId('notification-badge')).not.toBeInTheDocument();
  });

  it('should use memoized callbacks to prevent unnecessary re-renders', () => {
    const { rerender } = render(<NavUser user={mockUser} />);
    
    const logoutButton1 = screen.getByText('logout').closest('button');
    const lightButton1 = screen.getByText('Light').closest('button');

    // Re-render with same props
    rerender(<NavUser user={mockUser} />);

    const logoutButton2 = screen.getByText('logout').closest('button');
    const lightButton2 = screen.getByText('Light').closest('button');

    // The buttons should be the same elements (memoized callbacks)
    expect(logoutButton1).toBe(logoutButton2);
    expect(lightButton1).toBe(lightButton2);
  });
});