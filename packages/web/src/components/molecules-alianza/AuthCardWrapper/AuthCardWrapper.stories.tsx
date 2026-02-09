import type { Meta, StoryObj } from '@storybook/react';
import { AuthCardWrapper } from './AuthCardWrapper';
import { Typography } from '@/components/atoms-alianza/Typography';

const meta = {
  title: 'Molecules/AuthCardWrapper',
  component: AuthCardWrapper,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A specialized card wrapper for authentication forms with branding, navigation, and responsive layout. Part of the Alianza Design System.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Main title/heading for the auth card',
    },
    subtitle: {
      control: 'text',
      description: 'Optional subtitle or description text',
    },
    icon: {
      control: 'text',
      description: 'Optional icon name (from Icon component)',
    },
    showLogo: {
      control: 'boolean',
      description: 'Whether to show the Alianza logo',
    },
    logoAlt: {
      control: 'text',
      description: 'Custom logo alt text',
    },
    backButtonLabel: {
      control: 'text',
      description: 'Label for the back button',
    },
    backButtonHref: {
      control: 'text',
      description: 'URL to navigate to when back button is clicked',
    },
    showSocial: {
      control: 'boolean',
      description: 'Whether to show social auth section',
    },
    socialDividerText: {
      control: 'text',
      description: 'Text for the divider above social auth',
    },
    socialPlaceholderText: {
      control: 'text',
      description: 'Placeholder text for social auth buttons',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the card is in a loading state',
    },
    disableResponsive: {
      control: 'boolean',
      description: 'Disable responsive behavior',
    },
  },
} satisfies Meta<typeof AuthCardWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample form component for demonstrations
const LoginForm = () => (
  <form className="flex flex-col gap-4 w-full">
    <div>
      <label htmlFor="email" className="text-sm font-medium block mb-2">
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="you@example.com"
        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
      />
    </div>
    <div>
      <label htmlFor="password" className="text-sm font-medium block mb-2">
        Password
      </label>
      <input
        id="password"
        type="password"
        placeholder="••••••••"
        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
    >
      Sign In
    </button>
  </form>
);

const RegisterForm = () => (
  <form className="flex flex-col gap-4 w-full">
    <div>
      <label htmlFor="name" className="text-sm font-medium block mb-2">
        Full Name
      </label>
      <input
        id="name"
        type="text"
        placeholder="John Doe"
        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
      />
    </div>
    <div>
      <label htmlFor="reg-email" className="text-sm font-medium block mb-2">
        Email
      </label>
      <input
        id="reg-email"
        type="email"
        placeholder="you@example.com"
        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
      />
    </div>
    <div>
      <label htmlFor="reg-password" className="text-sm font-medium block mb-2">
        Password
      </label>
      <input
        id="reg-password"
        type="password"
        placeholder="••••••••"
        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
    >
      Create Account
    </button>
  </form>
);

const ForgotPasswordForm = () => (
  <form className="flex flex-col gap-4 w-full">
    <div>
      <label htmlFor="forgot-email" className="text-sm font-medium block mb-2">
        Email Address
      </label>
      <input
        id="forgot-email"
        type="email"
        placeholder="you@example.com"
        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
      />
    </div>
    <button
      type="submit"
      className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
    >
      Send Reset Link
    </button>
  </form>
);

// 1. Login Card
export const LoginCard: Story = {
  args: {
    title: 'Welcome Back',
    subtitle: 'Sign in to continue to Alianza',
    icon: 'lock',
    showLogo: true,
    backButtonLabel: 'Back to home',
    backButtonHref: '/',
    footer: (
      <Typography variant="span" size="sm" color="muted">
        Don't have an account?{' '}
        <a href="/register" className="text-primary hover:underline">
          Sign up
        </a>
      </Typography>
    ),
    children: <LoginForm />,
  },
};

// 2. Register Card
export const RegisterCard: Story = {
  args: {
    title: 'Create Account',
    subtitle: 'Join Alianza today',
    icon: 'userPlus',
    showLogo: true,
    backButtonLabel: 'Back to login',
    backButtonHref: '/auth/login',
    showSocial: true,
    footer: (
      <Typography variant="span" size="sm" color="muted">
        Already have an account?{' '}
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </Typography>
    ),
    children: <RegisterForm />,
  },
};

// 3. Forgot Password Card
export const ForgotPasswordCard: Story = {
  args: {
    title: 'Reset Password',
    subtitle: 'Enter your email to receive a reset link',
    icon: 'mail',
    showLogo: true,
    backButtonLabel: 'Back to login',
    backButtonHref: '/auth/login',
    footer: (
      <Typography variant="span" size="sm" color="muted">
        Remember your password?{' '}
        <a href="/login" className="text-primary hover:underline">
          Sign in
        </a>
      </Typography>
    ),
    children: <ForgotPasswordForm />,
  },
};

// 4. New Password Card
export const NewPasswordCard: Story = {
  args: {
    title: 'Set New Password',
    subtitle: 'Choose a strong password for your account',
    icon: 'key',
    showLogo: true,
    backButtonLabel: 'Back to login',
    backButtonHref: '/auth/login',
    children: (
      <form className="flex flex-col gap-4 w-full">
        <div>
          <label htmlFor="new-password" className="text-sm font-medium block mb-2">
            New Password
          </label>
          <input
            id="new-password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="confirm-password" className="text-sm font-medium block mb-2">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Update Password
        </button>
      </form>
    ),
  },
};

