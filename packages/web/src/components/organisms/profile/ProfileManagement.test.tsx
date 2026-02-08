import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfileManagement } from './ProfileManagement';
import type { TabLabels } from './ProfileManagement.types';

// Mock fetch globally
global.fetch = vi.fn();

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock TranslationsContext
vi.mock('@/context/TranslationsContext', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock child organisms
vi.mock('@/components/organisms/profile', () => ({
  ProfileFormClientOrganism: vi.fn(({ onSuccess }: any) => (
    <div data-testid="client-form">
      <button onClick={onSuccess}>Save Profile</button>
    </div>
  )),
  ProfileFormEmployeeOrganism: vi.fn(({ onSuccess }: any) => (
    <div data-testid="employee-form">
      <button onClick={onSuccess}>Save Profile</button>
    </div>
  )),
}));

describe('ProfileManagement', () => {
  const defaultTabLabels: TabLabels = {
    info: 'Profile Information',
    security: 'Security',
    preferences: 'Preferences',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockClear();
  });

  describe('Rendering and Loading States', () => {
    it('should render loading state initially', () => {
      (global.fetch as any).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      expect(screen.getByText('Loading profile...')).toBeInTheDocument();
    });

    it('should render error state when profile fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(screen.getByText('Failed to fetch profile')).toBeInTheDocument();
      });
    });

    it('should redirect to login when unauthorized', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({}),
      });

      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login');
      });
    });

    it('should render tabs after successful profile load', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
        }),
      });

      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(screen.getByText('Profile Information')).toBeInTheDocument();
        expect(screen.getByText('Security')).toBeInTheDocument();
        expect(screen.getByText('Preferences')).toBeInTheDocument();
      });
    });
  });

  describe('Tab Navigation', () => {
    beforeEach(async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
        }),
      });
    });

    it('should show profile tab by default', async () => {
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(screen.getByTestId('client-form')).toBeInTheDocument();
      });
    });

    it('should switch to security tab when clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(screen.getByText('Security')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Security'));

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Change Password' })).toBeInTheDocument();
      });
    });

    it('should switch to preferences tab when clicked', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(screen.getByText('Preferences')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Preferences'));

      await waitFor(() => {
        expect(screen.getByText('User Preferences')).toBeInTheDocument();
      });
    });
  });

  describe('Role-Based Form Rendering', () => {
    it('should render client form for CLIENT role', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'client@example.com',
          firstname: 'John',
          lastname: 'Client',
          role: 'CLIENT',
        }),
      });

      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(screen.getByTestId('client-form')).toBeInTheDocument();
      });
    });

    it('should render employee form for EMPLOYEE role', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '2',
          email: 'employee@example.com',
          firstname: 'Jane',
          lastname: 'Employee',
          role: 'EMPLOYEE',
        }),
      });

      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(screen.getByTestId('employee-form')).toBeInTheDocument();
      });
    });

    it('should render employee form for ADMIN role', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '3',
          email: 'admin@example.com',
          firstname: 'Admin',
          lastname: 'User',
          role: 'ADMIN',
        }),
      });

      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        expect(screen.getByTestId('employee-form')).toBeInTheDocument();
      });
    });
  });

  describe('Password Change Functionality', () => {
    beforeEach(async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
        }),
      });
    });

    it('should validate password match', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => screen.getByText('Security'));
      await user.click(screen.getByText('Security'));

      const currentPasswordInput = screen.getByLabelText('Current Password');
      const newPasswordInput = screen.getByLabelText('New Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

      await user.type(currentPasswordInput, 'oldpassword123');
      await user.type(newPasswordInput, 'newpassword123');
      await user.type(confirmPasswordInput, 'differentpassword');

      const submitButton = screen.getByRole('button', { name: /Change Password/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
      });
    });

    it('should validate password length', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => screen.getByText('Security'));
      await user.click(screen.getByText('Security'));

      const currentPasswordInput = screen.getByLabelText('Current Password');
      const newPasswordInput = screen.getByLabelText('New Password');
      const confirmPasswordInput = screen.getByLabelText('Confirm New Password');

      await user.type(currentPasswordInput, 'oldpassword123');
      await user.type(newPasswordInput, 'short');
      await user.type(confirmPasswordInput, 'short');

      const submitButton = screen.getByRole('button', { name: /Change Password/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Password must be at least 8 characters long')
        ).toBeInTheDocument();
      });
    });

    it('should successfully change password', async () => {
      const user = userEvent.setup();
      const onPasswordChanged = vi.fn();

      (global.fetch as any).mockImplementation((url: string) => {
        if (url === '/api/users/change-password') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ message: 'Password changed successfully' }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: '1',
            email: 'test@example.com',
            firstname: 'John',
            lastname: 'Doe',
            role: 'CLIENT',
          }),
        });
      });

      render(
        <ProfileManagement
          tabLabels={defaultTabLabels}
          onPasswordChanged={onPasswordChanged}
        />
      );

      await waitFor(() => screen.getByText('Security'));
      await user.click(screen.getByText('Security'));

      await user.type(screen.getByLabelText('Current Password'), 'oldpassword123');
      await user.type(screen.getByLabelText('New Password'), 'newpassword123');
      await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123');

      const submitButton = screen.getByRole('button', { name: /Change Password/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Password changed successfully')).toBeInTheDocument();
        expect(onPasswordChanged).toHaveBeenCalledTimes(1);
      });
    });

    it('should handle password change error', async () => {
      const user = userEvent.setup();

      (global.fetch as any).mockImplementation((url: string) => {
        if (url === '/api/users/change-password') {
          return Promise.resolve({
            ok: false,
            json: async () => ({ message: 'Current password is incorrect' }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: '1',
            email: 'test@example.com',
            firstname: 'John',
            lastname: 'Doe',
            role: 'CLIENT',
          }),
        });
      });

      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => screen.getByText('Security'));
      await user.click(screen.getByText('Security'));

      await user.type(screen.getByLabelText('Current Password'), 'wrongpassword');
      await user.type(screen.getByLabelText('New Password'), 'newpassword123');
      await user.type(screen.getByLabelText('Confirm New Password'), 'newpassword123');

      const submitButton = screen.getByRole('button', { name: /Change Password/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Current password is incorrect')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Preferences Functionality', () => {
    beforeEach(async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
        }),
      });
    });

    it('should toggle email notifications', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => screen.getByText('Preferences'));
      await user.click(screen.getByText('Preferences'));

      const emailNotificationsSwitch = screen.getByRole('switch', {
        name: /Email Notifications/i,
      });

      // Should be enabled by default
      expect(emailNotificationsSwitch).toBeChecked();

      await user.click(emailNotificationsSwitch);

      // Should be disabled after click
      expect(emailNotificationsSwitch).not.toBeChecked();
    });

    it('should toggle marketing emails', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => screen.getByText('Preferences'));
      await user.click(screen.getByText('Preferences'));

      const marketingEmailsSwitch = screen.getByRole('switch', {
        name: /Marketing Emails/i,
      });

      // Should be disabled by default
      expect(marketingEmailsSwitch).not.toBeChecked();

      await user.click(marketingEmailsSwitch);

      // Should be enabled after click
      expect(marketingEmailsSwitch).toBeChecked();
    });

    it('should change theme preference', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => screen.getByText('Preferences'));
      await user.click(screen.getByText('Preferences'));

      const themeSelect = screen.getByLabelText('Theme');

      // Default should be 'system'
      expect(themeSelect).toHaveValue('system');

      await user.selectOptions(themeSelect, 'dark');

      expect(themeSelect).toHaveValue('dark');
    });

    it('should successfully save preferences', async () => {
      const user = userEvent.setup();
      const onPreferencesUpdated = vi.fn();

      (global.fetch as any).mockImplementation((url: string) => {
        if (url === '/api/users/preferences') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ message: 'Preferences updated successfully' }),
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({
            id: '1',
            email: 'test@example.com',
            firstname: 'John',
            lastname: 'Doe',
            role: 'CLIENT',
          }),
        });
      });

      render(
        <ProfileManagement
          tabLabels={defaultTabLabels}
          onPreferencesUpdated={onPreferencesUpdated}
        />
      );

      await waitFor(() => screen.getByText('Preferences'));
      await user.click(screen.getByText('Preferences'));

      const submitButton = screen.getByRole('button', { name: /Save Preferences/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Preferences updated successfully')).toBeInTheDocument();
        expect(onPreferencesUpdated).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Callback Handlers', () => {
    it('should call onProfileUpdated when profile is updated', async () => {
      const onProfileUpdated = vi.fn();

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
        }),
      });

      render(
        <ProfileManagement
          tabLabels={defaultTabLabels}
          onProfileUpdated={onProfileUpdated}
        />
      );

      await waitFor(() => screen.getByTestId('client-form'));

      const saveButton = screen.getByText('Save Profile');
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(onProfileUpdated).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: '1',
          email: 'test@example.com',
          firstname: 'John',
          lastname: 'Doe',
          role: 'CLIENT',
        }),
      });
    });

    it('should have proper ARIA labels for tabs', async () => {
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => {
        const tablist = screen.getByRole('tablist');
        expect(tablist).toBeInTheDocument();
      });
    });

    it('should have proper labels for form inputs in security tab', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => screen.getByText('Security'));
      await user.click(screen.getByText('Security'));

      expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    });

    it('should have proper labels for switches in preferences tab', async () => {
      const user = userEvent.setup();
      render(<ProfileManagement tabLabels={defaultTabLabels} />);

      await waitFor(() => screen.getByText('Preferences'));
      await user.click(screen.getByText('Preferences'));

      expect(screen.getByLabelText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByLabelText('Marketing Emails')).toBeInTheDocument();
    });
  });
});