// 5. With Logo Only
export const WithLogoOnly: Story = {
  args: {
    title: 'Welcome',
    subtitle: 'Enter your credentials',
    showLogo: true,
    children: <LoginForm />,
  },
};

// 6. Without Logo
export const WithoutLogo: Story = {
  args: {
    title: 'Sign In',
    subtitle: 'Access your account',
    icon: 'lock',
    showLogo: false,
    children: <LoginForm />,
  },
};

// 7. Loading State
export const LoadingState: Story = {
  args: {
    title: 'Welcome Back',
    subtitle: 'Signing you in...',
    icon: 'lock',
    showLogo: true,
    isLoading: true,
    children: <LoginForm />,
  },
};

// 8. With Footer Links
export const WithFooterLinks: Story = {
  args: {
    title: 'Sign In',
    subtitle: 'Welcome back to Alianza',
    showLogo: true,
    footer: (
      <div className="flex flex-col gap-2 text-center">
        <Typography variant="span" size="sm" color="muted">
          Don't have an account?{' '}
          <a href="/register" className="text-primary hover:underline">
            Sign up
          </a>
        </Typography>
        <Typography variant="span" size="sm" color="muted">
          <a href="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </a>
        </Typography>
      </div>
    ),
    children: <LoginForm />,
  },
};

// 9. Mobile View
export const MobileView: Story = {
  args: {
    title: 'Welcome Back',
    subtitle: 'Sign in to continue',
    icon: 'lock',
    showLogo: true,
    backButtonLabel: 'Back to home',
    backButtonHref: '/',
    footer: (
      <Typography variant="span" size="sm" color="muted">
        Don't have an account?{' '}
        <a href="/register" className="text-primary hover:underline">
          Sign up
        </a>
      </Typography>
    ),
    children: <LoginForm />,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// 10. Complex Example (All Features)
export const ComplexExample: Story = {
  args: {
    title: 'Welcome to Alianza',
    subtitle: 'Sign in to access your dashboard',
    icon: 'shield',
    showLogo: true,
    backButtonLabel: 'Back to home',
    backButtonHref: '/',
    showSocial: true,
    socialDividerText: 'Or sign in with',
    socialPlaceholderText: 'Google, GitHub, and more coming soon',
    footer: (
      <div className="flex flex-col gap-3 text-center w-full">
        <Typography variant="span" size="sm" color="muted">
          Don't have an account?{' '}
          <a href="/register" className="text-primary hover:underline font-medium">
            Sign up for free
          </a>
        </Typography>
        <div className="flex items-center justify-center gap-4 text-xs">
          <a href="/terms" className="text-muted-foreground hover:text-primary">
            Terms
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="/privacy" className="text-muted-foreground hover:text-primary">
            Privacy
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="/help" className="text-muted-foreground hover:text-primary">
            Help
          </a>
        </div>
      </div>
    ),
    children: <LoginForm />,
  },
};

// 11. Minimal Setup
export const MinimalSetup: Story = {
  args: {
    title: 'Sign In',
    children: <LoginForm />,
  },
};

// 12. No Responsive (Desktop Only)
export const NoResponsive: Story = {
  args: {
    title: 'Welcome Back',
    subtitle: 'Sign in to continue',
    showLogo: true,
    disableResponsive: true,
    children: <LoginForm />,
  },
};

// 13. With Social Auth
export const WithSocialAuth: Story = {
  args: {
    title: 'Sign In',
    subtitle: 'Choose your preferred method',
    showLogo: true,
    showSocial: true,
    socialDividerText: 'Or continue with email',
    socialPlaceholderText: 'Social login providers will be added soon',
    children: <LoginForm />,
  },
};

// 14. Custom Social Text
export const CustomSocialText: Story = {
  args: {
    title: 'Join Alianza',
    subtitle: 'Create your free account',
    showLogo: true,
    showSocial: true,
    socialDividerText: 'Or use your email',
    socialPlaceholderText: 'Google • GitHub • Microsoft (Coming Soon)',
    children: <RegisterForm />,
  },
};

// 15. Error State Example
export const ErrorStateExample: Story = {
  args: {
    title: 'Sign In',
    subtitle: 'Welcome back',
    icon: 'alertCircle',
    showLogo: true,
    children: (
      <form className="flex flex-col gap-4 w-full">
        <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
          <Typography variant="span" size="sm" color="destructive" className="font-medium">
            Invalid credentials. Please try again.
          </Typography>
        </div>
        <div>
          <label htmlFor="error-email" className="text-sm font-medium block mb-2">
            Email
          </label>
          <input
            id="error-email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-3 py-2 border border-destructive rounded-lg bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="error-password" className="text-sm font-medium block mb-2">
            Password
          </label>
          <input
            id="error-password"
            type="password"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-destructive rounded-lg bg-background text-foreground"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </form>
    ),
    footer: (
      <Typography variant="span" size="sm" color="muted">
        <a href="/forgot-password" className="text-primary hover:underline">
          Forgot your password?
        </a>
      </Typography>
    ),
  },
};
